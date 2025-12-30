import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL || 'http://localhost:3001';
  const url = `${backendBase}/uploads/${path.join('/')}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return NextResponse.json({ message: 'Not found' }, { status: res.status });

  const blob = await res.blob();
  return new NextResponse(blob, { headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream' } });
}