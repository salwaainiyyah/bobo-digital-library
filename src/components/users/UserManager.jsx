'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import ChangePasswordModal from '@/components/users/ChangePasswordModal';
import { createUserAction, updateUserAction, deleteUserAction } from '@/app/actions/users';

export default function UserManager({ initialUsers, currentAdminId }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [passwordModal, setPasswordModal] = useState({
    isOpen: false,
    targetUser: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    targetUser: null,
  });

  const [selfNoticeOpen, setSelfNoticeOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'mahasiswa',
    identityNumber: '',
    isActive: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [feedback]);

  function openCreateModal() {
    setEditingUser(null);
    setForm({
      fullName: '',
      email: '',
      password: '',
      role: 'mahasiswa',
      identityNumber: '',
      isActive: true,
    });
    setModalOpen(true);
  }

  function openEditModal(u) {
    setEditingUser(u);
    setForm({
      fullName: u.full_name,
      email: u.email,
      password: '',
      role: u.role,
      identityNumber: u.identity_number || '',
      isActive: u.is_active,
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
    if (editingUser) {
      res = await updateUserAction(editingUser.id, formData);
    } else {
      res = await createUserAction(formData);
    }

    setIsLoading(false);

    if (res.success) {
      setModalOpen(false);
      setFeedback({
        type: 'success',
        text: editingUser ? 'Data akun berhasil diperbarui.' : 'Akun baru berhasil dibuat.',
      });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal memproses data akun.' });
    }
  }

  function openPasswordModal(u) {
    setFeedback(null);
    setPasswordModal({ isOpen: true, targetUser: u });
  }

  function handleDeleteClick(u) {
    if (u.id === currentAdminId) {
      setSelfNoticeOpen(true);
      return;
    }

    setDeleteModal({ isOpen: true, targetUser: u });
  }

  async function handleConfirmDelete() {
    if (!deleteModal.targetUser) return;

    setIsLoading(true);
    setFeedback(null);

    const res = await deleteUserAction(deleteModal.targetUser.id);
    setIsLoading(false);
    setDeleteModal({ isOpen: false, targetUser: null });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message || 'Akun berhasil diproses.' });
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menghapus akun.' });
    }
  }

  const filteredUsers = initialUsers.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const term = search.toLowerCase();
    const matchSearch =
      !search.trim() ||
      u.full_name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.identity_number && u.identity_number.toLowerCase().includes(term));

    return matchRole && matchSearch;
  });

  const isEditingAdmin = editingUser?.role === 'admin';
  const isEditingSelf = editingUser?.id === currentAdminId;

  return (
    <div className="space-y-6">
      {mounted &&
        feedback &&
        createPortal(
          <div className="fixed top-5 right-5 z-[60] w-[calc(100%-2.5rem)] max-w-md animate-fade-in-down">
            <div
              role="alert"
              className={`rounded-[22px] border-2 px-4 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-[0_12px_28px_rgba(46,33,22,0.22)] ${
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
                className="rounded-lg p-1 hover:bg-black/5 transition-colors cursor-pointer shrink-0"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>,
          document.body
        )}

      <div className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-5 shadow-[0_6px_0_#EAD5B5]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, NIM..."
            className="w-full sm:w-64 px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] placeholder:text-[#79543D]/45 focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-44 px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
          >
            <option value="ALL">Semua Peran</option>
            <option value="admin">Admin</option>
            <option value="pegawai">Pegawai</option>
            <option value="mahasiswa">Mahasiswa</option>
          </select>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#79543D] hover:bg-[#5f402c] text-white text-xs font-bold shadow-[0_3px_0_#4A3122] transition-all active:translate-y-0.5 cursor-pointer shrink-0"
        >
          + Tambah Akun Baru
        </button>
      </div>

      <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60 space-y-4">
        <div className="flex items-center justify-between text-xs text-[#6E5038]/80">
          <span>
            Menampilkan <strong className="text-[#5A3E28]">{filteredUsers.length}</strong> akun pengguna
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F1E3]">
              <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4 min-w-[190px]">Nama Pengguna &amp; Email</th>
                <th className="py-3 px-4 w-[106px] whitespace-nowrap">Peran (Role)</th>
                <th className="py-3 px-4 w-[125px] whitespace-nowrap">No. Identitas / NIM</th>
                <th className="py-3 px-4 w-[145px] whitespace-nowrap">Aktivitas Pinjam</th>
                <th className="py-3 px-4 w-[96px] whitespace-nowrap">Status Akun</th>
                <th className="py-3 px-4 w-[258px] whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
              {filteredUsers.map((u) => {
                const isSelf = u.id === currentAdminId;

                return (
                  <tr key={u.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-[#5A3E28] block">{u.full_name}</strong>
                      <span className="text-[11px] text-[#6E5038]/75">{u.email}</span>
                      {isSelf && (
                        <span className="text-[10px] text-[#556B43] font-bold block mt-0.5">
                          (Akun Sedang Aktif)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 w-[106px] whitespace-nowrap">
                      <span className="inline-flex w-[90px]">
                        <Badge
                          variant={
                            u.role === 'admin'
                              ? 'terracotta'
                              : u.role === 'pegawai'
                              ? 'yellow'
                              : 'sage'
                          }
                        >
                          {u.role}
                        </Badge>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 w-[125px] font-mono text-[11px] text-[#5A3E28] whitespace-nowrap">
                      {u.identity_number || '-'}
                    </td>
                    <td className="py-3.5 px-4 w-[145px] text-[11px] text-[#6E5038]">
                      <div>Total: {u.total_loans || 0} pinjaman</div>
                      {parseInt(u.active_loans, 10) > 0 && (
                        <span className="text-[#9A6B19] font-semibold">
                          {u.active_loans} sedang aktif
                        </span>
                      )}
                      {parseInt(u.unpaid_fines, 10) > 0 && (
                        <span className="text-[#C96858] font-bold block">
                          Ada denda tertunggak
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 w-[96px] whitespace-nowrap">
                      <span className="inline-flex w-[80px]">
                        {u.is_active ? (
                          <Badge variant="sage">Aktif</Badge>
                        ) : (
                          <Badge variant="terracotta">Nonaktif</Badge>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 w-[258px] whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="px-2.5 py-1.5 rounded-xl border border-[#DFC7A2] bg-[#FAF4E8] hover:bg-[#F1E4CD] text-[#5A3E28] font-bold text-[11px] text-center transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openPasswordModal(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#8BA372]/45 bg-[#EEF4E6] hover:bg-[#E1ECD4] text-[#425732] font-bold text-[11px] text-center transition-colors cursor-pointer"
                          title={`Ubah password untuk ${u.full_name}`}
                        >
                          <svg
                            className="h-3.5 w-3.5 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                          </svg>
                          <span>Ubah Password</span>
                        </button>
                        {!isSelf ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(u)}
                            className="w-[58px] py-1.5 rounded-xl border border-[#C96858]/35 bg-[#FBECE9] hover:bg-[#F6DCD6] text-[#8A3729] font-bold text-[11px] text-center transition-colors cursor-pointer"
                            title="Hapus / Nonaktifkan Akun"
                          >
                            Hapus
                          </button>
                        ) : (
                          <span aria-hidden="true" className="inline-block w-[58px]" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {mounted &&
        modalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B480]/50 bg-[#F8EFE2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#79543D]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#79543D]" />
                  <span>{editingUser ? 'Perbarui Akun' : 'Akun Pengguna Baru'}</span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  {editingUser ? `Edit: ${editingUser.full_name}` : 'Tambah Pengguna Baru'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Contoh: Pustakawan Ahmad"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-sm text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                    Alamat Email (Unik)
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="nama@unhas.ac.id"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-sm text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Password Awal
                    </label>
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-sm text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      Peran (Role)
                    </label>
                    <select
                      value={form.role}
                      disabled={isEditingAdmin}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663] disabled:bg-[#F2E7D5] disabled:text-[#79543D]/75 disabled:cursor-not-allowed"
                    >
                      <option value="mahasiswa">Mahasiswa</option>
                      <option value="pegawai">Pegawai</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5">
                      No. Identitas / NIM
                    </label>
                    <input
                      type="text"
                      value={form.identityNumber}
                      onChange={(e) => setForm({ ...form, identityNumber: e.target.value })}
                      placeholder="Contoh: D121221005"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
                    />
                  </div>
                </div>

                {editingUser && (
                  <div className="pt-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="userActive"
                      checked={form.isActive}
                      disabled={isEditingSelf}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="rounded text-[#7B9663] disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <label
                      htmlFor="userActive"
                      className={`text-xs font-semibold ${
                        isEditingSelf ? 'text-[#5A3E28]/60' : 'text-[#5A3E28]'
                      }`}
                    >
                      Status Akun Aktif (Dapat Login ke Sistem)
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
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-[#79543D] hover:bg-[#5f402c] text-white text-xs font-bold shadow-[0_3px_0_#4A3122] transition-all active:translate-y-0.5 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan' : 'Buat Akun'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {mounted &&
        deleteModal.isOpen &&
        deleteModal.targetUser &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C96858]/35 bg-[#FBECE9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A84A3B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C96858]" />
                  <span>Konfirmasi Penghapusan Akun</span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#5A3E28] mt-2.5">
                  Hapus Akun Pengguna Ini?
                </h3>

                <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1.5 leading-relaxed">
                  Pastikan akun tidak memiliki transaksi aktif atau denda tertunggak. Jika memiliki riwayat relasi data, sistem akan menonaktifkan akun secara aman.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAD5B5] bg-[#FAF4E8] p-4 space-y-2 text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                    Nama &amp; Peran
                  </span>
                  <p className="font-bold text-[#5A3E28] mt-0.5">
                    {deleteModal.targetUser.full_name}{' '}
                    <span className="font-normal text-[#6E5038]/75">
                      ({deleteModal.targetUser.role})
                    </span>
                  </p>
                </div>

                <div className="border-t border-[#EAD5B5]/70 pt-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79543D]/60">
                    Email &amp; Identitas
                  </span>
                  <p className="text-[#5A3E28] mt-0.5">{deleteModal.targetUser.email}</p>
                  {deleteModal.targetUser.identity_number && (
                    <p className="font-mono text-[11px] text-[#79543D]/70 mt-0.5">
                      ID/NIM: {deleteModal.targetUser.identity_number}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, targetUser: null })}
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
                  {isLoading ? 'Memproses...' : 'Ya, Hapus Akun'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {mounted &&
        selfNoticeOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E2B15B]/50 bg-[#FFF6DF] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A6B19]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D99B26]" />
                  <span>Proteksi Sesi Aktif</span>
                </div>
                <h3 className="font-editorial text-lg font-bold text-[#5A3E28] mt-2.5">
                  Tidak Dapat Menghapus Akun Sendiri
                </h3>
                <p className="text-xs text-[#6E5038]/85 mt-1.5 leading-relaxed">
                  Akun administrator yang sedang digunakan untuk sesi login ini tidak dapat dihapus dari halaman manajemen pengguna.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelfNoticeOpen(false)}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#7B9663] hover:bg-[#6D8657] text-white text-xs font-bold shadow-[0_3px_0_#5C7348] transition-all cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>,
          document.body
        )}

      {mounted && passwordModal.isOpen && passwordModal.targetUser && (
        <ChangePasswordModal
          key={passwordModal.targetUser.id}
          targetUser={passwordModal.targetUser}
          currentAdminId={currentAdminId}
          onClose={() => setPasswordModal({ isOpen: false, targetUser: null })}
          onSuccess={(message) => {
            setPasswordModal({ isOpen: false, targetUser: null });
            setFeedback({ type: 'success', text: message });
            router.refresh();
          }}
          onError={(message) => {
            setFeedback({ type: 'error', text: message });
          }}
        />
      )}
    </div>
  );
}