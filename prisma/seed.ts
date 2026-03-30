import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // ============ USERS ============
    console.log('📝 Creating admin user...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@ukmpublicspeaking.com' },
      update: {},
      create: {
        email: 'admin@ukmpublicspeaking.com',
        password: hashedPassword,
        name: 'Admin UKM Public Speaking',
        role: 'admin',
      },
    });

    console.log('✅ Admin created:', admin.email);

    // ============ CATEGORIES ============
    console.log('📑 Creating categories...');
    
    const categories = [
      { name: 'Kegiatan', slug: 'kegiatan' },
      { name: 'Prestasi', slug: 'prestasi' },
      { name: 'Opini', slug: 'opini' },
      { name: 'Pengumuman', slug: 'pengumuman' },
      { name: 'Event', slug: 'event' },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }

    console.log('✅ Categories created');

    // ============ NEWS (BERITA) ============
    console.log('📰 Creating sample news...');

    const newsItems = [
      {
        title: 'UKM Public Speaking Menang Kompetisi Nasional',
        slug: 'ukm-public-speaking-menang-kompetisi-nasional',
        content: 'Dengan penuh kebanggaan, UKM Public Speaking berhasil meraih juara 1 dalam kompetisi public speaking tingkat nasional yang diselenggarakan oleh Asosiasi Mahasiswa Indonesia.',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        categoryId: 2, // Prestasi
        published: true,
      },
      {
        title: 'Pembukaan Rekrutmen Anggota Baru 2024',
        slug: 'pembukaan-rekrutmen-anggota-baru-2024',
        content: 'UKM Public Speaking membuka kesempatan bagi mahasiswa untuk bergabung. Pendaftaran dibuka mulai tanggal 1-15 Maret 2024 dengan kriteria yang dapat dilihat pada poster di bawah ini.',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        categoryId: 4, // Pengumuman
        published: true,
      },
      {
        title: 'Tips Memulai Public Speaking untuk Pemula',
        slug: 'tips-memulai-public-speaking-untuk-pemula',
        content: 'Public speaking adalah seni yang dapat dipelajari oleh siapa saja. Berikut adalah beberapa tips untuk pemula yang ingin memulai perjalanan mereka dalam public speaking.',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        categoryId: 3, // Opini
        published: true,
      },
    ];

    for (const news of newsItems) {
      await prisma.berita.upsert({
        where: { slug: news.slug },
        update: {},
        create: news,
      });
    }

    console.log('✅ News created');

    // ============ MEMBERS ============
    console.log('👥 Creating members...');

    const members = [
      {
        name: 'Ahmad Rahman',
        position: 'Ketua Umum',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        period: '2024-2025',
        order: 1,
      },
      {
        name: 'Siti Nurhaliza',
        position: 'Wakil Ketua',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        period: '2024-2025',
        order: 2,
      },
      {
        name: 'Budi Santoso',
        position: 'Sekretaris',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        period: '2024-2025',
        order: 3,
      },
      {
        name: 'Ani Wijaya',
        position: 'Bendahara',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        period: '2024-2025',
        order: 4,
      },
    ];

    for (const member of members) {
      await prisma.member.upsert({
        where: { id: members.indexOf(member) + 1 },
        update: {},
        create: member,
      });
    }

    console.log('✅ Members created');

    // ============ GALLERY ============
    console.log('🖼️  Creating gallery items...');

    const galleryItems = [
      {
        title: 'Workshop Public Speaking',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        description: 'Workshop intensif public speaking untuk member baru',
      },
      {
        title: 'Kompetisi Debate Kampus',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        description: 'Peserta dari UKM Public Speaking dalam kompetisi debate',
      },
      {
        title: 'Gathering Anggota',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        description: 'Kebersamaan anggota UKM Public Speaking',
      },
    ];

    for (const item of galleryItems) {
      await prisma.gallery.create({
        data: item,
      });
    }

    console.log('✅ Gallery items created');

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📋 Informasi Login:');
    console.log('   Email: admin@ukmpublicspeaking.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Jangan lupa ubah password di production!');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });