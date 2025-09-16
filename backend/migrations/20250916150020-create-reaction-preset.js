'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reaction_presets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      key: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true,
      },
      label: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      emoji: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      theme_color: {
        type: Sequelize.STRING(16),
        allowNull: false,
        defaultValue: '#22d3ee',
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('reaction_presets', ['is_active']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('reaction_presets');
  },
};
