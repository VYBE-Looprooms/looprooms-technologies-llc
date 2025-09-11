const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('🌱 Seeding categories...');

  const categories = [
    {
      name: 'Recovery',
      slug: 'recovery',
      description: 'Addiction recovery, sobriety, and healing journey content',
      color: '#ef4444', // Red for heart/recovery
      sortOrder: 1
    },
    {
      name: 'Fitness',
      slug: 'fitness',
      description: 'Physical wellness, exercise, and movement content',
      color: '#eab308', // Yellow for energy/fitness
      sortOrder: 2
    },
    {
      name: 'Meditation',
      slug: 'meditation',
      description: 'Mindfulness, meditation, and inner peace practices',
      color: '#ec4899', // Pink for brain/meditation
      sortOrder: 3
    }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  console.log('✅ Categories seeded successfully');
}

async function seedTags() {
  console.log('🌱 Seeding tags...');

  const tags = [
    // Recovery Looproom tags
    { name: 'Addiction Recovery', slug: 'addiction-recovery' },
    { name: 'Sobriety Journey', slug: 'sobriety-journey' },
    { name: 'Support Groups', slug: 'support-groups' },
    { name: '12 Steps Program', slug: '12-steps-program' },
    { name: 'Relapse Prevention', slug: 'relapse-prevention' },
    { name: 'Recovery Stories', slug: 'recovery-stories' },
    { name: 'Emotional Healing', slug: 'emotional-healing' },
    { name: 'Trauma Recovery', slug: 'trauma-recovery' },
    
    // Fitness Looproom tags
    { name: 'Strength Training', slug: 'strength-training' },
    { name: 'Cardio Workouts', slug: 'cardio-workouts' },
    { name: 'Yoga Flow', slug: 'yoga-flow' },
    { name: 'HIIT Training', slug: 'hiit-training' },
    { name: 'Flexibility', slug: 'flexibility' },
    { name: 'Endurance', slug: 'endurance' },
    { name: 'Body Building', slug: 'body-building' },
    { name: 'Weight Loss', slug: 'weight-loss' },
    
    // Meditation Looproom tags
    { name: 'Mindfulness', slug: 'mindfulness' },
    { name: 'Breathing Techniques', slug: 'breathing-techniques' },
    { name: 'Guided Meditation', slug: 'guided-meditation' },
    { name: 'Body Scan', slug: 'body-scan' },
    { name: 'Stress Relief', slug: 'stress-relief' },
    { name: 'Inner Peace', slug: 'inner-peace' },
    { name: 'Chakra Meditation', slug: 'chakra-meditation' },
    { name: 'Sleep Meditation', slug: 'sleep-meditation' }
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag
    });
  }

  console.log('✅ Tags seeded successfully');
}

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await seedCategories();
    await seedTags();
    
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
