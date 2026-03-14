import { useEffect } from 'react';

/**
 * Hook to handle keyboard arrow key navigation
 */
export const useKeyNav = (onPrev: () => void, onNext: () => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext]);
};
