const { ReactionPreset, MotivationalMessage, Looproom } = require('../models');

const serializeReactionPreset = (preset) => ({
  id: preset.id,
  key: preset.key,
  label: preset.label,
  emoji: preset.emoji,
  description: preset.description,
  themeColor: preset.themeColor,
  displayOrder: preset.displayOrder,
});

const serializeMotivationalMessage = (message) => ({
  id: message.id,
  reactionType: message.reactionType,
  message: message.message,
  displayWeight: message.displayWeight,
  looproom: message.looproom
    ? {
        id: message.looproom.id,
        slug: message.looproom.slug,
        title: message.looproom.title,
      }
    : null,
});

const listReactionPresets = async () => {
  const presets = await ReactionPreset.findAll({
    where: { isActive: true },
    order: [
      ['displayOrder', 'ASC'],
      ['label', 'ASC'],
    ],
  });

  return presets.map(serializeReactionPreset);
};

const listMotivationalMessages = async () => {
  const messages = await MotivationalMessage.findAll({
    where: { isActive: true },
    include: [
      {
        model: Looproom,
        as: 'looproom',
        attributes: ['id', 'slug', 'title'],
      },
    ],
    order: [
      ['reaction_type', 'ASC'],
      ['display_weight', 'DESC'],
      ['id', 'ASC'],
    ],
  });

  return messages.map(serializeMotivationalMessage);
};

module.exports = {
  listReactionPresets,
  listMotivationalMessages,
};

