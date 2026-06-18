import { getSiteConfig } from '@/lib/site';
import WhatsappFloatButtonClient from '@/components/WhatsappFloatButtonClient';

export async function WhatsappFloatButton() {
  const site = await getSiteConfig();

  if (!site?.whatsappNumber) return null;

  return (
    <WhatsappFloatButtonClient whatsappNumber={site.whatsappNumber} />
  );
}