import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import StaggerChildren from '@/components/ui/StaggerChildren';
import { getCurrentUser } from '@/lib/auth/permissions';
import pool from '@/lib/db';

export const revalidate = 0;

const CATEGORIES = [
  { key: '', label: 'Semua Warta' },
  { key: 'ACARA', label: 'Acara' },
  { key: 'OPERASIONAL', label: 'Operasional' },
  { key: 'LAYANAN', label: 'Layanan' },
];

async function getAnnouncementsArchive({ search = '', category = '', page = 1, limit = 9 }) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const offset = (safePage - 1) * limit;

  const conditions = [`a.status = 'PUBLISHED'`, `a.release_at <= CURRENT_DATE`];
  const values = [];

  if (category && ['ACARA', 'OPERASIONAL', 'LAYANAN'].includes(category.toUpperCase())) {
    values.push(category.toUpperCase());
    conditions.push(`a.category = $${values.length}`);
  }

  if (search.trim()) {
    values.push(`%${search.trim()}%`);
    conditions.push(`(a.title ILIKE $${values.length} OR a.content ILIKE $${values.length})`);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM announcements a
    ${whereClause};
  `;
  const countResult = await pool.query(countQuery, values);
  const totalItems = countResult.rows[0]?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const dataValues = [...values, limit, offset];
  const dataQuery = `
    SELECT
      a.id, a.title, a.content, a.category, a.release_at, a.status, a.published_at,
      u.full_name AS author_name
    FROM announcements a
    LEFT JOIN users u ON a.created_by = u.id
    ${whereClause}
    ORDER BY a.release_at DESC, a.id DESC
    LIMIT $${dataValues.length - 1} OFFSET $${dataValues.length};
  `;
  const dataResult = await pool.query(dataQuery, dataValues);

  return {
    items: dataResult.rows,
    pagination: {
      currentPage: safePage,
      totalPages,
      totalItems,
    },
  };
}

export default async function AnnouncementsArchivePage({ searchParams }) {
  const user = await getCurrentUser();
  const params = await searchParams;

  const search = params?.q || '';
  const category = (params?.cat || '').toUpperCase();
  const page = parseInt(params?.page || '1', 10) || 1;

  const { items: announcements, pagination } = await getAnnouncementsArchive({
    search,
    category,
    page,
    limit: 9,
  });

  const buildCategoryUrl = (catKey) => {
    const query = new URLSearchParams();
    if (search.trim()) query.set('q', search.trim());
    if (catKey) query.set('cat', catKey);
    const qs = query.toString();
    return qs ? `/announcements?${qs}` : '/announcements';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EBD8]">
      <Navbar initialUser={user} />

      <main className="flex-1 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ═══════════ PAPAN ARSIP WARTA & FILTER KATEGORI ═══════════ */}
          <ScrollReveal variant="up">
            <div className="relative mb-8 pt-2">

              {/* Baris Tab Kategori Menyatu dengan Papan + Pudar Halus di Ujung */}
              <div className="relative z-20 -mb-[2px] px-3 sm:px-5">
                <div
                  role="navigation"
                  aria-label="Filter kategori warta sirkulasi"
                  style={{
                    WebkitMaskImage:
                      'linear-gradient(to right, transparent 0%, black 22px, black calc(100% - 22px), transparent 100%)',
                    maskImage:
                      'linear-gradient(to right, transparent 0%, black 22px, black calc(100% - 22px), transparent 100%)',
                  }}
                  className="flex items-end gap-1.5 sm:gap-2 overflow-x-auto horizontal-scroll px-5 pt-3 pb-0"
                >
                  {CATEGORIES.map((tab) => {
                    const isActive = category === tab.key;
                    return (
                      <Link
                        key={tab.key || 'all'}
                        href={buildCategoryUrl(tab.key)}
                        className={`relative shrink-0 px-4 sm:px-5 rounded-t-2xl text-xs font-bold transition-colors duration-200 border-t-2 border-x-2 ${
                          isActive
                            ? 'bg-[#FFFDF9] text-[#79543D] border-[#DFC19A] pt-3 pb-3 z-20 shadow-[0_-4px_10px_rgba(121,84,61,0.05)]'
                            : 'bg-[#EAD2B0] hover:bg-[#F1DEC2] text-[#79543D]/75 hover:text-[#79543D] border-[#D7B68C] pt-2 pb-2.5 z-10'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#929D75]" />}
                          {tab.label}
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

                {/* Lembar Perkamen Bagian Dalam */}
                <div className="relative rounded-[22px] border border-dashed border-[#DFC19A]/85 bg-gradient-to-b from-[#FFFDF9] to-[#FCF6EC] px-5 py-6 sm:px-8 sm:py-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[22px] overflow-hidden"
                  >
                    <span className="absolute right-8 bottom-3 font-serif text-7xl text-[#929D75]/[0.06] select-none">
                      ᨅᨚᨅᨚ
                    </span>
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5C875]/25 border border-[#E2B15B]/45 mb-3">
                        <span className="w-2 h-2 rounded-full bg-[#D9A043]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#855B10]">
                          Warta &amp; Layanan Sirkulasi
                        </span>
                      </div>

                      <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#79543D] leading-[1.12] tracking-tight">
                        Arsip Pengumuman &amp;{' '}
                        <span className="font-editorial-italic text-[#929D75]">Warta</span>
                        <span className="text-[#C96858]">.</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-[#79543D]/70 mt-2.5 leading-relaxed">
                        Kumpulan informasi jadwal sirkulasi, agenda kegiatan literasi, dan pengumuman layanan Perpustakaan Bo&apos;bo.
                      </p>
                    </div>

                    {/* Kartu Ringkasan Arsip + Maskot Bo'bo Mengintip */}
                    <div className="relative shrink-0 mt-4 md:mt-2">
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
                            Warta
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#79543D]/55">
                            Total Terbitan
                          </p>
                          <p className="font-editorial text-xl font-bold text-[#79543D] leading-tight">
                            {pagination.totalItems} Warta
                          </p>
                          <p className="text-[11px] text-[#68774E] font-bold">
                            Diurutkan dari terbaru
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Pencarian Berita */}
                  <form
                    method="GET"
                    action="/announcements"
                    className="relative z-10 mt-6 p-2.5 rounded-2xl bg-[#F4E5CE]/85 border-2 border-[#E3C499] flex flex-col sm:flex-row gap-2.5"
                  >
                    {category && <input type="hidden" name="cat" value={category} />}

                    <div className="relative flex-1">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929D75] pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="q"
                        defaultValue={search}
                        placeholder="Cari judul warta, jadwal sirkulasi, atau topik acara..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FFFDF9] border-2 border-[#E6C9A0] text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:border-[#929D75] transition-colors"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-[#929D75] hover:bg-[#849067] text-white font-bold text-sm py-3 px-6 rounded-xl border border-[#77825C] shadow-[0_4px_0_#6C7752] active:translate-y-0.5 active:shadow-[0_1px_0_#6C7752] transition-all cursor-pointer"
                      >
                        Cari Warta
                      </button>
                      {(search || category) && (
                        <Link
                          href="/announcements"
                          className="px-3.5 bg-[#FFFDF9] hover:bg-[#C96858] text-[#79543D] hover:text-white border-2 border-[#E6C9A0] hover:border-[#B25445] shadow-[0_3px_0_#DFC19A] active:translate-y-0.5 text-xs font-extrabold rounded-xl flex items-center justify-center transition-all"
                          title="Reset Filter"
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

          {/* Bar Status Hasil */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#79543D]/70 mb-5 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#929D75]" />
              <span>
                Menampilkan <strong className="text-[#79543D]">{announcements.length}</strong> dari{' '}
                <strong className="text-[#79543D]">{pagination.totalItems}</strong> pengumuman &amp; warta
              </span>
            </div>
            {search && (
              <span className="bg-[#FFFDF9] border border-[#DFC19A] px-3 py-1 rounded-full shadow-2xs">
                Kata kunci: <strong className="text-[#68774E]">&ldquo;{search}&rdquo;</strong>
              </span>
            )}
          </div>

          {/* ═══════════ DAFTAR KUMPULAN BERITA & PENGUMUMAN ═══════════ */}
          {announcements.length === 0 ? (
            <ScrollReveal variant="scale">
              <div className="bg-[#FFFDF9] rounded-[32px] p-16 text-center border-2 border-[#DFC19A] shadow-[0_8px_0_#E5C89E] space-y-4">
                <div className="text-5xl animate-float">📰</div>
                <h3 className="font-editorial text-xl text-[#79543D]">Warta tidak ditemukan</h3>
                <p className="text-xs text-[#79543D]/60 max-w-sm mx-auto">
                  Belum ada pengumuman atau berita yang sesuai dengan filter atau kata kunci Anda.
                </p>
                <Link
                  href="/announcements"
                  className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#929D75] text-white text-xs font-bold shadow-[0_4px_0_#6C7752] hover:bg-[#849067] transition"
                >
                  Lihat Semua Warta
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <StaggerChildren
              key={`${category || 'all'}-${search}-${page}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              staggerDelay={100}
            >
              {announcements.map((item) => {
                const categoryVariant =
                  item.category === 'ACARA'
                    ? 'yellow'
                    : item.category === 'OPERASIONAL'
                      ? 'terracotta'
                      : 'sage';

                return (
                  <article
                    key={item.id}
                    className="stagger-item bg-[#FFFDF9]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#EBCFA9]/80 shadow-[0_6px_0_#EAD2B0]/70 flex flex-col justify-between hover:border-[#DFC19A] hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant={categoryVariant}>{item.category}</Badge>
                        <time className="text-[11px] font-medium text-[#79543D]/55">
                          {new Date(item.release_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </time>
                      </div>

                      <h2 className="font-bold text-base text-[#79543D] leading-snug group-hover:text-[#929D75] transition-colors">
                        <Link href={`/announcements/${item.id}`}>{item.title}</Link>
                      </h2>

                      <p className="text-xs text-[#79543D]/70 line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-4 mt-5 border-t border-[#EBCFA9]/60 flex items-center justify-between text-xs">
                      <span className="text-[#79543D]/55 truncate max-w-[55%]">
                        Oleh: {item.author_name || 'Staf Perpustakaan'}
                      </span>
                      <Link
                        href={`/announcements/${item.id}`}
                        className="font-semibold text-[#929D75] hover:text-[#7e8963] transition-colors group-hover:underline shrink-0"
                      >
                        Baca Selengkapnya →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </StaggerChildren>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <ScrollReveal variant="up" delay={250}>
              <div className="mt-12 flex items-center justify-center gap-2">
                {pagination.currentPage > 1 && (
                  <Link
                    href={`/announcements?${new URLSearchParams({
                      ...(search ? { q: search } : {}),
                      ...(category ? { cat: category } : {}),
                      page: String(pagination.currentPage - 1),
                    }).toString()}`}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FFFDF9] border border-[#EBCFA9] text-[#79543D] hover:bg-[#929D75] hover:text-white hover:border-[#929D75] transition-all text-sm"
                  >
                    ←
                  </Link>
                )}

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                  const isCurrent = p === pagination.currentPage;
                  const searchString = new URLSearchParams({
                    ...(search ? { q: search } : {}),
                    ...(category ? { cat: category } : {}),
                    page: String(p),
                  }).toString();

                  return (
                    <Link
                      key={p}
                      href={`/announcements?${searchString}`}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#929D75] text-white shadow-md scale-110'
                          : 'bg-[#FFFDF9] border border-[#EBCFA9] text-[#79543D] hover:bg-[#EBCFA9]/40 hover:-translate-y-0.5'
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}

                {pagination.currentPage < pagination.totalPages && (
                  <Link
                    href={`/announcements?${new URLSearchParams({
                      ...(search ? { q: search } : {}),
                      ...(category ? { cat: category } : {}),
                      page: String(pagination.currentPage + 1),
                    }).toString()}`}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FFFDF9] border border-[#EBCFA9] text-[#79543D] hover:bg-[#929D75] hover:text-white hover:border-[#929D75] transition-all text-sm"
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