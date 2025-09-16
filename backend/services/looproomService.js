const { Looproom, LooproomCategory, LoopchainStep, MotivationalMessage } = require('../models');
const RealtimeService = require('./realtimeService');

const defaultLooproomInclude = [
  {
    model: LooproomCategory,
    as: 'category',
    attributes: ['id', 'key', 'name', 'description', 'themeColor', 'icon'],
  },
  {
    model: LoopchainStep,
    as: 'loopchainSteps',
    attributes: ['id', 'sequence', 'description', 'nextLooproomId'],
    include: [
      {
        model: Looproom,
        as: 'nextLooproom',
        attributes: [
          'id',
          'slug',
          'title',
          'summary',
          'thumbnailUrl',
          'videoUrl',
          'playlistUrl',
          'categoryId',
        ],
        include: [
          {
            model: LooproomCategory,
            as: 'category',
            attributes: ['id', 'key', 'name', 'themeColor', 'icon'],
          },
        ],
      },
    ],
  },
  {
    model: MotivationalMessage,
    as: 'motivationalMessages',
    attributes: [
      'id',
      ['reaction_type', 'reactionType'],
      'message',
      ['display_weight', 'displayWeight'],
      ['is_active', 'isActive'],
    ],
    where: { is_active: true },
    required: false,
  },
];

const MOOD_PRESETS = [
  { key: 'calm', slug: 'meditation-breathe-release', keywords: ['calm', 'peaceful', 'balanced', 'present'] },
  { key: 'anxious', slug: 'recovery-anchor-circle', keywords: ['anxious', 'overwhelmed', 'stressed', 'worried', 'panic'] },
  { key: 'lonely', slug: 'recovery-anchor-circle', keywords: ['lonely', 'alone', 'support', 'connection'] },
  { key: 'energized', slug: 'fitness-spark-session', keywords: ['energized', 'motivated', 'strong', 'ready'] },
  { key: 'drained', slug: 'wellness-reset-lab', keywords: ['drained', 'tired', 'burned out', 'heavy'] },
  { key: 'curious', slug: 'healthy-living-nourish-lab', keywords: ['curious', 'inspired', 'learning', 'creative'] },
];

const FALLBACK_SLUG = 'wellness-reset-lab';

const serializeCategory = (category) => {
  if (!category) return null;
  return {
    id: category.id,
    key: category.key,
    name: category.name,
    description: category.description,
    themeColor: category.themeColor,
    icon: category.icon,
  };
};

const serializeLoopchainStep = (step) => ({
  id: step.id,
  sequence: step.sequence,
  description: step.description,
  nextLooproom: step.nextLooproom
    ? {
        id: step.nextLooproom.id,
        slug: step.nextLooproom.slug,
        title: step.nextLooproom.title,
        summary: step.nextLooproom.summary,
        thumbnailUrl: step.nextLooproom.thumbnailUrl,
        videoUrl: step.nextLooproom.videoUrl,
        playlistUrl: step.nextLooproom.playlistUrl,
        category: serializeCategory(step.nextLooproom.category),
      }
    : null,
});

const serializeMotivationalMessage = (message) => ({
  id: message.id,
  reactionType: message.reactionType,
  message: message.message,
  displayWeight: message.displayWeight,
  isActive: message.isActive !== undefined ? message.isActive : true,
});

const serializeLooproom = (looproom) => {
  const plain = looproom.get({ plain: true });
  return {
    id: plain.id,
    slug: plain.slug,
    title: plain.title,
    summary: plain.summary,
    description: plain.description,
    videoUrl: plain.videoUrl,
    playlistUrl: plain.playlistUrl,
    thumbnailUrl: plain.thumbnailUrl,
    isLive: plain.isLive,
    status: plain.status,
    startAt: plain.startAt,
    endAt: plain.endAt,
    category: serializeCategory(plain.category),
    loopchain: Array.isArray(plain.loopchainSteps)
      ? plain.loopchainSteps
          .slice()
          .sort((a, b) => a.sequence - b.sequence)
          .map(serializeLoopchainStep)
      : [],
    motivationalMessages: Array.isArray(plain.motivationalMessages)
      ? plain.motivationalMessages.map(serializeMotivationalMessage)
      : [],
  };
};

const listLooprooms = async () => {
  const looprooms = await Looproom.findAll({
    include: defaultLooproomInclude,
    order: [
      ['title', 'ASC'],
      [{ model: LoopchainStep, as: 'loopchainSteps' }, 'sequence', 'ASC'],
    ],
  });
  return looprooms.map(serializeLooproom);
};

const getLooproomBySlug = async (slug) => {
  const looproom = await Looproom.findOne({
    where: { slug },
    include: defaultLooproomInclude,
    order: [[{ model: LoopchainStep, as: 'loopchainSteps' }, 'sequence', 'ASC']],
  });

  if (!looproom) {
    const error = new Error('Looproom not found');
    error.statusCode = 404;
    throw error;
  }

  const serialized = serializeLooproom(looproom);
  const [recentMessages, reactionSummary] = await Promise.all([
    RealtimeService.getRecentMessages({ looproomId: looproom.id, limit: 30 }),
    RealtimeService.getReactionSummary({ looproomId: looproom.id }),
  ]);

  return {
    ...serialized,
    recentMessages,
    reactionSummary,
  };
};

const listCategoriesWithLooprooms = async () => {
  const looprooms = await listLooprooms();
  const categories = new Map();

  looprooms.forEach((room) => {
    const categoryKey = room.category?.key || 'uncategorized';
    if (!categories.has(categoryKey)) {
      categories.set(categoryKey, {
        category: room.category || { key: 'uncategorized', name: 'Uncategorized' },
        looprooms: [],
      });
    }
    categories.get(categoryKey).looprooms.push(room);
  });

  return Array.from(categories.values()).map((entry) => ({
    category: entry.category,
    looprooms: entry.looprooms,
  }));
};

const resolveMoodPreset = (moodKey, moodText) => {
  if (moodKey) {
    const presetByKey = MOOD_PRESETS.find((preset) => preset.key === moodKey.toLowerCase());
    if (presetByKey) {
      return { preset: presetByKey, matchedKeyword: moodKey };
    }
  }

  if (moodText) {
    const normalized = moodText.toLowerCase();
    for (const preset of MOOD_PRESETS) {
      const match = preset.keywords.find((keyword) => normalized.includes(keyword));
      if (match) {
        return { preset, matchedKeyword: match };
      }
    }
  }

  const fallback = MOOD_PRESETS.find((preset) => preset.slug === FALLBACK_SLUG) || MOOD_PRESETS[0];
  return { preset: fallback, matchedKeyword: null };
};

const recommendLooproomForMood = async ({ moodKey, moodText }) => {
  const { preset, matchedKeyword } = resolveMoodPreset(moodKey, moodText);
  let recommended;

  try {
    recommended = await getLooproomBySlug(preset.slug);
  } catch (error) {
    recommended = await getLooproomBySlug(FALLBACK_SLUG);
  }

  const allLooprooms = await listLooprooms();
  const alternatives = allLooprooms
    .filter((room) => room.slug !== recommended.slug)
    .slice(0, 3);

  return {
    mood: {
      requestedKey: moodKey || null,
      resolvedKey: preset.key,
      moodText: moodText || null,
      matchedKeyword,
    },
    recommended,
    loopchain: recommended.loopchain,
    alternatives,
  };
};

module.exports = {
  listLooprooms,
  getLooproomBySlug,
  listCategoriesWithLooprooms,
  recommendLooproomForMood,
};
