// hooks/use-count-up.ts

'use client';

import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  startOnView?: boolean;
}

export function useCountUp({
  end,
  duration = 2000,
  delay = 0,
  decimals = 0,
  startOnView = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const prevEnd = useRef(end);

  // Intersection observer trigger
  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 },
    );

    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasStarted, startOnView]);

  // Initial count-up animation
  useEffect(() => {
    if (!hasStarted) return;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const easeOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = end * easeOut(progress);
        setCount(Number(current.toFixed(decimals)));
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [hasStarted, end, duration, delay, decimals]);

  // Smooth update when `end` changes after initial animation
  useEffect(() => {
    if (!hasStarted || prevEnd.current === end) return;
    prevEnd.current = end;

    const startVal = count;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / 600, 1);
      const current = startVal + (end - startVal) * progress;
      setCount(Number(current.toFixed(decimals)));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end]);

  return { count, ref, hasStarted };
}