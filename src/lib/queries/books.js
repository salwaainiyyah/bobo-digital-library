import pool from '@/lib/db';

export async function getTopBooks(limit = 5) {
  const query = `
    SELECT 
      b.id, b.title, b.isbn, b.author, b.publisher, b.publication_year,
      b.stock_total, b.stock_available, b.loan_duration_days, b.fine_per_day,
      b.cover_url, c.name AS category_name,
      COUNT(l.id) AS borrow_count,
      COALESCE(AVG(r.rating), 0)::numeric(3, 1) AS avg_rating,
      COUNT(DISTINCT r.id) AS review_count
    FROM books b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN loans l ON b.id = l.book_id AND l.status IN ('BORROWED', 'COMPLETED')
    LEFT JOIN reviews r ON b.id = r.book_id
    WHERE b.is_active = TRUE
    GROUP BY b.id, c.name
    ORDER BY borrow_count DESC, avg_rating DESC, b.title ASC
    LIMIT $1;
  `;
  const result = await pool.query(query, [limit]);
  return result.rows;
}

export async function getBooksCatalog({
  search = '',
  categoryId = null,
  sortBy = 'popular',
  page = 1,
  limit = 12,
} = {}) {
  const offset = (page - 1) * limit;
  const conditions = ['b.is_active = TRUE'];
  const values = [];
  let paramIndex = 1;

  if (search && search.trim() !== '') {
    conditions.push(`(b.title ILIKE $${paramIndex} OR b.author ILIKE $${paramIndex} OR b.isbn ILIKE $${paramIndex})`);
    values.push(`%${search.trim()}%`);
    paramIndex++;
  }

  if (categoryId) {
    conditions.push(`b.category_id = $${paramIndex}`);
    values.push(parseInt(categoryId, 10));
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Whitelist Sorting
  let orderClause = 'borrow_count DESC, b.id DESC';
  if (sortBy === 'newest') {
    orderClause = 'b.publication_year DESC, b.id DESC';
  } else if (sortBy === 'rating') {
    orderClause = 'avg_rating DESC, borrow_count DESC';
  } else if (sortBy === 'title') {
    orderClause = 'b.title ASC';
  }

  const countQuery = `
    SELECT COUNT(b.id) AS total
    FROM books b
    ${whereClause};
  `;
  const countResult = await pool.query(countQuery, values);
  const totalItems = parseInt(countResult.rows[0].total, 10);

  const dataQuery = `
    SELECT 
      b.id, b.title, b.isbn, b.author, b.publisher, b.publication_year,
      b.stock_total, b.stock_available, b.loan_duration_days, b.fine_per_day,
      b.cover_url, c.name AS category_name, c.id AS category_id,
      COUNT(l.id) AS borrow_count,
      COALESCE(AVG(r.rating), 0)::numeric(3, 1) AS avg_rating,
      COUNT(DISTINCT r.id) AS review_count
    FROM books b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN loans l ON b.id = l.book_id AND l.status IN ('BORROWED', 'COMPLETED')
    LEFT JOIN reviews r ON b.id = r.book_id
    ${whereClause}
    GROUP BY b.id, c.name, c.id
    ORDER BY ${orderClause}
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

export async function getBookById(id) {
  const bookQuery = `
    SELECT 
      b.id, b.title, b.isbn, b.author, b.publisher, b.publication_year,
      b.category_id, b.stock_total, b.stock_available, b.loan_duration_days,
      b.fine_per_day, b.cover_url, b.is_active,
      c.name AS category_name, c.classification_code,
      COUNT(l.id) AS borrow_count,
      COALESCE(AVG(r.rating), 0)::numeric(3, 1) AS avg_rating,
      COUNT(DISTINCT r.id) AS review_count
    FROM books b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN loans l ON b.id = l.book_id AND l.status IN ('BORROWED', 'COMPLETED')
    LEFT JOIN reviews r ON b.id = r.book_id
    WHERE b.id = $1
    GROUP BY b.id, c.name, c.classification_code;
  `;
  const bookResult = await pool.query(bookQuery, [id]);
  if (bookResult.rows.length === 0) return null;

  const book = bookResult.rows[0];

  const reviewsQuery = `
    SELECT 
      r.id, r.rating, r.comment, r.created_at,
      u.full_name AS student_name, u.identity_number AS student_nim
    FROM reviews r
    JOIN users u ON r.student_id = u.id
    WHERE r.book_id = $1
    ORDER BY r.created_at DESC;
  `;
  const reviewsResult = await pool.query(reviewsQuery, [id]);
  book.reviews = reviewsResult.rows;

  return book;
}

export async function getRelatedBooks(categoryId, currentBookId, limit = 5) {
  const query = `
    SELECT 
      b.id, b.title, b.author, b.cover_url, b.publication_year,
      b.stock_available, c.name AS category_name,
      COALESCE(AVG(r.rating), 0)::numeric(3, 1) AS avg_rating,
      COUNT(l.id) AS borrow_count
    FROM books b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN loans l ON b.id = l.book_id AND l.status IN ('BORROWED', 'COMPLETED')
    LEFT JOIN reviews r ON b.id = r.book_id
    WHERE b.category_id = $1 AND b.id != $2 AND b.is_active = TRUE
    GROUP BY b.id, c.name
    ORDER BY borrow_count DESC, b.title ASC
    LIMIT $3;
  `;
  const result = await pool.query(query, [categoryId, currentBookId, limit]);
  return result.rows;
}
