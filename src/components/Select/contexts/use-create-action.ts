import { RefObject, useContext } from 'react';
import { SelectContext } from './context';
import { Actions, MoveDirection, OptionRefInfo } from './type';

function useCreateAction() {
  const dispatch = useContext(SelectContext.dispatch);

  const changeSelectOpenStatus = (isOpen: boolean) => {
    return () => {
      dispatch({
        type: Actions.SET_OPEN,
        payload: {
          isOpen,
        },
      });
    };
  };

  const toggleSelectOpenStatus = () => {
    dispatch({
      type: Actions.TOGGLE_OPEN,
    });
  };

  const selectOption = (optionIndex: number) => {
    dispatch({
      type: Actions.SELECT_OPTION,
      payload: {
        optionIndex,
      },
    });
  };

  const applyListRef = (ref: RefObject<HTMLUListElement>) => {
    dispatch({
      type: Actions.APPLY_LIST_REF,
      payload: {
        ref,
      },
    });
  };

  const applyTriggerRef = (ref: RefObject<HTMLButtonElement>) => {
    dispatch({
      type: Actions.APPLY_TRIGGER_REF,
      payload: {
        ref,
      },
    });
  };

  const applyOptionRef = ({ id, optionInfo }: OptionRefInfo) => {
    dispatch({
      type: Actions.APPLY_OPTION_REF,
      payload: {
        id,
        optionInfo,
      },
    });
  };

  const unapplyOptionRef = (optionId: string) => {
    dispatch({
      type: Actions.UNAPPLY_OPTION_REF,
      payload: {
        optionId,
      },
    });
  };

  const moveOption = (direction: MoveDirection) => {
    dispatch({
      type: Actions.MOVE_OPTION,
      payload: {
        direction,
      },
    });
  };

  return {
    closeSelectList: changeSelectOpenStatus(false),
    openSelectList: changeSelectOpenStatus(false),
    toggleSelectOpenStatus,
    selectOption,
    moveOption,
    applyListRef,
    applyTriggerRef,
    applyOptionRef,
    unapplyOptionRef,
  };
}

export default useCreateAction;
