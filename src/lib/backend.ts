// src/lib/backend.ts

export const API =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api/V1';

// OJO: este es el host público del backend (sin /api/v1)
export const ASSETS_BASE =
  process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL || 'http://localhost:3001';

export function imageUrl(raw?: string | null) {
  const url = (raw || '').trim();
  if (!url) return '/no-image.png';

  // ✅ S3 / CloudFront / URL absoluta
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // ✅ legacy: backend sirve /uploads como estático
  if (url.startsWith('/uploads/')) return `${ASSETS_BASE}${url}`;
  if (url.startsWith('uploads/')) return `${ASSETS_BASE}/${url}`;

  // ✅ por si te llega "/api/v1/uploads/..."
  if (url.startsWith('/api/')) return `${ASSETS_BASE}${url.replace(/\/api\/v1/i, '')}`;

  // fallback: filename suelto
  return `${ASSETS_BASE}/uploads/${url.replace(/^\/+/, '')}`;
}

export async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      ...(init?.headers || {}),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Backend error ${res.status}: ${text.slice(0, 500)}`);
  return JSON.parse(text) as T;
}
