import { redirect } from 'next/navigation';
import { verifySession } from './session';
import { DEFAULT_CONFIG, ROLES } from '@/lib/constants';

export async function getCurrentUser() {
  const session = await verifySession();
  return session ? session.user : null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireRole(allowedRoles = []) {
  const user = await requireUser();
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!rolesArray.includes(user.role)) {
    if (user.role === ROLES.ADMIN) redirect('/dashboard/admin');
    if (user.role === ROLES.PEGAWAI) redirect('/dashboard/pegawai');
    if (user.role === ROLES.MAHASISWA) redirect('/dashboard/mahasiswa');
    redirect('/login');
  }

  return user;
}

export async function restrictStaffFromPublicPages() {
  const user = await getCurrentUser();

  if (user && (user.role === ROLES.ADMIN || user.role === ROLES.PEGAWAI)) {
    redirect('/dashboard');
  }

  return user;
}

export function isAllowedEmailDomain(email) {
  if (!email || typeof email !== 'string') return false;
  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return DEFAULT_CONFIG.ALLOWED_EMAIL_DOMAINS.includes(domain);
}