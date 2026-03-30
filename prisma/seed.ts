import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ukmpublicspeaking.com' },
    update: {},
    create: {
      email: 'admin@ukmpublicspeaking.com',
      password: hashedPassword,
      name: 'Admin UKM',
      role: 'admin',
    },
  });

  console.log('Admin created:', admin.email);

  const categories = ['Kegiatan', 'Prestasi', 'Opini', 'Pengumuman'];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat },
      update: {},
      create: {
        name: cat,
        slug: cat.toLowerCase(),
      },
    });
  }
  
  console.log('Categories seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
