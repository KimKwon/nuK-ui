import { FunctionComponent, PropsWithChildren, useContext, useEffect, useRef } from 'react';
import { selectContext, SelectControllProvider } from './context';

interface SelectProps {
  selectedOption: string;
  onChange?: (option: string) => void;
}

interface OptionProps {
  value: string;
}

function withSelectProvider(Component: FunctionComponent<PropsWithChildren<SelectProps>>) {
  function ProvidedComponent(props: PropsWithChildren<SelectProps>) {
    return (
      <SelectControllProvider>
        <Component {...props} />
      </SelectControllProvider>
    );
  }

  ProvidedComponent.Trigger = Trigger;
  ProvidedComponent.List = List;
  ProvidedComponent.Option = Option;

  return ProvidedComponent;
}

function Select({ children, selectedOption, onChange }: PropsWithChildren<SelectProps>) {
  const dispatch = useContext(selectContext.dispatch);

  useEffect(() => {
    dispatch({
      type: 'selectedOption/select_option',
      payload: {
        option: selectedOption,
      },
    });
  }, []);

  return <>{children}</>;
}

function Trigger({ children }: PropsWithChildren) {
  const { selectedOption } = useContext(selectContext.state);
  const dispatch = useContext(selectContext.dispatch);

  const handleClick = () => {
    dispatch({
      type: 'isOpen/toggle_open',
    });
  };

  return (
    <button type="button" onClick={handleClick} aria-haspopup aria-expanded aria-controls="select-button">
      {selectedOption || children}
    </button>
  );
}

function List({ children }: PropsWithChildren) {
  const { isOpen } = useContext(selectContext.state);

  return (
    <>
      {isOpen && (
        <ul role="listbox" id="select-box" aria-labelledby="select-button">
          {children}
        </ul>
      )}
    </>
  );
}

function Option({ value }: PropsWithChildren<OptionProps>) {
  const optionRef = useRef<HTMLLIElement>(null);
  const { selectedOption } = useContext(selectContext.state);
  const dispatch = useContext(selectContext.dispatch);

  const handleOptionClick = () => {
    dispatch({
      type: 'selectedOption/select_option',
      payload: {
        option: value,
      },
    });

    dispatch({
      type: 'isOpen/set_open',
      payload: {
        isOpen: false,
      },
    });
  };

  useEffect(() => {
    if (!optionRef.current) return;

    if (selectedOption === value) {
      optionRef.current.focus();
    }
  }, []);

  return (
    <li ref={optionRef} onClick={handleOptionClick} role="option">
      {value}
    </li>
  );
}

export default withSelectProvider(Select);
