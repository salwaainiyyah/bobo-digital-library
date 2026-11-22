const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres'
  });

  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'bobo_library'");
    if (res.rows.length === 0) {
      await client.query('CREATE DATABASE bobo_library');
      console.log('Database "bobo_library" berhasil dibuat!');
    } else {
      console.log('Database "bobo_library" sudah tersedia.');
    }
  } catch (err) {
    console.error('Error in init-db:', err.message);
  } finally {
    await client.end();
  }
}

createDatabase();
