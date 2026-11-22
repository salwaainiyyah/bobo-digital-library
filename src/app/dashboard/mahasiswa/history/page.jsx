import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import ReviewFormModal from '@/components/dashboard/ReviewFormModal';
import JournalBookCover from '@/components/dashboard/JournalBookCover';
import { requireRole } from '@/lib/auth/permissions';
import { getStudentHistoryLoans } from '@/lib/queries/loans';
import { ROLES, LOAN_STATUS } from '@/lib/constants';

export const revalidate = 0;

export default async function MahasiswaHistoryPage() {
  const user = await requireRole(ROLES.MAHASISWA);
  const historyLoans = await getStudentHistoryLoans(user.id);

  const completedLoans = historyLoans.filter((l) => l.status === LOAN_STATUS.COMPLETED);
  const reviewedCount = completedLoans.filter((l) => Boolean(l.review_id)).length;
  const unreviewedCount = completedLoans.length - reviewedCount;

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        {/* ═══════════ 1. READING JOURNAL HEADER BANNER ═══════════ */}
        <section className="rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] p-6 sm:p-8 shadow-[0_6px_20px_rgba(92,65,42,0.06)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43] mb-2">
              <span>📓</span>
              <span>Jurnal Bacaan Mahasiswa</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#5A3E28]">
              Riwayat Transaksi &amp; Ulasan
            </h1>
            <p className="text-xs sm:text-sm text-[#6E5038]/80 mt-1">
              Catatan koleksi pustaka yang telah selesai Anda baca beserta rating dan ulasan untuk pembaca kampus lainnya.
            </p>
          </div>

          {/* Mini Journal Stats Counters */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="rounded-2xl border border-[#DFC7A2] bg-[#FFFDF9]/90 px-3.5 py-3 text-center shadow-2xs">
              <span className="block font-editorial text-xl sm:text-2xl font-bold text-[#5F784A]">
                {completedLoans.length}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#79543D]/65">
                Buku Selesai
              </span>
            </div>

            <div className="rounded-2xl border border-[#DFC7A2] bg-[#FFFDF9]/90 px-3.5 py-3 text-center shadow-2xs">
              <span className="block font-editorial text-xl sm:text-2xl font-bold text-[#C58B2A]">
                {reviewedCount}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#79543D]/65">
                Sudah Diulas
              </span>
            </div>

            <div className="rounded-2xl border border-[#DFC7A2] bg-[#FFFDF9]/90 px-3.5 py-3 text-center shadow-2xs">
              <span className="block font-editorial text-xl sm:text-2xl font-bold text-[#79543D]">
                {unreviewedCount}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#79543D]/65">
                Belum Diulas
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════ 2. TIMELINE JURNAL BACAAN ═══════════ */}
        {historyLoans.length === 0 ? (
          <div className="rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-12 text-center shadow-[0_6px_0_#EAD5B5]/60 space-y-2.5">
            <span className="text-4xl block">📜</span>
            <h3 className="font-editorial text-lg font-bold text-[#5A3E28]">
              Jurnal bacaanmu masih kosong
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5038]/75 max-w-md mx-auto">
              Buku yang sudah Anda kembalikan ke meja sirkulasi akan tercatat rapi di sini dan siap untuk diberi ulasan.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#7B9663] px-5 py-2.5 text-xs font-bold text-white shadow-[0_3px_0_#5C7348] hover:bg-[#6D8657] transition-colors"
              >
                <span>Jelajahi Katalog Buku</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative space-y-5 sm:pl-11">
            {/* Garis Vertikal Timeline (Desktop/Tablet) */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute left-4 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-[#D8BC94]"
            />

            {historyLoans.map((loan) => {
              const isCompleted = loan.status === LOAN_STATUS.COMPLETED;
              const isRejected = loan.status === LOAN_STATUS.REJECTED;
              const hasReview = isCompleted && Boolean(loan.review_id);

              return (
                <article key={loan.id} className="relative">
                  {/* Titik Penanda Timeline */}
                  <div
                    aria-hidden="true"
                    className={`hidden sm:flex absolute -left-11 top-6 h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold shadow-2xs ${
                      isCompleted
                        ? 'border-[#7B9663] bg-[#EEF4E6] text-[#556B43]'
                        : 'border-[#C96858] bg-[#FBECE9] text-[#A84A3B]'
                    }`}
                  >
                    {isCompleted ? '✓' : '✕'}
                  </div>

                  {/* Kartu Lembar Jurnal (3 Kolom Sejajar Penuh) */}
                  <div className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-4 sm:p-5 shadow-[0_6px_0_#EAD5B5]/60 transition-colors hover:border-[#CFAF82]">
                    <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 sm:gap-5">
                      {/* KOLOM 1: Bingkai Sampul Buku Jurnal */}
                      <JournalBookCover
                        coverUrl={loan.cover_url}
                        title={loan.book_title}
                        author={loan.author}
                        isCompleted={isCompleted}
                      />

                      {/* KOLOM 2: Detail Buku & Sticky Note Ulasan */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1.5 py-0.5">
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="font-bold text-[#7B9663]">{loan.category_name}</span>
                          <span className="text-[#79543D]/35">&bull;</span>
                          <span className="font-mono text-[10px] text-[#79543D]/60">
                            ISBN: {loan.isbn}
                          </span>
                        </div>

                        <h2 className="font-editorial text-base sm:text-lg font-bold text-[#5A3E28] leading-snug">
                          {loan.book_title}
                        </h2>

                        <p className="text-xs text-[#6E5038]/80">{loan.author}</p>

                        {/* Alasan Penolakan (Jika Ditolak) */}
                        {isRejected && (
                          <div className="mt-2.5 rounded-2xl border border-[#C96858]/30 bg-[#C96858]/10 px-3.5 py-2.5 text-xs text-[#8A3729]">
                            <strong>Catatan Meja Sirkulasi:</strong>{' '}
                            {loan.reject_reason || 'Permohonan peminjaman tidak dapat diproses.'}
                          </div>
                        )}

                        {/* Sticky Note Ulasan (Jika Sudah Diulas) */}
                        {hasReview && (
                          <div className="relative mt-3 rounded-2xl border border-[#E6CE8A] bg-[#FFF9E6] p-3.5 pt-4 text-xs text-[#5A3E28]">
                            {/* Pita perekat dekoratif di atas sticky note */}
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -top-2 left-5 h-3.5 w-12 rounded-xs bg-[#E2AE4B]/35 border border-[#D49F3B]/30"
                            />

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 font-bold text-[#C58B2A]">
                                <span className="tracking-wider">
                                  {'★'.repeat(loan.rating)}
                                </span>
                                <span className="text-[#DFC7A2] tracking-wider">
                                  {'★'.repeat(5 - loan.rating)}
                                </span>
                                <span className="ml-1 text-[11px] text-[#855B10]">
                                  ({loan.rating}/5)
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#855B10]/70">
                                Ulasan Anda
                              </span>
                            </div>

                            {loan.review_comment && (
                              <p className="mt-1.5 italic leading-relaxed text-[#5A3E28]/85">
                                &ldquo;{loan.review_comment}&rdquo;
                              </p>
                            )}
                          </div>
                        )}

                        {/* Ajakan Ulasan Ringkas (Jika Selesai tapi Belum Diulas) */}
                        {isCompleted && !hasReview && (
                          <p className="pt-1.5 text-[11px] text-[#79543D]/65 italic">
                            Belum ada catatan ulasan — bagikan kesanmu setelah membaca buku ini.
                          </p>
                        )}
                      </div>

                      {/* KOLOM 3: Kartu Stempel Pustaka & Tombol Ulasan */}
                      <div className="md:w-52 shrink-0 rounded-2xl border border-dashed border-[#C9A87C] bg-[#FAF4E8] p-3.5 flex flex-col justify-between text-center gap-2.5">
                        <div className="border-b border-dashed border-[#DFC39D] pb-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#79543D]/60">
                            Kartu Stempel Pustaka
                          </span>
                        </div>

                        {/* Stempel Status */}
                        <div className="py-0.5">
                          {isCompleted ? (
                            <span className="inline-block -rotate-2 rounded-lg border-2 border-[#6F8859] bg-[#EEF4E6] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#4F663C]">
                              ✓ Dikembalikan
                            </span>
                          ) : (
                            <span className="inline-block -rotate-2 rounded-lg border-2 border-[#C96858] bg-[#C96858]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#A84A3B]">
                              ✕ Ditolak
                            </span>
                          )}
                        </div>

                        {/* Tanggal */}
                        <div className="text-xs">
                          <span className="block text-[10px] text-[#79543D]/60">
                            {isCompleted ? 'Tanggal Kembali:' : 'Tanggal Pengajuan:'}
                          </span>
                          <span className="font-bold text-[#5A3E28]">
                            {isCompleted
                              ? loan.returned_at
                                ? new Date(loan.returned_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '-'
                              : new Date(loan.requested_at).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                          </span>
                        </div>

                        {/* Tombol Tulis / Ubah Ulasan */}
                        {isCompleted && (
                          <div className="pt-1 flex justify-center">
                            <ReviewFormModal
                              loanId={loan.id}
                              bookTitle={loan.book_title}
                              existingReview={
                                loan.review_id
                                  ? { rating: loan.rating, comment: loan.review_comment }
                                  : null
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}