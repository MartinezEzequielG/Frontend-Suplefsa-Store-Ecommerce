export default function InstagramLink({
  url,
  username,
  size = 20,
  className = '',
}: {
  url?: string;
  username?: string;
  size?: number;
  className?: string;
}) {
  const raw = (url || '').trim();

  // Si viene URL del CMS, usarla siempre
  const href =
    raw
      ? (raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`)
      : (() => {
          const clean = (username || '').trim().replace(/^@/, '');
          return clean ? `https://instagram.com/${clean}` : '';
        })();

  if (!href) return null;

  // Nombre a mostrar: si no viene username, intentamos extraerlo desde la URL
  let handle = (username || '').trim().replace(/^@/, '');
  if (!handle) {
    try {
      const u = new URL(href);
      const parts = u.pathname.split('/').filter(Boolean);
      handle = parts[0] || '';
    } catch {
      handle = '';
    }
  }

  const gradId = `ig-gradient-${handle.replace(/[^a-z0-9_-]/gi, '') || 'x'}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 group ${className}`}
      aria-label={handle ? `Instagram de ${handle}` : 'Instagram'}
      title={handle ? `@${handle}` : 'Instagram'}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="flex-shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FD5949" />
            <stop offset="50%" stopColor="#D6249F" />
            <stop offset="100%" stopColor="#285AEB" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="4" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.5" fill={`url(#${gradId})`} />
      </svg>

      {handle ? (
        <span className="font-semibold text-gray-800 group-hover:text-pink-600 transition">@{handle}</span>
      ) : (
        <span className="font-semibold text-gray-800 group-hover:text-pink-600 transition">Instagram</span>
      )}
    </a>
  );
}