export const DEFAULT_LOCALE = 'es-AR';
export const DEFAULT_CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || 'ARS';

export function formatPrice(value: unknown, locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY) {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
}

export function formatDate(value: string | Date, locale = DEFAULT_LOCALE) {
  const d = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: undefined }).format(d);
}