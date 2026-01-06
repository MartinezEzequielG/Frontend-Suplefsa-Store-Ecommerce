import { API } from './backend';

export type CheckoutPayload = {
  shipping: {
    fullName: string;
    email?: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip?: string;
    country?: string;
  };
  shippingCost: number;
  paymentMethod?: string;
  // se usa en el backend para identificar carrito guest (sid)
  sessionToken?: string;
};

export async function cartGet() {
  // usa la API local para preservar cookies en SSR
  const res = await fetch('/api/cart', { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function cartAdd(productId: number, variantId?: number, qty = 1) {
  const res = await fetch(`${API}/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ productId, variantId, quantity: qty }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function cartUpdate(itemId: number, qty: number) {
  const res = await fetch(`${API}/cart/items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ quantity: qty }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function cartRemove(itemId: number) {
  const res = await fetch(`${API}/cart/items/${itemId}`, {
    method: 'DELETE',
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function checkoutCreate(payload: CheckoutPayload) {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log('Checkout response:', res.status, res.statusText, text);

  if (!res.ok) throw new Error(text || `Error HTTP ${res.status}`);
  if (!text) throw new Error('Respuesta vacía del backend');
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Respuesta no es JSON: ${text.slice(0, 300)}`);
  }
}