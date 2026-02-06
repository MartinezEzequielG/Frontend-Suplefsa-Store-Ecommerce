import Link from "next/link";
import { backendFetch, imageUrl } from "@/lib/backend";
import { ProductCard } from "@/components/ProductCard";
import { getSiteConfig } from "@/lib/site";
import HeroEcommerce from "@/components/HeroEcommerce";

type Product = {
  id: number;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  images?: { url: string }[];
  category?: { slug: string; name: string } | null;
};

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="1.5" />
      <circle cx="18" cy="19" r="1.5" />
      <path d="M5.5 19H6" />
      <path d="M15.5 19H16" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default async function Home() {
  const site = await getSiteConfig();
  const banners = (site?.banners || []).filter((b: any) => b.active);

  const [{ items: newArrivals }, categories] = await Promise.all([
    backendFetch<{ items: Product[]; total: number }>("/products?limit=12&sort=createdAt:desc"),
    backendFetch<any[]>("/categories/tree"),
  ]);

  const topCats = (categories || []).slice(0, 16);
  const mainBanners = (banners || []).slice(0, 3);

  const MARQUEE_TEXT = "ENVÍOS A TODO EL PAÍS • CUOTAS SIN INTERÉS • ASESORAMIENTO POR WHATSAPP •";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root{
            --bg:#ffffff;
            --surface:#ffffff;
            --surface-2:#f8fafc;
            --border:#e5e7eb;

            --text:#0f172a;
            --text-muted:#475569;

            /* Azul dominante */
            --primary:#2196f3;
            --primary-2:#1565c0;
            --primary-3:#0b4aa2;
            --primary-rgb:33,150,243;

            --radius:18px;
          }

          @media (prefers-reduced-motion: reduce){
            [data-anim] { animation: none !important; opacity: 1 !important; transform: none !important; filter:none !important; }
            .animate-marquee { animation: none !important; transform: none !important; }
            .chipShine{ display:none !important; }
          }

          @keyframes slideUp {
            from{opacity:0;transform:translateY(18px); filter: blur(6px);}
            to{opacity:1;transform:translateY(0); filter: blur(0);}
          }
          @keyframes fadeIn {
            from{opacity:0; filter: blur(4px);}
            to{opacity:1; filter: blur(0);}
          }
          @keyframes scaleIn {
            from{opacity:0;transform:scale(.985); filter: blur(6px);}
            to{opacity:1;transform:scale(1); filter: blur(0);}
          }

          [data-anim]{
            opacity:0;
            animation-duration:.55s;
            animation-timing-function:cubic-bezier(.16,1,.3,1);
            animation-fill-mode:forwards;
            animation-delay: var(--d, .08s);
            will-change: transform, opacity, filter;
          }
          [data-anim="slide"]{ animation-name: slideUp; }
          [data-anim="fade"]{ animation-name: fadeIn; }
          [data-anim="scale"]{ animation-name: scaleIn; }

          @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          .animate-marquee { animation: marquee 18s linear infinite; }
          .hype-mask{
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }

          /* ✅ Fondo blanco pro (SIN orbs) */
          .bg-white-pro{
            background: #fff;
          }
          .grid-overlay{
            background-image:
              linear-gradient(to right, rgba(15,23,42,0.045) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px);
            background-size: 56px 56px;
            -webkit-mask-image: radial-gradient(circle at 35% 18%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 62%);
            mask-image: radial-gradient(circle at 35% 18%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 62%);
            opacity: .65;
          }

          .hide-scrollbar::-webkit-scrollbar { display:none; }
          .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
          .sport-italic { font-style: italic; }
          .tight { letter-spacing:-0.03em; }
          .track { letter-spacing:0.14em; }

          /* Chips categorías (SIN orbs) - pro & mobile-first */
          .catRow{
            display:flex;
            gap: 12px;
            overflow-x:auto;
            padding-bottom: 10px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }

          .catChip{
            scroll-snap-align:start;
            flex: 0 0 auto;

            position: relative;
            overflow: hidden;

            display:flex;
            align-items:center;
            justify-content:space-between;
            gap: 12px;

            min-height: 68px;
            padding: 15px 16px;
            border-radius: 999px;

            background:
              linear-gradient(#fff, #fff) padding-box,
              linear-gradient(135deg,
                rgba(var(--primary-rgb),0.80),
                rgba(var(--primary-rgb),0.18),
                rgba(var(--primary-rgb),0.70)
              ) border-box;
            border: 1.5px solid transparent;

            box-shadow:
              0 14px 34px rgba(2,6,23,0.06),
              inset 0 1px 0 rgba(255,255,255,0.85);

            transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
          }

          /* Shine (sutil) */
          .chipShine{
            position:absolute;
            inset:-2px;
            background: radial-gradient(circle at 30% 20%, rgba(var(--primary-rgb),0.22), transparent 48%);
            opacity: .0;
            transition: opacity .22s ease;
            pointer-events:none;
          }

          /* barrido */
          .catChip::after{
            content:"";
            position:absolute;
            top:-40%;
            left:-60%;
            width: 55%;
            height: 180%;
            transform: rotate(18deg);
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
            opacity: 0;
            transition: opacity .18s ease;
            pointer-events:none;
          }

          /* underline animado */
          .chipLine{
            position:absolute;
            left: 18px;
            right: 48px;
            bottom: 10px;
            height: 2px;
            background: linear-gradient(90deg, rgba(var(--primary-rgb),0.0), rgba(var(--primary-rgb),0.95), rgba(var(--primary-rgb),0.0));
            opacity: 0;
            transform: scaleX(.65);
            transition: opacity .22s ease, transform .22s ease;
            transform-origin: center;
          }

          .catChip:hover{
            transform: translateY(-2px);
            box-shadow:
              0 22px 60px rgba(2,6,23,0.10),
              0 18px 45px rgba(var(--primary-rgb),0.10),
              inset 0 1px 0 rgba(255,255,255,0.90);
            filter: saturate(1.05);
          }
          .catChip:hover .chipShine{ opacity: 1; }
          .catChip:hover .chipLine{ opacity: 1; transform: scaleX(1); }
          .catChip:hover::after{ opacity: 1; animation: chipSweep .9s ease; }
          @keyframes chipSweep{
            0%{ transform: translateX(0) rotate(18deg); }
            100%{ transform: translateX(220%) rotate(18deg); }
          }

          .catChip:active{ transform: scale(.985); }

          .chipText{
            min-width: 0;
            display:flex;
            flex-direction:column;
            gap: 3px;
          }

          .chipName{
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: .10em;
            font-size: 12px;
            line-height: 1.1;
            color: var(--text);
            max-width: 240px;
            overflow:hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .chipHint{
            font-size: 12px;
            color: var(--text-muted);
            line-height: 1.1;
          }

          .chipArrow{
            width: 40px;
            height: 40px;
            border-radius: 999px;
            display:grid;
            place-items:center;
            background: rgba(var(--primary-rgb),0.10);
            border: 1px solid rgba(var(--primary-rgb),0.18);
            color: var(--primary-2);
            transition: transform .22s ease, background .22s ease, border-color .22s ease;
            flex: 0 0 auto;
          }

          .catChip:hover .chipArrow{
            transform: translateX(2px);
            background: rgba(var(--primary-rgb),0.14);
            border-color: rgba(var(--primary-rgb),0.28);
          }

          @media (min-width: 768px){
            .catRow{
              flex-wrap: wrap;
              overflow: visible;
              scroll-snap-type: none;
              padding-bottom: 0;
            }
            .catChip{ min-height: 62px; }
          }

          .bannerCard{
            position:relative;
            overflow:hidden;
            border-radius: var(--radius);
            border:1px solid var(--border);
            background:#fff;
            box-shadow: 0 12px 34px rgba(2,6,23,0.06);
            transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          }
          .bannerCard:hover{
            transform: translateY(-2px);
            border-color: rgba(var(--primary-rgb),0.55);
            box-shadow: 0 24px 70px rgba(2,6,23,0.10);
          }
          .bannerImg{
            position:absolute; inset:0;
            width:100%; height:100%;
            object-fit:cover;
            transform: scale(1.01);
            transition: transform .7s ease;
          }
          .bannerCard:hover .bannerImg{ transform: scale(1.10); }
          .bannerOverlay{
            position:absolute; inset:0;
            background: linear-gradient(to top, rgba(255,255,255,0.93), rgba(255,255,255,0.35), rgba(255,255,255,0));
          }
          .bannerGlow{
            position:absolute; inset:0;
            background: radial-gradient(circle at 25% 20%, rgba(var(--primary-rgb),0.22), transparent 46%);
          }
          .bannerBody{
            position:relative;
            z-index: 1;
            height:100%;
            display:flex;
            flex-direction:column;
            justify-content:flex-end;
            padding: 18px;
          }
          @media(min-width:640px){ .bannerBody{ padding: 26px; } }

          .bannerBadge{
            display:inline-flex;
            width: fit-content;
            background: var(--primary);
            color:#fff;
            font-size: 11px;
            font-weight: 900;
            padding: 6px 10px;
            border-radius: 12px;
            text-transform: uppercase;
            box-shadow: 0 12px 30px rgba(var(--primary-rgb),0.18);
            margin-bottom: 10px;
          }
          .bannerTitle{
            font-weight: 900;
            text-transform: uppercase;
            font-style: italic;
            letter-spacing: -0.02em;
            line-height: 1.05;
            font-size: 22px;
          }
          .bannerTitleMain{ font-size: 28px; }
          @media(min-width:640px){
            .bannerTitle{ font-size: 26px; }
            .bannerTitleMain{ font-size: 50px; }
          }
          .bannerSub{
            margin-top: 10px;
            color: var(--text-muted);
            font-size: 14px;
            max-width: 520px;
            display:-webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient:vertical;
            overflow:hidden;
          }
          .bannerCta{
            margin-top: 14px;
            display:inline-flex;
            align-items:center;
            gap: 10px;
            color: var(--primary-2);
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: .12em;
            font-size: 11px;
            opacity: 0;
            transform: translateY(6px);
            transition: opacity .25s ease, transform .25s ease;
          }
          .bannerCard:hover .bannerCta{ opacity: 1; transform: translateY(0); }

          @keyframes glowBlue {
            0%,100%{ box-shadow: 0 0 0 rgba(var(--primary-rgb),0); }
            50%{ box-shadow: 0 22px 70px rgba(var(--primary-rgb),0.28); }
          }
        `,
        }}
      />

      <div className="bg-white min-h-screen text-[color:var(--text)] selection:bg-[var(--primary)] selection:text-white">
        {/* HERO (solo componente, sin nada extra) */}
        <div className="relative border-b border-[color:var(--border)] bg-white-pro">
          <div className="absolute inset-0 grid-overlay pointer-events-none" aria-hidden="true" />
          <div className="relative">
            <HeroEcommerce
              brandName={site?.name || "Suplementación Formosa"}
              whatsappNumber={site?.whatsappNumber}
            />
          </div>

          <div
            className="absolute left-0 right-0 -bottom-1 h-9"
            aria-hidden="true"
            style={{
              clipPath: "polygon(0 0, 100% 45%, 100% 100%, 0% 100%)",
              background:
                "linear-gradient(90deg, rgba(33,150,243,0.18), rgba(33,150,243,0.08), rgba(33,150,243,0.16))",
            }}
          />
        </div>

        {/* MARQUEE */}
        <div className="bg-[var(--primary)] py-3 overflow-hidden hype-mask">
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="text-white font-black uppercase track text-[11px] sm:text-sm mx-8">{MARQUEE_TEXT}</span>
            <span className="text-white font-black uppercase track text-[11px] sm:text-sm mx-8" aria-hidden="true">
              {MARQUEE_TEXT}
            </span>
            <span className="text-white font-black uppercase track text-[11px] sm:text-sm mx-8" aria-hidden="true">
              {MARQUEE_TEXT}
            </span>
          </div>
        </div>

        {/* BANNERS */}
        {mainBanners.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
            <div data-anim="slide" style={{ ["--d" as any]: ".08s" }} className="flex items-end justify-between gap-4 mb-6 sm:mb-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(33,150,243,0.10)] px-3 py-1 text-[11px] font-black text-[var(--primary-2)]">
                  PROMOS
                </div>
                <h2 className="mt-3 text-3xl sm:text-5xl font-black uppercase sport-italic tight leading-none">
                  Destacados <span className="text-[var(--primary)]">hoy</span>
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[color:var(--text-muted)] max-w-xl">
                  Lo más clickeado y lo mejor para decidir rápido.
                </p>
              </div>

              <Link
                href="/products?featured=true"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-black uppercase text-[var(--primary-2)] hover:gap-3 transition-all"
              >
                Ver destacados
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[220px] sm:auto-rows-[260px] gap-4">
              {mainBanners.map((b: any, i: number) => {
                const isMain = i === 0;
                const gridClasses = isMain ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1";
                const external = !!b.linkUrl && /^https?:\/\//i.test(b.linkUrl);

                return (
                  <a
                    key={b.id}
                    href={b.linkUrl || "#"}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    data-anim="scale"
                    style={{ ["--d" as any]: `${0.14 + i * 0.10}s` }}
                    className={`bannerCard ${gridClasses}`}
                  >
                    <img src={imageUrl(b.imageUrl)} alt={b.title || "Banner"} className="bannerImg" loading="lazy" />
                    <div className="bannerOverlay" />
                    <div className="bannerGlow" />

                    <div className="bannerBody">
                      {b.badgeText && <span className="bannerBadge">{b.badgeText}</span>}
                      <h3 className={`${isMain ? "bannerTitle bannerTitleMain" : "bannerTitle"}`}>{b.title}</h3>
                      {b.subtitle && isMain && <p className="bannerSub">{b.subtitle}</p>}

                      <div className="bannerCta">
                        Ver oferta
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="mt-6 sm:hidden">
              <Link href="/products?featured=true" className="inline-flex items-center gap-2 text-sm font-black uppercase text-[var(--primary-2)]">
                Ver destacados
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        )}

        {/* ✅ NUEVA SECCIÓN: MAYORISTA */}
        <section className="relative py-16 sm:py-20 overflow-hidden border-y border-[color:var(--border)]">
          {/* Fondo bandera argentina (más sutil que el footer) */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            aria-hidden="true"
            style={{
              background: `
                linear-gradient(to bottom,
                  rgba(117, 170, 219, 0.08) 0%,
                  rgba(117, 170, 219, 0.12) 33%,
                  rgba(255, 255, 255, 0.06) 33%,
                  rgba(255, 255, 255, 0.06) 66%,
                  rgba(117, 170, 219, 0.08) 66%,
                  rgba(117, 170, 219, 0.12) 100%
                )
              `,
            }}
          />

          <div className="absolute inset-0 grid-overlay pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
            <div data-anim="slide" style={{ ["--d" as any]: ".08s" }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(33,150,243,0.12)] border border-[rgba(33,150,243,0.20)] px-4 py-2 text-[11px] font-black text-[var(--primary-2)] uppercase tracking-wider mb-5">
                🇦🇷 Ahora somos mayoristas
              </div>

              {/* Título */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase sport-italic tight leading-none mb-4">
                Comprá <span className="text-[var(--primary)]">al por mayor</span>
              </h2>

              {/* Descripción */}
              <p className="text-base sm:text-lg text-[color:var(--text-muted)] max-w-2xl mx-auto mb-8">
                Precios especiales para gimnasios, nutricionistas y revendedores. 
                Stock constante y asesoramiento sin cargo.
              </p>

              {/* CTA único: WhatsApp mayorista */}
              <a
                href="https://wa.me/5493704777425?text=Hola!%20Quiero%20info%20sobre%20compras%20mayoristas."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25d366] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wide transition-all hover:bg-[#20ba5a] hover:scale-[1.02] shadow-lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar mayorista
              </a>

              {/* Info extra */}
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-[color:var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Precios especiales</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7h11v10H3z"/>
                    <path d="M14 10h4l3 3v4h-7z"/>
                    <circle cx="7" cy="19" r="1.5"/>
                    <circle cx="18" cy="19" r="1.5"/>
                  </svg>
                  <span>Envíos en volumen</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>Asesoramiento personalizado</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section className="border-y border-[color:var(--border)] bg-[linear-gradient(180deg,#fff,rgba(33,150,243,0.04))]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
            <div data-anim="slide" style={{ ["--d" as any]: ".08s" }} className="flex items-end justify-between gap-4 mb-5 sm:mb-7">
              <div>
                <p className="text-[color:var(--text-muted)] text-[11px] font-black uppercase track mb-2">CATEGORÍAS</p>
                <h2 className="text-3xl sm:text-4xl font-black uppercase sport-italic tight leading-none">
                  Explorá por <span className="text-[var(--primary)]">categoría</span>
                </h2>
                <p className="mt-2 text-sm text-[color:var(--text-muted)]">Deslizá y tocá para filtrar.</p>
              </div>

              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-black uppercase text-[var(--primary-2)] hover:gap-3 transition-all"
              >
                Ver todo
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="catRow hide-scrollbar -mx-1 px-1">
              {topCats.map((c: any, idx: number) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  data-anim="fade"
                  style={{ ["--d" as any]: `${0.12 + idx * 0.03}s` }}
                  className="catChip"
                  title={c.name}
                >
                  <span className="chipShine" aria-hidden="true" />
                  <span className="chipLine" aria-hidden="true" />

                  <span className="chipText">
                    <span className="chipName">{c.name}</span>
                    <span className="chipHint">Ver productos</span>
                  </span>

                  <span className="chipArrow" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-5 sm:hidden">
              <Link href="/products" className="inline-flex items-center gap-2 text-sm font-black uppercase text-[var(--primary-2)]">
                Ver todo
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* PRODUCTOS */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-18">
          <div data-anim="slide" style={{ ["--d" as any]: ".08s" }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(33,150,243,0.10)] px-3 py-1 text-[11px] font-black text-[var(--primary-2)]">
                ÚLTIMOS INGRESOS
              </div>
              <h2 className="mt-3 text-3xl sm:text-5xl font-black uppercase sport-italic tight leading-none">Novedades</h2>
              <p className="mt-2 text-sm sm:text-base text-[color:var(--text-muted)]">Productos recién cargados al catálogo.</p>
            </div>

            <Link
              href="/products?sort=createdAt:desc"
              className="inline-flex items-center gap-2 text-sm font-black uppercase text-[var(--primary-2)] hover:gap-3 transition-all"
            >
              Ver catálogo completo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {newArrivals.map((p, idx) => (
              <div key={p.id} data-anim="fade" style={{ ["--d" as any]: `${0.10 + idx * 0.03}s` }}>
                <ProductCard p={p} idx={idx} checkoutMode={site?.checkoutMode} whatsappNumber={site?.whatsappNumber} />
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-14 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-3 bg-[var(--primary)] text-white text-sm sm:text-base font-black uppercase track px-12 py-5 rounded-2xl transition-all duration-300 hover:bg-[var(--primary-2)] hover:scale-[1.02]"
              style={{ animation: "glowBlue 2.3s ease-in-out infinite" }}
            >
              Ver catálogo completo
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* USPs */}
        <section className="py-12 border-y border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(33,150,243,0.03),#fff)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              {[
                { icon: <TruckIcon className="w-7 h-7" />, title: "Envíos", desc: "A todo el país" },
                { icon: <CheckCircleIcon className="w-7 h-7" />, title: "Calidad", desc: "Productos verificados" },
                { icon: <UserIcon className="w-7 h-7" />, title: "Soporte", desc: "Asesoramiento real" },
              ].map((usp, i) => (
                <div key={i} data-anim="fade" style={{ ["--d" as any]: `${0.18 + i * 0.08}s` }}>
                  <div className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[rgba(33,150,243,0.10)] border border-[rgba(33,150,243,0.20)] mb-4 text-[var(--primary-2)]">
                    {usp.icon}
                  </div>
                  <h3 className="text-lg font-black uppercase sport-italic text-[color:var(--text)] mb-1">{usp.title}</h3>
                  <p className="text-sm text-[color:var(--text-muted)]">{usp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="relative py-16 sm:py-22 overflow-hidden bg-white-pro">
          {/* ✅ Bandera más opaca (valores aumentados) */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            aria-hidden="true"
            style={{
              background: `
                linear-gradient(to bottom,
                  rgba(117, 170, 219, 0.15) 0%,
                  rgba(117, 170, 219, 0.20) 33%,
                  rgba(255, 255, 255, 0.12) 33%,
                  rgba(255, 255, 255, 0.12) 66%,
                  rgba(117, 170, 219, 0.15) 66%,
                  rgba(117, 170, 219, 0.20) 100%
                )
              `,
              opacity: 3, // Ahora a full, la opacidad ya está en los rgba
            }}
          />

          <div className="absolute inset-0 grid-overlay pointer-events-none" aria-hidden="true" />
          
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <div data-anim="slide" style={{ ["--d" as any]: ".10s" }}>
              <h2 className="text-4xl sm:text-6xl font-black uppercase sport-italic tight leading-none mb-5">
                Suplementando <span className="text-[var(--primary)]">a todo un País.</span>
              </h2>
              <p className="text-base sm:text-xl text-[color:var(--text-muted)] mb-9 max-w-2xl mx-auto">
                Entrá al catálogo, busca y resolvé la compra en minutos.
              </p>

              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-3 bg-[var(--primary)] text-white text-sm sm:text-base font-black uppercase track px-12 py-5 rounded-2xl transition-all duration-300 hover:bg-[var(--primary-2)] hover:scale-[1.02]"
                style={{ animation: "glowBlue 2.3s ease-in-out infinite" }}
              >
                Explorar tienda
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
