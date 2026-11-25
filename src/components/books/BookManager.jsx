'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import Portal from '@/components/ui/Portal';
import { FeedbackToast } from '@/components/ui/FeedbackBanner';
import {
  createBookAction,
  updateBookAction,
  deleteBookAction,
  restoreBookAction,
} from '@/app/actions/books';

export default function BookManager({ books, categories }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    book: null,
  });

  const [form, setForm] = useState({
    title: '',
    isbn: '',
    author: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    categoryId: categories[0]?.id || '',
    stockTotal: 5,
    loanDurationDays: 7,
    finePerDay: 1000,
    coverUrl: '',
    isActive: true,
  });

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  function resetCoverSelection(existingUrl = '') {
    setCoverFile(null);
    setCoverPreview(existingUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function openCreateModal() {
    setEditingBook(null);
    setForm({
      title: '',
      isbn: '',
      author: '',
      publisher: '',
      publicationYear: new Date().getFullYear(),
      categoryId: categories[0]?.id || '',
      stockTotal: 5,
      loanDurationDays: 7,
      finePerDay: 1000,
      coverUrl: '',
      isActive: true,
    });
    resetCoverSelection('');
    setModalOpen(true);
  }

  function openEditModal(book) {
    setEditingBook(book);
    setForm({
      title: book.title,
      isbn: book.isbn,
      author: book.author,
      publisher: book.publisher,
      publicationYear: book.publication_year,
      categoryId: book.category_id,
      stockTotal: book.stock_total,
      loanDurationDays: book.loan_duration_days,
      finePerDay: parseFloat(book.fine_per_day),
      coverUrl: book.cover_url || '',
      isActive: book.is_active,
    });
    resetCoverSelection(book.cover_url || '');
    setModalOpen(true);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setCoverFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
  }

  function handleClearSelectedFile() {
    let fallbackUrl = form.coverUrl || '';
    if (editingBook) {
      fallbackUrl = editingBook.cover_url || '';
    }
    resetCoverSelection(fallbackUrl);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val);
    });

    if (coverFile) {
      formData.append('coverFile', coverFile);
    }

    let res;
    if (editingBook) {
      res = await updateBookAction(editingBook.id, formData);
    } else {
      res = await createBookAction(formData);
    }

    setIsLoading(false);

    if (res.success) {
      setModalOpen(false);
      resetCoverSelection('');

      setFeedback({
        type: 'success',
        text: editingBook ? 'Data buku berhasil diperbarui.' : 'Buku baru berhasil ditambahkan.',
      });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menyimpan data buku.' });
    }
  }

  async function handleConfirmDelete() {
    if (!deleteModal.book) {
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    const res = await deleteBookAction(deleteModal.book.id);
    setIsLoading(false);
    setDeleteModal({ isOpen: false, book: null });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message || 'Buku berhasil dihapus.' });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menghapus buku.' });
    }
  }

  async function handleRestoreBook(book) {
    setIsLoading(true);
    setFeedback(null);

    const res = await restoreBookAction(book.id);
    setIsLoading(false);

    if (res.success) {
      setFeedback({
        type: 'success',
        text: res.message || `Buku "${book.title}" berhasil dipulihkan ke katalog.`,
      });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal memulihkan buku.' });
    }
  }

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      !search.trim() ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());

    const matchCategory = !selectedCategory || b.category_id === parseInt(selectedCategory, 10);
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <FeedbackToast feedback={feedback} onClose={() => setFeedback(null)} />

      <div className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-5 shadow-[0_6px_0_#EAD5B5]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, penulis, ISBN..."
            className="w-full sm:w-64 px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] placeholder:text-[#79543D]/45 focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-52 px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#7B9663] hover:bg-[#6D8657] text-white text-xs font-bold shadow-[0_3px_0_#5C7348] transition-all active:translate-y-0.5 cursor-pointer shrink-0"
        >
          + Tambah Judul Buku
        </button>
      </div>

      <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60 space-y-4">
        <div className="flex items-center justify-between text-xs text-[#6E5038]/80">
          <span>
            Menampilkan <strong className="text-[#5A3E28]">{filteredBooks.length}</strong> koleksi buku
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F1E3]">
              <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4 min-w-[230px]">Sampul &amp; Judul Buku</th>
                <th className="py-3 px-4 w-[160px] whitespace-nowrap">Kategori</th>
                <th className="py-3 px-4 w-[155px] whitespace-nowrap">ISBN</th>
                <th className="py-3 px-4 w-[125px] whitespace-nowrap">Stok (Tersedia / Total)</th>
                <th className="py-3 px-4 w-[130px] whitespace-nowrap">Durasi &amp; Tarif Denda</th>
                <th className="py-3 px-4 w-[108px] whitespace-nowrap">Status</th>
                <th className="py-3 px-4 w-[184px] whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-12 shrink-0 overflow-hidden rounded-lg border border-[#DFC7A2] bg-[#FAF4E8] flex items-center justify-center">
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="font-serif text-[10px] font-bold text-[#79543D]/60">
                            ᨅᨚ
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <strong className="text-[#5A3E28] block">{book.title}</strong>
                        <span className="text-[11px] text-[#6E5038]/75">
                          {book.author} ({book.publication_year})
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 w-[160px]">
                    <span className="font-semibold text-[#556B43]">{book.category_name}</span>
                  </td>
                  <td className="py-3.5 px-4 w-[155px] font-mono text-[11px] text-[#6E5038]/75 whitespace-nowrap">
                    {book.isbn}
                  </td>
                  <td className="py-3.5 px-4 w-[125px] whitespace-nowrap">
                    <span className="font-bold text-sm text-[#5A3E28]">{book.stock_available}</span>
                    <span className="text-[#6E5038]/55 text-xs"> / {book.stock_total}</span>
                  </td>
                  <td className="py-3.5 px-4 w-[130px] text-[11px] whitespace-nowrap">
                    <div className="text-[#5A3E28] font-medium">{book.loan_duration_days} hari</div>
                    <div className="text-[#C96858]">
                      Rp {parseFloat(book.fine_per_day).toLocaleString('id-ID')}/hr
                    </div>
                  </td>
                  <td className="py-3.5 px-4 w-[108px] whitespace-nowrap">
                    <span className="inline-flex w-[84px]">
                      {book.is_active ? (
                        <Badge variant="sage">Aktif</Badge>
                      ) : (
                        <Badge variant="terracotta">Nonaktif</Badge>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 w-[184px] whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(book)}
                        className="w-[62px] py-1.5 rounded-xl border border-[#DFC7A2] bg-[#FAF4E8] hover:bg-[#F1E4CD] text-[#5A3E28] font-bold text-[11px] text-center transition-colors cursor-pointer"
                      >
                        Edit
                      </button>

                      {book.is_active ? (
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ isOpen: true, book })}
                          className="w-[84px] py-1.5 rounded-xl border border-[#C96858]/35 bg-[#FBECE9] hover:bg-[#F6DCD6] text-[#8A3729] font-bold text-[11px] text-center transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRestoreBook(book)}
                          disabled={isLoading}
                          className="w-[84px] py-1.5 rounded-xl border border-[#8BA372]/45 bg-[#EEF4E6] hover:bg-[#E1ECD4] text-[#425732] font-bold text-[11px] text-center transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Pulihkan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs overflow-y-auto">
            <div className="w-full max-w-xl rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-4 my-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-[#EEF4E6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7B9663]" />
                  <span>{editingBook ? 'Edit Data Koleksi' : 'Koleksi Baru'}</span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  {editingBook ? `Edit: ${editingBook.title}` : 'Tambah Judul Buku Baru'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                    Judul Buku
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Contoh: I La Galigo: Epik Mitos Terbesar Bugis"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-sm text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Nomor ISBN (Unik)
                    </label>
                    <input
                      type="text"
                      required
                      value={form.isbn}
                      onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                      placeholder="978-602-03-0101-1"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] font-mono text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Kategori Buku
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Pengarang / Penulis
                    </label>
                    <input
                      type="text"
                      required
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="Contoh: Dr. Christian Pelras"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Penerbit
                    </label>
                    <input
                      type="text"
                      required
                      value={form.publisher}
                      onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                      placeholder="Contoh: Unhas Press"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Tahun Terbit
                    </label>
                    <input
                      type="number"
                      required
                      min={1500}
                      max={2100}
                      value={form.publicationYear}
                      onChange={(e) =>
                        setForm({ ...form, publicationYear: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Jumlah Total Stok
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={form.stockTotal}
                      onChange={(e) =>
                        setForm({ ...form, stockTotal: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Durasi Pinjam (Hari)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={form.loanDurationDays}
                      onChange={(e) =>
                        setForm({ ...form, loanDurationDays: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                    Tarif Denda per Hari (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="500"
                    value={form.finePerDay}
                    onChange={(e) => setForm({ ...form, finePerDay: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

                <div className="rounded-2xl border border-[#DFC7A2] bg-[#FAF4E8] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider">
                      Gambar Sampul Buku (Dari Perangkat)
                    </label>
                    <span className="text-[10px] font-semibold text-[#6E5038]/70">
                      JPG, PNG, WEBP (Maks. 3 MB)
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-22 shrink-0 overflow-hidden rounded-xl border-2 border-[#DFC7A2] bg-[#FFFDF9] flex items-center justify-center shadow-2xs">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Pratinjau sampul"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-serif text-xs font-bold text-[#79543D]/45">
                          ᨅᨚᨅᨚ
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl border border-[#DFC7A2] bg-[#FFFDF9] hover:bg-[#F1E4CD] text-[#5A3E28] font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          {coverFile ? 'Ganti Berkas Gambar' : 'Pilih Berkas Gambar'}
                        </button>

                        {coverFile && (
                          <button
                            type="button"
                            onClick={handleClearSelectedFile}
                            className="px-3 py-2 rounded-xl border border-[#C96858]/35 bg-[#FBECE9] hover:bg-[#F6DCD6] text-[#8A3729] font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Batal Pilih Berkas
                          </button>
                        )}
                      </div>

                      {coverFile && (
                        <p className="text-[11px] text-[#556B43] font-semibold truncate">
                          Berkas terpilih: {coverFile.name} ({(coverFile.size / 1024).toFixed(0)} KB)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {editingBook && (
                  <div className="pt-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="rounded text-[#7B9663]"
                    />
                    <label htmlFor="isActive" className="text-xs font-semibold text-[#5A3E28]">
                      Status Buku Aktif (Tampil di Katalog Publik)
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
                    {isLoading ? 'Menyimpan...' : editingBook ? 'Simpan Perubahan' : 'Tambah Buku'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {deleteModal.isOpen &&
        deleteModal.book && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C96858]/35 bg-[#FBECE9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A84A3B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C96858]" />
                  <span>Penghapusan Koleksi</span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  Hapus Koleksi Buku Ini?
                </h3>

                <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1.5 leading-relaxed">
                  Buku yang belum memiliki riwayat peminjaman akan dihapus permanen. Jika sudah pernah dipinjam atau diulas, buku akan dinonaktifkan agar riwayat transaksi tetap terjaga.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAD5B5] bg-[#FAF4E8] p-4 space-y-2 text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                    Judul Buku
                  </span>
                  <p className="font-bold text-[#5A3E28] mt-0.5">{deleteModal.book.title}</p>
                </div>

                <div className="border-t border-[#EAD5B5]/70 pt-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                    Penulis &amp; ISBN
                  </span>
                  <p className="text-[#5A3E28] mt-0.5">
                    {deleteModal.book.author}{' '}
                    <span className="font-mono text-[11px] text-[#79543D]/70">
                      ({deleteModal.book.isbn})
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, book: null })}
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
                  {isLoading ? 'Menghapus...' : 'Ya, Hapus Buku'}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}