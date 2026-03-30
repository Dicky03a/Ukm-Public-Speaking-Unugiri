# UKM Public Speaking Website

Website resmi UKM Public Speaking yang dibangun dengan React, Express, Prisma, dan Tailwind CSS.

## Fitur Utama
- **Beranda (Home):** Informasi umum dan highlight kegiatan.
- **Berita (News):** Artikel dan berita terbaru seputar UKM.
- **Tentang Kami (About):** Visi, misi, dan struktur organisasi.
- **Galeri (Gallery):** Dokumentasi foto kegiatan.
- **Kontak (Contact):** Informasi kontak dan lokasi.
- **Panel Admin:** Manajemen berita, pengurus, dan galeri (dilengkapi fitur unggah gambar).

---

## Persiapan Instalasi

Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- [npm](https://www.npmjs.com/)

---

## Instalasi Lokal (Development)

1. **Clone repositori ini:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
   ```bash
   cp .env.example .env
   ```
   Pastikan `DATABASE_URL` mengarah ke file SQLite lokal:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="ganti-dengan-secret-anda"
   ```

4. **Setup Database:**
   Jalankan migrasi Prisma untuk membuat tabel di SQLite:
   ```bash
   npx prisma db push
   ```

5. **Seed Data (Opsional):**
   Buat akun admin default dan kategori berita:
   ```bash
   npx tsx prisma/seed.ts
   ```
   *Akun Admin Default:*
   - Email: `admin@ukmpublicspeaking.com`
   - Password: `admin123`

6. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

---

## Konfigurasi Produksi

Untuk menjalankan aplikasi di lingkungan produksi, ikuti langkah-langkah berikut:

1. **Build Aplikasi:**
   Proses ini akan meng-generate Prisma Client dan mem-build frontend React ke folder `dist/`:
   ```bash
   npm run build
   ```

2. **Setup Environment Variables:**
   Pastikan variabel lingkungan berikut sudah diset di server produksi:
   - `NODE_ENV=production`
   - `DATABASE_URL` (misal: `file:/data/prod.db`)
   - `JWT_SECRET` (gunakan string yang panjang dan acak)
   - `PORT=3000`

3. **Persiapan Folder Uploads:**
   Pastikan folder untuk menyimpan gambar yang diunggah sudah ada dan memiliki izin tulis:
   ```bash
   mkdir -p public/uploads
   ```

4. **Jalankan Server Produksi:**
   Anda bisa menggunakan `npm start` atau process manager seperti **PM2**:
   ```bash
   # Menggunakan npm
   npm start

   # Menggunakan PM2 (Direkomendasikan)
   pm2 start server.ts --name "ukm-website" --interpreter tsx
   ```

5. **Reverse Proxy (Nginx):**
   Disarankan menggunakan Nginx sebagai reverse proxy untuk mengarahkan trafik dari port 80/443 ke port 3000.

---

## Struktur Folder Penting
- `/src`: Kode sumber frontend (React).
- `/server.ts`: Entry point backend (Express).
- `/prisma`: Skema database dan skrip seeding.
- `/public/uploads`: Lokasi penyimpanan gambar yang diunggah melalui panel admin.

## Catatan Keamanan
- Jangan pernah membagikan file `.env` atau `JWT_SECRET` ke publik.
- Selalu gunakan HTTPS di lingkungan produksi.
- Pastikan folder `public/uploads` tidak dapat mengeksekusi skrip (hanya untuk file statis).
