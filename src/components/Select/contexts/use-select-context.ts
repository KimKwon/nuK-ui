import { useContext } from 'react';
import { SelectContext } from './context';

function useSelectContext() {
  const context = useContext(SelectContext.state);

  if (context === null) {
    throw new Error('There is no Select Provider initialized properly.');
  }

  return context;
}

export default useSelectContext;
