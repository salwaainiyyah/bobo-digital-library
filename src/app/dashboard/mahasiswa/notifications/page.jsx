import DashboardShell from '@/components/layout/DashboardShell';
import StudentNotificationList from '@/components/dashboard/StudentNotificationList';
import { requireRole } from '@/lib/auth/permissions';
import { ROLES } from '@/lib/constants';

export const revalidate = 0;

export default async function MahasiswaNotificationsPage() {
  const user = await requireRole(ROLES.MAHASISWA);

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        <section className="rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] p-6 sm:p-8 shadow-[0_6px_20px_rgba(92,65,42,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43] mb-2">
            <span>🔔</span>
            <span>Pusat Notifikasi</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#5A3E28]">
            Notifikasi Saya
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5038]/80 mt-1 max-w-2xl">
            Pantau status peminjaman, perpanjangan, dan denda dari petugas perpustakaan.
          </p>
        </section>

        <StudentNotificationList userId={user.id} />
      </div>
    </DashboardShell>
  );
}