import { Actions, ActionType, SelectContextType } from './type';

export function reducer(state: SelectContextType, action: ActionType) {
  switch (action.type) {
    case Actions.SELECT_OPTION: {
      return { ...state, selectedOptionIndex: action.payload.optionIndex };
    }
    case Actions.TOGGLE_OPEN: {
      return { ...state, isOpen: !state.isOpen };
    }
    case Actions.SET_OPEN: {
      return { ...state, isOpen: action.payload.isOpen };
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
