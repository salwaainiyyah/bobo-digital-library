'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ROLES } from '@/lib/constants';

function SidebarNavIcon({ name, active }) {
  const colorClass = active ? 'text-[#556B43]' : 'text-[#DCE8CE]/85 group-hover:text-white';

  switch (name) {
    case 'home':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'book':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'star':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case 'fine':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      );
    case 'overview':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case 'circulation':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    case 'books':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'megaphone':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
    case 'stats':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'users':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'categories':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    case 'logs':
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    default:
      return (
        <svg className={`w-4 h-4 shrink-0 transition-colors ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      );
  }
}

export default function DashboardShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarScrollRef = useRef(null);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollIndicators = useCallback(() => {
    const el = sidebarScrollRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    setCanScrollUp(scrollTop > 6);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 6);
  }, []);

  useEffect(() => {
    updateScrollIndicators();
    window.addEventListener('resize', updateScrollIndicators);
    return () => window.removeEventListener('resize', updateScrollIndicators);
  }, [updateScrollIndicators, sidebarOpen, pathname, user?.role]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  }

  const roleConfigs = {
    [ROLES.MAHASISWA]: {
      label: 'Mahasiswa',
      tipTitle: 'Tips Pustaka Hari Ini',
      tipText: 'Kembalikan atau perpanjang buku sebelum jatuh tempo agar bebas denda harian.',
      nav: [
        { href: '/dashboard/mahasiswa', label: 'Ringkasan Saya', icon: 'home' },
        { href: '/dashboard/mahasiswa/loans', label: 'Peminjaman Aktif', icon: 'book' },
        { href: '/dashboard/mahasiswa/history', label: 'Riwayat & Ulasan', icon: 'star' },
        { href: '/dashboard/mahasiswa/fines', label: 'Tagihan Denda', icon: 'fine' },
      ],
    },
    [ROLES.PEGAWAI]: {
      label: 'Pegawai Sirkulasi',
      tipTitle: 'Catatan Meja Sirkulasi',
      tipText: 'Pastikan memeriksa kondisi fisik eksemplar sebelum menyetujui pengembalian.',
      nav: [
        { href: '/dashboard/pegawai', label: 'Ikhtisar Layanan', icon: 'overview' },
        { href: '/dashboard/pegawai/circulation', label: 'Meja Sirkulasi', icon: 'circulation' },
        { href: '/dashboard/pegawai/books', label: 'Manajemen Buku', icon: 'books' },
        { href: '/dashboard/pegawai/announcements', label: 'Manajemen Pengumuman', icon: 'megaphone' },
      ],
    },
    [ROLES.ADMIN]: {
      label: 'Administrator',
      tipTitle: 'Info Sistem Bo’bo',
      tipText: 'Pantau log transaksi dan kuota stok koleksi secara berkala untuk menjaga tertib layanan.',
      nav: [
        { href: '/dashboard/admin', label: 'Statistik Sistem', icon: 'stats' },
        { href: '/dashboard/admin/users', label: 'Manajemen Akun', icon: 'users' },
        { href: '/dashboard/admin/categories', label: 'Master Kategori', icon: 'categories' },
        { href: '/dashboard/admin/transactions', label: 'Log Transaksi', icon: 'logs' },
        { href: '/dashboard/pegawai/circulation', label: 'Akses Sirkulasi', icon: 'circulation' },
        { href: '/dashboard/pegawai/books', label: 'Akses Katalog Buku', icon: 'books' },
      ],
    },
  };

  const config = roleConfigs[user.role] || roleConfigs[ROLES.MAHASISWA];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F3EAD8]">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#3E4D36] text-[#F7EBD8] border-b border-[#55684B] sticky top-0 z-30 shadow-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 relative rounded-xl bg-[#FDF9F3] p-1">
            <Image src="/brand/bo-bo-logo.png" alt="Logo Bo'bo" fill className="object-contain" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-lg font-bold text-[#FDF9F3]">Bo’bo</span>
            <span className="font-serif text-xs text-[#CBE0B8]">ᨅᨚᨅᨚ</span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Buka menu navigasi"
          className="p-2 rounded-xl text-[#F7EBD8] hover:bg-white/10 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ═══════════ COZY FOREST SIDEBAR (SCROLL TERSEMBUNYI + INDIKATOR FADE) ═══════════ */}
      <div
        className={`${
          sidebarOpen ? 'flex' : 'hidden'
        } md:flex relative w-full md:w-64 lg:w-[268px] bg-gradient-to-b from-[#44543B] via-[#3C4B34] to-[#323F2B] text-[#F4ECDC] border-r border-[#2B3725] flex-col shrink-0 z-20 md:sticky md:top-0 md:h-screen`}
      >
        {/* Indikator Fade Atas saat Sudah Di-scroll */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-[#44543B]/90 to-transparent z-10 transition-opacity duration-200 ${
            canScrollUp ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          ref={sidebarScrollRef}
          onScroll={updateScrollIndicators}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          className="[&::-webkit-scrollbar]:hidden flex-1 flex flex-col overflow-y-auto"
        >
          {/* Top Wooden/Parchment Sign Plaque */}
          <div className="p-5 pb-3.5">
            <Link href="/" className="block group">
              <div className="relative rounded-2xl border-2 border-[#7E5730] bg-gradient-to-b from-[#C79A63] to-[#B0824C] p-1 shadow-[0_6px_14px_rgba(24,32,20,0.28)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-4 text-[#8BB168]"
                  viewBox="0 0 32 18"
                  fill="currentColor"
                >
                  <path d="M16 17 C16 10, 10 4, 3 5 C5 11, 11 15, 16 17 Z" />
                  <path d="M16 17 C16 9, 22 2, 29 4 C27 10, 21 15, 16 17 Z" />
                </svg>

                <div className="rounded-xl border border-dashed border-[#FFF3DC]/60 px-3.5 py-2.5 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFF8EA]/90">
                    Perpustakaan Digital
                  </p>
                  <div className="mt-0.5 flex items-baseline justify-center gap-1.5">
                    <span className="font-editorial text-2xl font-bold text-[#FFFDF9] drop-shadow-[0_1px_1px_rgba(74,47,20,0.45)]">
                      Bo’bo
                    </span>
                    <span className="font-serif text-sm font-semibold text-[#FFF3DC]">
                      ᨅᨚᨅᨚ
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-[#FFF8EA]/85">
                    Universitas Hasanuddin
                  </p>
                </div>
              </div>
            </Link>

            {/* Compact User Identity Pill */}
            <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/15 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[#FFFDF9]">{user.fullName}</p>
                <p className="truncate text-[10px] text-[#DCE5D2]/75">
                  {user.identityNumber ? `ID: ${user.identityNumber}` : user.email}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#8AA372]/30 border border-[#B5CC9E]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#E4F0D8]">
                {config.label}
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="px-4 py-1 space-y-1 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#CBE0B8]/60 px-3 py-1">
              Menu Utama
            </div>

            {config.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-[#F8F1E3] text-[#4A3525] font-bold shadow-[0_4px_12px_rgba(20,28,16,0.22)] translate-x-0.5'
                      : 'font-medium text-[#EDE6D6]/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <SidebarNavIcon name={item.icon} active={isActive} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 mt-2.5 border-t border-white/10 text-[10px] font-bold uppercase tracking-[0.18em] text-[#CBE0B8]/60 px-3 py-1">
              Pintasan Publik
            </div>

            <Link
              href="/catalog"
              onClick={() => setSidebarOpen(false)}
              className="group flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-medium text-[#EDE6D6]/85 hover:bg-white/10 hover:text-white transition-colors"
            >
              <SidebarNavIcon name="books" active={false} />
              <span>Jelajahi Katalog Buku</span>
            </Link>

            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="group flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-medium text-[#EDE6D6]/85 hover:bg-white/10 hover:text-white transition-colors"
            >
              <SidebarNavIcon name="home" active={false} />
              <span>Halaman Depan</span>
            </Link>
          </nav>

          {/* Bottom Cozy Mascot + Daily Library Tip Card + Logout */}
          <div className="p-4 pt-6 mt-auto">
            <div className="relative pt-10">
              <div className="pointer-events-none select-none absolute -top-1 left-4 z-10 w-16 h-16 drop-shadow-[0_6px_10px_rgba(20,28,16,0.35)]">
                <Image
                  src="/brand/bo-bo-logo.png"
                  alt="Maskot Bo'bo"
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>

              <div className="relative rounded-2xl border border-[#8BA372]/45 bg-[#536647]/80 p-3.5 pt-4 shadow-inner">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2.5 right-3 h-2 w-2 rounded-full bg-[#A5C484]"
                />
                <p className="text-[11px] font-bold text-[#F5E7C6] tracking-wide">
                  {config.tipTitle}
                </p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-[#E6EEDF]/85">
                  {config.tipText}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-semibold text-[#F9D5CE] bg-[#C96858]/25 hover:bg-[#C96858]/40 border border-[#C96858]/35 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{isLoggingOut ? 'Sedang Keluar...' : 'Keluar dari Akun'}</span>
            </button>
          </div>
        </aside>

        {/* Indikator Fade Bawah saat Masih Ada Konten yang Bisa Di-scroll */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#323F2B] via-[#323F2B]/60 to-transparent z-10 transition-opacity duration-200 flex items-end justify-center pb-1.5 ${
            canScrollDown ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-0.5 text-[9px] font-semibold tracking-wider text-[#DCE8CE]/90">
            <span>Gulir ke bawah</span>
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Main Dashboard Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}