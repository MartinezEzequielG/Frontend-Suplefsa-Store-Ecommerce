'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatPrice } from '@/lib/format';

type VariantOption = {
  optionValue?: {
    value?: string | null;
    product?: {
      name?: string | null;
    } | null;
  } | null;
  value?: string | null;
  name?: string | null;
};

type ProductVariant = {
  id: number;
  sku?: string | null;
  price?: number | null;
  stock?: {
    available?: number;
  } | null;
  options?: VariantOption[];
};

type ProductPurchasePanelProps = {
  productId: number;
  slug: string;
  productName: string;
  basePrice: number;
  salePrice: number | null;
  discountTransfer: number;
  discountMp: number;
  variants: ProductVariant[];
  cartEnabled: boolean;
  whatsappNumber: string;
};

type OptionGroup = {
  name: string;
  values: string[];
};

function getDiscountedPrice(price: number, discount: number) {
  if (!discount || discount <= 0) return price;
  return price - (price * discount) / 100;
}

function normalizeVariantOptions(variant: ProductVariant) {
  return (variant.options || [])
    .map((opt) => {
      const name =
        opt?.optionValue?.product?.name?.trim() ||
        opt?.name?.trim() ||
        '';

      const value =
        opt?.optionValue?.value?.trim() ||
        opt?.value?.trim() ||
        '';

      if (!name || !value) return null;
      return { name, value };
    })
    .filter(Boolean) as { name: string; value: string }[];
}

function buildOptionGroups(variants: ProductVariant[]) {
  const map = new Map<string, Set<string>>();

  variants.forEach((variant) => {
    normalizeVariantOptions(variant).forEach(({ name, value }) => {
      if (!map.has(name)) map.set(name, new Set());
      map.get(name)!.add(value);
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
  const opts = normalizeVariantOptions(variant);

  return Object.entries(selection).every(([groupName, selectedValue]) =>
    opts.some((opt) => opt.name === groupName && opt.value === selectedValue),
  );
}

function variantHasValue(
  variant: ProductVariant,
  groupName: string,
  value: string,
) {
  const opts = normalizeVariantOptions(variant);
  return opts.some((opt) => opt.name === groupName && opt.value === value);
}

export default function ProductPurchasePanel({
  productId,
  slug,
  productName,
  basePrice,
  salePrice,
  discountTransfer,
  discountMp,
  variants,
  cartEnabled,
  whatsappNumber,
}: ProductPurchasePanelProps) {
  const optionGroups = useMemo(() => buildOptionGroups(variants), [variants]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const initial: Record<string, string> = {};
    optionGroups.forEach((group) => {
      if (group.values.length === 1) {
        initial[group.name] = group.values[0];
      }
    });
    setSelectedOptions(initial);
  }, [optionGroups]);

  const matchingVariants = useMemo(() => {
    if (!variants.length) return [];
    return variants.filter((variant) =>
      variantMatchesSelection(variant, selectedOptions),
    );
  }, [variants, selectedOptions]);

  const fullySelected = optionGroups.every((group) => !!selectedOptions[group.name]);

  const selectedVariant = useMemo(() => {
    if (!variants.length) return null;
    if (!fullySelected) return null;

    return (
      matchingVariants.find((variant) =>
        optionGroups.every((group) => {
          const val = selectedOptions[group.name];
          return variantHasValue(variant, group.name, val);
        }),
      ) || null
    );
  }, [variants, fullySelected, matchingVariants, optionGroups, selectedOptions]);

  const activeBasePrice = useMemo(() => {
    if (selectedVariant?.price != null) {
      return Number(selectedVariant.price);
    }

    if (salePrice != null) return salePrice;
    return basePrice;
  }, [selectedVariant, salePrice, basePrice]);

  const transferPrice = useMemo(
    () => getDiscountedPrice(activeBasePrice, discountTransfer),
    [activeBasePrice, discountTransfer],
  );

  const mpPrice = useMemo(
    () => getDiscountedPrice(activeBasePrice, discountMp),
    [activeBasePrice, discountMp],
  );

  const bestPrice = Math.min(
    transferPrice || activeBasePrice,
    mpPrice || activeBasePrice,
    activeBasePrice,
  );

  const bestMethod =
    bestPrice === mpPrice && discountMp > 0
      ? 'Mercado Pago'
      : bestPrice === transferPrice && discountTransfer > 0
      ? 'Transferencia'
      : 'Precio regular';

  const maxStock = selectedVariant?.stock?.available ?? null;
  const canBuyWithoutVariants = !optionGroups.length;
  const canBuy = canBuyWithoutVariants || !!selectedVariant;

  const waDigits = whatsappNumber.replace(/\D/g, '');
  const selectedVariantText = optionGroups
    .map((group) => {
      const value = selectedOptions[group.name];
      return value ? `${group.name}: ${value}` : null;
    })
    .filter(Boolean)
    .join(', ');

  const waMessage = encodeURIComponent(
    `Hola! Quiero consultar por ${productName}${selectedVariantText ? ` - ${selectedVariantText}` : ''}`,
  );

  const waHref = waDigits ? `https://wa.me/${waDigits}?text=${waMessage}` : '#';

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="space-y-5">
        {/* PRECIO */}
        <div className="rounded-[24px] bg-slate-50 p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              {bestPrice < activeBasePrice ? (
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg font-semibold text-slate-400 line-through">
                    {formatPrice(activeBasePrice)}
                  </span>

                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                    {bestMethod === 'Mercado Pago' ? `${discountMp}% OFF` : `${discountTransfer}% OFF`}
                  </span>
                </div>
              ) : null}

              <div className="text-[42px] font-black leading-none tracking-tight text-slate-950 sm:text-[52px]">
                {formatPrice(bestPrice)}
              </div>

              <p className="mt-2 text-sm font-medium text-slate-600">
                {bestMethod === 'Precio regular' ? 'Precio final' : `Pagando con ${bestMethod}`}
              </p>
            </div>

            <div className="min-w-[220px] rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="font-medium text-slate-500">Mercado Pago</span>
                <span className="font-bold text-slate-950">{formatPrice(mpPrice)}</span>
              </div>
              <div className="border-t border-slate-100 flex items-center justify-between px-4 py-3 text-sm">
                <span className="font-medium text-slate-500">Transferencia</span>
                <span className="font-bold text-slate-950">{formatPrice(transferPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* VARIANTES */}
        {optionGroups.length > 0 ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Elegí tu variante</h2>
              <p className="mt-1 text-sm text-slate-500">
                Seleccioná una opción para agregarlo al carrito.
              </p>
            </div>

            {optionGroups.map((group) => (
              <div key={group.name} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-700">
                    {group.name}
                  </span>

                  {selectedOptions[group.name] ? (
                    <span className="text-sm text-slate-500">
                      {selectedOptions[group.name]}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.values.map((value) => {
                    const nextSelection = {
                      ...selectedOptions,
                      [group.name]: value,
                    };

                    const available = variants.some((variant) =>
                      variantMatchesSelection(variant, nextSelection),
                    );

                    const active = selectedOptions[group.name] === value;

                    return (
                      <button
                        key={`${group.name}-${value}`}
                        type="button"
                        onClick={() =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [group.name]: value,
                          }))
                        }
                        disabled={!available}
                        className={[
                          'min-w-[64px] rounded-xl border px-4 py-2.5 text-sm font-semibold transition',
                          active
                            ? 'border-slate-950 bg-slate-950 text-white'
                            : 'border-slate-300 bg-white text-slate-800 hover:border-slate-500',
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

        {/* CANTIDAD + CTA */}
        <div className="space-y-4 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">Cantidad</span>

            <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="h-11 w-11 text-lg font-bold text-slate-700 transition hover:bg-slate-50"
              >
                –
              </button>

              <div className="flex h-11 min-w-[48px] items-center justify-center border-x border-slate-200 px-3 text-sm font-bold text-slate-900">
                {quantity}
              </div>

              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="h-11 w-11 text-lg font-bold text-slate-700 transition hover:bg-slate-50"
              >
                +
              </button>
            </div>

            {maxStock != null ? (
              <span className="text-sm text-slate-500">
                Stock disponible: <strong>{maxStock}</strong>
              </span>
            ) : null}
          </div>

          {cartEnabled ? (
            <form
              action={`/cart/actions/add?next=${encodeURIComponent(`/products/${slug}?cart=open`)}`}
              method="POST"
              className="space-y-3"
            >
              <input type="hidden" name="productId" value={productId} />
              {selectedVariant ? (
                <input type="hidden" name="variantId" value={selectedVariant.id} />
              ) : null}
              <input type="hidden" name="quantity" value={quantity} />

              <button
                type="submit"
                disabled={!canBuy}
                className="
                  flex h-14 w-full items-center justify-center rounded-2xl
                  bg-slate-950 px-5 text-base font-black text-white transition
                  hover:bg-slate-800 active:scale-[0.99]
                  disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400
                "
              >
                Agregar al carrito
              </button>

              {!canBuy && optionGroups.length > 0 ? (
                <p className="text-sm text-slate-500">
                  Seleccioná una opción en cada atributo para continuar.
                </p>
              ) : null}
            </form>
          ) : waDigits ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#25d366] px-5 text-base font-black text-white transition hover:bg-[#1fb85a]"
            >
              Consultar por WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}