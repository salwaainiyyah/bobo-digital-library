'use client';

import { useState } from 'react';

const HARDCOVER_THEMES = [
  'from-[#68774E] to-[#4E5B39] border-[#DCE5C8]/40 text-[#FAF6EE]',
  'from-[#8C5A3C] to-[#6B4229] border-[#EBCFA9]/40 text-[#FAF6EE]',
  'from-[#B5654D] to-[#8F4934] border-[#F7EBD8]/40 text-[#FAF6EE]',
  'from-[#5A6E65] to-[#3F5049] border-[#D7E4DE]/40 text-[#FAF6EE]',
];

export default function BookCoverImage({ src, title, author, index = 0 }) {
  const [hasError, setHasError] = useState(false);
  const theme = HARDCOVER_THEMES[index % HARDCOVER_THEMES.length];

  if (!src || hasError) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${theme} p-3 pl-3.5 flex flex-col justify-between`}>
        <div className="border border-white/25 rounded-xs h-full p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-[0.15em] opacity-80">
            <span>Bo&apos;bo</span>
            <span className="font-serif text-[10px]">ᨅᨚᨅᨚ</span>
          </div>

          <p className="font-editorial text-[11px] sm:text-xs font-bold leading-snug line-clamp-4">
            {title}
          </p>

          <p className="text-[9px] opacity-80 line-clamp-1 border-t border-white/15 pt-1">
            {author}
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />
  );
}