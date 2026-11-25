import pool from '@/lib/db';
import { LOAN_STATUS } from '@/lib/constants';

export async function createReview({ loanId, studentId, rating, comment }) {
  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new Error('Rating harus berupa bilangan bulat antara 1 hingga 5 bintang.');
  }

  // 1. Verifikasi kelayakan loan: harus milik mahasiswa tersebut dan berstatus COMPLETED
  const loanCheck = await pool.query(
    'SELECT id, book_id, status, student_id FROM loans WHERE id = $1',
    [loanId]
  );

  if (loanCheck.rows.length === 0) {
    throw new Error('Transaksi peminjaman tidak ditemukan.');
  }

  const loan = loanCheck.rows[0];
  if (loan.student_id !== studentId) {
    throw new Error('Anda tidak memiliki hak memberikan ulasan untuk transaksi peminjaman milik pengguna lain.');
  }

  if (loan.status !== LOAN_STATUS.COMPLETED) {
    throw new Error('Ulasan hanya dapat diberikan setelah buku fisik selesai dikembalikan ke perpustakaan.');
  }

  // 2. Simpan ulasan
  const result = await pool.query(
    `INSERT INTO reviews (loan_id, student_id, book_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (loan_id)
     DO UPDATE SET 
       rating = EXCLUDED.rating,
       comment = EXCLUDED.comment,
       updated_at = CURRENT_TIMESTAMP
     RETURNING id, rating, comment, created_at`,
    [loan.id, studentId, loan.book_id, numericRating, comment?.trim() || null]
  );

  return result.rows[0];
}
