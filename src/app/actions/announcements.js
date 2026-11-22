'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/permissions';
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/lib/queries/announcements';
import { ROLES } from '@/lib/constants';

export async function createAnnouncementAction(formData) {
  try {
    const user = await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);

    const title = formData.get('title')?.trim();
    const content = formData.get('content')?.trim();
    const category = formData.get('category')?.trim();
    const releaseAt = formData.get('releaseAt')?.trim();
    const status = formData.get('status')?.trim() || 'DRAFT';

    if (!title || !content || !category) {
      return { success: false, error: 'Judul, isi, dan kategori pengumuman wajib diisi.' };
    }

    const result = await createAnnouncement({
      title,
      content,
      category,
      releaseAt,
      status,
      createdBy: user.id,
    });

    revalidatePath('/');
    revalidatePath('/dashboard/pegawai/announcements');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateAnnouncementAction(id, formData) {
  try {
    await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);

    const title = formData.get('title')?.trim();
    const content = formData.get('content')?.trim();
    const category = formData.get('category')?.trim();
    const releaseAt = formData.get('releaseAt')?.trim();
    const status = formData.get('status')?.trim() || 'DRAFT';

    const result = await updateAnnouncement(parseInt(id, 10), {
      title,
      content,
      category,
      releaseAt,
      status,
    });

    revalidatePath('/');
    revalidatePath(`/announcements/${id}`);
    revalidatePath('/dashboard/pegawai/announcements');

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteAnnouncementAction(id) {
  try {
    await requireRole([ROLES.PEGAWAI, ROLES.ADMIN]);
    await deleteAnnouncement(parseInt(id, 10));

    revalidatePath('/');
    revalidatePath('/dashboard/pegawai/announcements');

    return { success: true, message: 'Pengumuman berhasil dihapus.' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
