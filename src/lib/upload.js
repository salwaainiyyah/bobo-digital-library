import { mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

export const MAX_BOOK_COVER_SIZE = 3 * 1024 * 1024; // 3 MB

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const IMAGE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const UPLOAD_URL_PREFIX = '/uploads/books/';
const UPLOAD_BOOKS_DIR = path.join(process.cwd(), 'public', 'uploads', 'books');

export function validateBookCoverFile(file) {
  if (!file || typeof file === 'string' || file.size === 0) {
    return 'Berkas gambar tidak valid atau kosong.';
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Format gambar sampul harus JPG, PNG, WEBP, atau GIF.';
  }

  if (file.size > MAX_BOOK_COVER_SIZE) {
    return 'Ukuran gambar sampul maksimal 3 MB.';
  }

  return null;
}

export async function saveBookCoverFile(file) {
  const extension = IMAGE_EXTENSIONS[file.type] || 'jpg';
  const uniqueName = `${Date.now()}-${randomBytes(6).toString('hex')}.${extension}`;

  await mkdir(UPLOAD_BOOKS_DIR, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fullPath = path.join(UPLOAD_BOOKS_DIR, uniqueName);
  await writeFile(fullPath, buffer);

  return `${UPLOAD_URL_PREFIX}${uniqueName}`;
}

export async function deleteUploadedBookCover(coverUrl, pool) {
  if (!coverUrl || !coverUrl.startsWith(UPLOAD_URL_PREFIX)) {
    return;
  }

  try {
    // Pastikan path gambar ini tidak sedang dipakai oleh buku lain
    const usageCheck = await pool.query(
      'SELECT COUNT(*) AS total FROM books WHERE cover_url = $1',
      [coverUrl]
    );

    if (parseInt(usageCheck.rows[0].total, 10) > 0) {
      return;
    }

    const fileName = path.basename(coverUrl);
    const fullPath = path.join(UPLOAD_BOOKS_DIR, fileName);
    await unlink(fullPath);
  } catch {
    // Abaikan jika berkas fisik memang sudah tidak ada di disk
  }
}