import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import { requireRole } from '@/lib/auth/permissions';
import { getStudentActiveLoans } from '@/lib/queries/loans';
import { getStudentFines, hasUnpaidFine } from '@/lib/queries/fines';
import { ROLES, LOAN_STATUS } from '@/lib/constants';

export const revalidate = 0;

function buildMonthCalendar(referenceDate) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Senin = 0 ... Minggu = 6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= lastDate; day++) {
    cells.push(day);
  }
  return cells;
}

export default async function MahasiswaDashboardPage() {
  const user = await requireRole(ROLES.MAHASISWA);

  const [activeLoans, fines, isBlockedByFine] = await Promise.all([
    getStudentActiveLoans(user.id),
    getStudentFines(user.id),
    hasUnpaidFine(user.id),
  ]);

  const unpaidFinesTotal = fines
    .filter((f) => f.status === 'UNPAID')
    .reduce((sum, f) => sum + parseFloat(f.amount), 0);

  const pendingRequestsCount = activeLoans.filter((l) => l.status === LOAN_STATUS.PENDING).length;
  const currentlyBorrowedCount = activeLoans.filter((l) => l.status === LOAN_STATUS.BORROWED).length;
  const maxQuota = 3;

  // Data Kalender Bulan Ini
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const todayDate = now.getDate();

  const monthLabel = now.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  const calendarCells = buildMonthCalendar(now);

  // Kumpulkan tanggal jatuh tempo di bulan & tahun yang sama
  const dueDaysInCurrentMonth = new Set(
    activeLoans
      .filter((l) => l.due_date)
      .map((l) => new Date(l.due_date))
      .filter((d) => d.getFullYear() === currentYear && d.getMonth() === currentMonth)
      .map((d) => d.getDate())
  );

  return (
    <DashboardShell user={user}>
      <div className="space-y-5">
        {/* ═══════════ 1. COZY BOOK ILLUSTRATION WELCOME BANNER ═══════════ */}
        <section className="relative overflow-hidden rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] px-6 py-6 sm:px-8 sm:py-7 shadow-[0_6px_20px_rgba(92,65,42,0.06)]">
          {/* Cozy Stack of Books & Open Storybook Illustration */}
          <svg
            aria-hidden="true"
            viewBox="0 0 460 180"
            className="pointer-events-none absolute right-0 bottom-0 h-full w-auto max-w-[55%] opacity-95 hidden sm:block"
            preserveAspectRatio="xMaxYMax slice"
          >
            {/* Soft clouds & background hills */}
            <ellipse cx="140" cy="34" rx="38" ry="12" fill="#FFFFFF" fillOpacity="0.6" />
            <ellipse cx="320" cy="26" rx="44" ry="13" fill="#FFFFFF" fillOpacity="0.5" />
            <path d="M40 180 Q185 108 330 142 T460 118 L460 180 Z" fill="#C4D7B7" />
            <path d="M110 180 Q265 118 460 144 L460 180 Z" fill="#A9C29A" />

            {/* ─── STACK OF 4 COZY HARDCOVER BOOKS ─── */}
            <g>
              {/* Book 1 (Bottom - Terracotta) */}
              <rect x="215" y="138" width="112" height="16" rx="5" fill="#C96858" />
              <rect x="223" y="141" width="96" height="10" rx="3" fill="#FDF9F3" />
              <line x1="232" y1="145" x2="310" y2="145" stroke="#E5C89E" strokeWidth="1.5" />

              {/* Book 2 (Sage Green) */}
              <rect x="224" y="122" width="102" height="16" rx="5" fill="#7B9663" />
              <rect x="232" y="125" width="86" height="10" rx="3" fill="#FDF9F3" />
              <line x1="240" y1="129" x2="308" y2="129" stroke="#C5D6B4" strokeWidth="1.5" />

              {/* Book 3 (Warm Gold) */}
              <rect x="220" y="106" width="98" height="16" rx="5" fill="#E2AE4B" />
              <rect x="228" y="109" width="82" height="10" rx="3" fill="#FDF9F3" />
              <line x1="236" y1="113" x2="300" y2="113" stroke="#EBD5A3" strokeWidth="1.5" />

              {/* Book 4 (Top - Warm Brown + Bookmark Ribbon) */}
              <rect x="232" y="91" width="86" height="15" rx="5" fill="#8C5E3C" />
              <rect x="239" y="94" width="72" height="9" rx="2.5" fill="#FDF9F3" />
              {/* Hanging bookmark ribbon */}
              <polygon points="296,106 306,106 306,123 301,118 296,123" fill="#C96858" />
            </g>

            {/* ─── OPEN STORYBOOK BESIDE THE STACK ─── */}
            <g>
              {/* Book cover base */}
              <path
                d="M336 146 Q366 138 386 147 Q406 138 436 146 L432 153 Q406 145 386 153 Q366 145 340 153 Z"
                fill="#79543D"
              />
              {/* Left open page */}
              <path
                d="M342 144 Q365 133 386 144 L386 118 Q365 108 342 118 Z"
                fill="#FFFDF9"
                stroke="#DFC39D"
                strokeWidth="1.5"
              />
              {/* Right open page */}
              <path
                d="M430 144 Q407 133 386 144 L386 118 Q407 108 430 118 Z"
                fill="#FDF7EB"
                stroke="#DFC39D"
                strokeWidth="1.5"
              />
              {/* Page text lines */}
              <line x1="350" y1="124" x2="378" y2="126" stroke="#C5A47C" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="350" y1="130" x2="376" y2="132" stroke="#D8C2A3" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="394" y1="126" x2="422" y2="124" stroke="#C5A47C" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="396" y1="132" x2="422" y2="130" stroke="#D8C2A3" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Cute floating sparkles & leaves around the books */}
            <path d="M274 64 L276 70 L282 72 L276 74 L274 80 L272 74 L266 72 L272 70 Z" fill="#E2AE4B" />
            <path d="M386 86 L387.5 90.5 L392 92 L387.5 93.5 L386 98 L384.5 93.5 L380 92 L384.5 90.5 Z" fill="#E2AE4B" />
            <circle cx="344" cy="96" r="3" fill="#8FA97D" />
            <circle cx="246" cy="76" r="2.5" fill="#C96858" fillOpacity="0.7" />

            {/* Foreground meadow */}
            <path d="M70 180 Q260 146 460 156 L460 180 Z" fill="#8FA97D" />
          </svg>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43] mb-2">
              <span>📚</span>
              <span>Dashboard Pustaka Mahasiswa</span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#5A3E28] leading-tight">
              Selamat datang kembali, {user.fullName}!
            </h1>

            <p className="mt-1.5 text-xs sm:text-sm text-[#6E5038]/85">
              NIM: <strong className="font-mono text-[#5A3E28]">{user.identityNumber || '-'}</strong> ·{' '}
              Kelola peminjaman buku, jadwal kembali, dan ulasan bacaanmu di sini.
            </p>
          </div>
        </section>

        {/* Peringatan Denda Tertunggak (Jika ada) */}
        {isBlockedByFine && (
          <Alert
            variant="danger"
            title="Peringatan Denda Tertunggak"
            action={
              <Link
                href="/dashboard/mahasiswa/fines"
                className="bg-[#C96858] text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl hover:bg-[#a54434] transition-colors"
              >
                Lihat Rincian Denda
              </Link>
            }
          >
            Anda memiliki tagihan denda keterlambatan sebesar{' '}
            <strong>Rp {unpaidFinesTotal.toLocaleString('id-ID')}</strong> yang belum dilunasi. Pengajuan peminjaman buku baru diblokir sementara hingga denda dilunasi di meja sirkulasi.
          </Alert>
        )}

        {/* ═══════════ 2. BENTO GRID ROW 1 (2 PROPORTIONAL CARDS) ═══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* CARD 1: IKHTISAR & KALENDER SIRKULASI (7 Kolom) */}
          <section className="lg:col-span-7 rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-5 shadow-[0_6px_0_#EAD5B5]/60 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="flex items-center gap-2 font-editorial text-base font-bold text-[#5A3E28]">
                <span className="text-[#7B9663]">🌿</span>
                <span>Ikhtisar &amp; Kalender</span>
              </h2>
              <span className="text-[11px] font-semibold text-[#7B9663]">{monthLabel}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-stretch">
              {/* Left Column: 3 Stacked Info Tiles */}
              <div className="sm:col-span-5 flex flex-col justify-between gap-2.5">
                <div className="rounded-2xl border border-[#EAD5B5] bg-[#F8F1E3] p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                    Reputasi Pinjam
                  </span>
                  <div className="mt-1 flex items-center gap-0.5 text-sm text-[#E2A93B]">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span className={isBlockedByFine ? 'text-[#D6C7B2]' : ''}>★</span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-bold text-[#5A3E28]">
                    {isBlockedByFine ? 'Perlu Pelunasan' : 'Sangat Baik'}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#EAD5B5] bg-[#F8F1E3] p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                    Nomor Induk
                  </span>
                  <p className="mt-0.5 font-mono text-xs font-bold text-[#5A3E28] truncate">
                    {user.identityNumber || '-'}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#EAD5B5] bg-[#F8F1E3] p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                    Buku di Tangan
                  </span>
                  <p className="mt-0.5 text-sm font-extrabold text-[#5A3E28]">
                    📖 {currentlyBorrowedCount} / {maxQuota}
                  </p>
                </div>
              </div>

              {/* Right Column: Mini Calendar + Mascot Bubble */}
              <div className="sm:col-span-7 rounded-2xl border border-[#EAD5B5] bg-[#FAF4E8] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#79543D]/55 mb-1.5">
                    <span>S</span>
                    <span>S</span>
                    <span>R</span>
                    <span>K</span>
                    <span>J</span>
                    <span>S</span>
                    <span>M</span>
                  </div>

                  <div className="grid grid-cols-7 gap-y-1 text-center text-[11px]">
                    {calendarCells.map((day, idx) => {
                      if (!day) return <span key={`empty-${idx}`} />;

                      const isToday = day === todayDate;
                      const isDueDate = dueDaysInCurrentMonth.has(day);

                      return (
                        <span
                          key={day}
                          title={
                            isDueDate
                              ? 'Jadwal jatuh tempo pengembalian buku'
                              : isToday
                              ? 'Hari ini'
                              : undefined
                          }
                          className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full font-semibold transition-transform ${
                            isToday
                              ? 'bg-[#6F8859] text-white font-bold shadow-2xs scale-105'
                              : isDueDate
                              ? 'bg-[#C96858] text-white font-bold'
                              : 'text-[#5A3E28]/80'
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Mini Mascot Reminder Bubble */}
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#E4CEAD] bg-white/90 px-2.5 py-1.5">
                  <div className="relative h-7 w-7 shrink-0">
                    <Image
                      src="/brand/bo-bo-logo.png"
                      alt="Bo'bo"
                      fill
                      sizes="28px"
                      className="object-contain"
                    />
                  </div>
                  <p className="text-[10px] leading-tight text-[#6E5038]">
                    {dueDaysInCurrentMonth.size > 0
                      ? 'Tanggal merah = batas kembali buku ya!'
                      : 'Belum ada jadwal jatuh tempo bulan ini.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CARD 2: TARGET & STATUS SIRKULASI (5 Kolom) */}
          <section className="lg:col-span-5 rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-5 shadow-[0_6px_0_#EAD5B5]/60 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="flex items-center gap-2 font-editorial text-base font-bold text-[#5A3E28]">
                <span className="text-[#7B9663]">🌿</span>
                <span>Status Sirkulasi</span>
              </h2>
              <Link
                href="/dashboard/mahasiswa/loans"
                className="text-[11px] font-semibold text-[#7B9663] hover:underline"
              >
                Detail →
              </Link>
            </div>

            <div className="space-y-3 my-auto">
              {/* Row 1: Sedang Dipinjam */}
              <div className="rounded-2xl border border-[#EAD5B5]/80 bg-[#F8F1E3]/80 p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#5A3E28] flex items-center gap-1.5">
                    <span>📖</span> Sedang Dipinjam
                  </span>
                  <span className="font-extrabold text-[#5F784A]">
                    {currentlyBorrowedCount} / {maxQuota} Buku
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E6D5B8]">
                  <div
                    className="h-full rounded-full bg-[#7B9663] transition-all duration-500"
                    style={{ width: `${Math.min(100, (currentlyBorrowedCount / maxQuota) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Row 2: Menunggu Persetujuan */}
              <div className="rounded-2xl border border-[#EAD5B5]/80 bg-[#F8F1E3]/80 p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#5A3E28] flex items-center gap-1.5">
                    <span>⏳</span> Menunggu Verifikasi
                  </span>
                  <span className="font-extrabold text-[#9A6B19]">
                    {pendingRequestsCount} Pengajuan
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E6D5B8]">
                  <div
                    className="h-full rounded-full bg-[#E2AE4B] transition-all duration-500"
                    style={{ width: pendingRequestsCount > 0 ? '65%' : '0%' }}
                  />
                </div>
              </div>

              {/* Row 3: Tagihan Denda */}
              <div className="rounded-2xl border border-[#EAD5B5]/80 bg-[#F8F1E3]/80 p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#5A3E28] flex items-center gap-1.5">
                    <span>💰</span> Tagihan Denda
                  </span>
                  <span
                    className={`font-extrabold ${
                      isBlockedByFine ? 'text-[#C96858]' : 'text-[#5F784A]'
                    }`}
                  >
                    Rp {unpaidFinesTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="mt-1 text-[10.5px] text-[#79543D]/70">
                  {isBlockedByFine
                    ? 'Segera lunasi di meja sirkulasi Lantai 1'
                    : 'Bebas tanggungan denda keterlambatan'}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ═══════════ 3. PEMINJAMAN YANG SEDANG BERJALAN ═══════════ */}
        <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[#7B9663]">🌿</span>
              <h2 className="font-editorial text-lg font-bold text-[#5A3E28]">
                Peminjaman yang Sedang Berjalan
              </h2>
            </div>
            <Link
              href="/dashboard/mahasiswa/loans"
              className="rounded-full border border-[#D8E2C8] bg-[#EEF4E6] px-3.5 py-1.5 text-xs font-bold text-[#556B43] hover:bg-[#E1ECD4] transition-colors"
            >
              Kelola &amp; Perpanjang →
            </Link>
          </div>

          {activeLoans.length === 0 ? (
            <div className="p-8 text-center bg-[#F8F1E3] rounded-2xl border border-dashed border-[#DFC7A2]">
              <p className="text-xs sm:text-sm font-medium text-[#5A3E28]/80">
                Anda tidak memiliki permohonan atau peminjaman aktif saat ini.
              </p>
              <Link
                href="/catalog"
                className="inline-block mt-3 px-5 py-2.5 bg-[#7B9663] text-white text-xs font-bold rounded-xl shadow-[0_3px_0_#5C7348] hover:bg-[#6D8657] transition-colors"
              >
                Jelajahi Katalog Buku
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F1E3]">
                  <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-4">Judul Buku</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Jatuh Tempo</th>
                    <th className="py-3 px-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
                  {activeLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#5A3E28]">{loan.book_title}</p>
                        <span className="text-[10px] text-[#79543D]/60 font-mono">{loan.isbn}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {loan.status === LOAN_STATUS.PENDING ? (
                          <Badge variant="yellow">Menunggu Konfirmasi</Badge>
                        ) : (
                          <Badge variant="sage">Sedang Dipinjam</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {loan.due_date ? (
                          <div>
                            <span className="font-semibold text-[#5A3E28]">
                              {new Date(loan.due_date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            {loan.days_overdue > 0 && (
                              <p className="text-[10px] text-[#C96858] font-bold">
                                Terlambat {loan.days_overdue} hari
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#79543D]/50">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {loan.renewal_status === 'PENDING' ? (
                          <span className="text-[#855B10] font-semibold">Perpanjangan Diajukan</span>
                        ) : loan.status === LOAN_STATUS.PENDING ? (
                          <span className="text-[#6E5038]">Bawa KTM ke meja sirkulasi</span>
                        ) : (
                          <span className="text-[#54603B] font-medium">Aktif normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ═══════════ 4. CATATAN & PANDUAN SIRKULASI (COZY NOTES ROW) ═══════════ */}
        <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-5 shadow-[0_6px_0_#EAD5B5]/60">
          <h2 className="flex items-center gap-2 font-editorial text-base font-bold text-[#5A3E28] mb-3.5">
            <span className="text-[#7B9663]">🌿</span>
            <span>Catatan &amp; Panduan Sirkulasi</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="rounded-2xl border border-[#EAD5B5] bg-[#F8F1E3] p-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-[#5A3E28]">Pengambilan Buku Fisik</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-[#6E5038]/80">
                  Tunjukkan KTM aktif kepada petugas di Meja Sirkulasi Lantai 1 untuk mengambil buku yang berstatus menunggu konfirmasi.
                </p>
              </div>
              <span className="text-2xl shrink-0">🪪</span>
            </div>

            <div className="rounded-2xl border border-[#EAD5B5] bg-[#F8F1E3] p-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-[#5A3E28]">Perpanjangan Masa Pinjam</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-[#6E5038]/80">
                  Ajukan perpanjangan melalui menu <strong>Peminjaman Aktif</strong> sebelum tanggal jatuh tempo tiba.
                </p>
              </div>
              <span className="text-2xl shrink-0">🗓️</span>
            </div>

            <div className="rounded-2xl border border-[#EAD5B5] bg-[#F8F1E3] p-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-[#5A3E28]">Ulasan Setelah Kembali</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-[#6E5038]/80">
                  Bagikan rating dan ulasan buku setelah selesai dibaca di menu <strong>Riwayat &amp; Ulasan</strong> untuk membantu teman kampus.
                </p>
              </div>
              <span className="text-2xl shrink-0">✍️</span>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}