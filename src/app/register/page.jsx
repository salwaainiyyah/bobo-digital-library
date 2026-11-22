'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
          fullName,
          email,
          identityNumber,
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
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F7EBD8]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex flex-col items-center group">
          <div className="w-16 h-16 bg-white/90 rounded-3xl p-2 shadow-sm border border-[#EBCFA9] flex items-center justify-center transition-transform group-hover:scale-105">
            <Image
              src="/brand/bo-bo-logo.png"
              alt="Logo Bo'bo"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h1 className="text-2xl font-extrabold text-[#79543D]">Bo’bo</h1>
            <span className="font-serif text-base text-[#929D75] font-semibold">ᨅᨚᨅᨚ</span>
          </div>
        </Link>
        <h2 className="mt-2 text-sm text-[#79543D]/70 font-medium">
          Pendaftaran Akun Anggota Mahasiswa
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 sm:px-10 shadow-sm rounded-3xl border border-[#EBCFA9]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-[#C96858]/15 border border-[#C96858]/30 text-xs text-[#8A3729] font-medium leading-relaxed">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-[#929D75]/20 border border-[#929D75]/40 text-xs text-[#54603B] font-medium leading-relaxed">
                {successMessage}
              </div>
            )}

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  Email Kampus
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@student.unhas.ac.id"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#EBCFA9] bg-white text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:ring-2 focus:ring-[#929D75] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#79543D] uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
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

          <div className="mt-6 pt-6 border-t border-[#EBCFA9]/70 text-center">
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
  );
}
