'use client';

import { useState, type InputHTMLAttributes } from 'react';
import CheckoutSidebar from '@/components/CheckoutSidebar';

type PaymentMethod = 'MERCADOPAGO' | 'TRANSFER';
type DeliveryMethod = 'DELIVERY' | 'PICKUP';

type CartItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  product?: {
    name: string;
    slug: string;
    discountTransfer?: number | null;
    discountMp?: number | null;
    images?: { url: string }[];
  } | null;
  productVariant?: {
    id: number;
    options?: { optionValue?: { value: string; product?: { name: string } } | null }[];
  } | null;
};

type CheckoutInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  label: string;
  helper?: string;
  wrapperClassName?: string;
  inputClassName?: string;
};

function CheckoutInput({
  label,
  helper,
  required,
  wrapperClassName = '',
  inputClassName = '',
  ...props
}: CheckoutInputProps) {
  return (
    <label className={`block space-y-1.5 ${wrapperClassName}`}>
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="ml-1 text-orange-600">*</span> : null}
      </span>

      <input
        {...props}
        required={required}
        className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 ${inputClassName}`}
      />

      {helper ? <span className="block text-xs text-slate-500">{helper}</span> : null}
    </label>
  );
}

export default function CheckoutForm({ items }: { items: CartItem[] }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MERCADOPAGO');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('DELIVERY');

  const isDelivery = deliveryMethod === 'DELIVERY';

  return (
    <form
      action="/cart/actions/checkout"
      method="POST"
      className="grid md:grid-cols-[1fr_360px] gap-8 pb-36 md:pb-0"
    >
      <section className="order-2 md:order-1 border border-(--border) rounded-lg p-5 sm:p-6 bg-(--surface) space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Datos para coordinar tu pedido</h2>
          <p className="text-sm text-(--text-muted)">
            Completá lo necesario para registrar la compra. Coordinamos los detalles por WhatsApp.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <CheckoutInput
            name="fullName"
            label="Nombre y apellido"
            placeholder="Ej: Ezequiel Martinez"
            required
            autoComplete="name"
          />

          <CheckoutInput
            name="phone"
            type="tel"
            label="WhatsApp"
            placeholder="Ej: 3704 123456"
            required
            autoComplete="tel"
            inputMode="tel"
            helper="Lo usamos para coordinar la entrega o el retiro."
          />

          <CheckoutInput
            name="email"
            type="email"
            label="Email"
            placeholder="tuemail@email.com"
            autoComplete="email"
            helper="Opcional. Sirve para recibir referencias del pedido."
            wrapperClassName="md:col-span-2"
          />
        </div>

        <div className="border-t border-(--border) pt-4 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Entrega</h3>
            <p className="text-xs text-(--text-muted)">
              Elegí cómo preferís recibir el pedido. El costo final de envío se coordina luego.
            </p>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Método de entrega</span>
            <select
              name="deliveryMethod"
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            >
              <option value="DELIVERY">Coordinar envío por WhatsApp</option>
              <option value="PICKUP">Retiro en tienda</option>
            </select>
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <CheckoutInput
              name="city"
              label="Ciudad"
              placeholder="Ej: Formosa"
              required
              autoComplete="address-level2"
            />

            <CheckoutInput
              name="state"
              label="Provincia"
              placeholder="Ej: Formosa"
              required
              autoComplete="address-level1"
            />

            {isDelivery ? (
              <>
                <CheckoutInput
                  name="street"
                  label="Dirección o referencia"
                  placeholder="Ej: Emilio Puchini 1915, barrio, referencia"
                  required
                  autoComplete="street-address"
                  wrapperClassName="md:col-span-2"
                />

                <CheckoutInput
                  name="zip"
                  label="Código postal"
                  placeholder="Ej: 3600"
                  autoComplete="postal-code"
                  inputMode="numeric"
                />
              </>
            ) : (
              <>
                <input type="hidden" name="street" value="Retiro en tienda" />
                <input type="hidden" name="zip" value="" />

                <div className="md:col-span-2 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
                  <p className="font-medium">Retiro en tienda</p>
                  <p className="text-xs">
                    Al confirmar la compra, coordinamos por WhatsApp el horario y punto de retiro.
                  </p>
                </div>
              </>
            )}

            <input type="hidden" name="country" value="Argentina" />
          </div>
        </div>
      </section>

      <div className="order-1 md:order-2">
        <CheckoutSidebar
          items={items}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
      </div>
    </form>
  );
}