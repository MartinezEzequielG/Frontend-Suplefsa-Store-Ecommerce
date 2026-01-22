import { getSiteConfig } from '@/lib/site';
import { imageUrl } from '@/lib/backend';
import HeroEcommerceClient from './HeroEcommerceClient';

export default async function HeroEcommerce({
  brandName = 'Suplementación Formosa',
  whatsappNumber,
}: {
  brandName?: string;
  whatsappNumber?: string;
}) {
  const site = await getSiteConfig();
  const logoUrl = site?.logoUrl ? imageUrl(site.logoUrl) : null;

  return (
    <HeroEcommerceClient
      brandName={brandName}
      whatsappNumber={whatsappNumber}
      logoUrl={logoUrl}
    />
  );
}
