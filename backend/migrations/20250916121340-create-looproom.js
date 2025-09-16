'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('looprooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'looproom_categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      creator_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'creator_profiles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      title: {
        type: Sequelize.STRING(180),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true,
      },
      summary: {
        type: Sequelize.STRING(280),
      },
      description: {
        type: Sequelize.TEXT,
      },
      video_url: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      playlist_url: {
        type: Sequelize.STRING(255),
      },
      is_live: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING(32),
        allowNull: false,
        defaultValue: 'active',
      },
      start_at: {
        type: Sequelize.DATE,
      },
      end_at: {
        type: Sequelize.DATE,
      },
      thumbnail_url: {
        type: Sequelize.STRING(255),
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

    await queryInterface.addIndex('looprooms', ['category_id']);
    await queryInterface.addIndex('looprooms', ['slug'], {
      unique: true,
      name: 'looprooms_slug_unique',
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('looprooms');
  },
};
