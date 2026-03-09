import { NextRequest, NextResponse } from 'next/server';
import { isCartEnabled } from '@/lib/checkoutMode';
import { API } from '@/lib/backend';

async function denyIfCatalog(req: NextRequest) {
  const enabled = await isCartEnabled();
  if (enabled) return null;

  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    return NextResponse.redirect(new URL('/products', req.url), { status: 303 });
  }

  return NextResponse.json({ message: 'Checkout deshabilitado: modo catálogo.' }, { status: 403 });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const denied = await denyIfCatalog(req);
  if (denied) return denied;

  const { action } = await params;
  const url = new URL(req.url);
  const cookie = req.headers.get('cookie') || '';
  const sid = req.cookies.get('sid')?.value || crypto.randomUUID();

  try {
    if (action === 'update') {
      const id = Number(url.searchParams.get('id'));
      const fd = await req.formData();
      const quantity = Number(fd.get('quantity') || 1);
      const res = await fetch(`${API}/cart/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: cookie, 'x-session-id': sid },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error(await res.text());
      const resp = NextResponse.redirect(new URL('/cart', req.url));
      resp.cookies.set('sid', sid, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
      return resp;
    }

    if (action === 'remove') {
      const id = Number(url.searchParams.get('id'));
      const res = await fetch(`${API}/cart/items/${id}`, {
        method: 'DELETE',
        headers: { Cookie: cookie, 'x-session-id': sid },
      });
      if (!res.ok) throw new Error(await res.text());
      const resp = NextResponse.redirect(new URL('/cart', req.url));
      resp.cookies.set('sid', sid, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
      return resp;
    }

    if (action === 'add') {
      const fd = await req.formData();
      const productId = Number(fd.get('productId'));
      const variantId = fd.get('variantId') ? Number(fd.get('variantId')) : undefined;
      const quantity = Number(fd.get('quantity') || 1);
      const res = await fetch(`${API}/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie, 'x-session-id': sid },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      if (!res.ok) throw new Error(await res.text());
      const next = url.searchParams.get('next') || `/cart`;
      const resp = NextResponse.redirect(new URL(next, req.url));
      resp.cookies.set('sid', sid, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
      return resp;
    }

    if (action === 'checkout') {
      let payload: any;
      const ctype = req.headers.get('content-type') || '';
      if (ctype.includes('application/json')) {
        payload = await req.json();
      } else {
        const fd = await req.formData();
        payload = {
          shipping: {
            fullName: String(fd.get('fullName') || '').trim(),
            phone: String(fd.get('phone') || '').trim(),
            street: String(fd.get('street') || '').trim(),
            city: String(fd.get('city') || '').trim(),
            state: String(fd.get('state') || '').trim(),
            zip: String(fd.get('zip') || '').trim(),
            country: String(fd.get('country') || 'Argentina').trim(),
          },
          shippingCost: Number(fd.get('shippingCost') || 0),
          paymentMethod: String(fd.get('paymentMethod') || 'MERCADOPAGO'),
          email: String(fd.get('email') || '').trim(),
        };
      }

      // 1) Crear orden (como ya lo hacías)
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ ...payload, sessionToken: sid }),
      });
      if (!res.ok) throw new Error(await res.text());

      const order = await res.json();
      const pm = String(payload?.paymentMethod || '').toUpperCase();

      const isMp = pm === 'MP' || pm === 'MERCADOPAGO' || pm === 'MERCADO_PAGO';

      if (isMp) {
        const prefRes = await fetch(`${API}/payments/preference`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookie,
            'x-session-id': sid,
          },
          body: JSON.stringify({ orderId: order.id }),
        });

        const prefText = await prefRes.text();
        if (!prefRes.ok) throw new Error(prefText || 'No se pudo crear la preferencia de MercadoPago');

        const pref = JSON.parse(prefText) as { initPoint: string; sandboxInitPoint?: string | null };
        const initPoint = pref.initPoint || pref.sandboxInitPoint;

        if (!initPoint) throw new Error('MercadoPago no devolvió initPoint');

        const resp = NextResponse.redirect(initPoint);
        resp.cookies.set('sid', sid, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
        return resp;
      }

      // 3) Si no es MP, comportamiento actual
      const resp = NextResponse.redirect(new URL(`/orders/${order.id}`, req.url));
      resp.cookies.set('sid', sid, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      return resp;
    }

    return NextResponse.json({ error: 'Acción no soportada' }, { status: 400 });
  } catch (e: any) {
    const ref = new URL('/cart', req.url);
    ref.searchParams.set('error', e.message || 'Error');
    const resp = NextResponse.redirect(ref);
    resp.cookies.set('sid', sid, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return resp;
  }
}

export async function GET(req: NextRequest, ctx: any) {
  const denied = await denyIfCatalog(req);
  if (denied) return denied;

  // ...existing code...
}