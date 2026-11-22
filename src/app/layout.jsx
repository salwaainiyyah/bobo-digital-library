import './globals.css';
import './bobo-intro.css';

export const metadata = {
  title: "Bo\u2019bo (\u1A05\u1A1A\u1A05\u1A1A) \u2014 Perpustakaan Digital Kampus",
  description: 'Sistem informasi perpustakaan digital kampus berbasis budaya Bugis & identitas Universitas Hasanuddin.',
  icons: {
    icon: '/brand/bo-bo-logo.png',
    apple: '/brand/bo-bo-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#F7EBD8] text-[#79543D] antialiased selection:bg-[#929D75] selection:text-white" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
