'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isValidEmailFormat } from '@/lib/validation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage('Alamat email wajib diisi.');
      return;
    }

    if (!isValidEmailFormat(trimmedEmail)) {
      setErrorMessage(
        'Format email belum lengkap. Pastikan penulisan alamat email sudah benar (contoh: nama@student.unhas.ac.id atau nama@gmail.com).'
      );
      return;
    }

    if (!password) {
      setErrorMessage('Password wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Email atau password yang Anda masukkan tidak sesuai.');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setErrorMessage('Terjadi kegagalan jaringan saat menghubungi server.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-[#F7EBD8] relative overflow-x-clip">
      <style jsx>{`
        @keyframes heroFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }
        .animate-hero-float {
          animation: heroFloat 3.4s ease-in-out infinite;
        }
      `}</style>

      {/* Dekorasi Bukit, Pohon & Lontara Besar di Bagian Bawah */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none fixed inset-x-0 bottom-0 z-0"
      >
        <div className="w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-32 sm:h-40 md:h-44"
            preserveAspectRatio="none"
          >
            <path
              d="M0 125C220 78 430 148 670 105C900 66 1140 130 1440 75V240H0V125Z"
              fill="#D6DFC2"
            />
            <g fill="#B7C59E">
              <rect x="118" y="82" width="5" height="28" rx="2.5" />
              <circle cx="120.5" cy="74" r="16" />
              <circle cx="107" cy="82" r="11" />
              <circle cx="134" cy="82" r="11" />

              <rect x="160" y="94" width="4" height="20" rx="2" />
              <circle cx="162" cy="88" r="11" />
            </g>
            <g fill="#B7C59E">
              <rect x="1310" y="66" width="5" height="26" rx="2.5" />
              <circle cx="1312.5" cy="58" r="15" />
              <circle cx="1300" cy="66" r="10" />
              <circle cx="1325" cy="66" r="10" />
            </g>
            <path
              d="M0 152C280 184 520 128 800 156C1080 182 1270 125 1440 150V240H0V152Z"
              fill="#E6ECD8"
            />
          </svg>
        </div>

        <div className="bg-[#E6ECD8] h-20 sm:h-24 relative overflow-hidden flex items-center px-6 sm:px-10">
          <span className="font-serif text-6xl sm:text-[6.5rem] text-[#68774E]/[0.16] leading-none tracking-wide">
            ᨅᨚᨅᨚ
          </span>
        </div>

        <div className="bg-[#68774E] h-4 sm:h-5 w-full" />
      </div>

      {/* Area Utama Login di Depan Dekorasi */}
      <div className="relative z-10 w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/95 rounded-[28px] p-2.5 shadow-md border-2 border-[#EBCFA9] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 animate-hero-float">
              <Image
                src="/brand/bo-bo-logo.png"
                alt="Logo Bo'bo"
                width={76}
                height={76}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="mt-3.5 flex items-baseline gap-2.5">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#79543D] tracking-tight">
                Bo’bo
              </h1>
              <span className="font-serif text-2xl sm:text-3xl text-[#68774E] font-semibold">
                ᨅᨚᨅᨚ
              </span>
            </div>
          </Link>
          <h2 className="mt-2 text-sm text-[#79543D]/75 font-medium">
            Masuk ke Sistem Manajemen Perpustakaan Digital Kampus
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/92 backdrop-blur-xs py-7 px-6 sm:px-9 shadow-sm rounded-3xl border border-[#EBCFA9]">
            <form className="space-y-4.5" onSubmit={handleSubmit} noValidate>
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-[#C96858]/15 border border-[#C96858]/30 text-xs text-[#8A3729] font-medium leading-relaxed">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#79543D] uppercase tracking-wider mb-1.5">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@student.unhas.ac.id / nama@gmail.com"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#EBCFA9] bg-white text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:ring-2 focus:ring-[#929D75] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#79543D] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#EBCFA9] bg-white text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:ring-2 focus:ring-[#929D75] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 rounded-2xl shadow-xs text-sm font-semibold text-white bg-[#929D75] hover:bg-[#7e8963] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#929D75] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? 'Memverifikasi Akun...' : 'Masuk ke Akun'}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-[#EBCFA9]/70 space-y-3 text-center">
              <p className="text-xs text-[#79543D]/70">
                Mahasiswa belum memiliki akun?{' '}
                <Link href="/register" className="font-semibold text-[#929D75] hover:underline">
                  Daftar Akun Mahasiswa
                </Link>
              </p>

              <div>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C96858] hover:text-[#9b4032] transition-colors"
                >
                  <span>Jelajahi Koleksi sebagai Guest (Tanpa Akun)</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}