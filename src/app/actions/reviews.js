'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/permissions';
import { createReview } from '@/lib/queries/reviews';
import { ROLES } from '@/lib/constants';

export async function submitReviewAction(loanId, rating, comment) {
  try {
    const user = await requireRole(ROLES.MAHASISWA);
    const result = await createReview({
      loanId: parseInt(loanId, 10),
      studentId: user.id,
      rating,
      comment,
    });

    revalidatePath('/catalog');
    revalidatePath('/dashboard/mahasiswa/history');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
