import Link from 'next/link';
import { getSiteConfig } from '@/lib/site';

export async function Footer() {
  const site = await getSiteConfig();
  const socials = (site?.socialLinks || []).filter((s: any) => s?.url);

  return (
    <footer className="border-t border-(--border) bg-(--surface) mt-16">
      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 md:grid-cols-4">
        <section className="space-y-2">
          <h4 className="text-sm font-semibold">HAMSA</h4>
          <p className="text-sm text-(--text-muted)">Eyewear y accesorios con estilo.</p>
          <p className="text-xs text-(--text-muted)">© {new Date().getFullYear()} Hamsa Eyewear</p>
        </section>

        <section>
          <h4 className="text-sm font-semibold mb-2">Ayuda</h4>
          <ul className="grid gap-2 text-sm">
            <li><Link href="/products" className="hover:text-(--accent)">Catálogo</Link></li>
            <li><Link href="/contact" className="hover:text-(--accent)">Contacto</Link></li>
            <li><a href="#" className="hover:text-(--accent)">Envíos y devoluciones</a></li>
            <li><a href="#" className="hover:text-(--accent)">Preguntas frecuentes</a></li>
          </ul>
        </section>

        <section>
          <h4 className="text-sm font-semibold mb-2">Empresa</h4>
          <ul className="grid gap-2 text-sm">
            <li><Link href="/about" className="hover:text-(--accent)">Nosotros</Link></li>
            <li><a href="#" className="hover:text-(--accent)">Términos y condiciones</a></li>
            <li><a href="#" className="hover:text-(--accent)">Privacidad</a></li>
          </ul>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-semibold">Newsletter</h4>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 border border-(--border) rounded px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded px-3 py-2 text-sm bg-(--accent) text-black hover:opacity-90"
            >
              Suscribirme
            </button>
          </form>
        </section>

        <section>
          <h4 className="text-sm font-semibold mb-2">Seguinos</h4>
          {socials.length ? (
            <ul className="grid gap-2 text-sm">
              {socials.map((s: any) => (
                <li key={s.id}>
                  <a href={s.url} className="hover:text-(--accent)" target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-(--text-muted)">Sin redes configuradas.</p>
          )}
        </section>
      </div>
    </footer>
  );
}