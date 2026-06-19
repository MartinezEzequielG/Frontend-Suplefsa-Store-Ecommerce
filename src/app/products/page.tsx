import Link from 'next/link';
import { backendFetch } from '@/lib/backend';
import { ProductCard } from '@/components/ProductCard';
import { getSiteConfig } from '@/lib/site';

type SearchParams = {
  q?: string;
  category?: string;
  page?: string;
  sort?: string;
};

function normalizePage(value: string) {
  const page = Number(value || 1);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function ProductsList({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  try {
    const {
      q = '',
      category = '',
      page = '1',
      sort = 'createdAt:desc',
    } = await searchParams;

    const currentPage = normalizePage(page);

    const qs = new URLSearchParams({
      limit: '24',
      page: String(currentPage),
      sort,
    });

    if (q) qs.set('search', q);
    if (category) qs.set('categorySlug', category);

    const [site, productsRes, categoriesRes] = await Promise.all([
      getSiteConfig(),
      backendFetch<{ items: any[]; total: number }>(
        `/products?${qs.toString()}`,
      ),
      backendFetch<any[]>('/categories/tree'),
    ]);

    const items = productsRes?.items ?? [];
    const total = productsRes?.total ?? 0;
    const categories = Array.isArray(categoriesRes) ? categoriesRes : [];

    const totalPages = Math.max(1, Math.ceil(total / 24));
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    function productsHref(overrides: Partial<SearchParams>) {
      const next = new URLSearchParams();

      const nextQ = overrides.q ?? q;
      const nextCategory = overrides.category ?? category;
      const nextSort = overrides.sort ?? sort;
      const nextPage = overrides.page ?? String(currentPage);

      if (nextQ) next.set('q', nextQ);
      if (nextCategory) next.set('category', nextCategory);

      next.set('page', nextPage);
      next.set('sort', nextSort);

      return `/products?${next.toString()}`;
    }

    const filterForm = (
      <form className="space-y-3">
        <input type="hidden" name="page" value="1" />

        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar producto"
          className="
            h-10 w-full rounded-lg border border-slate-200 bg-white px-3
            text-sm text-slate-900 outline-none
            placeholder:text-slate-400
            focus:border-slate-400
          "
        />

        <select
          name="category"
          defaultValue={category}
          className="
            h-10 w-full rounded-lg border border-slate-200 bg-white px-3
            text-sm text-slate-900 outline-none
            focus:border-slate-400
          "
        >
          <option value="">Todas las categorías</option>

          {categories.map((c: any) => (
            <optgroup key={c.id} label={c.name}>
              <option value={c.slug}>{c.name}</option>

              {(c.children || []).map((sc: any) => (
                <option key={sc.id} value={sc.slug}>
                  — {sc.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <select
          name="sort"
          defaultValue={sort}
          className="
            h-10 w-full rounded-lg border border-slate-200 bg-white px-3
            text-sm text-slate-900 outline-none
            focus:border-slate-400
          "
        >
          <option value="createdAt:desc">Más recientes</option>
          <option value="createdAt:asc">Más antiguos</option>
          <option value="basePrice:asc">Precio: menor a mayor</option>
          <option value="basePrice:desc">Precio: mayor a menor</option>
        </select>

        <button
          type="submit"
          className="
            h-10 w-full rounded-lg bg-slate-950 px-4
            text-sm font-bold text-white
            transition hover:bg-slate-800 active:scale-[0.99]
          "
        >
          Filtrar
        </button>
      </form>
    );

    return (
      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-[1220px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <aside className="space-y-5">
              <details className="border-b border-slate-200 pb-4 md:hidden">
                <summary className="cursor-pointer text-sm font-bold text-slate-950">
                  Filtros
                </summary>

                <div className="mt-4 space-y-4">
                  {filterForm}

                  {categories.length ? (
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 10).map((c: any) => (
                        <Link
                          key={c.id}
                          href={productsHref({
                            category: c.slug,
                            page: '1',
                          })}
                          className={`
                            rounded-full border px-3 py-1.5 text-xs transition
                            ${
                              category === c.slug
                                ? 'border-slate-950 bg-slate-950 !text-white'
                                : 'border-slate-200 !text-slate-600 hover:border-slate-400 hover:!text-slate-950'
                            }
                          `}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </details>

              <div className="hidden md:block">
                <h2 className="mb-3 text-sm font-bold text-slate-950">
                  Filtrar productos
                </h2>

                {filterForm}

                {categories.length ? (
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <h3 className="mb-3 text-sm font-bold text-slate-950">
                      Categorías
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 10).map((c: any) => (
                        <Link
                          key={c.id}
                          href={productsHref({
                            category: c.slug,
                            page: '1',
                          })}
                          className={`
                            rounded-full border px-3 py-1.5 text-xs transition
                            ${
                              category === c.slug
                                ? 'border-slate-950 bg-slate-950 !text-white'
                                : 'border-slate-200 !text-slate-600 hover:border-slate-400 hover:!text-slate-950'
                            }
                          `}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {(q || category) ? (
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <Link
                      href="/products?page=1&sort=createdAt:desc"
                      className="text-sm font-semibold !text-slate-500 transition hover:!text-slate-950"
                    >
                      Limpiar filtros
                    </Link>
                  </div>
                ) : null}

                <p className="mt-5 text-xs text-slate-500">
                  {total} producto{total === 1 ? '' : 's'}
                </p>
              </div>
            </aside>

            <section>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-950">
                    Productos
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    {q || category
                      ? 'Resultados según tus filtros.'
                      : 'Todos los productos disponibles.'}
                  </p>
                </div>

                <p className="hidden text-xs text-slate-500 sm:block">
                  Página {currentPage} de {totalPages}
                </p>
              </div>

              {items.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <p className="text-sm font-bold text-slate-950">
                    No encontramos productos para tu búsqueda.
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Probá cambiando la categoría, el texto de búsqueda o el orden.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/products"
                      className="
                        inline-flex h-10 items-center justify-center rounded-lg
                        bg-slate-950 px-4 text-sm font-bold !text-white
                        transition hover:bg-slate-800
                      "
                    >
                      Limpiar filtros
                    </Link>

                    <Link
                      href="/products?page=1&sort=createdAt:desc"
                      className="
                        inline-flex h-10 items-center justify-center rounded-lg
                        border border-slate-200 bg-white px-4
                        text-sm font-bold !text-slate-800
                        transition hover:border-slate-950
                      "
                    >
                      Ver recientes
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((p, idx) => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      idx={idx}
                      checkoutMode={site?.checkoutMode}
                      whatsappNumber={site?.whatsappNumber}
                    />
                  ))}
                </div>
              )}

              {totalPages > 1 ? (
                <nav className="mt-10 flex items-center justify-center gap-3">
                  {hasPrev ? (
                    <Link
                      href={productsHref({
                        page: String(currentPage - 1),
                      })}
                      className="
                        inline-flex h-10 items-center justify-center rounded-lg
                        border border-slate-200 bg-white px-4
                        text-sm font-bold !text-slate-800
                        transition hover:border-slate-950
                      "
                    >
                      Anterior
                    </Link>
                  ) : (
                    <span
                      className="
                        inline-flex h-10 items-center justify-center rounded-lg
                        border border-slate-200 bg-slate-50 px-4
                        text-sm font-bold text-slate-400
                      "
                    >
                      Anterior
                    </span>
                  )}

                  <span className="text-xs font-semibold text-slate-500">
                    {currentPage} / {totalPages}
                  </span>

                  {hasNext ? (
                    <Link
                      href={productsHref({
                        page: String(currentPage + 1),
                      })}
                      className="
                        inline-flex h-10 items-center justify-center rounded-lg
                        bg-slate-950 px-4
                        text-sm font-bold !text-white
                        transition hover:bg-slate-800
                      "
                    >
                      Siguiente
                    </Link>
                  ) : (
                    <span
                      className="
                        inline-flex h-10 items-center justify-center rounded-lg
                        bg-slate-100 px-4
                        text-sm font-bold text-slate-400
                      "
                    >
                      Siguiente
                    </span>
                  )}
                </nav>
              ) : null}
            </section>
          </div>
        </section>
      </main>
    );
  } catch (e: any) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-red-600">Error: {e.message}</p>
      </main>
    );
  }
}