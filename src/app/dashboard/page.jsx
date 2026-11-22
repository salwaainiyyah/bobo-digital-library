import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/permissions';
import { ROLES } from '@/lib/constants';

export default async function DashboardDispatcherPage() {
  const user = await requireUser();

  if (user.role === ROLES.ADMIN) {
    redirect('/dashboard/admin');
  } else if (user.role === ROLES.PEGAWAI) {
    redirect('/dashboard/pegawai');
  } else if (user.role === ROLES.MAHASISWA) {
    redirect('/dashboard/mahasiswa');
  }

  redirect('/login');
}
