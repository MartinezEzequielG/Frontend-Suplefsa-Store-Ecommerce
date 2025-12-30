import { NextRequest, NextResponse } from 'next/server';
import { cartRemove, cartUpdate, checkoutCreate } from '@/lib/cart';

export async function POST(req: NextRequest) {
  const { pathname, searchParams } = new URL(req.url);
  try {
    if (pathname.endsWith('/cart/actions/update')) {
      const id = Number(searchParams.get('id'));
      const fd = await req.formData();
      const quantity = Number(fd.get('quantity') || 1);
      const variantId = fd.get('variantId') ? Number(fd.get('variantId')) : undefined;
      await cartUpdate(id, quantity);
      return NextResponse.redirect(new URL('/cart', req.url));
    }
    if (pathname.endsWith('/cart/actions/remove')) {
      const id = Number(searchParams.get('id'));
      await cartRemove(id);
      return NextResponse.redirect(new URL('/cart', req.url));
    }
    if (pathname.endsWith('/cart/actions/checkout')) {
      // Redirigir al formulario de checkout en lugar de crear orden aquí
      return NextResponse.redirect(new URL('/checkout', req.url));
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const ref = new URL('/cart', req.url);
    ref.searchParams.set('error', e.message || 'Error');
    return NextResponse.redirect(ref);
  }
}