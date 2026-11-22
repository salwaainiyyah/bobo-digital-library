<div align="center">
  <img src="public/brand/bo-bo-logo.png" alt="Maskot Bo’bo, ayam pustakawan yang sedang membaca buku" width="260" />

  <h1>Bo’bo (ᨅᨚᨅᨚ) — Digital Library</h1>

  <strong>A Cozy Campus Library Inspired by Bugis Culture</strong>

  <em>Tempat pengetahuan, cerita, dan wawasan bertumbuh.</em>

  <p>
    <img src="https://img.shields.io/badge/Next.js-App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js App Router" />
    <img src="https://img.shields.io/badge/JavaScript-JSX-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript JSX" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Project-In_Development-C96858?style=for-the-badge" alt="Project in development" />
  </p>
</div>

---

## 🧭 Navigasi

- [Tentang Bo’bo](#-tentang-bobo)
- [Fitur dan Ruang Lingkup](#-fitur-dan-ruang-lingkup-sistem)
- [Alur Sirkulasi](#-alur-sirkulasi-buku)
- [Tingkat Pengguna](#-tingkat-pengguna)
- [Teknologi](#️-teknologi-yang-digunakan)
- [Identitas Visual](#-identitas-visual)
- [Struktur Direktori](#️-struktur-direktori-rencana)
- [Instalasi](#️-panduan-instalasi-dan-menjalankan-project)
- [Pengujian](#-skenario-pengujian-utama)
- [Rencana Pengembangan](#️-rencana-pengembangan)
- [Catatan Keamanan](#-catatan-keamanan)

## 🌿 Tentang Bo’bo

**Bo’bo** berasal dari bahasa Bugis yang berarti **buku**, ditulis menggunakan aksara Lontara **ᨅᨚᨅᨚ**. Nama ini dipilih untuk merepresentasikan ruang berkumpulnya pengetahuan, cerita, dan berbagai wawasan yang dapat dijelajahi oleh setiap pengunjung.

Menariknya, bunyi Bo’bo juga mengingatkan pada suara ayam, *“bok bok bok”*. Kedekatan bunyi tersebut menjadi inspirasi maskot ayam yang sedang membaca buku. Karakter ayam sekaligus memiliki keterkaitan dengan identitas Universitas Hasanuddin yang dikenal melalui julukan **Ayam Jantan dari Timur**.

Bo’bo menggabungkan tiga unsur identitas:

- **Budaya lokal** — bahasa Bugis dan aksara Lontara sebagai representasi budaya.
- **Identitas kampus** — maskot ayam yang terinspirasi dari identitas Universitas Hasanuddin.
- **Literasi digital** — buku sebagai simbol pengetahuan, pembelajaran, dan pengembangan wawasan.

Bo’bo dirancang sebagai sistem informasi perpustakaan digital kampus yang menghubungkan pengalaman menjelajahi katalog dengan pengelolaan koleksi dan layanan sirkulasi perpustakaan. Pengalaman visualnya mengusung suasana **cozy campus library**: hangat, tenang, ramah, dan tetap profesional.

## ✨ Fitur dan Ruang Lingkup Sistem

Fitur berikut merupakan ruang lingkup yang ditargetkan dalam pengembangan Bo’bo. Status implementasi akan diperbarui seiring fitur selesai dibuat dan diuji.

### 1. 📖 Katalog dan Penjelajahan Buku

- **Katalog publik:** pengunjung dapat menjelajahi koleksi buku tanpa harus masuk ke akun.
- **Pencarian dan filter:** mencari buku berdasarkan judul atau penulis, menyaring berdasarkan kategori, serta mengurutkan berdasarkan tahun terbit atau rating.
- **Detail buku:** menampilkan ISBN, judul, penulis, penerbit, tahun terbit, kategori, stok tersedia, durasi maksimal peminjaman, tarif denda harian, rating, dan ulasan.
- **Lima buku terpopuler:** menampilkan lima buku dengan frekuensi peminjaman tertinggi berdasarkan data transaksi yang memenuhi ketentuan sistem.

### 2. 🔐 Autentikasi dan Hak Akses

- Login untuk Admin, Pegawai Perpustakaan, dan Mahasiswa.
- Registrasi mandiri khusus Mahasiswa dengan validasi email kampus.
- Akses Guest untuk menjelajahi halaman publik tanpa autentikasi.
- Dashboard dan tindakan yang dibatasi berdasarkan peran pengguna (*Role-Based Access Control* atau RBAC).
- Pengelolaan sesi login dan logout.

### 3. 🔄 Peminjaman, Pengembalian, dan Perpanjangan

- Mahasiswa mengajukan peminjaman buku melalui sistem.
- Pegawai memeriksa permohonan dan dapat menyetujui atau menolaknya dengan alasan.
- Persetujuan peminjaman mengubah stok tersedia secara transaksional.
- Pegawai mengonfirmasi pengembalian buku dan sistem memperbarui stok.
- Mahasiswa dapat mengajukan perpanjangan masa pinjam; Pegawai memvalidasi permohonan tersebut.
- Mahasiswa dapat memantau status peminjaman aktif dan riwayat transaksi.

### 4. ⏰ Perhitungan dan Pengelolaan Denda

- Sistem menghitung keterlambatan berdasarkan tanggal jatuh tempo dan tanggal pengembalian.
- Nominal denda dihitung berdasarkan jumlah hari keterlambatan dikalikan tarif denda harian yang berlaku pada transaksi.
- Pegawai mencatat pelunasan denda.
- Mahasiswa dengan denda berstatus tertunggak dibatasi untuk mengajukan peminjaman baru sampai kewajibannya diselesaikan.

### 5. ⭐ Rating dan Ulasan Buku

- Mahasiswa dapat memberikan rating skala 1–5 dan komentar ulasan.
- Ulasan hanya dapat diberikan untuk buku yang pernah dipinjam dan transaksinya telah selesai.
- Katalog dan halaman detail buku menampilkan rata-rata rating serta ulasan yang tersedia.

### 6. 🗂️ Pengelolaan Data dan Pengumuman

- **Manajemen pengguna — Admin:** melihat, membuat, mengubah, dan mengelola status akun sesuai aturan sistem.
- **Manajemen kategori — Admin:** mengelola nama kategori, kode klasifikasi, dan deskripsi.
- **Manajemen buku — Pegawai dan Admin:** mengelola metadata buku serta stok koleksi.
- **Manajemen pengumuman — Pegawai dan Admin:** membuat, mengubah, menerbitkan, dan menghapus pengumuman operasional perpustakaan.
- **Pengumuman publik:** Guest dan pengguna terdaftar dapat membaca pengumuman yang telah dipublikasikan.

### 7. 📊 Dashboard Berdasarkan Peran

| Peran | Fokus dashboard |
|---|---|
| **Admin** | Statistik koleksi, jumlah mahasiswa, transaksi aktif, ringkasan denda lunas, manajemen akun dan kategori, serta pemantauan riwayat transaksi. |
| **Pegawai Perpustakaan** | Antrean permohonan pinjam, pengembalian buku, pengelolaan denda, data buku, dan pengumuman. |
| **Mahasiswa** | Peminjaman aktif, tanggal jatuh tempo, pengajuan perpanjangan, riwayat transaksi, ulasan, dan status denda. |
| **Guest** | Penjelajahan homepage, katalog, detail buku, dan pengumuman publik. |

## 🧭 Alur Sirkulasi Buku

Alur utama peminjaman Bo’bo dirancang agar status transaksi dan stok koleksi tetap konsisten.

```text
Mahasiswa mengajukan peminjaman
              │
              ▼
      Menunggu Konfirmasi
              │
       ┌──────┴──────┐
       ▼             ▼
    Disetujui       Ditolak
       │          (dengan alasan)
       ▼
  Sedang Dipinjam
       │
       ▼
Pegawai mengonfirmasi
    pengembalian
       │
       ▼
      Selesai
       │
       ▼
Perhitungan denda jika terlambat
```

**Prinsip penting:** pengajuan yang masih menunggu konfirmasi belum mengurangi stok. Stok berkurang ketika Pegawai menyetujui peminjaman dan bertambah kembali ketika pengembalian dikonfirmasi. Kedua perubahan tersebut harus dilakukan secara aman melalui transaksi PostgreSQL.

## 👥 Tingkat Pengguna

| Role | Hak akses utama |
|---|---|
| **Admin** | Mengelola akun dan kategori, memantau statistik, melihat riwayat transaksi, serta mengakses modul administrasi. |
| **Pegawai Perpustakaan** | Mengelola buku dan pengumuman, memvalidasi peminjaman, memproses pengembalian, serta mencatat pelunasan denda. |
| **Mahasiswa** | Menjelajahi katalog, mengajukan peminjaman dan perpanjangan, memantau transaksi dan denda, serta memberikan ulasan setelah peminjaman selesai. |
| **Guest** | Menjelajahi katalog, detail buku, dan pengumuman publik tanpa melakukan transaksi. |

> Registrasi publik hanya ditujukan untuk Mahasiswa. Akun Admin dan Pegawai dibuat melalui mekanisme administratif yang aman, bukan dengan memilih role pada form registrasi publik.

## 🛠️ Teknologi yang Digunakan

| Bagian | Teknologi | Peran |
|---|---|---|
| Framework | **Next.js App Router** | Routing, halaman, Server Components, Route Handlers, dan Server Actions. |
| Bahasa | **JavaScript (JSX)** | Logika aplikasi dan komponen antarmuka. |
| Styling | **Tailwind CSS** | Sistem styling responsif dan konsistensi UI. |
| Database | **PostgreSQL** | Penyimpanan data pengguna, koleksi, pengumuman, dan transaksi. |
| Database driver | **node-postgres (`pg`)** | Koneksi PostgreSQL dan eksekusi Raw SQL. |
| Password hashing | **bcryptjs** | Hash dan verifikasi password. |

### Prinsip Implementasi Backend

- Query database menggunakan **Raw SQL** dengan parameter (`$1`, `$2`, dan seterusnya) untuk mengurangi risiko SQL Injection.
- Koneksi database menggunakan `pg` dan hanya dijalankan di sisi server.
- **Route Handlers** digunakan untuk endpoint HTTP, seperti registrasi, login, logout, dan kebutuhan API lainnya.
- **Server Actions** digunakan untuk mutasi data dari antarmuka ketika sesuai.
- Validasi input dan pemeriksaan role selalu dilakukan di server.
- Operasi penting seperti persetujuan peminjaman dan pengembalian menggunakan transaksi database.
- Password disimpan sebagai hash bcrypt, bukan plaintext. Sesi menggunakan cookie yang aman; `localStorage` bukan sumber otorisasi.

## 🎨 Identitas Visual

Bo’bo mengusung tema **Cozy Campus Library — Sage & Earth Tone**. Palet dipilih untuk menciptakan suasana lembut dan nyaman, tetapi tetap menjaga keterbacaan serta kesan profesional.

| Warna | Kode | Penggunaan |
|---|---|---|
| 🟩 **Sage Green** | `#929D75` | Warna utama, tombol utama, dan navigasi aktif. |
| 🥛 **Warm Cream** | `#F7EBD8` | Latar utama halaman. |
| 🟫 **Oat Beige** | `#EBCFA9` | Panel, kartu sekunder, dan elemen pendukung. |
| 🧱 **Terracotta** | `#C96858` | Aksen dan penanda perhatian seperlunya. |
| 🟨 **Butter Yellow** | `#F5C875` | Highlight dan informasi pengingat. |
| ☕ **Cocoa Brown** | `#79543D` | Warna teks, judul, dan ikon utama. |

**Arah desain:** gunakan ruang kosong yang cukup, kartu dengan sudut lembut, bayangan ringan, tipografi yang mudah dibaca, ikon konsisten, serta tampilan *mobile-first*. Warna aksen digunakan secara terukur agar informasi penting tetap memiliki hierarki yang jelas.

## 🗃️ Struktur Direktori (Rencana)

Struktur berikut menjadi panduan pengorganisasian kode. Susunan aktual dapat berkembang mengikuti implementasi, tetapi file SQL tetap disimpan di luar direktori `src/app` agar mudah dijalankan dan diperiksa.

```text
bo-bo/
├── database/
│   ├── 01_schema.sql
│   ├── 02_indexes.sql
│   ├── 03_seed.sql
│   └── README.md
├── public/
│   ├── brand/
│   │   └── bo-bo-logo.png
│   ├── covers/
│   └── icons/
├── scripts/
│   └── create-admin.js
├── src/
│   ├── app/
│   │   ├── page.jsx
│   │   ├── layout.jsx
│   │   ├── globals.css
│   │   ├── login/
│   │   ├── register/
│   │   ├── catalog/
│   │   ├── announcements/
│   │   ├── dashboard/
│   │   ├── actions/
│   │   └── api/
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── books/
│   │   ├── forms/
│   │   └── dashboard/
│   ├── lib/
│   │   ├── db.js
│   │   ├── auth/
│   │   ├── queries/
│   │   ├── services/
│   │   ├── validators/
│   │   └── utils/
│   └── proxy.js
├── .env.example
├── .gitignore
├── jsconfig.json
├── package.json
└── README.md
```

> `proxy.js` mengikuti konvensi Next.js 16. Jika versi Next.js yang digunakan berbeda, periksa file convention pada dokumentasi versi tersebut. Proxy hanya melakukan pemeriksaan awal berbasis cookie; otorisasi tetap harus dilakukan di server dekat akses data.

## ⚙️ Panduan Instalasi dan Menjalankan Project

Panduan ini merupakan alur setup yang ditargetkan. Nama database, file SQL, dan perintah dapat disesuaikan jika implementasi repository mengalami perubahan.

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/bobo-digital-library.git
cd bobo-digital-library
```

Ganti `USERNAME` dengan username GitHub pemilik repository.

### 2. Install Dependencies

Pastikan Node.js, npm, dan PostgreSQL sudah terpasang.

```bash
npm install
```

### 3. Buat Database PostgreSQL

Buat database baru, misalnya `bobo_library`, melalui pgAdmin atau PostgreSQL.

```sql
CREATE DATABASE bobo_library;
```

Setelah database dibuat, jalankan file SQL dari pgAdmin secara berurutan:

1. `database/01_schema.sql` — membuat tabel, relasi, dan constraint.
2. `database/02_indexes.sql` — membuat index yang diperlukan.
3. `database/03_seed.sql` — memasukkan kategori dan data awal untuk pengujian.

**Catatan:** seluruh query SQL disimpan di folder `database/`, di luar `src/app`, sesuai ketentuan tugas praktikum.

### 4. Konfigurasi Environment

Buat file `.env.local` di root project (sejajar dengan `package.json`). Isi `DATABASE_URL` sesuai konfigurasi PostgreSQL lokal.

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/bobo_library
```

Ganti `YOUR_PASSWORD` dengan password PostgreSQL milikmu. Jangan mengunggah `.env.local` ke GitHub dan pastikan file tersebut tercantum dalam `.gitignore`.

Jika nilai `.env.local` diubah ketika server sedang berjalan, hentikan server lalu jalankan kembali agar konfigurasi terbaca.

### 5. Siapkan Akun Admin Awal

Akun Admin dan Pegawai tidak dibuat melalui registrasi publik. Buat akun awal menggunakan mekanisme bootstrap yang disediakan project (misalnya script `scripts/create-admin.js`) agar password diproses dengan `bcryptjs`.

Jangan menyimpan password asli di file SQL, README, atau repository publik. Kredensial demo hanya boleh dibagikan melalui cara yang aman dan khusus untuk pengujian.

### 6. Jalankan Aplikasi

```bash
npm run dev
```

Buka aplikasi melalui browser:

```text
http://localhost:3000
```

Untuk memeriksa build production setelah implementasi siap:

```bash
npm run build
npm run start
```

## 🧪 Skenario Pengujian Utama

Skenario berikut dapat digunakan untuk memeriksa alur penting setelah fitur terkait selesai diimplementasikan.

| No. | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Guest membuka homepage dan katalog. | Koleksi dan pengumuman Published dapat dibaca tanpa login. |
| 2 | Guest mencoba mengajukan peminjaman. | Sistem menolak tindakan dan meminta pengguna login sebagai Mahasiswa. |
| 3 | Mahasiswa mendaftar dengan email di luar domain yang diizinkan. | Registrasi ditolak oleh validasi server. |
| 4 | Mahasiswa mengajukan buku dengan stok tersedia. | Permohonan tercatat sebagai Menunggu Konfirmasi; stok belum berkurang. |
| 5 | Pegawai menyetujui permohonan. | Status menjadi Sedang Dipinjam dan stok berkurang tepat satu. |
| 6 | Pegawai menolak permohonan. | Status menjadi Ditolak, alasan tersimpan, dan stok tidak berubah. |
| 7 | Pegawai mengonfirmasi pengembalian. | Status menjadi Selesai dan stok bertambah tepat satu. |
| 8 | Buku dikembalikan melewati tanggal jatuh tempo. | Sistem menghitung dan mencatat denda sesuai tarif dan lama keterlambatan. |
| 9 | Mahasiswa memiliki denda tertunggak lalu mengajukan pinjaman baru. | Pengajuan ditolak hingga denda dilunasi. |
| 10 | Mahasiswa memberi ulasan sebelum pinjaman selesai. | Sistem menolak ulasan; ulasan diizinkan setelah transaksi selesai. |
| 11 | Mahasiswa mencoba membuka halaman atau data milik role lain. | Server menolak akses tanpa mengubah data. |
| 12 | Pegawai mencoba mengonfirmasi pengembalian transaksi yang sama dua kali. | Aksi kedua ditolak dan stok tidak bertambah ganda. |

## 🛣️ Rencana Pengembangan

Pengembangan dilakukan dengan mendahulukan seluruh fitur wajib tugas praktikum. Fitur tambahan baru dipertimbangkan setelah alur inti stabil dan telah diuji.

- [ ] Fondasi Next.js, Tailwind CSS, dan struktur project.
- [ ] Skema PostgreSQL, relasi, constraint, dan data awal.
- [ ] Autentikasi, session, dan RBAC empat tingkat pengguna.
- [ ] Homepage, katalog, pencarian, filter, dan detail buku.
- [ ] Manajemen pengguna, kategori, buku, dan pengumuman.
- [ ] Transaksi peminjaman, persetujuan, dan pengembalian.
- [ ] Perpanjangan, perhitungan denda, dan pelunasan.
- [ ] Rating, ulasan, dan dashboard setiap role.
- [ ] Pengujian menyeluruh, responsivitas, dan persiapan presentasi.

### Pengembangan Opsional (P1)

Fitur berikut merupakan pengembangan lanjutan, bukan syarat inti yang harus didahulukan:

- Sistem reservasi atau antrean buku ketika stok habis.
- Notification log untuk pengingat jatuh tempo, denda, dan keputusan transaksi.
- Ekspor data transaksi dan rekap denda ke CSV.
- Audit log untuk aktivitas administratif dan perubahan data penting.

## 📌 Catatan Keamanan

- Jangan pernah commit `.env.local`, password PostgreSQL, token, atau kredensial pribadi.
- Jangan menyimpan password pengguna dalam bentuk plaintext.
- Jangan mempercayai role atau identitas pengguna yang dikirim dari browser.
- Terapkan pemeriksaan session dan role pada setiap operasi privat di server.
- Gunakan parameterized query untuk seluruh nilai input SQL.
- Jangan menempatkan koneksi PostgreSQL di browser maupun Proxy/Middleware.
- Gunakan transaksi database untuk perubahan stok dan status transaksi yang saling berkaitan.

## 📚 Referensi Proyek

- **TUGAS FINAL Praktikum Pemrograman Web 2026** — acuan fitur, role, alur transaksi, persyaratan teknologi, dan kriteria penilaian.
- **BAB 10 — Next.js Route Handlers & Auth** — acuan pembelajaran Route Handlers, `pg`, PostgreSQL Raw SQL, register/login, serta Authentication dan Authorization.
- **PRD Bo’bo Digital Library** — dokumen kebutuhan produk, rancangan basis data, struktur folder, pemetaan fungsi, keamanan, dan skenario pengujian.

---

<div align="center">
  <sub>Bo’bo (ᨅᨚᨅᨚ) · A Cozy Campus Library Inspired by Bugis Culture</sub>
  <br />
  <sub>Project Praktikum Pemrograman Web 2026 · Universitas Hasanuddin</sub>
</div>
