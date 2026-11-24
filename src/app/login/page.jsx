'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Email atau password yang Anda masukkan tidak sesuai.');
        setIsLoading(false);
        return;
      }

      // Login berhasil, arahkan ke dashboard
      router.push('/dashboard');
      router.refresh();
    } catch {
      setErrorMessage('Terjadi kegagalan jaringan saat menghubungi server.');
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
          Masuk ke Sistem Manajemen Perpustakaan Digital Kampus
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 sm:px-10 shadow-sm rounded-3xl border border-[#EBCFA9]">
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                placeholder="nama@unhas.ac.id / nama@student.unhas.ac.id"
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

          <div className="mt-6 pt-6 border-t border-[#EBCFA9]/70 space-y-4 text-center">
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
  );
}
