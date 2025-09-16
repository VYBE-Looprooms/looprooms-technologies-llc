'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('creator_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      display_name: {
        type: Sequelize.STRING(160),
        allowNull: false,
      },
      bio: {
        type: Sequelize.TEXT,
      },
      expertise: {
        type: Sequelize.STRING(120),
      },
      website: {
        type: Sequelize.STRING(255),
      },
      instagram: {
        type: Sequelize.STRING(255),
      },
      youtube: {
        type: Sequelize.STRING(255),
      },
      featured_video_url: {
        type: Sequelize.STRING(255),
      },
      status: {
        type: Sequelize.STRING(24),
        allowNull: false,
        defaultValue: 'pending',
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable('creator_profiles');
  },
};
