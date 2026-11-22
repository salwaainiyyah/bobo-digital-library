'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitReviewAction } from '@/app/actions/reviews';

export default function ReviewFormModal({ loanId, bookTitle, existingReview }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await submitReviewAction(loanId, rating, comment);
    setIsLoading(false);

    if (res.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Gagal menyimpan ulasan.');
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-1.5 rounded-xl bg-[#929D75] hover:bg-[#7e8963] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
      >
        {existingReview ? 'Ubah Ulasan' : 'Tulis Ulasan & Rating'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EBCFA9] shadow-xl space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#929D75]">
                Penilaian Mahasiswa
              </span>
              <h3 className="text-lg font-bold text-[#79543D] mt-1">Ulas Buku</h3>
              <p className="text-xs text-[#79543D]/70 font-medium truncate mt-0.5">{bookTitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-[#C96858]/15 border border-[#C96858]/30 text-xs text-[#8A3729]">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#79543D] mb-1.5">
                  Rating Bintang (1 - 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-2xl transition-transform hover:scale-125 cursor-pointer"
                    >
                      <span className={star <= rating ? 'text-[#F5C875]' : 'text-stone-300'}>★</span>
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-[#855B10] ml-2">{rating} dari 5 bintang</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#79543D] mb-1.5">
                  Komentar Ulasan
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan wawasan atau manfaat yang Anda peroleh dari buku ini..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EBCFA9] text-xs sm:text-sm text-[#79543D] placeholder:text-[#79543D]/40 focus:outline-hidden focus:ring-2 focus:ring-[#929D75]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-[#EBCFA9] text-xs font-semibold text-[#79543D] hover:bg-[#EBCFA9]/30 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#929D75] hover:bg-[#7e8963] text-white text-xs font-semibold transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? 'Menyimpan...' : 'Kirim Ulasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
