// filepath: c:\Users\ezema\www\E-commerce-SupleFsa\Frontend-Store-Ecommerce\src\lib\checkoutMode.ts
import { getSiteConfig } from '@/lib/site';

export type CheckoutMode = 'CATALOG' | 'CART';

export function cartEnabledFrom(mode?: string | null): boolean {
  return mode === 'CART';
}

export async function isCartEnabled(): Promise<boolean> {
  const site = await getSiteConfig();
  return cartEnabledFrom((site as any)?.checkoutMode);
}