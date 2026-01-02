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
  whatsappNumber?: string; // <--- agrega esto
  address?: string;        // <--- agrega esto
};

export async function getSiteConfig() {
  return backendFetch('/content/site', { cache: 'no-store' });
}