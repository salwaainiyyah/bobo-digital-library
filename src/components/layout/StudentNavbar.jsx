'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import NotificationBell from '@/components/layout/NotificationBell';

export default function StudentNavbar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Beranda', active: pathname === '/' },
    { href: '/catalog', label: 'Katalog Buku', active: pathname.startsWith('/catalog') },
    { href: '/announcements', label: 'Pengumuman', active: pathname.startsWith('/announcements') },
  ];

  const studentMenuItems = [
    {
      href: '/dashboard/mahasiswa',
      label: 'Ringkasan Dashboard',
      active: pathname === '/dashboard/mahasiswa',
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/dashboard/mahasiswa/loans',
      label: 'Peminjaman Aktif',
      active: pathname.startsWith('/dashboard/mahasiswa/loans'),
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      href: '/dashboard/mahasiswa/history',
      label: 'Riwayat Peminjaman',
      active: pathname.startsWith('/dashboard/mahasiswa/history'),
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/mahasiswa/fines',
      label: 'Denda & Keterlambatan',
      active: pathname.startsWith('/dashboard/mahasiswa/fines'),
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/mahasiswa/notifications',
      label: 'Semua Notifikasi',
      active: pathname.startsWith('/dashboard/mahasiswa/notifications'),
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
  ];

  const initial = (user?.fullName || user?.email || 'M').trim().charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 lg:px-8 pt-3.5 pb-1">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-full bg-[#FAF6EE]/95 backdrop-blur-md border border-[#929D75]/35 shadow-[0_8px_24px_rgba(107,71,50,0.08)] px-3 sm:px-5 py-2 flex items-center justify-between gap-3">
          {/* Kiri: Brand Bo'bo + Garis Aksen + Lontara */}
          <Link
            href="/"
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full hover:bg-[#E6ECD8]/55 transition-colors shrink-0 group"
          >
            <div className="w-9 h-9 rounded-full bg-[#F7EBD8] border border-[#EBCFA9] p-1 flex items-center justify-center shadow-2xs transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/brand/bo-bo-logo.png"
                alt="Logo Bo'bo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="flex flex-col">
                <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#6B4732] leading-none">
                  Bo&apos;bo
                </span>
                <span className="mt-1 h-[3px] w-full rounded-full bg-[#E2B15B]" />
              </div>
              <span className="font-serif text-xs sm:text-sm text-[#68774E] font-semibold">
                ᨅᨚᨅᨚ
              </span>
            </div>
          </Link>

          {/* Tengah: Navigasi Mahasiswa */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-xs lg:text-sm transition-all ${
                  item.active
                    ? 'bg-[#E6ECD8] text-[#54603B] font-bold border border-[#929D75]/40'
                    : 'font-medium text-[#79543D]/85 hover:text-[#5C3B28] hover:bg-[#F7EBD8]/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Kanan: Notifikasi Bulat + Dropdown Profil Mahasiswa */}
          <div ref={dropdownRef} className="hidden md:flex items-center gap-2.5 shrink-0 relative">
            <NotificationBell userId={user?.id} />

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border transition-colors cursor-pointer ${
                menuOpen
                  ? 'bg-[#E6ECD8]/80 border-[#68774E]/50'
                  : 'bg-[#F7EBD8]/85 hover:bg-[#E6ECD8]/65 border-[#EBCFA9]'
              }`}
            >
              <span className="w-7 h-7 rounded-full bg-[#68774E] text-[#F7EBD8] text-xs font-bold flex items-center justify-center">
                {initial}
              </span>
              <span className="text-xs font-semibold text-[#5C3B28] max-w-[120px] truncate">
                {user?.fullName || 'Mahasiswa'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-[#79543D] transition-transform duration-200 ${
                  menuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-64 rounded-3xl bg-[#FFFDF9] border-2 border-[#E4CEAD] shadow-[0_16px_36px_rgba(90,60,42,0.16)] p-2 text-xs z-50">
                {/* Header Profil Akun */}
                <div className="px-3.5 py-2.5 mb-1.5 rounded-2xl bg-[#FAF4E8] border border-[#EAD5B5]/70">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-[#5A3E28] truncate">
                      {user?.fullName || 'Mahasiswa Unhas'}
                    </p>
                    <span className="shrink-0 rounded-full bg-[#E6ECD8] border border-[#929D75]/40 px-2 py-0.5 text-[10px] font-bold text-[#54603B]">
                      Mahasiswa
                    </span>
                  </div>
                  {(user?.identityNumber || user?.email) && (
                    <p className="text-[11px] text-[#79543D]/75 truncate mt-0.5">
                      {user?.identityNumber ? `NIM: ${user.identityNumber}` : user?.email}
                    </p>
                  )}
                </div>

                {/* Daftar Menu Area Mahasiswa */}
                <div className="space-y-0.5">
                  {studentMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl transition-colors ${
                        item.active
                          ? 'bg-[#E6ECD8] text-[#54603B] font-bold'
                          : 'font-medium text-[#6B4732] hover:bg-[#FAF4E8]'
                      }`}
                    >
                      <span className={item.active ? 'text-[#54603B]' : 'text-[#79543D]/70'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Tombol Keluar */}
                <div className="mt-1.5 pt-1.5 border-t border-[#EAD5B5]/70">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl font-semibold text-[#C96858] hover:bg-[#C96858]/10 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <NotificationBell userId={user?.id} />
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Buka menu navigasi"
              className="w-9 h-9 rounded-full bg-[#F7EBD8] border border-[#EBCFA9] flex items-center justify-center text-[#6B4732] cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Dropdown Mobile */}
        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-3xl bg-[#FAF6EE] border border-[#929D75]/35 shadow-md p-3.5 space-y-2">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2 rounded-2xl text-xs font-semibold ${
                    item.active ? 'bg-[#E6ECD8] text-[#54603B]' : 'text-[#79543D] hover:bg-[#F7EBD8]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-[#EBCFA9]/70 space-y-1">
              <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                Menu Mahasiswa ({user?.fullName || 'Akun'})
              </p>
              {studentMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs ${
                    item.active
                      ? 'bg-[#E6ECD8] text-[#54603B] font-bold'
                      : 'font-medium text-[#6B4732] hover:bg-[#F7EBD8]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-[#EBCFA9]/70 px-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 rounded-2xl text-center text-xs font-semibold text-[#C96858] bg-[#C96858]/10 cursor-pointer"
              >
                Keluar dari Akun
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}