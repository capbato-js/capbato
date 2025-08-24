import { useState, useEffect, RefObject, useMemo } from 'react';

interface UseTableHeightOptions {
  enabled: boolean;
  bottomPadding?: number;
  minHeight?: number;
  fallbackHeight?: string | number;
}

export function useTableHeight(
  containerRef: RefObject<HTMLElement | null>,
  options: UseTableHeightOptions
): string | number {
  const [calculatedHeight, setCalculatedHeight] = useState<string | number>(options.fallbackHeight || '400px');

  // Memoize options to prevent unnecessary effect reruns
  const memoizedOptions = useMemo(() => ({
    enabled: options.enabled,
    bottomPadding: options.bottomPadding ?? 20,
    minHeight: options.minHeight ?? 200,
    fallbackHeight: options.fallbackHeight ?? '400px'
  }), [options.enabled, options.bottomPadding, options.minHeight, options.fallbackHeight]);

  useEffect(() => {
    const { enabled, bottomPadding, minHeight, fallbackHeight } = memoizedOptions;
    
    console.log('[useTableHeight] Hook called with:', { enabled, fallbackHeight });
    
    if (!enabled) {
      console.log('[useTableHeight] Disabled - using fallback:', fallbackHeight);
      setCalculatedHeight(fallbackHeight);
      return;
    }
    
    if (!containerRef.current) {
      console.log('[useTableHeight] No container ref - using fallback:', fallbackHeight);
      setCalculatedHeight(fallbackHeight);
      return;
    }

    const calculateHeight = () => {
      const element = containerRef.current;
      if (!element) {
        console.log('[useTableHeight] No element reference');
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const offsetTop = rect.top + window.scrollY;
      
      // Calculate available height: viewport height - distance from top - bottom padding
      const availableHeight = viewportHeight - offsetTop - bottomPadding;
      
      // Ensure minimum height
      const finalHeight = Math.max(availableHeight, minHeight);
      
      console.log('[useTableHeight] Calculation:', {
        viewportHeight,
        offsetTop: rect.top,
        scrollY: window.scrollY,
        totalOffsetTop: offsetTop,
        bottomPadding,
        availableHeight,
        minHeight,
        finalHeight
      });
      
      setCalculatedHeight(finalHeight);
    };

    // Calculate on mount
    calculateHeight();

    // Recalculate on window resize
    const handleResize = () => {
      calculateHeight();
    };

    // Recalculate on scroll (in case table position changes)
    const handleScroll = () => {
      calculateHeight();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, memoizedOptions]); // Use memoized options instead of individual props

  return memoizedOptions.enabled ? calculatedHeight : memoizedOptions.fallbackHeight;
}