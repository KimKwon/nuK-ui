import { MoveDirection, OptionRefInfo } from '../components/Select/contexts/type';

interface IndexCalculateInfo {
  optionList: OptionRefInfo[];
  direction: MoveDirection;
  currentSelectedIndex: number | null;
}

function getOriginIndexFromReversed(reversedIndex: number, length: number) {
  return length - reversedIndex - 1;
}

export function calcSelectIndex({ optionList, direction, currentSelectedIndex }: IndexCalculateInfo) {
  const optionLength = optionList.length;
  if (optionLength === 0 || currentSelectedIndex === null) return null;

  switch (direction) {
    case MoveDirection.NEXT: {
      const nextIndex = optionList.slice(currentSelectedIndex + 1).findIndex((option) => {
        return !option.optionInfo.disabled;
      });

      return nextIndex < 0 ? currentSelectedIndex : nextIndex + currentSelectedIndex + 1;
    }
    case MoveDirection.PREV: {
      const prevIndex = optionList.reverse().findIndex((option, index) => {
        if (currentSelectedIndex <= getOriginIndexFromReversed(index, optionLength)) return false;

        return !option.optionInfo.disabled;
      });

      return prevIndex < 0 ? currentSelectedIndex : getOriginIndexFromReversed(prevIndex, optionLength);
    }
    default:
      return null;
  }
}
