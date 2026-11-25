import Link from 'next/link';
import Image from 'next/image';
import BoboIntro from '@/components/layout/BoboIntro';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import StaggerChildren from '@/components/ui/StaggerChildren';
import FeaturedCarousel from '@/components/books/FeaturedCarousel';
import { restrictStaffFromPublicPages } from '@/lib/auth/permissions';
import { getTopBooks } from '@/lib/queries/books';
import { getPublishedAnnouncements } from '@/lib/queries/announcements';

export const dynamic = 'force-dynamic';

const BOOKMARK_TABS = [
  {
    number: '01',
    label: 'Buku Populer',
    href: '#popular',
    bg: 'from-[#C96858] to-[#B45646]',
    text: 'text-[#FFF9F0]',
    badgeBg: 'bg-[#FFF9F0]/20 text-[#FFF9F0]',
  },
  {
    number: '02',
    label: 'Warta Terkini',
    href: '#announcements',
    bg: 'from-[#929D75] to-[#7D8861]',
    text: 'text-[#FFF9F0]',
    badgeBg: 'bg-[#FFF9F0]/20 text-[#FFF9F0]',
  },
  {
    number: '03',
    label: "Nilai Bo'bo",
    href: '#pillars',
    bg: 'from-[#E2B15B] to-[#CE9B43]',
    text: 'text-[#4F3524]',
    badgeBg: 'bg-[#4F3524]/15 text-[#4F3524]',
  },
];

export default async function HomePage() {
  const user = await restrictStaffFromPublicPages();
  const topBooks = await getTopBooks(5);
  const announcements = await getPublishedAnnouncements(3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EBD8]">
      <BoboIntro />
      <Navbar initialUser={user} />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#F7EBD8] pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-7 lg:pb-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#EBCFA9]/35 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#929D75]/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative mx-auto md:mr-32 lg:mr-36">
              <div
                aria-hidden="true"
                className="absolute -bottom-3 left-[4%] right-[4%] -z-10 h-7 rounded-full bg-[#5A3C2A]/25 blur-xl"
              />

              <nav
                aria-label="Navigasi cepat bagian beranda"
                className="absolute left-full top-8 z-0 hidden flex-col gap-2.5 md:flex"
              >
                {BOOKMARK_TABS.map((tab) => (
                  <a
                    key={tab.href}
                    href={tab.href}
                    className={`group relative -ml-7 flex w-44 items-center gap-2 rounded-r-2xl border-y border-r border-[#5A3C2A]/25 bg-gradient-to-r ${tab.bg} py-2.5 pl-8 pr-3.5 shadow-[inset_10px_0_14px_rgba(90,60,42,0.22),4px_6px_14px_rgba(90,60,42,0.16)] transition-all duration-300 hover:translate-x-2.5 hover:brightness-105 focus-visible:translate-x-2.5 focus-visible:outline-none active:translate-x-2.5 lg:w-48`}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-1 right-1 left-2 rounded-r-xl border-y border-r border-dashed border-white/30"
                    />
                    <span
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${tab.badgeBg}`}
                    >
                      {tab.number}
                    </span>
                    <span className={`truncate text-xs font-bold tracking-wide ${tab.text}`}>
                      {tab.label}
                    </span>
                  </a>
                ))}
              </nav>

              <div className="relative z-10 rounded-[26px] border-2 border-[#5A3C2A] bg-gradient-to-b from-[#8A6146] via-[#79543D] to-[#5E3F2C] p-2 shadow-[0_18px_40px_rgba(90,60,42,0.18)] sm:rounded-[32px] sm:p-3">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[5px] rounded-[21px] border border-dashed border-[#EBCFA9]/25 sm:inset-[6px] sm:rounded-[26px]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1 left-1/2 z-30 hidden h-3 w-16 -translate-x-1/2 rounded-b-xl border-x border-b border-[#4A3020] bg-[#5E3F2C] shadow-inner md:block"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-1 left-1/2 z-30 hidden h-3.5 w-20 -translate-x-1/2 rounded-t-xl border-x border-t border-[#4A3020] bg-[#5E3F2C] shadow-md md:block"
                />

                <div className="relative rounded-[20px] border border-[#C5A47C] bg-[#E5C9A1] pb-2 sm:rounded-[24px] sm:px-1.5 sm:pb-2.5">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-3 bottom-[3px] h-[5px] rounded-b-[18px] border-b border-t border-[#B8956A]/60 bg-[#F2DEC0]/70"
                  />

                  <div className="relative grid overflow-hidden rounded-[18px] border border-[#D4B48C] bg-[#FDF9F3] shadow-inner sm:rounded-[21px] md:grid-cols-2">
                    <div className="texture-grain relative z-10 flex flex-col justify-between bg-gradient-to-r from-[#FDF9F3] via-[#FDF9F3] to-[#F3E5CE] px-6 py-6 sm:px-9 sm:py-7 lg:px-10 lg:py-8">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-3 rounded-[14px] border border-[#EBCFA9]/75"
                      />

                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-5 top-4 text-xs text-[#C5A47C]/70"
                      >
                        ⌜
                      </span>

                      <div className="relative z-10 my-auto pt-2">
                        <h1 className="font-editorial text-[clamp(1.8rem,3.1vw,2.75rem)] leading-[1.12] tracking-[-0.03em] text-[#79543D]">
                          Tempat pengetahuan,
                          <br />
                          <span className="font-editorial-italic text-[#929D75]">
                            cerita,
                          </span>{' '}
                          dan
                          <br />
                          wawasan bertumbuh.
                        </h1>

                        <p className="mt-4 max-w-md text-xs leading-relaxed text-[#79543D]/80 sm:text-[13.5px]">
                          Selamat datang di <strong>Bo&apos;bo</strong>, perpustakaan
                          digital kampus Universitas Hasanuddin. Temukan buku,
                          naskah budaya, dan berbagai sumber pengetahuan.
                        </p>

                        <form action="/catalog" method="GET" className="mt-5">
                          <div className="flex flex-col gap-2 rounded-2xl border border-[#DFC39D] bg-white/95 p-1.5 shadow-[0_4px_14px_rgba(121,84,61,0.06)] transition-all focus-within:border-[#929D75] focus-within:ring-2 focus-within:ring-[#929D75]/20 sm:flex-row sm:items-center sm:rounded-full">
                            <div className="flex flex-1 items-center gap-2.5 pl-3 pr-2">
                              <svg
                                className="h-4 w-4 shrink-0 text-[#929D75]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                <path
                                  d="m16.5 16.5 3.5 3.5"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>

                              <input
                                type="text"
                                name="q"
                                placeholder="Cari judul, penulis, atau ISBN..."
                                className="h-9 w-full min-w-0 bg-transparent text-xs text-[#79543D] outline-none placeholder:text-[#79543D]/45 sm:text-[13px]"
                              />
                            </div>

                            <button
                              type="submit"
                              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#929D75] px-4 text-xs font-semibold text-white transition-all hover:bg-[#7A845F] hover:shadow-sm sm:rounded-full sm:px-5"
                            >
                              <span>Temukan Buku</span>
                              <span aria-hidden="true">»</span>
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="pointer-events-none mt-4 flex items-center justify-between text-[11px] text-[#79543D]/35">
                        <span>⌞</span>
                        <span className="font-editorial italic">01</span>
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-1/2 z-30 hidden w-10 -translate-x-1/2 md:block"
                    >
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-[#79543D]/20 to-transparent" />
                      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#79543D]/30" />
                      <div className="absolute inset-y-8 left-1/2 flex -translate-x-1/2 flex-col justify-between">
                        <span className="h-3 w-[2px] rounded-full bg-[#FDF9F3]/80" />
                        <span className="h-3 w-[2px] rounded-full bg-[#FDF9F3]/80" />
                        <span className="h-3 w-[2px] rounded-full bg-[#FDF9F3]/80" />
                      </div>
                    </div>

                    <div className="texture-grain relative flex min-h-[290px] flex-col justify-between border-t border-[#E5C9A1] bg-gradient-to-l from-[#FAF2E4] via-[#F7EBDA] to-[#EAD7B9] px-6 py-6 sm:px-9 sm:py-7 md:min-h-0 md:border-t-0 lg:px-10 lg:py-8">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-3 rounded-[14px] border border-[#D9B990]/75"
                      />

                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <span
                          aria-hidden="true"
                          className="text-base text-[#C96858]/45"
                        >
                          ✳
                        </span>

                        <div className="text-right">
                          <span className="block font-serif text-2xl font-bold tracking-[0.14em] text-[#79543D] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] sm:text-[28px]">
                            ᨅᨚᨅᨚ
                          </span>
                          <p className="mt-1 font-editorial text-[11px] italic leading-snug text-[#79543D]/75 sm:text-xs">
                            &ldquo;Membaca hari ini,
                            <br />
                            menumbuhkan esok.&rdquo;
                          </p>
                        </div>
                      </div>

                      <div className="relative z-10 my-auto flex items-center justify-center py-2">
                        <div
                          aria-hidden="true"
                          className="absolute h-[195px] w-[195px] rounded-full border border-[#929D75]/20 bg-[#EBCFA9]/35 sm:h-[230px] sm:w-[230px]"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute h-[165px] w-[165px] rounded-full bg-[#FDF9F3]/65 blur-xl sm:h-[195px] sm:w-[195px]"
                        />

                        <svg
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-1 left-5 h-20 w-20 text-[#929D75]/55 sm:left-8"
                          viewBox="0 0 80 80"
                          fill="currentColor"
                        >
                          <path d="M65 70 C45 65, 25 45, 18 20 C35 25, 55 45, 65 70 Z" />
                          <path d="M55 72 C35 72, 15 62, 8 48 C25 48, 42 58, 55 72 Z" opacity="0.7" />
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-1 right-5 h-20 w-20 -scale-x-100 text-[#929D75]/55 sm:right-8"
                          viewBox="0 0 80 80"
                          fill="currentColor"
                        >
                          <path d="M65 70 C45 65, 25 45, 18 20 C35 25, 55 45, 65 70 Z" />
                          <path d="M55 72 C35 72, 15 62, 8 48 C25 48, 42 58, 55 72 Z" opacity="0.7" />
                        </svg>

                        <div className="relative h-[200px] w-[235px] animate-float-slow sm:h-[235px] sm:w-[275px]">
                          <Image
                            src="/brand/bo-bo-logo.png"
                            alt="Maskot ayam Bo'bo membaca buku"
                            fill
                            priority
                            sizes="(max-width: 640px) 235px, 275px"
                            className="object-contain drop-shadow-[0_12px_16px_rgba(121,84,61,0.14)]"
                          />
                        </div>
                      </div>

                      <div className="pointer-events-none flex items-center justify-between text-[11px] text-[#79543D]/35">
                        <span className="font-editorial italic">02</span>
                        <span className="text-[#D5A64F]/80">✦</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <nav
                aria-label="Navigasi cepat bagian beranda"
                className="mt-5 flex flex-wrap items-center justify-center gap-2 md:hidden"
              >
                {BOOKMARK_TABS.map((tab) => (
                  <a
                    key={tab.href}
                    href={tab.href}
                    className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${tab.bg} px-3.5 py-2 text-xs font-bold shadow-sm transition-transform active:scale-95 ${tab.text}`}
                  >
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab.badgeBg}`}>
                      {tab.number}
                    </span>
                    <span>{tab.label}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#79543D]/15" />
              <Link
                href="/catalog"
                className="text-xs font-semibold text-[#79543D]/65 transition-colors hover:text-[#929D75]"
              >
                Jelajahi Perpustakaan ↗
              </Link>
            </div>
          </div>
        </section>

        <section
          id="popular"
          className="scroll-mt-16 py-16 sm:py-20 bg-gradient-to-b from-[#F7EBD8] via-[#DFEEF5] to-[#F7EBD8] relative overflow-hidden"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-12 -left-12 w-56 h-24 rounded-full bg-[#FFFDF9]/75 blur-[2px] animate-float-slow" />
            <div className="absolute top-24 right-[-20px] w-64 h-28 rounded-full bg-[#FFFDF9]/70 blur-[2px] animate-float" />
            <div className="hidden md:block absolute top-14 left-1/3 w-44 h-18 rounded-full bg-[#FFFDF9]/55 blur-[1px] animate-float-slow" />
            <div className="hidden lg:block absolute bottom-28 left-[14%] w-40 h-16 rounded-full bg-[#FFFDF9]/50 blur-[1px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal variant="up">
              <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9]/75 border border-white/80 backdrop-blur-xs mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#C96858] animate-gentle-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#79543D]">
                    Top 5 Peminjaman Tertinggi
                  </span>
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#79543D] mb-2">
                  Buku Terpopuler di Kampus
                </h2>
                <p className="text-sm text-[#79543D]/70">
                  Geser atau pilih salah satu buku yang tergantung untuk melihat ringkasan dan detail koleksinya.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="scale" delay={150}>
              <FeaturedCarousel books={topBooks} />
            </ScrollReveal>

            <ScrollReveal variant="up" delay={200}>
              <div className="text-center mt-10">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-3 bg-white/85 border border-[#EBCFA9] text-[#79543D] font-semibold text-sm px-7 py-3.5 rounded-2xl shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all duration-300 btn-bobo"
                >
                  <span>Jelajahi Seluruh Lemari Katalog</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-divider">
            <span>Warta Terkini</span>
          </div>
        </div>

        <section id="announcements" className="scroll-mt-16 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal variant="up">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F5C875]" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#855B10]">
                    Warta &amp; Layanan Sirkulasi
                  </span>
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#79543D] mb-2">
                  Pengumuman Operasional
                </h2>
                <p className="text-sm text-[#79543D]/60">
                  Informasi jadwal meja sirkulasi, agenda literasi, dan tata tertib layanan.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={150}>
              {announcements.map((item) => {
                const categoryVariant =
                  item.category === 'ACARA' ? 'yellow' : item.category === 'OPERASIONAL' ? 'terracotta' : 'sage';

                return (
                  <article
                    key={item.id}
                    className="stagger-item bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-[#EBCFA9]/60 shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-400 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={categoryVariant}>{item.category}</Badge>
                        <time className="text-[11px] font-medium text-[#79543D]/50">
                          {new Date(item.release_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </time>
                      </div>

                      <h3 className="font-bold text-base text-[#79543D] leading-snug group-hover:text-[#929D75] transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-[#79543D]/65 line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#EBCFA9]/50 flex items-center justify-between text-xs">
                      <span className="text-[#79543D]/50">Oleh: {item.author_name || 'Staf Perpustakaan'}</span>
                      <Link
                        href={`/announcements/${item.id}`}
                        className="font-semibold text-[#929D75] hover:text-[#7e8963] transition-colors group-hover:underline"
                      >
                        Baca Selengkapnya →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </StaggerChildren>

            <ScrollReveal variant="up" delay={200}>
              <div className="text-center mt-10">
                <Link
                  href="/announcements"
                  className="inline-flex items-center gap-2.5 bg-white/85 border border-[#EBCFA9] text-[#79543D] font-semibold text-sm px-7 py-3.5 rounded-2xl shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all duration-300 btn-bobo"
                >
                  <span>Lihat Semua Warta &amp; Pengumuman</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="pillars" className="scroll-mt-16 py-16 bg-gradient-to-b from-[#EBCFA9]/15 to-[#F7EBD8] relative">
          <div className="absolute inset-0 texture-grain" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal variant="up">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#79543D] mb-2">
                  Tiga Nilai Utama Bo&apos;bo
                </h2>
                <p className="text-sm text-[#79543D]/60">
                  Kombinasi budaya lokal, semangat kemandirian kampus, dan tertib sirkulasi digital.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={150}>
              {[
                {
                  icon: '\u1A05',
                  iconBg: 'bg-[#929D75]/12',
                  iconColor: 'text-[#929D75]',
                  title: 'Budaya Lokal Bugis',
                  desc: 'Pemberdayaan naskah Lontara dan falsafah Bugis-Makassar sebagai identitas pengetahuan yang mengakar kuat.',
                },
                {
                  icon: '🐓',
                  iconBg: 'bg-[#F5C875]/20',
                  iconColor: 'text-[#855B10]',
                  title: 'Ayam Jantan dari Timur',
                  desc: 'Maskot ayam pustakawan merepresentasikan semangat juang dan kebanggaan civitas akademika Universitas Hasanuddin.',
                },
                {
                  icon: '📖',
                  iconBg: 'bg-[#C96858]/12',
                  iconColor: 'text-[#C96858]',
                  title: 'Sirkulasi Tertib & Adil',
                  desc: 'Perlindungan kuota stok transaksional, otomatisasi denda harian, dan ulasan terverifikasi.',
                },
              ].map((pillar, i) => (
                <div
                  key={i}
                  className="stagger-item bg-white/60 backdrop-blur-sm rounded-3xl p-7 border border-[#EBCFA9]/50 text-center space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-400 group"
                >
                  <div className={`w-14 h-14 ${pillar.iconBg} ${pillar.iconColor} rounded-2xl mx-auto flex items-center justify-center font-serif text-2xl font-bold group-hover:scale-110 transition-transform duration-300`}>
                    {pillar.icon}
                  </div>
                  <h3 className="font-bold text-base text-[#79543D] group-hover:text-[#929D75] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#79543D]/65 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}