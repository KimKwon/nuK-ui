import { DirectionInfo, MoveDirection, OptionRefInfo } from '../components/Select/contexts/type';

interface IndexCalculateInfo {
  optionList: OptionRefInfo[];
  currentFocusedIndex: number | null;
}

function getOriginIndexFromReversed(reversedIndex: number, length: number) {
  return length - reversedIndex - 1;
}

export function calcFocusIndex({ optionList, currentFocusedIndex, direction, to }: IndexCalculateInfo & DirectionInfo) {
  const optionLength = optionList.length;

  if (optionLength === 0) return null;
  if (currentFocusedIndex === null && to !== undefined) return to;

  switch (direction) {
    case MoveDirection.NEXT: {
      if (currentFocusedIndex === null) return null;
      const nextIndex = optionList.slice(currentFocusedIndex + 1).findIndex((option) => {
        return !option.optionInfo.disabled;
      });

      return nextIndex < 0 ? currentFocusedIndex : nextIndex + currentFocusedIndex + 1;
    }
    case MoveDirection.PREV: {
      if (currentFocusedIndex === null) return null;
      const prevIndex = optionList
        .slice()
        .reverse()
        .findIndex((option, index) => {
          if (currentFocusedIndex <= getOriginIndexFromReversed(index, optionLength)) return false;

          return !option.optionInfo.disabled;
        });

      return prevIndex < 0 ? currentFocusedIndex : getOriginIndexFromReversed(prevIndex, optionLength);
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
    case MoveDirection.OUT: {
      return null;
    }
    default:
      return null;
  }
}
