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

          {/* Descripción */}
          {p.description && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm leading-6 text-gray-700 whitespace-pre-line">
                {p.description}
              </p>
            </div>
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
            <a
              href={`https://wa.me/${waDigits}?text=${encodeURIComponent(`Hola! Quiero pedir: ${p.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center bg-[#25d366] hover:bg-[#1ebe57] text-white font-semibold px-4 py-3 rounded-lg transition"
              aria-label="Pedir por WhatsApp"
            >
              Pedilo por WhatsApp
            </a>
          ) : null}
        </section>
      </div>
    </main>
  );
}