import { calcFocusIndex } from '../../../utils/calc-focus-index';
import { Actions, ActionType, SelectContextType } from './type';

export function reducer(state: SelectContextType, action: ActionType) {
  switch (action.type) {
    case Actions.MOVE_OPTION: {
      const { direction, to } = action.payload;
      const targetIndex = calcFocusIndex({
        optionList: state.optionRefList,
        direction,
        currentFocusedIndex: state.focusedOptionIndex,
        to,
      });

      if (targetIndex === null) return state;

      return { ...state, focusedOptionIndex: targetIndex };
    }
    case Actions.TOGGLE_OPEN: {
      return { ...state, isOpen: !state.isOpen };
    }
    case Actions.SET_OPEN: {
      return { ...state, isOpen: action.payload.isOpen, focusedOptionIndex: null };
    }
    case Actions.APPLY_TRIGGER_REF: {
      return { ...state, triggerRef: action.payload.ref };
    }
    case Actions.APPLY_LIST_REF: {
      return { ...state, listRef: action.payload.ref };
    }
    case Actions.APPLY_OPTION_REF: {
      const optionInfo = action.payload;
      return { ...state, optionRefList: [...state.optionRefList, optionInfo] };
    }
    case Actions.UNAPPLY_OPTION_REF: {
      const targetOptionId = action.payload.optionId;
      const adjustedOptionRefList = state.optionRefList.slice();
      const targetOptionIndex = adjustedOptionRefList.findIndex((option) => option.id === targetOptionId);
      if (targetOptionIndex < 0) return { ...state };

      adjustedOptionRefList.splice(targetOptionIndex, 1);
      return { ...state, optionRefList: adjustedOptionRefList };
    }
  }
}
