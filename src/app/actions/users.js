'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/permissions';
import { createUser, updateUser, deleteUser } from '@/lib/queries/users';
import { ROLES } from '@/lib/constants';

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
    const isActive = formData.get('isActive') === 'true' || formData.get('isActive') === 'on';

    const result = await updateUser(
      parseInt(id, 10),
      { fullName, email, role, isActive },
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
