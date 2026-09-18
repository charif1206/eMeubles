import { cookies } from 'next/headers';
import crypto from 'crypto';
import prisma from './db';
import { Role } from '@prisma/client';

const SECRET_KEY = process.env.JWT_SECRET || 'arwaqa-dar-design-super-secret-key-2026-dz';
const COOKIE_NAME = 'arwaqa_admin_session';

export interface SessionPayload {
  userId: string;
  username: string;
  role: Role;
  expiresAt: number;
}

// Sign payload: base64(payload) + '.' + hmac(base64(payload))
export function createSessionToken(payload: Omit<SessionPayload, 'expiresAt'>, remember: boolean = true): string {
  const duration = remember ? 14 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const data: SessionPayload = {
    ...payload,
    expiresAt: Date.now() + duration,
  };
  const str = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(str).digest('base64url');
  return `${str}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [str, sig] = token.split('.');
    if (!str || !sig) return null;
    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(str).digest('base64url');
    if (sig !== expectedSig) return null;

    const payload: SessionPayload = JSON.parse(Buffer.from(str, 'base64url').toString('utf-8'));
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string, remember: boolean = true) {
  const cookieStore = cookies();
  const maxAge = remember ? 14 * 24 * 60 * 60 : 24 * 60 * 60;
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== Role.ADMIN) {
    throw new Error('FORBIDDEN');
  }
  return session;
}
