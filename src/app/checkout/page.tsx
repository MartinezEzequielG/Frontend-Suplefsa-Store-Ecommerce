import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CheckoutSteps from '@/components/CheckoutSteps';
import CheckoutSidebar from '@/components/CheckoutSidebar';
import { cartGetServer } from '@/lib/cart-server';
import { checkoutCreate } from '@/lib/cart';
import { z } from 'zod';

const CheckoutSchema = z.object({
  fullName: z.string().trim().min(1, 'Nombre y apellido es obligatorio'),
  email: z.string().trim().email('Email inválido'),
  phone: z.string().trim().min(1, 'Teléfono es obligatorio'),
  street: z.string().trim().min(1, 'Calle y número es obligatorio'),
  city: z.string().trim().min(1, 'Ciudad es obligatorio'),
  state: z.string().trim().min(1, 'Provincia/Estado es obligatorio'),
  zip: z.string().trim().optional(),
  country: z.string().trim().min(1, 'País es obligatorio'),
  shippingCost: z.coerce.number().min(0),
  paymentMethod: z.string().trim().min(1),
});

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error = '' } = await searchParams;

  const cart = await cartGetServer();
  const items = cart.items || [];
  const subtotal = items.reduce((s: number, it: any) => s + Number(it.unitPrice) * it.quantity, 0);

  async function placeOrder(fd: FormData) {
    'use server';

    const parsed = CheckoutSchema.safeParse({
      fullName: fd.get('fullName'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      street: fd.get('street'),
      city: fd.get('city'),
      state: fd.get('state'),
      zip: fd.get('zip'),
      country: fd.get('country') ?? 'Argentina',
      shippingCost: fd.get('shippingCost'),
      paymentMethod: fd.get('paymentMethod') ?? 'COD',
    });

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Datos inválidos';
      redirect(`/checkout?error=${encodeURIComponent(msg)}`);
    }

    const { shippingCost, paymentMethod, ...shipping } = parsed.data;

    const sid = (await cookies()).get('sid')?.value || '';
    const order = await checkoutCreate({ shipping, shippingCost, paymentMethod, sessionToken: sid });

    redirect(`/orders/${order.id}`);
  }

  if (items.length === 0) {
    redirect('/cart?error=Tu%20carrito%20est%C3%A1%20vac%C3%ADo');
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-4 space-y-2">
        <CheckoutSteps step="checkout" />
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-(--text-muted)">
          Completá tus datos. A la derecha vas a ver el resumen y el total final.
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <form action={placeOrder} className="grid md:grid-cols-[1fr_360px] gap-8">
        {/* Columna izquierda: datos */}
        <section className="border border-(--border) rounded-lg p-4 bg-(--surface) space-y-4">
          <h2 className="text-lg font-semibold">Datos de envío</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="fullName" placeholder="Nombre y apellido" required className="border rounded px-3 py-2" />
            <input name="email" type="email" placeholder="Email" required className="border rounded px-3 py-2" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="phone" placeholder="Teléfono" required className="border rounded px-3 py-2" />
            <input name="city" placeholder="Ciudad" required className="border rounded px-3 py-2" />
          </div>

          <input name="street" placeholder="Calle y número" required className="border rounded px-3 py-2 w-full" />

          <div className="grid md:grid-cols-3 gap-4">
            <input name="state" placeholder="Provincia/Estado" required className="border rounded px-3 py-2" />
            <input name="zip" placeholder="CP" required className="border rounded px-3 py-2" />
            <input name="country" placeholder="País" defaultValue="Argentina" required className="border rounded px-3 py-2" />
          </div>

          <div className="border-t border-(--border) pt-4 space-y-2">
            <h3 className="text-sm font-semibold">Pago</h3>
            <select name="paymentMethod" defaultValue="COD" required className="border rounded px-3 py-2 w-full">
              <option value="COD">Pago contra entrega</option>
            </select>
          </div>

          <button type="submit" className="w-full rounded-md bg-black text-white px-4 py-3 font-semibold">
            Confirmar compra
          </button>

          <p className="text-xs text-(--text-muted)">
            Al confirmar, reservamos stock de tus variantes y generamos tu orden.
          </p>
        </section>

        {/* Columna derecha: resumen + envío + total dinámico */}
        <CheckoutSidebar items={items} subtotal={subtotal} />
      </form>
    </main>
  );
}