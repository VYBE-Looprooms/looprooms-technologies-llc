const { Op, fn, col } = require('sequelize');
const { Looproom, RoomReaction, RoomMessage, MotivationalMessage, sequelize } = require('../models');

const resolveLooproomBySlug = async (slug) => {
  if (!slug) {
    throw new Error('Looproom slug is required');
  }

  const looproom = await Looproom.findOne({ where: { slug } });
  if (!looproom) {
    const error = new Error('Looproom not found');
    error.statusCode = 404;
    throw error;
  }
  return looproom;
};

const buildParticipantName = (participant) => {
  if (!participant) return null;
  if (participant.name) return participant.name;
  if (participant.firstName || participant.lastName) {
    return `${participant.firstName ?? ''} ${participant.lastName ?? ''}`.trim();
  }
  return null;
};

const recordReaction = async ({ slug, reactionType, weight = 1, userId = null, participant }) => {
  const looproom = await resolveLooproomBySlug(slug);
  await RoomReaction.create({
    looproomId: looproom.id,
    userId,
    reactionType,
    weight,
  });

  const aggregates = await RoomReaction.findAll({
    where: { looproomId: looproom.id },
    attributes: ['reactionType', [fn('SUM', col('weight')), 'total']],
    group: ['reactionType'],
  });

  const summary = aggregates.map((aggregate) => ({
    reactionType: aggregate.get('reactionType'),
    total: Number(aggregate.get('total')) || 0,
  }));

  const motivation = await pickMotivationalMessage({ looproomId: looproom.id, reactionType });

  return { summary, motivation };
};

const pickMotivationalMessage = async ({ looproomId, reactionType }) => {
  const messages = await MotivationalMessage.findAll({
    where: {
      isActive: true,
      reactionType,
      [Op.or]: [{ looproomId }, { looproomId: null }],
    },
  });

  if (!messages.length) {
    return null;
  }

  const expanded = [];
  messages.forEach((message) => {
    const weight = message.displayWeight || 1;
    for (let i = 0; i < weight; i += 1) {
      expanded.push(message);
    }
  });

  const selected = expanded[Math.floor(Math.random() * expanded.length)];
  if (!selected) {
    return null;
  }

  return {
    id: selected.id,
    message: selected.message,
    reactionType: selected.reactionType,
  };
};

const recordMessage = async ({ slug, message, userId = null, participant, messageType = 'chat' }) => {
  const looproom = await resolveLooproomBySlug(slug);
  const displayName = buildParticipantName(participant);

  const saved = await RoomMessage.create({
    looproomId: looproom.id,
    userId,
    message,
    messageType,
    displayName,
    sentAt: new Date(),
  });

  return {
    id: saved.id,
    message: saved.message,
    messageType: saved.messageType,
    timestamp: saved.sentAt?.toISOString?.() || new Date().toISOString(),
    displayName,
    userId: saved.userId,
    looproomId: looproom.id,
  };
};

const getRecentMessages = async ({ looproomId, limit = 30 }) => {
  const messages = await RoomMessage.findAll({
    where: { looproomId },
    order: [['sentAt', 'DESC']],
    limit,
  });

  return messages
    .map((saved) => ({
      id: saved.id,
      message: saved.message,
      messageType: saved.messageType,
      timestamp: saved.sentAt?.toISOString?.() || null,
      displayName: saved.displayName || null,
      userId: saved.userId || null,
    }))
    .reverse();
};

const getReactionSummary = async ({ looproomId }) => {
  const aggregates = await RoomReaction.findAll({
    where: { looproomId },
    attributes: ['reactionType', [fn('SUM', col('weight')), 'total']],
    group: ['reactionType'],
  });

  return aggregates.map((aggregate) => ({
    reactionType: aggregate.get('reactionType'),
    total: Number(aggregate.get('total')) || 0,
  }));
};

module.exports = {
  recordReaction,
  recordMessage,
  getRecentMessages,
  getReactionSummary,
};
