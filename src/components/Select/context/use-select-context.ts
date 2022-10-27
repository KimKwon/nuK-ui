import { useContext } from 'react';
import { selectContext } from './index';

function useSelectContext() {
  const selectInfo = useContext(selectContext.state);
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

  return { selectInfo, openSelect: changeSelectOpenStatus(true), closeSelect: changeSelectOpenStatus(false), toggleSelectOpenStatus, selectOption };
}

export default useSelectContext;
