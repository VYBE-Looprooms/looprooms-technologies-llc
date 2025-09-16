const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Recovery & Healing',
    slug: 'recovery',
    description: 'Emotional healing, addiction recovery, trauma processing, and mental health support',
    color: '#FF6B6B', // Warm red/orange gradient base
    iconUrl: null, // Will use Heart icon from frontend
    sortOrder: 1,
    isActive: true
  },
  {
    name: 'Meditation & Mindfulness',
    slug: 'meditation',
    description: 'Guided meditation, mindfulness practices, spiritual growth, and inner peace',
    color: '#8B5CF6', // Purple gradient base
    iconUrl: null, // Will use Brain icon from frontend
    sortOrder: 2,
    isActive: true
  },
  {
    name: 'Fitness & Wellness',
    slug: 'fitness',
    description: 'Physical wellness, workout routines, movement therapy, and healthy lifestyle',
    color: '#10B981', // Green/teal gradient base
    iconUrl: null, // Will use Dumbbell icon from frontend
    sortOrder: 3,
    isActive: true
  }
];

async function seedCategories() {
  console.log('🌱 Seeding VYBE LOOPROOMS™ Categories...');

  try {
    for (const category of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: category.slug }
      });

      if (existingCategory) {
        console.log(`✅ Category "${category.name}" already exists`);
        continue;
      }

      const createdCategory = await prisma.category.create({
        data: category
      });

      console.log(`✨ Created category: ${createdCategory.name} (${createdCategory.slug})`);
    }

    console.log('\n🎉 Category seeding completed successfully!');
    console.log('📊 Categories created:');

    const allCategories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    allCategories.forEach(cat => {
      console.log(`   ${cat.sortOrder}. ${cat.name} (${cat.slug}) - ${cat.color}`);
    });

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedCategories()
    .catch((error) => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedCategories, categories };