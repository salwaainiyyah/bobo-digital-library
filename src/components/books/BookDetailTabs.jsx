'use client';

import { useState } from 'react';
import Badge from '@/components/ui/Badge';

export default function BookDetailTabs({ book }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Ikhtisar & Panduan', icon: '📖' },
    { id: 'specs', label: 'Spesifikasi Teknis', icon: '📑' },
    { id: 'rules', label: 'Aturan Sirkulasi', icon: '⚖️' },
    { id: 'reviews', label: `Ulasan Mahasiswa (${book.reviews?.length || 0})`, icon: '★' },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Pill Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#EBCFA9]/30 rounded-2xl border border-[#EBCFA9]/60">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-white text-[#79543D] shadow-sm scale-100'
                  : 'text-[#79543D]/70 hover:text-[#79543D] hover:bg-white/40'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents with animations */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-[#EBCFA9]/70 shadow-sm transition-all duration-300">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Magazine-style lead quote */}
            <div className="relative pl-6 py-2 border-l-3 border-[#929D75] italic text-[#79543D]/90 text-sm sm:text-base leading-relaxed bg-[#929D75]/5 rounded-r-2xl p-4">
              &ldquo;Membaca adalah jembatan yang menghubungkan nalar akademik dengan kearifan masa lalu, meretas jalan pemikiran baru bagi civitas akademika.&rdquo;
              <span className="block not-italic text-xs font-semibold text-[#929D75] mt-2">
                &mdash; Koleksi Terkurasi Bo&apos;bo Digital Library
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-lg text-[#79543D] mb-3">Tentang Buku Ini</h3>
              <p className="text-sm text-[#79543D]/80 leading-relaxed">
                Buku bertajuk <strong>&ldquo;{book.title}&rdquo;</strong> karya <strong>{book.author}</strong> diterbitkan oleh <strong>{book.publisher}</strong>. 
                Merupakan rujukan utama dalam disiplin keilmuan <strong>{book.category_name}</strong> dengan kode klasifikasi rak <strong>{book.classification_code}</strong>.
              </p>
              <p className="text-sm text-[#79543D]/75 leading-relaxed mt-3">
                Koleksi ini tersedia dalam bentuk fisik di Gedung Perpustakaan Pusat Kampus Tamalanrea Universitas Hasanuddin. 
                Civitas akademika dapat mengajukan peminjaman langsung melalui sistem web ini untuk kemudian diverifikasi fisik di meja sirkulasi.
              </p>
            </div>

            {/* Quick Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EBCFA9]/50">
              <div className="p-3.5 rounded-2xl bg-[#F7EBD8]/50 border border-[#EBCFA9]/50">
                <span className="text-[11px] text-[#79543D]/60 block font-medium">Status Sirkulasi</span>
                <span className="font-bold text-sm text-[#929D75]">
                  {book.stock_available > 0 ? 'Tersedia di Rak' : 'Sedang Dipinjam'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7EBD8]/50 border border-[#EBCFA9]/50">
                <span className="text-[11px] text-[#79543D]/60 block font-medium">Batas Durasi</span>
                <span className="font-bold text-sm text-[#79543D]">{book.loan_duration_days} Hari Kalender</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7EBD8]/50 border border-[#EBCFA9]/50 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-[#79543D]/60 block font-medium">Total Terpinjam</span>
                <span className="font-bold text-sm text-[#C96858]">{book.borrow_count} Kali Sirkulasi</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-editorial text-lg text-[#79543D] mb-4">Metadata & Rincian Teknis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F7EBD8]/40 border border-[#EBCFA9]/60 flex justify-between items-center">
                <span className="text-xs text-[#79543D]/70 font-medium">Nomor ISBN</span>
                <span className="font-mono text-xs font-bold text-[#79543D] bg-white px-2.5 py-1 rounded-lg border border-[#EBCFA9]/70">
                  {book.isbn}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7EBD8]/40 border border-[#EBCFA9]/60 flex justify-between items-center">
                <span className="text-xs text-[#79543D]/70 font-medium">Penerbit Resmi</span>
                <span className="text-xs font-bold text-[#79543D]">{book.publisher}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7EBD8]/40 border border-[#EBCFA9]/60 flex justify-between items-center">
                <span className="text-xs text-[#79543D]/70 font-medium">Tahun Publikasi</span>
                <span className="text-xs font-bold text-[#79543D]">{book.publication_year}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7EBD8]/40 border border-[#EBCFA9]/60 flex justify-between items-center">
                <span className="text-xs text-[#79543D]/70 font-medium">Klasifikasi DDC/LCC</span>
                <span className="font-mono text-xs font-bold text-[#929D75] bg-[#929D75]/10 px-2.5 py-1 rounded-lg">
                  {book.classification_code}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7EBD8]/40 border border-[#EBCFA9]/60 flex justify-between items-center">
                <span className="text-xs text-[#79543D]/70 font-medium">Total Eksemplar Fisik</span>
                <span className="text-xs font-bold text-[#79543D]">{book.stock_total} eksemplar</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7EBD8]/40 border border-[#EBCFA9]/60 flex justify-between items-center">
                <span className="text-xs text-[#79543D]/70 font-medium">Tarif Denda Harian</span>
                <span className="text-xs font-bold text-[#C96858]">
                  Rp {parseFloat(book.fine_per_day).toLocaleString('id-ID')} / hari
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4 animate-fade-in text-sm text-[#79543D]/80 leading-relaxed">
            <h3 className="font-editorial text-lg text-[#79543D] mb-3">Ketentuan & Prosedur Sirkulasi Kampus</h3>
            <div className="space-y-3">
              <div className="flex gap-3 p-3.5 rounded-2xl bg-[#929D75]/10 border border-[#929D75]/20">
                <span className="text-base">1️⃣</span>
                <div>
                  <strong className="text-[#54603B] block mb-0.5">Pengajuan Online & Verifikasi Fisik</strong>
                  <p className="text-xs text-[#79543D]/75">
                    Permohonan diajukan melalui portal Bo&apos;bo. Mahasiswa mendatangi meja sirkulasi Lantai 1 dengan menunjukkan kartu tanda mahasiswa aktif.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3.5 rounded-2xl bg-[#F5C875]/15 border border-[#F5C875]/30">
                <span className="text-base">2️⃣</span>
                <div>
                  <strong className="text-[#855B10] block mb-0.5">Durasi Pinjam & Perpanjangan</strong>
                  <p className="text-xs text-[#79543D]/75">
                    Masa pinjam standar berlaku selama <strong>{book.loan_duration_days} hari</strong>. Perpanjangan dapat diajukan 1 kali sebelum batas waktu berakhir asalkan buku tidak diantrekan mahasiswa lain.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3.5 rounded-2xl bg-[#C96858]/10 border border-[#C96858]/20">
                <span className="text-base">3️⃣</span>
                <div>
                  <strong className="text-[#8A3729] block mb-0.5">Denda Keterlambatan</strong>
                  <p className="text-xs text-[#79543D]/75">
                    Keterlambatan pengembalian buku dikenakan denda otomatis sebesar <strong>Rp {parseFloat(book.fine_per_day).toLocaleString('id-ID')} per hari</strong>. Pemblokiran peminjaman berikutnya berlaku hingga denda terselesaikan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#EBCFA9]/60 pb-4">
              <div>
                <h3 className="font-editorial text-lg text-[#79543D]">Ulasan & Penilaian Mahasiswa</h3>
                <p className="text-xs text-[#79543D]/60 mt-0.5">
                  Dari mahasiswa yang telah menuntaskan peminjaman buku ini.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#855B10]">{book.avg_rating > 0 ? book.avg_rating : '-'}</span>
                <span className="text-xs text-[#79543D]/50 block">dari 5 bintang</span>
              </div>
            </div>

            {book.reviews.length === 0 ? (
              <div className="p-8 text-center bg-[#EBCFA9]/20 rounded-2xl border border-[#EBCFA9]/40">
                <p className="text-xs text-[#79543D]/70">
                  Belum ada ulasan untuk buku ini. Mahasiswa yang meminjam dan mengembalikan buku dapat menulis ulasan pertama!
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {book.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white border border-[#EBCFA9]/60 shadow-2xs space-y-2 hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#929D75]/20 text-[#54603B] font-bold text-xs flex items-center justify-center">
                          {rev.student_name ? rev.student_name.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <div>
                          <span className="font-semibold text-xs text-[#79543D] block">{rev.student_name}</span>
                          <span className="text-[10px] text-[#79543D]/50 font-mono">NIM: {rev.student_nim}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#855B10] font-bold">
                        {'★'.repeat(rev.rating)}
                        <span className="text-stone-300">{'★'.repeat(5 - rev.rating)}</span>
                      </div>
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-[#79543D]/80 leading-relaxed italic bg-[#F7EBD8]/30 p-2.5 rounded-xl">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    )}

                    <span className="text-[10px] text-[#79543D]/50 block">
                      {new Date(rev.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
