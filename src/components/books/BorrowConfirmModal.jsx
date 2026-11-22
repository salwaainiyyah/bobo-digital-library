'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';

export default function BorrowConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  bookTitle = 'Buku Pilihan',
  durationDays = 7,
  dailyFine = 'Rp 1.000 / hari',
  feedback = null, // { type: 'success' | 'error', message: '...' }
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tutup modal dengan tombol ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !mounted) return null;

  const isSuccess = feedback?.type === 'success';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="borrow-modal-title"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#3E281B]/45 backdrop-blur-xs p-4 animate-fade-in"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      {/* Kartu Utama Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-[30px] border-2 border-[#DFC19A] bg-[#FFFDF9] p-2.5 shadow-[0_10px_0_#E5C89E,0_25px_50px_-12px_rgba(62,40,27,0.35)] animate-scale-in"
      >
        {/* Siku Sudut Dekoratif */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 left-2.5 h-4 w-4 rounded-tl-xl border-t-[3px] border-l-[3px] border-[#C9A36B]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 right-2.5 h-4 w-4 rounded-tr-xl border-t-[3px] border-r-[3px] border-[#C9A36B]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 left-2.5 h-4 w-4 rounded-bl-xl border-b-[3px] border-l-[3px] border-[#C9A36B]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 right-2.5 h-4 w-4 rounded-br-xl border-b-[3px] border-r-[3px] border-[#C9A36B]"
        />

        {/* Lembar Perkamen Dalam */}
        <div className="relative rounded-[22px] border border-dashed border-[#DFC19A] bg-gradient-to-b from-[#FFFDF9] to-[#FCF5E8] px-6 pt-7 pb-6 text-center">
          {/* Maskot Bo'bo Mengintip di Atas */}
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#EBCFA9] bg-[#F7EBD8] shadow-2xs">
            <Image
              src="/brand/bo-bo-logo.png"
              alt="Maskot Bo'bo"
              width={52}
              height={52}
              className="object-contain"
            />
          </div>

          {/* ─── STATE 1: NOTIFIKASI HASIL (SUKSES / GAGAL) ─── */}
          {feedback ? (
            <>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] mb-2 ${
                  isSuccess
                    ? 'bg-[#929D75]/15 text-[#5E6A44] border border-[#929D75]/35'
                    : 'bg-[#C96858]/15 text-[#A84A3B] border border-[#C96858]/35'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isSuccess ? 'bg-[#929D75]' : 'bg-[#C96858]'
                  }`}
                />
                <span>{isSuccess ? 'Permohonan Terkirim' : 'Permohonan Gagal'}</span>
              </div>

              <h3
                id="borrow-modal-title"
                className="font-editorial text-2xl text-[#79543D]"
              >
                {isSuccess ? 'Berhasil Diajukan!' : 'Oops, Terjadi Kendala'}
              </h3>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#79543D]/75">
                {feedback.message}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border-2 border-[#E6C9A0] bg-[#FFFDF9] py-2.5 px-4 text-xs font-bold text-[#79543D] transition hover:bg-[#F7EBD8] cursor-pointer"
                >
                  Tutup
                </button>

                {isSuccess && (
                  <Link
                    href="/dashboard"
                    className="flex-1 rounded-xl border border-[#77825C] bg-[#929D75] py-2.5 px-4 text-xs font-bold text-white shadow-[0_3px_0_#6C7752] transition hover:bg-[#849067]"
                  >
                    Lihat di Dashboard →
                  </Link>
                )}
              </div>
            </>
          ) : (
            /* ─── STATE 2: KONFIRMASI PEMINJAMAN ─── */
            <>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E2B15B]/45 bg-[#F5C875]/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#855B10] mb-2">
                <span className="h-2 w-2 rounded-full bg-[#D9A043]" />
                <span>Meja Sirkulasi Bo&apos;bo</span>
              </div>

              <h3
                id="borrow-modal-title"
                className="font-editorial text-2xl text-[#79543D] leading-snug"
              >
                Konfirmasi Peminjaman
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#79543D]/75">
                Apakah Anda yakin ingin mengajukan permohonan peminjaman buku fisik ini ke meja sirkulasi?
              </p>

              {/* Ringkasan Ketentuan Pinjam */}
              <div className="mt-4 rounded-2xl border border-[#EBCFA9] bg-[#F8EDD9]/80 p-3.5 text-left space-y-2 text-xs">
                <div className="pb-2 border-b border-[#EBCFA9]/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#79543D]/55 block">
                    Judul Koleksi
                  </span>
                  <p className="font-bold text-[#79543D] line-clamp-2 mt-0.5">
                    {bookTitle}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#79543D]/70">Durasi Peminjaman:</span>
                  <strong className="text-[#79543D]">{durationDays} hari</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#79543D]/70">Tarif Denda Harian:</span>
                  <strong className="text-[#C96858]">{dailyFine}</strong>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="mt-6 flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={onClose}
                  className="flex-1 rounded-xl border-2 border-[#E6C9A0] bg-[#FFFDF9] py-3 px-4 text-xs font-bold text-[#79543D]/80 shadow-[0_3px_0_#DFC19A] transition hover:bg-[#F7EBD8] hover:text-[#79543D] active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={onConfirm}
                  className="flex-[1.4] rounded-xl border border-[#77825C] bg-[#929D75] py-3 px-4 text-xs font-bold text-white shadow-[0_4px_0_#6C7752] transition hover:bg-[#849067] active:translate-y-0.5 active:shadow-[0_1px_0_#6C7752] disabled:opacity-60 cursor-pointer btn-bobo"
                >
                  {loading ? 'Mengajukan...' : 'Ya, Ajukan Pinjam'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}