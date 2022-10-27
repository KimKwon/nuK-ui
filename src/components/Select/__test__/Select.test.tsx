import { renderHook } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { SelectControllProvider } from '../context';
import useSelectContext from '../context/use-select-context';

describe('Test Select Component', () => {
  // const optionData = ['옵션1', '옵션2', '옵션3'];
  // const selectInterface = (
  //   <Select.OriginSelect selectedOption={optionData[0]}>
  //     <Select.Trigger>Select Option!</Select.Trigger>
  //     <Select.List>
  //       {optionData.map((option) => (
  //         <Select.Option key={option} value={option} />
  //       ))}
  //     </Select.List>
  //   </Select.OriginSelect>
  // );

  describe('useSelectContext', () => {
    const defaultContext = {
      isOpen: false,
      optionList: ['option1', 'option2', 'option3', 'option4'],
      selectedOption: 'option1',
      onChange: (_option: string) => undefined,
      listRef: null,
      triggerRef: null,
    };

    const wrapper = ({ children }: PropsWithChildren) => <SelectControllProvider defaultContext={defaultContext}>{children}</SelectControllProvider>;
    const renderHookWithSelectContext = () =>
      renderHook(() => useSelectContext(), {
        wrapper,
      });

    it('OpenSelect function change value of isOpen to true.', () => {
      const { result, rerender } = renderHookWithSelectContext();

      result.current.openSelect();
      rerender();

      expect(result.current.isOpen).toBe(true);
    });

    it('SelectOption function change value of selectedOption to that value.', () => {
      const { result, rerender } = renderHookWithSelectContext();

      result.current.selectOption('option2');
      rerender();

      expect(result.current.selectedOption).toBe('option2');
    });
  });
});
