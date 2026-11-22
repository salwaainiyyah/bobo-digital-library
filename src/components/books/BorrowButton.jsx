'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestLoanAction } from '@/app/actions/loans';
import BorrowConfirmModal from '@/components/books/BorrowConfirmModal';

export default function BorrowButton({ bookId, bookTitle, isEligible, disabledReason }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFeedback, setModalFeedback] = useState(null);

  function handleOpenModal() {
    setModalFeedback(null);
    setIsModalOpen(true);
  }

  async function handleConfirmBorrow() {
    setIsLoading(true);
    setMessage(null);

    const res = await requestLoanAction(bookId);
    setIsLoading(false);

    if (res.success) {
      const successText =
        'Permohonan peminjaman berhasil dikirim! Silakan datangi meja sirkulasi Lantai 1 dengan membawa KTM untuk pengambilan buku fisik.';
      setMessage({ type: 'success', text: successText });
      setModalFeedback({ type: 'success', message: successText });
      router.refresh();
    } else {
      const errorText = res.error || 'Gagal mengajukan peminjaman.';
      setMessage({ type: 'error', text: errorText });
      setModalFeedback({ type: 'error', message: errorText });
    }
  }

  if (!isEligible) {
    return (
      <div className="space-y-2.5">
        <button
          disabled
          className="w-full py-3.5 px-6 rounded-2xl bg-stone-200 text-stone-400 font-semibold text-sm cursor-not-allowed border border-stone-300/60 shadow-none flex items-center justify-center gap-2"
        >
          <span>🔒</span>
          <span>Peminjaman Belum Memenuhi Syarat</span>
        </button>
        {disabledReason && (
          <div className="p-3 rounded-2xl bg-[#C96858]/10 border border-[#C96858]/30 text-xs text-[#8A3729] leading-relaxed text-center">
            {disabledReason}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {message && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed animate-fade-in ${
            message.type === 'success'
              ? 'bg-[#929D75]/20 text-[#54603B] border border-[#929D75]/40'
              : 'bg-[#C96858]/15 text-[#8A3729] border border-[#C96858]/30'
          }`}
        >
          {message.type === 'success' ? '✓ ' : '⚠️ '}
          {message.text}
        </div>
      )}

      <button
        type="button"
        onClick={handleOpenModal}
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-2xl bg-[#929D75] hover:bg-[#7e8963] text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed btn-bobo flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Memproses Permohonan...</span>
          </>
        ) : (
          <>
            <span>📖</span>
            <span>Ajukan Peminjaman Buku Fisik</span>
          </>
        )}
      </button>

      <BorrowConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBorrow}
        loading={isLoading}
        bookTitle={bookTitle || "Koleksi Buku Fisik Bo'bo"}
        durationDays={7}
        dailyFine="Rp 1.000 / hari"
        feedback={modalFeedback}
      />
    </div>
  );
}