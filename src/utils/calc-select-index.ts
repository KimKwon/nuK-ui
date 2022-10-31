import { DirectionInfo, MoveDirection, OptionRefInfo } from '../components/Select/contexts/type';

interface IndexCalculateInfo {
  optionList: OptionRefInfo[];
  currentSelectedIndex: number | null;
}

function getOriginIndexFromReversed(reversedIndex: number, length: number) {
  return length - reversedIndex - 1;
}

export function calcSelectIndex({
  optionList,
  currentSelectedIndex,
  direction,
  to,
}: IndexCalculateInfo & DirectionInfo) {
  const optionLength = optionList.length;

  if (optionLength === 0) return null;
  if (currentSelectedIndex === null && to !== undefined) return to;

  switch (direction) {
    case MoveDirection.NEXT: {
      if (currentSelectedIndex === null) return null;
      const nextIndex = optionList.slice(currentSelectedIndex + 1).findIndex((option) => {
        return !option.optionInfo.disabled;
      });

      return nextIndex < 0 ? currentSelectedIndex : nextIndex + currentSelectedIndex + 1;
    }
    case MoveDirection.PREV: {
      if (currentSelectedIndex === null) return null;
      const prevIndex = optionList
        .slice()
        .reverse()
        .findIndex((option, index) => {
          if (currentSelectedIndex <= getOriginIndexFromReversed(index, optionLength)) return false;

          return !option.optionInfo.disabled;
        });

      return prevIndex < 0 ? currentSelectedIndex : getOriginIndexFromReversed(prevIndex, optionLength);
    }
    case MoveDirection.FIRST: {
      return 0;
    }
    case MoveDirection.LAST: {
      return optionLength - 1;
    }
    case MoveDirection.TARGET: {
      if (to === undefined) return null;

      return to;
    }
    default:
      return null;
  }
}
