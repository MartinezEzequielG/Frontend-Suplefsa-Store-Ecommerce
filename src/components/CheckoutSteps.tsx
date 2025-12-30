import Link from 'next/link';

export default function CheckoutSteps({ step }: { step: 'cart' | 'checkout' | 'done' }) {
  const items = [
    { key: 'cart', label: 'Carrito', href: '/cart' },
    { key: 'checkout', label: 'Checkout', href: '/checkout' },
    { key: 'done', label: 'Confirmación', href: '/orders' },
  ] as const;

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-(--text-muted)">
      {items.map((it, idx) => {
        const active = it.key === step;
        const cls = active ? 'text-(--text) font-semibold' : 'hover:text-(--accent)';
        return (
          <span key={it.key} className="flex items-center gap-2">
            {it.key === 'done' ? (
              <span className={cls}>{it.label}</span>
            ) : (
              <Link href={it.href} className={cls}>
                {it.label}
              </Link>
            )}
            {idx < items.length - 1 ? <span className="text-(--border)">/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}