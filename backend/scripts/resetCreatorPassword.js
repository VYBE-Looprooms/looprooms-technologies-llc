const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetCreatorPassword() {
  try {
    const email = 'boussettahsallah@gmail.com';
    const newPassword = 'Creator123!';

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword }
    });

    console.log('✅ Password reset successfully!');
    console.log('Email:', updatedUser.email);
    console.log('New Password:', newPassword);
    console.log('Role:', updatedUser.role);

  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetCreatorPassword();