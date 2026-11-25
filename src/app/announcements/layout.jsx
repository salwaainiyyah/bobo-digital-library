import { restrictStaffFromPublicPages } from '@/lib/auth/permissions';

export default async function PublicSectionLayout({ children }) {
  await restrictStaffFromPublicPages();
  return children;
}