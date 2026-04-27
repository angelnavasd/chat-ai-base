import { useEffect, useRef, useCallback } from 'react';

interface SwipeOptions {
  threshold?: number;       // minimum px to trigger a swipe (default 50)
  velocityThreshold?: number; // min px/ms (default 0.3)
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

/**
 * Attach swipe gesture detection to a DOM element ref.
 * Works via touch events only — pointer events not used to avoid
 * conflicting with Radix / drag interactions.
 */
export function useSwipeGesture<T extends HTMLElement = HTMLElement>(
  options: SwipeOptions,
) {
  const { threshold = 50, velocityThreshold = 0.3, onSwipeLeft, onSwipeRight } = options;

  const ref = useRef<T>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    startTime.current = Date.now();
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = e.changedTouches[0].clientY - startY.current;
      const dt = Date.now() - startTime.current;

      // Ignore if primarily vertical
      if (Math.abs(dy) > Math.abs(dx)) return;

      const velocity = Math.abs(dx) / dt;
      if (Math.abs(dx) < threshold && velocity < velocityThreshold) return;

      if (dx < 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    },
    [threshold, velocityThreshold, onSwipeLeft, onSwipeRight],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return ref;
}
