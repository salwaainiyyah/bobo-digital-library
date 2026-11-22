'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/permissions';
import { createCategory, updateCategory, deleteCategory } from '@/lib/queries/categories';
import { ROLES } from '@/lib/constants';

export async function createCategoryAction(formData) {
  try {
    await requireRole(ROLES.ADMIN);

    const name = formData.get('name')?.trim();
    const classificationCode = formData.get('classificationCode')?.trim();
    const description = formData.get('description')?.trim();

    if (!name || !classificationCode) {
      return { success: false, error: 'Nama dan kode klasifikasi kategori wajib diisi.' };
    }

    const result = await createCategory({ name, classificationCode, description });

    revalidatePath('/dashboard/admin/categories');
    revalidatePath('/catalog');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateCategoryAction(id, formData) {
  try {
    await requireRole(ROLES.ADMIN);

    const name = formData.get('name')?.trim();
    const classificationCode = formData.get('classificationCode')?.trim();
    const description = formData.get('description')?.trim();
    const isActive = formData.get('isActive') !== 'false';

    const result = await updateCategory(parseInt(id, 10), {
      name,
      classificationCode,
      description,
      isActive,
    });

    revalidatePath('/dashboard/admin/categories');
    revalidatePath('/catalog');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategoryAction(id) {
  try {
    await requireRole(ROLES.ADMIN);
    await deleteCategory(parseInt(id, 10));

    revalidatePath('/dashboard/admin/categories');
    revalidatePath('/catalog');

    return { success: true, message: 'Kategori berhasil dihapus.' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
