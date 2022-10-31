import { calcSelectIndex } from '../../../utils/calc-select-index';
import { Actions, ActionType, SelectContextType } from './type';

export function reducer(state: SelectContextType, action: ActionType) {
  switch (action.type) {
    case Actions.MOVE_OPTION: {
      const { direction, to } = action.payload;
      const targetIndex = calcSelectIndex({
        optionList: state.optionRefList,
        direction,
        currentSelectedIndex: state.selectedOptionIndex,
        to,
      });

      if (targetIndex === null) return state;

      return { ...state, selectedOptionIndex: targetIndex };
    }
    case Actions.TOGGLE_OPEN: {
      return { ...state, isOpen: !state.isOpen, selectedOptionIndex: null };
    }
    case Actions.SET_OPEN: {
      return { ...state, isOpen: action.payload.isOpen, selectedOptionIndex: null };
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
