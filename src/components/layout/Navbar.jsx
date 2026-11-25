'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Badge from '../ui/Badge';
import NotificationBell from './NotificationBell';
import StudentNavbar from './StudentNavbar';
import { ROLE_META, ROLES } from '@/lib/constants';

function PublicNavbar({ initialUser }) {
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

  const currentRole = user ? ROLE_META[user.role] || { label: user.role, variant: 'beige' } : null;
  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'pegawai';
  const homeHref = isStaffOrAdmin ? '/dashboard' : '/';

  const navLinks = isStaffOrAdmin
    ? []
    : [
        { href: '/', label: 'Beranda', active: pathname === '/' },
        { href: '/catalog', label: 'Katalog Buku', active: pathname.startsWith('/catalog') },
        { href: '/announcements', label: 'Warta Sirkulasi', active: pathname.startsWith('/announcements') },
      ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'pt-2.5 pb-1' : 'pt-3.5 pb-1.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div
          className={`rounded-full border transition-all duration-300 px-3 sm:px-5 py-2 flex items-center justify-between gap-3 ${
            scrolled
              ? 'bg-[#FAF6EE]/95 backdrop-blur-md shadow-[0_10px_28px_rgba(104,119,78,0.14)] border-[#68774E]/45'
              : 'bg-[#FAF6EE]/88 backdrop-blur-sm shadow-[0_6px_20px_rgba(121,84,61,0.08)] border-[#929D75]/35'
          }`}
        >
          <Link href={homeHref} className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-[#F7EBD8] rounded-full p-1 shadow-2xs border border-[#EBCFA9] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-xs">
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
                <span className="font-editorial text-xl sm:text-2xl tracking-tight text-[#79543D]">
                  Bo&apos;bo
                </span>
                <span className="font-serif text-xs sm:text-sm text-[#68774E] font-semibold tracking-wider">
                  ᨅᨚᨅᨚ
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#79543D]/75 font-medium tracking-tight">
                Perpustakaan Digital Kampus
              </span>
            </div>
          </Link>

          {navLinks.length > 0 && (
            <nav className="hidden md:flex items-center gap-1 bg-[#F7EBD8]/85 p-1 rounded-full border border-[#EBCFA9]/80">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    link.active
                      ? 'text-[#F7EBD8] bg-[#68774E] shadow-2xs'
                      : 'text-[#79543D]/80 hover:text-[#79543D] hover:bg-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#F7EBD8] border border-[#EBCFA9] p-0.5 flex items-center justify-center">
                  <NotificationBell userId={user.id} />
                </div>

                <div className="flex items-center gap-2.5 bg-[#F7EBD8]/90 pl-3.5 pr-1.5 py-1 rounded-full border border-[#EBCFA9] shadow-2xs">
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
                    className="bg-[#68774E] hover:bg-[#586641] text-[#F7EBD8] text-xs font-semibold px-3.5 py-2 rounded-full transition-all duration-200 shadow-2xs hover:shadow-xs"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-xs text-[#C96858] hover:text-[#a54434] hover:bg-[#C96858]/10 px-3 py-2 rounded-full transition-colors font-semibold cursor-pointer"
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
                  className="text-xs font-semibold text-[#79543D] hover:text-[#5c3d29] bg-[#F7EBD8] hover:bg-[#EFE1C6] px-4 py-2 rounded-full border border-[#EBCFA9] transition-all duration-200"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 bg-[#68774E] hover:bg-[#586641] text-[#F7EBD8] text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 btn-bobo"
                >
                  <span>Daftar Mahasiswa</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            {user && (
              <div className="rounded-full bg-[#F7EBD8] border border-[#EBCFA9] p-0.5 flex items-center justify-center">
                <NotificationBell userId={user.id} />
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-[#F7EBD8] border border-[#EBCFA9] text-[#79543D] hover:bg-[#E6ECD8]/60 transition-all shadow-2xs cursor-pointer"
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
          <div className="md:hidden mt-2 rounded-3xl bg-[#FAF6EE] py-4 px-4 border border-[#929D75]/40 shadow-md space-y-3 animate-fade-in-down">
            {navLinks.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                      link.active ? 'bg-[#68774E] text-[#F7EBD8]' : 'text-[#79543D] hover:bg-[#F7EBD8]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <div className={navLinks.length > 0 ? 'pt-3 border-t border-[#EBCFA9]/70' : ''}>
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
                      className="flex-1 text-center bg-[#68774E] text-[#F7EBD8] text-xs font-semibold py-2.5 rounded-full shadow-xs"
                    >
                      Buka Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="bg-[#C96858]/15 text-[#C96858] text-xs font-semibold px-4 py-2.5 rounded-full cursor-pointer"
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
                    className="text-center text-sm font-semibold text-[#79543D] bg-[#F7EBD8] py-2.5 rounded-full border border-[#EBCFA9]"
                  >
                    Masuk ke Akun
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-semibold text-[#F7EBD8] bg-[#68774E] py-2.5 rounded-full shadow-xs"
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

/**
- Titik masuk tunggal navbar.
- - Mahasiswa yang sudah login  -> StudentNavbar (satu komponen untuk seluruh area Mahasiswa)
- - Pengunjung umum (belum login) -> PublicNavbar (tampilan lama, tidak diubah)
 */
export default function Navbar({ initialUser }) {
  if (initialUser?.role === ROLES.MAHASISWA) {
    return <StudentNavbar user={initialUser} />;
  }
  return <PublicNavbar initialUser={initialUser} />;
}