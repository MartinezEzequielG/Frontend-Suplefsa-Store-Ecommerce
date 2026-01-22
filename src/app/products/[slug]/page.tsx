import { backendFetch } from '@/lib/backend';
import { formatPrice } from '@/lib/format';
import ProductGallery from '@/components/ProductGallery';
import VariantsSelector from '@/components/VariantsSelector';
import { cartEnabledFrom } from '@/lib/checkoutMode';
import { getSiteConfig } from '@/lib/site';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await backendFetch<any>(`/products/${slug}`);
  const settings = await getSiteConfig();
  const cartEnabled = cartEnabledFrom((settings as any)?.checkoutMode);
  const waDigits = settings?.whatsappNumber ? settings.whatsappNumber.replace(/\D/g, '') : '';

  const waText = `Hola! Quiero pedir: ${p.name}`;
  const waHref = waDigits ? `https://wa.me/${waDigits}?text=${encodeURIComponent(waText)}` : '';

  const hasTransfer = p.discountTransfer && p.discountTransfer > 0;
  const hasMp = p.discountMp && p.discountMp > 0;
  const transferPrice = hasTransfer
    ? Math.round((p.salePrice ?? p.basePrice) * (1 - p.discountTransfer / 100))
    : null;
  const mpPrice = hasMp
    ? Math.round((p.salePrice ?? p.basePrice) * (1 - p.discountMp / 100))
    : null;

  const lowStock = p.variants?.some((v: any) => v?.stock?.available > 0 && v?.stock?.available <= 3);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      {/* Alerta de stock bajo */}
      {lowStock && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
          <span className="text-orange-700 font-semibold text-sm">
            ⚠️ ¡Últimas unidades disponibles!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        <ProductGallery images={p.images || []} />

        <section className="space-y-6">
          {/* Nombre y categoría */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">{p.name}</h1>
            {p.category?.name && (
              <span className="inline-block text-xs font-semibold text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                {p.category.name}
              </span>
            )}
          </div>

          {/* Precios destacados */}
          <div className="bg-gradient-to-br from-blue-50 to-orange-50 border border-gray-200 rounded-xl p-4 space-y-2">
            {hasTransfer ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-400 line-through text-lg">{formatPrice(p.salePrice ?? p.basePrice)}</span>
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                    {p.discountTransfer}% OFF
                  </span>
                </div>
                <div className="text-green-600 font-extrabold text-4xl">{formatPrice(transferPrice)}</div>
                <p className="text-green-700 text-sm font-medium">
                  Pagando por transferencia
                </p>
              </>
            ) : hasMp ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-400 line-through text-lg">{formatPrice(p.salePrice ?? p.basePrice)}</span>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">
                    {p.discountMp}% OFF
                  </span>
                </div>
                <div className="text-blue-600 font-extrabold text-4xl">{formatPrice(mpPrice)}</div>
                <p className="text-blue-700 text-sm font-medium">
                  Pagando con MercadoPago
                </p>
              </>
            ) : (
              <div className="text-black font-extrabold text-4xl">{formatPrice(p.salePrice ?? p.basePrice)}</div>
            )}
          </div>

          {/* Atributos como chips pequeños */}
          {Array.isArray(p.options) && p.options.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {p.options.map((opt: any) => (
                <span key={opt.id} className="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-3 py-1.5">
                  <span className="font-semibold">{opt.name}:</span> {(opt.values || []).map((v: any) => v.value).join(', ')}
                </span>
              ))}
            </div>
          )}

          {/* Detalle del producto */}
          {p.description && (
            <section className="pt-4 border-t border-gray-200 space-y-3">
              <header>
                <h2 className="text-sm font-extrabold text-gray-900">Detalle del producto</h2>
              </header>

              <div className="flex flex-wrap gap-2">
                {p.category?.name ? (
                  <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                    Categoría: {p.category.name}
                  </span>
                ) : null}

                {p.freeShipping ? (
                  <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                    Envío gratis
                  </span>
                ) : null}

                {lowStock ? (
                  <span className="text-[11px] font-semibold text-orange-800 bg-orange-100 px-2 py-1 rounded-full">
                    Últimas unidades
                  </span>
                ) : null}

                {p.isNew ? (
                  <span className="text-[11px] font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded-full">
                    Nuevo
                  </span>
                ) : null}

                {p.isHot ? (
                  <span className="text-[11px] font-semibold text-[color:var(--accent)] bg-orange-50 px-2 py-1 rounded-full">
                    Más vendido
                  </span>
                ) : null}
              </div>

              <p className="text-sm leading-6 text-gray-700 whitespace-pre-line">
                {p.description}
              </p>
            </section>
          )}

          {/* CTA */}
          {Array.isArray(p.variants) && p.variants.length > 0 && Array.isArray(p.options) && p.options.length > 0 ? (
            cartEnabled ? (
              <form
                action={`/cart/actions/add?next=${encodeURIComponent(`/products/${slug}?added=1`)}`}
                method="POST"
                className="space-y-4 pt-4"
              >
                <VariantsSelector variants={p.variants} options={p.options} mode="CART" />
                <input type="hidden" name="productId" value={p.id} />
                <input type="hidden" name="slug" value={slug} />
              </form>
            ) : (
              <div className="pt-4">
                <VariantsSelector
                  variants={p.variants}
                  options={p.options}
                  mode="CATALOG"
                  whatsappNumber={settings?.whatsappNumber || ''}
                  productName={p.name}
                />
              </div>
            )
          ) : cartEnabled ? (
            <form
              action={`/cart/actions/add?next=${encodeURIComponent(`/products/${slug}?added=1`)}`}
              method="POST"
              className="space-y-4 pt-4"
            >
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition text-base"
                >
                  Agregar al carrito
                </button>
              </div>

              <input type="hidden" name="productId" value={p.id} />
              <input type="hidden" name="slug" value={slug} />
            </form>
          ) : waDigits ? (
            <div className="pt-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-gray-900">Comprar por WhatsApp</h3>
                    <p className="mt-1 text-xs text-gray-600">
                      Te armamos el pedido y te asesoramos si lo necesitás.
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    Respuesta rápida
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                    Envíos a todo el país
                  </span>
                  <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                    Retiro en tienda
                  </span>
                  <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                    Asesoramiento
                  </span>
                </div>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-4 inline-flex w-full items-center justify-center gap-2
                    rounded-lg px-4 py-3
                    text-sm font-extrabold text-white
                    bg-[#25d366] hover:bg-[#20ba5a]
                    transition
                  "
                  aria-label="Comprar por WhatsApp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Pedir por WhatsApp
                </a>

                <p className="mt-2 text-[11px] text-gray-500">
                  Se abre WhatsApp con el mensaje listo.
                </p>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}