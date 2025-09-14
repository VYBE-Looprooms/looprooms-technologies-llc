const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateUserToAdmin() {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: 'admin@feelyourvybe.com' },
      include: { profile: true }
    });

    if (!user) {
      console.log('❌ User not found with email: admin@feelyourvybe.com');
      return;
    }

    if (user.role === 'ADMIN') {
      console.log('✅ User is already an ADMIN');
      return;
    }

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: 'ADMIN'
      }
    });

    console.log('✅ User role updated to ADMIN successfully!');
    console.log('User ID:', updatedUser.id);
    console.log('Email:', updatedUser.email);
    console.log('Username:', updatedUser.username);
    console.log('Role:', updatedUser.role);

  } catch (error) {
    console.error('❌ Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserToAdmin();