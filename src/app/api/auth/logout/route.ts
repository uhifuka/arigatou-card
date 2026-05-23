import { NextResponse } from 'next/server';
import { getClearSessionCookieOptions } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ data: { success: true } });
  response.cookies.set(getClearSessionCookieOptions());
  return response;
}
