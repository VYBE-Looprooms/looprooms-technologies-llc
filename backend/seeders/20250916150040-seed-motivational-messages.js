'use strict';

const messages = [
  {
    looproomSlug: 'recovery-anchor-circle',
    reactionType: 'anchor',
    message: 'We are holding space with you. Let this anchor remind you that you are never alone in this circle.',
    weight: 3,
  },
  {
    looproomSlug: 'recovery-anchor-circle',
    reactionType: 'breathe',
    message: 'Slow breath in, slow breath out. Each inhale is a reset and we are breathing with you.',
    weight: 2,
  },
  {
    looproomSlug: 'recovery-anchor-circle',
    reactionType: 'gratitude',
    message: 'Thank you for showing up for yourself today. Your courage lifts the entire room.',
    weight: 2,
  },
  {
    looproomSlug: 'meditation-breathe-release',
    reactionType: 'breathe',
    message: 'Let the calm settle into your body. With every breath, you are expanding the peace in this space.',
    weight: 3,
  },
  {
    looproomSlug: 'meditation-breathe-release',
    reactionType: 'focus',
    message: 'Eyes soft, heart open. Stay with the mantra and let curiosity guide you forward.',
  },
  {
    looproomSlug: 'meditation-breathe-release',
    reactionType: 'joy',
    message: 'That spark of light you feel is real. Keep leaning into it - we feel it too.',
  },
  {
    looproomSlug: 'fitness-spark-session',
    reactionType: 'spark',
    message: 'Yes! That movement is electric. Your energy is lighting up the whole team.',
    weight: 3,
  },
  {
    looproomSlug: 'fitness-spark-session',
    reactionType: 'focus',
    message: 'Dial it in - strong form, strong mind. We finish powerful together.',
  },
  {
    looproomSlug: 'fitness-spark-session',
    reactionType: 'joy',
    message: 'Smiles up! Every rep is a celebration of what your body can do.',
  },
  {
    looproomSlug: 'wellness-reset-lab',
    reactionType: 'breathe',
    message: 'Release the tension. This reset is your invitation to soften and heal.',
    weight: 2,
  },
  {
    looproomSlug: 'wellness-reset-lab',
    reactionType: 'gratitude',
    message: 'Grace for where you are right now. Your presence adds warmth to this lab.',
  },
  {
    looproomSlug: 'wellness-reset-lab',
    reactionType: 'anchor',
    message: 'Feel the support underneath you. You are grounded, centered, and safe to restore.',
  },
  {
    looproomSlug: 'healthy-living-nourish-lab',
    reactionType: 'gratitude',
    message: 'Thank you for nourishing your body with intention. The community is cheering every mindful choice.',
    weight: 2,
  },
  {
    looproomSlug: 'healthy-living-nourish-lab',
    reactionType: 'joy',
    message: 'Those flavors, that creativity - we love to see you thriving in the kitchen.',
  },
  {
    looproomSlug: 'healthy-living-nourish-lab',
    reactionType: 'focus',
    message: 'Keep it playful and purposeful. Every stir is another step toward your goals.',
  },
  {
    looproomSlug: null,
    reactionType: 'breathe',
    message: 'Collective inhale. Collective exhale. Wherever you are in the loopchain, you belong.',
  },
  {
    looproomSlug: null,
    reactionType: 'joy',
    message: 'Look at this wave of joy! Keep sending it forward - the next room can feel it already.',
  },
  {
    looproomSlug: null,
    reactionType: 'gratitude',
    message: 'Grateful for this community and the care you bring. Keep shining that light.',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [looprooms] = await queryInterface.sequelize.query('SELECT id, slug FROM looprooms');
    const looproomBySlug = looprooms.reduce((acc, room) => {
      acc[room.slug] = room.id;
      return acc;
    }, {});

    const timestamp = new Date();
    const records = messages
      .map(entry => {
        if (entry.looproomSlug && !looproomBySlug[entry.looproomSlug]) {
          console.warn('[VYBE] Missing looproom for motivational message seed:', entry.looproomSlug);
          return null;
        }

        return {
          looproom_id: entry.looproomSlug ? looproomBySlug[entry.looproomSlug] : null,
          reaction_type: entry.reactionType,
          message: entry.message,
          display_weight: entry.weight || 1,
          is_active: true,
          created_at: timestamp,
          updated_at: timestamp,
        };
      })
      .filter(Boolean);

    if (records.length === 0) {
      return;
    }

    await queryInterface.bulkInsert('motivational_messages', records, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('motivational_messages', {
      message: {
        [Sequelize.Op.in]: messages.map(({ message }) => message),
      },
    });
  },
};


