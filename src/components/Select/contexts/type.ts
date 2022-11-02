import { Dispatch, RefObject } from 'react';

export type SelectDispatch = Dispatch<ActionType>;

export interface SelectContextType {
  isOpen: boolean;
  focusedOptionIndex: number | null;
  value?: unknown;
  onChange?: (value: unknown) => void;
  listRef: RefObject<HTMLUListElement> | null;
  triggerRef: RefObject<HTMLButtonElement> | null;
  optionRefList: OptionRefInfo[];
}

export interface OptionRefInfo {
  id: string;
  optionInfo: {
    domRef: RefObject<HTMLLIElement> | null;
    disabled?: boolean;
    optionValue: unknown;
    originText: string;
  };
}

export const Actions = {
  SET_OPEN: 'isOpen/set_open',
  TOGGLE_OPEN: 'isOpen/toggle_open',
  MOVE_OPTION: 'selectedOption/move_option',
  APPLY_TRIGGER_REF: 'applyRef/triggerRef',
  APPLY_LIST_REF: 'applyRef/listRef',
  APPLY_OPTION_REF: 'optionRefList/apply_optionRef',
  UNAPPLY_OPTION_REF: 'optionRefList/unapply_optionRef',
} as const;

export type ActionMap = {
  [type in keyof PayloadsType]: PayloadsType[type] extends undefined
    ? {
        type: type;
      }
    : {
        type: type;
        payload: PayloadsType[type];
      };
};

export interface DirectionInfo {
  direction: MoveDirection;
  to?: number;
}

export enum MoveDirection {
  PREV,
  NEXT,
  FIRST,
  LAST,
  TARGET,
  OUT,
}

export type PayloadsType = {
  [Actions.SET_OPEN]: { isOpen: boolean };
  [Actions.TOGGLE_OPEN]: undefined;
  [Actions.MOVE_OPTION]: DirectionInfo;
  [Actions.APPLY_LIST_REF]: { ref: RefObject<HTMLUListElement> };
  [Actions.APPLY_TRIGGER_REF]: { ref: RefObject<HTMLButtonElement> };
  [Actions.APPLY_OPTION_REF]: OptionRefInfo;
  [Actions.UNAPPLY_OPTION_REF]: { optionId: string };
};

export type ActionType = ActionMap[keyof PayloadsType];
