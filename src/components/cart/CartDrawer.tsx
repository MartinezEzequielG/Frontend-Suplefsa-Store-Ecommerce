import { Suspense } from 'react';
import CartDrawerClient from './CartDrawerClient';

export default function CartDrawer() {
  return (
    <Suspense fallback={null}>
      <CartDrawerClient />
    </Suspense>
  );
}