import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '..';
import { checkSelectList, getSpecificOption, getTriggerButton, queryAllOption, querySelectList } from './util';

describe('<Select />', () => {
  const optionData = ['옵션1', '옵션2', '옵션3'];
  const selectInterface = (
    <Select value={optionData[0]} onChange={console.log}>
      <Select.Trigger>Select Option!</Select.Trigger>
      <Select.List>
        {optionData.map((option, index) => (
          <Select.Option key={option} optionIndex={index} value={option} />
        ))}
      </Select.List>
    </Select>
  );

  describe('첫 렌더링 시', () => {
    it('props로 제공된 value와 Trigger의 텍스트와 일치해야 한다.', () => {
      render(selectInterface);

      expect(getTriggerButton()).toHaveTextContent(optionData[0]);
    });

    it('List는 닫혀있어야 한다.', () => {
      render(selectInterface);

      checkSelectList({
        shouldExist: false,
      });
    });

    it('value가 제공되지 않았을 때 Trigger는 기본 텍스트를 보여줘야 한다.', () => {
      render(
        <Select value={undefined} onChange={console.log}>
          <Select.Trigger>Select Option!</Select.Trigger>
          <Select.List>
            {optionData.map((option, index) => (
              <Select.Option key={option} optionIndex={index} value={option} />
            ))}
          </Select.List>
        </Select>,
      );

      expect(getTriggerButton()).toHaveTextContent('Select Option!');
    });
  });

  describe('List의 열림닫힘 여부', () => {
    it('Trigger 버튼을 누르면 List가 열려야 한다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());

      expect(querySelectList()).toBeInTheDocument();
    });

    it('List가 열린 상태에서 Trigger, List 바깥의 요소를 클릭하면 List가 닫혀야 한다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());

      await userEvent.click(document.body);

      checkSelectList({
        shouldExist: false,
      });
    });

    it('List가 닫힌 상태에서 Trigger, List 바깥의 요소를 클릭하면 아무 동작도 하지 않아야 한다.', async () => {
      render(selectInterface);

      await userEvent.click(document.body);

      checkSelectList({
        shouldExist: false,
      });
    });

    it('옵션을 선택하면 List가 닫혀야 한다.', async () => {
      render(selectInterface);

      await userEvent.click(getTriggerButton());

      const selectList = querySelectList();
      expect(selectList).not.toBe(null);

      const options = queryAllOption();
      await userEvent.click(options[0]);

      checkSelectList({
        shouldExist: false,
      });
    });
  });

  describe('옵션 선택 시', () => {
    it('onChange 함수가 실행되어야 한다.', async () => {
      const onChange = jest.fn((value) => value);
      render(
        <Select value={optionData[0]} onChange={onChange}>
          <Select.Trigger>Select Option!</Select.Trigger>
          <Select.List>
            {optionData.map((option, index) => (
              <Select.Option key={option} optionIndex={index} value={option} />
            ))}
          </Select.List>
        </Select>,
      );
      await userEvent.click(getTriggerButton());

      const options = queryAllOption();
      await userEvent.click(options[2]);

      expect(onChange).toHaveBeenCalledWith(optionData[2]);
    });

    it('value가 undefined로 주어져도 해당 옵션으로 Trigger의 텍스트가 대치되어야 한다.', async () => {
      render(
        <Select value={undefined}>
          <Select.Trigger>Select Option!</Select.Trigger>
          <Select.List>
            {optionData.map((option, index) => (
              <Select.Option key={option} optionIndex={index} value={option} />
            ))}
          </Select.List>
        </Select>,
      );
      await userEvent.click(getTriggerButton());
      await userEvent.click(
        getSpecificOption({
          optionIndex: 1,
        }),
      );

      expect(getTriggerButton()).toHaveTextContent(optionData[1]);
    });
  });

  describe('기타 인터랙션', () => {
    it('옵션에 마우스를 올렸을 때 focus 상태가 된다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());

      await userEvent.hover(
        getSpecificOption({
          optionIndex: 1,
        }),
      );

      const targetOption = getSpecificOption({
        optionIndex: 1,
      });

      expect(targetOption).toHaveFocus();
    });
  });
});
