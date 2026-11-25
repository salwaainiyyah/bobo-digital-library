import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { ROLES } from '@/lib/constants';

export async function getAllUsers({ role = 'ALL', search = '' } = {}) {
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (role && role !== 'ALL') {
    conditions.push(`u.role = $${paramIndex}`);
    values.push(role);
    paramIndex++;
  }

  if (search && search.trim() !== '') {
    conditions.push(`(u.full_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.identity_number ILIKE $${paramIndex})`);
    values.push(`%${search.trim()}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT 
      u.id, u.full_name, u.email, u.role, u.identity_number, u.is_active, u.created_at,
      COUNT(DISTINCT l.id) AS total_loans,
      COUNT(DISTINCT CASE WHEN l.status IN ('PENDING', 'BORROWED') THEN l.id END) AS active_loans,
      COUNT(DISTINCT CASE WHEN f.status = 'UNPAID' THEN f.id END) AS unpaid_fines
    FROM users u
    LEFT JOIN loans l ON u.id = l.student_id
    LEFT JOIN fines f ON u.id = f.student_id
    ${whereClause}
    GROUP BY u.id
    ORDER BY u.created_at DESC;
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

export async function createUser({ fullName, email, password, role, identityNumber }) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanFullName = fullName.trim();
  const cleanRole = role.trim().toLowerCase();
  const cleanIdentity = identityNumber?.trim() || null;

  if (![ROLES.ADMIN, ROLES.PEGAWAI, ROLES.MAHASISWA].includes(cleanRole)) {
    throw new Error('Peran akun yang dipilih tidak valid.');
  }

  const dupCheck = await pool.query(
    'SELECT email, identity_number FROM users WHERE email = $1 OR (identity_number = $2 AND identity_number IS NOT NULL)',
    [cleanEmail, cleanIdentity]
  );

  if (dupCheck.rows.length > 0) {
    if (dupCheck.rows[0].email === cleanEmail) {
      throw new Error('Alamat email sudah terdaftar.');
    }
    if (cleanIdentity && dupCheck.rows[0].identity_number === cleanIdentity) {
      throw new Error('Nomor identitas / NIM sudah terdaftar.');
    }
  }

  const passwordHash = await hashPassword(password);

  const query = `
    INSERT INTO users (full_name, email, password_hash, role, identity_number, is_active)
    VALUES ($1, $2, $3, $4, $5, TRUE)
    RETURNING id, full_name, email, role, identity_number, is_active;
  `;
  const result = await pool.query(query, [cleanFullName, cleanEmail, passwordHash, cleanRole, cleanIdentity]);
  return result.rows[0];
}

export async function updateUser(id, { fullName, email, role, identityNumber, isActive }, currentAdminId) {
  const targetId = parseInt(id, 10);
  const cleanEmail = email.trim().toLowerCase();
  const cleanFullName = fullName.trim();
  const cleanRole = role.trim().toLowerCase();
  const cleanIdentity = identityNumber?.trim() || null;

  if (![ROLES.ADMIN, ROLES.PEGAWAI, ROLES.MAHASISWA].includes(cleanRole)) {
    throw new Error('Peran akun yang dipilih tidak valid.');
  }

  const existingRes = await pool.query('SELECT id, role FROM users WHERE id = $1', [targetId]);
  const existingUser = existingRes.rows[0];

  if (!existingUser) {
    throw new Error('Akun pengguna tidak ditemukan.');
  }

  if (existingUser.role === ROLES.ADMIN && cleanRole !== ROLES.ADMIN) {
    throw new Error('Peran akun Administrator tidak dapat diubah menjadi Pegawai atau Mahasiswa.');
  }

  if (targetId === parseInt(currentAdminId, 10) && isActive === false) {
    throw new Error('Anda tidak dapat menonaktifkan akun Anda sendiri saat sedang login.');
  }

  const dupCheck = await pool.query(
    'SELECT id, email, identity_number FROM users WHERE id <> $1 AND (email = $2 OR (identity_number = $3 AND identity_number IS NOT NULL))',
    [targetId, cleanEmail, cleanIdentity]
  );

  if (dupCheck.rows.length > 0) {
    if (dupCheck.rows[0].email === cleanEmail) {
      throw new Error('Alamat email sudah digunakan oleh akun lain.');
    }
    if (cleanIdentity && dupCheck.rows[0].identity_number === cleanIdentity) {
      throw new Error('Nomor identitas / NIM sudah digunakan oleh akun lain.');
    }
  }

  const query = `
    UPDATE users
    SET full_name = $1, email = $2, role = $3, identity_number = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING id, full_name, email, role, identity_number, is_active;
  `;
  const result = await pool.query(query, [
    cleanFullName,
    cleanEmail,
    cleanRole,
    cleanIdentity,
    isActive ?? true,
    targetId,
  ]);
  return result.rows[0];
}

export async function deleteUser(id, currentAdminId) {
  const targetId = parseInt(id, 10);
  if (targetId === parseInt(currentAdminId, 10)) {
    throw new Error('Anda tidak dapat menghapus akun Anda sendiri.');
  }

  const activeLoans = await pool.query(
    "SELECT COUNT(*) AS count FROM loans WHERE student_id = $1 AND status IN ('PENDING', 'BORROWED')",
    [targetId]
  );
  if (parseInt(activeLoans.rows[0].count, 10) > 0) {
    throw new Error('Akun ini tidak dapat dihapus karena masih memiliki transaksi peminjaman yang aktif.');
  }

  const unpaidFines = await pool.query(
    "SELECT COUNT(*) AS count FROM fines WHERE student_id = $1 AND status = 'UNPAID'",
    [targetId]
  );
  if (parseInt(unpaidFines.rows[0].count, 10) > 0) {
    throw new Error('Akun ini tidak dapat dihapus karena masih memiliki catatan denda yang belum dilunasi.');
  }

  const historyCheck = await pool.query(
    'SELECT COUNT(*) AS count FROM loans WHERE student_id = $1',
    [targetId]
  );

  if (parseInt(historyCheck.rows[0].count, 10) > 0) {
    await pool.query('UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [targetId]);
    return { id: targetId, softDeleted: true, message: 'Akun telah dinonaktifkan untuk melindungi data historis sirkulasi.' };
  }

  await pool.query('DELETE FROM users WHERE id = $1', [targetId]);
  return { id: targetId, softDeleted: false, message: 'Akun berhasil dihapus permanen.' };
}

export async function resetUserPassword(id, newPassword, { currentAdminId, currentSessionId } = {}) {
  const targetId = parseInt(id, 10);
  if (!Number.isInteger(targetId) || targetId <= 0) {
    throw new Error('ID akun pengguna tidak valid.');
  }

  if (typeof newPassword !== 'string' || newPassword.trim().length === 0) {
    throw new Error('Password baru wajib diisi.');
  }

  if (newPassword.length < 6) {
    throw new Error('Password baru minimal harus terdiri dari 6 karakter.');
  }

  if (Buffer.byteLength(newPassword, 'utf8') > 72) {
    throw new Error('Password baru maksimal 72 byte.');
  }

  const existingRes = await pool.query(
    'SELECT id, full_name, email, role FROM users WHERE id = $1',
    [targetId]
  );
  const existingUser = existingRes.rows[0];

  if (!existingUser) {
    throw new Error('Akun pengguna tidak ditemukan.');
  }

  const passwordHash = await hashPassword(newPassword);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateRes = await client.query(
      `UPDATE users
       SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, full_name, email, role, identity_number, is_active`,
      [passwordHash, targetId]
    );

    if (targetId === parseInt(currentAdminId, 10) && currentSessionId) {
      await client.query(
        `UPDATE sessions
         SET revoked_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 AND revoked_at IS NULL AND id <> $2`,
        [targetId, currentSessionId]
      );
    } else {
      await client.query(
        `UPDATE sessions
         SET revoked_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 AND revoked_at IS NULL`,
        [targetId]
      );
    }

    await client.query('COMMIT');
    return updateRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}