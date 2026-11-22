import pool from '@/lib/db';
import { LOAN_STATUS, FINE_STATUS, DEFAULT_CONFIG } from '@/lib/constants';

export async function requestLoan(studentId, bookId) {
  const client = await pool.connect();
  try {
    // Periksa akun mahasiswa
    const studentRes = await client.query(
      'SELECT id, is_active FROM users WHERE id = $1 AND role = $2',
      [studentId, 'mahasiswa']
    );
    if (studentRes.rows.length === 0 || !studentRes.rows[0].is_active) {
      throw new Error('Akun mahasiswa tidak ditemukan atau sedang nonaktif.');
    }

    // Periksa tanggungan denda tertunggak (UNPAID)
    const unpaidFineRes = await client.query(
      'SELECT id, amount FROM fines WHERE student_id = $1 AND status = $2',
      [studentId, FINE_STATUS.UNPAID]
    );
    if (unpaidFineRes.rows.length > 0) {
      throw new Error('Pengajuan pinjaman ditolak karena Anda masih memiliki denda yang belum dilunasi.');
    }

    // Periksa ketersediaan buku & stok
    const bookRes = await client.query(
      'SELECT id, title, stock_available, loan_duration_days, fine_per_day, is_active FROM books WHERE id = $1',
      [bookId]
    );
    if (bookRes.rows.length === 0 || !bookRes.rows[0].is_active) {
      throw new Error('Buku yang diminta tidak tersedia dalam katalog aktif.');
    }

    const book = bookRes.rows[0];
    if (book.stock_available <= 0) {
      throw new Error('Stok fisik buku saat ini sedang habis.');
    }

    // Periksa apakah sudah ada peminjaman aktif atau pending untuk buku yang sama
    const duplicateRes = await client.query(
      `SELECT id, status FROM loans 
       WHERE student_id = $1 AND book_id = $2 AND status IN ($3, $4)`,
      [studentId, bookId, LOAN_STATUS.PENDING, LOAN_STATUS.BORROWED]
    );
    if (duplicateRes.rows.length > 0) {
      throw new Error('Anda sudah memiliki permohonan atau peminjaman aktif untuk buku ini.');
    }

    // Buat entri loan baru dengan status PENDING
    const insertRes = await client.query(
      `INSERT INTO loans (student_id, book_id, status, duration_snapshot, fine_rate_snapshot)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, status, requested_at`,
      [studentId, bookId, LOAN_STATUS.PENDING, book.loan_duration_days, book.fine_per_day]
    );

    return insertRes.rows[0];
  } finally {
    client.release();
  }
}

export async function approveLoan(loanId, staffId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Ambil info loan
    const loanRes = await client.query(
      'SELECT id, book_id, duration_snapshot, status FROM loans WHERE id = $1 FOR UPDATE',
      [loanId]
    );

    if (loanRes.rows.length === 0) {
      throw new Error('Permohonan peminjaman tidak ditemukan.');
    }

    const loan = loanRes.rows[0];
    if (loan.status !== LOAN_STATUS.PENDING) {
      throw new Error(`Permohonan ini tidak dapat disetujui karena statusnya adalah "${loan.status}".`);
    }

    // Potong stok buku secara atomik
    const updateBookRes = await client.query(
      `UPDATE books 
       SET stock_available = stock_available - 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_active = TRUE AND stock_available > 0
       RETURNING id, stock_available`,
      [loan.book_id]
    );

    if (updateBookRes.rows.length === 0) {
      await client.query('ROLLBACK');
      throw new Error('Stok buku telah habis saat verifikasi. Permohonan tidak dapat disetujui.');
    }

    // Perbarui status loan menjadi BORROWED
    const updateLoanRes = await client.query(
      `UPDATE loans
       SET status = $1,
           approved_at = CURRENT_TIMESTAMP,
           borrowed_at = CURRENT_DATE,
           due_date = CURRENT_DATE + duration_snapshot,
           approved_by = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND status = $4
       RETURNING id, status, borrowed_at, due_date`,
      [LOAN_STATUS.BORROWED, staffId, loanId, LOAN_STATUS.PENDING]
    );

    await client.query('COMMIT');
    return updateLoanRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function rejectLoan(loanId, staffId, rejectReason) {
  if (!rejectReason || rejectReason.trim() === '') {
    throw new Error('Alasan penolakan wajib disertakan.');
  }

  const client = await pool.connect();
  try {
    const res = await client.query(
      `UPDATE loans
       SET status = $1,
           rejected_by = $2,
           reject_reason = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND status = $5
       RETURNING id, status, reject_reason`,
      [LOAN_STATUS.REJECTED, staffId, rejectReason.trim(), loanId, LOAN_STATUS.PENDING]
    );

    if (res.rows.length === 0) {
      throw new Error('Permohonan tidak dapat ditolak karena sudah diproses atau dibatalkan.');
    }

    return res.rows[0];
  } finally {
    client.release();
  }
}

export async function returnLoan(loanId, staffId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Kunci dan perbarui loan jika statusnya BORROWED
    const loanRes = await client.query(
      `UPDATE loans
       SET status = $1,
           returned_at = CURRENT_DATE,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND status = $3
       RETURNING id, student_id, book_id, due_date, returned_at, fine_rate_snapshot`,
      [LOAN_STATUS.COMPLETED, loanId, LOAN_STATUS.BORROWED]
    );

    if (loanRes.rows.length === 0) {
      await client.query('ROLLBACK');
      throw new Error('Buku tidak dapat dikembalikan karena tidak berstatus sedang dipinjam atau sudah selesai sebelumnya.');
    }

    const loan = loanRes.rows[0];

    // Kembalikan stok buku secara atomik
    await client.query(
      `UPDATE books
       SET stock_available = stock_available + 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [loan.book_id]
    );

    // Periksa dan hitung denda jika ada keterlambatan
    const dueDate = new Date(loan.due_date);
    const returnDate = new Date(loan.returned_at);
    
    // Selisih hari dalam UTC/Asia Makassar
    const diffTime = returnDate.getTime() - dueDate.getTime();
    const daysLate = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    let fineRecord = null;
    if (daysLate > 0) {
      const fineAmount = daysLate * parseFloat(loan.fine_rate_snapshot);
      const fineRes = await client.query(
        `INSERT INTO fines (loan_id, student_id, days_late, daily_rate_snapshot, amount, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, amount, days_late, status`,
        [loan.id, loan.student_id, daysLate, loan.fine_rate_snapshot, fineAmount, FINE_STATUS.UNPAID]
      );
      fineRecord = fineRes.rows[0];
    }

    await client.query('COMMIT');
    return {
      loanId: loan.id,
      daysLate,
      fine: fineRecord,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function requestRenewal(studentId, loanId) {
  const client = await pool.connect();
  try {
    // Cek pinjaman milik mahasiswa yang bersangkutan
    const loanRes = await client.query(
      `SELECT id, student_id, status, due_date, duration_snapshot
       FROM loans WHERE id = $1`,
      [loanId]
    );

    if (loanRes.rows.length === 0 || loanRes.rows[0].student_id !== studentId) {
      throw new Error('Data transaksi peminjaman tidak ditemukan atau bukan milik Anda.');
    }

    const loan = loanRes.rows[0];
    if (loan.status !== LOAN_STATUS.BORROWED) {
      throw new Error('Perpanjangan hanya dapat diajukan untuk buku yang sedang aktif dipinjam.');
    }

    // Cek apakah sudah terlambat (overdue)
    const today = new Date().toISOString().split('T')[0];
    const dueDateStr = new Date(loan.due_date).toISOString().split('T')[0];
    if (today > dueDateStr) {
      throw new Error('Masa pinjam buku telah melewati tanggal jatuh tempo. Perpanjangan tidak diizinkan; harap segera mengembalikan buku ke meja sirkulasi.');
    }

    // Cek apakah sudah pernah ada permohonan renewal yang disetujui (max 1x)
    const approvedRenewalRes = await client.query(
      `SELECT COUNT(*) AS count FROM renewal_requests WHERE loan_id = $1 AND status = 'APPROVED'`,
      [loanId]
    );
    if (parseInt(approvedRenewalRes.rows[0].count, 10) >= DEFAULT_CONFIG.MAX_RENEWALS) {
      throw new Error(`Batas maksimal perpanjangan (${DEFAULT_CONFIG.MAX_RENEWALS} kali) untuk transaksi ini telah tercapai.`);
    }

    // Cek apakah ada permohonan renewal yang sedang pending
    const pendingRenewalRes = await client.query(
      `SELECT id FROM renewal_requests WHERE loan_id = $1 AND status = 'PENDING'`,
      [loanId]
    );
    if (pendingRenewalRes.rows.length > 0) {
      throw new Error('Permohonan perpanjangan sebelumnya masih menunggu verifikasi pegawai.');
    }

    // Buat entri permohonan renewal
    const extensionDays = DEFAULT_CONFIG.RENEWAL_EXTENSION_DAYS;
    const insertRes = await client.query(
      `INSERT INTO renewal_requests (loan_id, status, old_due_date, extension_days)
       VALUES ($1, 'PENDING', $2, $3)
       RETURNING id, status, old_due_date, extension_days, requested_at`,
      [loanId, loan.due_date, extensionDays]
    );

    return insertRes.rows[0];
  } finally {
    client.release();
  }
}

export async function decideRenewal(renewalId, staffId, decision, rejectionReason = '') {
  if (!['APPROVED', 'REJECTED'].includes(decision)) {
    throw new Error('Keputusan perpanjangan harus berupa APPROVED atau REJECTED.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const renewalRes = await client.query(
      `SELECT id, loan_id, old_due_date, extension_days, status
       FROM renewal_requests WHERE id = $1 FOR UPDATE`,
      [renewalId]
    );

    if (renewalRes.rows.length === 0) {
      throw new Error('Permohonan perpanjangan tidak ditemukan.');
    }

    const renewal = renewalRes.rows[0];
    if (renewal.status !== 'PENDING') {
      throw new Error('Permohonan perpanjangan ini sudah diproses sebelumnya.');
    }

    if (decision === 'APPROVED') {
      const updateRenewalRes = await client.query(
        `UPDATE renewal_requests
         SET status = 'APPROVED',
             reviewed_at = CURRENT_TIMESTAMP,
             reviewed_by = $1,
             new_due_date = old_due_date + extension_days
         WHERE id = $2
         RETURNING id, new_due_date`,
        [staffId, renewalId]
      );

      // Perbarui jatuh tempo di tabel loans
      await client.query(
        `UPDATE loans
         SET due_date = due_date + $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [renewal.extension_days, renewal.loan_id]
      );

      await client.query('COMMIT');
      return updateRenewalRes.rows[0];
    } else {
      const updateRenewalRes = await client.query(
        `UPDATE renewal_requests
         SET status = 'REJECTED',
             reviewed_at = CURRENT_TIMESTAMP,
             reviewed_by = $1,
             rejection_reason = $2
         WHERE id = $3
         RETURNING id, rejection_reason`,
        [staffId, rejectionReason?.trim() || 'Ditolak oleh staf sirkulasi', renewalId]
      );

      await client.query('COMMIT');
      return updateRenewalRes.rows[0];
    }
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
