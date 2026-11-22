import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password wajib diisi');
  }
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
  if (!password || !hash) return false;
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}
