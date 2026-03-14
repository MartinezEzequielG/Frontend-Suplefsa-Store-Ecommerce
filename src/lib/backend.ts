function stripTrailingSlash(value?: string | null) {
  return (value || '').trim().replace(/\/+$/, '');
}

export const API = stripTrailingSlash(
  process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://localhost:3001/api/v1'
);

export const ASSETS_BASE = stripTrailingSlash(
  process.env.BACKEND_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL ||
    'http://localhost:3001'
);

export function imageUrl(raw?: string | null) {
  const url = (raw || '').trim();
  if (!url) return '/no-image.png';

  // URL absoluta
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // legacy uploads
  if (url.startsWith('/uploads/')) return `${ASSETS_BASE}${url}`;
  if (url.startsWith('uploads/')) return `${ASSETS_BASE}/${url}`;

  // por si llega /api/v1/uploads/...
  if (url.startsWith('/api/')) {
    return `${ASSETS_BASE}${url.replace(/\/api\/v1/i, '')}`;
  }

  // fallback filename suelto
  return `${ASSETS_BASE}/uploads/${url.replace(/^\/+/, '')}`;
}

export async function backendFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API}${safePath}`;

  const res = await fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`[backendFetch] ${res.status} ${url}: ${text.slice(0, 500)}`);
  }

  if (!text) {
    throw new Error(`[backendFetch] respuesta vacia: ${url}`);
  }

  return JSON.parse(text) as T;
}