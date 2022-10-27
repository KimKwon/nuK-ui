import { RefObject, useContext } from 'react';
import { selectContext } from './index';

function useSelectContext() {
  const { listRef, triggerRef, selectedOption, onChange, optionList, isOpen } = useContext(selectContext.state);
  const dispatch = useContext(selectContext.dispatch);

  const changeSelectOpenStatus = (isOpen: boolean) => {
    return () => {
      dispatch({
        type: 'isOpen/set_open',
        payload: {
          isOpen,
        },
      });
    };
  };

  const toggleSelectOpenStatus = () => {
    dispatch({
      type: 'isOpen/toggle_open',
    });
  };

  const selectOption = (option: string) => {
    dispatch({
      type: 'selectedOption/select_option',
      payload: {
        option,
      },
    });
  };

  const applyListRef = (ref: RefObject<HTMLUListElement>) => {
    dispatch({
      type: 'applyRef/listRef',
      payload: {
        ref,
      },
    });
  };

  const _addOptionRef = (_ref: RefObject<HTMLLIElement>) => ({});

  const applyTriggerRef = (ref: RefObject<HTMLButtonElement>) => {
    dispatch({
      type: 'applyRef/triggerRef',
      payload: {
        ref,
      },
    });
  };

  return {
    applyListRef,
    applyTriggerRef,
    listRef,
    triggerRef,
    selectedOption,
    onChange,
    optionList,
    isOpen,
    openSelect: changeSelectOpenStatus(true),
    closeSelect: changeSelectOpenStatus(false),
    toggleSelectOpenStatus,
    selectOption,
  };
}

export default useSelectContext;
