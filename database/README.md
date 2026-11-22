# Panduan Setup Basis Data PostgreSQL — Bo’bo (ᨅᨚᨅᨚ)

Dokumen ini memandu langkah-langkah memulihkan dan menjalankan basis data untuk aplikasi **Bo’bo (ᨅᨚᨅᨚ) Digital Library**.

Sesuai ketentuan **TUGAS FINAL Praktikum Pemrograman Web 2026**, seluruh file SQL disimpan di luar folder `/src/app` agar penilai dapat memeriksa struktur serta menjalankan database secara mandiri melalui pgAdmin.

---

## 📌 Langkah Setup Database di pgAdmin

1. **Buat Database Baru:**
   - Buka **pgAdmin 4**.
   - Klik kanan pada `Databases` $\to$ `Create` $\to$ `Database...`.
   - Masukkan nama database: `bobo_library`.
   - Klik **Save**.

2. **Buka Query Tool pada Database `bobo_library`:**
   - Klik kanan pada database `bobo_library` $\to$ pilih **Query Tool**.

3. **Jalankan File Backup Utama (`database/bobo_library_db.sql`):**
   - Klik ikon folder (**Open File**) pada toolbar Query Tool, lalu pilih **`database/bobo_library_db.sql`**.
   - Klik tombol **Execute (F5)** dan tunggu hingga muncul pesan sukses.
   - *Hasil:* Seluruh struktur 9 tabel (`users`, `sessions`, `categories`, `books`, `announcements`, `loans`, `renewal_requests`, `fines`, dan `reviews`), indeks, akun pengguna awal, 7 kategori, 35 koleksi buku beserta *path* sampul lokal (`/uploads/books/...`), dan pengumuman operasional langsung terpasang utuh.

> **Catatan File Referensi:** File **`database/01_schema.sql`** dan **`database/02_indexes.sql`** tetap disertakan di folder ini sebagai referensi kode DDL murni pembuatan tabel, *constraint*, dan indeks agar mudah ditinjau.

---

## 🔑 Akun Demo 

Semua password akun demo awal telah di-hash secara aman menggunakan `bcryptjs`:

| Role | Nama Pengguna | Email | Password | Identitas / NIM | Keterangan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Administrator Bo'bo | `admin@unhas.ac.id` | `admin123` | `ADM-2026-001` | Akses penuh CMS, Users, Categories, Stats |
| **Pegawai** | Pustakawan Hasan | `pegawai@unhas.ac.id` | `pegawai123` | `PEG-2026-010` | Verifikasi sirkulasi, Buku, Pengumuman, Denda |
| **Mahasiswa** | Nurul Izzah | `mahasiswa@student.unhas.ac.id` | `mahasiswa123` | `D121221001` | Mahasiswa aktif (bebas denda, siap pinjam) |
| **Mahasiswa** | Andi Tenri | `andi@student.unhas.ac.id` | `mahasiswa123` | `D121221002` | Contoh mahasiswa dengan denda Tertunggak |
| **Mahasiswa** | Siti Rahma | `siti@student.unhas.ac.id` | `mahasiswa123` | `D121221003` | Mahasiswa dengan pinjaman aktif & permohonan |
| **Guest** | - | - | - | - | Pengguna umum tanpa login (Katalog & Pengumuman) |