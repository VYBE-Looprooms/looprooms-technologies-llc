const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserRole() {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: 'boussettahsallah@gmail.com' },
      include: {
        profile: true,
        creatorApplication: true
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User Details:');
    console.log('Email:', user.email);
    console.log('Username:', user.username);
    console.log('Role:', user.role);
    console.log('Is Verified:', user.isVerified);

    if (user.creatorApplication) {
      console.log('\n📋 Creator Application:');
      console.log('Status:', user.creatorApplication.status);
      console.log('Reviewed At:', user.creatorApplication.reviewedAt);
      console.log('Review Notes:', user.creatorApplication.reviewNotes);
    }

  } catch (error) {
    console.error('❌ Error checking user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRole();