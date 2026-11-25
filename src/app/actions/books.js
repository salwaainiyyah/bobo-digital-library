'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/permissions';
import pool from '@/lib/db';
import { ROLES } from '@/lib/constants';
import {
  validateBookCoverFile,
  saveBookCoverFile,
  deleteUploadedBookCover,
} from '@/lib/upload';

export async function createBookAction(formData) {
  try {
    await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);

    const title = formData.get('title')?.trim();
    const isbn = formData.get('isbn')?.trim();
    const author = formData.get('author')?.trim();
    const publisher = formData.get('publisher')?.trim();
    const publicationYear = parseInt(formData.get('publicationYear'), 10);
    const categoryId = parseInt(formData.get('categoryId'), 10);
    const stockTotal = parseInt(formData.get('stockTotal'), 10);
    const loanDurationDays = parseInt(formData.get('loanDurationDays'), 10) || 7;
    const finePerDay = parseFloat(formData.get('finePerDay')) || 1000.0;
    const manualCoverUrl = formData.get('coverUrl')?.trim();
    const coverFile = formData.get('coverFile');

    if (
      !title ||
      !isbn ||
      !author ||
      !publisher ||
      isNaN(publicationYear) ||
      isNaN(categoryId) ||
      isNaN(stockTotal)
    ) {
      return { success: false, error: 'Seluruh field wajib diisi dengan benar.' };
    }

    if (stockTotal < 0 || finePerDay < 0 || loanDurationDays <= 0) {
      return {
        success: false,
        error: 'Nilai stok, tarif denda, dan durasi pinjam harus valid (non-negatif).',
      };
    }

    const isbnCheck = await pool.query('SELECT id FROM books WHERE isbn = $1', [isbn]);
    if (isbnCheck.rows.length > 0) {
      return { success: false, error: 'Nomor ISBN ini sudah terdaftar dalam sistem perpustakaan.' };
    }

    let finalCoverUrl = '/brand/bo-bo-logo.png';
    const hasUploadedFile = coverFile && typeof coverFile !== 'string' && coverFile.size > 0;

    if (hasUploadedFile) {
      const fileError = validateBookCoverFile(coverFile);
      if (fileError) {
        return { success: false, error: fileError };
      }
      finalCoverUrl = await saveBookCoverFile(coverFile);
    } else if (manualCoverUrl) {
      finalCoverUrl = manualCoverUrl;
    }

    const query = `
      INSERT INTO books (
        title, isbn, author, publisher, publication_year, category_id,
        stock_total, stock_available, loan_duration_days, fine_per_day, cover_url, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $9, $10, TRUE)
      RETURNING id, title;
    `;

    const result = await pool.query(query, [
      title,
      isbn,
      author,
      publisher,
      publicationYear,
      categoryId,
      stockTotal,
      loanDurationDays,
      finePerDay,
      finalCoverUrl,
    ]);

    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath('/dashboard/pegawai/books');

    return { success: true, data: result.rows[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateBookAction(id, formData) {
  try {
    await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);
    const bookId = parseInt(id, 10);

    const title = formData.get('title')?.trim();
    const isbn = formData.get('isbn')?.trim();
    const author = formData.get('author')?.trim();
    const publisher = formData.get('publisher')?.trim();
    const publicationYear = parseInt(formData.get('publicationYear'), 10);
    const categoryId = parseInt(formData.get('categoryId'), 10);
    const newStockTotal = parseInt(formData.get('stockTotal'), 10);
    const loanDurationDays = parseInt(formData.get('loanDurationDays'), 10) || 7;
    const finePerDay = parseFloat(formData.get('finePerDay')) || 1000.0;
    const manualCoverUrl = formData.get('coverUrl')?.trim();
    const coverFile = formData.get('coverFile');
    const isActive = formData.get('isActive') !== 'false';

    const currentBookRes = await pool.query(
      'SELECT stock_total, stock_available, cover_url FROM books WHERE id = $1',
      [bookId]
    );
    if (currentBookRes.rows.length === 0) {
      return { success: false, error: 'Buku tidak ditemukan.' };
    }

    const current = currentBookRes.rows[0];
    const currentlyBorrowed = current.stock_total - current.stock_available;

    if (newStockTotal < currentlyBorrowed) {
      return {
        success: false,
        error: `Total stok tidak boleh kurang dari jumlah buku yang sedang dipinjam (${currentlyBorrowed} eksemplar).`,
      };
    }

    const newStockAvailable = newStockTotal - currentlyBorrowed;

    let finalCoverUrl = current.cover_url || '/brand/bo-bo-logo.png';
    const hasUploadedFile = coverFile && typeof coverFile !== 'string' && coverFile.size > 0;

    if (hasUploadedFile) {
      const fileError = validateBookCoverFile(coverFile);
      if (fileError) {
        return { success: false, error: fileError };
      }
      finalCoverUrl = await saveBookCoverFile(coverFile);
    } else if (manualCoverUrl) {
      finalCoverUrl = manualCoverUrl;
    }

    const query = `
      UPDATE books
      SET title = $1, isbn = $2, author = $3, publisher = $4, publication_year = $5,
          category_id = $6, stock_total = $7, stock_available = $8, loan_duration_days = $9,
          fine_per_day = $10, cover_url = $11, is_active = $12, updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING id, title;
    `;

    const result = await pool.query(query, [
      title,
      isbn,
      author,
      publisher,
      publicationYear,
      categoryId,
      newStockTotal,
      newStockAvailable,
      loanDurationDays,
      finePerDay,
      finalCoverUrl,
      isActive,
      bookId,
    ]);

    if (current.cover_url && current.cover_url !== finalCoverUrl) {
      await deleteUploadedBookCover(current.cover_url, pool);
    }

    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath(`/catalog/${bookId}`);
    revalidatePath('/dashboard/pegawai/books');

    return { success: true, data: result.rows[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteBookAction(id) {
  try {
    await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);
    const bookId = parseInt(id, 10);

    const bookRes = await pool.query('SELECT id, title, cover_url FROM books WHERE id = $1', [bookId]);
    if (bookRes.rows.length === 0) {
      return { success: false, error: 'Buku tidak ditemukan.' };
    }
    const book = bookRes.rows[0];

    const activeLoanCheck = await pool.query(
      "SELECT COUNT(*) AS count FROM loans WHERE book_id = $1 AND status IN ('PENDING', 'BORROWED')",
      [bookId]
    );

    if (parseInt(activeLoanCheck.rows[0].count, 10) > 0) {
      return {
        success: false,
        error: 'Buku tidak dapat dihapus karena sedang dalam proses peminjaman aktif.',
      };
    }

    const historyCheck = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM loans WHERE book_id = $1) AS loan_count,
        (SELECT COUNT(*) FROM reviews WHERE book_id = $1) AS review_count`,
      [bookId]
    );

    const hasHistory =
      parseInt(historyCheck.rows[0].loan_count, 10) > 0 ||
      parseInt(historyCheck.rows[0].review_count, 10) > 0;

    if (hasHistory) {
      await pool.query(
        'UPDATE books SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [bookId]
      );

      revalidatePath('/');
      revalidatePath('/catalog');
      revalidatePath('/dashboard/pegawai/books');

      return {
        success: true,
        message: `Buku "${book.title}" dinonaktifkan karena memiliki riwayat peminjaman atau ulasan.`,
      };
    }

    await pool.query('DELETE FROM books WHERE id = $1', [bookId]);

    if (book.cover_url) {
      await deleteUploadedBookCover(book.cover_url, pool);
    }

    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath('/dashboard/pegawai/books');

    return {
      success: true,
      message: `Buku "${book.title}" berhasil dihapus permanen.`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function restoreBookAction(id) {
  try {
    await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);
    const bookId = parseInt(id, 10);

    const result = await pool.query(
      'UPDATE books SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, title',
      [bookId]
    );

    if (result.rows.length === 0) {
      return { success: false, error: 'Buku tidak ditemukan.' };
    }

    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath(`/catalog/${bookId}`);
    revalidatePath('/dashboard/pegawai/books');

    return {
      success: true,
      message: `Buku "${result.rows[0].title}" berhasil dipulihkan ke katalog.`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}