import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import Badge from '@/components/ui/Badge';
import { requireRole } from '@/lib/auth/permissions';
import { getStudentFines } from '@/lib/queries/fines';
import { ROLES, FINE_STATUS } from '@/lib/constants';

export const revalidate = 0;

export default async function MahasiswaFinesPage() {
  const user = await requireRole(ROLES.MAHASISWA);
  const fines = await getStudentFines(user.id);

  const unpaidFines = fines.filter((f) => f.status === FINE_STATUS.UNPAID);
  const paidFines = fines.filter((f) => f.status === FINE_STATUS.PAID);

  const totalUnpaidAmount = unpaidFines.reduce((sum, f) => sum + parseFloat(f.amount), 0);
  const totalPaidAmount = paidFines.reduce((sum, f) => sum + parseFloat(f.amount), 0);

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        {/* ═══════════ 1. HEADER BANNER ═══════════ */}
        <section className="rounded-[28px] border-2 border-[#DFC7A2] bg-gradient-to-r from-[#F9F3E6] via-[#EFF3E6] to-[#DCE8D8] p-6 sm:p-8 shadow-[0_6px_20px_rgba(92,65,42,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8BA372]/40 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43] mb-2">
            <span>💰</span>
            <span>Administrasi Keuangan</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#5A3E28]">
            Tagihan Denda Keterlambatan
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5038]/80 mt-1 max-w-2xl">
            Denda dihitung otomatis dari selisih tanggal pengembalian fisik buku terhadap tanggal jatuh tempo yang berlaku.
          </p>
        </section>

        {/* ═══════════ 2. PITA STATUS KELAYAKAN PINJAM ═══════════ */}
        {unpaidFines.length > 0 ? (
          <div className="rounded-[24px] border-2 border-[#C96858]/45 bg-[#FDF1EE] p-4 sm:p-5 shadow-[0_4px_0_#EBC3BC]/60 flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#C96858]/15 text-lg">
              ⚠️
            </span>
            <div className="text-xs sm:text-sm text-[#7D2E22] leading-relaxed">
              <h2 className="font-bold text-[#8A3729]">
                Status Peminjaman Anda: Terblokir Sementara
              </h2>
              <p className="mt-0.5 text-xs text-[#7D2E22]/90">
                Anda memiliki total denda tertunggak sebesar{' '}
                <strong>Rp {totalUnpaidAmount.toLocaleString('id-ID')}</strong>. Berdasarkan aturan sirkulasi, pengajuan pinjaman buku baru diblokir sementara hingga Anda melunasi kewajiban ini di <strong>Meja Sirkulasi Lantai 1</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border-2 border-[#929D75]/45 bg-[#EEF4E6] p-4 sm:p-5 shadow-[0_4px_0_#D3DFC4]/60 flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#7B9663]/20 text-lg">
              🌿
            </span>
            <div className="text-xs sm:text-sm text-[#425732] leading-relaxed">
              <h2 className="font-bold text-[#3A4E2B]">Akun Bersih &amp; Bebas Denda</h2>
              <p className="mt-0.5 text-xs text-[#425732]/90">
                Tidak ada tanggungan denda yang tertunggak pada akun Anda. Anda bebas mengajukan peminjaman buku di katalog kapan saja.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════ 3. KARTU RINGKASAN NOMINAL ═══════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Kartu Denda Tertunggak */}
          <div className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-5 sm:p-6 shadow-[0_6px_0_#EAD5B5]/60 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C96858]">
                Total Denda Tertunggak
              </span>
              <div className="font-editorial text-2xl sm:text-3xl font-bold text-[#C96858] mt-1.5">
                Rp {totalUnpaidAmount.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-[#6E5038]/75 mt-1">
                {unpaidFines.length} transaksi belum dilunasi
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#C96858]/25 bg-[#FBECE9] text-2xl">
              🧾
            </div>
          </div>

          {/* Kartu Denda Lunas */}
          <div className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-5 sm:p-6 shadow-[0_6px_0_#EAD5B5]/60 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#556B43]">
                Total Denda Telah Lunas
              </span>
              <div className="font-editorial text-2xl sm:text-3xl font-bold text-[#556B43] mt-1.5">
                Rp {totalPaidAmount.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-[#6E5038]/75 mt-1">
                {paidFines.length} transaksi selesai dibayar
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#8BA372]/35 bg-[#EEF4E6] text-2xl">
              ✅
            </div>
          </div>
        </div>

        {/* ═══════════ 4. TABEL RIWAYAT DENDA ═══════════ */}
        <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 shadow-[0_6px_0_#EAD5B5]/60 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[#7B9663]">🌿</span>
              <h2 className="font-editorial text-lg font-bold text-[#5A3E28]">
                Daftar Riwayat Denda
              </h2>
            </div>

            {fines.length > 0 && (
              <span className="rounded-full border border-[#EAD5B5] bg-[#FAF4E8] px-3 py-1 text-[11px] font-bold text-[#6E5038]">
                Total {fines.length} Catatan
              </span>
            )}
          </div>

          {fines.length === 0 ? (
            <div className="p-10 text-center bg-[#F8F1E3] rounded-2xl border border-dashed border-[#DFC7A2] space-y-2">
              <span className="text-3xl block">✨</span>
              <h3 className="font-bold text-sm text-[#5A3E28]">
                Belum ada catatan denda keterlambatan
              </h3>
              <p className="text-xs text-[#6E5038]/75 max-w-md mx-auto">
                Anda selalu mengembalikan koleksi pustaka tepat waktu. Pertahankan kedisiplinan membaca Anda!
              </p>
              <div className="pt-2">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#7B9663] px-4 py-2 text-xs font-bold text-white shadow-[0_3px_0_#5C7348] hover:bg-[#6D8657] transition-colors"
                >
                  <span>Jelajahi Katalog Buku</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#EAD5B5]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F1E3]">
                  <tr className="border-b border-[#EAD5B5] text-[#5A3E28]/70 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-4">Buku Terkait</th>
                    <th className="py-3 px-4">Keterlambatan</th>
                    <th className="py-3 px-4">Tarif / Hari</th>
                    <th className="py-3 px-4">Nominal Denda</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Informasi Pelunasan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAD5B5]/60 bg-[#FFFDF9]">
                  {fines.map((f) => {
                    const isUnpaid = f.status === FINE_STATUS.UNPAID;

                    return (
                      <tr key={f.id} className="hover:bg-[#F8F1E3]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-[#5A3E28]">{f.book_title}</p>
                          <span className="text-[10px] text-[#79543D]/60 font-mono">
                            ISBN: {f.isbn}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#C96858]">{f.days_late} hari</span>
                        </td>
                        <td className="py-3.5 px-4 text-[#6E5038]">
                          Rp {parseFloat(f.daily_rate_snapshot).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-sm text-[#5A3E28]">
                            Rp {parseFloat(f.amount).toLocaleString('id-ID')}
                          </strong>
                        </td>
                        <td className="py-3.5 px-4">
                          {isUnpaid ? (
                            <Badge variant="terracotta">Tertunggak</Badge>
                          ) : (
                            <Badge variant="sage">Lunas</Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {isUnpaid ? (
                            <span className="text-[11px] font-medium text-[#8A3729]">
                              Harap bayar di loket meja sirkulasi
                            </span>
                          ) : (
                            <div className="text-[11px] text-[#5A3E28]">
                              <span className="font-semibold">
                                {new Date(f.paid_at).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="block text-[10px] text-[#79543D]/60">
                                Metode: {f.payment_method || 'Tunai'}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}