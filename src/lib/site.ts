import { backendFetch } from '@/lib/backend';

export type SiteConfig = {
  id: number;
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  contactEmail?: string | null;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
  banners?: any[];
  socialLinks?: any[];
  whatsappNumber?: string;
  address?: string;

  checkoutMode?: 'CATALOG' | 'CART';
};

export async function getSiteConfig(): Promise<SiteConfig> {
  return backendFetch<SiteConfig>('/content/site', { cache: 'no-store' });
}