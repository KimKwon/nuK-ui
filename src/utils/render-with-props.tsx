import { cloneElement, isValidElement, ReactNode } from 'react';

type Props = Record<string, unknown>;
type EventListenerType = (...args: any[]) => any;

function getValidElement(toBeValidElement: ReactNode) {
  if (!isValidElement(toBeValidElement)) return <>{toBeValidElement}</>;

  return toBeValidElement;
}

function renderWithProps(originProps: Props, targetElement: ReactNode) {
  const validTargetElement = getValidElement(targetElement);

  return cloneElement(validTargetElement, {
    ...mergeProps(originProps, validTargetElement.props),
  });
}

function mergeProps(originProp: Props, subjectProp: Props) {
  const propList = [...Object.entries(originProp), ...Object.entries(omit(subjectProp, 'children'))];
  const eventListeners: Record<string, EventListenerType[]> = {};
  const mergedPropListWithoutEventListener = propList.reduce(
    (acc, [key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        if (eventListeners[key] === undefined) {
          eventListeners[key] = [];
        }
        eventListeners[key].push(value as EventListenerType);
        return acc;
      }
      return {
        ...acc,
        [key]: value,
      };
    },
    { ...originProp },
  );

  return {
    ...mergedPropListWithoutEventListener,
    ...mergeEventListener(eventListeners),
  };
}

function mergeEventListener(listeners: Record<string, EventListenerType[]>) {
  const mergedEventListener: Record<string, EventListenerType> = {};

  return Object.entries(listeners).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key](...args: Parameters<EventListenerType>) {
        value.forEach((listener) => listener(...args));
      },
    };
  }, mergedEventListener);
}

function omit(object: Props, keyToOmit: string) {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (key === keyToOmit) return acc;

    return { ...acc, [key]: value };
  }, {});
}

export default renderWithProps;
