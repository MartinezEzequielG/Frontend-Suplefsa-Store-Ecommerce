// Simple helper para consumir el backend público
export const API = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api/V1';
const ASSETS_BASE = process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL || 'http://localhost:3001';

// Normaliza URLs de imagen: si vienen relativas (/uploads/...), proxificamos por el Store
export function imageUrl(u?: string | null): string {
  if (!u) return '/placeholder.svg';
  // Sirve vía el proxy local del Store para evitar CORS
  if (u.startsWith('/uploads/')) return u; // lo servimos con /uploads/* en el Store
  // Si ya es absoluta, úsala tal cual
  if (u.startsWith('http')) return u;
  return `${ASSETS_BASE}${u}`;
}

export async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    // evitar cache en páginas server
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Backend error ${res.status}: ${await res.text().catch(()=> '')}`);
  return res.json();
}