import { backendFetch } from '@/lib/backend';
import { formatPrice } from '@/lib/format';
import ProductGallery from '@/components/ProductGallery';
import VariantsSelector from '@/components/VariantsSelector';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await backendFetch<any>(`/products/${slug}`);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
      <ProductGallery images={p.images || []} />
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>
        <p className="text-sm text-(--text-muted)">{p.category?.name}</p>
        <div className="mt-2 text-xl">
          {p.salePrice != null ? (
            <>
              <span className="font-bold text-(--accent)">{formatPrice(p.salePrice)}</span>{' '}
              <span className="text-(--text-muted) line-through">{formatPrice(p.basePrice)}</span>
            </>
          ) : (
            <span className="font-bold">{formatPrice(p.basePrice)}</span>
          )}
        </div>

        {/* Atributos informativos */}
        {Array.isArray(p.options) && p.options.length > 0 && (
          <div className="space-y-1 text-sm text-(--text)">
            {p.options.map((opt: any) => (
              <p key={opt.id}>
                <span className="font-medium">{opt.name}:</span>{' '}
                {(opt.values || []).map((v: any) => v.value).join(', ')}
              </p>
            ))}
          </div>
        )}

        <form
          action={`/cart/actions/add?next=${encodeURIComponent(`/products/${slug}?added=1`)}`}
          method="POST"
          className="space-y-4 pt-2"
        >
          {/* Selector de variante dentro del form */}
          {Array.isArray(p.variants) && p.variants.length > 0 && Array.isArray(p.options) && p.options.length > 0 ? (
            <VariantsSelector variants={p.variants} options={p.options} />
          ) : (
            <button
              type="submit"
              className="w-full bg-(--accent) text-white font-semibold py-3 rounded-md hover:opacity-90 transition"
            >
              Agregar al carrito
            </button>
          )}
          <input type="hidden" name="productId" value={p.id} />
          <input type="hidden" name="slug" value={slug} />
        </form>

        {p.description && (
          <div className="pt-4 border-t border-(--border)">
            <p className="text-sm leading-7 text-(--text)">{p.description}</p>
          </div>
        )}

        {p.variants && p.variants.length > 0 && (
          <div className="pt-4 border-t border-(--border)">
            {p.variants.map((variant: any) => {
              const inStock = variant?.stock?.available || 0;
              return (
                <div key={variant.id} className="flex justify-between py-2">
                  <span className="text-sm">{variant.name}</span>
                  {inStock > 0 ? (
                    <span className="text-sm text-green-600">En stock</span>
                  ) : (
                    <span className="text-sm text-red-600">Sin stock</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {p.variants && p.variants.length > 0 && p.options && p.options.length > 0 && (
          <div className="pt-4 border-t border-(--border)">
            {p.options.map((option: any) => (
              <div key={option.id} className="mb-2">
                <span className="text-sm font-medium">{option.name}:</span>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value: any) => {
                    const variant = p.variants.find((v: any) => v.optionValueId === value.id);
                    const inStock = variant?.stock?.available || 0;
                    return (
                      <span
                        key={value.id}
                        className={`text-xs rounded-full py-1 px-3 cursor-pointer ${
                          inStock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {value.value}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}