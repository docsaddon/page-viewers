import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash-es';

export const useHover = (element: HTMLElement | null) => {
  const [visible, setVisible] = useState(false);
  const boundary = element || document.body;
  const handleMouseEnter = useCallback(
    debounce(
      () => {
        setVisible(true);
      },
      100,
      { leading: true }
    ),
    []
  );

  const handleMouseLeave = useCallback(
    debounce(
      () => {
        setVisible(false);
      },
      100,
      { leading: true }
    ),
    []
  );

  useEffect(() => {
    boundary.addEventListener('mouseenter', handleMouseEnter, false);
    boundary.addEventListener('mouseleave', handleMouseLeave, false);
    return () => {
      boundary.removeEventListener('mouseenter', handleMouseEnter, false);
      boundary.removeEventListener('mouseleave', handleMouseLeave, false);
    };
  }, [handleMouseLeave, handleMouseEnter]);

  return visible;
};
