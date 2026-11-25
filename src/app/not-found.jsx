import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: "404 — Halaman Tidak Ditemukan | Bo'bo Digital Library",
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-bobo-cream text-bobo-cocoa relative overflow-hidden texture-grain">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-bobo-beige/40 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-bobo-sage/20 blur-3xl" />
      </div>

      <header className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/90 rounded-2xl p-1 border border-bobo-beige shadow-2xs flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/brand/bo-bo-logo.png"
                alt="Maskot Bo'bo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-xl text-bobo-cocoa">Bo&apos;bo</span>
                <span className="font-serif text-xs font-semibold text-bobo-sage">ᨅᨚᨅᨚ</span>
              </div>
              <span className="text-[10px] text-bobo-cocoa/65 font-medium">
                Perpustakaan Digital Kampus
              </span>
            </div>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pt-4 pb-14">
        <div className="relative w-full max-w-xl">
          <div
            aria-hidden="true"
            className="absolute -bottom-3 inset-x-8 h-6 rounded-full bg-bobo-cocoa-dark/20 blur-xl"
          />

          <div
            aria-hidden="true"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
            }}
            className="absolute -top-2 right-10 z-20 h-12 w-7 bg-bobo-terracotta shadow-sm"
          />

          <div className="relative rounded-[28px] border-2 border-bobo-cocoa-dark bg-bobo-cocoa p-2 sm:p-2.5 shadow-[0_18px_38px_rgba(90,60,42,0.16)]">
            <div className="rounded-[22px] border border-bobo-beige-dark bg-bobo-beige pb-1.5">
              <div className="relative rounded-[20px] border border-bobo-beige bg-bobo-cream-light px-6 py-9 sm:px-12 sm:py-11 text-center overflow-hidden">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 rounded-[15px] border border-bobo-beige/80"
                />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-bobo-cream border border-bobo-beige px-3.5 py-1 text-[11px] font-bold text-bobo-cocoa">
                    <span className="font-serif text-xs text-bobo-sage">ᨅᨚᨅᨚ</span>
                    <span className="text-bobo-cocoa/35">•</span>
                    <span className="uppercase tracking-[0.16em] text-[10px]">
                      Lembar Tidak Ditemukan
                    </span>
                  </div>

                  <div className="relative mt-6 mb-4 h-24 w-28 sm:h-28 sm:w-32 flex items-center justify-center">
                    <div
                      aria-hidden="true"
                      className="absolute h-24 w-24 rounded-full bg-bobo-cream border border-bobo-beige"
                    />
                    <div className="relative h-22 w-26 sm:h-24 sm:w-28 animate-float-slow">
                      <Image
                        src="/brand/bo-bo-logo.png"
                        alt="Maskot ayam Bo'bo"
                        fill
                        priority
                        sizes="112px"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <p className="font-editorial text-6xl sm:text-7xl font-extrabold tracking-tight text-bobo-terracotta leading-none">
                    404
                  </p>

                  <h1 className="mt-3 font-editorial text-2xl sm:text-3xl text-bobo-cocoa-dark">
                    Halaman Tidak Ditemukan
                  </h1>

                  <p className="mt-2.5 max-w-sm text-xs sm:text-sm text-bobo-cocoa/75 leading-relaxed">
                    Halaman atau koleksi pustaka yang kamu cari tidak tersedia di rak{' '}
                    <strong className="font-semibold text-bobo-cocoa">Bo&apos;bo</strong> atau tautannya telah dipindahkan.
                  </p>

                  <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                    <Link
                      href="/"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-bobo-sage hover:bg-bobo-sage-dark px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:-translate-y-0.5 btn-bobo"
                    >
                      <span>← Kembali ke Beranda</span>
                    </Link>

                    <Link
                      href="/catalog"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/90 hover:bg-bobo-cream border border-bobo-beige px-6 py-3 text-xs sm:text-sm font-semibold text-bobo-cocoa transition-colors"
                    >
                      <span>Jelajahi Katalog</span>
                    </Link>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mt-8 w-full flex items-center justify-between text-[11px] text-bobo-cocoa/35"
                  >
                    <span className="font-editorial-italic">404</span>
                    <span className="text-bobo-yellow">✦</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}