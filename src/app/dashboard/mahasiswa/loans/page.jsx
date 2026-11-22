import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import Badge from '@/components/ui/Badge';
import RenewalButton from '@/components/dashboard/RenewalButton';
import { requireRole } from '@/lib/auth/permissions';
import { getStudentActiveLoans } from '@/lib/queries/loans';
import { ROLES, LOAN_STATUS } from '@/lib/constants';

export const revalidate = 0;

function chunkIntoShelves(items, perShelf = 3) {
  const shelves = [];
  for (let i = 0; i < items.length; i += perShelf) {
    shelves.push(items.slice(i, i + perShelf));
  }
  return shelves;
}

function BookCoverOnShelf({ loan, accentColor = 'sage' }) {
  const fallbackBg =
    accentColor === 'yellow'
      ? 'from-[#79543D] to-[#5C3D2B]'
      : 'from-[#566948] to-[#3E4E33]';

  return (
    <div className="relative mx-auto w-32 sm:w-36 aspect-[3/4.2] transition-transform duration-300 group-hover:-translate-y-1.5">
      <div
        aria-hidden="true"
        className="absolute -bottom-1 inset-x-2 h-3 rounded-full bg-[#4A321E]/35 blur-xs"
      />

      <div className="relative h-full w-full overflow-hidden rounded-r-xl rounded-l-xs border border-[#C9A87C]/60 bg-[#FFFDF9] shadow-[6px_6px_14px_rgba(74,50,30,0.22)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-3 bg-gradient-to-r from-black/25 via-white/15 to-transparent"
        />

        {loan.cover_url ? (
          <img
            src={loan.cover_url}
            alt={loan.book_title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col justify-between bg-gradient-to-br ${fallbackBg} p-3.5 text-[#FDF9F3]`}
          >
            <div className="flex items-center justify-between text-[9px] tracking-widest opacity-80">
              <span>BO&apos;BO</span>
              <span className="font-serif">ᨅᨚᨅᨚ</span>
            </div>
            <p className="font-editorial text-xs font-bold leading-snug line-clamp-4">
              {loan.book_title}
            </p>
            <p className="truncate text-[9px] opacity-75">{loan.author}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function WoodenShelfPlank({ className = '' }) {
  return (
    <div aria-hidden="true" className={`w-full select-none ${className}`}>
      <div className="h-3 w-full bg-gradient-to-b from-[#EAD0A8] to-[#D8B480] border-t border-[#F4DFC0]" />
      <div className="h-2.5 w-full bg-gradient-to-b from-[#C59960] to-[#B0834B] shadow-[0_8px_14px_rgba(90,62,40,0.16)]" />
    </div>
  );
}

export default async function MahasiswaLoansPage() {
  const user = await requireRole(ROLES.MAHASISWA);
  const activeLoans = await getStudentActiveLoans(user.id);

  const pendingLoans = activeLoans.filter((l) => l.status === LOAN_STATUS.PENDING);
  const borrowedLoans = activeLoans.filter((l) => l.status !== LOAN_STATUS.PENDING);

  const borrowedShelves = chunkIntoShelves(borrowedLoans, 3);
  const pendingShelves = chunkIntoShelves(pendingLoans, 3);

  return (
    <DashboardShell user={user}>
      <div className="space-y-7">
        {/* 1. HEADER BANNER */}
        <section className="rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] p-6 sm:p-8 shadow-[0_6px_20px_rgba(92,65,42,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43] mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7B9663]" />
              <span>Sirkulasi Mahasiswa</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#5A3E28]">
              Peminjaman Aktif &amp; Pengajuan
            </h1>
            <p className="text-xs sm:text-sm text-[#6E5038]/80 mt-1">
              Koleksi buku yang sedang Anda pinjam dan daftar permohonan yang menunggu verifikasi meja sirkulasi.
            </p>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl bg-[#7B9663] hover:bg-[#6D8657] text-white text-xs font-bold shadow-[0_4px_0_#5C7348] transition-all active:translate-y-0.5 shrink-0"
          >
            <span>+ Cari Buku Baru</span>
          </Link>
        </section>

        {/* 2. RAK 1: SEDANG DIPINJAM */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#8BA372]/40 bg-[#EEF4E6] text-[#556B43]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <div>
                <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#5A3E28]">
                  Sedang Dipinjam
                </h2>
                <p className="text-[11px] text-[#6E5038]/75">
                  Eksemplar fisik aktif yang perlu dikembalikan sebelum batas waktu
                </p>
              </div>
            </div>

            <span className="rounded-full border border-[#929D75]/40 bg-[#EEF4E6] px-3.5 py-1 text-xs font-bold text-[#556B43]">
              {borrowedLoans.length} Buku
            </span>
          </div>

          {borrowedLoans.length === 0 ? (
            <div className="rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-8 text-center shadow-[0_6px_0_#EAD5B5]/60 space-y-2">
              <h3 className="font-bold text-sm text-[#5A3E28]">
                Belum ada buku yang sedang dipinjam
              </h3>
              <p className="text-xs text-[#6E5038]/75 max-w-md mx-auto">
                Buku yang sudah diverifikasi petugas akan tersusun rapi di rak ini.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[28px] border-[3px] border-[#DFC19A] bg-[#FFFDF9] shadow-[0_8px_0_#E5C89E]">
              {borrowedShelves.map((shelfBooks, shelfIdx) => (
                <div
                  key={`borrowed-shelf-${shelfIdx}`}
                  className={shelfIdx > 0 ? 'border-t-2 border-[#EAD5B5]' : ''}
                >
                  <div className="bg-gradient-to-b from-[#F5E9D4] via-[#F9F0E0] to-[#F3E3C8] px-6 pt-7 pb-0 shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                      {shelfBooks.map((loan) => (
                        <div key={loan.id} className="group flex flex-col items-center">
                          <BookCoverOnShelf loan={loan} accentColor="sage" />
                          <WoodenShelfPlank className="md:hidden" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <WoodenShelfPlank className="hidden md:block" />

                  <div className="bg-[#FFFDF9] px-6 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:divide-x md:divide-[#EAD5B5]/70">
                      {shelfBooks.map((loan, idx) => {
                        const isOverdue = loan.days_overdue > 0;
                        const hasPendingRenewal = loan.renewal_status === 'PENDING';
                        const isRenewalEligible = !isOverdue && !hasPendingRenewal;

                        let renewalDisabledReason = '';
                        if (isOverdue) {
                          renewalDisabledReason = 'Tidak dapat diperpanjang (sudah terlambat)';
                        } else if (hasPendingRenewal) {
                          renewalDisabledReason = 'Perpanjangan sudah diajukan';
                        }

                        return (
                          <div
                            key={`meta-${loan.id}`}
                            className={`flex flex-col justify-between space-y-3 ${
                              idx > 0 ? 'md:pl-6' : ''
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-2 text-[10px]">
                                <span className="font-semibold text-[#556B43] truncate">
                                  {loan.category_name}
                                </span>
                                <span className="font-mono text-[#79543D]/55 shrink-0">
                                  {loan.isbn}
                                </span>
                              </div>

                              <h3 className="font-bold text-sm text-[#5A3E28] leading-snug line-clamp-2">
                                {loan.book_title}
                              </h3>

                              <p className="text-xs text-[#6E5038]/75 truncate">{loan.author}</p>

                              {(hasPendingRenewal || isOverdue) && (
                                <div className="pt-1 flex flex-wrap gap-1.5">
                                  {hasPendingRenewal && (
                                    <Badge variant="yellow">Perpanjangan Diajukan</Badge>
                                  )}
                                  {isOverdue && (
                                    <Badge variant="terracotta">
                                      Terlambat {loan.days_overdue} hari
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="pt-2 border-t border-[#EAD5B5]/60 space-y-2.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#79543D]/65">Batas kembali:</span>
                                <span
                                  className={`font-bold ${
                                    isOverdue ? 'text-[#C96858]' : 'text-[#5A3E28]'
                                  }`}
                                >
                                  {new Date(loan.due_date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>

                              {isOverdue && (
                                <p className="text-[11px] text-[#8A3729] font-medium">
                                  Estimasi denda:{' '}
                                  <strong>
                                    Rp {parseFloat(loan.estimated_fine).toLocaleString('id-ID')}
                                  </strong>
                                </p>
                              )}

                              <RenewalButton
                                loanId={loan.id}
                                isEligible={isRenewalEligible}
                                disabledReason={renewalDisabledReason}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. RAK 2: PERMOHONAN MENUNGGU VERIFIKASI */}
        <section className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E2B15B]/50 bg-[#FFF6DF] text-[#9A6B19]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#5A3E28]">
                  Permohonan Menunggu Verifikasi
                </h2>
                <p className="text-[11px] text-[#6E5038]/75">
                  Daftar pengajuan pinjam yang belum diverifikasi petugas
                </p>
              </div>
            </div>

            <span className="rounded-full border border-[#E2B15B]/50 bg-[#F5C875]/25 px-3.5 py-1 text-xs font-bold text-[#855B10]">
              {pendingLoans.length} Permohonan
            </span>
          </div>

          {pendingLoans.length > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-[#E2B15B]/55 bg-[#FFF9EC] px-4 py-3 text-xs text-[#6E490B] shadow-2xs">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#F5C875]/35 text-[#855B10]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </span>
              <p className="leading-relaxed">
                <strong>Info Pengambilan:</strong> Tunjukkan <strong>KTM aktif</strong> Anda kepada petugas di{' '}
                <strong>Meja Sirkulasi Lantai 1</strong> untuk verifikasi dan serah-terima buku fisik di bawah ini.
              </p>
            </div>
          )}

          {pendingLoans.length === 0 ? (
            <div className="rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-8 text-center shadow-[0_6px_0_#EAD5B5]/60 space-y-2">
              <h3 className="font-bold text-sm text-[#5A3E28]">
                Tidak ada permohonan yang menunggu verifikasi
              </h3>
              <p className="text-xs text-[#6E5038]/75 max-w-md mx-auto">
                Semua pengajuan peminjaman Anda sudah diproses. Ajukan peminjaman baru melalui katalog buku.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[28px] border-[3px] border-[#DFC19A] bg-[#FFFDF9] shadow-[0_8px_0_#E5C89E]">
              {pendingShelves.map((shelfBooks, shelfIdx) => (
                <div
                  key={`pending-shelf-${shelfIdx}`}
                  className={shelfIdx > 0 ? 'border-t-2 border-[#EAD5B5]' : ''}
                >
                  <div className="bg-gradient-to-b from-[#F5E9D4] via-[#F9F0E0] to-[#F3E3C8] px-6 pt-7 pb-0 shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                      {shelfBooks.map((loan) => (
                        <div key={loan.id} className="group flex flex-col items-center">
                          <BookCoverOnShelf loan={loan} accentColor="yellow" />
                          <WoodenShelfPlank className="md:hidden" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <WoodenShelfPlank className="hidden md:block" />

                  <div className="bg-[#FFFDF9] px-6 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:divide-x md:divide-[#EAD5B5]/70">
                      {shelfBooks.map((loan, idx) => (
                        <div
                          key={`pending-meta-${loan.id}`}
                          className={`flex flex-col justify-between space-y-2.5 ${
                            idx > 0 ? 'md:pl-6' : ''
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2 text-[10px]">
                              <span className="font-semibold text-[#556B43] truncate">
                                {loan.category_name}
                              </span>
                              <span className="font-mono text-[#79543D]/55 shrink-0">
                                {loan.isbn}
                              </span>
                            </div>

                            <h3 className="font-bold text-sm text-[#5A3E28] leading-snug line-clamp-2">
                              {loan.book_title}
                            </h3>

                            <p className="text-xs text-[#6E5038]/75 truncate">{loan.author}</p>
                          </div>

                          <div className="pt-2 border-t border-[#EAD5B5]/60 flex items-center justify-between text-xs">
                            <span className="text-[#79543D]/65">Diajukan pada:</span>
                            <span className="font-bold text-[#5A3E28]">
                              {new Date(loan.requested_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}