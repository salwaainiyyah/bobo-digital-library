'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/permissions';
import { payFine } from '@/lib/queries/fines';
import { ROLES } from '@/lib/constants';

export async function payFineAction(fineId, paymentMethod = 'Tunai', paymentNote = '') {
  try {
    const user = await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);
    const result = await payFine(parseInt(fineId, 10), user.id, paymentMethod, paymentNote);

    revalidatePath('/dashboard/pegawai/circulation');
    revalidatePath('/dashboard/mahasiswa/fines');
    revalidatePath('/dashboard/admin');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
