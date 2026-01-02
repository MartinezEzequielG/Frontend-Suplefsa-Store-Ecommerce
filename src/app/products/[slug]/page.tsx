import { backendFetch } from '@/lib/backend';
import { formatPrice } from '@/lib/format';
import ProductGallery from '@/components/ProductGallery';
import VariantsSelector from '@/components/VariantsSelector';
import { getSiteConfig } from '@/lib/site';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await backendFetch<any>(`/products/${slug}`);
  const settings = await getSiteConfig();

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

          {/* Formulario de compra */}
          <form
            action={`/cart/actions/add?next=${encodeURIComponent(`/products/${slug}?added=1`)}`}
            method="POST"
            className="space-y-4 pt-4"
          >
            {Array.isArray(p.variants) && p.variants.length > 0 && Array.isArray(p.options) && p.options.length > 0 ? (
              <VariantsSelector variants={p.variants} options={p.options} />
            ) : (
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition text-base"
                >
                  Agregar al carrito
                </button>
                {settings.whatsappNumber && (
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=Hola! Consulta sobre: ${p.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#25d366] hover:bg-[#1ebe57] text-white font-semibold px-4 py-3 rounded-lg transition"
                    aria-label="Consultar por WhatsApp"
                  >
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                      <path
                        d="M16 2C8.268 2 2 8.268 2 16c0 2.44.628 4.736 1.732 6.732L2.004 28.996l6.464-1.696A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6c-2.236 0-4.344-.632-6.128-1.728l-.44-.264-4.56 1.196 1.216-4.456-.288-.456A11.567 11.567 0 014.4 16c0-6.408 5.192-11.6 11.6-11.6 6.408 0 11.6 5.192 11.6 11.6 0 6.408-5.192 11.6-11.6 11.6z"
                        fill="currentColor"
                      />
                      <path
                        d="M22.003 18.59c-.302-.151-1.787-.882-2.063-.983-.276-.101-.477-.151-.678.151-.201.302-.778.983-.954 1.184-.176.201-.352.226-.654.075-.302-.151-1.276-.47-2.43-1.497-.899-.803-1.507-1.795-1.684-2.097-.176-.302-.019-.465.132-.616.136-.135.302-.352.453-.528.151-.176.201-.302.302-.503.101-.201.05-.377-.025-.528-.075-.151-.678-1.634-.929-2.237-.245-.59-.495-.509-.678-.518-.176-.008-.377-.01-.578-.01-.201 0-.528.075-.805.377-.276.302-1.053 1.03-1.053 2.509 0 1.479 1.078 2.909 1.228 3.111.151.201 2.124 3.247 5.149 4.425.72.311 1.282.497 1.721.636.722.23 1.38.198 1.899.12.579-.086 1.787-.729 2.041-1.434.252-.705.252-1.309.176-1.434-.075-.126-.276-.201-.578-.352z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}
            <input type="hidden" name="productId" value={p.id} />
            <input type="hidden" name="slug" value={slug} />
          </form>
        </section>
      </div>
    </main>
  );
}