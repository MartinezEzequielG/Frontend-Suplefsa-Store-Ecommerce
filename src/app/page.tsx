import Link from "next/link";
import { backendFetch } from "@/lib/backend";
import { ProductCard } from "@/components/ProductCard";
import { getSiteConfig } from "@/lib/site";
import { imageUrl } from "@/lib/backend";
import Hero3D from "@/components/Hero3D";

type Product = {
  id: number;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  images?: { url: string }[];
  category?: { slug: string; name: string } | null;
};

export default async function Home() {
  const site = await getSiteConfig();
  const banners = (site?.banners || []).filter((b: any) => b.active);

  const [{ items }, categories] = await Promise.all([
    backendFetch<{ items: Product[]; total: number }>("/products?limit=12&sort=createdAt:desc"),
    backendFetch<any[]>("/categories/tree"),
  ]);

  return (
    <div>
      <Hero3D />

      {/* Banners */}
      {banners.length > 0 && (
        <section className="bg-[var(--surface)] border-y border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <div className="grid gap-4 md:grid-cols-2">
              {banners.slice(0, 2).map((b: any) => (
                <a
                  key={b.id}
                  href={b.linkUrl || "#"}
                  className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition hover:border-[var(--accent)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl(b.imageUrl)}
                    alt={b.title || "Banner"}
                    className="h-44 w-full object-cover bg-zinc-100 transition group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <p className="font-semibold leading-tight">{b.title}</p>
                    {b.subtitle ? (
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{b.subtitle}</p>
                    ) : null}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categorías chips */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.slice(0, 10).map((c: any) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="shrink-0 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Novedades */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Novedades</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Últimos productos cargados en el catálogo.
            </p>
          </div>

          <Link
            href="/products"
            className="text-sm font-semibold underline-offset-4 hover:underline"
          >
            Ver todo
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
