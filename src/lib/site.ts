import { backendFetch } from '@/lib/backend';

export async function getSiteConfig() {
  return backendFetch('/content/site', { cache: 'no-store' });
}