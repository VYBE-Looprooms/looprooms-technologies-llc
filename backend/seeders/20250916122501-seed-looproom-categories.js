'use strict';

const categories = [
  {
    key: 'recovery',
    name: 'Recovery Room',
    description: 'Guided NA/AA style support spaces and mental health recovery sessions.',
    theme_color: '#60A5FA',
    icon: 'heart-pulse',
  },
  {
    key: 'meditation',
    name: 'Meditation Room',
    description: 'Breathwork, mindfulness, and grounding experiences for every mood.',
    theme_color: '#22D3EE',
    icon: 'moon-star',
  },
  {
    key: 'fitness',
    name: 'Fitness Room',
    description: 'Energizing movement sessions blending strength, mobility, and cardio.',
    theme_color: '#FB7185',
    icon: 'dumbbell',
  },
  {
    key: 'wellness',
    name: 'Wellness Room',
    description: 'Holistic healing, breath, and restorative journeys for balance.',
    theme_color: '#C084FC',
    icon: 'flower-2',
  },
  {
    key: 'healthy-living',
    name: 'Healthy Living Room',
    description: 'Cooking, nutrition, and daily rituals that sustain positive energy.',
    theme_color: '#34D399',
    icon: 'leaf',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const timestamp = new Date();
    await queryInterface.bulkInsert(
      'looproom_categories',
      categories.map(category => ({
        ...category,
        created_at: timestamp,
        updated_at: timestamp,
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('looproom_categories', {
      key: {
        [Sequelize.Op.in]: categories.map(({ key }) => key),
      },
    });
  },
};
