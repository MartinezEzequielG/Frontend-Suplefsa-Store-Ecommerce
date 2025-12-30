import Link from 'next/link';
import { API, imageUrl } from '@/lib/backend';
import { formatPrice } from '@/lib/format';
import { cookies } from 'next/headers';

async function fetchOrder(id: string) {
  const cookie = (await cookies()).toString();
  const sid = (await cookies()).get('sid')?.value || '';

  const res = await fetch(`${API}/orders/public/${id}`, {
    cache: 'no-store',
    headers: { Cookie: cookie, 'x-session-id': sid },
  });

  const text = await res.text();
  console.log('Order fetch response:', res.status, res.statusText, text);

  if (!res.ok) {
    throw new Error(text || 'No se pudo cargar la orden');
  }
  if (!text) {
    throw new Error('Respuesta vacía del backend');
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Respuesta no es JSON: ${text.slice(0, 300)}`);
  }
}

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let o;
  try {
    o = await fetchOrder(id);
  } catch (e: any) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold mb-2">Error</h1>
        <p className="text-sm text-red-600">{e.message}</p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">¡Gracias por tu compra!</h1>
      <p className="text-sm text-zinc-600 mb-6">Orden #{o.id} — Estado: {o.status}</p>
      <ul className="space-y-4">
        {(o.items || []).map((it: any) => (
          <li key={it.id} className="flex items-center gap-4 border rounded p-3 bg-white">
            <img src={imageUrl(it.product?.images?.[0]?.url)} alt="" className="w-16 h-16 rounded bg-zinc-100 object-cover" />
            <div className="flex-1">
              <p className="font-medium">{it.product?.name}</p>
              {it.productVariant && <p className="text-xs text-zinc-500">Variante: {it.productVariant.sku ?? it.productVariant.id}</p>}
              <p className="text-xs text-zinc-500">Cantidad: {it.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatPrice(it.unitPrice)}</p>
              <p className="text-sm text-zinc-500">Subtotal: {formatPrice(Number(it.unitPrice) * it.quantity)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold">Total: {formatPrice(o.total)}</p>
        <Link href="/products" className="underline">Seguir comprando</Link>
      </div>
    </main>
  );
}