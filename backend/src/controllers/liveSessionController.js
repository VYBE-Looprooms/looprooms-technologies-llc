const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class LiveSessionController {
  /**
   * Create a new live session for a looproom
   * @route POST /api/sessions
   */
  static async createSession(req, res) {
    try {
      const {
        looproomId,
        title,
        description,
        scheduledStartTime,
        duration = 60,
        maxParticipants = 30,
        allowAnonymous = true,
        requiresApproval = false,
        isRecorded = false
      } = req.body;

      const userId = req.user.id;

      // Check if user is the creator of the looproom or an admin
      const looproom = await prisma.looproom.findUnique({
        where: { id: looproomId },
        select: {
          id: true,
          title: true,
          creatorId: true,
          status: true
        }
      });

      if (!looproom) {
        return res.status(404).json({
          success: false,
          message: 'Looproom not found'
        });
      }

      if (looproom.creatorId !== userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only the looproom creator can start sessions'
        });
      }

      if (looproom.status !== 'PUBLISHED') {
        return res.status(400).json({
          success: false,
          message: 'Cannot create sessions for unpublished looprooms'
        });
      }

      // Create the live session
      const session = await prisma.liveSession.create({
        data: {
          looproomId,
          creatorId: userId,
          title: title || `Live: ${looproom.title}`,
          description,
          scheduledStartTime: new Date(scheduledStartTime),
          duration,
          maxParticipants,
          allowAnonymous,
          requiresApproval,
          isRecorded,
          status: 'SCHEDULED'
        },
        include: {
          looproom: {
            select: {
              id: true,
              title: true,
              category: {
                select: {
                  name: true,
                  slug: true,
                  color: true
                }
              }
            }
          },
          creator: {
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
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Live session created successfully',
        data: session
      });
    } catch (error) {
      console.error('Create session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create session',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Start a scheduled session
   * @route POST /api/sessions/:id/start
   */
  static async startSession(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const session = await prisma.liveSession.findUnique({
        where: { id },
        include: {
          looproom: true,
          creator: true
        }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.creatorId !== userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only the session creator can start sessions'
        });
      }

      if (session.status !== 'SCHEDULED') {
        return res.status(400).json({
          success: false,
          message: `Session is ${session.status.toLowerCase()} and cannot be started`
        });
      }

      const updatedSession = await prisma.liveSession.update({
        where: { id },
        data: {
          status: 'ACTIVE',
          actualStartTime: new Date()
        },
        include: {
          looproom: {
            select: {
              id: true,
              title: true,
              category: {
                select: {
                  name: true,
                  slug: true,
                  color: true
                }
              }
            }
          },
          creator: {
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
          },
          participants: {
            where: { status: 'JOINED' },
            select: {
              id: true,
              isAnonymous: true,
              displayName: true,
              joinedAt: true,
              user: {
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
              }
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Session started successfully',
        data: updatedSession
      });
    } catch (error) {
      console.error('Start session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start session',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * End an active session
   * @route POST /api/sessions/:id/end
   */
  static async endSession(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const session = await prisma.liveSession.findUnique({
        where: { id }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.creatorId !== userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only the session creator can end sessions'
        });
      }

      if (session.status !== 'ACTIVE') {
        return res.status(400).json({
          success: false,
          message: 'Session is not active'
        });
      }

      const endTime = new Date();
      const actualDuration = session.actualStartTime
        ? Math.round((endTime - session.actualStartTime) / (1000 * 60))
        : null;

      const updatedSession = await prisma.liveSession.update({
        where: { id },
        data: {
          status: 'ENDED',
          endTime,
          actualDuration
        }
      });

      // Update all participants to LEFT status
      await prisma.sessionParticipant.updateMany({
        where: {
          sessionId: id,
          status: 'JOINED'
        },
        data: {
          status: 'LEFT',
          leftAt: endTime
        }
      });

      res.json({
        success: true,
        message: 'Session ended successfully',
        data: updatedSession
      });
    } catch (error) {
      console.error('End session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to end session',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Join a live session
   * @route POST /api/sessions/:id/join
   */
  static async joinSession(req, res) {
    try {
      const { id } = req.params;
      const { isAnonymous = false, displayName } = req.body;
      const userId = req.user.id;

      const session = await prisma.liveSession.findUnique({
        where: { id },
        include: {
          participants: {
            where: { status: 'JOINED' }
          }
        }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      if (session.status !== 'ACTIVE') {
        return res.status(400).json({
          success: false,
          message: 'Session is not active'
        });
      }

      if (session.isLocked) {
        return res.status(400).json({
          success: false,
          message: 'Session is locked and not accepting new participants'
        });
      }

      if (session.participants.length >= session.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Session is full'
        });
      }

      if (!session.allowAnonymous && isAnonymous) {
        return res.status(400).json({
          success: false,
          message: 'Anonymous participation is not allowed in this session'
        });
      }

      // Check if user is already in the session
      const existingParticipant = await prisma.sessionParticipant.findFirst({
        where: {
          sessionId: id,
          userId,
          status: 'JOINED'
        }
      });

      if (existingParticipant) {
        return res.status(400).json({
          success: false,
          message: 'You are already in this session'
        });
      }

      // Join the session
      const participant = await prisma.sessionParticipant.create({
        data: {
          sessionId: id,
          userId,
          isAnonymous,
          displayName: isAnonymous ? displayName : null,
          status: 'JOINED'
        },
        include: {
          user: {
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
          }
        }
      });

      // Update session participant count
      await prisma.liveSession.update({
        where: { id },
        data: {
          currentParticipants: {
            increment: 1
          }
        }
      });

      res.json({
        success: true,
        message: 'Successfully joined session',
        data: participant
      });
    } catch (error) {
      console.error('Join session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to join session',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Leave a live session
   * @route POST /api/sessions/:id/leave
   */
  static async leaveSession(req, res) {
    try {
      const { id } = req.params;
      const { moodAfter } = req.body;
      const userId = req.user.id;

      const participant = await prisma.sessionParticipant.findFirst({
        where: {
          sessionId: id,
          userId,
          status: 'JOINED'
        }
      });

      if (!participant) {
        return res.status(404).json({
          success: false,
          message: 'You are not in this session'
        });
      }

      const leftAt = new Date();
      const totalTimeInSession = Math.round((leftAt - participant.joinedAt) / 1000);

      // Update participant status
      await prisma.sessionParticipant.update({
        where: { id: participant.id },
        data: {
          status: 'LEFT',
          leftAt,
          totalTimeInSession,
          moodAfter: moodAfter ? JSON.stringify(moodAfter) : null
        }
      });

      // Update session participant count
      await prisma.liveSession.update({
        where: { id },
        data: {
          currentParticipants: {
            decrement: 1
          }
        }
      });

      res.json({
        success: true,
        message: 'Successfully left session'
      });
    } catch (error) {
      console.error('Leave session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to leave session',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get session details and participants
   * @route GET /api/sessions/:id
   */
  static async getSession(req, res) {
    try {
      const { id } = req.params;

      const session = await prisma.liveSession.findUnique({
        where: { id },
        include: {
          looproom: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnail: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true
                }
              }
            }
          },
          creator: {
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
          },
          participants: {
            where: { status: 'JOINED' },
            select: {
              id: true,
              isAnonymous: true,
              displayName: true,
              isModerator: true,
              joinedAt: true,
              user: {
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
              }
            }
          },
          comments: {
            where: { isDeleted: false },
            orderBy: { createdAt: 'desc' },
            take: 50,
            select: {
              id: true,
              content: true,
              isAnonymous: true,
              createdAt: true,
              reactionCount: true,
              user: {
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
              }
            }
          }
        }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('Get session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get session',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get active sessions for a looproom
   * @route GET /api/looprooms/:looproomId/sessions/active
   */
  static async getActiveSessionsForLooproom(req, res) {
    try {
      const { looproomId } = req.params;

      const sessions = await prisma.liveSession.findMany({
        where: {
          looproomId,
          status: 'ACTIVE'
        },
        include: {
          creator: {
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
          },
          participants: {
            where: { status: 'JOINED' },
            select: { id: true }
          }
        },
        orderBy: { actualStartTime: 'desc' }
      });

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Get active sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get active sessions',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Add comment to session
   * @route POST /api/sessions/:id/comments
   */
  static async addComment(req, res) {
    try {
      const { id } = req.params;
      const { content, isAnonymous = false } = req.body;
      const userId = req.user.id;

      // Check if user is in the session
      const participant = await prisma.sessionParticipant.findFirst({
        where: {
          sessionId: id,
          userId,
          status: 'JOINED'
        }
      });

      if (!participant) {
        return res.status(403).json({
          success: false,
          message: 'You must be in the session to comment'
        });
      }

      const comment = await prisma.sessionComment.create({
        data: {
          sessionId: id,
          userId,
          content,
          isAnonymous
        },
        include: {
          user: {
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
          }
        }
      });

      // Update participant message count
      await prisma.sessionParticipant.update({
        where: { id: participant.id },
        data: {
          messagesCount: {
            increment: 1
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: comment
      });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add comment',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = LiveSessionController;