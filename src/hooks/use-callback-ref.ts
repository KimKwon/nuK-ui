import { useCallback, useState } from 'react';

type CallbackRefFunc<T> = (ref: T) => void;
type RefValue<T> = {
  current: T;
};

function useCallbackRef<T>(): [RefValue<T> | null, CallbackRefFunc<T>] {
  const [mountedRef, _setMountedRef] = useState<RefValue<T> | null>(null);

  const setMountedRef = useCallback((element: T) => {
    _setMountedRef({
      current: element,
    });
  }, []);

  return [mountedRef, setMountedRef];
}

export default useCallbackRef;
