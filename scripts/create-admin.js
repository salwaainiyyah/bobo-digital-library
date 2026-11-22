const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const args = process.argv.slice(2);
  const fullName = args[0] || 'Admin Bo\'bo';
  const email = (args[1] || 'admin@unhas.ac.id').toLowerCase().trim();
  const rawPassword = args[2] || 'admin123';
  const identityNumber = args[3] || 'ADM-MASTER';

  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bobo_library'
  });

  try {
    await client.connect();
    console.log(`Membuat / memperbarui akun Admin (${email})...`);

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const query = `
      INSERT INTO users (full_name, email, password_hash, role, identity_number, is_active)
      VALUES ($1, $2, $3, 'admin', $4, TRUE)
      ON CONFLICT (email) 
      DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        password_hash = EXCLUDED.password_hash,
        is_active = TRUE,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, full_name, email, role;
    `;

    const res = await client.query(query, [fullName, email, passwordHash, identityNumber]);
    console.log('Akun Admin berhasil disiapkan:', res.rows[0]);
  } catch (err) {
    console.error('Gagal membuat admin:', err.message);
  } finally {
    await client.end();
  }
}

createAdmin();
