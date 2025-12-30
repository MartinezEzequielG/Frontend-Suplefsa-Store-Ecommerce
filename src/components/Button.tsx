import type { ComponentProps } from 'react';

export default function Button({ className = '', ...props }: ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-md bg-(--accent) text-white px-4 py-2 text-sm transition hover:opacity-90 ${className}`}
    />
  );
}