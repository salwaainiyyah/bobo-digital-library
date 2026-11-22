import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-auto relative text-[#79543D] overflow-x-clip">
      {/* 1. Transisi Bukit Kampus & Siluet Pohon (SVG Organik) */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none select-none">
        <svg
          viewBox="0 0 1440 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16 sm:h-24 md:h-28 preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Bukit lapisan belakang (hijau sage muda) */}
          <path
            d="M0 78C190 34 380 96 620 74C860 52 1080 18 1440 64V130H0V78Z"
            fill="#D6DFC2"
          />

          {/* Siluet pohon minimalis di bukit kiri */}
          <g fill="#B7C59E">
            <rect x="118" y="46" width="4" height="22" rx="2" />
            <circle cx="120" cy="40" r="13" />
            <circle cx="110" cy="46" r="9" />
            <circle cx="130" cy="46" r="9" />

            <rect x="154" y="54" width="3" height="16" rx="1.5" />
            <circle cx="155.5" cy="49" r="9" />
          </g>

          {/* Siluet pohon kecil di bukit kanan jauh */}
          <g fill="#B7C59E">
            <rect x="1315" y="42" width="4" height="20" rx="2" />
            <circle cx="1317" cy="36" r="12" />
            <circle cx="1308" cy="42" r="8" />
            <circle cx="1326" cy="42" r="8" />
          </g>

          {/* Bukit lapisan depan (menyatu dengan latar utama footer #E6ECD8) */}
          <path
            d="M0 96C260 122 490 66 780 86C1060 105 1260 58 1440 82V130H0V96Z"
            fill="#E6ECD8"
          />
        </svg>
      </div>

      {/* 2. Area Utama Footer (Sage-Cream Lembut & Bersih) */}
      <div className="bg-[#E6ECD8] pt-4 pb-12 relative">
        {/* Watermark aksara Lontara sangat halus di latar */}
        <div
          aria-hidden="true"
          className="absolute bottom-2 left-6 text-8xl sm:text-9xl font-serif text-[#68774E]/[0.05] select-none pointer-events-none"
        >
          ᨅᨚᨅᨚ
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
            
            {/* Kolom 1: Identitas Brand & Filosofi (5 Kolom) */}
            <div className="md:col-span-5 md:pr-8 md:border-r md:border-[#79543D]/15 space-y-4">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-editorial text-3xl font-bold tracking-tight text-[#6B4732]">
                    Bo&apos;bo
                  </span>
                  <span className="font-serif text-lg text-[#68774E] font-semibold">
                    ᨅᨚᨅᨚ
                  </span>
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#68774E] font-bold mt-1">
                  Perpustakaan Digital Kampus Unhas
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#6B4732]/85 leading-relaxed max-w-md">
                Terinspirasi dari bahasa Bugis yang bermakna <em>buku</em> serta lambang kebanggaan almamater{' '}
                <strong className="text-[#5C3B28]">Ayam Jantan dari Timur</strong>. Menghadirkan ruang penjelajahan
                ilmu yang hangat, artistik, dan tertib dalam naungan <em>cozy campus library</em>.
              </p>

              <div className="pt-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6EE] border border-[#929D75]/35 text-xs font-semibold text-[#54603B] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#7A8B58] animate-pulse" />
                  <span>Sistem Sirkulasi Online Aktif 24/7</span>
                </div>
              </div>
            </div>

            {/* Kolom 2: Navigasi Layanan (3 Kolom) */}
            <div className="md:col-span-3 md:px-8 md:border-r md:border-[#79543D]/15 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C3B28]">
                Eksplorasi Pustaka
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#6B4732]/85">
                <li>
                  <Link
                    href="/catalog"
                    className="hover:text-[#54603B] hover:font-medium transition-all flex items-center gap-2 group"
                  >
                    <span className="text-[#7A8B58] group-hover:translate-x-1 transition-transform">→</span>
                    <span>Katalog Koleksi Buku</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#popular"
                    className="hover:text-[#54603B] hover:font-medium transition-all flex items-center gap-2 group"
                  >
                    <span className="text-[#7A8B58] group-hover:translate-x-1 transition-transform">→</span>
                    <span>Buku Terpopuler di Kampus</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#announcements"
                    className="hover:text-[#54603B] hover:font-medium transition-all flex items-center gap-2 group"
                  >
                    <span className="text-[#7A8B58] group-hover:translate-x-1 transition-transform">→</span>
                    <span>Warta Operasional Sirkulasi</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Meja Sirkulasi Fisik + Maskot Bo'bo di Atas Bukit (4 Kolom) */}
            <div className="md:col-span-4 md:pl-8 relative">
              {/* Maskot Bo'bo duduk manis di sudut kanan atas kartu */}
              <div className="flex items-end justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C3B28]">
                  Meja Sirkulasi Fisik
                </h4>

                <div className="relative -mt-12 sm:-mt-16 mr-1 pointer-events-none select-none">
                  <Image
                    src="/brand/bo-bo-logo.png"
                    alt="Maskot Bo'bo membaca buku"
                    width={96}
                    height={96}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_6px_10px_rgba(107,71,50,0.16)]"
                  />
                </div>
              </div>

              <div className="bg-[#FAF6EE]/95 p-4 rounded-2xl border border-[#929D75]/30 shadow-xs space-y-2 text-xs text-[#6B4732]/90">
                <div className="flex justify-between items-center pb-1.5 border-b border-[#EBCFA9]/60">
                  <span className="font-medium">Senin &ndash; Kamis:</span>
                  <strong className="text-[#5C3B28]">08.00 &ndash; 16.00 WITA</strong>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-[#EBCFA9]/60">
                  <span className="font-medium">Jumat:</span>
                  <strong className="text-[#5C3B28]">08.00 &ndash; 16.30 WITA</strong>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-[#EBCFA9]/60">
                  <span className="font-medium">Sabtu:</span>
                  <strong className="text-[#5C3B28]">08.30 &ndash; 13.00 WITA</strong>
                </div>
                <p className="text-[11px] text-[#6B4732]/70 pt-1 leading-relaxed flex items-start gap-1.5">
                  <span aria-hidden="true">📍</span>
                  <span>Lantai 1 Gedung Perpustakaan Pusat, Kampus Tamalanrea, Makassar.</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Sub-Footer Bar (Hijau Sage Hangat sebagai Pengunci Bawah) */}
      <div className="bg-[#68774E] text-[#F7EBD8] py-4">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
          <p className="text-[#F7EBD8]/90 text-center sm:text-left">
            &copy; 2026 Bo&apos;bo (ᨅᨚᨅᨚ). Tugas Final Praktikum Pemrograman Web 2026.
          </p>
          <div className="flex items-center gap-2.5 text-[#F7EBD8]">
            <span className="font-semibold tracking-wide">Universitas Hasanuddin</span>
            <span className="text-[#F7EBD8]/50">&bull;</span>
            <span className="font-serif text-sm text-[#DCE5C8]">ᨅᨚᨅᨚ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}