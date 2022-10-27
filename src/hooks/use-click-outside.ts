import { RefObject } from 'react';
import useEventListener from './use-event-listener';

function useClickOutside(domRefs: RefObject<HTMLElement>[], onClickOutside: () => void) {
  function handleClickOutside(e: MouseEvent) {
    const target = e.composedPath?.()?.[0] || e.target;
    if (!target || !(target instanceof HTMLElement)) return;
    if (domRefs.every((domRef) => domRef === null)) return;

    const isInsideClick = domRefs.some((domRef) => {
      if (!domRef?.current) return false;

      return domRef.current?.contains(target);
    });

    if (isInsideClick) return;

    onClickOutside();
  }

  useEventListener(document, 'click', handleClickOutside);
}

export default useClickOutside;
