'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('room_messages', 'display_name', {
      type: Sequelize.STRING(120),
      allowNull: true,
    });
    await queryInterface.addIndex('room_messages', ['looproom_id', 'sent_at']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('room_messages', ['looproom_id', 'sent_at']);
    await queryInterface.removeColumn('room_messages', 'display_name');
  },
};
