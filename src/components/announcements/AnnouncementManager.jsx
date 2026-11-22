'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import {
  createAnnouncementAction,
  updateAnnouncementAction,
  deleteAnnouncementAction,
} from '@/app/actions/announcements';

export default function AnnouncementManager({ announcements }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modal Konfirmasi Hapus (Pengganti window.confirm)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
  });

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'LAYANAN',
    releaseAt: new Date().toISOString().split('T')[0],
    status: 'PUBLISHED',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  function openCreateModal() {
    setEditingItem(null);
    setForm({
      title: '',
      content: '',
      category: 'LAYANAN',
      releaseAt: new Date().toISOString().split('T')[0],
      status: 'PUBLISHED',
    });
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setForm({
      title: item.title,
      content: item.content,
      category: item.category,
      releaseAt: new Date(item.release_at).toISOString().split('T')[0],
      status: item.status,
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
    if (editingItem) {
      res = await updateAnnouncementAction(editingItem.id, formData);
    } else {
      res = await createAnnouncementAction(formData);
    }

    setIsLoading(false);

    if (res.success) {
      setModalOpen(false);
      setFeedback({
        type: 'success',
        text: editingItem
          ? 'Pengumuman berhasil diperbarui.'
          : 'Pengumuman baru berhasil diterbitkan.',
      });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menyimpan pengumuman.' });
    }
  }

  async function handleConfirmDelete() {
    if (!deleteModal.item) return;

    setIsLoading(true);
    setFeedback(null);

    const res = await deleteAnnouncementAction(deleteModal.item.id);
    setIsLoading(false);
    setDeleteModal({ isOpen: false, item: null });

    if (res.success) {
      setFeedback({ type: 'success', text: 'Pengumuman berhasil dihapus.' });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menghapus pengumuman.' });
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback */}
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
          <h2 className="font-editorial text-lg font-bold text-[#5A3E28]">
            Daftar Pengumuman Kampus
          </h2>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-[#7B9663] hover:bg-[#6D8657] text-white text-xs font-bold shadow-[0_3px_0_#5C7348] transition-all active:translate-y-0.5 cursor-pointer"
        >
          + Buat Pengumuman Baru
        </button>
      </div>

      {/* Tabel Pengumuman */}
      <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60">
        {announcements.length === 0 ? (
          <div className="p-10 text-center bg-[#F8F1E3] rounded-2xl border border-dashed border-[#DFC7A2]">
            <p className="text-xs font-medium text-[#6E5038]/75">
              Belum ada pengumuman yang diterbitkan. Klik tombol di atas untuk membuat warta baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F1E3]">
                <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4">Judul Pengumuman</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tanggal Rilis</th>
                  <th className="py-3 px-4">Status Publikasi</th>
                  <th className="py-3 px-4">Penulis</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
                {announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-[#5A3E28] block">{item.title}</strong>
                      <p className="text-[11px] text-[#6E5038]/75 line-clamp-1 mt-0.5">
                        {item.content}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          item.category === 'ACARA'
                            ? 'yellow'
                            : item.category === 'OPERASIONAL'
                            ? 'terracotta'
                            : 'sage'
                        }
                      >
                        {item.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-[#6E5038]">
                      {new Date(item.release_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === 'PUBLISHED' ? (
                        <Badge variant="sage">Published</Badge>
                      ) : (
                        <Badge variant="terracotta">Draft</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#6E5038]">{item.author_name || 'Staf'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="px-3 py-1.5 rounded-xl border border-[#DFC7A2] bg-[#FAF4E8] hover:bg-[#F1E4CD] text-[#5A3E28] font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ isOpen: true, item })}
                          className="px-3 py-1.5 rounded-xl border border-[#C96858]/35 bg-[#FBECE9] hover:bg-[#F6DCD6] text-[#8A3729] font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* MODAL FORM CREATE / EDIT PENGUMUMAN */}
      {mounted &&
        modalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-[#EEF4E6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7B9663]" />
                  <span>{editingItem ? 'Edit Pengumuman' : 'Publikasi Baru'}</span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  {editingItem ? `Edit: ${editingItem.title}` : 'Buat Pengumuman Baru'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                    Judul Pengumuman
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Contoh: Jadwal Pelayanan Meja Sirkulasi Semester Genap"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-sm text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Kategori
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    >
                      <option value="OPERASIONAL">OPERASIONAL</option>
                      <option value="LAYANAN">LAYANAN</option>
                      <option value="ACARA">ACARA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Status Publikasi
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    >
                      <option value="PUBLISHED">PUBLISHED (Tampil di Publik)</option>
                      <option value="DRAFT">DRAFT (Internal Saja)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                    Tanggal Rilis
                  </label>
                  <input
                    type="date"
                    required
                    value={form.releaseAt}
                    onChange={(e) => setForm({ ...form, releaseAt: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                    Isi Konten Berita
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Tuliskan detail pengumuman secara lengkap di sini..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

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
                    {isLoading ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Terbitkan'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL KONFIRMASI HAPUS PENGUMUMAN (PENGGANTI BROWSER CONFIRM) */}
      {mounted &&
        deleteModal.isOpen &&
        deleteModal.item &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C96858]/35 bg-[#FBECE9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A84A3B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C96858]" />
                  <span>Konfirmasi Penghapusan</span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  Hapus Pengumuman Ini?
                </h3>

                <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1.5 leading-relaxed">
                  Pengumuman yang dihapus tidak akan tampil lagi di papan warta kampus. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAD5B5] bg-[#FAF4E8] p-4 space-y-1.5 text-xs">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                  Judul Warta
                </span>
                <p className="font-bold text-[#5A3E28]">{deleteModal.item.title}</p>
                <span className="block text-[11px] text-[#6E5038]/75">
                  Kategori: {deleteModal.item.category} · Status: {deleteModal.item.status}
                </span>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, item: null })}
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
                  {isLoading ? 'Menghapus...' : 'Ya, Hapus Pengumuman'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}