import DashboardShell from '@/components/layout/DashboardShell';
import BookManager from '@/components/books/BookManager';
import { requireRole } from '@/lib/auth/permissions';
import pool from '@/lib/db';
import { getAllCategories } from '@/lib/queries/categories';
import { ROLES } from '@/lib/constants';

export const revalidate = 0;

export default async function PegawaiBooksPage() {
  const user = await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);

  // Ambil semua buku termasuk yang diarsipkan untuk manajemen CMS
  const booksQuery = `
    SELECT 
      b.id, b.title, b.isbn, b.author, b.publisher, b.publication_year,
      b.category_id, b.stock_total, b.stock_available, b.loan_duration_days,
      b.fine_per_day, b.cover_url, b.is_active,
      c.name AS category_name
    FROM books b
    JOIN categories c ON b.category_id = c.id
    ORDER BY b.is_active DESC, b.title ASC;
  `;
  const [booksRes, categories] = await Promise.all([
    pool.query(booksQuery),
    getAllCategories(true),
  ]);

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        {/* Header Banner */}
        <section className="rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] p-6 sm:p-8 shadow-[0_6px_20px_rgba(92,65,42,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43] mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7B9663]" />
            <span>CMS Pustaka</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#5A3E28]">
            Manajemen Koleksi Buku Fisik
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1 max-w-3xl">
            Tambah judul koleksi baru, perbarui data eksemplar, atur batas durasi peminjaman, serta arsipkan buku dengan aman.
          </p>
        </section>

        <BookManager books={booksRes.rows} categories={categories} />
      </div>
    </DashboardShell>
  );
}