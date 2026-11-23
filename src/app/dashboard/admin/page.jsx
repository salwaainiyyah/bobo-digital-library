import DashboardShell from '@/components/layout/DashboardShell';
import { requireRole } from '@/lib/auth/permissions';
import { getAdminStats } from '@/lib/queries/stats';
import { ROLES } from '@/lib/constants';

export const revalidate = 0;

function AdminStatIcon({ type }) {
  switch (type) {
    case 'titles':
      return (
        <svg className="h-5 w-5 text-[#556B43]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'copies':
      return (
        <svg className="h-5 w-5 text-[#79543D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case 'students':
      return (
        <svg className="h-5 w-5 text-[#9A6B19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      );
    case 'loans':
      return (
        <svg className="h-5 w-5 text-[#4B6F82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    case 'paid':
      return (
        <svg className="h-5 w-5 text-[#556B43]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5 text-[#C96858]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
  }
}

export default async function AdminDashboardPage() {
  const user = await requireRole(ROLES.ADMIN);
  const stats = await getAdminStats();

  const adminStats = [
    {
      title: 'Total Judul Buku',
      value: `${stats.totalTitles} Judul`,
      subtitle: 'Katalog buku aktif di perpustakaan',
      iconType: 'titles',
      valueColor: 'text-[#556B43]',
      iconBox: 'border-[#8BA372]/40 bg-[#EEF4E6]',
    },
    {
      title: 'Total Eksemplar Fisik',
      value: `${stats.totalCopies} Buku`,
      subtitle: 'Akumulasi stok fisik seluruh judul',
      iconType: 'copies',
      valueColor: 'text-[#79543D]',
      iconBox: 'border-[#D8B480]/45 bg-[#F8EFE2]',
    },
    {
      title: 'Mahasiswa Terdaftar',
      value: `${stats.totalStudents} Akun`,
      subtitle: 'Anggota aktif perpustakaan',
      iconType: 'students',
      valueColor: 'text-[#9A6B19]',
      iconBox: 'border-[#E2B15B]/40 bg-[#FFF6DF]',
    },
    {
      title: 'Transaksi Aktif',
      value: `${stats.activeLoans} Peminjaman`,
      subtitle: 'Buku yang sedang beredar di kampus',
      iconType: 'loans',
      valueColor: 'text-[#4B6F82]',
      iconBox: 'border-[#9BB9C9]/45 bg-[#EBF3F7]',
    },
    {
      title: 'Denda Telah Lunas',
      value: `Rp ${stats.totalFinesPaid.toLocaleString('id-ID')}`,
      subtitle: 'Penerimaan kas denda keterlambatan',
      iconType: 'paid',
      valueColor: 'text-[#556B43]',
      iconBox: 'border-[#8BA372]/40 bg-[#EEF4E6]',
    },
    {
      title: 'Denda Tertunggak',
      value: `Rp ${stats.totalFinesUnpaid.toLocaleString('id-ID')}`,
      subtitle: 'Piutang denda yang belum diselesaikan',
      iconType: 'unpaid',
      valueColor: 'text-[#C96858]',
      iconBox: 'border-[#C96858]/30 bg-[#FBECE9]',
    },
  ];

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        {/* Header Banner */}
        <section className="relative overflow-hidden rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] p-6 sm:p-8 shadow-[0_6px_20px_rgba(92,65,42,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C96858]/35 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A84A3B] mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C96858]" />
            <span>Pusat Pengendali Sistem</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#5A3E28]">
            Dashboard Utama Administrator
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1 max-w-3xl">
            Statistik agregat multi-tabel, pengelolaan akun pengguna, master kategori, dan pemantauan riwayat sirkulasi seluruh kampus.
          </p>
        </section>

        {/* Agregat Statistik Sistem */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminStats.map((stat) => (
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
                <AdminStatIcon type={stat.iconType} />
              </div>
            </div>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}