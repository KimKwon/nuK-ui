import { KeyboardEvent, PropsWithChildren, useEffect, useId, useReducer, useRef } from 'react';
import styled, { css } from 'styled-components';
import useClickOutside from '../../hooks/use-click-outside';
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
  Option: styled.li<{ selected: boolean }>`
    all: unset;

    padding: 5px;
    padding-left: 30px;
    &:focus {
      background-color: red;
    }

    &:hover {
      cursor: pointer;
    }

    ${({ selected }) =>
      selected &&
      css`
        padding-left: 0px;
        &::before {
          content: '✅';
        }
      `};
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
    selectedOptionIndex: null,
    onChange: onChange as any,
    listRef: null,
    triggerRef: null,
    optionRefList: [],
  });

  const { listRef, triggerRef, isOpen, selectedOptionIndex } = state;

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

      triggerRef?.current?.focus();
    },
    isOpen,
  );

  useEffect(() => {
    if (selectedOptionIndex !== null) return;

    dispatch({
      type: Actions.MOVE_OPTION,
      payload: {
        direction: MoveDirection.FIRST,
      },
    });
  }, [selectedOptionIndex]);

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

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
    }
  };

  useEffect(() => {
    if (triggerRef.current) applyTriggerRef(triggerRef);
  }, []);

  return (
    <S.Trigger
      ref={triggerRef}
      data-testid={TestIds.Trigger}
      type="button"
      onKeyDown={handleKeyDown}
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

  const { isOpen, selectedOptionIndex, onChange, optionRefList, triggerRef, value } = useSelectContext();
  const { applyListRef, moveOption, closeSelectList } = useCreateAction();

  const handleKeyDown = (e: KeyboardEvent) => {
    const stopDefault = () => {
      e.preventDefault();
      e.stopPropagation();
    };
    switch (e.key) {
      case 'Enter':
      case ' ':
        stopDefault();
        if (selectedOptionIndex !== null) {
          onChange?.(optionRefList[selectedOptionIndex].optionInfo.optionValue);
        }
        closeSelectList();
        triggerRef?.current?.focus();
        return;
      case 'ArrowDown':
        if (optionRefList && selectedOptionIndex === optionRefList.length - 1) return;
        moveOption(MoveDirection.NEXT);
        return;
      case 'ArrowUp':
        if (selectedOptionIndex === 0) return;
        moveOption(MoveDirection.PREV);
        return;
      case 'Escape':
        closeSelectList();
        triggerRef?.current?.focus();
        return;
      case 'Tab':
        stopDefault();
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    if (isOpen && selectedOptionIndex === null && optionRefList.length > 0) {
      const currentSelectedIndex = optionRefList.findIndex(({ optionInfo: { optionValue } }) => optionValue === value);
      if (currentSelectedIndex < 0) {
        moveOption(MoveDirection.FIRST);
        return;
      }
      moveOption(MoveDirection.TARGET, currentSelectedIndex);
    }
  }, [isOpen, selectedOptionIndex, optionRefList, value]);

  useEffect(() => {
    if (listRef?.current) applyListRef(listRef);
  }, [listRef]);

  return isOpen ? (
    <S.List
      ref={setListRef}
      id="select-box"
      onKeyDown={handleKeyDown}
      data-testid={TestIds.List}
      tabIndex={0}
      role="listbox"
      aria-labelledby="select-button"
      aria-activedescendant={selectedOptionIndex !== null ? optionRefList[selectedOptionIndex]?.id : undefined}
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

  const { value, triggerRef, onChange, selectedOptionIndex } = useSelectContext();
  const { closeSelectList, moveOption, applyOptionRef, unapplyOptionRef } = useCreateAction();

  const handleOptionClick = () => {
    moveOption(MoveDirection.TARGET, optionIndex);

    closeSelectList();
    onChange?.(optionValue);
    triggerRef?.current?.focus();
  };

  const handleMouseOver = () => {
    moveOption(MoveDirection.TARGET, optionIndex);
  };

  useEffect(() => {
    if (value === optionValue) {
      optionRef?.current.focus();
    }
  }, [value, optionValue, optionIndex, optionRef]);

  useEffect(() => {
    if (selectedOptionIndex === optionIndex) {
      optionRef?.current.focus();
    }
  }, [selectedOptionIndex, optionIndex, optionRef]);

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
      aria-selected={value === optionValue}
      selected={value === optionValue}
    >
      {children}
    </S.Option>
  );
}

export default Object.assign(Select, { Trigger, List, Option });
