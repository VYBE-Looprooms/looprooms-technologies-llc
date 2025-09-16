'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('social_posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      looproom_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'looprooms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      mood_key: {
        type: Sequelize.STRING(64),
      },
      visibility: {
        type: Sequelize.STRING(24),
        allowNull: false,
        defaultValue: 'public',
      },
      status: {
        type: Sequelize.STRING(24),
        allowNull: false,
        defaultValue: 'published',
      },
      published_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('social_posts', ['user_id']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('social_posts');
  },
};
