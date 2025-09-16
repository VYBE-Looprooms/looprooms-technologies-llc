const { Server } = require('socket.io');
const RealtimeService = require('../services/realtimeService');

const DEFAULT_ROOM = 'lobby';

const sanitizeString = (value) => {
  if (!value) return null;
  return String(value).trim().slice(0, 500);
};

const buildParticipant = ({ participant, socket }) => {
  if (participant && typeof participant === 'object') {
    return {
      id: participant.id ?? null,
      name: sanitizeString(participant.name) || 'Guest',
      avatarUrl: participant.avatarUrl ?? null,
    };
  }

  if (socket?.data?.participant) {
    return socket.data.participant;
  }

  return {
    id: socket?.data?.userId ?? null,
    name: sanitizeString(socket?.handshake?.auth?.name) || 'Guest',
    avatarUrl: null,
  };
};

const attachLooproomHandlers = (io, socket) => {
  const joinLooproom = async ({ slug, participant }) => {
    const normalizedSlug = sanitizeString(slug) || DEFAULT_ROOM;
    socket.join(normalizedSlug);
    socket.data.looproom = normalizedSlug;
    socket.data.userId = participant?.id ?? null;
    socket.data.participant = buildParticipant({ participant, socket });

    io.to(normalizedSlug).emit('looproom:presence', {
      type: 'join',
      participant: socket.data.participant,
      timestamp: new Date().toISOString(),
    });
  };

  const leaveLooproom = ({ slug }) => {
    const targetSlug = sanitizeString(slug) || socket.data.looproom;
    if (!targetSlug) return;
    socket.leave(targetSlug);
    io.to(targetSlug).emit('looproom:presence', {
      type: 'leave',
      participant: buildParticipant({ socket }),
      timestamp: new Date().toISOString(),
    });
  };

  const forwardReaction = async ({ slug, reactionType, weight = 1 }) => {
    const targetSlug = sanitizeString(slug) || socket.data.looproom;
    const normalizedReaction = sanitizeString(reactionType);
    if (!targetSlug || !normalizedReaction) return;

    try {
      const { summary, motivation } = await RealtimeService.recordReaction({
        slug: targetSlug,
        reactionType: normalizedReaction,
        weight,
        userId: socket.data.userId ?? null,
        participant: socket.data.participant,
      });

      const payload = {
        reactionType: normalizedReaction,
        weight,
        by: buildParticipant({ socket }),
        slug: targetSlug,
        timestamp: new Date().toISOString(),
        summary,
      };

      io.to(targetSlug).emit('looproom:reaction', payload);

      if (motivation) {
        io.to(targetSlug).emit('looproom:motivation', {
          slug: targetSlug,
          reactionType: normalizedReaction,
          message: motivation.message,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('[VYBE] Realtime reaction error:', error.message);
    }
  };

  const forwardMessage = async ({ slug, message, messageType = 'chat' }) => {
    const targetSlug = sanitizeString(slug) || socket.data.looproom;
    const body = sanitizeString(message);
    if (!targetSlug || !body) return;

    try {
      const saved = await RealtimeService.recordMessage({
        slug: targetSlug,
        message: body,
        messageType,
        userId: socket.data.userId ?? null,
        participant: socket.data.participant,
      });

      io.to(targetSlug).emit('looproom:message', {
        id: saved.id,
        message: saved.message,
        messageType: saved.messageType,
        timestamp: saved.timestamp,
        displayName: saved.displayName || null,
        by: buildParticipant({ socket }),
        slug: targetSlug,
      });
    } catch (error) {
      console.error('[VYBE] Realtime message error:', error.message);
    }
  };

  socket.on('looproom:join', joinLooproom);
  socket.on('looproom:leave', leaveLooproom);
  socket.on('looproom:reaction', forwardReaction);
  socket.on('looproom:message', forwardMessage);

  socket.on('disconnect', () => {
    if (!socket.data.looproom) return;
    io.to(socket.data.looproom).emit('looproom:presence', {
      type: 'leave',
      participant: buildParticipant({ socket }),
      timestamp: new Date().toISOString(),
    });
  });
};

const initializeSockets = (server, { checkOrigin } = {}) => {
  const corsConfig = checkOrigin
    ? {
        origin(origin, callback) {
          checkOrigin(origin, callback);
        },
        credentials: true,
      }
    : {
        origin: true,
        credentials: true,
      };

  const io = new Server(server, {
    cors: corsConfig,
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    socket.emit('looproom:system', {
      type: 'connected',
      timestamp: new Date().toISOString(),
    });
    attachLooproomHandlers(io, socket);
  });

  return io;
};

module.exports = {
  initializeSockets,
};
