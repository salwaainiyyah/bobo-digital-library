import crypto from 'crypto';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { DEFAULT_CONFIG } from '@/lib/constants';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + DEFAULT_CONFIG.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  const cookieStore = await cookies();
  cookieStore.set(DEFAULT_CONFIG.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

export async function verifySession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(DEFAULT_CONFIG.COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const tokenHash = hashToken(sessionCookie.value);

    const result = await pool.query(
      `SELECT s.id AS session_id, s.expires_at,
              u.id, u.full_name, u.email, u.role, u.identity_number, u.is_active
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token_hash = $1
         AND s.expires_at > CURRENT_TIMESTAMP
         AND s.revoked_at IS NULL
         AND u.is_active = TRUE`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      sessionId: row.session_id,
      user: {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        role: row.role,
        identityNumber: row.identity_number,
      },
    };
  } catch (error) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error('Error verifying session:', error);
    return null;
  }
}

export async function revokeSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(DEFAULT_CONFIG.COOKIE_NAME);

    if (sessionCookie && sessionCookie.value) {
      const tokenHash = hashToken(sessionCookie.value);
      await pool.query(
        `UPDATE sessions
         SET revoked_at = CURRENT_TIMESTAMP
         WHERE token_hash = $1 AND revoked_at IS NULL`,
        [tokenHash]
      );
    }

    cookieStore.delete(DEFAULT_CONFIG.COOKIE_NAME);
    return true;
  } catch (error) {
    console.error('Error revoking session:', error);
    return false;
  }
}
