import { isFunction } from '../type-checker';

describe('타입 체킹 함수', () => {
  it('isFunction 함수는 호출 가능한 인자에 대해서 true를 반환해야 한다.', () => {
    const functions = [class {}, () => null, Number, (_: unknown) => _];
    functions.forEach((_function) => {
      expect(isFunction(_function)).toBe(true);
    });
  });

  it('isFunction 함수는 호출 불가능한 인자에 대해서 true를 반환해야 한다.', () => {
    const notFunctions = ['', 9709, {}, [], 'function'];
    notFunctions.forEach((notFunction) => {
      expect(isFunction(notFunction)).toBe(false);
    });
  });
});
