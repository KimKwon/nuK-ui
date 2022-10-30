import { useCallback, useState } from 'react';

function useInternalState<T>(
  externalState: T | undefined,
  onChange?: (nextValue: T) => void,
  defaultValue?: T,
): [T | undefined, (nextValue: T) => void] {
  const [internalState, setInternalState] = useState(defaultValue);

  const isUsingInternalState = useCallback(() => externalState === undefined, [externalState]);

  const adjustedOnChange = useCallback(
    (nextValue: T) => {
      if (isUsingInternalState()) {
        onChange?.(nextValue);
        setInternalState(nextValue);
        return;
      }

      onChange?.(nextValue);
    },
    [isUsingInternalState, onChange],
  );

  return [isUsingInternalState() ? internalState : externalState, adjustedOnChange];
}

export default useInternalState;
