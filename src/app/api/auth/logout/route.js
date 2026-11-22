import { NextResponse } from 'next/server';
import { revokeSession } from '@/lib/auth/session';

export async function POST() {
  try {
    await revokeSession();
    return NextResponse.json(
      { message: 'Anda telah berhasil keluar dari akun.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/auth/logout:', error);
    return NextResponse.json(
      { message: 'Terjadi gangguan saat memproses logout.' },
      { status: 500 }
    );
  }
}
