-- BO'BO (ᨅᨚᨅᨚ) DIGITAL LIBRARY - DATABASE INDEXES
-- Kebutuhan: Optimasi Kueri, Pencarian Cepat, Filter, dan Agregasi Dashboard

-- Index Pengguna & Sesi
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Index Buku & Kategori
CREATE INDEX IF NOT EXISTS idx_books_category_id ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_title_trgm ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_is_active ON books(is_active);

-- Index Pengumuman Publik
CREATE INDEX IF NOT EXISTS idx_announcements_status_release ON announcements(status, release_at DESC);

-- Index Transaksi Sirkulasi Peminjaman
CREATE INDEX IF NOT EXISTS idx_loans_student_status ON loans(student_id, status);
CREATE INDEX IF NOT EXISTS idx_loans_book_status ON loans(book_id, status);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(due_date);

-- Index Denda & Ulasan
CREATE INDEX IF NOT EXISTS idx_fines_student_status ON fines(student_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_renewal_loan_status ON renewal_requests(loan_id, status);
