'use client';

import { useEffect, useRef } from 'react';

export default function StaggerChildren({ 
  children, 
  className = '', 
  staggerDelay = 100,
  threshold = 0.1 
}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.querySelectorAll('.stagger-item').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = container.querySelectorAll('.stagger-item');
          items.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add('revealed');
            }, i * staggerDelay);
          });
          observer.unobserve(container);
        }
      },
      { threshold }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [children, staggerDelay, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}