import { redirect } from 'next/navigation';
import { isCartEnabled } from '@/lib/checkoutMode';
import CheckoutSteps from '@/components/CheckoutSteps';
import CheckoutForm from '@/components/CheckoutForm';
import { cartGetServer } from '@/lib/cart-server';

export default async function CheckoutPage(props: any) {
  const enabled = await isCartEnabled();
  if (!enabled) redirect('/products');

  const { searchParams } = props;
  const { error = '' } = await searchParams;

  const cart = await cartGetServer();
  const items = cart.items || [];

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

      <CheckoutForm items={items} />
    </main>
  );
}