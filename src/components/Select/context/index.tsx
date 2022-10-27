import { createContext, Dispatch, PropsWithChildren, useReducer } from 'react';

export interface SelectContext {
  isOpen: boolean;
  optionList: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}

interface SelectControllProviderProps {
  defaultContext?: SelectContext;
}

const actions = {
  SET_OPEN: 'isOpen/set_open',
  TOGGLE_OPEN: 'isOpen/toggle_open',
  SELECT_OPTION: 'selectedOption/select_option',
  APPLY_CHANGE_LISTENER: '',
} as const;

type SelectDispatch = Dispatch<ActionType>;

type ActionMap = {
  [type in keyof PayloadsType]: PayloadsType[type] extends undefined
    ? {
        type: type;
      }
    : {
        type: type;
        payload: PayloadsType[type];
      };
};

type PayloadsType = {
  [actions.SET_OPEN]: { isOpen: boolean };
  [actions.TOGGLE_OPEN]: undefined;
  [actions.SELECT_OPTION]: { option: string };
  [actions.APPLY_CHANGE_LISTENER]: { onChange: (option: string) => void };
};

const initialSelectControll = {
  isOpen: false,
  optionList: [],
  selectedOption: '',
  onChange: (_option: string) => undefined,
};

export const selectContext = {
  state: createContext<SelectContext>(initialSelectControll),
  dispatch: createContext<SelectDispatch>((_action: ActionType) => ({} as SelectContext)),
};

type ActionType = ActionMap[keyof PayloadsType];

function reducer(state: SelectContext, action: ActionType) {
  switch (action.type) {
    case actions['SELECT_OPTION']: {
      return { ...state, selectedOption: action.payload.option };
    }
    case actions['TOGGLE_OPEN']: {
      return { ...state, isOpen: !state.isOpen };
    }
    case actions['SET_OPEN']: {
      return { ...state, isOpen: action.payload.isOpen };
    }
    case actions['APPLY_CHANGE_LISTENER']: {
      return { ...state, onChange: action.payload.onChange };
    }
  }
}

export function SelectControllProvider({ children, defaultContext }: PropsWithChildren<SelectControllProviderProps>) {
  const [state, dispatch] = useReducer(reducer, defaultContext || initialSelectControll);

  const { state: StateContext, dispatch: DispatchContext } = selectContext;

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}
