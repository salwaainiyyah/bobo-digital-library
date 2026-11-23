import DashboardShell from '@/components/layout/DashboardShell';
import UserManager from '@/components/users/UserManager';
import { requireRole } from '@/lib/auth/permissions';
import { getAllUsers } from '@/lib/queries/users';
import { ROLES } from '@/lib/constants';

export const revalidate = 0;

export default async function AdminUsersPage() {
  const admin = await requireRole(ROLES.ADMIN);
  const users = await getAllUsers();

  return (
    <DashboardShell user={admin}>
      <div className="space-y-6">
        {/* Header Banner */}
        <section className="rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] p-6 sm:p-8 shadow-[0_6px_20px_rgba(92,65,42,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C96858]/35 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A84A3B] mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C96858]" />
            <span>CMS Akses Pengguna</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#5A3E28]">
            Manajemen Akun &amp; Hak Akses
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1 max-w-3xl">
            Kelola akun Admin, Pegawai Perpustakaan, dan Mahasiswa. Proteksi relasi data memastikan akun dengan transaksi aktif tidak dapat dihapus sembarangan.
          </p>
        </section>

        <UserManager initialUsers={users} currentAdminId={admin.id} />
      </div>
    </DashboardShell>
  );
}