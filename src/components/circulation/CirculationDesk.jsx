'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import Portal from '@/components/ui/Portal';
import { FeedbackBanner } from '@/components/ui/FeedbackBanner';
import { approveLoanAction, rejectLoanAction, returnLoanAction } from '@/app/actions/loans';
import { decideRenewalAction } from '@/app/actions/renewals';
import { payFineAction } from '@/app/actions/fines';

export default function CirculationDesk({
  pendingQueue,
  activeLoans,
  pendingRenewals,
  unpaidFines,
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'returns' | 'renewals' | 'fines'
  const [returnSearch, setReturnSearch] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // State Modal Konfirmasi Custom (Pengganti window.confirm)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    actionType: null, // 'approve-loan' | 'return-loan' | 'approve-renewal'
    targetId: null,
    badge: '',
    title: '',
    description: '',
    studentName: '',
    studentNim: '',
    bookTitle: '',
    extraLabel: '',
    confirmText: '',
    variant: 'sage', // 'sage' | 'cocoa'
  });

  // Modal State untuk Tolak Pinjaman (Wajib Alasan)
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    loanId: null,
    studentName: '',
    bookTitle: '',
    reason: '',
    error: '',
  });

  // Modal State untuk Tolak Perpanjangan
  const [rejectRenewalModal, setRejectRenewalModal] = useState({
    isOpen: false,
    renewalId: null,
    studentName: '',
    bookTitle: '',
    reason: '',
  });

  // Modal State untuk Pelunasan Denda
  const [fineModal, setFineModal] = useState({
    isOpen: false,
    fine: null,
    method: 'Tunai',
    note: '',
  });

  function closeConfirmModal() {
    if (loadingAction) return;
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  }

  // Buka Modal Konfirmasi Approve Peminjaman
  function openApproveLoanModal(item) {
    setConfirmModal({
      isOpen: true,
      actionType: 'approve-loan',
      targetId: item.id,
      badge: 'Verifikasi Peminjaman',
      title: 'Setujui Peminjaman Buku?',
      description:
        'Pastikan mahasiswa telah menunjukkan KTM fisik asli. Stok eksemplar tersedia akan otomatis berkurang 1 unit.',
      studentName: item.student_name,
      studentNim: item.student_nim,
      bookTitle: item.book_title,
      extraLabel: `Sisa stok saat ini: ${item.stock_available} dari ${item.stock_total} eksemplar`,
      confirmText: 'Ya, Setujui Peminjaman',
      variant: 'sage',
    });
  }

  // Buka Modal Konfirmasi Pengembalian Buku
  function openReturnLoanModal(loan) {
    const isOverdue = loan.days_overdue > 0;
    setConfirmModal({
      isOpen: true,
      actionType: 'return-loan',
      targetId: loan.id,
      badge: 'Penerimaan Buku Fisik',
      title: 'Konfirmasi Pengembalian Buku?',
      description: isOverdue
        ? `Buku ini terlambat ${loan.days_overdue} hari. Sistem akan menambah stok rak dan mencatat denda otomatis sebesar Rp ${parseFloat(loan.estimated_fine).toLocaleString('id-ID')}.`
        : 'Pastikan kondisi fisik buku lengkap. Stok eksemplar tersedia akan otomatis bertambah kembali ke rak.',
      studentName: loan.student_name,
      studentNim: loan.student_nim,
      bookTitle: loan.book_title,
      extraLabel: isOverdue
        ? `Status: Terlambat ${loan.days_overdue} hari`
        : 'Status: Dikembalikan tepat waktu',
      confirmText: 'Terima & Selesaikan',
      variant: 'cocoa',
    });
  }

  // Buka Modal Konfirmasi Perpanjangan
  function openApproveRenewalModal(renewal) {
    setConfirmModal({
      isOpen: true,
      actionType: 'approve-renewal',
      targetId: renewal.id,
      badge: 'Evaluasi Perpanjangan',
      title: 'Setujui Perpanjangan Pinjam?',
      description: `Batas waktu pengembalian buku akan diperpanjang selama +${renewal.extension_days} hari dari jadwal jatuh tempo sebelumnya.`,
      studentName: renewal.student_name,
      studentNim: renewal.student_nim,
      bookTitle: renewal.book_title,
      extraLabel: `Tambahan durasi: +${renewal.extension_days} hari`,
      confirmText: 'Setujui Perpanjangan',
      variant: 'sage',
    });
  }

  // Eksekusi Aksi dari Modal Konfirmasi Custom
  async function handleConfirmSubmit() {
    const { actionType, targetId } = confirmModal;
    if (!actionType || !targetId) return;

    setLoadingAction(`${actionType}-${targetId}`);
    setFeedback(null);

    if (actionType === 'approve-loan') {
      const res = await approveLoanAction(targetId);
      setLoadingAction(null);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));

      if (res.success) {
        setFeedback({
          type: 'success',
          text: 'Peminjaman berhasil disetujui. Status kini "Sedang Dipinjam" dan stok fisik telah dipotong.',
        });
        router.refresh();
      } else {
        setFeedback({ type: 'error', text: res.error || 'Gagal menyetujui peminjaman.' });
      }
      return;
    }

    if (actionType === 'return-loan') {
      const res = await returnLoanAction(targetId);
      setLoadingAction(null);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));

      if (res.success) {
        const { daysLate, fine } = res.data;
        if (daysLate > 0 && fine) {
          setFeedback({
            type: 'warning',
            text: `Buku fisik berhasil dikembalikan. Terlambat ${daysLate} hari dengan denda otomatis sebesar Rp ${parseFloat(fine.amount).toLocaleString('id-ID')}.`,
          });
        } else {
          setFeedback({
            type: 'success',
            text: 'Buku fisik berhasil dikembalikan tepat waktu. Stok fisik telah bertambah kembali ke rak.',
          });
        }
        router.refresh();
      } else {
        setFeedback({ type: 'error', text: res.error || 'Gagal memproses pengembalian buku.' });
      }
      return;
    }

    if (actionType === 'approve-renewal') {
      const res = await decideRenewalAction(targetId, 'APPROVED', '');
      setLoadingAction(null);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));

      if (res.success) {
        setFeedback({
          type: 'success',
          text: 'Perpanjangan disetujui. Tanggal jatuh tempo berhasil diperbarui.',
        });
        router.refresh();
      } else {
        setFeedback({ type: 'error', text: res.error || 'Gagal memproses perpanjangan.' });
      }
    }
  }

  // Handle Reject Loan Submit
  async function handleRejectLoanSubmit(e) {
    e.preventDefault();
    if (!rejectModal.reason.trim()) {
      setRejectModal((prev) => ({
        ...prev,
        error: 'Alasan penolakan wajib diisi sebelum melanjutkan.',
      }));
      return;
    }

    setLoadingAction(`reject-${rejectModal.loanId}`);
    setFeedback(null);

    const res = await rejectLoanAction(rejectModal.loanId, rejectModal.reason);
    setLoadingAction(null);

    if (res.success) {
      setRejectModal({
        isOpen: false,
        loanId: null,
        studentName: '',
        bookTitle: '',
        reason: '',
        error: '',
      });
      setFeedback({
        type: 'success',
        text: 'Permohonan peminjaman berhasil ditolak dengan alasan tercatat.',
      });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menolak permohonan.' });
    }
  }

  // Handle Reject Renewal Submit
  async function handleRejectRenewalSubmit(e) {
    e.preventDefault();
    setLoadingAction(`renewal-reject-${rejectRenewalModal.renewalId}`);
    setFeedback(null);

    const res = await decideRenewalAction(
      rejectRenewalModal.renewalId,
      'REJECTED',
      rejectRenewalModal.reason
    );
    setLoadingAction(null);

    if (res.success) {
      setRejectRenewalModal({
        isOpen: false,
        renewalId: null,
        studentName: '',
        bookTitle: '',
        reason: '',
      });
      setFeedback({ type: 'success', text: 'Permohonan perpanjangan berhasil ditolak.' });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal memproses penolakan perpanjangan.' });
    }
  }

  // Handle Pay Fine Submit
  async function handlePayFineSubmit(e) {
    e.preventDefault();
    if (!fineModal.fine) return;

    setLoadingAction(`pay-fine-${fineModal.fine.id}`);
    setFeedback(null);

    const res = await payFineAction(fineModal.fine.id, fineModal.method, fineModal.note);
    setLoadingAction(null);

    if (res.success) {
      setFineModal({ isOpen: false, fine: null, method: 'Tunai', note: '' });
      setFeedback({
        type: 'success',
        text: 'Pembayaran denda berhasil dicatat sebagai Lunas. Hak peminjaman mahasiswa telah dipulihkan.',
      });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal mencatat pelunasan denda.' });
    }
  }

  // Filter Active Loans on Search
  const filteredActiveLoans = activeLoans.filter((l) => {
    if (!returnSearch.trim()) return true;
    const term = returnSearch.toLowerCase();
    return (
      l.student_name.toLowerCase().includes(term) ||
      (l.student_nim && l.student_nim.toLowerCase().includes(term)) ||
      l.book_title.toLowerCase().includes(term) ||
      l.isbn.toLowerCase().includes(term)
    );
  });

  const tabs = [
    { id: 'queue', label: `1. Antrean Peminjaman (${pendingQueue.length})` },
    { id: 'returns', label: `2. Meja Pengembalian Buku (${activeLoans.length})` },
    { id: 'renewals', label: `3. Evaluasi Perpanjangan (${pendingRenewals.length})` },
    { id: 'fines', label: `4. Pelunasan Denda (${unpaidFines.length})` },
  ];

  return (
    <div className="space-y-6">
      <FeedbackBanner feedback={feedback} onClose={() => setFeedback(null)} />

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2.5 border-b border-[#E4CEAD] pb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7B9663] text-white shadow-[0_3px_0_#5C7348]'
                  : 'bg-[#FFFDF9] border-2 border-[#E4CEAD] text-[#5A3E28] hover:bg-[#F8F1E3]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANTREAN VERIFIKASI PEMINJAMAN (APPROVE / REJECT) */}
      {activeTab === 'queue' && (
        <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-editorial text-lg font-bold text-[#5A3E28]">
                Antrean Permohonan Masuk
              </h2>
              <p className="text-xs text-[#6E5038]/75 mt-0.5">
                Persetujuan (Approve) memotong kuota stok buku secara atomik. Penolakan (Reject) wajib menyertakan alasan.
              </p>
            </div>
            <span className="self-start sm:self-center rounded-full border border-[#D8E2C8] bg-[#EEF4E6] px-3.5 py-1 text-xs font-bold text-[#556B43]">
              {pendingQueue.length} Pengajuan Menunggu
            </span>
          </div>

          {pendingQueue.length === 0 ? (
            <div className="p-12 text-center bg-[#F8F1E3] rounded-2xl border border-dashed border-[#DFC7A2]">
              <p className="text-xs font-medium text-[#6E5038]/75">
                Tidak ada permohonan peminjaman yang sedang menunggu verifikasi.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F1E3]">
                  <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-4">Mahasiswa Peminjam</th>
                    <th className="py-3 px-4">Buku yang Diminta</th>
                    <th className="py-3 px-4">Ketersediaan Stok</th>
                    <th className="py-3 px-4">Diajukan Pada</th>
                    <th className="py-3 px-4 text-right">Keputusan Pegawai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
                  {pendingQueue.map((item) => {
                    const isOutOfStock = item.stock_available <= 0;

                    return (
                      <tr key={item.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <strong className="text-[#5A3E28] block">{item.student_name}</strong>
                          <span className="text-[10px] text-[#79543D]/60 font-mono">
                            NIM: {item.student_nim}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-[#5A3E28] block">{item.book_title}</strong>
                          <span className="text-[10px] text-[#79543D]/60 font-mono">
                            ISBN: {item.isbn}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isOutOfStock ? (
                            <Badge variant="terracotta">Stok Habis (0)</Badge>
                          ) : (
                            <Badge variant="sage">
                              {item.stock_available} dari {item.stock_total} Tersedia
                            </Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#6E5038]">
                          {new Date(item.requested_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openApproveLoanModal(item)}
                              disabled={isOutOfStock}
                              className="px-3.5 py-1.5 rounded-xl bg-[#7B9663] hover:bg-[#6D8657] text-white font-bold text-xs shadow-[0_2px_0_#5C7348] transition-all active:translate-y-0.5 cursor-pointer disabled:opacity-50"
                              title={
                                isOutOfStock
                                  ? 'Tidak dapat disetujui karena stok fisik 0'
                                  : 'Setujui Peminjaman'
                              }
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setRejectModal({
                                  isOpen: true,
                                  loanId: item.id,
                                  studentName: item.student_name,
                                  bookTitle: item.book_title,
                                  reason: '',
                                  error: '',
                                })
                              }
                              className="px-3.5 py-1.5 rounded-xl border border-[#C96858]/35 bg-[#FBECE9] hover:bg-[#F6DCD6] text-[#8A3729] font-bold text-xs transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: MEJA PENGEMBALIAN BUKU FISIK */}
      {activeTab === 'returns' && (
        <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-editorial text-lg font-bold text-[#5A3E28]">
                Pencarian Peminjaman Aktif
              </h2>
              <p className="text-xs text-[#6E5038]/75 mt-0.5">
                Pilih transaksi untuk mengonfirmasi penerimaan fisik. Stok bertambah otomatis dan denda dihitung jika melewati batas jatuh tempo.
              </p>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                value={returnSearch}
                onChange={(e) => setReturnSearch(e.target.value)}
                placeholder="Cari nama, NIM, atau judul..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] placeholder:text-[#79543D]/45 focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
              />
            </div>
          </div>

          {filteredActiveLoans.length === 0 ? (
            <div className="p-12 text-center bg-[#F8F1E3] rounded-2xl border border-dashed border-[#DFC7A2]">
              <p className="text-xs font-medium text-[#6E5038]/75">
                Tidak ada data peminjaman aktif yang cocok dengan pencarian.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F1E3]">
                  <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-4">Peminjam</th>
                    <th className="py-3 px-4">Judul Buku</th>
                    <th className="py-3 px-4">Tanggal Pinjam</th>
                    <th className="py-3 px-4">Jatuh Tempo</th>
                    <th className="py-3 px-4">Status Keterlambatan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
                  {filteredActiveLoans.map((loan) => {
                    const isOverdue = loan.days_overdue > 0;

                    return (
                      <tr key={loan.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <strong className="text-[#5A3E28] block">{loan.student_name}</strong>
                          <span className="text-[10px] text-[#79543D]/60 font-mono">
                            NIM: {loan.student_nim}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-[#5A3E28] block">{loan.book_title}</strong>
                          <span className="text-[10px] text-[#79543D]/60 font-mono">
                            ISBN: {loan.isbn}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#6E5038]">
                          {new Date(loan.borrowed_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#5A3E28]">
                            {new Date(loan.due_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isOverdue ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FBECE9] border border-[#C96858]/30 text-[#8A3729]">
                              Terlambat {loan.days_overdue} hari (Rp{' '}
                              {parseFloat(loan.estimated_fine).toLocaleString('id-ID')})
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF4E6] border border-[#8BA372]/35 text-[#4E663C]">
                              Tepat Waktu
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openReturnLoanModal(loan)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#79543D] hover:bg-[#5f402c] text-white font-bold text-xs shadow-[0_2px_0_#4A3122] transition-all active:translate-y-0.5 cursor-pointer"
                          >
                            Terima Pengembalian
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: EVALUASI PERPANJANGAN (RENEWAL) */}
      {activeTab === 'renewals' && (
        <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60 space-y-4">
          <div>
            <h2 className="font-editorial text-lg font-bold text-[#5A3E28]">
              Permohonan Perpanjangan Masa Pinjam
            </h2>
            <p className="text-xs text-[#6E5038]/75 mt-0.5">
              Evaluasi permohonan perpanjangan waktu pinjam mahasiswa.
            </p>
          </div>

          {pendingRenewals.length === 0 ? (
            <div className="p-12 text-center bg-[#F8F1E3] rounded-2xl border border-dashed border-[#DFC7A2]">
              <p className="text-xs font-medium text-[#6E5038]/75">
                Tidak ada pengajuan perpanjangan yang sedang menunggu evaluasi.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F1E3]">
                  <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-4">Mahasiswa</th>
                    <th className="py-3 px-4">Judul Buku</th>
                    <th className="py-3 px-4">Jatuh Tempo Lama</th>
                    <th className="py-3 px-4">Tambahan Hari</th>
                    <th className="py-3 px-4 text-right">Keputusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
                  {pendingRenewals.map((r) => (
                    <tr key={r.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <strong className="text-[#5A3E28] block">{r.student_name}</strong>
                        <span className="text-[10px] text-[#79543D]/60 font-mono">
                          NIM: {r.student_nim}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-[#5A3E28] block">{r.book_title}</strong>
                        <span className="text-[10px] text-[#79543D]/60 font-mono">
                          ISBN: {r.isbn}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#6E5038]">
                        {new Date(r.old_due_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#556B43]">
                        +{r.extension_days} hari
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openApproveRenewalModal(r)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#7B9663] hover:bg-[#6D8657] text-white font-bold text-xs shadow-[0_2px_0_#5C7348] transition-all active:translate-y-0.5 cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setRejectRenewalModal({
                                isOpen: true,
                                renewalId: r.id,
                                studentName: r.student_name,
                                bookTitle: r.book_title,
                                reason: '',
                              })
                            }
                            className="px-3.5 py-1.5 rounded-xl border border-[#C96858]/35 bg-[#FBECE9] hover:bg-[#F6DCD6] text-[#8A3729] font-bold text-xs transition-colors cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 4: PELUNASAN DENDA TUNAI */}
      {activeTab === 'fines' && (
        <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60 space-y-4">
          <div>
            <h2 className="font-editorial text-lg font-bold text-[#5A3E28]">
              Catat Pelunasan Denda Tertunggak
            </h2>
            <p className="text-xs text-[#6E5038]/75 mt-0.5">
              Catat pembayaran denda dari mahasiswa di loket sirkulasi untuk membebaskan blokir peminjaman baru.
            </p>
          </div>

          {unpaidFines.length === 0 ? (
            <div className="p-12 text-center bg-[#F8F1E3] rounded-2xl border border-dashed border-[#DFC7A2]">
              <p className="text-xs font-medium text-[#6E5038]/75">
                Tidak ada denda yang tertunggak saat ini. Semua tagihan bersih.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F1E3]">
                  <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-4">Mahasiswa (NIM)</th>
                    <th className="py-3 px-4">Buku Terkait</th>
                    <th className="py-3 px-4">Hari Terlambat</th>
                    <th className="py-3 px-4">Nominal Denda</th>
                    <th className="py-3 px-4 text-right">Tindakan Kasir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
                  {unpaidFines.map((f) => (
                    <tr key={f.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <strong className="text-[#5A3E28] block">{f.student_name}</strong>
                        <span className="text-[10px] text-[#79543D]/60 font-mono">
                          NIM: {f.student_nim}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-[#5A3E28] block">{f.book_title}</strong>
                        <span className="text-[10px] text-[#79543D]/60 font-mono">
                          ISBN: {f.isbn}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#C96858]">{f.days_late} hari</td>
                      <td className="py-3.5 px-4">
                        <strong className="text-sm text-[#5A3E28]">
                          Rp {parseFloat(f.amount).toLocaleString('id-ID')}
                        </strong>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setFineModal({ isOpen: true, fine: f, method: 'Tunai', note: '' })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-[#556B43] hover:bg-[#465936] text-white font-bold text-xs shadow-[0_2px_0_#37472A] transition-all active:translate-y-0.5 cursor-pointer"
                        >
                          Catat Pelunasan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ═══════════ PORTAL MODALS (PENGGANTI BROWSER CONFIRM / ALERT) ═══════════ */}
      {confirmModal.isOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-[#EEF4E6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7B9663]" />
                  <span>{confirmModal.badge}</span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  {confirmModal.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1.5 leading-relaxed">
                  {confirmModal.description}
                </p>
              </div>

              {/* Ringkasan Transaksi */}
              <div className="rounded-2xl border border-[#EAD5B5] bg-[#FAF4E8] p-4 space-y-2 text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                    Mahasiswa
                  </span>
                  <p className="font-bold text-[#5A3E28] mt-0.5">
                    {confirmModal.studentName}{' '}
                    <span className="font-mono font-normal text-[#79543D]/70">
                      ({confirmModal.studentNim})
                    </span>
                  </p>
                </div>

                <div className="border-t border-[#EAD5B5]/70 pt-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                    Koleksi Pustaka
                  </span>
                  <p className="font-bold text-[#5A3E28] mt-0.5">{confirmModal.bookTitle}</p>
                </div>

                {confirmModal.extraLabel && (
                  <div className="border-t border-[#EAD5B5]/70 pt-2">
                    <span className="text-[11px] font-semibold text-[#556B43]">
                      {confirmModal.extraLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Tombol Aksi Modal */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={closeConfirmModal}
                  disabled={Boolean(loadingAction)}
                  className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-[#E4CEAD] bg-[#FFFDF9] hover:bg-[#F8F1E3] text-xs font-bold text-[#5A3E28] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={Boolean(loadingAction)}
                  className={`flex-1 py-2.5 px-4 rounded-2xl text-white text-xs font-bold transition-all active:translate-y-0.5 cursor-pointer disabled:opacity-60 ${
                    confirmModal.variant === 'cocoa'
                      ? 'bg-[#79543D] hover:bg-[#5f402c] shadow-[0_3px_0_#4A3122]'
                      : 'bg-[#7B9663] hover:bg-[#6D8657] shadow-[0_3px_0_#5C7348]'
                  }`}
                >
                  {loadingAction ? 'Memproses...' : confirmModal.confirmText}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* MODAL TOLAK PEMINJAMAN (ALASAN WAJIB) */}
      {rejectModal.isOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C96858]/35 bg-[#FBECE9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A84A3B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C96858]" />
                  <span>Verifikasi Sirkulasi</span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  Tolak Permohonan Peminjaman
                </h3>
                <p className="text-xs text-[#6E5038]/80 mt-1">
                  Pemohon: <strong>{rejectModal.studentName}</strong> — {rejectModal.bookTitle}
                </p>
              </div>

              <form onSubmit={handleRejectLoanSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A3E28] mb-1.5">
                    Alasan Penolakan (Wajib Diisi)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={rejectModal.reason}
                    onChange={(e) =>
                      setRejectModal({ ...rejectModal, reason: e.target.value, error: '' })
                    }
                    placeholder="Contoh: Mahasiswa belum menunjukkan KTM fisik asli di meja sirkulasi..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs sm:text-sm text-[#5A3E28] placeholder:text-[#79543D]/45 focus:outline-hidden focus:ring-2 focus:ring-[#C96858]"
                  />
                  {rejectModal.error && (
                    <p className="mt-1.5 text-[11px] font-semibold text-[#C96858]">
                      {rejectModal.error}
                    </p>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setRejectModal({
                        isOpen: false,
                        loanId: null,
                        studentName: '',
                        bookTitle: '',
                        reason: '',
                        error: '',
                      })
                    }
                    className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-[#E4CEAD] bg-[#FFFDF9] hover:bg-[#F8F1E3] text-xs font-bold text-[#5A3E28] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction?.startsWith('reject')}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-[#C96858] hover:bg-[#b25546] text-white text-xs font-bold shadow-[0_3px_0_#944134] transition-all active:translate-y-0.5 cursor-pointer"
                  >
                    {loadingAction?.startsWith('reject')
                      ? 'Menyimpan...'
                      : 'Konfirmasi Penolakan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* MODAL TOLAK PERPANJANGAN */}
      {rejectRenewalModal.isOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C96858]/35 bg-[#FBECE9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A84A3B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C96858]" />
                  <span>Evaluasi Perpanjangan</span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  Tolak Perpanjangan Masa Pinjam
                </h3>
                {rejectRenewalModal.studentName && (
                  <p className="text-xs text-[#6E5038]/80 mt-1">
                    Pemohon: <strong>{rejectRenewalModal.studentName}</strong> —{' '}
                    {rejectRenewalModal.bookTitle}
                  </p>
                )}
              </div>

              <form onSubmit={handleRejectRenewalSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A3E28] mb-1.5">
                    Alasan Penolakan
                  </label>
                  <textarea
                    rows={3}
                    value={rejectRenewalModal.reason}
                    onChange={(e) =>
                      setRejectRenewalModal({ ...rejectRenewalModal, reason: e.target.value })
                    }
                    placeholder="Contoh: Buku ini sedang masuk daftar antrean peminjaman mahasiswa lain..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs sm:text-sm text-[#5A3E28] placeholder:text-[#79543D]/45 focus:outline-hidden focus:ring-2 focus:ring-[#C96858]"
                  />
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setRejectRenewalModal({
                        isOpen: false,
                        renewalId: null,
                        studentName: '',
                        bookTitle: '',
                        reason: '',
                      })
                    }
                    className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-[#E4CEAD] bg-[#FFFDF9] hover:bg-[#F8F1E3] text-xs font-bold text-[#5A3E28] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction?.startsWith('renewal-reject')}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-[#C96858] hover:bg-[#b25546] text-white text-xs font-bold shadow-[0_3px_0_#944134] transition-all active:translate-y-0.5 cursor-pointer"
                  >
                    {loadingAction?.startsWith('renewal-reject')
                      ? 'Memproses...'
                      : 'Tolak Perpanjangan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* MODAL CATAT PELUNASAN DENDA */}
      {fineModal.isOpen &&
        fineModal.fine && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-[#EEF4E6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7B9663]" />
                  <span>Kasir Meja Sirkulasi</span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  Konfirmasi Pembayaran Denda
                </h3>
                <p className="text-xs text-[#6E5038]/80 mt-1">
                  Mahasiswa: <strong>{fineModal.fine.student_name}</strong> (
                  {fineModal.fine.student_nim})
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#EEF4E6] border border-[#929D75]/45 flex justify-between items-center">
                <span className="text-xs text-[#425732] font-bold">Total Tagihan Denda:</span>
                <strong className="font-editorial text-xl font-bold text-[#425732]">
                  Rp {parseFloat(fineModal.fine.amount).toLocaleString('id-ID')}
                </strong>
              </div>

              <form onSubmit={handlePayFineSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A3E28] mb-1.5">
                    Metode Pembayaran
                  </label>
                  <select
                    value={fineModal.method}
                    onChange={(e) => setFineModal({ ...fineModal, method: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs sm:text-sm text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  >
                    <option value="Tunai">Tunai (Kasir Sirkulasi)</option>
                    <option value="QRIS">QRIS Statis Kampus</option>
                    <option value="Transfer Bank">Transfer Bank Rekening Perpustakaan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A3E28] mb-1.5">
                    Catatan / Nomor Referensi (Opsional)
                  </label>
                  <input
                    type="text"
                    value={fineModal.note}
                    onChange={(e) => setFineModal({ ...fineModal, note: e.target.value })}
                    placeholder="Contoh: Diterima lunas oleh Pustakawan Hasan"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs sm:text-sm text-[#5A3E28] placeholder:text-[#79543D]/45 focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setFineModal({ isOpen: false, fine: null, method: 'Tunai', note: '' })
                    }
                    className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-[#E4CEAD] bg-[#FFFDF9] hover:bg-[#F8F1E3] text-xs font-bold text-[#5A3E28] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction?.startsWith('pay-fine')}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-[#556B43] hover:bg-[#465936] text-white text-xs font-bold shadow-[0_3px_0_#37472A] transition-all active:translate-y-0.5 cursor-pointer"
                  >
                    {loadingAction?.startsWith('pay-fine')
                      ? 'Menyimpan...'
                      : 'Setujui & Lunaskan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}