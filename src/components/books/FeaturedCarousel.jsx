'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import BookCoverImage from '@/components/ui/BookCoverImage';

const FALLBACK_THEMES = [
  'from-[#68774E] to-[#4E5B39] text-[#FAF6EE]',
  'from-[#8C5A3C] to-[#6B4229] text-[#FAF6EE]',
  'from-[#B5654D] to-[#8F4934] text-[#FAF6EE]',
  'from-[#5A6E65] to-[#3F5049] text-[#FAF6EE]',
  'from-[#79543D] to-[#563928] text-[#FAF6EE]',
];

// Palet warna cadangan berdasarkan urutan jika ada buku baru masuk Top 5
const BOOK_BINDINGS = [
  {
    // Biru tua
    shellBg: 'from-[#244866] via-[#2E5A7E] to-[#1A354D]',
    ribbonBg: 'from-[#E2B15B] to-[#C6923B]',
  },
  {
    // Hijau sage
    shellBg: 'from-[#6C7852] via-[#7D8A60] to-[#556040]',
    ribbonBg: 'from-[#E2B15B] to-[#C6923B]',
  },
  {
    // Hitam arang
    shellBg: 'from-[#262423] via-[#34312F] to-[#191817]',
    ribbonBg: 'from-[#E2B15B] to-[#C6923B]',
  },
  {
    // Cokelat kulit klasik
    shellBg: 'from-[#6F4C37] via-[#79543D] to-[#5A3C2A]',
    ribbonBg: 'from-[#C96858] to-[#A84D3E]',
  },
  {
    // Cokelat okre hangat
    shellBg: 'from-[#966A32] via-[#A9793B] to-[#7A5424]',
    ribbonBg: 'from-[#C96858] to-[#A84D3E]',
  },
];

// Pencocokan warna sampul berdasarkan judul buku agar selalu selaras dengan ilustrasi sampulnya
function getBookBinding(book, index) {
  const title = (book?.title || '').toLowerCase();

  if (title.includes('laut bercerita')) {
    return BOOK_BINDINGS[0]; // Biru tua
  }
  if (title.includes('bumi manusia')) {
    return BOOK_BINDINGS[1]; // Hijau sage
  }
  if (title.includes('hunger games')) {
    return BOOK_BINDINGS[2]; // Hitam
  }
  if (title.includes('dari dalam kubur')) {
    return BOOK_BINDINGS[3]; // Cokelat
  }
  if (title.includes('kite runner')) {
    return BOOK_BINDINGS[4]; // Cokelat okre hangat
  }

  return BOOK_BINDINGS[index % BOOK_BINDINGS.length];
}

// Komponen Buku Hardcover 3D dengan Tumpukan Halaman & Pita Pembatas
function HardcoverBook3D({ book, index, isCenter }) {
  const binding = getBookBinding(book, index);
  const fallbackTheme = FALLBACK_THEMES[index % FALLBACK_THEMES.length];

  return (
    <div
      className={`relative w-full select-none transition-transform duration-300 ${
        isCenter ? 'group-hover:scale-[1.02]' : ''
      }`}
    >
      {/* Bayangan lembut di belakang buku */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-2 -bottom-1 top-2 rounded-2xl transition-opacity duration-300 ${
          isCenter
            ? 'shadow-[0_22px_34px_-8px_rgba(90,60,42,0.42)]'
            : 'shadow-[0_14px_22px_-8px_rgba(90,60,42,0.24)]'
        }`}
      />

      {/* Bagian Sampul Depan & Punggung Kiri */}
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-tl-2xl rounded-tr-xl rounded-bl-xs bg-gradient-to-r ${binding.shellBg} pl-[5px] pt-[2px] pr-[2px]`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-tl-xl rounded-tr-[10px] bg-[#EFE2CE]">
          <BookCoverImage
            src={book.cover_url}
            title={book.title}
            author={book.author}
            fallbackClassName={fallbackTheme}
            draggable={false}
            imgClassName="w-full h-full object-cover select-none"
          />

          {/* Efek lekukan engsel & pencahayaan 3D punggung buku di sisi kiri */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-black/30 via-white/20 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[7px] w-px bg-black/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[8px] w-px bg-white/30"
          />

          {/* Kilau halus tepi sampul */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-tl-xl rounded-tr-[10px] ring-1 ring-inset ring-black/10"
          />
        </div>
      </div>

      {/* Bagian Bawah: Sampul Belakang Melengkung & Tumpukan Halaman Kertas */}
      <div
        className={`relative -mt-[1px] rounded-bl-2xl rounded-br-xl bg-gradient-to-r ${binding.shellBg} pl-[5px] pr-[2px] pt-[1px] pb-[4px]`}
      >
        {/* Garis jahitan tipis khas sampul hardcover Bo'bo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2 bottom-[1.5px] h-px border-b border-dashed border-[#EBCFA9]/35"
        />

        {/* Blok Halaman Kertas Melengkung di Sisi Kiri */}
        <div className="relative h-[12px] sm:h-[14px] w-full rounded-l-full rounded-r-[4px] border-y border-l border-[#C5A47C] bg-gradient-to-b from-[#E7D6BC] via-[#FDF9F3] to-[#E5CFAF] shadow-inner overflow-hidden">
          <div
            aria-hidden="true"
            className="h-full w-full bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,rgba(121,84,61,0.14)_2px,rgba(121,84,61,0.14)_3px)]"
          />
        </div>

        {/* Pita Pembatas Kecil di Sisi Kanan Bawah */}
        <div
          aria-hidden="true"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
          }}
          className={`pointer-events-none absolute right-4 sm:right-5 top-[2px] z-20 h-[19px] sm:h-[22px] w-3 sm:w-3.5 bg-gradient-to-b ${binding.ribbonBg} shadow-xs`}
        >
          <div className="mx-auto h-full w-px border-l border-dashed border-white/35" />
        </div>
      </div>
    </div>
  );
}

// Komponen Jepitan Kayu & Pin Peringkat
function WoodenClip({ rank, isCenter }) {
  const isFirst = rank === 1;

  return (
    <div
      aria-hidden="true"
      className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
    >
      <span
        className={`mb-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide shadow-xs border transition-colors duration-300 ${
          isFirst
            ? 'bg-[#F5C875] text-[#4F3524] border-[#FFFDF7]'
            : isCenter
            ? 'bg-[#929D75] text-white border-[#FFFDF7]'
            : 'bg-[#FFFDF9]/95 text-[#79543D] border-[#EBCFA9]'
        }`}
      >
        {isFirst ? '👑 #1' : `#${rank}`}
      </span>

      <div className="relative w-3.5 h-7 rounded-t-[3px] rounded-b-[2px] bg-gradient-to-b from-[#D7AC7B] via-[#C1905B] to-[#9E6E3E] shadow-[0_3px_6px_rgba(92,59,40,0.3)] border border-[#79543D]/35 flex flex-col justify-center">
        <div className="w-full h-[2px] bg-[#5C5852]/60" />
        <div className="w-[1px] h-2.5 bg-[#79543D]/30 mx-auto mt-0.5" />
      </div>
    </div>
  );
}

export default function FeaturedCarousel({ books = [] }) {
  const topFiveBooks = books.slice(0, 5);
  const total = topFiveBooks.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [stageWidth, setStageWidth] = useState(1024);

  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const wheelResetTimerRef = useRef(null);

  // Ukur lebar area agar posisi jepitan selalu menempel pas di garis tali
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setStageWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // 1. Gestur Sapuan Dua Jari Touchpad Laptop (Horizontal Wheel)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || total <= 1) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 3) {
        e.preventDefault();

        if (wheelLockedRef.current) return;

        wheelAccumRef.current += e.deltaX;
        const clampedPreview = Math.max(-70, Math.min(70, -wheelAccumRef.current * 0.55));
        setDragOffset(clampedPreview);

        window.clearTimeout(wheelResetTimerRef.current);
        wheelResetTimerRef.current = window.setTimeout(() => {
          wheelAccumRef.current = 0;
          setDragOffset(0);
        }, 140);

        if (Math.abs(wheelAccumRef.current) >= 48) {
          if (wheelAccumRef.current > 0) {
            goNext();
          } else {
            goPrev();
          }
          wheelAccumRef.current = 0;
          setDragOffset(0);
          wheelLockedRef.current = true;

          window.setTimeout(() => {
            wheelLockedRef.current = false;
          }, 340);
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      window.clearTimeout(wheelResetTimerRef.current);
    };
  }, [total, goNext, goPrev]);

  // 2. Gestur Tarik Mouse & Sentuh Layar (Pointer Drag)
  const handlePointerDown = (e) => {
    if (total <= 1) return;
    if (e.target.closest('button')) return;

    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 6) {
      hasDraggedRef.current = true;
    }
    setDragOffset(dx);
  };

  const finishDrag = () => {
    if (!isDragging) return;
    if (dragOffset < -45) {
      goNext();
    } else if (dragOffset > 45) {
      goPrev();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  if (!total) return null;

  const activeBook = topFiveBooks[activeIndex];
  const borrowCount =
    activeBook.borrow_count ?? activeBook.total_borrows ?? activeBook.loan_count ?? 0;

  // Hitung jarak posisi melingkar (-2 sampai +2)
  const getRelativeOffset = (index) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  // Hitung titik ketinggian kurva Bezier tali (M 0,18 Q 500,98 1000,18)
  const getRopeDropY = (offsetX) => {
    const t = Math.max(0, Math.min(1, (stageWidth / 2 + offsetX) / stageWidth));
    const ropeY = 18 + 160 * t * (1 - t);
    return ropeY + 14;
  };

  const isCompact = stageWidth < 640;
  const baseSpacing = isCompact ? 136 : Math.min(204, stageWidth * 0.2);

  return (
    <div className="w-full select-none">
      {/* Stage Tali Gantung Interaktif */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onPointerLeave={finishDrag}
        className={`relative mx-auto h-[335px] sm:h-[385px] max-w-5xl overflow-visible touch-pan-y ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Tali Gantung Melengkung (SVG) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 110"
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-0 left-0 w-full h-[110px] z-10 overflow-visible"
        >
          <path
            d="M 0,18 Q 500,98 1000,18"
            fill="none"
            stroke="rgba(121, 84, 61, 0.14)"
            strokeWidth="4"
            transform="translate(0, 4)"
          />
          <path
            d="M 0,18 Q 500,98 1000,18"
            fill="none"
            stroke="#B69168"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M 0,18 Q 500,98 1000,18"
            fill="none"
            stroke="#E7CFAF"
            strokeWidth="1"
            strokeDasharray="5 5"
          />
        </svg>

        {/* Tombol Geser Kiri */}
        {total > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Geser ke buku sebelumnya"
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full
                       bg-[#FFFCF7]/95 border border-[#EBCFA9] text-[#79543D] shadow-md
                       hover:bg-[#929D75] hover:text-white hover:border-[#929D75]
                       active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            ‹
          </button>
        )}

        {/* Barisan 5 Buku Hardcover 3D Gantung */}
        <div className="relative w-full h-full">
          {topFiveBooks.map((book, idx) => {
            const rel = getRelativeOffset(idx);
            const absRel = Math.abs(rel);

            if (absRel > 2) return null;

            const isCenter = rel === 0;
            const translateX = rel * baseSpacing + dragOffset * 0.7;
            const translateY = getRopeDropY(translateX);
            const scale = isCenter ? 1 : absRel === 1 ? 0.85 : 0.73;
            const tilt = isCenter ? 0 : rel < 0 ? -1.8 : 1.8;
            const opacity = isCenter ? 1 : absRel === 1 ? 0.94 : 0.76;
            const zIndex = 30 - absRel * 5;

            return (
              <div
                key={book.id}
                onClick={() => {
                  if (!isCenter && !hasDraggedRef.current) {
                    setActiveIndex(idx);
                  }
                }}
                style={{
                  transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) rotate(${tilt}deg)`,
                  opacity,
                  zIndex,
                }}
                className={`absolute top-0 left-1/2 -ml-[76px] sm:-ml-[92px] w-[152px] sm:w-[184px] origin-top
                            ${
                              isDragging
                                ? 'transition-none'
                                : 'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                            }
                            ${!isCenter ? 'cursor-pointer hover:opacity-100' : ''}`}
              >
                {/* Jepitan Kayu yang Ikut Bergerak di Sepanjang Tali */}
                <WoodenClip rank={idx + 1} isCenter={isCenter} />

                {isCenter ? (
                  <Link
                    href={`/catalog/${book.id}`}
                    draggable={false}
                    onClick={(e) => {
                      if (hasDraggedRef.current) e.preventDefault();
                    }}
                    className="group block focus:outline-hidden"
                  >
                    <HardcoverBook3D book={book} index={idx} isCenter={true} />
                  </Link>
                ) : (
                  <HardcoverBook3D book={book} index={idx} isCenter={false} />
                )}
              </div>
            );
          })}
        </div>

        {/* Tombol Geser Kanan */}
        {total > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Geser ke buku berikutnya"
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full
                       bg-[#FFFCF7]/95 border border-[#EBCFA9] text-[#79543D] shadow-md
                       hover:bg-[#929D75] hover:text-white hover:border-[#929D75]
                       active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            ›
          </button>
        )}
      </div>

      {/* Informasi Buku Aktif di Bawah Tali */}
      <div className="mt-2 text-center max-w-xl mx-auto px-4 space-y-2.5">
        {activeBook.category_name && (
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#FFFDF9]/85 border border-[#EBCFA9]/70 text-[#68774E] text-[10px] font-bold uppercase tracking-[0.16em]">
            {activeBook.category_name}
          </span>
        )}

        <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#79543D] leading-tight">
          {activeBook.title}
        </h3>

        <div className="text-xs text-[#79543D]/75 space-y-0.5">
          <p>
            oleh <strong className="font-semibold text-[#79543D]">{activeBook.author}</strong>
          </p>
          <p className="text-[11px] text-[#79543D]/65">
            Peringkat #{activeIndex + 1} Terpopuler • {borrowCount}x dipinjam •{' '}
            <span className="font-semibold text-[#855B10]">
              ★ {activeBook.avg_rating > 0 ? activeBook.avg_rating : 'Baru'}
            </span>
            {activeBook.publication_year ? ` • Terbit ${activeBook.publication_year}` : ''}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href={`/catalog/${activeBook.id}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#929D75] hover:bg-[#7A865E]
                       text-white text-xs font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5
                       transition-all duration-200 btn-bobo"
          >
            <span>Lihat Detail Buku</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}