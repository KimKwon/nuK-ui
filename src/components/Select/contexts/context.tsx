import { createContext } from 'react';
import { ActionType, SelectContextType, SelectDispatch } from './type';

export const SelectContext = {
  state: createContext<SelectContextType | null>(null),
  dispatch: createContext<SelectDispatch>((_action: ActionType) => ({} as SelectContextType)),
};
