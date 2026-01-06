import Link from 'next/link';
import { backendFetch } from '@/lib/backend';
import { ProductCard } from '@/components/ProductCard';
import { getSiteConfig } from '@/lib/site';

export default async function ProductsList({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; page?: string; sort?: string }> }) {
  try {
    const { q = '', category = '', page = '1', sort = 'createdAt:desc' } = await searchParams;
    const qs = new URLSearchParams({ limit: '24', page, sort });
    if (q) qs.set('search', q);
    if (category) qs.set('categorySlug', category);

    const [site, productsRes, categories] = await Promise.all([
      getSiteConfig(),
      backendFetch<{ items: any[]; total: number }>(`/products?${qs.toString()}`),
      backendFetch<any[]>('/categories/tree'),
    ]);

    const { items, total } = productsRes;

    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-8">
        <aside className="space-y-4">
          <details className="md:hidden border border-(--border) rounded-md bg-(--surface) p-4">
            <summary className="cursor-pointer text-sm font-semibold">Filtros</summary>
            <div className="mt-3">
              <form className="space-y-3">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Buscar..."
                  className="w-full border border-(--border) rounded-md px-3 py-2 text-sm focus:outline-none"
                />
                <select name="category" defaultValue={category} className="w-full border border-(--border) rounded-md px-3 py-2 text-sm">
                  <option value="">Todas las categorías</option>
                  {categories.map((c: any) => (
                    <optgroup key={c.id} label={c.name}>
                      <option value={c.slug}>{c.name}</option>
                      {(c.children || []).map((sc: any) => (
                        <option key={sc.id} value={sc.slug}>— {sc.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <select name="sort" defaultValue={sort} className="w-full border border-(--border) rounded-md px-3 py-2 text-sm">
                  <option value="createdAt:desc">Más recientes</option>
                  <option value="createdAt:asc">Más antiguos</option>
                  <option value="basePrice:asc">Precio: menor a mayor</option>
                  <option value="basePrice:desc">Precio: mayor a menor</option>
                </select>
                <button type="submit" className="w-full rounded-md bg-(--accent) text-black px-3 py-2 text-sm hover:opacity-90 transition">
                  Filtrar
                </button>
              </form>

              {/* Chips rápidas */}
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.slice(0, 10).map((c: any) => (
                  <Link
                    key={c.id}
                    href={`/products?q=${encodeURIComponent(q)}&category=${c.slug}&page=1&sort=${sort}`}
                    className={`rounded-full border px-3 py-1.5 text-xs hover:border-(--accent) hover:text-(--accent) transition ${
                      category === c.slug ? 'border-(--accent) text-(--accent)' : 'border-(--border)'
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </details>

          <div className="hidden md:block space-y-4">
            <form className="space-y-3">
              <input
                name="q"
                defaultValue={q}
                placeholder="Buscar..."
                className="w-full border border-(--border) rounded-md px-3 py-2 text-sm focus:outline-none"
              />
              <select name="category" defaultValue={category} className="w-full border border-(--border) rounded-md px-3 py-2 text-sm">
                <option value="">Todas las categorías</option>
                {categories.map((c: any) => (
                  <optgroup key={c.id} label={c.name}>
                    <option value={c.slug}>{c.name}</option>
                    {(c.children || []).map((sc: any) => (
                      <option key={sc.id} value={sc.slug}>— {sc.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <select name="sort" defaultValue={sort} className="w-full border border-(--border) rounded-md px-3 py-2 text-sm">
                <option value="createdAt:desc">Más recientes</option>
                <option value="createdAt:asc">Más antiguos</option>
                <option value="basePrice:asc">Precio: menor a mayor</option>
                <option value="basePrice:desc">Precio: mayor a menor</option>
              </select>
              <button type="submit" className="w-full rounded-md bg-(--accent) text-black px-3 py-2 text-sm hover:opacity-90 transition">
                Filtrar
              </button>
            </form>

            {/* Chips rápidas */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 10).map((c: any) => (
                <Link
                  key={c.id}
                  href={`/products?q=${encodeURIComponent(q)}&category=${c.slug}&page=1&sort=${sort}`}
                  className={`rounded-full border px-3 py-1.5 text-xs hover:border-(--accent) hover:text-(--accent) transition ${
                    category === c.slug ? 'border-(--accent) text-(--accent)' : 'border-(--border)'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <p className="text-xs text-(--text-muted)">Total: {total}</p>
        </aside>

        <main>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Productos</h1>
            <p className="text-xs text-(--text-muted)">Página {page}</p>
          </div>

          {items.length === 0 ? (
            <div className="border border-(--border) rounded-md p-6 bg-(--surface)">
              <p className="text-sm">No encontramos productos para tu búsqueda.</p>
              <div className="mt-3 flex gap-3">
                <Link href="/products" className="rounded-md bg-(--accent) text-black px-3 py-2 text-sm">Limpiar filtros</Link>
                <Link href="/products?page=1&sort=createdAt:desc" className="rounded-md border border-(--border) px-3 py-2 text-sm">Ver recientes</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-2">
              {items.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  checkoutMode={site?.checkoutMode}
                  whatsappNumber={site?.whatsappNumber}
                />
              ))}
            </div>
          )}

          {/* Paginación */}
          <nav className="flex gap-4 mt-6">
            <Link
              href={`/products?q=${encodeURIComponent(q)}&category=${category}&sort=${sort}&page=${Math.max(1, Number(page) - 1)}`}
              className="text-sm underline"
            >
              Prev
            </Link>
            <Link
              href={`/products?q=${encodeURIComponent(q)}&category=${category}&sort=${sort}&page=${Number(page) + 1}`}
              className="text-sm underline"
            >
              Next
            </Link>
          </nav>
        </main>
      </div>
    );
  } catch (e: any) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-red-600">Error: {e.message}</p>
      </main>
    );
  }
}