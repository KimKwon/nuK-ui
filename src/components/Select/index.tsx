import { FunctionComponent, PropsWithChildren, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SelectControllProvider } from './context';
import useSelectContext from './context/use-select-context';

interface SelectProps {
  selectedOption: string;
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
  Select: styled.div``,
  Trigger: styled.button``,
  List: styled.ul`
    padding: 0;
  `,
  Option: styled.li`
    all: unset;
    display: flex;
    flex-direction: column;
    &:focus {
      background-color: aqua;
    }
  `,
};

function Select({ children, selectedOption, className, onChange: _onChange }: PropsWithChildren<SelectProps>) {
  const { toggleSelectOpenStatus, selectOption } = useSelectContext();

  useEffect(() => {
    toggleSelectOpenStatus();
    selectOption(selectedOption);
  }, []);

  return <S.Select className={className}>{children}</S.Select>;
}

function Trigger({ children }: PropsWithChildren) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    selectInfo: { selectedOption },
    toggleSelectOpenStatus,
  } = useSelectContext();

  return (
    <S.Trigger ref={buttonRef} type="button" onClick={toggleSelectOpenStatus} aria-haspopup aria-expanded aria-controls="select-button">
      {selectedOption || children}
    </S.Trigger>
  );
}

function List({ children }: PropsWithChildren) {
  const {
    selectInfo: { isOpen },
  } = useSelectContext();

  return (
    <>
      {isOpen && (
        <S.List role="listbox" id="select-box" aria-labelledby="select-button">
          {children}
        </S.List>
      )}
    </>
  );
}

function Option({ value }: PropsWithChildren<OptionProps>) {
  const optionRef = useRef<HTMLLIElement>(null);
  const {
    closeSelect,
    selectOption,
    selectInfo: { selectedOption },
  } = useSelectContext();

  const handleOptionClick = () => {
    selectOption(value);
    closeSelect();
  };

  useEffect(() => {
    if (!optionRef.current) return;

    if (selectedOption === value) {
      optionRef.current.focus();
    }
  }, []);

  return (
    <S.Option ref={optionRef} onClick={handleOptionClick} role="option">
      {value}
    </S.Option>
  );
}

export default Object.assign(withSelectProvider(Select), { OriginSelect: Select, Trigger, List, Option });
