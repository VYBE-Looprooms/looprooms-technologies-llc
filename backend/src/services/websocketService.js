const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class WebSocketService {
  constructor() {
    this.wss = null;
    this.connections = new Map(); // userId -> WebSocket connection
    this.sessionRooms = new Map(); // sessionId -> Set of userIds
  }

  initialize(server) {
    this.wss = new WebSocket.Server({
      server,
      path: '/ws',
      verifyClient: async (info) => {
        try {
          const url = new URL(info.req.url, `http://${info.req.headers.host}`);
          const token = url.searchParams.get('token');

          if (!token) {
            return false;
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          info.req.user = decoded;
          return true;
        } catch (error) {
          console.error('WebSocket auth error:', error);
          return false;
        }
      }
    });

    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    console.log('🔌 WebSocket service initialized on /ws');
  }

  handleConnection(ws, req) {
    const user = req.user;
    const userId = user.id;

    console.log(`👤 User ${userId} connected via WebSocket`);

    // Store connection
    this.connections.set(userId, ws);

    // Handle incoming messages
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        await this.handleMessage(ws, userId, message);
      } catch (error) {
        console.error('WebSocket message error:', error);
        this.sendError(ws, 'Invalid message format');
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log(`👤 User ${userId} disconnected`);
      this.connections.delete(userId);

      // Remove from all session rooms
      for (const [sessionId, userIds] of this.sessionRooms.entries()) {
        userIds.delete(userId);
        if (userIds.size === 0) {
          this.sessionRooms.delete(sessionId);
        }
      }
    });

    // Send welcome message
    this.sendMessage(ws, {
      type: 'welcome',
      data: { userId, message: 'Connected to VYBE WebSocket' }
    });
  }

  async handleMessage(ws, userId, message) {
    const { type, data } = message;

    switch (type) {
      case 'join_session':
        await this.handleJoinSession(userId, data.sessionId);
        break;

      case 'leave_session':
        await this.handleLeaveSession(userId, data.sessionId);
        break;

      case 'session_comment':
        await this.handleSessionComment(userId, data);
        break;

      case 'session_reaction':
        await this.handleSessionReaction(userId, data);
        break;

      case 'ping':
        this.sendMessage(ws, { type: 'pong', data: { timestamp: Date.now() } });
        break;

      default:
        this.sendError(ws, `Unknown message type: ${type}`);
    }
  }

  async handleJoinSession(userId, sessionId) {
    try {
      // Verify session exists and is active
      const session = await prisma.liveSession.findUnique({
        where: { id: sessionId },
        include: {
          looproom: {
            select: { title: true }
          }
        }
      });

      if (!session) {
        this.sendToUser(userId, {
          type: 'error',
          data: { message: 'Session not found' }
        });
        return;
      }

      if (session.status !== 'ACTIVE') {
        this.sendToUser(userId, {
          type: 'error',
          data: { message: 'Session is not active' }
        });
        return;
      }

      // Add user to session room
      if (!this.sessionRooms.has(sessionId)) {
        this.sessionRooms.set(sessionId, new Set());
      }
      this.sessionRooms.get(sessionId).add(userId);

      // Notify user they joined
      this.sendToUser(userId, {
        type: 'session_joined',
        data: {
          sessionId,
          sessionTitle: session.title,
          looproomTitle: session.looproom.title
        }
      });

      // Notify other participants
      this.broadcastToSession(sessionId, {
        type: 'user_joined_session',
        data: { userId, sessionId }
      }, userId);

      console.log(`👤 User ${userId} joined session ${sessionId} via WebSocket`);
    } catch (error) {
      console.error('Join session error:', error);
      this.sendToUser(userId, {
        type: 'error',
        data: { message: 'Failed to join session' }
      });
    }
  }

  async handleLeaveSession(userId, sessionId) {
    try {
      // Remove user from session room
      if (this.sessionRooms.has(sessionId)) {
        this.sessionRooms.get(sessionId).delete(userId);

        if (this.sessionRooms.get(sessionId).size === 0) {
          this.sessionRooms.delete(sessionId);
        }
      }

      // Notify user they left
      this.sendToUser(userId, {
        type: 'session_left',
        data: { sessionId }
      });

      // Notify other participants
      this.broadcastToSession(sessionId, {
        type: 'user_left_session',
        data: { userId, sessionId }
      }, userId);

      console.log(`👤 User ${userId} left session ${sessionId} via WebSocket`);
    } catch (error) {
      console.error('Leave session error:', error);
    }
  }

  async handleSessionComment(userId, data) {
    try {
      const { sessionId, content, isAnonymous = false } = data;

      // Verify user is in the session
      if (!this.sessionRooms.has(sessionId) || !this.sessionRooms.get(sessionId).has(userId)) {
        this.sendToUser(userId, {
          type: 'error',
          data: { message: 'You are not in this session' }
        });
        return;
      }

      // Get user info for the comment
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              displayName: true,
              avatarUrl: true
            }
          }
        }
      });

      // Create the comment in database
      const comment = await prisma.sessionComment.create({
        data: {
          sessionId,
          userId,
          content,
          isAnonymous
        }
      });

      // Broadcast comment to all session participants
      const commentData = {
        id: comment.id,
        content: comment.content,
        isAnonymous: comment.isAnonymous,
        createdAt: comment.createdAt,
        user: isAnonymous ? null : user
      };

      this.broadcastToSession(sessionId, {
        type: 'new_comment',
        data: {
          sessionId,
          comment: commentData
        }
      });

      console.log(`💬 Comment added to session ${sessionId} by user ${userId}`);
    } catch (error) {
      console.error('Session comment error:', error);
      this.sendToUser(userId, {
        type: 'error',
        data: { message: 'Failed to add comment' }
      });
    }
  }

  async handleSessionReaction(userId, data) {
    try {
      const { sessionId, type: reactionType, targetType, targetId } = data;

      // Verify user is in the session
      if (!this.sessionRooms.has(sessionId) || !this.sessionRooms.get(sessionId).has(userId)) {
        this.sendToUser(userId, {
          type: 'error',
          data: { message: 'You are not in this session' }
        });
        return;
      }

      // Handle different reaction targets
      if (targetType === 'comment') {
        // React to a comment
        const reaction = await prisma.commentReaction.upsert({
          where: {
            commentId_userId_type: {
              commentId: targetId,
              userId,
              type: reactionType
            }
          },
          create: {
            commentId: targetId,
            userId,
            type: reactionType
          },
          update: {
            type: reactionType
          }
        });

        // Update comment reaction count
        await prisma.sessionComment.update({
          where: { id: targetId },
          data: {
            reactionCount: {
              increment: 1
            }
          }
        });

        // Broadcast reaction to session
        this.broadcastToSession(sessionId, {
          type: 'comment_reaction',
          data: {
            sessionId,
            commentId: targetId,
            reactionType,
            userId
          }
        });
      }

      console.log(`👍 Reaction ${reactionType} added to ${targetType} ${targetId} in session ${sessionId}`);
    } catch (error) {
      console.error('Session reaction error:', error);
      this.sendToUser(userId, {
        type: 'error',
        data: { message: 'Failed to add reaction' }
      });
    }
  }

  // Send message to a specific user
  sendToUser(userId, message) {
    const connection = this.connections.get(userId);
    if (connection && connection.readyState === WebSocket.OPEN) {
      this.sendMessage(connection, message);
    }
  }

  // Broadcast message to all users in a session
  broadcastToSession(sessionId, message, excludeUserId = null) {
    const userIds = this.sessionRooms.get(sessionId);
    if (!userIds) return;

    for (const userId of userIds) {
      if (userId !== excludeUserId) {
        this.sendToUser(userId, message);
      }
    }
  }

  // Send message through WebSocket connection
  sendMessage(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  // Send error message
  sendError(ws, errorMessage) {
    this.sendMessage(ws, {
      type: 'error',
      data: { message: errorMessage }
    });
  }

  // Broadcast session updates (for external use)
  notifySessionUpdate(sessionId, updateType, data) {
    this.broadcastToSession(sessionId, {
      type: 'session_update',
      data: {
        sessionId,
        updateType,
        ...data
      }
    });
  }

  // Notify session start/end (for external use)
  notifySessionStatusChange(sessionId, status, data = {}) {
    this.broadcastToSession(sessionId, {
      type: 'session_status_change',
      data: {
        sessionId,
        status,
        ...data
      }
    });
  }

  // Get connection statistics
  getStats() {
    return {
      totalConnections: this.connections.size,
      activeSessions: this.sessionRooms.size,
      sessionsData: Array.from(this.sessionRooms.entries()).map(([sessionId, userIds]) => ({
        sessionId,
        participantCount: userIds.size
      }))
    };
  }
}

module.exports = new WebSocketService();