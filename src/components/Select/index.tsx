import { PropsWithChildren, useEffect, useId, useReducer, useRef } from 'react';
import styled from 'styled-components';
import useClickOutside from '../../hooks/use-click-outside';
import useEventListener from '../../hooks/use-event-listener';
import { reducer } from './contexts/reducer';
import useSelectContext from './contexts/use-select-context';
import useCallbackRef from '../../hooks/use-callback-ref';
import { SelectContext } from './contexts/context';
import useCreateAction from './contexts/use-create-action';
import { Actions } from './contexts/type';
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
  Trigger: styled.button``,
  List: styled.ul`
    padding: 0;
    margin: 0;

    position: absolute;
    z-index: 9999;

    margin-top: 0.25rem;

    display: flex;
    flex-direction: column;
    gap: 10px;

    background-color: white;
    border: 1px solid black;
    box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3);
  `,
  Option: styled.li`
    all: unset;

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
      {context?.value ? <>{context?.value}</> : children}
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
  const { applyListRef } = useCreateAction();

  useEventListener(listRef?.current, 'keydown', (e) => {
    switch (e.key) {
      case 'ArrowDown':
        return;
      case 'ArrowUp':
        return;
      case 'Tab':
        e.preventDefault();
        return;
    }
  });

  useEffect(() => {
    if (listRef?.current) applyListRef(listRef);
  }, [listRef]);

  return context?.isOpen ? (
    <S.List
      data-testid={TestIds.List}
      tabIndex={0}
      ref={setListRef}
      role="listbox"
      id="select-box"
      aria-labelledby="select-button"
      aria-activedescendant={
        context?.selectedOptionIndex !== null ? context?.optionRefList?.[context.selectedOptionIndex]?.id : undefined
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
  const { changeSelectOpenStatus, selectOption, applyOptionRef, unapplyOptionRef } = useCreateAction();

  const handleOptionClick = () => {
    selectOption(optionIndex);
    changeSelectOpenStatus(false)();
    context?.onChange?.(optionValue);
  };

  const handleMouseOver = () => {
    optionRef?.current?.focus();
  };

  useEffect(() => {
    if (context?.value === optionValue) {
      selectOption(optionIndex);
    }
  }, [context?.value, optionValue, optionIndex]);

  useEffect(() => {
    if (context?.selectedOptionIndex === optionIndex) {
      optionRef?.current.focus();
    }
  }, [context?.selectedOptionIndex, optionIndex, optionRef]);

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
      id={optionId}
      aria-selected={context?.selectedOptionIndex === optionIndex}
      ref={setOptionRef}
      onMouseOver={handleMouseOver}
      tabIndex={0}
      onClick={handleOptionClick}
      role="option"
    >
      {children}
    </S.Option>
  );
}

export default Object.assign(Select, { Trigger, List, Option });
