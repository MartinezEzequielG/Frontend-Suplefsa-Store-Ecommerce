import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

function normalizeProducts(data: any) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.rows)) return data.rows;

  return [];
}

export async function GET() {
  try {
    const data = await backendFetch<any>('/products?page=1&limit=12');

    const products = normalizeProducts(data);

    const items = products
      .filter((product: any) => product?.id && product?.slug)
      .filter((product: any) => product?.active !== false)
      .slice(0, 12);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('[cart recommendations]', error);

    return NextResponse.json({ items: [] }, { status: 200 });
  }
}