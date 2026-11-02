import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook to manage touch-based pull-to-refresh on mobile views.
 * Handles elastic resistance, touch coordinate tracking, and async refresh lifecycle.
 *
 * @param {Function} onRefresh - Async callback executed when user pulls past the threshold
 * @param {number} threshold - Minimum pull distance in px to trigger refresh (default: 45)
 */
export function usePullToRefresh(onRefresh, threshold = 45) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const scrollContainerRef = useRef(null);
  const touchStartY = useRef(0);
  const isPullEligible = useRef(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || !onRefresh) return;
    setIsRefreshing(true);
    try {
      await Promise.allSettled([
        onRefresh(),
        new Promise(resolve => setTimeout(resolve, 600)) // smooth tactile feedback
      ]);
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, [onRefresh, isRefreshing]);

  const onTouchStart = useCallback((e) => {
    if (isRefreshing) return;
    const container = scrollContainerRef.current;
    if (container && container.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
      isPullEligible.current = true;
    } else {
      isPullEligible.current = false;
    }
  }, [isRefreshing]);

  const onTouchMove = useCallback((e) => {
    if (!isPullEligible.current || isRefreshing) return;
    const container = scrollContainerRef.current;
    if (container && container.scrollTop > 0) {
      isPullEligible.current = false;
      if (pullDistance > 0) {
        setIsPulling(false);
        setPullDistance(0);
      }
      return;
    }

    const currentY = e.touches[0].clientY;
    const dy = currentY - touchStartY.current;

    // Only engage elastic resistance when user intentionally drags down from the top
    if (dy > 8) {
      if (!isPulling) setIsPulling(true);
      const pull = Math.min(75, (dy - 8) * 0.42);
      setPullDistance(pull);
    } else if (pullDistance > 0) {
      setPullDistance(0);
      setIsPulling(false);
    }
  }, [isPullEligible, isRefreshing, pullDistance, isPulling]);

  const onTouchEnd = useCallback(() => {
    if (!isPullEligible.current) return;
    isPullEligible.current = false;
    if (isPulling) setIsPulling(false);

    if (pullDistance >= threshold && !isRefreshing) {
      handleRefresh();
    } else if (pullDistance > 0) {
      setPullDistance(0);
    }
  }, [isPullEligible, isPulling, pullDistance, threshold, isRefreshing, handleRefresh]);

  return {
    pullDistance,
    isPulling,
    isRefreshing,
    scrollContainerRef,
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  };
}

