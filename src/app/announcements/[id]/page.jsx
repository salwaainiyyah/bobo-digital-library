import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getCurrentUser } from '@/lib/auth/permissions';
import { getAnnouncementById } from '@/lib/queries/announcements';

export const revalidate = 0;

export default async function AnnouncementDetailPage({ params }) {
  const user = await getCurrentUser();
  const { id } = await params;
  const annId = parseInt(id, 10);

  if (isNaN(annId)) notFound();

  const announcement = await getAnnouncementById(annId);
  if (!announcement) notFound();

  // Jika masih DRAFT, hanya pegawai dan admin yang boleh membaca
  if (announcement.status === 'DRAFT') {
    if (!user || (user.role !== 'admin' && user.role !== 'pegawai')) {
      notFound();
    }
  }

  const categoryVariant =
    announcement.category === 'ACARA' ? 'yellow' : announcement.category === 'OPERASIONAL' ? 'terracotta' : 'sage';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EBD8]">
      <Navbar initialUser={user} />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-[#79543D]/70 mb-8">
            <Link href="/" className="hover:text-[#929D75] transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/announcements" className="hover:text-[#929D75] transition-colors">Warta & Pengumuman</Link>
            <span>/</span>
            <span className="text-[#79543D] font-semibold truncate max-w-[240px]">{announcement.title}</span>
          </nav>

          <ScrollReveal variant="up">
            <article className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-12 border border-[#EBCFA9]/70 shadow-sm space-y-8 relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#929D75]/20 rounded-tr-xl" />

              <div className="space-y-4 border-b border-[#EBCFA9]/60 pb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={categoryVariant}>{announcement.category}</Badge>
                  {announcement.status === 'DRAFT' && <Badge variant="terracotta">Status: DRAFT Internal</Badge>}
                  <time className="text-xs text-[#79543D]/60 font-medium">
                    {new Date(announcement.release_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </div>

                <h1 className="font-editorial text-3xl sm:text-4xl text-[#79543D] leading-tight">
                  {announcement.title}
                </h1>

                <div className="flex items-center gap-2 text-xs text-[#79543D]/70 pt-1">
                  <span>Diterbitkan oleh: <strong>{announcement.author_name || 'Staf Perpustakaan'}</strong></span>
                  {announcement.author_role && <span>({announcement.author_role})</span>}
                </div>
              </div>

              <div className="text-sm sm:text-base text-[#79543D]/85 leading-relaxed whitespace-pre-line space-y-4 font-sans">
                {announcement.content}
              </div>

              <div className="pt-6 border-t border-[#EBCFA9]/60 flex flex-wrap justify-between items-center gap-4 text-xs">
                <Link
                  href="/announcements"
                  className="font-semibold text-[#929D75] hover:text-[#7e8963] transition-colors flex items-center gap-1.5"
                >
                  <span>←</span>
                  <span>Kembali ke Arsip Warta</span>
                </Link>
                <Link
                  href="/catalog"
                  className="font-semibold text-[#C96858] hover:underline flex items-center gap-1.5"
                >
                  <span>Jelajahi Katalog Buku</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
