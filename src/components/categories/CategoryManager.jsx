'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/app/actions/categories';

export default function CategoryManager({ categories }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modal Konfirmasi Hapus Kategori (Pengganti window.confirm)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    category: null,
  });

  // Modal Peringatan Kategori Masih Memiliki Buku (Pengganti window.alert)
  const [blockedModal, setBlockedModal] = useState({
    isOpen: false,
    name: '',
    code: '',
    bookCount: 0,
  });

  const [form, setForm] = useState({
    name: '',
    classificationCode: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  function openCreateModal() {
    setEditingCategory(null);
    setForm({
      name: '',
      classificationCode: '',
      description: '',
      isActive: true,
    });
    setModalOpen(true);
  }

  function openEditModal(c) {
    setEditingCategory(c);
    setForm({
      name: c.name,
      classificationCode: c.classification_code,
      description: c.description || '',
      isActive: c.is_active,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val);
    });

    let res;
    if (editingCategory) {
      res = await updateCategoryAction(editingCategory.id, formData);
    } else {
      res = await createCategoryAction(formData);
    }

    setIsLoading(false);

    if (res.success) {
      setModalOpen(false);
      setFeedback({
        type: 'success',
        text: editingCategory ? 'Kategori berhasil diperbarui.' : 'Kategori baru berhasil dibuat.',
      });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menyimpan kategori.' });
    }
  }

  function handleDeleteClick(category) {
    const count = parseInt(category.book_count, 10) || 0;
    if (count > 0) {
      setBlockedModal({
        isOpen: true,
        name: category.name,
        code: category.classification_code,
        bookCount: count,
      });
      return;
    }

    setDeleteModal({ isOpen: true, category });
  }

  async function handleConfirmDelete() {
    if (!deleteModal.category) return;

    setIsLoading(true);
    setFeedback(null);

    const res = await deleteCategoryAction(deleteModal.category.id);
    setIsLoading(false);
    setDeleteModal({ isOpen: false, category: null });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message || 'Kategori berhasil dihapus.' });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menghapus kategori.' });
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`rounded-[22px] border-2 px-5 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-2xs ${
            feedback.type === 'success'
              ? 'bg-[#EEF4E6] border-[#929D75] text-[#425732]'
              : 'bg-[#FDF1EE] border-[#C96858] text-[#8A3729]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                feedback.type === 'success' ? 'bg-[#6F8859]' : 'bg-[#C96858]'
              }`}
            />
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            aria-label="Tutup pemberitahuan"
            className="rounded-lg p-1 hover:bg-black/5 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Top Action */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#7B9663]" />
          <h2 className="font-editorial text-lg font-bold text-[#5A3E28]">Daftar Kategori Buku</h2>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-[#7B9663] hover:bg-[#6D8657] text-white text-xs font-bold shadow-[0_3px_0_#5C7348] transition-all active:translate-y-0.5 cursor-pointer"
        >
          + Tambah Kategori Baru
        </button>
      </div>

      {/* Tabel Kategori */}
      <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60">
        {categories.length === 0 ? (
          <div className="p-10 text-center bg-[#F8F1E3] rounded-2xl border border-dashed border-[#DFC7A2]">
            <p className="text-xs font-medium text-[#6E5038]/75">
              Belum ada master kategori buku yang terdaftar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F1E3]">
                <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4">Nama Kategori</th>
                  <th className="py-3 px-4">Kode Klasifikasi</th>
                  <th className="py-3 px-4">Deskripsi Singkat</th>
                  <th className="py-3 px-4">Jumlah Buku</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
                {categories.map((c) => {
                  const hasBooks = (parseInt(c.book_count, 10) || 0) > 0;

                  return (
                    <tr key={c.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <strong className="text-[#5A3E28] text-sm block">{c.name}</strong>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono bg-[#FAF4E8] border border-[#DFC7A2] text-[#5A3E28] px-2.5 py-0.5 rounded-lg font-bold text-[11px]">
                          {c.classification_code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#6E5038]/80 max-w-xs">
                        <p className="line-clamp-2">{c.description || '-'}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#5A3E28]">
                        {c.book_count} Judul
                      </td>
                      <td className="py-3.5 px-4">
                        {c.is_active ? (
                          <Badge variant="sage">Aktif</Badge>
                        ) : (
                          <Badge variant="terracotta">Nonaktif</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(c)}
                            className="px-3 py-1.5 rounded-xl border border-[#DFC7A2] bg-[#FAF4E8] hover:bg-[#F1E4CD] text-[#5A3E28] font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(c)}
                            className={`px-3 py-1.5 rounded-xl border font-bold text-[11px] transition-colors cursor-pointer ${
                              hasBooks
                                ? 'border-[#E2B15B]/50 bg-[#FFF6DF] hover:bg-[#FCEEC7] text-[#9A6B19]'
                                : 'border-[#C96858]/35 bg-[#FBECE9] hover:bg-[#F6DCD6] text-[#8A3729]'
                            }`}
                            title={
                              hasBooks
                                ? 'Kategori masih memiliki buku terhubung'
                                : 'Hapus Kategori'
                            }
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* MODAL FORM CREATE / EDIT KATEGORI */}
      {mounted &&
        modalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-[#EEF4E6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7B9663]" />
                  <span>{editingCategory ? 'Edit Kategori' : 'Kategori Baru'}</span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  {editingCategory ? `Edit: ${editingCategory.name}` : 'Tambah Kategori Buku'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                    Nama Kategori
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Sastra & Budaya Bugis-Makassar"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-sm text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                    Kode Klasifikasi (Unik)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.classificationCode}
                    onChange={(e) => setForm({ ...form, classificationCode: e.target.value })}
                    placeholder="Contoh: SBB-002"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] font-mono text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Keterangan cakupan buku dalam kategori ini..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

                {editingCategory && (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="catActive"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="rounded text-[#7B9663]"
                    />
                    <label htmlFor="catActive" className="text-xs font-semibold text-[#5A3E28]">
                      Status Kategori Aktif
                    </label>
                  </div>
                )}

                <div className="flex gap-2.5 pt-3 border-t border-[#EAD5B5]/70">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-[#E4CEAD] bg-[#FFFDF9] hover:bg-[#F8F1E3] text-xs font-bold text-[#5A3E28] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-[#7B9663] hover:bg-[#6D8657] text-white text-xs font-bold shadow-[0_3px_0_#5C7348] transition-all active:translate-y-0.5 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? 'Menyimpan...' : editingCategory ? 'Simpan Perubahan' : 'Buat Kategori'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL KONFIRMASI HAPUS KATEGORI (PENGGANTI BROWSER CONFIRM) */}
      {mounted &&
        deleteModal.isOpen &&
        deleteModal.category &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C96858]/35 bg-[#FBECE9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A84A3B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C96858]" />
                  <span>Konfirmasi Penghapusan</span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  Hapus Kategori Ini?
                </h3>

                <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1.5 leading-relaxed">
                  Kategori tidak memiliki judul buku terhubung dan akan dihapus permanen dari daftar master klasifikasi.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAD5B5] bg-[#FAF4E8] p-4 space-y-1.5 text-xs">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                  Nama &amp; Kode Kategori
                </span>
                <p className="font-bold text-[#5A3E28]">{deleteModal.category.name}</p>
                <p className="font-mono text-[11px] text-[#79543D]/75">
                  Kode: {deleteModal.category.classification_code}
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, category: null })}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-[#E4CEAD] bg-[#FFFDF9] hover:bg-[#F8F1E3] text-xs font-bold text-[#5A3E28] cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-[#C96858] hover:bg-[#b25546] text-white text-xs font-bold shadow-[0_3px_0_#944134] transition-all active:translate-y-0.5 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? 'Menghapus...' : 'Ya, Hapus Kategori'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL PERINGATAN KATEGORI MASIH MEMILIKI BUKU (PENGGANTI BROWSER ALERT) */}
      {mounted &&
        blockedModal.isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E2B15B]/50 bg-[#FFF6DF] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A6B19]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D99B26]" />
                  <span>Proteksi Relasi Pustaka</span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  Kategori Tidak Dapat Dihapus
                </h3>

                <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1.5 leading-relaxed">
                  Kategori <strong className="text-[#5A3E28]">{blockedModal.name}</strong> (
                  <span className="font-mono">{blockedModal.code}</span>) masih menampung{' '}
                  <strong className="text-[#9A6B19]">{blockedModal.bookCount} judul buku</strong>. Pindahkan atau arsipkan buku terkait terlebih dahulu sebelum menghapus kategori.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setBlockedModal({ isOpen: false, name: '', code: '', bookCount: 0 })
                }
                className="w-full py-2.5 px-4 rounded-2xl bg-[#7B9663] hover:bg-[#6D8657] text-white text-xs font-bold shadow-[0_3px_0_#5C7348] transition-all cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}