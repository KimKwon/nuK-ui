import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '..';
import { checkSelectList, getSpecificOption, getTriggerButton, queryAllOption, querySelectList } from './util';

describe('<Select />', () => {
  const optionData = ['옵션1', '옵션2', '옵션3'];
  const selectInterface = (
    <Select defaultValue={optionData[0]}>
      <Select.Trigger>Select Option!</Select.Trigger>
      <Select.List>
        {optionData.map((option, index) => (
          <Select.Option key={option} optionIndex={index} value={option}>
            {option}
          </Select.Option>
        ))}
      </Select.List>
    </Select>
  );

  describe('첫 렌더링 시', () => {
    it('props로 제공된 defaultValue와 Trigger의 텍스트와 일치해야 한다.', () => {
      render(selectInterface);

      expect(getTriggerButton()).toHaveTextContent(optionData[0]);
    });

    it('List는 닫혀있어야 한다.', () => {
      render(selectInterface);

      checkSelectList({
        shouldExist: false,
      });
    });

    it('defaultValue가 제공되지 않았을 때 Trigger는 기본 텍스트를 보여줘야 한다.', () => {
      render(
        <Select>
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

    it('Option을 선택하면 List가 닫혀야 한다.', async () => {
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

    it('Trigger에 focus 되었을 때 방향키로 List를 열 수 있어야 한다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());
      await userEvent.click(getTriggerButton());

      await userEvent.keyboard('{ArrowDown}');
      checkSelectList({
        shouldExist: true,
      });
    });
  });

  describe('Option 선택 시', () => {
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

  describe('Focus 관련', () => {
    it('옵션에 마우스를 올렸을 때 focus 상태가 되어야 한다.', async () => {
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

    it('List가 열렸을 때 default로 선택된 Option에 focus 상태가 되어야 한다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());

      expect(
        getSpecificOption({
          optionIndex: 0,
        }),
      ).toHaveFocus();
    });

    it('List가 열렸을 때 현재 선택된 Option에 focus 상태가 되어야 한다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());

      await userEvent.click(
        getSpecificOption({
          optionIndex: 2,
        }),
      );

      await userEvent.click(getTriggerButton());

      expect(
        getSpecificOption({
          optionIndex: 2,
        }),
      ).toHaveFocus();
    });

    it('현재 선택된 Option이 없을 때 Trigger 클릭으로 List가 열렸을 경우 첫번째 Option에 focus 되어야 한다.', async () => {
      render(
        <Select>
          <Select.Trigger>Select Option!</Select.Trigger>
          <Select.List>
            {optionData.map((option, index) => (
              <Select.Option key={option} optionIndex={index} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select.List>
        </Select>,
      );

      await userEvent.click(getTriggerButton());
      await waitFor(() => {
        expect(getSpecificOption({ optionIndex: 0 })).toHaveFocus();
      });
    });
  });

  describe('키보드 인터랙션', () => {
    it('키보드 아래 키를 통해 하단의 Option으로 focus 이동이 가능해야 한다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());

      await userEvent.keyboard('{ArrowDown}');
      expect(getSpecificOption({ optionIndex: 1 })).toHaveFocus();
    });

    it('키보드 위 키를 통해 상단의 Option으로 focus 이동이 가능해야 한다.', async () => {
      render(
        <Select defaultValue={optionData[1]}>
          <Select.Trigger>Select Option!</Select.Trigger>
          <Select.List>
            {optionData.map((option, index) => (
              <Select.Option key={option} optionIndex={index} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select.List>
        </Select>,
      );
      await userEvent.click(getTriggerButton());

      await userEvent.keyboard('{ArrowUp}');
      expect(getSpecificOption({ optionIndex: 0 })).toHaveFocus();
    });

    it('첫번째 Option이 선택 되어 있을 경우 키보드 위 키를 눌러도 아무 반응이 없어야 한다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());

      await userEvent.keyboard('{ArrowUp}');
      expect(getSpecificOption({ optionIndex: 0 })).toHaveFocus();
    });

    it('마지막 Option이 선택 되어 있을 경우 키보드 아래 키를 눌러도 아무 반응이 없어야 한다.', async () => {
      render(
        <Select defaultValue={optionData[2]}>
          <Select.Trigger>Select Option!</Select.Trigger>
          <Select.List>
            {optionData.map((option, index) => (
              <Select.Option key={option} optionIndex={index} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select.List>
        </Select>,
      );
      await userEvent.click(getTriggerButton());

      await userEvent.keyboard('{ArrowDown}');
      expect(getSpecificOption({ optionIndex: 2 })).toHaveFocus();
    });

    it('Space로 Option 선택이 가능해야 한다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());

      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ }');

      expect(getTriggerButton()).toHaveTextContent(optionData[1]);
    });

    it('Enter로 Option 선택이 가능해야 한다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());

      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      expect(getTriggerButton()).toHaveTextContent(optionData[1]);
    });
  });
});
