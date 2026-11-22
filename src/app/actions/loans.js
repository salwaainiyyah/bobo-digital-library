'use server';

import { revalidatePath } from 'next/cache';
import { requireUser, requireRole } from '@/lib/auth/permissions';
import { requestLoan, approveLoan, rejectLoan, returnLoan } from '@/lib/services/loan-service';
import { ROLES } from '@/lib/constants';

export async function requestLoanAction(bookId) {
  try {
    const user = await requireRole(ROLES.MAHASISWA);
    const result = await requestLoan(user.id, parseInt(bookId, 10));

    revalidatePath('/catalog');
    revalidatePath(`/catalog/${bookId}`);
    revalidatePath('/dashboard/mahasiswa');
    revalidatePath('/dashboard/mahasiswa/loans');
    revalidatePath('/dashboard/pegawai/circulation');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function approveLoanAction(loanId) {
  try {
    const user = await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);
    const result = await approveLoan(parseInt(loanId, 10), user.id);

    revalidatePath('/catalog');
    revalidatePath('/dashboard/pegawai/circulation');
    revalidatePath('/dashboard/mahasiswa/loans');
    revalidatePath('/dashboard/admin/transactions');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function rejectLoanAction(loanId, reason) {
  try {
    const user = await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);
    const result = await rejectLoan(parseInt(loanId, 10), user.id, reason);

    revalidatePath('/dashboard/pegawai/circulation');
    revalidatePath('/dashboard/mahasiswa/loans');
    revalidatePath('/dashboard/mahasiswa/history');
    revalidatePath('/dashboard/admin/transactions');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function returnLoanAction(loanId) {
  try {
    const user = await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);
    const result = await returnLoan(parseInt(loanId, 10), user.id);

    revalidatePath('/catalog');
    revalidatePath('/dashboard/pegawai/circulation');
    revalidatePath('/dashboard/mahasiswa/loans');
    revalidatePath('/dashboard/mahasiswa/history');
    revalidatePath('/dashboard/mahasiswa/fines');
    revalidatePath('/dashboard/admin/transactions');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
