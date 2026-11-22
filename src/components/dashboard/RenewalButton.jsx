'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { requestRenewalAction } from '@/app/actions/renewals';

export default function RenewalButton({ loanId, isEligible, disabledReason }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleConfirmRenewal() {
    setIsLoading(true);
    setMsg(null);

    const res = await requestRenewalAction(loanId);
    setIsLoading(false);
    setConfirmOpen(false);

    if (res.success) {
      setMsg({ type: 'success', text: 'Perpanjangan berhasil diajukan!' });
      router.refresh();
    } else {
      setMsg({ type: 'error', text: res.error || 'Gagal mengajukan perpanjangan.' });
    }
  }

  if (!isEligible) {
    return (
      <div className="text-right">
        <button
          type="button"
          disabled
          className="px-3 py-1.5 rounded-xl bg-[#EFE5D5] border border-[#DFC7A2]/70 text-[#8C7058]/60 font-semibold text-xs cursor-not-allowed"
          title={disabledReason}
        >
          Perpanjang
        </button>
        {disabledReason && (
          <p className="text-[10px] text-[#C96858] font-medium mt-1">{disabledReason}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {msg && (
        <span
          className={`text-[10px] font-semibold ${
            msg.type === 'success' ? 'text-[#556B43]' : 'text-[#8A3729]'
          }`}
        >
          {msg.text}
        </span>
      )}

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={isLoading}
        className="px-3.5 py-1.5 rounded-xl bg-[#F5C875] hover:bg-[#e8b861] text-[#5A3E28] font-bold text-xs shadow-[0_2px_0_#C89943] transition-all active:translate-y-0.5 cursor-pointer disabled:opacity-60"
      >
        {isLoading ? 'Memproses...' : 'Ajukan Perpanjangan'}
      </button>

      {mounted &&
        confirmOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E2B15B]/50 bg-[#FFF6DF] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A6B19]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D99B26]" />
                  <span>Perpanjangan Masa Pinjam</span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  Ajukan Perpanjangan 7 Hari?
                </h3>

                <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1.5 leading-relaxed">
                  Permohonan perpanjangan masa pinjam buku ini selama <strong>7 hari</strong> akan dikirimkan untuk diverifikasi oleh petugas meja sirkulasi.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAD5B5] bg-[#FAF4E8] p-3.5 text-xs text-[#6E5038] space-y-1">
                <p className="font-semibold text-[#5A3E28]">Ketentuan Perpanjangan:</p>
                <p className="text-[11px] leading-relaxed">
                  Pastikan buku tidak melewati batas jatuh tempo dan belum memiliki pengajuan perpanjangan lain yang sedang menunggu persetujuan.
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-[#E4CEAD] bg-[#FFFDF9] hover:bg-[#F8F1E3] text-xs font-bold text-[#5A3E28] cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRenewal}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-[#7B9663] hover:bg-[#6D8657] text-white text-xs font-bold shadow-[0_3px_0_#5C7348] transition-all active:translate-y-0.5 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? 'Mengajukan...' : 'Ya, Ajukan Perpanjangan'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}