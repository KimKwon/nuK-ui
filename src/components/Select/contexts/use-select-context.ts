import { useContext } from 'react';
import { SelectContext } from './context';

function useSelectContext() {
  const context = useContext(SelectContext.state);

  return context;
}

export default useSelectContext;
