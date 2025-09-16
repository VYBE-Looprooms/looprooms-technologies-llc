'use strict';

const looprooms = [
  {
    key: 'recovery-anchor',
    categoryKey: 'recovery',
    title: 'Recovery Anchor Circle',
    slug: 'recovery-anchor-circle',
    summary: 'Daily grounding room for NA/AA style check-ins and guided support.',
    description:
      'A safe, anonymous-friendly space guided by certified recovery coaches. Includes breathing resets, gratitude prompts, and space to share wins.',
    video_url: 'https://www.youtube.com/embed/sample-recovery',
    playlist_url: 'https://open.spotify.com/playlist/sample-recovery',
    thumbnail_url: '/images/looprooms/recovery-anchor.jpg',
  },
  {
    key: 'meditation-breathe',
    categoryKey: 'meditation',
    title: 'Meditation: Breathe + Release',
    slug: 'meditation-breathe-release',
    summary: 'Live-guided meditation and breathwork to calm anxious energy.',
    description:
      'High-vibe breathwork, visualization, and affirmations curated by master guides. Ideal as the follow-up sanctuary from the Recovery Anchor Circle.',
    video_url: 'https://www.youtube.com/embed/sample-meditation',
    playlist_url: 'https://open.spotify.com/playlist/sample-meditation',
    thumbnail_url: '/images/looprooms/meditation-breathe.jpg',
  },
  {
    key: 'fitness-spark',
    categoryKey: 'fitness',
    title: 'Fitness Spark Session',
    slug: 'fitness-spark-session',
    summary: '20-minute functional movement to raise the collective energy.',
    description:
      'Bodyweight and light resistance session synchronised with upbeat playlists, plus real-time motivational overlays triggered by community reactions.',
    video_url: 'https://www.youtube.com/embed/sample-fitness',
    playlist_url: 'https://open.spotify.com/playlist/sample-fitness',
    thumbnail_url: '/images/looprooms/fitness-spark.jpg',
  },
  {
    key: 'wellness-reset',
    categoryKey: 'wellness',
    title: 'Wellness Reset Lab',
    slug: 'wellness-reset-lab',
    summary: 'Holistic reset with breath, movement, and journaling prompts.',
    description:
      'Creators blend somatic stretching, journaling prompts, and nervous-system resets. Designed to extend the meditation journey into deep restoration.',
    video_url: 'https://www.youtube.com/embed/sample-wellness',
    playlist_url: 'https://open.spotify.com/playlist/sample-wellness',
    thumbnail_url: '/images/looprooms/wellness-reset.jpg',
  },
  {
    key: 'healthy-living-nourish',
    categoryKey: 'healthy-living',
    title: 'Healthy Living Nourish Lab',
    slug: 'healthy-living-nourish-lab',
    summary: 'Nutrition tutorials and simple recipes to sustain the loopchain.',
    description:
      'Rotating cooking demos and mindful nutrition chats that reinforce positive habits after movement sessions. Features creator tips and curated playlists.',
    video_url: 'https://www.youtube.com/embed/sample-healthy',
    playlist_url: 'https://open.spotify.com/playlist/sample-healthy',
    thumbnail_url: '/images/looprooms/healthy-living-nourish.jpg',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [categories] = await queryInterface.sequelize.query(
      'SELECT id, key FROM looproom_categories'
    );
    const categoryMap = categories.reduce((acc, category) => {
      acc[category.key] = category.id;
      return acc;
    }, {});

    const timestamp = new Date();
    await queryInterface.bulkInsert(
      'looprooms',
      looprooms.map(room => ({
        category_id: categoryMap[room.categoryKey],
        creator_id: null,
        title: room.title,
        slug: room.slug,
        summary: room.summary,
        description: room.description,
        video_url: room.video_url,
        playlist_url: room.playlist_url,
        is_live: false,
        status: 'active',
        start_at: null,
        end_at: null,
        thumbnail_url: room.thumbnail_url,
        created_at: timestamp,
        updated_at: timestamp,
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('looprooms', {
      slug: {
        [Sequelize.Op.in]: looprooms.map(({ slug }) => slug),
      },
    });
  },
};
