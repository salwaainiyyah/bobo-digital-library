import DashboardShell from '@/components/layout/DashboardShell';
import CirculationDesk from '@/components/circulation/CirculationDesk';
import { requireRole } from '@/lib/auth/permissions';
import {
  getCirculationPendingQueue,
  getCirculationActiveLoans,
  getCirculationPendingRenewals,
} from '@/lib/queries/loans';
import { getAllUnpaidFines } from '@/lib/queries/fines';
import { ROLES } from '@/lib/constants';

export const revalidate = 0;

export default async function PegawaiCirculationPage() {
  const user = await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);

  const [pendingQueue, activeLoans, pendingRenewals, unpaidFines] = await Promise.all([
    getCirculationPendingQueue(),
    getCirculationActiveLoans(''),
    getCirculationPendingRenewals(),
    getAllUnpaidFines(),
  ]);

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        {/* Header Banner */}
        <section className="rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] p-6 sm:p-8 shadow-[0_6px_20px_rgba(92,65,42,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43] mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7B9663]" />
            <span>Meja Layanan Fisik</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#5A3E28]">
            Meja Sirkulasi &amp; Transaksi Pustaka
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1 max-w-3xl">
            Pusat kendali persetujuan peminjaman bertingkat, konfirmasi pengembalian fisik, evaluasi perpanjangan, dan pencatatan kasir denda keterlambatan.
          </p>
        </section>

        {/* Client Interactive Circulation Desk */}
        <CirculationDesk
          pendingQueue={pendingQueue}
          activeLoans={activeLoans}
          pendingRenewals={pendingRenewals}
          unpaidFines={unpaidFines}
        />
      </div>
    </DashboardShell>
  );
}