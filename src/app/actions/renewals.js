'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/permissions';
import { requestRenewal, decideRenewal } from '@/lib/services/loan-service';
import { ROLES } from '@/lib/constants';

export async function requestRenewalAction(loanId) {
  try {
    const user = await requireRole(ROLES.MAHASISWA);
    const result = await requestRenewal(user.id, parseInt(loanId, 10));

    revalidatePath('/dashboard/mahasiswa/loans');
    revalidatePath('/dashboard/pegawai/circulation');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function decideRenewalAction(renewalId, decision, reason) {
  try {
    const user = await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);
    const result = await decideRenewal(parseInt(renewalId, 10), user.id, decision, reason);

    revalidatePath('/dashboard/pegawai/circulation');
    revalidatePath('/dashboard/mahasiswa/loans');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
