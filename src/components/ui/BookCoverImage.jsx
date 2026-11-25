'use client';

import { useState } from 'react';

export default function BookCoverImage({
  src,
  title,
  author,
  fallbackClassName = 'from-[#68774E] to-[#4E5B39] text-[#FAF6EE]',
  fallbackPaddingClassName = 'p-3 pl-4',
  fallbackInnerClassName = 'border border-white/25 rounded-xs h-full p-2 flex flex-col justify-between text-left',
  titleClassName = 'font-editorial text-xs font-bold leading-snug line-clamp-4',
  authorClassName = 'text-[9px] opacity-80 line-clamp-1 border-t border-white/15 pt-1',
  imgClassName = 'w-full h-full object-cover',
  draggable,
  loading,
}) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${fallbackClassName} ${fallbackPaddingClassName} flex flex-col justify-between select-none`}
      >
        <div className={fallbackInnerClassName}>
          <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-[0.15em] opacity-80">
            <span>Bo&apos;bo</span>
            <span className="font-serif text-[10px]">ᨅᨚᨅᨚ</span>
          </div>
          <p className={titleClassName}>{title}</p>
          <p className={authorClassName}>{author}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      draggable={draggable}
      loading={loading}
      onError={() => setImgError(true)}
      className={imgClassName}
    />
  );
}
