'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/permissions';
import { verifySession } from '@/lib/auth/session';
import { createUser, updateUser, deleteUser, resetUserPassword } from '@/lib/queries/users';
import { ROLES } from '@/lib/constants';
import { validatePasswordChangeInput } from '@/lib/validation';

export async function createUserAction(formData) {
  try {
    await requireRole(ROLES.ADMIN);

    const fullName = formData.get('fullName')?.trim();
    const email = formData.get('email')?.trim();
    const password = formData.get('password');
    const role = formData.get('role')?.trim();
    const identityNumber = formData.get('identityNumber')?.trim();

    if (!fullName || !email || !password || !role) {
      return { success: false, error: 'Nama, email, password, dan peran pengguna wajib diisi.' };
    }

    const result = await createUser({
      fullName,
      email,
      password,
      role,
      identityNumber,
    });

    revalidatePath('/dashboard/admin/users');
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateUserAction(id, formData) {
  try {
    const admin = await requireRole(ROLES.ADMIN);

    const fullName = formData.get('fullName')?.trim();
    const email = formData.get('email')?.trim();
    const role = formData.get('role')?.trim();
    const identityNumber = formData.get('identityNumber')?.trim();
    const isActive = formData.get('isActive') === 'true' || formData.get('isActive') === 'on';

    const result = await updateUser(
      parseInt(id, 10),
      { fullName, email, role, identityNumber, isActive },
      admin.id
    );

    revalidatePath('/dashboard/admin/users');
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteUserAction(id) {
  try {
    const admin = await requireRole(ROLES.ADMIN);
    const result = await deleteUser(parseInt(id, 10), admin.id);

    revalidatePath('/dashboard/admin/users');
    return { success: true, message: result.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function resetUserPasswordAction(id, formData) {
  try {
    const session = await verifySession();
    if (!session) {
      return { success: false, error: 'Sesi Anda telah berakhir. Silakan login kembali.' };
    }

    if (session.user.role !== ROLES.ADMIN) {
      return {
        success: false,
        error: 'Akses ditolak. Hanya Administrator yang memiliki izin mengubah password akun.',
      };
    }

    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    const validationError = validatePasswordChangeInput(newPassword, confirmPassword);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const updatedUser = await resetUserPassword(id, newPassword, {
      currentAdminId: session.user.id,
      currentSessionId: session.sessionId,
    });

    revalidatePath('/dashboard/admin/users');
    return {
      success: true,
      message: `Password akun "${updatedUser.full_name}" berhasil diperbarui.`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Gagal memperbarui password akun pengguna.',
    };
  }
}