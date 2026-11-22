import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import CatalogCabinetShelves from '@/components/books/CatalogCabinetShelves';
import { getCurrentUser } from '@/lib/auth/permissions';
import { getBooksCatalog } from '@/lib/queries/books';
import { getAllCategories } from '@/lib/queries/categories';

export const revalidate = 0;

export default async function CatalogPage({ searchParams }) {
  const user = await getCurrentUser();
  const params = await searchParams;

  const search = params?.q || '';
  const categoryId = params?.cat || '';
  const sortBy = params?.sort || 'popular';
  const page = parseInt(params?.page || '1', 10);

  const [categories, catalogData] = await Promise.all([
    getAllCategories(),
    getBooksCatalog({
      search,
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      sortBy,
      page,
      limit: 100,
    }),
  ]);

  const { items: books, pagination } = catalogData;

  const buildCategoryUrl = (catId) => {
    const query = new URLSearchParams();
    if (search) query.set('q', search);
    if (catId) query.set('cat', String(catId));
    if (sortBy && sortBy !== 'popular') query.set('sort', sortBy);
    const qs = query.toString();
    return qs ? `/catalog?${qs}` : '/catalog';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EBD8]">
      <Navbar initialUser={user} />

      <main className="flex-1 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ═══════════ PAPAN KATALOG & TAB INDEKS PUSTAKA ═══════════ */}
          <ScrollReveal variant="up">
            <div className="relative mb-8 pt-2">
              
              {/* Baris Tab Pembatas Folder Menyatu dengan Papan + Pudar Halus di Ujung */}
              <div className="relative z-20 -mb-[2px] px-3 sm:px-5">
                <div
                  role="navigation"
                  aria-label="Filter kategori buku"
                  style={{
                    WebkitMaskImage:
                      'linear-gradient(to right, transparent 0%, black 22px, black calc(100% - 22px), transparent 100%)',
                    maskImage:
                      'linear-gradient(to right, transparent 0%, black 22px, black calc(100% - 22px), transparent 100%)',
                  }}
                  className="flex items-end gap-1.5 sm:gap-2 overflow-x-auto horizontal-scroll px-5 pt-3 pb-0"
                >
                  {/* Tab: Semua Koleksi */}
                  <Link
                    href={buildCategoryUrl('')}
                    className={`relative shrink-0 px-4 sm:px-5 rounded-t-2xl text-xs font-bold transition-colors duration-200 border-t-2 border-x-2 ${
                      !categoryId
                        ? 'bg-[#FFFDF9] text-[#79543D] border-[#DFC19A] pt-3 pb-3 z-20 shadow-[0_-4px_10px_rgba(121,84,61,0.05)]'
                        : 'bg-[#EAD2B0] hover:bg-[#F1DEC2] text-[#79543D]/75 hover:text-[#79543D] border-[#D7B68C] pt-2 pb-2.5 z-10'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          !categoryId ? 'bg-[#929D75]' : 'bg-[#79543D]/35'
                        }`}
                      />
                      Semua Koleksi
                    </span>
                  </Link>

                  {/* Tab per Kategori */}
                  {categories.map((c) => {
                    const isActive = String(categoryId) === String(c.id);
                    return (
                      <Link
                        key={c.id}
                        href={buildCategoryUrl(c.id)}
                        className={`relative shrink-0 px-4 sm:px-5 rounded-t-2xl text-xs font-bold transition-colors duration-200 border-t-2 border-x-2 ${
                          isActive
                            ? 'bg-[#FFFDF9] text-[#79543D] border-[#DFC19A] pt-3 pb-3 z-20 shadow-[0_-4px_10px_rgba(121,84,61,0.05)]'
                            : 'bg-[#EAD2B0] hover:bg-[#F1DEC2] text-[#79543D]/75 hover:text-[#79543D] border-[#D7B68C] pt-2 pb-2.5 z-10'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#929D75]" />
                          )}
                          {c.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Badan Papan Perkamen & Bingkai Kayu Taktil */}
              <div className="relative z-10 bg-[#FFFDF9] rounded-[30px] border-2 border-[#DFC19A] shadow-[0_8px_0_#E5C89E,0_20px_38px_-12px_rgba(121,84,61,0.16)] p-2.5 sm:p-3.5">
                
                {/* Siku Sudut Emas Taktil di 4 Pojok */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2 left-2 w-4 h-4 rounded-tl-xl border-t-[3px] border-l-[3px] border-[#C9A36B]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2 right-2 w-4 h-4 rounded-tr-xl border-t-[3px] border-r-[3px] border-[#C9A36B]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-2 left-2 w-4 h-4 rounded-bl-xl border-b-[3px] border-l-[3px] border-[#C9A36B]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-2 right-2 w-4 h-4 rounded-br-xl border-b-[3px] border-r-[3px] border-[#C9A36B]"
                />

                {/* Lembar Perkamen Bagian Dalam dengan Jahitan Putus-Putus */}
                <div className="relative rounded-[22px] border border-dashed border-[#DFC19A]/85 bg-gradient-to-b from-[#FFFDF9] to-[#FCF6EC] px-5 py-6 sm:px-8 sm:py-7">
                  {/* Lapisan Watermark Lontara Halus */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[22px] overflow-hidden"
                  >
                    <span className="absolute right-8 bottom-3 font-serif text-7xl text-[#929D75]/[0.06] select-none">
                      ᨅᨚᨅᨚ
                    </span>
                  </div>

                  {/* Baris Judul + Lencana Daun & Kartu Indeks Koleksi */}
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                      {/* Plakat Daun Kecil */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#929D75]/15 border border-[#929D75]/30 mb-3">
                        <svg
                          aria-hidden="true"
                          className="w-3.5 h-3.5 text-[#68774E]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5F6E47]">
                          Pusat Koleksi Pustaka
                        </span>
                      </div>

                      <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#79543D] leading-[1.12] tracking-tight">
                        Katalog Perpustakaan{' '}
                        <span className="font-editorial-italic text-[#929D75]">Bo&apos;bo</span>
                        <span className="text-[#C96858]">.</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-[#79543D]/70 mt-2.5 leading-relaxed">
                        Pilih tab kategori di atas atau telusuri judul buku pada lemari pustaka digital kampus.
                      </p>
                    </div>

                    {/* Kartu Indeks Arsip Taktil + Maskot Bo'bo Mengintip */}
                    <div className="relative shrink-0 mt-4 md:mt-2">
                      {/* Maskot Bo'bo Mengintip di Atas Kartu Arsip */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none select-none absolute -top-11 right-3 w-16 h-16 animate-float-slow z-20"
                      >
                        <Image
                          src="/brand/bo-bo-logo.png"
                          alt=""
                          fill
                          sizes="64px"
                          className="object-contain drop-shadow-[0_6px_10px_rgba(121,84,61,0.16)]"
                        />
                      </div>

                      <div className="relative z-10 flex items-center gap-3.5 bg-[#F8EDD9] border-2 border-[#E4C69B] rounded-2xl px-4 py-3.5 shadow-[0_4px_0_#E4C69B]">
                        <div className="w-12 h-12 rounded-xl bg-[#FFFDF9] border-2 border-[#DFC19A] flex flex-col items-center justify-center text-[#79543D] shadow-2xs">
                          <span className="font-serif text-base font-bold leading-none text-[#855B10]">
                            ᨅᨚ
                          </span>
                          <span className="text-[8px] font-extrabold uppercase tracking-wider mt-0.5 text-[#929D75]">
                            Arsip
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#79543D]/55">
                            Koleksi Terdata
                          </p>
                          <p className="font-editorial text-xl font-bold text-[#79543D] leading-tight">
                            {pagination.totalItems} Judul Buku
                          </p>
                          <p className="text-[11px] text-[#68774E] font-bold">
                            {categories.length} Rak Kategori Ilmu
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Baki Pencarian Kayu & Tombol Taktil 3D */}
                  <form
                    method="GET"
                    action="/catalog"
                    className="relative z-10 mt-6 p-2.5 rounded-2xl bg-[#F4E5CE]/85 border-2 border-[#E3C499] grid grid-cols-1 sm:grid-cols-12 gap-2.5"
                  >
                    {categoryId && <input type="hidden" name="cat" value={categoryId} />}

                    {/* Kolom Pencarian */}
                    <div className="sm:col-span-7">
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929D75] pointer-events-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="q"
                          defaultValue={search}
                          placeholder="Cari judul buku, nama penulis, atau nomor ISBN..."
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FFFDF9] border-2 border-[#E6C9A0] text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:border-[#929D75] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Pilihan Urutan */}
                    <div className="sm:col-span-3">
                      <select
                        name="sort"
                        defaultValue={sortBy}
                        aria-label="Urutkan buku"
                        className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border-2 border-[#E6C9A0] text-sm text-[#79543D] font-semibold focus:outline-hidden focus:border-[#929D75] cursor-pointer"
                      >
                        <option value="popular">Urut: Terpopuler</option>
                        <option value="newest">Urut: Tahun Terbaru</option>
                        <option value="rating">Urut: Rating Tertinggi</option>
                        <option value="title">Urut: Judul (A-Z)</option>
                      </select>
                    </div>

                    {/* Tombol Cari 3D & Reset */}
                    <div className="sm:col-span-2 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-[#929D75] hover:bg-[#849067] text-white font-bold text-sm py-3 px-4 rounded-xl border border-[#77825C] shadow-[0_4px_0_#6C7752] active:translate-y-0.5 active:shadow-[0_1px_0_#6C7752] transition-all cursor-pointer"
                      >
                        Temukan
                      </button>
                      {(search || categoryId || sortBy !== 'popular') && (
                        <Link
                          href="/catalog"
                          className="px-3.5 bg-[#FFFDF9] hover:bg-[#C96858] text-[#79543D] hover:text-white border-2 border-[#E6C9A0] hover:border-[#B25445] shadow-[0_3px_0_#DFC19A] active:translate-y-0.5 text-xs font-extrabold rounded-xl flex items-center justify-center transition-all"
                          title="Reset Semua Filter"
                        >
                          ✕
                        </Link>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Bar Status Hasil Pencarian */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#79543D]/70 mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#929D75]" />
              <span>
                Menampilkan <strong className="text-[#79543D]">{books.length}</strong> dari{' '}
                <strong className="text-[#79543D]">{pagination.totalItems}</strong> judul buku di lemari
              </span>
            </div>
            {search && (
              <span className="bg-[#FFFDF9] border border-[#DFC19A] px-3 py-1 rounded-full shadow-2xs">
                Kata kunci: <strong className="text-[#68774E]">&ldquo;{search}&rdquo;</strong>
              </span>
            )}
          </div>

          {/* ═══════════ LEMARI BUKU INTERAKTIF ═══════════ */}
          {books.length === 0 ? (
            <ScrollReveal variant="scale">
              <div className="bg-[#FFFDF9] rounded-[32px] p-16 text-center border-2 border-[#DFC19A] shadow-[0_8px_0_#E5C89E] space-y-4">
                <div className="text-5xl animate-float">📚</div>
                <h3 className="font-editorial text-xl text-[#79543D]">Buku tidak ditemukan</h3>
                <p className="text-xs text-[#79543D]/60 max-w-sm mx-auto">
                  Tidak ada koleksi yang cocok dengan kata kunci atau kategori yang Anda pilih.
                </p>
                <Link
                  href="/catalog"
                  className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#929D75] text-white text-xs font-bold shadow-[0_4px_0_#6C7752] hover:bg-[#849067] transition"
                >
                  Tampilkan Semua Koleksi
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <CatalogCabinetShelves books={books} />
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <ScrollReveal variant="up" delay={300}>
              <div className="mt-12 flex items-center justify-center gap-2">
                {pagination.currentPage > 1 && (
                  <Link
                    href={`/catalog?${new URLSearchParams({
                      ...(search ? { q: search } : {}),
                      ...(categoryId ? { cat: categoryId } : {}),
                      ...(sortBy !== 'popular' ? { sort: sortBy } : {}),
                      page: pagination.currentPage - 1,
                    }).toString()}`}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 border border-[#EBCFA9] text-[#79543D] hover:bg-[#929D75] hover:text-white hover:border-[#929D75] transition-all text-sm"
                  >
                    ←
                  </Link>
                )}

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                  const isCurrent = p === pagination.currentPage;
                  const queryObj = {
                    ...(search ? { q: search } : {}),
                    ...(categoryId ? { cat: categoryId } : {}),
                    ...(sortBy !== 'popular' ? { sort: sortBy } : {}),
                    page: p,
                  };
                  const searchString = new URLSearchParams(queryObj).toString();

                  return (
                    <Link
                      key={p}
                      href={`/catalog?${searchString}`}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#929D75] text-white shadow-md scale-110'
                          : 'bg-white/80 border border-[#EBCFA9] text-[#79543D] hover:bg-[#EBCFA9]/40 hover:-translate-y-0.5'
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}

                {pagination.currentPage < pagination.totalPages && (
                  <Link
                    href={`/catalog?${new URLSearchParams({
                      ...(search ? { q: search } : {}),
                      ...(categoryId ? { cat: categoryId } : {}),
                      ...(sortBy !== 'popular' ? { sort: sortBy } : {}),
                      page: pagination.currentPage + 1,
                    }).toString()}`}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 border border-[#EBCFA9] text-[#79543D] hover:bg-[#929D75] hover:text-white hover:border-[#929D75] transition-all text-sm"
                  >
                    →
                  </Link>
                )}
              </div>
            </ScrollReveal>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}