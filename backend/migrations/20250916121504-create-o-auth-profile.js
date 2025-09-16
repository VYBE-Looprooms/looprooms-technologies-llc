'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('oauth_profiles', {
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
      provider: {
        type: Sequelize.STRING(24),
        allowNull: false,
      },
      provider_id: {
        type: Sequelize.STRING(191),
        allowNull: false,
      },
      access_token: {
        type: Sequelize.STRING(255),
      },
      refresh_token: {
        type: Sequelize.STRING(255),
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {},
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

    await queryInterface.addConstraint('oauth_profiles', {
      fields: ['provider', 'provider_id'],
      type: 'unique',
      name: 'oauth_profiles_provider_unique',
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('oauth_profiles');
  },
};
