'use strict';

const chains = [
  { fromSlug: 'recovery-anchor-circle', toSlug: 'meditation-breathe-release', sequence: 1 },
  { fromSlug: 'meditation-breathe-release', toSlug: 'fitness-spark-session', sequence: 2 },
  { fromSlug: 'fitness-spark-session', toSlug: 'healthy-living-nourish-lab', sequence: 3 },
  { fromSlug: 'meditation-breathe-release', toSlug: 'wellness-reset-lab', sequence: 1 },
  { fromSlug: 'wellness-reset-lab', toSlug: 'healthy-living-nourish-lab', sequence: 2 },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [looprooms] = await queryInterface.sequelize.query(
      'SELECT id, slug FROM looprooms'
    );
    const roomBySlug = looprooms.reduce((acc, room) => {
      acc[room.slug] = room.id;
      return acc;
    }, {});

    const timestamp = new Date();
    await queryInterface.bulkInsert(
      'loopchain_steps',
      chains
        .filter(chain => roomBySlug[chain.fromSlug] && roomBySlug[chain.toSlug])
        .map(chain => ({
          looproom_id: roomBySlug[chain.fromSlug],
          next_looproom_id: roomBySlug[chain.toSlug],
          sequence: chain.sequence,
          description: null,
          created_at: timestamp,
          updated_at: timestamp,
        })),
      {}
    );
  },

  async down(queryInterface) {
    const [looprooms] = await queryInterface.sequelize.query(
      'SELECT id, slug FROM looprooms'
    );
    const roomBySlug = looprooms.reduce((acc, room) => {
      acc[room.slug] = room.id;
      return acc;
    }, {});

    for (const chain of chains) {
      const looproomId = roomBySlug[chain.fromSlug];
      const nextLooproomId = roomBySlug[chain.toSlug];
      if (looproomId && nextLooproomId) {
        await queryInterface.bulkDelete('loopchain_steps', {
          looproom_id: looproomId,
          next_looproom_id: nextLooproomId,
        });
      }
    }
  },
};
