import pool from '@/lib/db';

export async function getStudentActiveLoans(studentId) {
  const query = `
    SELECT 
      l.id, l.book_id, l.status, l.requested_at, l.approved_at, l.borrowed_at, l.due_date,
      l.duration_snapshot, l.fine_rate_snapshot,
      b.title AS book_title, b.isbn, b.author, b.cover_url,
      c.name AS category_name,
      r.id AS renewal_id, r.status AS renewal_status, r.new_due_date,
      CASE 
        WHEN l.due_date IS NOT NULL AND CURRENT_DATE > l.due_date THEN (CURRENT_DATE - l.due_date)
        ELSE 0
      END AS days_overdue,
      CASE 
        WHEN l.due_date IS NOT NULL AND CURRENT_DATE > l.due_date THEN (CURRENT_DATE - l.due_date) * l.fine_rate_snapshot
        ELSE 0.00
      END AS estimated_fine
    FROM loans l
    JOIN books b ON l.book_id = b.id
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN renewal_requests r ON l.id = r.loan_id AND r.status = 'PENDING'
    WHERE l.student_id = $1 AND l.status IN ('PENDING', 'BORROWED')
    ORDER BY l.requested_at DESC;
  `;
  const result = await pool.query(query, [studentId]);
  return result.rows;
}

export async function getStudentHistoryLoans(studentId) {
  const query = `
    SELECT 
      l.id, l.book_id, l.status, l.requested_at, l.borrowed_at, l.due_date, l.returned_at,
      l.reject_reason,
      b.title AS book_title, b.isbn, b.author, b.cover_url,
      c.name AS category_name,
      rev.id AS review_id, rev.rating, rev.comment AS review_comment
    FROM loans l
    JOIN books b ON l.book_id = b.id
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN reviews rev ON l.id = rev.loan_id
    WHERE l.student_id = $1 AND l.status IN ('COMPLETED', 'REJECTED')
    ORDER BY COALESCE(l.returned_at, l.updated_at::date, l.requested_at::date) DESC;
  `;
  const result = await pool.query(query, [studentId]);
  return result.rows;
}

export async function getCirculationPendingQueue() {
  const query = `
    SELECT 
      l.id, l.book_id, l.student_id, l.status, l.requested_at, l.duration_snapshot,
      b.title AS book_title, b.isbn, b.stock_available, b.stock_total,
      u.full_name AS student_name, u.email AS student_email, u.identity_number AS student_nim
    FROM loans l
    JOIN books b ON l.book_id = b.id
    JOIN users u ON l.student_id = u.id
    WHERE l.status = 'PENDING'
    ORDER BY l.requested_at ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getCirculationActiveLoans(searchTerm = '') {
  const conditions = ["l.status = 'BORROWED'"];
  const values = [];
  let paramIndex = 1;

  if (searchTerm && searchTerm.trim() !== '') {
    conditions.push(`(u.full_name ILIKE $${paramIndex} OR u.identity_number ILIKE $${paramIndex} OR b.title ILIKE $${paramIndex} OR b.isbn ILIKE $${paramIndex})`);
    values.push(`%${searchTerm.trim()}%`);
    paramIndex++;
  }

  const query = `
    SELECT 
      l.id, l.book_id, l.student_id, l.status, l.borrowed_at, l.due_date,
      l.fine_rate_snapshot,
      b.title AS book_title, b.isbn,
      u.full_name AS student_name, u.identity_number AS student_nim,
      CASE 
        WHEN CURRENT_DATE > l.due_date THEN (CURRENT_DATE - l.due_date)
        ELSE 0
      END AS days_overdue,
      CASE 
        WHEN CURRENT_DATE > l.due_date THEN (CURRENT_DATE - l.due_date) * l.fine_rate_snapshot
        ELSE 0.00
      END AS estimated_fine
    FROM loans l
    JOIN books b ON l.book_id = b.id
    JOIN users u ON l.student_id = u.id
    WHERE ${conditions.join(' AND ')}
    ORDER BY days_overdue DESC, l.due_date ASC;
  `;
  const result = await pool.query(query, values);
  return result.rows;
}

export async function getCirculationPendingRenewals() {
  const query = `
    SELECT 
      r.id, r.loan_id, r.status, r.old_due_date, r.extension_days, r.requested_at,
      l.student_id, l.book_id,
      b.title AS book_title, b.isbn,
      u.full_name AS student_name, u.identity_number AS student_nim
    FROM renewal_requests r
    JOIN loans l ON r.loan_id = l.id
    JOIN books b ON l.book_id = b.id
    JOIN users u ON l.student_id = u.id
    WHERE r.status = 'PENDING'
    ORDER BY r.requested_at ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getAllTransactionsAdmin({ status = '', search = '', page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (status && status !== 'ALL') {
    conditions.push(`l.status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
  }

  if (search && search.trim() !== '') {
    conditions.push(`(u.full_name ILIKE $${paramIndex} OR u.identity_number ILIKE $${paramIndex} OR b.title ILIKE $${paramIndex})`);
    values.push(`%${search.trim()}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `
    SELECT COUNT(l.id) AS total
    FROM loans l
    JOIN books b ON l.book_id = b.id
    JOIN users u ON l.student_id = u.id
    ${whereClause};
  `;
  const countResult = await pool.query(countQuery, values);
  const totalItems = parseInt(countResult.rows[0].total, 10);

  const dataQuery = `
    SELECT 
      l.id, l.status, l.requested_at, l.borrowed_at, l.due_date, l.returned_at,
      l.reject_reason,
      b.title AS book_title, b.isbn,
      u.full_name AS student_name, u.identity_number AS student_nim,
      staff_app.full_name AS approved_by_name,
      f.amount AS fine_amount, f.status AS fine_status
    FROM loans l
    JOIN books b ON l.book_id = b.id
    JOIN users u ON l.student_id = u.id
    LEFT JOIN users staff_app ON l.approved_by = staff_app.id
    LEFT JOIN fines f ON l.id = f.loan_id
    ${whereClause}
    ORDER BY l.id DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
  `;

  values.push(limit, offset);
  const dataResult = await pool.query(dataQuery, values);

  return {
    items: dataResult.rows,
    pagination: {
      totalItems,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}
