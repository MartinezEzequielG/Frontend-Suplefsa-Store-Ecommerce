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
        <section className="bg-gradient-to-b from-[var(--surface)] to-white border-y border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
            <div className="grid gap-5 md:grid-cols-2">
              {banners.slice(0, 2).map((b: any) => (
                <a
                  key={b.id}
                  href={b.linkUrl || "#"}
                  className="group relative block overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition hover:shadow-lg hover:border-[var(--accent)] hover:-translate-y-1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl(b.imageUrl)}
                    alt={b.title || "Banner"}
                    className="h-48 sm:h-56 w-full object-cover bg-zinc-100 transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="font-bold text-lg sm:text-xl leading-tight drop-shadow-lg">{b.title}</p>
                    {b.subtitle && (
                      <p className="mt-1.5 text-sm sm:text-base drop-shadow-md">{b.subtitle}</p>
                    )}
                  </div>
                  {b.linkUrl && (
                    <div className="absolute top-4 right-4 bg-[var(--accent)] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      Ver oferta →
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categorías más compactas */}
      <section className="bg-white border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] mb-2">
                  Explorá por categoría
                </h2>
                <p className="text-sm sm:text-base text-[var(--text-muted)]">
                  Navegá directo a lo que buscás
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] underline-offset-4 hover:underline"
              >
                Ver catálogo completo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Grid más compacto: 3 cols mobile, 5 tablet, 6 desktop */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
            {categories.slice(0, 12).map((c: any) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 border-[var(--border)] bg-white transition-all hover:border-[var(--primary)] hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 text-center font-bold text-xs sm:text-sm text-[var(--text)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Novedades */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">
              Novedades
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-[var(--text-muted)]">
              Últimos productos que llegaron al catálogo
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] underline-offset-4 hover:underline"
          >
            Ver catálogo completo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
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

        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-2)] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition hover:shadow-xl hover:-translate-y-1"
          >
            <span className="text-base sm:text-lg">Explorar todos los productos</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* USPs sin emoticones */}
      <section className="bg-gradient-to-br from-[var(--surface)] to-white border-t border-[var(--border)] py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                ),
                title: "Envíos rápidos",
                desc: "A toda la provincia"
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                ),
                title: "Productos de calidad",
                desc: "Seleccionados y verificados"
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ),
                title: "Asesoramiento gratis",
                desc: "Te ayudamos a elegir"
              }
            ].map((usp, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-[var(--border)] shadow-sm">
                <div className="text-[var(--primary)] mb-3">
                  {usp.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg text-[var(--text)] mb-1">
                  {usp.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {usp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
