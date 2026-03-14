import Link from 'next/link';
import { cookies } from 'next/headers';
import CheckoutSteps from '@/components/CheckoutSteps';
import OrderActions from '@/components/OrderActions';
import { API, imageUrl } from '@/lib/backend';
import { formatPrice } from '@/lib/format';
import { getSiteConfig } from '@/lib/site';

type OrderItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  product?: {
    id: number;
    name: string;
    slug: string;
    images?: { url: string; position?: number }[];
  } | null;
  productVariant?: {
    id: number;
    sku?: string | null;
    options?: Array<{
      optionValue?: {
        value?: string | null;
        product?: { name?: string | null } | null;
      } | null;
    }>;
  } | null;
};

type PublicOrder = {
  id: number;
  status: string;
  total: number;
  shippingCost: number;
  paymentMethod?: string | null;
  createdAt?: string;
  items?: OrderItem[];
  shippingAddress?: {
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    country?: string | null;
  } | null;
};

async function fetchOrder(id: string): Promise<PublicOrder> {
  const jar = await cookies();
  const cookie = jar.toString();
  const sid = jar.get('sid')?.value || '';

  const res = await fetch(`${API}/orders/public/${id}`, {
    cache: 'no-store',
    headers: {
      Cookie: cookie,
      'x-session-id': sid,
      Accept: 'application/json',
    },
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || 'No se pudo cargar la orden');
  }

  if (!text) {
    throw new Error('Respuesta vacía del backend');
  }

  return JSON.parse(text) as PublicOrder;
}

function getVariantLabel(item: OrderItem) {
  const pairs =
    item.productVariant?.options
      ?.map((opt) => {
        const label = opt.optionValue?.product?.name;
        const value = opt.optionValue?.value;
        if (!label || !value) return null;
        return `${label}: ${value}`;
      })
      .filter(Boolean) || [];

  return pairs.join(' · ');
}

function getPaymentVisualState(mp?: string, status?: string, orderStatus?: string) {
  const normalizedMp = String(mp || '').toLowerCase();
  const normalizedStatus = String(status || '').toLowerCase();
  const normalizedOrder = String(orderStatus || '').toLowerCase();

  if (normalizedMp === 'success' || normalizedStatus === 'approved' || normalizedOrder === 'paid') {
    return {
      badge: 'Pago aprobado',
      tone: 'emerald',
      title: 'Tu pago fue acreditado correctamente',
      description:
        'Guardá este comprobante. Si querés, también podés compartirlo por WhatsApp para agilizar cualquier consulta.',
    };
  }

  if (normalizedMp === 'pending' || normalizedStatus === 'pending') {
    return {
      badge: 'Pago pendiente',
      tone: 'amber',
      title: 'Tu pago está pendiente de confirmación',
      description:
        'Mercado Pago todavía está procesando la operación. Conservá este comprobante y, si querés, envialo por WhatsApp.',
    };
  }

  if (normalizedMp === 'failure' || normalizedStatus === 'rejected' || normalizedStatus === 'cancelled') {
    return {
      badge: 'Pago no acreditado',
      tone: 'red',
      title: 'No pudimos confirmar el pago',
      description:
        'Si creés que hubo un error o ya abonaste, compartinos el comprobante por WhatsApp para revisarlo.',
    };
  }

  return {
    badge: 'Pedido registrado',
    tone: 'zinc',
    title: 'Tu pedido fue registrado',
    description:
      'Conservá este comprobante para futuras consultas. Si necesitás asistencia, podés compartirlo por WhatsApp.',
  };
}

function toneClasses(tone: string) {
  switch (tone) {
    case 'emerald':
      return {
        shell: 'border-emerald-200 bg-emerald-50',
        badge: 'bg-emerald-600 text-white',
        title: 'text-emerald-900',
        text: 'text-emerald-800',
      };
    case 'amber':
      return {
        shell: 'border-amber-200 bg-amber-50',
        badge: 'bg-amber-500 text-white',
        title: 'text-amber-900',
        text: 'text-amber-800',
      };
    case 'red':
      return {
        shell: 'border-red-200 bg-red-50',
        badge: 'bg-red-600 text-white',
        title: 'text-red-900',
        text: 'text-red-800',
      };
    default:
      return {
        shell: 'border-zinc-200 bg-zinc-50',
        badge: 'bg-zinc-900 text-white',
        title: 'text-zinc-900',
        text: 'text-zinc-700',
      };
  }
}

export default async function OrderDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mp?: string; payment_id?: string; status?: string }>;
}) {
  const [{ id }, { mp = '', payment_id = '', status = '' }] = await Promise.all([
    params,
    searchParams,
  ]);

  let order: PublicOrder;
  let site;

  try {
    [order, site] = await Promise.all([fetchOrder(id), getSiteConfig()]);
  } catch (e: any) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-semibold">Error</h1>
        <p className="text-sm text-red-600">{e.message}</p>
      </main>
    );
  }

  const visual = getPaymentVisualState(mp, status, order.status);
  const colors = toneClasses(visual.tone);
  const waDigits = String(site?.whatsappNumber || '').replace(/\D/g, '');
  const createdAt = order.createdAt
    ? new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(order.createdAt))
    : null;

  const waText = [
    'Hola, quiero compartir mi comprobante de compra.',
    `Orden: #${order.id}`,
    payment_id ? `Pago MP: ${payment_id}` : null,
    status ? `Estado MP: ${status}` : null,
    `Estado del pedido: ${order.status}`,
    `Total: ${formatPrice(order.total)}`,
  ]
    .filter(Boolean)
    .join('\n');

  const whatsappHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(waText)}`
    : '';

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 print:px-0 print:py-4">
      <div className="mb-6 space-y-2 print:hidden">
        <CheckoutSteps step="done" />
      </div>

      <section className={`rounded-2xl border p-5 sm:p-6 ${colors.shell}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${colors.badge}`}>
              {visual.badge}
            </span>

            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold ${colors.title}`}>
                {visual.title}
              </h1>
              <p className={`mt-2 max-w-2xl text-sm sm:text-base ${colors.text}`}>
                {visual.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-xl border border-white/60 bg-white/80 p-4 backdrop-blur-sm sm:min-w-[300px]">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Orden</p>
              <p className="text-lg font-bold text-zinc-900">#{order.id}</p>
            </div>

            {payment_id ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">ID de pago</p>
                <p className="text-sm font-semibold text-zinc-900 break-all">{payment_id}</p>
              </div>
            ) : null}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Estado</p>
              <p className="text-sm font-semibold text-zinc-900">{order.status}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total</p>
              <p className="text-xl font-extrabold text-zinc-900">{formatPrice(order.total)}</p>
            </div>

            {createdAt ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Fecha</p>
                <p className="text-sm font-semibold text-zinc-900">{createdAt}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-5 print:hidden">
          <OrderActions whatsappHref={whatsappHref} />
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Comprobante de compra</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Conservá este resumen para cualquier consulta sobre tu pedido.
                </p>
              </div>
              <span className="hidden rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 sm:inline-flex">
                No fiscal
              </span>
            </div>

            <ul className="space-y-4">
              {(order.items || []).map((item) => {
                const variantLabel = getVariantLabel(item);
                return (
                  <li key={item.id} className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                    <img
                      src={imageUrl(item.product?.images?.[0]?.url)}
                      alt={item.product?.name || 'Producto'}
                      className="h-16 w-16 rounded-lg bg-white object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-zinc-900">{item.product?.name}</p>
                      {variantLabel ? (
                        <p className="mt-1 text-xs text-zinc-500">{variantLabel}</p>
                      ) : null}
                      <p className="mt-1 text-xs text-zinc-500">
                        {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-zinc-500">Subtotal</p>
                      <p className="font-bold text-zinc-900">
                        {formatPrice(Number(item.unitPrice) * item.quantity)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 space-y-2 border-t border-zinc-200 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Envío</span>
                <span className="font-medium text-zinc-900">{formatPrice(order.shippingCost || 0)}</span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-zinc-900">Total pagado</span>
                <span className="font-extrabold text-zinc-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-zinc-900">Datos de entrega</h2>

            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p>
                <span className="font-semibold text-zinc-900">Nombre:</span>{' '}
                {order.shippingAddress?.fullName || 'No disponible'}
              </p>
              {order.shippingAddress?.email ? (
                <p>
                  <span className="font-semibold text-zinc-900">Email:</span>{' '}
                  {order.shippingAddress.email}
                </p>
              ) : null}
              {order.shippingAddress?.phone ? (
                <p>
                  <span className="font-semibold text-zinc-900">Teléfono:</span>{' '}
                  {order.shippingAddress.phone}
                </p>
              ) : null}
              <p>
                <span className="font-semibold text-zinc-900">Dirección:</span>{' '}
                {[
                  order.shippingAddress?.street,
                  order.shippingAddress?.city,
                  order.shippingAddress?.state,
                  order.shippingAddress?.zip,
                  order.shippingAddress?.country,
                ]
                  .filter(Boolean)
                  .join(', ') || 'No disponible'}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 print:hidden">
            <h2 className="text-lg font-bold text-zinc-900">¿Necesitás ayuda?</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Si querés confirmar recepción, compartir el comprobante o consultar el seguimiento,
              podés escribirnos citando tu número de orden.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition"
                >
                  Compartir por WhatsApp
                </a>
              ) : null}

              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition"
              >
                Seguir comprando
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}