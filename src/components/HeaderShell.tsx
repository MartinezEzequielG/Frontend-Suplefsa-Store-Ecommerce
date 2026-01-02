import { Header } from '@/components/Header';
import { getSiteConfig } from '@/lib/site';
import { imageUrl } from '@/lib/backend';

export async function HeaderShell() {
  const site = await getSiteConfig();
  const logo = site?.logoUrl ? imageUrl(site.logoUrl) : null;
  const brandName = site?.name || 'Suplementacion Formosa';
  return <Header logoUrl={logo} brandName={brandName} />;
}