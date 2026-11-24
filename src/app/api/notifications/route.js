import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const items = [];

  if (user.role === 'admin') {
    try {
      const newStudentsRes = await pool.query(
        `SELECT id, full_name, email, created_at
         FROM users
         WHERE role = 'mahasiswa'
         ORDER BY created_at DESC
         LIMIT 15`
      );

      for (const row of newStudentsRes.rows) {
        items.push({
          id: `admin-user-${row.id}`,
          actor_name: row.full_name,
          message: `mendaftarkan akun mahasiswa baru (${row.email}).`,
          category: 'AKUN',
          link_url: '/dashboard',
          created_at: row.created_at,
        });
      }
    } catch (err) {
      console.error('Error fetching admin user notifications:', err);
    }

    try {
      const recentLoansRes = await pool.query(
        `SELECT l.id, l.status, l.created_at, u.full_name, b.title
         FROM loans l
         JOIN users u ON l.student_id = u.id
         JOIN books b ON l.book_id = b.id
         ORDER BY l.created_at DESC
         LIMIT 15`
      );

      for (const row of recentLoansRes.rows) {
        let actionText = `mengajukan peminjaman buku "${row.title}".`;
        if (row.status === 'BORROWED') {
          actionText = `sedang meminjam buku "${row.title}".`;
        } else if (row.status === 'RETURNED') {
          actionText = `telah mengembalikan buku "${row.title}".`;
        } else if (row.status === 'REJECTED') {
          actionText = `pengajuan pinjam buku "${row.title}" ditolak.`;
        }

        items.push({
          id: `admin-loan-${row.id}-${row.status}`,
          actor_name: row.full_name,
          message: actionText,
          category: 'SIRKULASI',
          link_url: '/dashboard',
          created_at: row.created_at,
        });
      }
    } catch (err) {
      console.error('Error fetching admin loan notifications:', err);
    }
  }

  if (user.role === 'pegawai') {
    try {
      const staffLoansRes = await pool.query(
        `SELECT l.id, l.status, l.created_at, u.full_name, b.title
         FROM loans l
         JOIN users u ON l.student_id = u.id
         JOIN books b ON l.book_id = b.id
         ORDER BY l.created_at DESC
         LIMIT 15`
      );

      for (const row of staffLoansRes.rows) {
        let actionText = `mengajukan peminjaman buku "${row.title}" dan menunggu persetujuan.`;
        if (row.status === 'BORROWED') {
          actionText = `meminjam buku "${row.title}" (Disetujui).`;
        } else if (row.status === 'RETURNED') {
          actionText = `mengembalikan buku "${row.title}".`;
        } else if (row.status === 'REJECTED') {
          actionText = `pengajuan pinjam buku "${row.title}" ditolak.`;
        }

        items.push({
          id: `staff-loan-${row.id}-${row.status}`,
          actor_name: row.full_name,
          message: actionText,
          category: 'SIRKULASI',
          link_url: '/dashboard',
          created_at: row.created_at,
        });
      }
    } catch (err) {
      console.error('Error fetching staff loan notifications:', err);
    }

    try {
      const staffRenewalsRes = await pool.query(
        `SELECT r.id, r.status, r.created_at, u.full_name, b.title
         FROM renewal_requests r
         JOIN loans l ON r.loan_id = l.id
         JOIN users u ON l.student_id = u.id
         JOIN books b ON l.book_id = b.id
         ORDER BY r.created_at DESC
         LIMIT 10`
      );

      for (const row of staffRenewalsRes.rows) {
        let actionText = `mengajukan perpanjangan durasi pinjam buku "${row.title}".`;
        if (row.status === 'APPROVED') {
          actionText = `perpanjangan buku "${row.title}" telah disetujui.`;
        } else if (row.status === 'REJECTED') {
          actionText = `pengajuan perpanjangan buku "${row.title}" ditolak.`;
        }

        items.push({
          id: `staff-renewal-${row.id}-${row.status}`,
          actor_name: row.full_name,
          message: actionText,
          category: 'PERPANJANGAN',
          link_url: '/dashboard',
          created_at: row.created_at,
        });
      }
    } catch (err) {
      console.error('Error fetching staff renewal notifications:', err);
    }

    try {
      const staffFinesRes = await pool.query(
        `SELECT f.id, f.status, f.created_at, u.full_name, b.title
         FROM fines f
         JOIN users u ON f.student_id = u.id
         JOIN loans l ON f.loan_id = l.id
         JOIN books b ON l.book_id = b.id
         ORDER BY f.created_at DESC
         LIMIT 10`
      );

      for (const row of staffFinesRes.rows) {
        items.push({
          id: `staff-fine-${row.id}-${row.status}`,
          actor_name: row.full_name,
          message:
            row.status === 'PAID'
              ? `telah melunasi denda keterlambatan buku "${row.title}".`
              : `memiliki denda keterlambatan belum lunas pada buku "${row.title}".`,
          category: 'DENDA',
          link_url: '/dashboard',
          created_at: row.created_at,
        });
      }
    } catch (err) {
      console.error('Error fetching staff fine notifications:', err);
    }
  }

  if (user.role === 'mahasiswa') {
    try {
      const studentLoansRes = await pool.query(
        `SELECT l.id, l.status, l.created_at, b.title
         FROM loans l
         JOIN books b ON l.book_id = b.id
         WHERE l.student_id = $1
         ORDER BY l.created_at DESC
         LIMIT 15`,
        [user.id]
      );

      for (const row of studentLoansRes.rows) {
        let actor = 'Petugas Perpustakaan';
        let actionText = `menyetujui peminjaman buku "${row.title}". Selamat membaca!`;

        if (row.status === 'PENDING') {
          actor = "Sistem Bo'bo";
          actionText = `pengajuan peminjaman buku "${row.title}" sedang menunggu verifikasi petugas.`;
        } else if (row.status === 'RETURNED') {
          actionText = `mencatat pengembalian buku "${row.title}". Terima kasih!`;
        } else if (row.status === 'REJECTED') {
          actionText = `menolak pengajuan peminjaman buku "${row.title}".`;
        }

        items.push({
          id: `student-loan-${row.id}-${row.status}`,
          actor_name: actor,
          message: actionText,
          category: 'SIRKULASI',
          link_url: '/dashboard',
          created_at: row.created_at,
        });
      }
    } catch (err) {
      console.error('Error fetching student loan notifications:', err);
    }

    try {
      const studentRenewalsRes = await pool.query(
        `SELECT r.id, r.status, r.created_at, b.title
         FROM renewal_requests r
         JOIN loans l ON r.loan_id = l.id
         JOIN books b ON l.book_id = b.id
         WHERE l.student_id = $1
         ORDER BY r.created_at DESC
         LIMIT 10`,
        [user.id]
      );

      for (const row of studentRenewalsRes.rows) {
        let actor = 'Petugas Perpustakaan';
        let actionText = `menyetujui perpanjangan durasi pinjam buku "${row.title}".`;

        if (row.status === 'PENDING') {
          actor = "Sistem Bo'bo";
          actionText = `pengajuan perpanjangan buku "${row.title}" sedang diproses petugas.`;
        } else if (row.status === 'REJECTED') {
          actionText = `menolak pengajuan perpanjangan buku "${row.title}".`;
        }

        items.push({
          id: `student-renewal-${row.id}-${row.status}`,
          actor_name: actor,
          message: actionText,
          category: 'PERPANJANGAN',
          link_url: '/dashboard',
          created_at: row.created_at,
        });
      }
    } catch (err) {
      console.error('Error fetching student renewal notifications:', err);
    }

    try {
      const studentFinesRes = await pool.query(
        `SELECT f.id, f.status, f.created_at, b.title
         FROM fines f
         JOIN loans l ON f.loan_id = l.id
         JOIN books b ON l.book_id = b.id
         WHERE f.student_id = $1
         ORDER BY f.created_at DESC
         LIMIT 10`,
        [user.id]
      );

      for (const row of studentFinesRes.rows) {
        items.push({
          id: `student-fine-${row.id}-${row.status}`,
          actor_name: 'Petugas Perpustakaan',
          message:
            row.status === 'PAID'
              ? `mengonfirmasi pelunasan denda untuk buku "${row.title}".`
              : `mencatat denda keterlambatan pada buku "${row.title}". Segera selesaikan di meja sirkulasi.`,
          category: 'DENDA',
          link_url: '/dashboard',
          created_at: row.created_at,
        });
      }
    } catch (err) {
      console.error('Error fetching student fine notifications:', err);
    }
  }

  // Urutkan dari yang paling baru
  items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return NextResponse.json({
    notifications: items.slice(0, 30),
  });
}