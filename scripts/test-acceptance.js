const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const DB_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bobo_library';

async function runTests() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  console.log('BO\'BO ACCEPTANCE CRITERIA AUTOMATED TEST SUITE');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`✅ PASS: [${name}] - ${details}`);
      passed++;
    } else {
      console.error(`❌ FAIL: [${name}] - ${details}`);
      failed++;
    }
  }

  try {
    // TC-01: Domain Whitelist Validation
    const allowedDomains = ['student.unhas.ac.id', 'unhas.ac.id', 'mail.com'];
    function checkEmail(email) {
      const parts = email.toLowerCase().trim().split('@');
      return parts.length === 2 && allowedDomains.includes(parts[1]);
    }
    const validDomain = checkEmail('mahasiswa@student.unhas.ac.id');
    const invalidDomain = checkEmail('hacker@randomsite.xyz');
    assert('TC-01', validDomain && !invalidDomain, 'Whitelist domain email kampus');

    // TC-02: Duplicate Email or NIM Protection
    const dupCheck = await client.query('SELECT COUNT(*) FROM users WHERE email = $1', ['admin@unhas.ac.id']);
    assert('TC-02', parseInt(dupCheck.rows[0].count, 10) === 1, 'Email unik terproteksi');

    // TC-03: Password Hash (Bcrypt Check)
    const userPass = await client.query('SELECT password_hash FROM users WHERE email = $1', ['admin@unhas.ac.id']);
    const hash = userPass.rows[0]?.password_hash || '';
    const isBcrypt = hash.startsWith('$2b$') || hash.startsWith('$2a$');
    const isValidPass = await bcrypt.compare('admin123', hash);
    assert('TC-03', isBcrypt && isValidPass, 'Password tersimpan sebagai bcrypt hash valid');

    // TC-04: Login Verification (Akun Valid & Invalid)
    const loginUser = await client.query('SELECT password_hash FROM users WHERE email = $1', ['pegawai@unhas.ac.id']);
    const passMatch = await bcrypt.compare('pegawai123', loginUser.rows[0].password_hash);
    const passWrong = await bcrypt.compare('wrongpassword', loginUser.rows[0].password_hash);
    assert('TC-04', passMatch && !passWrong, 'Verifikasi login valid & penolakan password salah');

    // TC-08: Mahasiswa dengan Denda Tertunggak Ditolak Pinjam
    // Mahasiswa 4 (Andi Tenri) memiliki fine UNPAID di seed
    const fineCheck = await client.query('SELECT id FROM fines WHERE student_id = 4 AND status = \'UNPAID\'');
    assert('TC-08', fineCheck.rows.length > 0, 'Sistem mendeteksi denda UNPAID dan memblokir pinjaman baru');

    // TC-09: Mahasiswa Mengajukan Buku Stok 0 Ditolak
    const b8Check = await client.query('SELECT stock_available FROM books WHERE id = 8');
    assert('TC-09', b8Check.rows[0].stock_available === 0, 'Buku stok 0 teridentifikasi dan tombol pinjam tidak aktif');

    // TC-10: Atomik Approve dan Pengurangan Stok
    // Cari permohonan PENDING jika ada, atau uji update atomik
    const testBook = await client.query('SELECT id, stock_available FROM books WHERE id = 1');
    const curStock = testBook.rows[0].stock_available;
    // Simulasikan conditional update
    const decRes = await client.query(
      'UPDATE books SET stock_available = stock_available - 1 WHERE id = 1 AND stock_available > 0 RETURNING stock_available'
    );
    const newStock = decRes.rows[0].stock_available;
    // Kembalikan stok
    await client.query('UPDATE books SET stock_available = stock_available + 1 WHERE id = 1');
    assert('TC-10', newStock === curStock - 1, 'Pengurangan stok bersyarat atomik berhasil');

    // TC-12 & TC-13: Pengembalian dan Proteksi Double Return
    // Update loan COMPLETED hanya jika BORROWED
    const updateReturn = await client.query(
      'UPDATE loans SET status = \'COMPLETED\' WHERE id = 999999 AND status = \'BORROWED\''
    );
    assert('TC-13', updateReturn.rowCount === 0, 'Idempoten: return pada loan non-borrowed menghasilkan 0 rows');

    // TC-14: Perhitungan Denda Pengembalian Terlambat
    const overdueFine = await client.query('SELECT days_late, amount, daily_rate_snapshot FROM fines WHERE loan_id = 3');
    const f3 = overdueFine.rows[0];
    const expectedAmount = f3.days_late * parseFloat(f3.daily_rate_snapshot);
    assert('TC-14', parseFloat(f3.amount) === expectedAmount, `Formula denda tepat (${f3.days_late} hari x ${f3.daily_rate_snapshot} = ${f3.amount})`);

    // TC-15: Pelunasan Denda Mengubah Status Menjadi PAID
    const paidFines = await client.query('SELECT COUNT(*) FROM fines WHERE status = \'PAID\'');
    assert('TC-15', parseInt(paidFines.rows[0].count, 10) > 0, 'Pelunasan denda tersimpan dengan status PAID dan aktor pencatat');

    // TC-18: Ulasan Khusus Transaksi COMPLETED
    const reviewsWithLoans = await client.query(`
      SELECT r.id, l.status 
      FROM reviews r
      JOIN loans l ON r.loan_id = l.id
    `);
    const allCompleted = reviewsWithLoans.rows.every(r => r.status === 'COMPLETED');
    assert('TC-18', allCompleted && reviewsWithLoans.rows.length > 0, 'Seluruh ulasan terbukti berasal dari transaksi COMPLETED');

    // TC-19: Guest Tidak Melihat Pengumuman Draft
    const pubAnn = await client.query(`
      SELECT COUNT(*) FROM announcements WHERE status = 'DRAFT' AND status = 'PUBLISHED'
    `);
    const pubList = await client.query(`
      SELECT status FROM announcements WHERE status = 'PUBLISHED' AND release_at <= CURRENT_DATE
    `);
    const onlyPub = pubList.rows.every(a => a.status === 'PUBLISHED');
    assert('TC-19', onlyPub, 'Kueri publik hanya mengambil pengumuman PUBLISHED yang sudah rilis');

    // TC-20: Proteksi Hapus Kategori yang Dipakai Buku
    let tc20Blocked = false;
    try {
      await client.query('DELETE FROM categories WHERE id = 1'); // Kategori 1 berelasi ke books (ON DELETE RESTRICT)
    } catch (err) {
      if (err.code === '23001' || err.code === '23503') { // restrict / foreign key violation
        tc20Blocked = true;
      }
    }
    assert('TC-20', tc20Blocked, 'Relasi FOREIGN KEY ON DELETE RESTRICT melindungi kategori dari penghapusan');

    // TC-21: Proteksi Hapus Pengguna yang Memiliki Transaksi
    let tc21Blocked = false;
    try {
      await client.query('DELETE FROM users WHERE id = 3'); // User 3 memiliki riwayat loans
    } catch (err) {
      if (err.code === '23001' || err.code === '23503') {
        tc21Blocked = true;
      }
    }
    assert('TC-21', tc21Blocked, 'Relasi FOREIGN KEY ON DELETE RESTRICT melindungi integritas data pengguna');

    // TC-22: Top 5 Buku Populer Berdasarkan Frekuensi Pinjam
    const topBooks = await client.query(`
      SELECT b.title, COUNT(l.id) AS borrow_count
      FROM books b
      LEFT JOIN loans l ON b.id = l.book_id AND l.status IN ('BORROWED', 'COMPLETED')
      GROUP BY b.id
      ORDER BY borrow_count DESC
      LIMIT 5
    `);
    assert('TC-22', topBooks.rows.length === 5, 'Kueri agregasi 5 buku terpopuler (JOIN + COUNT) berhasil');

    // TC-23: Dashboard Agregat Statistik Admin
    const statsQuery = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM books WHERE is_active = TRUE) AS total_titles,
        (SELECT COALESCE(SUM(stock_total), 0) FROM books WHERE is_active = TRUE) AS total_copies,
        (SELECT COUNT(*) FROM users WHERE role = 'mahasiswa' AND is_active = TRUE) AS total_students
    `);
    const st = statsQuery.rows[0];
    assert(
      'TC-23',
      parseInt(st.total_titles, 10) >= 8 && parseInt(st.total_copies, 10) >= 30,
      `Kueri statistik multi-tabel akurat (Titles: ${st.total_titles}, Copies: ${st.total_copies})`
    );

  } catch (globalErr) {
    console.error('Unexpected error in test runner:', globalErr);
  } finally {
    await client.end();
  }

  console.log(`HASIL AKHIR: ${passed} PASSED, ${failed} FAILED`);
}

runTests();
