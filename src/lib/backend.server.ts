import 'server-only';
import { cookies } from 'next/headers';

type PublicOrder = {
  id: number;
  status: string;
  total: number;
  shippingCost: number;
  createdAt?: string;
  items?: Array<{
    id: number;
    quantity: number;
    unitPrice: number;
    product?: { id: number; name: string; slug: string; images?: { url: string; position?: number }[] };
    productVariant?: any;
  }>;
  shippingAddress?: any;
};

function normalizeBase(raw: string) {
  const base = raw.replace(/\/+$/, '');          // quita trailing slash
  return base.replace(/\/api\/v1$/i, '');        // quita /api/v1 si quedó pegado
}

const API_BASE = normalizeBase(
  process.env.BACKEND_PUBLIC_URL ??
    process.env.BACKEND_API_URL ??
    process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL ??
    'http://localhost:3001',
);

async function safeJson<T>(res: Response, url: string): Promise<T> {
  const ct = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Backend ${res.status} ${res.statusText} (${url}): ${text.slice(0, 400)}`);
  }

  if (!text) {
    throw new Error(`Backend devolvió respuesta vacía (status ${res.status}) (${url}).`);
  }

  if (!ct.includes('application/json')) {
    throw new Error(`Se esperaba JSON pero llegó "${ct}" (${url}). Body: ${text.slice(0, 400)}`);
  }

  return JSON.parse(text) as T;
}

export async function fetchOrderPublic(orderId: string): Promise<PublicOrder> {
  const jar = await cookies();
  const sid = jar.get('sid')?.value;

  if (!sid) {
    throw new Error('No hay cookie "sid". Asegurate de setearla en el navegador (guest session).');
  }

  const url = `${API_BASE}/orders/public/${orderId}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-session-id': sid,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  return safeJson<PublicOrder>(res, url);
}
