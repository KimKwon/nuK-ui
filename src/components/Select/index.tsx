import { PropsWithChildren, useEffect, useId, useReducer, useRef } from 'react';
import styled from 'styled-components';
import useClickOutside from '../../hooks/use-click-outside';
import useEventListener from '../../hooks/use-event-listener';
import { reducer } from './contexts/reducer';
import useSelectContext from './contexts/use-select-context';
import useCallbackRef from '../../hooks/use-callback-ref';
import { SelectContext } from './contexts/context';
import useCreateAction from './contexts/use-create-action';
import { Actions, MoveDirection } from './contexts/type';
import { TestIds } from './__test__/util';
import useInternalState from '../../hooks/use-internal-state';

/**
 * ==============================
 * Style Object
 * ==============================
 */

const S = {
  Select: styled.div`
    position: relative;
  `,
  Trigger: styled.button`
    background-color: transparent;
    &:focus {
      background-color: red;
    }
  `,
  List: styled.ul`
    padding: 0;
    margin: 0;

    position: absolute;
    z-index: 9999;

    margin-top: 0.25rem;

    display: flex;
    flex-direction: column;

    background-color: white;
    border: 1px solid black;
    box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3);
  `,
  Option: styled.li`
    all: unset;

    padding: 5px;
    &:focus {
      background-color: red;
    }

    &:hover {
      cursor: pointer;
    }
  `,
};

/**
 * ==============================
 * Select
 * ==============================
 */

interface SelectProps<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  className?: string;
}

function Select<T>({
  children,
  className,
  onChange: externalOnChange,
  value: externalValue,
  defaultValue,
}: PropsWithChildren<SelectProps<T>>) {
  const { state: StateContext, dispatch: DispatchContext } = SelectContext;

  const [value, onChange] = useInternalState(externalValue, externalOnChange, defaultValue);

  const [state, dispatch] = useReducer(reducer, {
    value,
    isOpen: false,
    optionList: [],
    selectedOptionIndex: null,
    onChange: onChange as any,
    listRef: null,
    triggerRef: null,
    optionRefList: [],
  });

  const { listRef, triggerRef, isOpen } = state;

  const replaceWithoutRender = (value: T | undefined) => {
    state.value = value;
  };

  replaceWithoutRender(value);

  useClickOutside(
    [listRef, triggerRef],
    () => {
      dispatch({
        type: Actions.SET_OPEN,
        payload: {
          isOpen: false,
        },
      });

      state.triggerRef?.current?.focus();
    },
    isOpen,
  );

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <S.Select className={className}>{children}</S.Select>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

/**
 * ==============================
 * Trigger
 * ==============================
 */

function Trigger({ children }: PropsWithChildren) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { toggleSelectOpenStatus, applyTriggerRef } = useCreateAction();
  const context = useSelectContext();

  useEffect(() => {
    if (triggerRef.current) applyTriggerRef(triggerRef);
  }, []);

  return (
    <S.Trigger
      ref={triggerRef}
      data-testid={TestIds.Trigger}
      type="button"
      onClick={toggleSelectOpenStatus}
      aria-haspopup
      aria-expanded
      aria-controls="select-button"
    >
      {context.value !== undefined ? <>{context.value}</> : children}
    </S.Trigger>
  );
}

/**
 * ==============================
 * List
 * ==============================
 */

function List({ children }: PropsWithChildren) {
  const [listRef, setListRef] = useCallbackRef<HTMLUListElement>();

  const context = useSelectContext();
  const { applyListRef, moveOption, closeSelectList } = useCreateAction();

  useEventListener(listRef?.current, 'keydown', (e) => {
    const stopDefault = () => {
      e.preventDefault();
      e.stopPropagation();
    };
    switch (e.key) {
      case 'Enter':
      case ' ':
        stopDefault();
        if (context.selectedOptionIndex !== null) {
          context.onChange?.(context.optionRefList[context.selectedOptionIndex].optionInfo.optionValue);
        }
        closeSelectList();
        context.triggerRef?.current?.focus();
        return;
      case 'ArrowDown':
        if (context.optionRefList && context.selectedOptionIndex === context.optionRefList.length - 1) return;
        moveOption(MoveDirection.NEXT);
        return;
      case 'ArrowUp':
        if (context.selectedOptionIndex === 0) return;
        moveOption(MoveDirection.PREV);
        return;
      case 'Escape':
        closeSelectList();
        context.triggerRef?.current?.focus();
        return;
      case 'Tab':
        stopDefault();
        return;
    }
  });

  useEffect(() => {
    if (listRef?.current) applyListRef(listRef);
  }, [listRef]);

  return context.isOpen ? (
    <S.List
      ref={setListRef}
      id="select-box"
      data-testid={TestIds.List}
      tabIndex={0}
      role="listbox"
      aria-labelledby="select-button"
      aria-activedescendant={
        context.selectedOptionIndex !== null ? context.optionRefList[context.selectedOptionIndex]?.id : undefined
      }
    >
      {children}
    </S.List>
  ) : null;
}

/**
 * ==============================
 * Option
 * ==============================
 */

interface OptionProps {
  value: unknown;
  disabled?: boolean;
  optionIndex: number;
}

function Option({ optionIndex, value: optionValue, children, disabled }: PropsWithChildren<OptionProps>) {
  const optionId = useId();
  const [optionRef, setOptionRef] = useCallbackRef<HTMLLIElement>();

  const context = useSelectContext();
  const { closeSelectList, selectOption, applyOptionRef, unapplyOptionRef } = useCreateAction();

  const handleOptionClick = () => {
    selectOption(optionIndex);
    closeSelectList();
    context.onChange?.(optionValue);
  };

  const handleMouseOver = () => {
    selectOption(optionIndex);
  };

  useEffect(() => {
    if (context.value === optionValue) {
      selectOption(optionIndex);
    }
  }, [context.value, optionValue, optionIndex]);

  useEffect(() => {
    if (context.selectedOptionIndex === optionIndex) {
      optionRef?.current.focus();
    }
  }, [context.selectedOptionIndex, optionIndex, optionRef]);

  useEffect(() => {
    if (optionRef?.current)
      applyOptionRef({
        id: optionId,
        optionInfo: {
          domRef: optionRef,
          optionValue,
          disabled,
          originText: optionRef.current.innerText,
        },
      });
  }, [optionId, optionRef, optionValue, disabled]);

  useEffect(() => {
    return () => {
      unapplyOptionRef(optionId);
    };
  }, []);

  return (
    <S.Option
      ref={setOptionRef}
      id={optionId}
      onClick={handleOptionClick}
      onMouseOver={handleMouseOver}
      tabIndex={0}
      role="option"
      aria-selected={context.selectedOptionIndex === optionIndex}
    >
      {children}
    </S.Option>
  );
}

export default Object.assign(Select, { Trigger, List, Option });
