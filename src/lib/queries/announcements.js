import pool from '@/lib/db';

export async function getPublishedAnnouncements(limit = 6) {
  const query = `
    SELECT 
      a.id, a.title, a.content, a.category, a.release_at, a.status, a.published_at,
      u.full_name AS author_name
    FROM announcements a
    LEFT JOIN users u ON a.created_by = u.id
    WHERE a.status = 'PUBLISHED' AND a.release_at <= CURRENT_DATE
    ORDER BY a.release_at DESC, a.id DESC
    LIMIT $1;
  `;
  const result = await pool.query(query, [limit]);
  return result.rows;
}

export async function getAnnouncementById(id) {
  const query = `
    SELECT 
      a.id, a.title, a.content, a.category, a.release_at, a.status, a.published_at,
      u.full_name AS author_name, u.role AS author_role
    FROM announcements a
    LEFT JOIN users u ON a.created_by = u.id
    WHERE a.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function getAllAnnouncementsCMS() {
  const query = `
    SELECT 
      a.id, a.title, a.content, a.category, a.release_at, a.status, a.published_at,
      u.full_name AS author_name
    FROM announcements a
    LEFT JOIN users u ON a.created_by = u.id
    ORDER BY a.release_at DESC, a.id DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function createAnnouncement({ title, content, category, releaseAt, status, createdBy }) {
  const query = `
    INSERT INTO announcements (title, content, category, release_at, status, created_by, published_at)
    VALUES ($1, $2, $3, $4, $5, $6, CASE WHEN $5 = 'PUBLISHED' THEN CURRENT_TIMESTAMP ELSE NULL END)
    RETURNING id, title, content, category, release_at, status;
  `;
  const result = await pool.query(query, [
    title.trim(),
    content.trim(),
    category,
    releaseAt || new Date().toISOString().split('T')[0],
    status,
    createdBy,
  ]);
  return result.rows[0];
}

export async function updateAnnouncement(id, { title, content, category, releaseAt, status }) {
  const query = `
    UPDATE announcements
    SET 
      title = $1, 
      content = $2, 
      category = $3, 
      release_at = $4, 
      status = $5,
      published_at = CASE WHEN $5 = 'PUBLISHED' AND published_at IS NULL THEN CURRENT_TIMESTAMP ELSE published_at END,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING id, title, content, category, release_at, status;
  `;
  const result = await pool.query(query, [
    title.trim(),
    content.trim(),
    category,
    releaseAt,
    status,
    id,
  ]);
  return result.rows[0];
}

export async function deleteAnnouncement(id) {
  const result = await pool.query('DELETE FROM announcements WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
}
