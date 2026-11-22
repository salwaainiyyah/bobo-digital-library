'use client';

import { useState } from 'react';

export default function JournalBookCover({
  coverUrl,
  title,
  author,
  isCompleted = true,
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(coverUrl) && !imgError;

  return (
    <div className="w-full md:w-32 shrink-0 rounded-2xl border border-[#EAD5B5] bg-[#F8F1E3]/85 p-3.5 flex items-center justify-center">
      <div className="relative w-20 sm:w-[88px] aspect-[3/4.2] group">
        {/* Aksen Selotip Jurnal (Washi Tape) di Atas Sampul */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 z-20 h-3 w-10 -rotate-2 rounded-xs border border-[#D49F3B]/35 bg-[#E2AE4B]/40 backdrop-blur-[1px]"
        />

        {/* Badan Buku dengan Efek Tumpukan Halaman di Sisi Kanan */}
        <div className="relative h-full w-full overflow-hidden rounded-r-lg rounded-l-xs border border-[#C9A87C]/80 bg-[#FFFDF9] shadow-[3px_3px_0_#FFFDF9,4px_4px_0_#D8BC94,6px_8px_14px_rgba(90,62,40,0.16)] transition-transform duration-300 group-hover:-translate-y-0.5">
          {/* Lipatan Punggung Buku (Book Spine) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-2.5 bg-gradient-to-r from-black/25 via-white/20 to-transparent"
          />

          {showImage ? (
            <img
              src={coverUrl}
              alt={title}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            /* Sampul Kain Hardcover Otomatis Jika Gambar Tidak Tersedia */
            <div
              className={`flex h-full w-full flex-col justify-between p-2.5 pl-3.5 text-[#FDF9F3] ${
                isCompleted
                  ? 'bg-gradient-to-br from-[#5C724B] to-[#3E4F32]'
                  : 'bg-gradient-to-br from-[#8C5A45] to-[#633D2E]'
              }`}
            >
              <div className="flex items-center justify-between text-[7px] tracking-widest opacity-80 border-b border-white/20 pb-1">
                <span>BO&apos;BO</span>
                <span className="font-serif">ᨅᨚᨅᨚ</span>
              </div>

              <p className="font-editorial text-[10px] font-bold leading-tight line-clamp-4 my-auto">
                {title}
              </p>

              <p className="truncate text-[7.5px] opacity-75 border-t border-white/15 pt-1">
                {author}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}