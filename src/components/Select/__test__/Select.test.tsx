import { fireEvent, render, screen } from '@testing-library/react';
import Select from '../index';

describe('Test Select Component', () => {
  const optionData = ['option1', 'option2', 'option3'];

  const selectInterface = (
    <Select selectedOption={optionData[0]}>
      <Select.Trigger>Select Option!</Select.Trigger>
      <Select.List>
        {optionData.map((option) => (
          <Select.Option key={option} value={option} />
        ))}
      </Select.List>
    </Select>
  );

  it('OptionList toggle when click Trigger Component', () => {
    render(selectInterface);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    const options = screen.getAllByRole('option');
    options.forEach((option, index) => {
      expect(option).toHaveTextContent(optionData[index]);
    });

    fireEvent.click(triggerButton);

    const hiddenOptions = screen.queryAllByRole('option');
    expect(hiddenOptions.length).toBe(0);
  });
});
