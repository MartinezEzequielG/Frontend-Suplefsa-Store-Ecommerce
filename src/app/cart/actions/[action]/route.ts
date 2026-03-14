import { NextRequest, NextResponse } from 'next/server';
import { isCartEnabled } from '@/lib/checkoutMode';
import { API } from '@/lib/backend';

const SID_COOKIE = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
};

const TRUSTED_EXTERNAL_REDIRECT_HOSTS = [
  'www.mercadopago.com',
  'www.mercadopago.com.ar',
  'sandbox.mercadopago.com',
  'sandbox.mercadopago.com.ar',
  'mercadopago.com',
  'mercadopago.com.ar',
];

function stripTrailingSlash(value?: string | null) {
  return (value || '').trim().replace(/\/+$/, '');
}

function getSiteBase(req: NextRequest) {
  const configured = stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL);
  if (configured) return configured;

  const proto =
    req.headers.get('x-forwarded-proto') ||
    (process.env.NODE_ENV === 'production' ? 'https' : 'http');

  const host =
    req.headers.get('x-forwarded-host') ||
    req.headers.get('host') ||
    'localhost:3000';

  return `${proto}://${host}`;
}

function toInternalAppUrl(req: NextRequest, target: string) {
  const base = getSiteBase(req);
  const safeTarget = target.startsWith('/') ? target : `/${target}`;
  return new URL(safeTarget, base);
}

function isTrustedExternalUrl(target: string) {
  try {
    const parsed = new URL(target);
    return TRUSTED_EXTERNAL_REDIRECT_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}

function redirectInternalWithSid(
  req: NextRequest,
  target: string,
  sid: string,
  status?: number,
) {
  const resp = NextResponse.redirect(toInternalAppUrl(req, target), status);
  resp.cookies.set('sid', sid, SID_COOKIE);
  return resp;
}

function redirectExternalWithSid(target: string, sid: string, status?: number) {
  const resp = NextResponse.redirect(target, status);
  resp.cookies.set('sid', sid, SID_COOKIE);
  return resp;
}

function readErrorMessage(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.message === 'string') return parsed.message;
    if (Array.isArray(parsed?.message)) return parsed.message.join(', ');
  } catch {}
  return raw || 'Error';
}

async function denyIfCatalog(req: NextRequest) {
  const enabled = await isCartEnabled();
  if (enabled) return null;

  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    return NextResponse.redirect(toInternalAppUrl(req, '/products'), { status: 303 });
  }

  return NextResponse.json(
    { message: 'Checkout deshabilitado: modo catálogo.' },
    { status: 403 },
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
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
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
          'x-session-id': sid,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) throw new Error(readErrorMessage(await res.text()));
      return redirectInternalWithSid(req, '/cart', sid);
    }

    if (action === 'remove') {
      const id = Number(url.searchParams.get('id'));

      const res = await fetch(`${API}/cart/items/${id}`, {
        method: 'DELETE',
        headers: {
          Cookie: cookie,
          'x-session-id': sid,
        },
      });

      if (!res.ok) throw new Error(readErrorMessage(await res.text()));
      return redirectInternalWithSid(req, '/cart', sid);
    }

    if (action === 'add') {
      const fd = await req.formData();
      const productId = Number(fd.get('productId'));
      const variantId = fd.get('variantId') ? Number(fd.get('variantId')) : undefined;
      const quantity = Number(fd.get('quantity') || 1);

      const res = await fetch(`${API}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
          'x-session-id': sid,
        },
        body: JSON.stringify({ productId, variantId, quantity }),
      });

      if (!res.ok) throw new Error(readErrorMessage(await res.text()));

      const nextParam = url.searchParams.get('next');
      const next =
        nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
          ? nextParam
          : '/cart';

      return redirectInternalWithSid(req, next, sid);
    }

    if (action === 'checkout') {
      const ctype = req.headers.get('content-type') || '';
      let payload: any;

      if (ctype.includes('application/json')) {
        payload = await req.json();
      } else {
        const fd = await req.formData();

        payload = {
          checkoutToken: crypto.randomUUID(),
          guestSessionToken: sid,
          shipping: {
            fullName: String(fd.get('fullName') || '').trim(),
            email: String(fd.get('email') || '').trim(),
            phone: String(fd.get('phone') || '').trim(),
            street: String(fd.get('street') || '').trim(),
            city: String(fd.get('city') || '').trim(),
            state: String(fd.get('state') || '').trim(),
            zip: String(fd.get('zip') || '').trim(),
            country: String(fd.get('country') || 'Argentina').trim(),
          },
          shippingCost: Number(fd.get('shippingCost') || 0),
          paymentMethod: String(fd.get('paymentMethod') || 'MERCADOPAGO'),
        };
      }

      const checkoutRes = await fetch(`${API}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
          'x-session-id': sid,
        },
        body: JSON.stringify(payload),
      });

      if (!checkoutRes.ok) {
        throw new Error(readErrorMessage(await checkoutRes.text()));
      }

      const order = await checkoutRes.json();
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
        if (!prefRes.ok) {
          throw new Error(readErrorMessage(prefText) || 'No se pudo crear la preferencia de MercadoPago');
        }

        const pref = JSON.parse(prefText) as {
          initPoint?: string;
          sandboxInitPoint?: string | null;
        };

        const initPoint = pref.initPoint || pref.sandboxInitPoint;
        if (!initPoint) {
          throw new Error('MercadoPago no devolvió initPoint');
        }

        if (!isTrustedExternalUrl(initPoint)) {
          throw new Error('MercadoPago devolvió una URL de redirección no permitida');
        }

        return redirectExternalWithSid(initPoint, sid);
      }

      return redirectInternalWithSid(req, `/orders/${order.id}`, sid);
    }

    return NextResponse.json({ error: 'Acción no soportada' }, { status: 400 });
  } catch (e: any) {
    const isCheckout = action === 'checkout';
    const message = encodeURIComponent(e?.message || 'Error');
    const target = isCheckout ? `/checkout?error=${message}` : `/cart?error=${message}`;
    return redirectInternalWithSid(req, target, sid);
  }
}

export async function GET(req: NextRequest) {
  const denied = await denyIfCatalog(req);
  if (denied) return denied;

  return NextResponse.json({ error: 'Método no soportado' }, { status: 405 });
}