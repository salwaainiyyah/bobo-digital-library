'use client';

import { useState, useEffect, useRef } from 'react';
import Badge from '@/components/ui/Badge';
import Portal from '@/components/ui/Portal';
import { getRoleBadgeVariant } from '@/lib/constants';
import { validatePasswordChangeInput } from '@/lib/validation';
import { resetUserPasswordAction } from '@/app/actions/users';

function evaluatePasswordStrength(password) {
  if (!password) {
    return {
      level: 0,
      label: 'Belum diisi',
      textColor: 'text-[#6E5038]/65',
      barColor: 'bg-[#EAD5B5]',
      checks: {
        minLength: false,
        mixedCase: false,
        hasNumber: false,
        hasSymbol: false,
      },
    };
  }

  const checks = {
    minLength: password.length >= 6,
    mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };

  if (!checks.minLength) {
    return {
      level: 1,
      label: 'Terlalu Pendek',
      textColor: 'text-[#A84A3B]',
      barColor: 'bg-[#C96858]',
      checks,
    };
  }

  let score = 1;
  if (password.length >= 8) score += 1;
  if (checks.mixedCase || checks.hasNumber) score += 1;
  if (checks.hasSymbol || (password.length >= 10 && checks.mixedCase && checks.hasNumber)) score += 1;
  const clamped = Math.min(4, score);

  if (clamped === 1) {
    return {
      level: 1,
      label: 'Lemah',
      textColor: 'text-[#A84A3B]',
      barColor: 'bg-[#C96858]',
      checks,
    };
  }
  if (clamped === 2) {
    return {
      level: 2,
      label: 'Cukup',
      textColor: 'text-[#9A6B19]',
      barColor: 'bg-[#D99B26]',
      checks,
    };
  }
  if (clamped === 3) {
    return {
      level: 3,
      label: 'Kuat',
      textColor: 'text-[#556B43]',
      barColor: 'bg-[#7B9663]',
      checks,
    };
  }

  return {
    level: 4,
    label: 'Sangat Kuat',
    textColor: 'text-[#425732]',
    barColor: 'bg-[#556B43]',
    checks,
  };
}

function EyeToggleIcon({ visible }) {
  if (visible) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function getInitials(fullName) {
  if (!fullName) return 'U';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ChangePasswordModal({
  targetUser,
  currentAdminId,
  onClose,
  onSuccess,
  onError,
}) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inlineError, setInlineError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newPasswordInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      newPasswordInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, onClose]);

  if (!targetUser) {
    return null;
  }

  const strength = evaluatePasswordStrength(newPassword);
  const hasConfirmInput = confirmPassword.length > 0;
  const passwordsMatch = hasConfirmInput && newPassword === confirmPassword;
  const passwordsMismatch = hasConfirmInput && newPassword !== confirmPassword;
  const isSelf = targetUser.id === currentAdminId;

  const roleBadgeVariant = getRoleBadgeVariant(targetUser.role);

  async function handleSubmit(e) {
    e.preventDefault();
    setInlineError('');

    const validationError = validatePasswordChangeInput(newPassword, confirmPassword);
    if (validationError) {
      setInlineError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('newPassword', newPassword);
      formData.append('confirmPassword', confirmPassword);

      const res = await resetUserPasswordAction(targetUser.id, formData);

      setIsSubmitting(false);

      if (res.success) {
        onSuccess(res.message || `Password akun "${targetUser.full_name}" berhasil diperbarui.`);
      } else {
        const msg = res.error || 'Gagal memperbarui password akun pengguna.';
        setInlineError(msg);
        onError?.(msg);
      }
    } catch {
      setIsSubmitting(false);
      const msg = 'Terjadi gangguan komunikasi dengan server. Silakan coba lagi.';
      setInlineError(msg);
      onError?.(msg);
    }
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2116]/45 backdrop-blur-xs animate-fade-in"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-modal-title"
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[28px] border-2 border-[#E4CEAD] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_14px_34px_rgba(46,33,22,0.28)] space-y-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#8BA372]/45 bg-[#EEF4E6] text-[#556B43] shadow-2xs">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#8BA372]/40 bg-[#EEF4E6] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#556B43]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7B9663]" />
                <span>Keamanan Akun</span>
              </div>
              <h3
                id="change-password-modal-title"
                className="font-editorial text-xl font-bold text-[#5A3E28] mt-1.5 leading-tight"
              >
                Ubah Password
              </h3>
              <p className="text-xs text-[#6E5038]/80 mt-0.5">
                Atur ulang kata sandi baru untuk akun pengguna ini.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Tutup modal ubah password"
            className="rounded-xl p-1.5 text-[#79543D]/70 hover:text-[#5A3E28] hover:bg-[#F8F1E3] transition-colors cursor-pointer disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Kartu Ringkasan Akun yang Dikelola */}
        <div className="rounded-2xl border border-[#EAD5B5] bg-[#FAF4E8] p-3.5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#79543D] text-[#FFFDF9] font-editorial text-sm font-bold shadow-2xs">
            {getInitials(targetUser.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="truncate text-xs font-bold text-[#5A3E28]">{targetUser.full_name}</p>
              <Badge variant={roleBadgeVariant} className="text-[10px] py-0 px-2">
                {targetUser.role}
              </Badge>
              {isSelf && (
                <span className="text-[10px] font-semibold text-[#556B43]">(Akun Anda)</span>
              )}
            </div>
            <p className="truncate text-[11px] text-[#6E5038]/80 mt-0.5">{targetUser.email}</p>
            {targetUser.identity_number && (
              <p className="font-mono text-[10px] text-[#79543D]/70 mt-0.5">
                ID/NIM: {targetUser.identity_number}
              </p>
            )}
          </div>
        </div>

        {/* Form Ubah Password */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate autoComplete="off">
          {inlineError && (
            <div
              role="alert"
              className="rounded-2xl border border-[#C96858]/40 bg-[#FDF1EE] px-3.5 py-2.5 text-xs font-medium text-[#8A3729] flex items-start gap-2 animate-fade-in"
            >
              <svg
                className="h-4 w-4 shrink-0 mt-0.5 text-[#C96858]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{inlineError}</span>
            </div>
          )}

          {/* Input Password Baru */}
          <div>
            <label
              htmlFor="admin-reset-new-password"
              className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5"
            >
              Password Baru
            </label>
            <div className="relative">
              <input
                ref={newPasswordInputRef}
                id="admin-reset-new-password"
                type={showNewPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (inlineError) setInlineError('');
                }}
                disabled={isSubmitting}
                placeholder="Minimal 6 karakter"
                className="w-full pl-3.5 pr-11 py-2.5 rounded-2xl bg-[#FAF4E8] border border-[#DFC7A2] text-sm text-[#5A3E28] placeholder:text-[#79543D]/45 focus:outline-hidden focus:ring-2 focus:ring-[#7B9663] transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                disabled={isSubmitting}
                aria-label={showNewPassword ? 'Sembunyikan password baru' : 'Tampilkan password baru'}
                title={showNewPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute inset-y-0 right-0 flex items-center px-3.5 text-[#79543D]/70 hover:text-[#5A3E28] transition-colors cursor-pointer"
              >
                <EyeToggleIcon visible={showNewPassword} />
              </button>
            </div>

            {/* Indikator Kekuatan Password */}
            <div className="mt-2.5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#6E5038]/80 font-medium">Kekuatan Password</span>
                <span className={`font-bold ${strength.textColor}`}>{strength.label}</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                {[1, 2, 3, 4].map((segment) => (
                  <div
                    key={segment}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      strength.level >= segment ? strength.barColor : 'bg-[#EAD5B5]/70'
                    }`}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-0.5 text-[10.5px]">
                <span
                  className={`inline-flex items-center gap-1 transition-colors ${
                    strength.checks.minLength ? 'text-[#425732] font-semibold' : 'text-[#6E5038]/70'
                  }`}
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      strength.checks.minLength ? 'bg-[#6F8859]' : 'bg-[#DFC7A2]'
                    }`}
                  />
                  Min. 6 karakter
                </span>
                <span
                  className={`inline-flex items-center gap-1 transition-colors ${
                    strength.checks.mixedCase ? 'text-[#425732] font-semibold' : 'text-[#6E5038]/70'
                  }`}
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      strength.checks.mixedCase ? 'bg-[#6F8859]' : 'bg-[#DFC7A2]'
                    }`}
                  />
                  Huruf besar &amp; kecil
                </span>
                <span
                  className={`inline-flex items-center gap-1 transition-colors ${
                    strength.checks.hasNumber || strength.checks.hasSymbol
                      ? 'text-[#425732] font-semibold'
                      : 'text-[#6E5038]/70'
                  }`}
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      strength.checks.hasNumber || strength.checks.hasSymbol
                        ? 'bg-[#6F8859]'
                        : 'bg-[#DFC7A2]'
                    }`}
                  />
                  Angka / simbol
                </span>
              </div>
            </div>
          </div>

          {/* Input Konfirmasi Password */}
          <div>
            <label
              htmlFor="admin-reset-confirm-password"
              className="block text-[11px] font-bold text-[#5A3E28] uppercase tracking-wider mb-1.5"
            >
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                id="admin-reset-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (inlineError) setInlineError('');
                }}
                disabled={isSubmitting}
                placeholder="Ketik ulang password baru"
                className={`w-full pl-3.5 pr-11 py-2.5 rounded-2xl bg-[#FAF4E8] border text-sm text-[#5A3E28] placeholder:text-[#79543D]/45 focus:outline-hidden focus:ring-2 transition-all disabled:opacity-60 ${
                  passwordsMismatch
                    ? 'border-[#C96858] focus:ring-[#C96858]/50'
                    : passwordsMatch
                    ? 'border-[#8BA372] focus:ring-[#7B9663]'
                    : 'border-[#DFC7A2] focus:ring-[#7B9663]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isSubmitting}
                aria-label={
                  showConfirmPassword
                    ? 'Sembunyikan konfirmasi password'
                    : 'Tampilkan konfirmasi password'
                }
                title={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute inset-y-0 right-0 flex items-center px-3.5 text-[#79543D]/70 hover:text-[#5A3E28] transition-colors cursor-pointer"
              >
                <EyeToggleIcon visible={showConfirmPassword} />
              </button>
            </div>

            {/* Feedback Validasi Kesesuaian */}
            {hasConfirmInput && (
              <p
                className={`mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold ${
                  passwordsMatch ? 'text-[#425732]' : 'text-[#A84A3B]'
                }`}
              >
                {passwordsMatch ? (
                  <>
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Password baru dan konfirmasi cocok.</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Konfirmasi password belum sesuai dengan password baru.</span>
                  </>
                )}
              </p>
            )}
          </div>

          <p className="text-[11px] text-[#6E5038]/75 leading-relaxed rounded-xl bg-[#F8F1E3]/70 border border-[#EAD5B5]/70 px-3 py-2">
            Demi keamanan, password lama tidak ditampilkan. Setelah disimpan, akun akan menggunakan password baru ini pada login berikutnya.
          </p>

          {/* Tombol Batal & Simpan Perubahan */}
          <div className="flex gap-2.5 pt-3 border-t border-[#EAD5B5]/70">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-[#E4CEAD] bg-[#FFFDF9] hover:bg-[#F8F1E3] text-xs font-bold text-[#5A3E28] transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#79543D] hover:bg-[#5f402c] text-white text-xs font-bold shadow-[0_3px_0_#4A3122] transition-all active:translate-y-0.5 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting && (
                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
}
