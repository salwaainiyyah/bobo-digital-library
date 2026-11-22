import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import Badge from '@/components/ui/Badge';
import { requireRole } from '@/lib/auth/permissions';
import {
  getCirculationPendingQueue,
  getCirculationActiveLoans,
  getCirculationPendingRenewals,
} from '@/lib/queries/loans';
import { getAllUnpaidFines } from '@/lib/queries/fines';
import { ROLES } from '@/lib/constants';

export const revalidate = 0;

function StatIcon({ type }) {
  switch (type) {
    case 'queue':
      return (
        <svg className="h-5 w-5 text-[#9A6B19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'borrowed':
      return (
        <svg className="h-5 w-5 text-[#556B43]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'renewal':
      return (
        <svg className="h-5 w-5 text-[#4B6F82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5 text-[#C96858]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      );
  }
}

export default async function PegawaiDashboardPage() {
  const user = await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);

  const [pendingQueue, activeLoans, pendingRenewals, unpaidFines] = await Promise.all([
    getCirculationPendingQueue(),
    getCirculationActiveLoans(''),
    getCirculationPendingRenewals(),
    getAllUnpaidFines(),
  ]);

  const totalUnpaidAmount = unpaidFines.reduce((sum, f) => sum + parseFloat(f.amount), 0);

  const operationalStats = [
    {
      title: 'Antrean Peminjaman',
      value: `${pendingQueue.length} Antrean`,
      subtitle: 'Menunggu persetujuan fisik',
      iconType: 'queue',
      valueColor: 'text-[#9A6B19]',
      iconBox: 'border-[#E2B15B]/40 bg-[#FFF6DF]',
    },
    {
      title: 'Sedang Dipinjam',
      value: `${activeLoans.length} Buku`,
      subtitle: 'Buku fisik aktif di peminjam',
      iconType: 'borrowed',
      valueColor: 'text-[#556B43]',
      iconBox: 'border-[#8BA372]/40 bg-[#EEF4E6]',
    },
    {
      title: 'Permohonan Perpanjangan',
      value: `${pendingRenewals.length} Pengajuan`,
      subtitle: 'Menunggu evaluasi perpanjangan',
      iconType: 'renewal',
      valueColor: 'text-[#4B6F82]',
      iconBox: 'border-[#9BB9C9]/45 bg-[#EBF3F7]',
    },
    {
      title: 'Denda Tertunggak',
      value: `Rp ${totalUnpaidAmount.toLocaleString('id-ID')}`,
      subtitle: `${unpaidFines.length} transaksi belum lunas`,
      iconType: 'fine',
      valueColor: 'text-[#C96858]',
      iconBox: 'border-[#C96858]/30 bg-[#FBECE9]',
    },
  ];

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        {/* ═══════════ 1. HEADER BANNER MEJA KERJA PUSTAKAWAN ═══════════ */}
        <section className="relative overflow-hidden rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] p-6 sm:p-8 shadow-[0_6px_20px_rgba(92,65,42,0.06)]">
          {/* Ilustrasi Tumpukan Buku & Bukit Kampus di Sisi Kanan */}
          <svg
            aria-hidden="true"
            viewBox="0 0 380 160"
            className="pointer-events-none absolute right-0 bottom-0 h-full w-auto max-w-[46%] opacity-85 hidden md:block"
            preserveAspectRatio="xMaxYMax slice"
          >
            <path d="M40 160 Q180 105 380 128 L380 160 Z" fill="#C4D7B7" />
            <path d="M120 160 Q250 118 380 138 L380 160 Z" fill="#A9C29A" />

            {/* Tumpukan Buku Koleksi */}
            <rect x="175" y="124" width="102" height="14" rx="4" fill="#C96858" />
            <rect x="182" y="127" width="88" height="8" rx="2" fill="#FDF9F3" />
            <rect x="183" y="110" width="94" height="14" rx="4" fill="#7B9663" />
            <rect x="190" y="113" width="80" height="8" rx="2" fill="#FDF9F3" />
            <rect x="189" y="96" width="82" height="14" rx="4" fill="#E2AE4B" />
            <rect x="195" y="99" width="70" height="8" rx="2" fill="#FDF9F3" />
            <rect x="198" y="83" width="68" height="13" rx="4" fill="#8C5E3C" />
            <rect x="204" y="86" width="56" height="7" rx="2" fill="#FDF9F3" />
          </svg>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43] mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7B9663]" />
              <span>Operasional Perpustakaan</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#5A3E28]">
              Meja Kerja Pustakawan
            </h1>
            <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1">
              Kelola sirkulasi fisik, persetujuan peminjaman bertingkat, konfirmasi pengembalian, dan denda keterlambatan.
            </p>
          </div>
        </section>

        {/* ═══════════ 2. KARTU STATISTIK OPERASIONAL ═══════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {operationalStats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-5 shadow-[0_6px_0_#EAD5B5]/60 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79543D]/65 truncate">
                  {stat.title}
                </span>
                <div className={`font-editorial text-2xl font-bold mt-1.5 ${stat.valueColor}`}>
                  {stat.value}
                </div>
                <p className="text-[11px] text-[#6E5038]/75 mt-1 truncate">{stat.subtitle}</p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${stat.iconBox}`}
              >
                <StatIcon type={stat.iconType} />
              </div>
            </div>
          ))}
        </section>

        {/* ═══════════ 3. ANTREAN PERMOHONAN PEMINJAMAN TERBARU ═══════════ */}
        <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#7B9663]" />
              <h2 className="font-editorial text-lg font-bold text-[#5A3E28]">
                Antrean Permohonan Peminjaman Terbaru
              </h2>
            </div>

            <Link
              href="/dashboard/pegawai/circulation"
              className="rounded-full border border-[#D8E2C8] bg-[#EEF4E6] px-3.5 py-1.5 text-xs font-bold text-[#556B43] hover:bg-[#E1ECD4] transition-colors"
            >
              Buka Semua Antrean ({pendingQueue.length}) →
            </Link>
          </div>

          {pendingQueue.length === 0 ? (
            <div className="p-10 text-center bg-[#F8F1E3] rounded-2xl border border-dashed border-[#DFC7A2] space-y-1.5">
              <h3 className="font-bold text-sm text-[#5A3E28]">Antrean Permohonan Bersih</h3>
              <p className="text-xs text-[#6E5038]/75">
                Semua permohonan peminjaman mahasiswa telah selesai diproses.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F1E3]">
                  <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-4">Mahasiswa (NIM)</th>
                    <th className="py-3 px-4">Judul Buku</th>
                    <th className="py-3 px-4">Stok Tersedia</th>
                    <th className="py-3 px-4">Waktu Permohonan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
                  {pendingQueue.slice(0, 5).map((q) => (
                    <tr key={q.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <strong className="text-[#5A3E28] block">{q.student_name}</strong>
                        <span className="text-[10px] text-[#79543D]/60 font-mono">
                          {q.student_nim}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#5A3E28]">{q.book_title}</p>
                        <span className="text-[10px] text-[#79543D]/60 font-mono">
                          ISBN: {q.isbn}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {q.stock_available > 0 ? (
                          <Badge variant="sage">{q.stock_available} Tersedia</Badge>
                        ) : (
                          <Badge variant="terracotta">Stok Habis</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#6E5038]">
                        {new Date(q.requested_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href="/dashboard/pegawai/circulation"
                          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-[#7B9663] hover:bg-[#6D8657] text-white font-bold text-[11px] shadow-[0_2px_0_#5C7348] transition-all active:translate-y-0.5"
                        >
                          Verifikasi
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}