-- BO'BO (ᨅᨚᨅᨚ) DIGITAL LIBRARY

-- Pastikan extension pgcrypto aktif untuk UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. TABEL USERS
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS fines CASCADE;
DROP TABLE IF EXISTS renewal_requests CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'pegawai', 'mahasiswa')),
    identity_number VARCHAR(50) UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL SESSIONS (HttpOnly Server-side Authentication)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL CATEGORIES (Master Kategori Buku)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    classification_code VARCHAR(30) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL BOOKS (Katalog & Fisik Stok Buku)
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(30) UNIQUE NOT NULL,
    author VARCHAR(150) NOT NULL,
    publisher VARCHAR(150) NOT NULL,
    publication_year INTEGER NOT NULL CHECK (publication_year >= 1500 AND publication_year <= 2100),
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    stock_total INTEGER NOT NULL CHECK (stock_total >= 0),
    stock_available INTEGER NOT NULL CHECK (stock_available >= 0 AND stock_available <= stock_total),
    loan_duration_days INTEGER NOT NULL DEFAULT 7 CHECK (loan_duration_days > 0),
    fine_per_day NUMERIC(12, 2) NOT NULL DEFAULT 1000.00 CHECK (fine_per_day >= 0),
    cover_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL ANNOUNCEMENTS (Pengumuman Operasional & Layanan)
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('OPERASIONAL', 'LAYANAN', 'ACARA')),
    release_at DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL LOANS (Transaksi Peminjaman Sirkulasi)
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    status VARCHAR(25) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'BORROWED', 'COMPLETED', 'REJECTED')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    borrowed_at DATE,
    due_date DATE,
    returned_at DATE,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    rejected_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reject_reason TEXT,
    duration_snapshot INTEGER NOT NULL DEFAULT 7,
    fine_rate_snapshot NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABEL RENEWAL_REQUESTS (Pengajuan Perpanjangan Masa Pinjam)
CREATE TABLE renewal_requests (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER NOT NULL REFERENCES loans(id) ON DELETE RESTRICT,
    status VARCHAR(25) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    old_due_date DATE NOT NULL,
    new_due_date DATE,
    extension_days INTEGER NOT NULL DEFAULT 7 CHECK (extension_days > 0),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABEL FINES (Denda Keterlambatan Pengembalian)
CREATE TABLE fines (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER UNIQUE NOT NULL REFERENCES loans(id) ON DELETE RESTRICT,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    days_late INTEGER NOT NULL DEFAULT 0 CHECK (days_late >= 0),
    daily_rate_snapshot NUMERIC(12, 2) NOT NULL CHECK (daily_rate_snapshot >= 0),
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PAID')),
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE,
    paid_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    payment_method VARCHAR(50) DEFAULT 'Tunai',
    payment_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABEL REVIEWS (Rating dan Ulasan Buku Mahasiswa)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER UNIQUE NOT NULL REFERENCES loans(id) ON DELETE RESTRICT,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
