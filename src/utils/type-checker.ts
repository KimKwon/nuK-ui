export function isPlainObject(objectable: unknown): objectable is Record<string, unknown> {
  if (typeof objectable !== 'object') return false;
  if (objectable === null) return false;

  return true;
}

export function isString(stringable: unknown): stringable is string {
  return typeof stringable === 'string';
}

function hasProperty<T extends string>(
  object: any,
  prop: T,
): object is {
  T: unknown;
} {
  return Boolean(object?.[prop]);
}

export function isFunction(callable: unknown): callable is CallableFunction {
  return !!(callable && callable.constructor && hasProperty(callable, 'call') && hasProperty(callable, 'apply'));
}
