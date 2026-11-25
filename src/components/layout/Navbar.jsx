'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Badge from '../ui/Badge';
import NotificationBell from './NotificationBell';

export default function Navbar({ initialUser }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(initialUser || null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  }

  const roleLabels = {
    admin: { label: 'Admin', variant: 'terracotta' },
    pegawai: { label: 'Pegawai', variant: 'yellow' },
    mahasiswa: { label: 'Mahasiswa', variant: 'sage' },
  };

  const currentRole = user ? roleLabels[user.role] || { label: user.role, variant: 'beige' } : null;
  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'pegawai';
  const homeHref = isStaffOrAdmin ? '/dashboard' : '/';

  const navLinks = [
    ...(!isStaffOrAdmin ? [{ href: '/', label: 'Beranda', active: pathname === '/' }] : []),
    { href: '/catalog', label: 'Katalog Buku', active: pathname.startsWith('/catalog') },
    { href: '/announcements', label: 'Warta Sirkulasi', active: pathname.startsWith('/announcements') },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F7EBD8]/90 backdrop-blur-md shadow-sm border-b border-[#EBCFA9]/80 py-2'
          : 'bg-[#F7EBD8]/70 backdrop-blur-xs border-b border-[#EBCFA9]/50 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href={homeHref} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-white/90 rounded-2xl p-1 shadow-2xs border border-[#EBCFA9] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-xs">
              <Image
                src="/brand/bo-bo-logo.png"
                alt="Maskot Ayam Bo'bo Membaca Buku"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-2xl tracking-tight text-[#79543D]">Bo&apos;bo</span>
                <span className="font-serif text-sm text-[#929D75] font-semibold tracking-wider">ᨅᨚᨅᨚ</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#79543D]/70 font-medium tracking-tight">
                Perpustakaan Digital Kampus
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-xs p-1.5 rounded-2xl border border-[#EBCFA9]/60">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  link.active
                    ? 'text-white bg-[#929D75] shadow-2xs'
                    : 'text-[#79543D]/75 hover:text-[#79543D] hover:bg-white/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <NotificationBell userId={user.id} />

                <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xs pl-3.5 pr-1.5 py-1.5 rounded-2xl border border-[#EBCFA9]/80 shadow-2xs">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-[#79543D] leading-tight truncate max-w-[140px]">
                      {user.fullName}
                    </span>
                    <div className="mt-0.5">
                      <Badge variant={currentRole?.variant}>{currentRole?.label}</Badge>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="bg-[#929D75] hover:bg-[#7e8963] text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-all duration-200 shadow-2xs hover:shadow-xs"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-xs text-[#C96858] hover:text-[#a54434] hover:bg-[#C96858]/10 px-2.5 py-2 rounded-xl transition-colors font-medium cursor-pointer"
                    title="Keluar dari akun"
                  >
                    {isLoggingOut ? '...' : 'Keluar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-[#79543D] hover:text-[#929D75] bg-white/50 hover:bg-white/80 px-4 py-2 rounded-xl border border-[#EBCFA9]/60 transition-all duration-200"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-[#929D75] hover:bg-[#7e8963] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 btn-bobo"
                >
                  Daftar Mahasiswa
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            {user && <NotificationBell userId={user.id} />}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-white/70 border border-[#EBCFA9] text-[#79543D] hover:bg-white transition-all shadow-2xs cursor-pointer"
              aria-label="Buka Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#EBCFA9]/60 space-y-3 animate-fade-in-down">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    link.active ? 'bg-[#929D75] text-white' : 'text-[#79543D] hover:bg-white/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[#EBCFA9]/60">
              {user ? (
                <div className="space-y-3 px-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#79543D]">{user.fullName}</span>
                    <Badge variant={currentRole?.variant}>{currentRole?.label}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center bg-[#929D75] text-white text-xs font-semibold py-2.5 rounded-xl shadow-xs"
                    >
                      Buka Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="bg-[#C96858]/15 text-[#C96858] text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-semibold text-[#79543D] bg-white/80 py-2.5 rounded-xl border border-[#EBCFA9]"
                  >
                    Masuk ke Akun
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-semibold text-white bg-[#929D75] py-2.5 rounded-xl shadow-xs"
                  >
                    Daftar Akun Mahasiswa
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}