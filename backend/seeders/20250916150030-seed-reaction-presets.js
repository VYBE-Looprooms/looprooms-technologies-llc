'use strict';

const presets = [
  {
    key: 'breathe',
    label: 'Deep Breath',
    emoji: '🫧',
    description: 'Gentle reminder to inhale, exhale, and recentre together.',
    theme_color: '#22d3ee',
    display_order: 1,
  },
  {
    key: 'anchor',
    label: 'Grounded',
    emoji: '🪨',
    description: 'Staying rooted in the moment with calm, steady energy.',
    theme_color: '#60a5fa',
    display_order: 2,
  },
  {
    key: 'spark',
    label: 'Spark Energy',
    emoji: '⚡',
    description: 'Quick burst of motivation to move and shine.',
    theme_color: '#f472b6',
    display_order: 3,
  },
  {
    key: 'gratitude',
    label: 'Gratitude Wave',
    emoji: '🙏',
    description: 'Collective thank you for showing up and supporting each other.',
    theme_color: '#facc15',
    display_order: 4,
  },
  {
    key: 'joy',
    label: 'Joy Burst',
    emoji: '✨',
    description: 'Celebrate the moment with uplifting sparkle.',
    theme_color: '#fb7185',
    display_order: 5,
  },
  {
    key: 'focus',
    label: 'Focus Reset',
    emoji: '🎯',
    description: 'Dial in together and align on the next intentional step.',
    theme_color: '#a855f7',
    display_order: 6,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    await queryInterface.bulkInsert(
      'reaction_presets',
      presets.map(preset => ({
        ...preset,
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reaction_presets', {
      key: {
        [Sequelize.Op.in]: presets.map(({ key }) => key),
      },
    });
  },
};
