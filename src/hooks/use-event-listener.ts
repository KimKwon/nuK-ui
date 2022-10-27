import { useEffect } from 'react';

function useEventListener<EventType extends keyof WindowEventMap>(
  eventTarget: EventTarget | undefined | null = document,
  eventType: EventType,
  listener: (evt: WindowEventMap[EventType]) => unknown,
  options?: AddEventListenerOptions,
) {
  useEffect(() => {
    const _listener = listener as EventListenerOrEventListenerObject;

    eventTarget?.addEventListener(eventType, _listener, options);

    return () => {
      eventTarget?.removeEventListener(eventType, _listener, options);
    };
  }, [eventTarget, eventType, options, listener]);
}

export default useEventListener;
