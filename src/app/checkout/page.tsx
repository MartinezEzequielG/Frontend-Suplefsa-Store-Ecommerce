import { redirect } from 'next/navigation';
import { isCartEnabled } from '@/lib/checkoutMode';
import CheckoutSteps from '@/components/CheckoutSteps';
import CheckoutSidebar from '@/components/CheckoutSidebar';
import { cartGetServer } from '@/lib/cart-server';

export default async function CheckoutPage(props: any) {
  const enabled = await isCartEnabled();
  if (!enabled) redirect('/products');

  const { searchParams } = props;
  const { error = '' } = await searchParams;

  const cart = await cartGetServer();
  const items = cart.items || [];
  const subtotal = items.reduce(
    (s: number, it: any) => s + Number(it.unitPrice) * it.quantity,
    0,
  );

  // Si no hay items y no venimos con error, mandar al carrito
  if (items.length === 0 && !error) {
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

      {/* IMPORTANTE: usamos el route handler /cart/actions/checkout */}
      <form
        action="/cart/actions/checkout"
        method="POST"
        className="grid md:grid-cols-[1fr_360px] gap-8"
      >
        {/* Columna izquierda: datos */}
        <section className="border border-(--border) rounded-lg p-4 bg-(--surface) space-y-4">
          <h2 className="text-lg font-semibold">Datos de envío</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="fullName" placeholder="Nombre y apellido" required className="border rounded px-3 py-2" />
            <input name="email" type="email" placeholder="Email" required className="border rounded px-3 py-2" />
            <input name="phone" placeholder="Teléfono" required className="border rounded px-3 py-2" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="street" placeholder="Calle y número" required className="border rounded px-3 py-2" />
            <input name="city" placeholder="Ciudad" required className="border rounded px-3 py-2" />
            <input name="state" placeholder="Provincia / Estado" required className="border rounded px-3 py-2" />
            <input name="zip" placeholder="CP" className="border rounded px-3 py-2" />
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