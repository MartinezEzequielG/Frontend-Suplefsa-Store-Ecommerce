import { cookies } from 'next/headers';
import { API } from '@/lib/backend';

export async function cartGetServer() {
  const cookie = (await cookies()).toString();
  const sid = (await cookies()).get('sid')?.value || '';
  const res = await fetch(`${API}/cart`, {
    headers: { Cookie: cookie, 'x-session-id': sid },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}