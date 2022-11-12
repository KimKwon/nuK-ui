import { isPlainObject } from './type-checker';

type AnyObject = Record<string, unknown>;

function isSameObject(aObject: AnyObject, bObject: AnyObject) {
  const aKeys = Object.keys(aObject);
  const bKeys = Object.keys(bObject);

  if (aKeys.length !== bKeys.length) return false;

  for (const aKey of aKeys) {
    if (!bKeys.includes(aKey)) return false;
    if (aObject[aKey] !== bObject[aKey]) return false;
  }

  return true;
}

export function simplyCompare(a: any, b: any) {
  if (typeof a !== typeof b) return false;
  if (isPlainObject(a) && isPlainObject(b)) {
    return isSameObject(a, b);
  }

  return a === b;
}
