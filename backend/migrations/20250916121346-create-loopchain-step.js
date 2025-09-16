'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loopchain_steps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      looproom_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'looprooms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      next_looproom_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'looprooms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      description: {
        type: Sequelize.TEXT,
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

    await queryInterface.addConstraint('loopchain_steps', {
      fields: ['looproom_id', 'next_looproom_id'],
      type: 'unique',
      name: 'loopchain_steps_unique_pair',
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('loopchain_steps');
  },
};
