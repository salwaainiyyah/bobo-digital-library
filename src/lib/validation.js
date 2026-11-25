export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmailFormat(email) {
  if (typeof email !== 'string') return false;
  return EMAIL_PATTERN.test(email.trim());
}

export function validatePasswordChangeInput(newPassword, confirmPassword) {
  if (typeof newPassword !== 'string' || typeof confirmPassword !== 'string') {
    return 'Password baru dan konfirmasi password wajib diisi.';
  }

  if (newPassword.trim().length === 0) {
    return 'Password baru tidak boleh kosong atau hanya berisi spasi.';
  }

  if (newPassword.length < 6) {
    return 'Password baru minimal harus terdiri dari 6 karakter.';
  }

  if (new TextEncoder().encode(newPassword).length > 72) {
    return 'Password baru terlalu panjang (maksimal 72 byte).';
  }

  if (!confirmPassword) {
    return 'Konfirmasi password baru wajib diisi.';
  }

  if (newPassword !== confirmPassword) {
    return 'Konfirmasi password tidak cocok dengan password baru.';
  }

  return null;
}
