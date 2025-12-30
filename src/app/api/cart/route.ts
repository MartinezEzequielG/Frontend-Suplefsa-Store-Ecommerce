import { NextRequest, NextResponse } from 'next/server';
import { API } from '@/lib/backend';

export async function GET(req: NextRequest) {
  const cookie = req.headers.get('cookie') || '';
  const sid = req.cookies.get('sid')?.value || '';
  const res = await fetch(`${API}/cart`, { headers: { Cookie: cookie, 'x-session-id': sid } });
  const text = await res.text();
  if (!res.ok) return NextResponse.json({ error: text }, { status: res.status });
  return new NextResponse(text, { headers: { 'Content-Type': 'application/json' } });
}