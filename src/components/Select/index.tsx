import { Fragment, KeyboardEvent, PropsWithChildren, ReactNode, useEffect, useId, useReducer, useRef } from 'react';
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
import renderWithProps from '../../utils/render-with-props';
import CheckIcon from '../../assets/CheckIcon';

/**
 * ==============================
 * Style Object
 * ==============================
 */

const S = {
  Select: styled.div`
    & > * {
      box-sizing: border-box;
      font-size: 1rem;
    }
    position: relative;
    width: 200px;

    & li[data-isfocused='true'] {
      background-color: #b9f3f1;
    }
  `,
  Trigger: styled.button`
    width: 100%;
    background-color: transparent;

    padding: 5px;

    border-radius: 8px;
    border: 2px solid #2ab1ac;
    &:focus {
      background-color: #c9f7f6;
      outline: 3px solid #85d1e2;
    }
  `,
  List: styled.ul`
    padding: 0;
    margin: 0.25rem 0 0 0;
    width: 100%;

    overflow: hidden;

    position: absolute;
    z-index: 9999;

    display: flex;
    flex-direction: column;

    background-color: white;
    border: 3px solid #2ab1ac;
    border-radius: 8px;
  `,
  Option: styled.li<{ selected: boolean }>`
    all: unset;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    padding: 5px;
    padding-left: 30px;

    & > span {
      padding-left: 10px;
    }

    ${({ selected }) =>
      selected &&
      css`
        padding-left: 10px;
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
    focusedOptionIndex: null,
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

      triggerRef?.current?.focus();
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

interface TriggerProps {
  as?: JSX.Element;
}

function Trigger({ children, as }: PropsWithChildren<TriggerProps>) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { toggleSelectOpenStatus, applyTriggerRef, openSelectList, moveOption } = useCreateAction();
  const { value, isOpen, focusedOptionIndex } = useSelectContext();

  const handleClick = () => {
    toggleSelectOpenStatus();
    if (value === undefined && focusedOptionIndex === null && !isOpen) {
      requestAnimationFrame(() => {
        moveOption(MoveDirection.FIRST);
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const stopDefault = () => {
      e.stopPropagation();
      e.preventDefault();
    };
    switch (e.key) {
      case 'ArrowDown':
        stopDefault();
        openSelectList();
        if (value === undefined) {
          requestAnimationFrame(() => {
            moveOption(MoveDirection.FIRST);
          });
        }
        return;
      case 'ArrowUp':
        stopDefault();
        openSelectList();
        if (value === undefined) {
          requestAnimationFrame(() => {
            moveOption(MoveDirection.LAST);
          });
        }
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    if (triggerRef.current) applyTriggerRef(triggerRef);
  }, []);

  const triggerProps = {
    ref: triggerRef,
    'data-testid': TestIds.Trigger,
    type: 'button',
    onKeyDown: handleKeyDown,
    onClick: handleClick,
    'aria-haspopup': true,
    'aria-expanded': true,
    'aria-controls': 'select-button',
    children: value !== undefined ? <>{value}</> : children,
  } as const;

  return as ? (
    renderWithProps({ ...triggerProps, children: value !== undefined ? <>{value}</> : as?.props.children }, as)
  ) : (
    <S.Trigger {...triggerProps} />
  );
}

/**
 * ==============================
 * List
 * ==============================
 */

function List({ children }: PropsWithChildren) {
  const [listRef, setListRef] = useCallbackRef<HTMLUListElement>();

  const { isOpen, focusedOptionIndex, onChange, optionRefList, triggerRef, value } = useSelectContext();
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
        if (focusedOptionIndex !== null) {
          onChange?.(optionRefList[focusedOptionIndex].optionInfo.optionValue);
        }
        closeSelectList();
        triggerRef?.current?.focus();
        return;
      case 'ArrowDown':
        if (optionRefList && focusedOptionIndex === optionRefList.length - 1) return;
        moveOption(MoveDirection.NEXT);
        return;
      case 'ArrowUp':
        if (focusedOptionIndex === 0) return;
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
    if (isOpen && focusedOptionIndex === null && optionRefList.length > 0) {
      const currentSelectedIndex = optionRefList.findIndex(({ optionInfo: { optionValue } }) => optionValue === value);
      if (currentSelectedIndex < 0) {
        return;
      }

      moveOption(MoveDirection.TARGET, currentSelectedIndex);
    }
  }, [isOpen, focusedOptionIndex, optionRefList, value]);

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
      aria-activedescendant={focusedOptionIndex !== null ? optionRefList[focusedOptionIndex]?.id : undefined}
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

type OptionRenderPropsChildren = {
  ({ isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }): JSX.Element;
};

interface OptionProps {
  value: unknown;
  disabled?: boolean;
  optionIndex: number;
  children: OptionRenderPropsChildren | ReactNode;
}

function Option({ optionIndex, value: optionValue, children, disabled }: OptionProps) {
  const optionId = useId();
  const [optionRef, setOptionRef] = useCallbackRef<HTMLLIElement>();

  const { value, triggerRef, onChange, focusedOptionIndex } = useSelectContext();
  const { closeSelectList, moveOption, applyOptionRef, unapplyOptionRef } = useCreateAction();

  const handleOptionClick = () => {
    moveOption(MoveDirection.TARGET, optionIndex);

    closeSelectList();
    onChange?.(optionValue);
    triggerRef?.current?.focus();
  };

  const handleMouseEnter = () => {
    moveOption(MoveDirection.TARGET, optionIndex);
  };

  const handleMouseLeave = () => {
    moveOption(MoveDirection.OUT);
  };

  useEffect(() => {
    if (focusedOptionIndex === optionIndex) {
      optionRef?.current.focus();
    }
  }, [focusedOptionIndex, optionIndex, optionRef]);

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

  const isSelected = value === optionValue;
  const isUsingRenderProps = (children: OptionProps['children']): children is OptionRenderPropsChildren =>
    typeof children === 'function';

  const resolveChildren = () => {
    if (!isUsingRenderProps(children)) return { children };

    return {
      children: children({ isSelected, isFocused: focusedOptionIndex === optionIndex }),
    };
  };

  const optionProps = {
    ref: setOptionRef,
    id: optionId,
    onClick: handleOptionClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    tabIndex: 0,
    role: 'option',
    'aria-selected': isSelected,
    selected: isSelected,
    'data-isFocused': focusedOptionIndex === optionIndex,
    ...resolveChildren(),
  };

  const { children: resolvedChildren, ...optionPropsWithoutChildren } = optionProps;

  return isUsingRenderProps(children) ? (
    renderWithProps(optionPropsWithoutChildren, resolvedChildren)
  ) : (
    <S.Option {...optionProps}>
      {isSelected && <CheckIcon width={20} height={20} />}
      <span>{children}</span>
    </S.Option>
  );
}

export default Object.assign(Select, { Trigger, List, Option });
