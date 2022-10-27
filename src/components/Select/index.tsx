import { FunctionComponent, PropsWithChildren, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useClickOutside from '../../hooks/use-click-outside';
import { SelectControllProvider } from './context';
import useSelectContext from './context/use-select-context';

interface SelectProps {
  selectedOption?: string;
  onChange?: (option: string) => void;
  className?: string;
}

interface OptionProps {
  value: string;
}

function withSelectProvider(Component: FunctionComponent<PropsWithChildren<SelectProps>>) {
  return function Provided(props: PropsWithChildren<SelectProps>) {
    return (
      <SelectControllProvider>
        <Component {...props} />
      </SelectControllProvider>
    );
  };
}

const S = {
  Select: styled.div`
    position: relative;
  `,
  Trigger: styled.button``,
  List: styled.ul`
    position: absolute;
    top: 1em;
    padding: 0;

    display: flex;
    flex-direction: column;
  `,
  Option: styled.li<{ isActive: boolean }>`
    all: unset;

    width: fit-content;
    background-color: ${({ isActive }) => isActive && 'aqua'};
  `,
};

function Select({ children, selectedOption, className, onChange: _onChange }: PropsWithChildren<SelectProps>) {
  const { selectOption, listRef, triggerRef, closeSelect } = useSelectContext();

  useClickOutside([listRef!, triggerRef!], closeSelect);

  useEffect(() => {
    if (selectedOption) selectOption(selectedOption);
  }, [selectedOption]);

  return <S.Select className={className}>{children}</S.Select>;
}

function Trigger({ children }: PropsWithChildren) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { selectedOption, toggleSelectOpenStatus, applyTriggerRef } = useSelectContext();

  useEffect(() => {
    if (triggerRef.current) applyTriggerRef(triggerRef);
  }, []);

  return (
    <S.Trigger ref={triggerRef} type="button" onClick={toggleSelectOpenStatus} aria-haspopup aria-expanded aria-controls="select-button">
      {selectedOption || children}
    </S.Trigger>
  );
}

function List({ children }: PropsWithChildren) {
  const listRef = useRef<HTMLUListElement>(null);

  const { isOpen, applyListRef } = useSelectContext();

  useEffect(() => {
    if (listRef.current) applyListRef(listRef);
  }, []);

  return (
    <>
      {isOpen && (
        <S.List ref={listRef} role="listbox" id="select-box" aria-labelledby="select-button">
          {children}
        </S.List>
      )}
    </>
  );
}

function Option({ value }: PropsWithChildren<OptionProps>) {
  const optionRef = useRef<HTMLLIElement>(null);

  const { closeSelect, selectOption, selectedOption } = useSelectContext();

  const handleOptionClick = () => {
    selectOption(value);
    closeSelect();
  };

  return (
    <S.Option isActive={value === selectedOption} ref={optionRef} onClick={handleOptionClick} role="option">
      {value}
    </S.Option>
  );
}

export default Object.assign(withSelectProvider(Select), { OriginSelect: Select, Trigger, List, Option });
