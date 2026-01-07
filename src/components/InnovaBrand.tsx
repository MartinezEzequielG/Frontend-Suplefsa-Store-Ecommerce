'use client';

import Image from 'next/image';

export default function InnovaBrand({
  href = 'https://innova-webdev.com/',
  label = 'Innova',
  size = 22,
  className = '',
}: {
  href?: string;
  label?: string;
  size?: number;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label}
      title={label}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
    >
      <span
        aria-hidden="true"
        style={{ position: 'relative', width: size, height: size, flex: `0 0 ${size}px` }}
      >
        <Image
          src="/innova.png"
          alt=""
          fill
          sizes={`${size}px`}
          style={{ objectFit: 'contain' }}
        />
      </span>

      <span className="font-bold text-gray-900 group-hover:text-blue-600 transition">{label}</span>
    </a>
  );
}