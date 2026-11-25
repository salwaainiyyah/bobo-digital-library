'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isValidEmailFormat } from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedName = fullName.trim();
    const trimmedIdentity = identityNumber.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedIdentity || !trimmedEmail || !password || !confirmPassword) {
      setErrorMessage('Semua kolom pendaftaran wajib diisi.');
      return;
    }

    if (!isValidEmailFormat(trimmedEmail)) {
      setErrorMessage(
        'Format email belum lengkap. Pastikan penulisan alamat email sudah benar (contoh: nama@student.unhas.ac.id atau nama@gmail.com).'
      );
      return;
    }

    const allowedDomains = ['student.unhas.ac.id', 'gmail.com'];
    const emailDomain = trimmedEmail.split('@')[1];
    if (!allowedDomains.includes(emailDomain)) {
      setErrorMessage(
        'Pendaftaran mahasiswa wajib menggunakan email @student.unhas.ac.id atau @gmail.com.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password minimal 6 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: trimmedName,
          email: trimmedEmail,
          identityNumber: trimmedIdentity,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Gagal melakukan pendaftaran akun.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Pendaftaran berhasil! Mengalihkan ke halaman masuk...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch {
      setErrorMessage('Terjadi kegagalan komunikasi dengan server.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 bg-[#F7EBD8] relative overflow-x-clip">
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

      {/* Area Utama Registrasi di Depan Dekorasi */}
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
          <h2 className="mt-1.5 text-sm text-[#79543D]/75 font-medium">
            Pendaftaran Akun Anggota Mahasiswa
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-lg">
          {errorMessage && (
            <div className="mb-3.5 p-3 rounded-2xl bg-[#FDF2F0] border border-[#C96858]/40 shadow-xs text-xs text-[#8A3729] font-medium leading-relaxed text-center">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-3.5 p-3 rounded-2xl bg-[#F2F5EC] border border-[#929D75]/50 shadow-xs text-xs text-[#54603B] font-medium leading-relaxed text-center">
              {successMessage}
            </div>
          )}

          <div className="bg-white/92 backdrop-blur-xs py-7 px-6 sm:px-9 shadow-sm rounded-3xl border border-[#EBCFA9]">
            <form className="space-y-4" onSubmit={handleSubmit} noValidate autoComplete="off">
              <div>
                <label className="block text-xs font-semibold text-[#79543D] uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Nurul Izzah"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#EBCFA9] bg-white text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:ring-2 focus:ring-[#929D75] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-[#79543D] uppercase tracking-wider mb-1">
                    Nomor Induk Mahasiswa (NIM)
                  </label>
                  <input
                    type="text"
                    required
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                    placeholder="Contoh: D121221001"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#EBCFA9] bg-white text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:ring-2 focus:ring-[#929D75] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#79543D] uppercase tracking-wider mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@student.unhas.ac.id"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#EBCFA9] bg-white text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:ring-2 focus:ring-[#929D75] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-[#79543D] uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#EBCFA9] bg-white text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:ring-2 focus:ring-[#929D75] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#79543D] uppercase tracking-wider mb-1">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#EBCFA9] bg-white text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:ring-2 focus:ring-[#929D75] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex justify-center py-3 px-4 rounded-2xl shadow-xs text-sm font-semibold text-white bg-[#929D75] hover:bg-[#7e8963] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#929D75] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-[#EBCFA9]/70 text-center">
              <p className="text-xs text-[#79543D]/70">
                Sudah memiliki akun terdaftar?{' '}
                <Link href="/login" className="font-semibold text-[#929D75] hover:underline">
                  Masuk ke Akun
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}