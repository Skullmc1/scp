'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Hero from '@/components/Hero';

export default function Page() {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <Hero />
    </main>
  );
}
