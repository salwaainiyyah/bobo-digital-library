import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { isAllowedEmailDomain } from '@/lib/auth/permissions';
import { ROLES } from '@/lib/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, password, identityNumber } = body;

    // Validasi Keberadaan Field
    if (!fullName || !email || !password || !identityNumber) {
      return NextResponse.json(
        { message: 'Semua field (Nama Lengkap, Email Kampus, NIM, dan Password) wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanIdentityNumber = identityNumber.trim();

    // Validasi Panjang & Format Dasar
    if (cleanFullName.length < 3) {
      return NextResponse.json(
        { message: 'Nama lengkap minimal 3 karakter.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password minimal 6 karakter demi keamanan akun Anda.' },
        { status: 400 }
      );
    }

    // Validasi Domain Email Kampus
    if (!isAllowedEmailDomain(cleanEmail)) {
      return NextResponse.json(
        { message: 'Registrasi mahasiswa wajib menggunakan email resmi kampus (contoh: @student.unhas.ac.id).' },
        { status: 400 }
      );
    }

    // Periksa Duplikasi Email atau NIM
    const existingCheck = await pool.query(
      'SELECT email, identity_number FROM users WHERE email = $1 OR identity_number = $2',
      [cleanEmail, cleanIdentityNumber]
    );

    if (existingCheck.rows.length > 0) {
      const match = existingCheck.rows[0];
      if (match.email === cleanEmail) {
        return NextResponse.json(
          { message: 'Alamat email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk.' },
          { status: 409 }
        );
      }
      if (match.identity_number === cleanIdentityNumber) {
        return NextResponse.json(
          { message: 'Nomor Induk Mahasiswa (NIM) ini sudah terdaftar dalam sistem.' },
          { status: 409 }
        );
      }
    }

    // Hash Password & Simpan dengan Role 'mahasiswa'
    const passwordHash = await hashPassword(password);

    const insertResult = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, identity_number, is_active)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING id, full_name, email, role, identity_number`,
      [cleanFullName, cleanEmail, passwordHash, ROLES.MAHASISWA, cleanIdentityNumber]
    );

    return NextResponse.json(
      {
        message: 'Pendaftaran akun mahasiswa berhasil! Silakan masuk ke akun Anda.',
        user: insertResult.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/auth/register:', error);
    return NextResponse.json(
      { message: 'Terjadi gangguan internal pada server. Silakan coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}
