'use client';

import { useState } from 'react';
import Link from 'next/link';
import BookCoverImage from '@/components/ui/BookCoverImage';

const SPINE_PALETTES = [
  {
    bg: 'from-[#68774E] via-[#5B6943] to-[#495535]',
    text: 'text-[#FAF6EE]',
    band: 'bg-[#DCE5C8]/30',
  },
  {
    bg: 'from-[#8C5A3C] via-[#7A4D32] to-[#633D26]',
    text: 'text-[#FAF6EE]',
    band: 'bg-[#EBCFA9]/30',
  },
  {
    bg: 'from-[#B5654D] via-[#A15640] to-[#874532]',
    text: 'text-[#FAF6EE]',
    band: 'bg-[#F7EBD8]/30',
  },
  {
    bg: 'from-[#C89B54] via-[#B58944] to-[#987134]',
    text: 'text-[#3F2A1D]',
    band: 'bg-[#3F2A1D]/20',
  },
  {
    bg: 'from-[#536860] via-[#465952] to-[#374741]',
    text: 'text-[#FAF6EE]',
    band: 'bg-[#D7E4DE]/30',
  },
];

function CabinetShelfRow({ shelfBooks, shelfNumber, startIndex }) {
  const [activeIndex, setActiveIndex] = useState(shelfBooks.length > 0 ? 0 : null);

  if (!shelfBooks.length) return null;

  const activeBook = activeIndex !== null ? shelfBooks[activeIndex] : null;

  const handlePrev = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + shelfBooks.length) % shelfBooks.length;
    });
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % shelfBooks.length;
    });
  };

  return (
    <div className="w-full">
      {/* Header Kompartemen Rak */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-8 pt-5 pb-3.5 bg-[#FFFDF9] border-b border-[#EBCFA9]/45">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="w-1.5 h-6 rounded-full bg-[#929D75] shrink-0"
          />
          <div>
            <span className="font-editorial text-base sm:text-lg font-bold text-[#79543D]">
              Rak Koleksi {shelfNumber}
            </span>
            <p className="text-[11px] text-[#79543D]/55">
              Klik punggung buku untuk membuka sampul depan
            </p>
          </div>
        </div>

        {/* Navigasi Geser Buku pada Rak Ini */}
        {shelfBooks.length > 1 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Buku sebelumnya di rak ini"
              className="w-8 h-8 rounded-full border border-[#EBCFA9] bg-[#FAF6EE] text-[#79543D]/75 hover:bg-[#929D75] hover:text-white hover:border-[#929D75] active:scale-95 transition-all duration-200 flex items-center justify-center text-xs cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Buku berikutnya di rak ini"
              className="w-8 h-8 rounded-full border border-[#EBCFA9] bg-[#FAF6EE] text-[#79543D]/75 hover:bg-[#929D75] hover:text-white hover:border-[#929D75] active:scale-95 transition-all duration-200 flex items-center justify-center text-xs cursor-pointer"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Ruang Dalam Lemari (Bright Recessed Cabinet Bay) */}
      <div
        className="relative pt-3 overflow-visible bg-gradient-to-b from-[#F2E4CE]/65 via-[#FFFDF9] to-[#FAF3E6] shadow-[inset_0_12px_22px_-10px_rgba(121,84,61,0.11)]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 55px, rgba(182, 145, 104, 0.065) 55px, rgba(182, 145, 104, 0.065) 56px)',
        }}
      >
        {/* Pendar Cahaya Lembut di Tengah Sekat */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-4 bottom-4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,253,249,0.9)_0%,transparent_72%)]"
        />

        {/* Barisan Buku (Padding atas di dalam container agar animasi angkat & miring tidak terpotong) */}
        <div
          className="relative z-10 flex items-end justify-start sm:justify-center gap-2 sm:gap-3 px-4 sm:px-8 pt-10 sm:pt-12 pb-0 overflow-x-auto sm:overflow-visible horizontal-scroll"
          style={{ perspective: '1200px' }}
        >
          {/* Penyangga Buku Kiri (Bookend Kayu Terang) */}
          <div
            aria-hidden="true"
            className="hidden sm:block w-3 h-28 rounded-t-md bg-gradient-to-b from-[#D7B58C] to-[#BA9163] border-l border-t border-[#F4E3CC] shadow-xs shrink-0 transition-transform duration-500"
          />

          {shelfBooks.map((book, idx) => {
            const isOpen = activeIndex === idx;
            const palette = SPINE_PALETTES[(startIndex + idx) % SPINE_PALETTES.length];

            return (
              <div
                key={book.id}
                style={{ transformStyle: 'preserve-3d' }}
                className={`relative shrink-0 h-[236px] sm:h-[268px]
                            transition-[width,margin,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                            ${
                              isOpen
                                ? 'w-[158px] sm:w-[184px] mx-1.5 sm:mx-3 z-20'
                                : 'w-11 sm:w-12 mx-0 z-10'
                            }`}
              >
                {/* 1. LAYER PUNGGUNG BUKU (Menyamping saat belum dipilih) */}
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Buka buku ${book.title}`}
                  aria-expanded={isOpen}
                  className={`group absolute inset-0 w-full h-full rounded-t-[4px] rounded-b-[2px] overflow-hidden
                              bg-gradient-to-b ${palette.bg} ${palette.text}
                              border-x border-t border-white/15
                              shadow-[inset_3px_0_6px_rgba(255,255,255,0.18),inset_-3px_0_6px_rgba(0,0,0,0.22),0_6px_12px_rgba(92,59,40,0.20)]
                              origin-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                              flex flex-col items-center justify-between py-3.5 px-1 cursor-pointer
                              ${
                                isOpen
                                  ? 'opacity-0 scale-x-75 -translate-x-1 pointer-events-none'
                                  : 'opacity-100 scale-x-100 translate-x-0 hover:-translate-y-3 hover:shadow-[0_14px_20px_rgba(92,59,40,0.26)]'
                              }`}
                >
                  {book.cover_url && (
                    <img
                      src={book.cover_url}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
                    />
                  )}

                  <span className={`relative z-10 w-6 h-1 rounded-full ${palette.band}`} />

                  <span className="relative z-10 max-h-[165px] sm:max-h-[190px] overflow-hidden text-[10px] sm:text-[11px] font-bold tracking-wide leading-tight [writing-mode:vertical-rl] rotate-180 text-center">
                    {book.title}
                  </span>

                  <span className="relative z-10 text-[9px] font-semibold opacity-75">
                    {book.publication_year || 'ᨅᨚ'}
                  </span>
                </button>

                {/* 2. LAYER SAMPUL DEPAN (Berputar menghadap ke depan saat diklik) */}
                <div
                  className={`absolute bottom-0 left-0 w-[158px] sm:w-[184px] h-[236px] sm:h-[268px]
                              origin-bottom-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                              ${
                                isOpen
                                  ? 'opacity-100 scale-x-100 -translate-y-1.5 -rotate-2 pointer-events-auto'
                                  : 'opacity-0 scale-x-[0.26] translate-y-0 rotate-0 pointer-events-none'
                              }`}
                >
                  <Link
                    href={`/catalog/${book.id}`}
                    tabIndex={isOpen ? 0 : -1}
                    className="group/cover block relative w-full h-full rounded-r-lg rounded-l-[3px] overflow-hidden
                               shadow-[0_18px_28px_-6px_rgba(92,59,40,0.36),6px_0_0_#F7EFE2,7px_0_0_#D8C3A5]
                               transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-1"
                  >
                    <BookCoverImage
                      src={book.cover_url}
                      title={book.title}
                      author={book.author}
                      fallbackClassName={`${palette.bg} ${palette.text}`}
                      fallbackPaddingClassName="p-3.5 pl-4"
                      fallbackInnerClassName="border border-current/25 rounded-xs h-full p-2.5 flex flex-col justify-between text-left"
                      titleClassName="font-editorial text-xs sm:text-sm font-bold leading-snug line-clamp-4"
                      authorClassName="text-[10px] opacity-80 line-clamp-1 border-t border-current/20 pt-1"
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 via-white/15 to-transparent"
                    />
                  </Link>

                  <Link
                    href={`/catalog/${book.id}`}
                    tabIndex={isOpen ? 0 : -1}
                    title={`Buka detail ${book.title}`}
                    className={`absolute -left-3.5 bottom-3 z-30 w-9 h-9 rounded-full bg-[#FFFCF7] border border-[#EBCFA9]
                                text-[#79543D] shadow-md flex items-center justify-center text-xs font-bold
                                hover:bg-[#929D75] hover:text-white hover:border-[#929D75] hover:scale-110
                                transition-all duration-300 ease-out
                                ${
                                  isOpen
                                    ? 'opacity-100 scale-100 delay-150'
                                    : 'opacity-0 scale-50'
                                }`}
                  >
                    ↗
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Penyangga Buku Kanan (Bookend Kayu Terang) */}
          <div
            aria-hidden="true"
            className="hidden sm:block w-3 h-28 rounded-t-md bg-gradient-to-b from-[#D7B58C] to-[#BA9163] border-r border-t border-[#F4E3CC] shadow-xs shrink-0 transition-transform duration-500"
          />
        </div>

        {/* Papan Rak Kayu Terang Menyambung ke Dinding Lemari */}
        <div aria-hidden="true" className="relative z-10 select-none">
          <div className="h-2.5 bg-gradient-to-b from-[#FFFDF9] via-[#F3E2C8] to-[#E6CCA8] border-t border-[#FFFDF9]" />
          <div className="h-3 bg-gradient-to-b from-[#DFC19A] to-[#CFA97B] shadow-[0_10px_20px_-4px_rgba(121,84,61,0.22)]" />
        </div>
      </div>

      {/* Caption Detail Buku yang Sedang Terbuka */}
      {activeBook && (
        <div
          key={activeBook.id}
          className="pt-6 pb-8 px-4 bg-[#FDF9F3] text-center space-y-1.5 transition-all duration-300 animate-fade-in-up"
        >
          {activeBook.category_name && (
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#929D75]/15 text-[#68774E] text-[10px] font-bold uppercase tracking-wider">
              {activeBook.category_name}
            </span>
          )}

          <div>
            <Link
              href={`/catalog/${activeBook.id}`}
              className="inline-block font-editorial text-lg sm:text-xl font-bold text-[#79543D] hover:text-[#929D75] transition-colors"
            >
              {activeBook.title}
            </Link>
          </div>

          <p className="text-xs text-[#79543D]/70 font-medium">
            {activeBook.author}
            {activeBook.publication_year ? ` • ${activeBook.publication_year}` : ''}
            {activeBook.avg_rating > 0 ? ` • ★ ${activeBook.avg_rating}` : ''}
          </p>

          <div className="pt-1 flex items-center justify-center gap-3 text-[11px]">
            <span
              className={`font-semibold ${
                activeBook.stock_available > 0 ? 'text-[#68774E]' : 'text-[#C96858]'
              }`}
            >
              {activeBook.stock_available > 0
                ? `Tersedia (${activeBook.stock_available} eks.)`
                : 'Stok Sedang Dipinjam'}
            </span>
            <span className="text-[#79543D]/30">•</span>
            <Link
              href={`/catalog/${activeBook.id}`}
              className="font-semibold text-[#79543D] underline decoration-[#C96858]/50 underline-offset-4 hover:text-[#929D75]"
            >
              Lihat Detail &amp; Pinjam →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogCabinetShelves({ books = [] }) {
  if (!books.length) return null;

  // Bagi daftar buku menjadi baris rak berisi maksimal 14 buku per rak
  const shelfRows = Array.from({ length: Math.ceil(books.length / 14) }, (_, rowIndex) =>
    books.slice(rowIndex * 14, rowIndex * 14 + 14)
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Mahkota / Lis Atas Lemari */}
      <div
        aria-hidden="true"
        className="relative h-7 sm:h-9 rounded-t-[28px] sm:rounded-t-[36px] bg-gradient-to-b from-[#FFFDF9] via-[#F5E6D0] to-[#E6CCA8] border-x border-t border-[#DFC19A] shadow-[0_-4px_20px_rgba(121,84,61,0.05)] flex items-center justify-center"
      >
        <div className="w-24 sm:w-32 h-1 rounded-full bg-[#C9A87C]/45" />
      </div>

      {/* Badan Utama Lemari */}
      <div className="bg-[#FFFDF9] border-x-[10px] sm:border-x-[18px] border-[#EAD1AF] shadow-[0_22px_50px_-14px_rgba(121,84,61,0.12),inset_8px_0_16px_-8px_rgba(121,84,61,0.12),inset_-8px_0_16px_-8px_rgba(121,84,61,0.12)] divide-y-[8px] divide-[#F2DFC4]">
        {shelfRows.map((shelfBooks, rowIndex) => (
          <CabinetShelfRow
            key={rowIndex}
            shelfBooks={shelfBooks}
            shelfNumber={rowIndex + 1}
            startIndex={rowIndex * 14}
          />
        ))}
      </div>

      {/* Alas / Kaki Bawah Lemari */}
      <div
        aria-hidden="true"
        className="h-6 sm:h-8 rounded-b-[24px] sm:rounded-b-[32px] bg-gradient-to-b from-[#EAD1AF] via-[#E1C39B] to-[#D4B286] border-x border-b border-[#C9A577] shadow-[0_14px_28px_-8px_rgba(121,84,61,0.18)]"
      />
    </div>
  );
}