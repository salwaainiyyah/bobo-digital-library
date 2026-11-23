import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import Badge from '@/components/ui/Badge';
import { requireRole } from '@/lib/auth/permissions';
import { getAllTransactionsAdmin } from '@/lib/queries/loans';
import { ROLES, LOAN_STATUS } from '@/lib/constants';

export const revalidate = 0;

export default async function AdminTransactionsPage({ searchParams }) {
  const admin = await requireRole(ROLES.ADMIN);
  const params = await searchParams;

  const status = params?.status || 'ALL';
  const search = params?.q || '';
  const page = parseInt(params?.page || '1', 10);

  const { items: transactions, pagination } = await getAllTransactionsAdmin({
    status,
    search,
    page,
    limit: 15,
  });

  return (
    <DashboardShell user={admin}>
      <div className="space-y-6">
        {/* Header Banner */}
        <section className="rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] p-6 sm:p-8 shadow-[0_6px_20px_rgba(92,65,42,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C96858]/35 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A84A3B] mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C96858]" />
            <span>Audit Sirkulasi Sistem</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#5A3E28]">
            Monitoring Seluruh Log Transaksi
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5038]/85 mt-1 max-w-3xl">
            Pantau rekam jejak riwayat sirkulasi lintas mahasiswa, persetujuan staf, pengembalian buku, dan pelunasan denda di seluruh kampus.
          </p>
        </section>

        {/* Filter Bar */}
        <div className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-5 shadow-[0_6px_0_#EAD5B5]/60">
          <form
            method="GET"
            action="/dashboard/admin/transactions"
            className="grid grid-cols-1 sm:grid-cols-12 gap-3"
          >
            <div className="sm:col-span-6">
              <input
                type="text"
                name="q"
                defaultValue={search}
                placeholder="Cari nama mahasiswa, NIM, atau judul buku..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] placeholder:text-[#79543D]/45 focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                name="status"
                defaultValue={status}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-xs text-[#5A3E28] focus:outline-hidden focus:ring-2 focus:ring-[#7B9663]"
              >
                <option value="ALL">Semua Status</option>
                <option value={LOAN_STATUS.PENDING}>Menunggu Konfirmasi</option>
                <option value={LOAN_STATUS.BORROWED}>Sedang Dipinjam</option>
                <option value={LOAN_STATUS.COMPLETED}>Selesai Dikembalikan</option>
                <option value={LOAN_STATUS.REJECTED}>Ditolak</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#79543D] hover:bg-[#5f402c] text-white font-bold text-xs py-2.5 px-3 rounded-2xl shadow-[0_3px_0_#4A3122] transition-all active:translate-y-0.5 cursor-pointer"
              >
                Filter
              </button>
              {(search || status !== 'ALL') && (
                <Link
                  href="/dashboard/admin/transactions"
                  aria-label="Reset filter"
                  className="px-3 rounded-2xl border-2 border-[#E4CEAD] bg-[#FAF4E8] hover:bg-[#F1E4CD] text-[#5A3E28] font-bold flex items-center justify-center text-xs transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* Tabel Log Transaksi */}
        <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#6E5038]/80">
            <span>
              Menampilkan <strong className="text-[#5A3E28]">{transactions.length}</strong> dari{' '}
              <strong className="text-[#5A3E28]">{pagination.totalItems}</strong> transaksi
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center bg-[#F8F1E3] rounded-2xl border border-dashed border-[#DFC7A2]">
              <p className="text-xs font-medium text-[#6E5038]/75">
                Tidak ada riwayat transaksi yang cocok dengan kriteria filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F1E3]">
                  <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Mahasiswa Peminjam</th>
                    <th className="py-3 px-4">Judul Buku</th>
                    <th className="py-3 px-4">Jatuh Tempo</th>
                    <th className="py-3 px-4">Dikembalikan</th>
                    <th className="py-3 px-4">Disetujui Oleh</th>
                    <th className="py-3 px-4 text-right">Denda Terkait</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
                  {transactions.map((tx) => {
                    const statusVariant =
                      tx.status === LOAN_STATUS.COMPLETED
                        ? 'sage'
                        : tx.status === LOAN_STATUS.BORROWED
                        ? 'beige'
                        : tx.status === LOAN_STATUS.PENDING
                        ? 'yellow'
                        : 'terracotta';

                    return (
                      <tr key={tx.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#6E5038]/70">
                          #{tx.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={statusVariant}>{tx.status}</Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-[#5A3E28] block">{tx.student_name}</strong>
                          <span className="text-[10px] text-[#6E5038]/70 font-mono">
                            NIM: {tx.student_nim}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-[#5A3E28] block">{tx.book_title}</strong>
                          <span className="text-[10px] text-[#6E5038]/70 font-mono">
                            ISBN: {tx.isbn}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#5A3E28]">
                          {tx.due_date
                            ? new Date(tx.due_date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-[#5A3E28]">
                          {tx.returned_at
                            ? new Date(tx.returned_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-[#6E5038]/85">
                          {tx.approved_by_name || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {tx.fine_amount ? (
                            <div>
                              <strong className="text-[#5A3E28] block">
                                Rp {parseFloat(tx.fine_amount).toLocaleString('id-ID')}
                              </strong>
                              <span
                                className={`text-[10px] font-bold ${
                                  tx.fine_status === 'PAID' ? 'text-[#556B43]' : 'text-[#A84A3B]'
                                }`}
                              >
                                {tx.fine_status === 'PAID' ? 'Lunas' : 'Tertunggak'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#6E5038]/45 text-[11px]">Nihil</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2 pt-4 border-t border-[#EAD5B5]/70">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                const isCurrent = p === pagination.currentPage;
                const queryObj = {
                  ...(search ? { q: search } : {}),
                  ...(status !== 'ALL' ? { status } : {}),
                  page: p,
                };
                const searchString = new URLSearchParams(queryObj).toString();

                return (
                  <Link
                    key={p}
                    href={`/dashboard/admin/transactions?${searchString}`}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'bg-[#79543D] text-white shadow-2xs'
                        : 'bg-[#FAF4E8] border border-[#DFC7A2] text-[#5A3E28] hover:bg-[#F1E4CD]'
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}