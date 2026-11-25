import pool from '@/lib/db';

export async function getAllCategories(includeInactive = false) {
  const query = `
    SELECT 
      c.id, c.name, c.classification_code, c.description, c.is_active,
      COUNT(b.id) AS book_count
    FROM categories c
    LEFT JOIN books b ON c.id = b.category_id AND b.is_active = TRUE
    ${includeInactive ? '' : 'WHERE c.is_active = TRUE'}
    GROUP BY c.id
    ORDER BY c.name ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function createCategory({ name, classificationCode, description }) {
  const result = await pool.query(
    `INSERT INTO categories (name, classification_code, description)
     VALUES ($1, $2, $3)
     RETURNING id, name, classification_code, description, is_active`,
    [name.trim(), classificationCode.trim().toUpperCase(), description?.trim() || null]
  );
  return result.rows[0];
}

export async function updateCategory(id, { name, classificationCode, description, isActive }) {
  const result = await pool.query(
    `UPDATE categories
     SET name = $1, classification_code = $2, description = $3, is_active = $4
     WHERE id = $5
     RETURNING id, name, classification_code, description, is_active`,
    [name.trim(), classificationCode.trim().toUpperCase(), description?.trim() || null, isActive ?? true, id]
  );
  return result.rows[0];
}

export async function deleteCategory(id) {
  // Cek apakah ada buku yang terhubung
  const checkBooks = await pool.query('SELECT COUNT(*) AS count FROM books WHERE category_id = $1', [id]);
  if (parseInt(checkBooks.rows[0].count, 10) > 0) {
    throw new Error('Kategori tidak dapat dihapus karena masih ada buku yang terhubung.');
  }

  const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
}
