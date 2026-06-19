'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatPrice } from '@/lib/format';

type ProductOption = {
  id?: number;
  name?: string | null;
  values?: Array<{
    id?: number;
    value?: string | null;
  }>;
};

type VariantOption = {
  optionValue?: {
    value?: string | null;
    product?: {
      name?: string | null;
    } | null;
  } | null;
};

type ProductVariant = {
  id: number;
  sku?: string | null;
  price?: number | string | null;
  active?: boolean | null;
  onHand?: number | null;
  reserved?: number | null;
  stock?: {
    available?: number | null;
  } | null;
  options?: VariantOption[];
};

type OptionGroup = {
  name: string;
  values: string[];
};

type PaymentOption = {
  key: 'MP' | 'TRANSFER';
  label: string;
  price: number;
  discount: number;
};

type Props = {
  productId: number;
  productName: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  discountTransfer: number;
  discountMp: number;
  variants: ProductVariant[];
  options: ProductOption[];
  cartEnabled: boolean;
  whatsappNumber: string;
};

function getDiscountedPrice(price: number, discount: number) {
  if (!discount || discount <= 0) return price;
  return Math.round(price * (1 - discount / 100));
}

function getVariantOptions(variant: ProductVariant) {
  return (variant.options || [])
    .map((item) => {
      const name = item.optionValue?.product?.name?.trim() || '';
      const value = item.optionValue?.value?.trim() || '';

      if (!name || !value) return null;

      return { name, value };
    })
    .filter(Boolean) as Array<{ name: string; value: string }>;
}

function buildOptionGroups(options: ProductOption[], variants: ProductVariant[]) {
  if (Array.isArray(options) && options.length > 0) {
    return options
      .map((option) => ({
        name: String(option.name || '').trim(),
        values: (option.values || [])
          .map((value) => String(value.value || '').trim())
          .filter(Boolean),
      }))
      .filter((group) => group.name && group.values.length > 0);
  }

  const map = new Map<string, Set<string>>();

  variants.forEach((variant) => {
    getVariantOptions(variant).forEach(({ name, value }) => {
      if (!map.has(name)) map.set(name, new Set());
      map.get(name)?.add(value);
    });
  });

  return Array.from(map.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values),
  }));
}

function variantMatchesSelection(
  variant: ProductVariant,
  selection: Record<string, string>,
) {
  const opts = getVariantOptions(variant);

  return Object.entries(selection).every(([name, value]) =>
    opts.some((opt) => opt.name === name && opt.value === value),
  );
}

function getAvailableStock(variant?: ProductVariant | null) {
  if (!variant) return null;

  if (variant.stock?.available != null) {
    return Number(variant.stock.available);
  }

  if (variant.onHand != null) {
    return Number(variant.onHand) - Number(variant.reserved ?? 0);
  }

  return null;
}

export default function ProductBuyBox({
  productId,
  productName,
  slug,
  basePrice,
  salePrice,
  discountTransfer,
  discountMp,
  variants,
  options,
  cartEnabled,
  whatsappNumber,
}: Props) {
  const activeVariants = useMemo(
    () => (variants || []).filter((variant) => variant.active !== false),
    [variants],
  );

  const optionGroups = useMemo(
    () => buildOptionGroups(options, activeVariants),
    [options, activeVariants],
  );

  const [selection, setSelection] = useState<Record<string, string>>({});

  useEffect(() => {
    const initial: Record<string, string> = {};

    optionGroups.forEach((group) => {
      if (group.values.length === 1) {
        initial[group.name] = group.values[0];
      }
    });

    setSelection(initial);
  }, [optionGroups]);

  const fullySelected = optionGroups.every((group) => !!selection[group.name]);

  const selectedVariant = useMemo(() => {
    if (!activeVariants.length || !fullySelected) return null;

    return (
      activeVariants.find((variant) =>
        variantMatchesSelection(variant, selection),
      ) || null
    );
  }, [activeVariants, fullySelected, selection]);

  const currentBasePrice = useMemo(() => {
    if (selectedVariant?.price != null) {
      return Number(selectedVariant.price);
    }

    return salePrice ?? basePrice;
  }, [selectedVariant, salePrice, basePrice]);

  const paymentOptions = useMemo<PaymentOption[]>(() => {
    const list: PaymentOption[] = [];

    if (discountMp > 0) {
      list.push({
        key: 'MP',
        label: 'Mercado Pago',
        price: getDiscountedPrice(currentBasePrice, discountMp),
        discount: discountMp,
      });
    }

    if (discountTransfer > 0) {
      list.push({
        key: 'TRANSFER',
        label: 'Transferencia',
        price: getDiscountedPrice(currentBasePrice, discountTransfer),
        discount: discountTransfer,
      });
    }

    return list.sort((a, b) => a.price - b.price);
  }, [currentBasePrice, discountMp, discountTransfer]);

  const bestPayment = paymentOptions[0] ?? null;
  const bestPrice = bestPayment?.price ?? currentBasePrice;
  const showOriginalPrice = bestPrice < currentBasePrice;

  const stock = getAvailableStock(selectedVariant);
  const canAdd =
    optionGroups.length === 0 ||
    (!!selectedVariant && (stock == null || stock > 0));

  const selectedLabel = optionGroups
    .map((group) => {
      const value = selection[group.name];
      return value ? `${group.name}: ${value}` : null;
    })
    .filter(Boolean)
    .join(' · ');

  const addToCartAction = `/cart/actions/add?next=${encodeURIComponent(
    `/products/${slug}?cart=open`,
  )}`;

  const waDigits = whatsappNumber.replace(/\D/g, '');
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(
        `Hola! Quiero consultar por ${productName}${
          selectedLabel ? ` - ${selectedLabel}` : ''
        }`,
      )}`
    : '';

  return (
    <section className="space-y-5">
      <div className="text-center lg:text-left">
        {showOriginalPrice ? (
          <div className="mb-1 flex items-center justify-center gap-2 lg:justify-start">
            <span className="text-sm font-medium text-slate-400 line-through">
              {formatPrice(currentBasePrice)}
            </span>

            {bestPayment?.discount ? (
              <span className="text-sm font-bold text-green-700">
                {bestPayment.discount}% OFF
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="text-2xl font-medium text-slate-950">
          {formatPrice(bestPrice)}
        </div>

        {bestPayment ? (
          <p className="mt-1 text-sm text-slate-500">
            con {bestPayment.label}
          </p>
        ) : null}

        {paymentOptions.length > 1 ? (
          <div className="mt-3 flex justify-center gap-2 text-sm lg:justify-start">
            {paymentOptions.map((option) => (
              <span key={option.key} className="text-slate-500">
                {option.label}: <strong className="text-slate-950">{formatPrice(option.price)}</strong>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {optionGroups.length > 0 ? (
        <div className="space-y-4">
          {optionGroups.map((group) => (
            <div key={group.name} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">
                  {group.name}:
                </span>

                {selection[group.name] ? (
                  <span className="text-sm font-semibold text-slate-950">
                    {selection[group.name]}
                  </span>
                ) : null}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {group.values.map((value) => {
                  const nextSelection = {
                    ...selection,
                    [group.name]: value,
                  };

                  const available = activeVariants.some((variant) =>
                    variantMatchesSelection(variant, nextSelection),
                  );

                  const active = selection[group.name] === value;

                  return (
                    <button
                      key={`${group.name}-${value}`}
                      type="button"
                      disabled={!available}
                      onClick={() =>
                        setSelection((prev) => ({
                          ...prev,
                          [group.name]: value,
                        }))
                      }
                      className={[
                        'min-w-[56px] rounded-lg border px-4 py-2 text-sm font-semibold transition',
                        active
                          ? 'border-black bg-black text-white'
                          : 'border-slate-300 bg-white text-slate-950 hover:border-black',
                        !available
                          ? 'cursor-not-allowed opacity-40 line-through'
                          : '',
                      ].join(' ')}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {cartEnabled ? (
        <form action={addToCartAction} method="POST">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="quantity" value="1" />

          {selectedVariant ? (
            <>
              <input type="hidden" name="productVariantId" value={selectedVariant.id} />
              <input type="hidden" name="variantId" value={selectedVariant.id} />
            </>
          ) : null}

          <button
            type="submit"
            disabled={!canAdd}
            className="
              h-[46px] w-full rounded-lg bg-black px-5 text-sm font-bold text-white
              transition hover:bg-slate-800 active:scale-[0.99]
              disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400
            "
          >
            Agregar al carrito
          </button>

          {!canAdd && optionGroups.length > 0 ? (
            <p className="mt-2 text-xs text-slate-500">
              Seleccioná una variante disponible.
            </p>
          ) : null}
        </form>
      ) : waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[46px] w-full items-center justify-center rounded-lg bg-black px-5 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Consultar por WhatsApp
        </a>
      ) : null}
    </section>
  );
}