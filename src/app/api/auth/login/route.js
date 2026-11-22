import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { comparePassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query user berdasarkan email
    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role, identity_number, is_active
       FROM users
       WHERE email = $1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Email atau password yang Anda masukkan tidak sesuai.' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Cek apakah akun dinonaktifkan
    if (!user.is_active) {
      return NextResponse.json(
        { message: 'Akun Anda berstatus nonaktif. Silakan hubungi staf perpustakaan atau administrator.' },
        { status: 403 }
      );
    }

    // Verifikasi password dengan bcrypt
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Email atau password yang Anda masukkan tidak sesuai.' },
        { status: 401 }
      );
    }

    // Buat session aman (HttpOnly cookie)
    await createSession(user.id);

    return NextResponse.json(
      {
        message: 'Login berhasil!',
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          identityNumber: user.identity_number,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    return NextResponse.json(
      { message: 'Terjadi gangguan internal pada server. Silakan coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}
