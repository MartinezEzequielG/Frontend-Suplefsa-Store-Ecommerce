'use client';
import { useEffect, useState } from 'react';

export default function Toast({ message }: { message?: string }) {
  const [show, setShow] = useState(Boolean(message));
  useEffect(() => {
    if (!message) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(t);
  }, [message]);
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded bg-black text-white px-4 py-2 text-sm shadow-lg">
      {message}
    </div>
  );
}