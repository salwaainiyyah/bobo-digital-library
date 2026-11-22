import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import BorrowButton from '@/components/books/BorrowButton';
import BookCover3D from '@/components/books/BookCover3D';
import BookDetailTabs from '@/components/books/BookDetailTabs';
import { getCurrentUser } from '@/lib/auth/permissions';
import { getBookById, getRelatedBooks } from '@/lib/queries/books';
import { hasUnpaidFine } from '@/lib/queries/fines';
import pool from '@/lib/db';
import { ROLES, LOAN_STATUS } from '@/lib/constants';

export const revalidate = 0;

export default async function BookDetailPage({ params }) {
  const user = await getCurrentUser();
  const { id } = await params;
  const bookId = parseInt(id, 10);

  if (isNaN(bookId)) notFound();

  const book = await getBookById(bookId);
  if (!book) notFound();

  // Ambil buku terkait dalam kategori yang sama
  const relatedBooks = await getRelatedBooks(book.category_id, book.id, 4);

  // Evaluasi kelayakan peminjaman untuk mahasiswa
  let isEligible = false;
  let disabledReason = '';

  if (!user) {
    disabledReason = 'Silakan masuk ke akun Mahasiswa untuk mengajukan peminjaman buku ini.';
  } else if (user.role !== ROLES.MAHASISWA) {
    disabledReason = `Akun Anda masuk sebagai ${user.role}. Peminjaman buku fisik khusus untuk akun Mahasiswa.`;
  } else {
    // 1. Cek stok
    if (book.stock_available <= 0) {
      disabledReason = 'Seluruh eksemplar fisik buku ini sedang dipinjam (Stok Habis).';
    } else {
      // 2. Cek denda tertunggak
      const hasFine = await hasUnpaidFine(user.id);
      if (hasFine) {
        disabledReason = 'Pengajuan pinjam diblokir sementara karena Anda masih memiliki denda tertunggak.';
      } else {
        // 3. Cek pinjaman aktif untuk buku ini
        const activeLoanCheck = await pool.query(
          `SELECT id, status FROM loans 
           WHERE student_id = $1 AND book_id = $2 AND status IN ($3, $4)`,
          [user.id, book.id, LOAN_STATUS.PENDING, LOAN_STATUS.BORROWED]
        );

        if (activeLoanCheck.rows.length > 0) {
          const status = activeLoanCheck.rows[0].status;
          disabledReason =
            status === LOAN_STATUS.PENDING
              ? 'Anda sudah memiliki permohonan pinjam yang sedang menunggu verifikasi meja sirkulasi.'
              : 'Anda sedang meminjam buku ini.';
        } else {
          isEligible = true;
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EBD8]">
      <Navbar initialUser={user} />

      <main className="flex-1 pb-16">
        {/* 1. BACKDROP LANGIT PASTEL & AWAN (Persis Gaya Referensi) */}
        <div className="relative h-56 sm:h-64 lg:h-72 w-full bg-gradient-to-b from-[#CBE4F0] via-[#DFEFF6] to-[#EAF4F8] overflow-hidden texture-grain">
          {/* Dekorasi Awan Halus */}
          <div className="absolute top-6 -left-10 w-44 h-20 bg-[#FDF9F3]/85 rounded-full animate-float-slow pointer-events-none" />
          <div className="absolute top-16 right-[-28px] w-52 h-24 bg-[#FDF9F3]/80 rounded-full animate-float pointer-events-none" />
          <div className="hidden md:block absolute top-8 left-1/3 w-36 h-16 bg-[#FDF9F3]/60 rounded-full animate-float-slow pointer-events-none" />
          <div className="hidden lg:block absolute top-24 left-[18%] w-28 h-12 bg-[#FDF9F3]/50 rounded-full pointer-events-none" />

          {/* Navigasi Atas di Dalam Backdrop */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 flex items-center justify-between gap-4">
            {/* Tombol Kembali Bulat ala Mobile App (Tampil di HP/Tablet) */}
            <Link
              href="/catalog"
              aria-label="Kembali ke Katalog"
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FDF9F3]/85 hover:bg-white text-[#79543D] text-xs font-semibold backdrop-blur-md shadow-2xs border border-white/80 transition-all"
            >
              <span>←</span>
              <span>Katalog</span>
            </Link>

            {/* Breadcrumb & Tombol Kembali (Tampil Rapi di Layar Laptop) */}
            <nav className="hidden lg:flex items-center gap-2 text-xs text-[#79543D]/80 bg-[#FDF9F3]/75 backdrop-blur-md px-4 py-2 rounded-full border border-white/80">
              <Link href="/" className="hover:text-[#929D75] transition-colors">Beranda</Link>
              <span>/</span>
              <Link href="/catalog" className="hover:text-[#929D75] transition-colors">Katalog Buku</Link>
              <span>/</span>
              <Link href={`/catalog?cat=${book.category_id}`} className="hover:text-[#929D75] transition-colors">
                {book.category_name}
              </Link>
              <span>/</span>
              <span className="text-[#79543D] font-semibold truncate max-w-[260px]">
                {book.title}
              </span>
            </nav>

            <Link
              href="/catalog"
              className="hidden lg:inline-flex items-center gap-2 text-xs font-semibold text-[#79543D] hover:text-[#929D75] bg-[#FDF9F3]/85 hover:bg-white px-4 py-2 rounded-full border border-white/80 shadow-2xs backdrop-blur-md transition-all hover:-translate-x-0.5"
            >
              <span>←</span>
              <span>Kembali ke Katalog</span>
            </Link>
          </div>
        </div>

        {/* 2. MAIN OVERLAPPING SHEET CARD */}
        <div className="relative z-10 -mt-24 sm:-mt-28 lg:-mt-32 max-w-6xl mx-auto px-0 sm:px-6 lg:px-8">
          {/* PENTING: Tanpa overflow-hidden agar buku 3D bisa menonjol keluar & beranimasi bebas */}
          <div className="bg-[#FDF9F3] rounded-t-[36px] sm:rounded-[36px] border border-[#EBCFA9]/70 shadow-[0_-8px_30px_rgba(121,84,61,0.06)] lg:shadow-[0_16px_48px_rgba(121,84,61,0.08)] px-5 sm:px-8 lg:px-10 pt-5 pb-12">
            
            {/* Grid Responsif: 1 Kolom Terpusat di HP, 2 Kolom Proporsional di Laptop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
              
              {/* KOLOM KIRI: Buku 3D Interaktif + Info Sirkulasi (Laptop) */}
              <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24">
                {/* Wadah Buku 3D Melayang di Perbatasan Backdrop & Kartu */}
                <div className="w-full max-w-[215px] sm:max-w-[240px] lg:max-w-[265px] mx-auto -mt-28 sm:-mt-32 lg:-mt-28 relative z-20">
                  <BookCover3D
                    coverUrl={book.cover_url}
                    title={book.title}
                    stockAvailable={book.stock_available}
                  />
                </div>

                {/* Kotak Stok & Tombol Pinjam (Khusus Tampilan Laptop) */}
                <div className="hidden lg:block w-full mt-6 space-y-4">
                  <div className="bg-[#F7EBD8]/65 rounded-2xl p-4 border border-[#EBCFA9]/70 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-[#79543D]">
                      <span className="text-[#79543D]/70 font-medium">Stok Fisik Tersedia:</span>
                      <strong className={`font-semibold ${book.stock_available > 0 ? 'text-[#929D75]' : 'text-[#C96858]'}`}>
                        {book.stock_available} dari {book.stock_total} buku
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-[#79543D]">
                      <span className="text-[#79543D]/70 font-medium">Durasi Peminjaman:</span>
                      <strong className="font-semibold">{book.loan_duration_days} hari</strong>
                    </div>
                    <div className="flex justify-between items-center text-[#79543D]">
                      <span className="text-[#79543D]/70 font-medium">Tarif Denda Harian:</span>
                      <strong className="font-semibold text-[#C96858]">
                        Rp {parseFloat(book.fine_per_day).toLocaleString('id-ID')} / hari
                      </strong>
                    </div>
                  </div>

                  <div>
                    {user ? (
                      <BorrowButton
                        bookId={book.id}
                        bookTitle={book.title}
                        isEligible={isEligible}
                        disabledReason={disabledReason}
                      />
                    ) : (
                      <div className="space-y-2.5">
                        <Link
                          href="/login"
                          className="block text-center w-full py-3.5 px-6 rounded-full bg-[#929D75] hover:bg-[#7a845f] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer btn-bobo"
                        >
                          Masuk untuk Meminjam Buku
                        </Link>
                        <p className="text-[11px] text-[#79543D]/65 text-center leading-relaxed">
                          Anda sedang menjelajah sebagai <strong>Tamu</strong>. Masuk sebagai mahasiswa Universitas Hasanuddin untuk melakukan permohonan pinjam.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: Judul, Metadata, CTA Mobile & Tabs */}
              <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left">
                
                {/* Metadata Pills (Kategori, Kode Rak, Tahun, Rating) */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <Badge variant="sage">{book.category_name}</Badge>
                  <span className="text-xs font-mono text-[#79543D]/75 bg-[#EBCFA9]/45 px-3 py-1 rounded-full border border-[#EBCFA9]/70">
                    {book.classification_code}
                  </span>
                  <span className="text-xs text-[#79543D]/70 bg-[#F7EBD8] px-3 py-1 rounded-full border border-[#EBCFA9]/60">
                    Tahun {book.publication_year}
                  </span>
                  <div className="inline-flex items-center gap-1 text-xs text-[#855B10] font-bold bg-[#F5C875]/25 px-3 py-1 rounded-full border border-[#F5C875]/50">
                    <span>★</span>
                    <span>{book.avg_rating > 0 ? book.avg_rating : 'Baru'}</span>
                    {book.review_count > 0 && (
                      <span className="text-[#79543D]/65 font-normal">({book.review_count})</span>
                    )}
                  </div>
                </div>

                {/* Judul Buku */}
                <h1 className="mt-3 font-editorial text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] text-[#79543D] leading-[1.18] tracking-tight">
                  {book.title}
                </h1>

                {/* Penulis & Penerbit */}
                <div className="mt-2.5 flex flex-wrap items-center justify-center lg:justify-start gap-x-2.5 gap-y-1 text-xs sm:text-sm text-[#79543D]/80">
                  <span>
                    Penulis:{' '}
                    <span className="font-semibold text-[#79543D] underline underline-offset-4 decoration-[#929D75]">
                      {book.author}
                    </span>
                  </span>
                  <span>&bull;</span>
                  <span>
                    Penerbit: <strong>{book.publisher}</strong>
                  </span>
                </div>

                {/* Ringkasan Sirkulasi & Tombol Pinjam (Khusus Mobile — Ringkas 3 Kolom) */}
                <div className="lg:hidden w-full mt-5 space-y-3.5 text-left">
                  <div className="bg-[#F7EBD8]/70 rounded-2xl p-3.5 border border-[#EBCFA9]/70 grid grid-cols-3 divide-x divide-[#EBCFA9]/80 text-center">
                    <div className="px-1.5">
                      <span className="block text-[10px] text-[#79543D]/65 font-medium">Stok Fisik</span>
                      <strong className={`text-xs font-bold mt-0.5 block ${book.stock_available > 0 ? 'text-[#929D75]' : 'text-[#C96858]'}`}>
                        {book.stock_available} / {book.stock_total} buku
                      </strong>
                    </div>
                    <div className="px-1.5">
                      <span className="block text-[10px] text-[#79543D]/65 font-medium">Durasi</span>
                      <strong className="text-xs font-bold text-[#79543D] mt-0.5 block">
                        {book.loan_duration_days} hari
                      </strong>
                    </div>
                    <div className="px-1.5">
                      <span className="block text-[10px] text-[#79543D]/65 font-medium">Denda/Hari</span>
                      <strong className="text-xs font-bold text-[#C96858] mt-0.5 block">
                        Rp {parseFloat(book.fine_per_day).toLocaleString('id-ID')}
                      </strong>
                    </div>
                  </div>

                  {user ? (
                    <BorrowButton
                      bookId={book.id}
                      bookTitle={book.title}
                      isEligible={isEligible}
                      disabledReason={disabledReason}
                    />
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/login"
                        className="block text-center w-full py-3.5 px-6 rounded-full bg-[#929D75] hover:bg-[#7a845f] text-white font-semibold text-sm transition-all shadow-sm btn-bobo"
                      >
                        Masuk untuk Meminjam Buku
                      </Link>
                      <p className="text-[11px] text-[#79543D]/65 text-center leading-relaxed">
                        Masuk sebagai mahasiswa Universitas Hasanuddin untuk mengajukan pinjaman.
                      </p>
                    </div>
                  )}
                </div>

                {/* Garis Pemisah Tipis Ala Referensi */}
                <div className="w-full h-px bg-[#EBCFA9]/65 my-6" />

                {/* Interactive Tabs (Ikhtisar, Spesifikasi, Aturan, Ulasan) */}
                <div className="w-full text-left">
                  <ScrollReveal variant="up" delay={100}>
                    <BookDetailTabs book={book} />
                  </ScrollReveal>
                </div>
              </div>
            </div>

            {/* 3. KOLEKSI SEJENIS (Rekomendasi Buku di Bagian Bawah Kartu) */}
            {relatedBooks.length > 0 && (
              <ScrollReveal variant="up" delay={200}>
                <div className="mt-12 pt-8 border-t border-[#EBCFA9]/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#929D75]">
                        Koleksi Sejenis
                      </span>
                      <h3 className="font-editorial text-xl text-[#79543D] mt-0.5">
                        Rekomendasi Lain di Kategori {book.category_name}
                      </h3>
                    </div>
                    <Link
                      href={`/catalog?cat=${book.category_id}`}
                      className="text-xs font-semibold text-[#929D75] hover:underline"
                    >
                      Semua →
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {relatedBooks.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/catalog/${rel.id}`}
                        className="group bg-[#F7EBD8]/45 hover:bg-white rounded-2xl p-3 border border-[#EBCFA9]/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-[3/4.2] rounded-xl overflow-hidden bg-[#EBCFA9]/25 mb-2.5 shadow-2xs">
                            {rel.cover_url ? (
                              <img
                                src={rel.cover_url}
                                alt={rel.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center p-2 text-center bg-gradient-to-br from-[#EBCFA9]/40 to-[#d4b896]/30">
                                <span className="font-editorial text-[10px] text-[#79543D]/50">Bo&apos;bo</span>
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-xs text-[#79543D] line-clamp-2 leading-snug group-hover:text-[#929D75] transition-colors">
                            {rel.title}
                          </h4>
                          <p className="text-[10px] text-[#79543D]/60 truncate mt-0.5">{rel.author}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#EBCFA9]/50 text-[10px]">
                          {rel.avg_rating > 0 ? (
                            <span className="text-[#855B10] font-bold">★ {rel.avg_rating}</span>
                          ) : (
                            <span className="text-[#79543D]/50">Baru</span>
                          )}
                          <span className="text-[#929D75] font-semibold group-hover:underline">Buka</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}