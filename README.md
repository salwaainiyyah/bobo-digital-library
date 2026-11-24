<div align="center">
  <img src="public/brand/bo-bo-logo.png" alt="Maskot Bo’bo, ayam pustakawan yang sedang membaca buku" width="240" />

  <h1>Bo’bo (ᨅᨚᨅᨚ) — Digital Library</h1>

  <strong>A Cozy Campus Library Inspired by Bugis Culture</strong>

  <em>Tempat pengetahuan, cerita, dan wawasan bertumbuh.</em>

  <p>
    <img src="https://img.shields.io/badge/Next.js-App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js App Router" />
    <img src="https://img.shields.io/badge/JavaScript-JSX-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript JSX" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Status-Completed-929D75?style=for-the-badge" alt="Status Completed" />
  </p>
</div>

---

## 🧭 Navigasi

- [Tentang Bo’bo](#-tentang-bobo)
- [Fitur Utama Sistem](#-fitur-utama-sistem)
- [Alur Sirkulasi](#-alur-sirkulasi-buku)
- [Tingkat Pengguna](#-tingkat-pengguna)
- [Teknologi](#️-teknologi-yang-digunakan)
- [Identitas Visual](#-identitas-visual)
- [Struktur Direktori](#️-struktur-direktori)
- [Instalasi](#️-panduan-instalasi-dan-menjalankan-project)
- [Akun Demo](#-akun-demo-untuk-pengujian)
- [Pengujian](#-skenario-pengujian-utama)
- [Status Pengembangan](#️-status-pengembangan)
- [Catatan Keamanan](#-catatan-keamanan)

## 🌿 Tentang Bo’bo

**Bo’bo** berasal dari bahasa Bugis yang berarti **buku**, ditulis menggunakan aksara Lontara **ᨅᨚᨅᨚ**. Nama ini dipilih untuk merepresentasikan ruang berkumpulnya pengetahuan, cerita, dan berbagai wawasan yang dapat dijelajahi oleh setiap pengunjung.

Menariknya, bunyi Bo’bo juga mengingatkan pada suara ayam, *“bok bok bok”*. Kedekatan bunyi tersebut menjadi inspirasi maskot ayam yang sedang membaca buku. Karakter ayam sekaligus memiliki keterkaitan dengan identitas Universitas Hasanuddin yang dikenal melalui julukan **Ayam Jantan dari Timur**.

Bo’bo menggabungkan tiga unsur identitas:

- **Budaya lokal** — bahasa Bugis dan aksara Lontara sebagai representasi budaya.
- **Identitas kampus** — maskot ayam yang terinspirasi dari identitas Universitas Hasanuddin.
- **Literasi digital** — buku sebagai simbol pengetahuan, pembelajaran, dan pengembangan wawasan.

Bo’bo dirancang sebagai sistem informasi perpustakaan digital kampus yang menghubungkan pengalaman menjelajahi katalog interaktif dengan pengelolaan koleksi dan layanan sirkulasi perpustakaan dalam suasana **cozy campus library**: hangat, tenang, ramah, dan tetap profesional.

## ✨ Fitur Utama Sistem

### 1. 📖 Katalog Interaktif dan Penjelajahan Buku

- **Beranda buku terbuka (*Storybook Hero*):** menampilkan ilustrasi buku terbuka dengan tab pembatas interaktif (*Buku Populer*, *Warta Terkini*, *Nilai Bo’bo*) dan pencarian cepat koleksi.
- **Etalase lima buku terpopuler:** menampilkan lima buku dengan frekuensi peminjaman tertinggi pada halaman beranda.
- **Katalog publik lemari rak interaktif:** pengunjung dapat menjelajahi koleksi buku berdasarkan kategori ilmu pengetahuan, sastra & fiksi, maupun pemikiran kritis tanpa harus masuk ke akun.
- **Pencarian, filter, dan pengurutan:** mencari buku berdasarkan judul, penulis, atau ISBN; menyaring per kategori; serta mengurutkan berdasarkan popularitas, tahun terbit, rating, atau abjad judul.
- **Detail buku:** menampilkan ISBN, judul, penulis, penerbit, tahun terbit, kategori, stok tersedia, durasi maksimal peminjaman, tarif denda harian, rata-rata rating, dan ulasan pembaca.

### 2. 🔐 Autentikasi dan Hak Akses

- Login untuk **Admin**, **Pegawai Perpustakaan**, dan **Mahasiswa** dengan validasi kelengkapan format penulisan email sebelum diproses ke server.
- Registrasi mandiri khusus **Mahasiswa** yang **wajib menggunakan email `@student.unhas.ac.id` atau `@gmail.com`** disertai notifikasi peringatan apabila mendaftar di luar kedua domain tersebut.
- Akses **Guest** untuk menjelajahi halaman publik tanpa autentikasi.
- Dashboard dan tindakan yang dibatasi berdasarkan peran pengguna (*Role-Based Access Control* / RBAC) di sisi server.
- Pengelolaan sesi login dan logout berbasis cookie aman.

### 3. 🔄 Peminjaman, Pengembalian, dan Perpanjangan

- Mahasiswa mengajukan peminjaman buku melalui halaman detail koleksi.
- Pegawai memeriksa permohonan di meja sirkulasi dan dapat menyetujui atau menolaknya disertai alasan.
- Persetujuan peminjaman mengurangi stok tersedia secara transaksional; konfirmasi pengembalian menambah stok kembali.
- Mahasiswa dapat mengajukan perpanjangan masa pinjam untuk buku aktif yang belum melewati jatuh tempo; Pegawai memvalidasi permohonan tersebut.
- Mahasiswa dapat memantau status peminjaman aktif dan riwayat transaksi secara real-time.

### 4. ⏰ Perhitungan dan Pengelolaan Denda

- Sistem menghitung keterlambatan otomatis berdasarkan tanggal jatuh tempo dan tanggal pengembalian.
- Nominal denda dihitung berdasarkan jumlah hari keterlambatan dikalikan tarif denda harian buku.
- Pegawai mencatat pelunasan denda di meja sirkulasi.
- Mahasiswa dengan denda berstatus tertunggak dibatasi untuk mengajukan peminjaman baru sampai kewajibannya diselesaikan.

### 5. ⭐ Rating dan Ulasan Buku

- Mahasiswa dapat memberikan rating skala 1–5 dan komentar ulasan.
- Ulasan hanya dapat diberikan untuk buku yang pernah dipinjam dan transaksinya telah selesai.
- Halaman katalog dan detail buku menampilkan rata-rata rating serta ulasan pembaca yang terverifikasi.

### 6. 🔔 Lonceng Notifikasi Aktivitas Berbasis Peran

- Ikon lonceng notifikasi pada bilah navigasi (*Navbar*) menampilkan ringkasan aktivitas terbaru yang disesuaikan dengan peran akun yang sedang masuk:
  - **Admin:** menerima pemberitahuan pendaftaran akun mahasiswa baru dan aktivitas sirkulasi terkini.
  - **Pegawai Perpustakaan:** menerima pemberitahuan pengajuan peminjaman baru, permohonan perpanjangan, pengembalian, serta status denda mahasiswa.
  - **Mahasiswa:** menerima pemberitahuan status persetujuan/penolakan peminjaman, perpanjangan masa pinjam, pengembalian, dan catatan denda.

### 7. 🗂️ Pengelolaan Data, Unggah Sampul Lokal, dan Pengumuman

- **Manajemen pengguna (Admin):** melihat, membuat, mengubah, dan mengelola status aktif/nonaktif akun.
- **Manajemen kategori (Admin):** mengelola nama kategori, kode klasifikasi unik, dan deskripsi.
- **Manajemen buku (Pegawai & Admin):** mengelola metadata buku, jumlah stok, pengarsipan/pengaktifan kembali (*unarsip*), serta **unggah berkas gambar sampul lokal** (`JPG`, `PNG`, `WEBP`, `GIF`) ke `public/uploads/books/` dengan pratinjau langsung.
- **Manajemen pengumuman (Pegawai & Admin):** membuat, mengubah, menerbitkan, dan menghapus warta operasional perpustakaan.

### 8. 📊 Dashboard Berdasarkan Peran

| Peran | Fokus Dashboard |
|---|---|
| **Admin** | Statistik koleksi, jumlah mahasiswa, transaksi aktif, ringkasan denda lunas, manajemen akun dan kategori, serta pemantauan riwayat transaksi. |
| **Pegawai Perpustakaan** | Antrean permohonan pinjam, pengembalian buku, persetujuan perpanjangan, pengelolaan denda, katalog buku, dan warta pengumuman. |
| **Mahasiswa** | Peminjaman aktif, tanggal jatuh tempo, pengajuan perpanjangan, riwayat transaksi, ulasan buku, dan status denda. |
| **Guest** | Penjelajahan homepage, katalog lemari buku, detail buku, dan pengumuman publik. |

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

**Prinsip penting:** pengajuan yang masih menunggu konfirmasi belum mengurangi stok. Stok berkurang ketika Pegawai menyetujui peminjaman dan bertambah kembali ketika pengembalian dikonfirmasi melalui transaksi PostgreSQL.

## 👥 Tingkat Pengguna

| Role | Hak Akses Utama |
|---|---|
| **Admin** | Mengelola akun dan kategori, memantau statistik, melihat riwayat transaksi, serta mengakses modul pengelolaan buku dan pengumuman. |
| **Pegawai Perpustakaan** | Mengelola buku dan pengumuman, memvalidasi peminjaman dan perpanjangan, memproses pengembalian, serta mencatat pelunasan denda. |
| **Mahasiswa** | Menjelajahi katalog, mengajukan peminjaman dan perpanjangan, memantau transaksi dan denda, serta memberikan ulasan setelah peminjaman selesai. |
| **Guest** | Menjelajahi katalog, detail buku, dan pengumuman publik tanpa melakukan transaksi. |

> **Kebijakan Pendaftaran Akun:** Registrasi publik hanya ditujukan untuk Mahasiswa dan **wajib menggunakan alamat email `@student.unhas.ac.id` atau `@gmail.com`**. Mahasiswa **tidak dapat** mendaftar mandiri menggunakan email `@unhas.ac.id`, karena domain `@unhas.ac.id` dikhususkan untuk akun internal **Admin** dan **Pegawai Perpustakaan** yang dibuat langsung oleh Admin.

## 🛠️ Teknologi yang Digunakan

| Bagian | Teknologi | Peran |
|---|---|---|
| Framework | **Next.js App Router** | Routing, halaman, Server Components, Route Handlers, dan Server Actions. |
| Bahasa | **JavaScript (JSX)** | Logika aplikasi dan komponen antarmuka. |
| Styling | **Tailwind CSS** | Sistem styling responsif dan konsistensi komponen UI. |
| Database | **PostgreSQL** | Penyimpanan data pengguna, kategori, koleksi buku, pengumuman, dan transaksi. |
| Database Driver | **node-postgres (`pg`)** | Koneksi PostgreSQL dan eksekusi parameterized Raw SQL. |
| Password Hashing | **bcryptjs** | Hash dan verifikasi kata sandi pengguna. |

### Prinsip Implementasi Backend

- Query database menggunakan **Raw SQL** dengan parameter (`$1`, `$2`, dan seterusnya) untuk mencegah SQL Injection.
- Koneksi database menggunakan `pg` dan hanya dijalankan di sisi server.
- **Route Handlers** digunakan untuk endpoint HTTP seperti registrasi, login, logout, dan ringkasan notifikasi aktivitas.
- **Server Actions** digunakan untuk mutasi data sirkulasi, unggah sampul buku, kategori, pengguna, dan pengumuman.
- Validasi input dan pemeriksaan role selalu dilakukan di sisi server.
- Operasi penting seperti persetujuan peminjaman dan pengembalian menggunakan transaksi database (`BEGIN` / `COMMIT` / `ROLLBACK`).
- Password disimpan sebagai hash `bcryptjs`, bukan plaintext, dan sesi menggunakan cookie HTTP-only yang aman.

## 🎨 Identitas Visual

Bo’bo mengusung tema **Cozy Campus Library — Sage & Earth Tone**. Palet dipilih untuk menciptakan suasana lembut dan hangat, tetapi tetap menjaga keterbacaan serta kesan profesional.

| Warna | Kode | Penggunaan |
|---|---|---|
| 🟩 **Sage Green** | `#929D75` / `#7B9663` | Warna utama, tombol aksi utama, dan navigasi aktif. |
| 🥛 **Warm Cream** | `#F7EBD8` / `#FFFDF9` | Latar utama halaman dan permukaan kartu perkamen. |
| 🟫 **Oat Beige** | `#EBCFA9` / `#DFC19A` | Bingkai rak kayu, panel sekunder, dan garis pemisah. |
| 🧱 **Terracotta** | `#C96858` | Penanda denda, keterlambatan, dan aksi pengarsipan. |
| 🟨 **Butter Yellow** | `#F5C875` | Highlight status menunggu konfirmasi dan informasi pengingat. |
| ☕ **Cocoa Brown** | `#79543D` / `#5A3E28` | Warna teks utama, judul editorial, dan ikon. |

## 🗃️ Struktur Direktori

Seluruh file SQL disimpan di direktori `database/` di luar `src/app`, sedangkan berkas gambar sampul buku tersimpan di `public/uploads/books/` agar ikut terbawa saat repositori di-*clone*.

```text
bo-bo/
├── database/
│   ├── bobo_library_db.sql      # Full backup PostgreSQL (skema, indeks, akun demo, & 35 buku)
│   ├── 01_schema.sql            # Referensi DDL pembuatan 9 tabel dan constraint
│   ├── 02_indexes.sql           # Referensi DDL pembuatan indeks performa query
│   └── README.md                # Panduan teknis setup basis data
├── public/
│   ├── brand/
│   │   └── bo-bo-logo.png
│   └── uploads/
│       └── books/               # Berkas gambar sampul buku lokal
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
│   │       ├── auth/
│   │       └── notifications/
│   ├── components/
│   │   ├── layout/              # Navbar, NotificationBell, Footer, BoboIntro
│   │   ├── ui/
│   │   ├── books/               # FeaturedCarousel (3D Hardcover), BookManager, dll.
│   │   ├── forms/
│   │   └── dashboard/
│   ├── lib/
│   │   ├── db.js
│   │   ├── upload.js            # Validasi & penyimpanan berkas sampul buku lokal
│   │   ├── constants.js
│   │   ├── auth/
│   │   ├── queries/
│   │   ├── services/
│   │   ├── validators/
│   │   └── utils/
│   └── proxy.js
├── .env.example
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
└── README.md
```

## ⚙️ Panduan Instalasi dan Menjalankan Project

### 1. Clone Repository

```bash
git clone [https://github.com/salwaainiyyah/bobo-digital-library.git](https://github.com/salwaainiyyah/bobo-digital-library.git)
cd bobo-digital-library
```

*(Sesuaikan URL repositori dengan alamat repositori GitHub proyek ini.)*

### 2. Install Dependencies (`npm install`)

Pastikan **Node.js**, **npm**, dan **PostgreSQL** sudah terpasang di perangkat. **Wajib menjalankan `npm install` terlebih dahulu** untuk mengunduh seluruh pustaka yang diperlukan proyek sebelum memulai server:

```bash
npm install
```

### 3. Buat dan Isi Database PostgreSQL

1. Buka **pgAdmin 4**, klik kanan pada `Databases` → `Create` → `Database...`, lalu buat database baru bernama **`bobo_library`**:
   ```sql
   CREATE DATABASE bobo_library;
   ```
2. Klik kanan pada database **`bobo_library`** → pilih **Query Tool**.
3. Klik ikon folder (**Open File**) pada toolbar Query Tool, pilih file **`database/bobo_library_db.sql`**, lalu tekan **Execute (F5)**.
- *Hasil:* Seluruh struktur 9 tabel (`users`, `sessions`, `categories`, `books`, `announcements`, `loans`, `renewal_requests`, `fines`, dan `reviews`), indeks, akun demo, pengumuman, 7 kategori, dan 35 koleksi buku beserta alamat sampul lokal (`/uploads/books/...`) langsung terpasang utuh.
  - *(File `database/01_schema.sql` dan `database/02_indexes.sql` juga tersedia di folder `database/` sebagai referensi kode DDL murni.)*

### 4. Konfigurasi Environment

Salin file `.env.example` menjadi **`.env.local`** di root project (sejajar dengan `package.json`), lalu sesuaikan password PostgreSQL lokal Anda:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/bobo_library
SESSION_SECRET=bobo_secret_library_key_2026_unhas_bugis_cozy
ALLOWED_EMAIL_DOMAINS=student.unhas.ac.id,gmail.com
TZ=Asia/Makassar
```

Ganti `YOUR_PASSWORD` dengan password PostgreSQL milik Anda. Jangan mengunggah `.env.local` ke GitHub (file ini sudah dikecualikan di `.gitignore`).

### 5. Jalankan Aplikasi

```bash
npm run dev
```

Buka aplikasi melalui browser di alamat:

```text
http://localhost:3000
```

Untuk memeriksa build production:

```bash
npm run build
npm run start
```

## 🔑 Akun Demo untuk Pengujian

Semua password akun demo awal telah di-hash secara aman menggunakan `bcryptjs`. Selain akun **Admin** dan **Pegawai**, basis data demo dilengkapi **6 akun mahasiswa** dengan riwayat transaksi yang beragam agar seluruh alur sirkulasi dapat langsung diuji.

### Daftar Akun Pengelola & 6 Mahasiswa Demo

| Role | Nama Pengguna | Email | Password | Identitas / NIM | Ilustrasi Kondisi & Aktivitas Demo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Administrator Bo'bo | `admin@unhas.ac.id` | `admin123` | `ADM-2026-001` | Akses penuh manajemen akun, kategori, koleksi, warta, dan statistik sistem. |
| **Pegawai** | Pustakawan Hasan | `pegawai@unhas.ac.id` | `pegawai123` | `PEG-2026-010` | Meja sirkulasi: verifikasi pinjam & perpanjangan, pengembalian, denda, dan buku. |
| **Mahasiswa** | **Aliyah** | `aliyah@student.unhas.ac.id` | `mahasiswa123` | `D121221001` | Peminjam aktif yang telah menyelesaikan beberapa peminjaman dan menuliskan ulasan terverifikasi (*Laut Bercerita*, *The Hunger Games*). |
| **Mahasiswa** | **Aura** | `aura@student.unhas.ac.id` | `mahasiswa123` | `D121221002` | Memiliki riwayat keterlambatan pengembalian (*The Kite Runner*) dengan status **denda Tertunggak (`UNPAID`)** untuk menguji pembatasan pinjam & pelunasan denda. |
| **Mahasiswa** | **Talista** | `talista@student.unhas.ac.id` | `mahasiswa123` | `D121221003` | Sedang meminjam buku (*Bumi Manusia*) dan memiliki permohonan **perpanjangan masa pinjam** untuk diuji verifikasinya oleh Pegawai. |
| **Mahasiswa** | **Nita** | `nita@student.unhas.ac.id` | `mahasiswa123` | `D121221004` | Baru mengajukan peminjaman (*Madilog*) berstatus **Menunggu Konfirmasi (`PENDING`)** yang siap disetujui/ditolak oleh Pegawai. |
| **Mahasiswa** | **Addah** | `addah@student.unhas.ac.id` | `mahasiswa123` | `D121221005` | Telah menyelesaikan peminjaman & pengembalian (*Dari Dalam Kubur*) serta memberikan ulasan pembaca terverifikasi. |
| **Mahasiswa** | **Pisya** | `pisya@student.unhas.ac.id` | `mahasiswa123` | `D121221006` | Anggota mahasiswa baru dengan kuota pinjam penuh (`0` pinjaman aktif), siap digunakan untuk simulasi pengajuan pinjaman baru dari awal. |
| **Guest** | - | - | - | - | Pengunjung umum tanpa login (jelajah beranda, katalog lemari buku, & warta). |

## 🧪 Skenario Pengujian Utama

| No. | Skenario | Hasil yang Diharapkan |
|---|---|---|
| 1 | Guest membuka homepage dan katalog. | Koleksi lemari buku, Top 5 buku terpopuler, dan pengumuman terbit dapat dibaca tanpa login. |
| 2 | Guest mencoba mengajukan peminjaman. | Guest tidak dapat melakukan peminjaman dan diminta untuk masuk sebagai mahasiswa unhas apabila ingin melakukan peminjaman. |
| 3 | Pengguna login dengan penulisan email yang belum lengkap (misal `aliyah@` atau `nama@student`). | Sistem menahan pengiriman dan menampilkan notifikasi peringatan bahwa format penulisan email belum lengkap. |
| 4 | Mahasiswa mendaftar dengan email di luar domain `@student.unhas.ac.id` atau `@gmail.com` (termasuk `@unhas.ac.id`). | Registrasi ditolak dengan notifikasi peringatan bahwa mahasiswa wajib mendaftar menggunakan email `@student.unhas.ac.id` atau `@gmail.com`. |
| 5 | Mahasiswa mengajukan buku dengan stok tersedia. | Permohonan tercatat sebagai Menunggu Konfirmasi; stok belum berkurang. |
| 6 | Pegawai menyetujui permohonan. | Status menjadi Sedang Dipinjam, stok berkurang tepat satu, dan notifikasi pembaruan muncul pada lonceng mahasiswa. |
| 7 | Pegawai menolak permohonan. | Status menjadi Ditolak, alasan tersimpan, dan stok tidak berubah. |
| 8 | Pegawai mengonfirmasi pengembalian. | Status menjadi Selesai dan stok bertambah tepat satu. |
| 9 | Buku dikembalikan melewati tanggal jatuh tempo. | Sistem menghitung dan mencatat denda sesuai tarif dan lama keterlambatan. |
| 10 | Mahasiswa memiliki denda tertunggak lalu mengajukan pinjaman baru. | Pengajuan ditolak hingga denda dilunasi. |
| 11 | Mahasiswa memberi ulasan sebelum pinjaman selesai. | Sistem menolak ulasan; ulasan diizinkan setelah transaksi selesai. |
| 12 | Mahasiswa mencoba membuka halaman atau data milik role lain. | Server menolak akses tanpa mengubah data. |
| 13 | Pegawai mencoba mengonfirmasi pengembalian transaksi yang sama dua kali. | Aksi kedua ditolak dan stok tidak bertambah ganda. |

## 📌 Catatan Keamanan

- Jangan pernah commit `.env.local`, password PostgreSQL pribadi, atau token rahasia ke repositori publik.
- Password pengguna disimpan menggunakan hash `bcryptjs`, bukan plaintext.
- Otorisasi dan validasi role selalu dijalankan di server pada setiap Route Handler dan Server Action.
- Seluruh query PostgreSQL menggunakan parameterized query (`$1`, `$2`, dst.) untuk mencegah SQL Injection.
- Perubahan stok buku dan status transaksi peminjaman/pengembalian dibungkus dalam transaksi PostgreSQL agar data tetap konsisten.

---

<div align="center">
  <sub>Bo’bo (ᨅᨚᨅᨚ)</sub>
  <br />
  <sub>Project Praktikum Pemrograman Web 2026</sub>
</div>