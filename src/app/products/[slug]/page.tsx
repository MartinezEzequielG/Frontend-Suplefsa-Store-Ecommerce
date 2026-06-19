import Link from 'next/link';
import { backendFetch } from '@/lib/backend';
import { formatPrice } from '@/lib/format';
import ProductMedia from '@/components/ProductMedia';
import VariantsSelector from '@/components/VariantsSelector';
import { cartEnabledFrom } from '@/lib/checkoutMode';
import { getSiteConfig } from '@/lib/site';

type PaymentOption = {
  key: 'MP' | 'TRANSFER';
  label: string;
  price: number;
  discount: number;
};

function toNumber(value: any) {
  return Number(value ?? 0);
}

function getDiscountedPrice(price: number, discount: number) {
  return Math.round(price * (1 - discount / 100));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const p = await backendFetch<any>(`/products/${slug}`);
  const settings = await getSiteConfig();

  const cartEnabled = cartEnabledFrom((settings as any)?.checkoutMode);
  const waDigits = settings?.whatsappNumber
    ? settings.whatsappNumber.replace(/\D/g, '')
    : '';

  const waText = `Hola! Quiero consultar por ${p.name}`;
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(waText)}`
    : '';

  const basePrice = toNumber(p.basePrice);
  const salePrice = p.salePrice != null ? toNumber(p.salePrice) : null;
  const currentPrice = salePrice ?? basePrice;

  const transferDiscount = toNumber(p.discountTransfer);
  const mpDiscount = toNumber(p.discountMp);

  const paymentOptions: PaymentOption[] = [];

  if (mpDiscount > 0) {
    paymentOptions.push({
      key: 'MP',
      label: 'Mercado Pago',
      price: getDiscountedPrice(currentPrice, mpDiscount),
      discount: mpDiscount,
    });
  }

  if (transferDiscount > 0) {
    paymentOptions.push({
      key: 'TRANSFER',
      label: 'Transferencia',
      price: getDiscountedPrice(currentPrice, transferDiscount),
      discount: transferDiscount,
    });
  }

  const sortedPaymentOptions = [...paymentOptions].sort(
    (a, b) => a.price - b.price,
  );

  const bestPayment = sortedPaymentOptions[0] ?? null;
  const mainPrice = bestPayment?.price ?? currentPrice;
  const maxDiscount = Math.max(mpDiscount, transferDiscount);

  const showOriginalPrice =
    mainPrice < currentPrice || (salePrice != null && salePrice < basePrice);

  const hasVariants =
    Array.isArray(p.variants) &&
    p.variants.length > 0 &&
    Array.isArray(p.options) &&
    p.options.length > 0;

  const addToCartNext = `/products/${slug}?cart=open`;
  const addToCartAction = `/cart/actions/add?next=${encodeURIComponent(
    addToCartNext,
  )}`;

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 hidden items-center gap-2 text-sm text-slate-500 sm:flex">
          <Link href="/products" className="transition hover:text-slate-950">
            Catálogo
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-700">{p.name}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,58%)_minmax(380px,1fr)] lg:gap-10">
          <section className="order-1">
            <ProductMedia
              images={p.images || []}
              productName={p.name}
              badge={maxDiscount > 0 ? `Hasta ${maxDiscount}% OFF` : null}
            />
          </section>

          <section className="order-2 lg:pt-5">
            <div className="mx-auto max-w-xl space-y-5 text-center lg:mx-0 lg:text-left">
              <div>
                {p.category?.name ? (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {p.category.name}
                  </p>
                ) : null}

                <h1 className="text-[30px] font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl">
                  {p.name}
                </h1>
              </div>

              <div>
                {showOriginalPrice ? (
                  <div className="mb-1 flex items-center justify-center gap-2 lg:justify-start">
                    <span className="text-sm font-medium text-slate-400 line-through">
                      {formatPrice(currentPrice)}
                    </span>

                    {bestPayment?.discount ? (
                      <span className="text-sm font-bold text-green-700">
                        {bestPayment.discount}% OFF
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className="text-2xl font-medium text-slate-950">
                  {formatPrice(mainPrice)}
                </div>

                {bestPayment ? (
                  <p className="mt-2 text-sm text-slate-500">
                    con {bestPayment.label}
                  </p>
                ) : null}
              </div>

              <div className="pt-1">
                {hasVariants ? (
                  cartEnabled ? (
                    <form
                      action={addToCartAction}
                      method="POST"
                      className="
                        space-y-3 text-left
                        [&_label]:!text-sm
                        [&_label]:!font-medium
                        [&_label]:!text-slate-700
                        [&_select]:!h-12
                        [&_select]:!rounded-lg
                        [&_select]:!border-slate-300
                        [&_select]:!bg-white
                        [&_select]:!text-slate-950
                        [&_select]:focus:!border-black
                        [&_select]:focus:!ring-2
                        [&_select]:focus:!ring-slate-200
                        [&_button[type=submit]]:!h-[46px]
                        [&_button[type=submit]]:!rounded-lg
                        [&_button[type=submit]]:!bg-black
                        [&_button[type=submit]]:!text-white
                        [&_button[type=submit]]:!font-bold
                        [&_button[type=submit]]:transition
                        [&_button[type=submit]]:hover:!bg-slate-800
                        [&_button[type=submit]:disabled]:!bg-slate-200
                        [&_button[type=submit]:disabled]:!text-slate-400
                      "
                    >
                      <VariantsSelector
                        variants={p.variants}
                        options={p.options}
                        mode="CART"
                      />

                      <input type="hidden" name="productId" value={p.id} />
                      <input type="hidden" name="slug" value={slug} />
                    </form>
                  ) : (
                    <VariantsSelector
                      variants={p.variants}
                      options={p.options}
                      mode="CATALOG"
                      whatsappNumber={settings?.whatsappNumber || ''}
                      productName={p.name}
                    />
                  )
                ) : cartEnabled ? (
                  <form action={addToCartAction} method="POST">
                    <button
                      type="submit"
                      className="h-[46px] w-full rounded-lg bg-black px-5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.99]"
                    >
                      Agregar al carrito
                    </button>

                    <input type="hidden" name="productId" value={p.id} />
                    <input type="hidden" name="slug" value={slug} />
                  </form>
                ) : waDigits ? (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[46px] w-full items-center justify-center rounded-lg bg-black px-5 text-sm font-bold text-white transition hover:bg-slate-800"
                    aria-label="Consultar por WhatsApp"
                  >
                    Consultar por WhatsApp
                  </a>
                ) : null}
              </div>

              <section className="space-y-2 pt-2 text-left">
                {p.description ? (
                  <details className="group border-t border-slate-200 pt-4">
                    <summary
                      className="
                        flex cursor-pointer list-none items-center justify-between gap-4
                        rounded-xl py-2
                        focus:outline-none focus-visible:outline-none
                      "
                    >
                      <span>
                        <span className="block text-sm font-black uppercase tracking-[0.12em] text-slate-950">
                          Detalle del producto
                        </span>
                        <span className="mt-0.5 block text-xs font-medium text-slate-500">
                          Información, características y descripción.
                        </span>
                      </span>

                      <span className="shrink-0 text-xl font-bold text-slate-400 transition group-open:rotate-45">
                        +
                      </span>
                    </summary>

                    <div className="pb-2 pt-3">
                      <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                        {p.description}
                      </p>
                    </div>
                  </details>
                ) : null}

                <details className="group border-t border-slate-200 pt-3">
                  <summary
                    className="
                      flex cursor-pointer list-none items-center justify-between gap-4
                      rounded-xl py-2
                      focus:outline-none focus-visible:outline-none
                    "
                  >
                    <span>
                      <span className="block text-sm font-black uppercase tracking-[0.12em] text-slate-950">
                        Envío y retiro
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-slate-500">
                        Coordinamos la entrega al finalizar la compra.
                      </span>
                    </span>

                    <span className="shrink-0 text-xl font-bold text-slate-400 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="pb-2 pt-3">
                    <p className="text-sm leading-7 text-slate-600">
                      El envío se coordina después de confirmar el pedido.
                      También podés consultar por WhatsApp si necesitás
                      asesoramiento antes de comprar.
                    </p>
                  </div>
                </details>

                <details className="group border-t border-slate-200 pt-3">
                  <summary
                    className="
                      flex cursor-pointer list-none items-center justify-between gap-4
                      rounded-xl py-2
                      focus:outline-none focus-visible:outline-none
                    "
                  >
                    <span>
                      <span className="block text-sm font-black uppercase tracking-[0.12em] text-slate-950">
                        Medios de pago
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-slate-500">
                        El precio mostrado aplica al mejor descuento disponible.
                      </span>
                    </span>

                    <span className="shrink-0 text-xl font-bold text-slate-400 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="pb-2 pt-3">
                    <p className="text-sm leading-7 text-slate-600">
                      Precio publicado: <strong>{formatPrice(mainPrice)}</strong>
                      {bestPayment ? <> con {bestPayment.label}.</> : <>.</>}
                    </p>
                  </div>
                </details>
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}