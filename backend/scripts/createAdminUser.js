const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@feelyourvybe.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@feelyourvybe.com',
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
        authProvider: 'LOCAL',
        profile: {
          create: {
            firstName: 'Admin',
            lastName: 'User',
            bio: 'VYBE LOOPROOMS Administrator',
            interests: ['RECOVERY', 'MEDITATION', 'FITNESS'],
            onboardingCompleted: true
          }
        }
      },
      include: {
        profile: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@feelyourvybe.com');
    console.log('Password: Admin@123');
    console.log('Role: ADMIN');
    console.log('User ID:', adminUser.id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();