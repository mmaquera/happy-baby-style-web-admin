import { useState, useCallback } from 'react';

interface UseSidebarTooltipReturn {
  isVisible: boolean;
  showTooltip: () => void;
  hideTooltip: () => void;
}

export const useSidebarTooltip = (delay: number = 500): UseSidebarTooltipReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    setTimeoutId(id);
  }, [delay, timeoutId]);

  const hideTooltip = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  }, [timeoutId]);

  return {
    isVisible,
    showTooltip,
    hideTooltip,
  };
};
