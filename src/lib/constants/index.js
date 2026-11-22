export const ROLES = {
  ADMIN: 'admin',
  PEGAWAI: 'pegawai',
  MAHASISWA: 'mahasiswa',
  GUEST: 'guest',
};

export const LOAN_STATUS = {
  PENDING: 'PENDING',       // Menunggu Konfirmasi
  BORROWED: 'BORROWED',     // Sedang Dipinjam
  COMPLETED: 'COMPLETED',   // Selesai
  REJECTED: 'REJECTED',     // Ditolak
};

export const RENEWAL_STATUS = {
  PENDING: 'PENDING',       // Perpanjangan Diajukan
  APPROVED: 'APPROVED',     // Perpanjangan Disetujui
  REJECTED: 'REJECTED',     // Perpanjangan Ditolak
};

export const FINE_STATUS = {
  UNPAID: 'UNPAID',         // Tertunggak
  PAID: 'PAID',             // Lunas
};

export const ANNOUNCEMENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
};

export const ANNOUNCEMENT_CATEGORIES = ['OPERASIONAL', 'LAYANAN', 'ACARA'];

export const DEFAULT_CONFIG = {
  LOAN_DURATION_DAYS: 7,
  RENEWAL_EXTENSION_DAYS: 7,
  MAX_RENEWALS: 1,
  DEFAULT_FINE_PER_DAY: 1000.00,
  SESSION_EXPIRY_DAYS: 7,
  COOKIE_NAME: 'bobo_session',
  ALLOWED_EMAIL_DOMAINS: (process.env.ALLOWED_EMAIL_DOMAINS || 'student.unhas.ac.id,unhas.ac.id,mail.com')
    .split(',')
    .map(d => d.trim().toLowerCase())
    .filter(Boolean),
};
