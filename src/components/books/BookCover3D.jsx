'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function BookCover3D({ coverUrl, title, stockAvailable }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer select-none py-6 px-4 flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Book Container */}
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
            : 'rotateY(-8deg) rotateX(2deg)',
          width: '100%',
          maxWidth: '300px',
        }}
      >
        {/* Left Book Spine (3D depth) */}
        <div
          className="absolute left-0 top-0 h-full rounded-l-md pointer-events-none"
          style={{
            width: '26px',
            background: 'linear-gradient(90deg, rgba(30, 20, 15, 0.45) 0%, rgba(121, 84, 61, 0.25) 40%, rgba(255, 255, 255, 0.12) 80%, rgba(0, 0, 0, 0.15) 100%)',
            transform: 'rotateY(-90deg) translateZ(13px)',
            transformOrigin: 'left center',
          }}
        />

        {/* Right Page Thickness (3D depth) */}
        <div
          className="absolute top-0 right-0 h-full rounded-r-xs pointer-events-none"
          style={{
            width: '20px',
            transform: 'rotateY(90deg) translateZ(10px)',
            transformOrigin: 'right center',
            background: 'linear-gradient(90deg, #e8dfd1 0%, #f7f0e4 30%, #ddd4c5 50%, #f7f0e4 80%, #cfc5b4 100%)',
            borderRight: '1px solid rgba(121, 84, 61, 0.2)',
          }}
        />

        {/* Top Edge (Page thickness) */}
        <div
          className="absolute top-0 left-0 w-full pointer-events-none"
          style={{
            height: '20px',
            transform: 'rotateX(90deg) translateZ(10px)',
            transformOrigin: 'top center',
            background: 'linear-gradient(180deg, #f7f0e4 0%, #e8dfd1 100%)',
          }}
        />

        {/* Main Cover Front Face */}
        <div
          className="relative aspect-[3/4.2] rounded-r-xl rounded-l-xs overflow-hidden transition-all duration-300"
          style={{
            boxShadow: isHovered
              ? '0 30px 60px -12px rgba(121, 84, 61, 0.4), 0 18px 36px -18px rgba(0, 0, 0, 0.25), -8px 0 20px rgba(0,0,0,0.1)'
              : '0 20px 45px -10px rgba(121, 84, 61, 0.3), 0 10px 20px -10px rgba(0, 0, 0, 0.15), -4px 0 12px rgba(0,0,0,0.08)',
          }}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#79543D] via-[#855B10] to-[#5a3c2a] text-[#F7EBD8] p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#F7EBD8]/20 pb-3">
                <span className="font-editorial text-xs tracking-widest uppercase">Bo&apos;bo Pustaka</span>
                <span className="font-serif text-sm">ᨅᨚᨅᨚ</span>
              </div>
              <h3 className="font-editorial text-2xl font-bold leading-tight">{title}</h3>
              <div className="text-[11px] font-sans text-[#F7EBD8]/70 border-t border-[#F7EBD8]/20 pt-3">
                Edisi Koleksi Kampus Unhas
              </div>
            </div>
          )}

          {/* Book Spine Crease Highlight */}
          <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-gradient-to-r from-black/30 via-white/10 to-transparent pointer-events-none" />
          <div className="absolute left-[8px] top-0 bottom-0 w-[2px] bg-black/10 pointer-events-none" />

          {/* Dynamic Light Sheen on Hover */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 - rotateX * 2}%, rgba(255,255,255,0.25) 0%, transparent 65%)`,
              }}
            />
          )}

          {/* Bookmark Ribbon */}
          <div className="absolute -top-1 right-8 z-10">
            <div className="w-5 h-14 bg-[#C96858] shadow-md relative rounded-b-xs flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#fce8e6] mt-1 shadow-inner" />
              <div className="absolute -bottom-2 left-0 right-0 h-2 bg-[#C96858] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
            </div>
          </div>

          {/* Availability Status Badge */}
          <div className="absolute bottom-3 right-3 z-10">
            {stockAvailable <= 0 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#C96858] text-white shadow-md">
                Stok Habis
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#929D75] text-white shadow-md">
                Tersedia {stockAvailable} Buku
              </span>
            )}
          </div>
        </div>

        {/* 3D Realistic Ground Cast Shadow */}
        <div
          className="absolute -bottom-6 left-4 right-4 h-6 rounded-full pointer-events-none transition-all duration-300"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(121, 84, 61, 0.35) 0%, rgba(121, 84, 61, 0.08) 50%, transparent 80%)',
            transform: `scale(${isHovered ? 1.08 : 0.95}) translateY(${isHovered ? 8 : 0}px)`,
            filter: 'blur(6px)',
          }}
        />
      </div>
    </div>
  );
}
