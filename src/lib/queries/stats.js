import pool from '@/lib/db';

export async function getAdminStats() {
  const statsQuery = `
    SELECT
      (SELECT COUNT(*) FROM books WHERE is_active = TRUE) AS total_titles,
      (SELECT COALESCE(SUM(stock_total), 0) FROM books WHERE is_active = TRUE) AS total_copies,
      (SELECT COUNT(*) FROM users WHERE role = 'mahasiswa' AND is_active = TRUE) AS total_students,
      (SELECT COUNT(*) FROM loans WHERE status = 'BORROWED') AS active_loans,
      (SELECT COUNT(*) FROM loans WHERE status = 'PENDING') AS pending_requests,
      (SELECT COALESCE(SUM(amount), 0) FROM fines WHERE status = 'PAID') AS total_fines_paid,
      (SELECT COALESCE(SUM(amount), 0) FROM fines WHERE status = 'UNPAID') AS total_fines_unpaid;
  `;
  const result = await pool.query(statsQuery);
  const row = result.rows[0];

  return {
    totalTitles: parseInt(row.total_titles, 10),
    totalCopies: parseInt(row.total_copies, 10),
    totalStudents: parseInt(row.total_students, 10),
    activeLoans: parseInt(row.active_loans, 10),
    pendingRequests: parseInt(row.pending_requests, 10),
    totalFinesPaid: parseFloat(row.total_fines_paid),
    totalFinesUnpaid: parseFloat(row.total_fines_unpaid),
  };
}
