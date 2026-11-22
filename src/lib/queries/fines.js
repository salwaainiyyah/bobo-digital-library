import pool from '@/lib/db';
import { FINE_STATUS } from '@/lib/constants';

export async function hasUnpaidFine(studentId) {
  const result = await pool.query(
    'SELECT id FROM fines WHERE student_id = $1 AND status = $2 LIMIT 1',
    [studentId, FINE_STATUS.UNPAID]
  );
  return result.rows.length > 0;
}

export async function getStudentFines(studentId) {
  const query = `
    SELECT 
      f.id, f.loan_id, f.days_late, f.daily_rate_snapshot, f.amount, f.status,
      f.assessed_at, f.paid_at, f.payment_method, f.payment_note,
      b.title AS book_title, b.isbn,
      l.due_date, l.returned_at
    FROM fines f
    JOIN loans l ON f.loan_id = l.id
    JOIN books b ON l.book_id = b.id
    WHERE f.student_id = $1
    ORDER BY f.status ASC, f.assessed_at DESC;
  `;
  const result = await pool.query(query, [studentId]);
  return result.rows;
}

export async function getAllUnpaidFines() {
  const query = `
    SELECT 
      f.id, f.loan_id, f.student_id, f.days_late, f.daily_rate_snapshot, f.amount, f.status,
      f.assessed_at,
      u.full_name AS student_name, u.identity_number AS student_nim, u.email AS student_email,
      b.title AS book_title, b.isbn,
      l.due_date, l.returned_at
    FROM fines f
    JOIN users u ON f.student_id = u.id
    JOIN loans l ON f.loan_id = l.id
    JOIN books b ON l.book_id = b.id
    WHERE f.status = 'UNPAID'
    ORDER BY f.assessed_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function payFine(fineId, staffId, paymentMethod = 'Tunai', paymentNote = '') {
  const query = `
    UPDATE fines
    SET status = $1,
        paid_at = CURRENT_TIMESTAMP,
        paid_by = $2,
        payment_method = $3,
        payment_note = $4,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5 AND status = $6
    RETURNING id, amount, status, paid_at;
  `;
  const result = await pool.query(query, [
    FINE_STATUS.PAID,
    staffId,
    paymentMethod?.trim() || 'Tunai',
    paymentNote?.trim() || null,
    fineId,
    FINE_STATUS.UNPAID,
  ]);

  if (result.rows.length === 0) {
    throw new Error('Denda tidak ditemukan atau sudah dibayar lunas sebelumnya.');
  }

  return result.rows[0];
}
