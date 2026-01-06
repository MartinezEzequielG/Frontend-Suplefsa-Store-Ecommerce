import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { cartGetServer } from '@/lib/cart-server';
import { imageUrl } from '@/lib/backend';
import CheckoutSteps from '@/components/CheckoutSteps';
import { redirect } from 'next/navigation';
import { isCartEnabled } from '@/lib/checkoutMode';

function variantLabel(it: any) {
  const vals =
    it.productVariant?.options?.map((o: any) => o.optionValue?.value).filter(Boolean) ?? [];
  if (vals.length) return vals.join(' / ');
  return it.productVariant?.sku ?? it.productVariant?.id ?? null;
}

export default async function CartPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const enabled = await isCartEnabled();
  if (!enabled) redirect('/products');

  const { error = '' } = await searchParams;
  const cart = await cartGetServer();
  const items = cart.items || [];
  const subtotal = items.reduce((s: number, it: any) => s + Number(it.unitPrice) * it.quantity, 0);

  console.log(items);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-4 space-y-2">
        <CheckoutSteps step="cart" />
        <h1 className="text-2xl font-semibold">Carrito</h1>
        <p className="text-sm text-(--text-muted)">
          Revisá tus productos, cantidades y el total antes de continuar.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {items.length === 0 ? (
        <div className="border border-(--border) rounded-md p-6 bg-(--surface)">
          <p className="text-sm">Tu carrito está vacío.</p>
          <Link href="/products" className="inline-block mt-3 rounded-md bg-(--accent) text-black px-4 py-2 text-sm">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_340px] gap-8">
          <ul className="space-y-4">
            {items.map((it: any) => {
              const vLabel = variantLabel(it);
              const line = Number(it.unitPrice) * it.quantity;
              const img = it.product?.images?.[0]?.url;

              return (
                <li
                  key={it.id}
                  className="flex flex-col sm:flex-row gap-4 border border-(--border) rounded-lg p-4 bg-(--surface)"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl(img || '/placeholder.svg')}
                    alt=""
                    className="w-20 h-20 rounded bg-zinc-100 object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{it.product?.name}</p>
                    {vLabel && (
                      <p className="text-xs text-(--text-muted)">
                        Variante: <span className="font-medium">{vLabel}</span>
                      </p>
                    )}
                    <p className="text-xs text-(--text-muted)">
                      Precio unitario: <span className="font-medium">{formatPrice(it.unitPrice)}</span>
                    </p>

                    <form action={`/cart/actions/update?id=${it.id}`} method="POST" className="mt-3 flex items-center gap-2">
                      <label className="text-xs text-(--text-muted)">Cantidad</label>
                      <input
                        name="quantity"
                        type="number"
                        min={1}
                        defaultValue={it.quantity}
                        className="w-24 border border-(--border) rounded px-2 py-1 text-sm bg-(--surface)"
                      />
                      <button className="text-sm rounded-md border border-(--border) px-3 py-1 hover:border-(--accent)" type="submit">
                        Actualizar
                      </button>
                      <button className="text-sm underline" formAction={`/cart/actions/remove?id=${it.id}`} type="submit">
                        Eliminar
                      </button>
                    </form>
                  </div>

                  <div className="text-left sm:text-right sm:min-w-[120px]">
                    <p className="text-xs text-(--text-muted)">Subtotal</p>
                    <p className="font-semibold">{formatPrice(line)}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="border border-(--border) rounded-lg p-4 bg-(--surface) h-fit">
            <h2 className="text-lg font-semibold mb-3">Resumen</h2>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-(--text-muted)">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-(--text-muted)">Envío</span>
                <span className="text-(--text-muted)">Se calcula en checkout</span>
              </div>
              <div className="border-t border-(--border) pt-2 flex items-center justify-between">
                <span className="font-semibold">Total estimado</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Link
                href="/checkout"
                className="w-full inline-block text-center rounded-md border border-(--border) px-4 py-2 text-white"
              >
                Continuar a checkout
              </Link>
              <Link
                href="/products"
                className="w-full inline-block text-center rounded-md border border-(--border) px-4 py-2 text-sm"
              >
                Seguir comprando
              </Link>
            </div>

            <p className="mt-3 text-xs text-(--text-muted)">
              El total final se confirma en checkout al seleccionar envío.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}