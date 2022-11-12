import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '..';
import { checkSelectList, getSpecificOption, getTriggerButton, queryAllOption, querySelectList } from './util';

describe('<Select />', () => {
  const optionData = [
    { name: '옵션1', id: 1 },
    { name: '옵션2', id: 2 },
    { name: '옵션3', id: 3 },
  ];
  const selectInterface = (
    <Select defaultValue={optionData[0]}>
      <Select.Trigger>{({ value }) => value.name}</Select.Trigger>
      <Select.List>
        {optionData.map((option, index) => (
          <Select.Option key={option.id} optionIndex={index} value={option}>
            {option.name}
          </Select.Option>
        ))}
      </Select.List>
    </Select>
  );

  describe('첫 렌더링 시', () => {
    it('props로 제공된 defaultValue와 Trigger의 텍스트와 일치해야 한다.', () => {
      render(selectInterface);

      expect(getTriggerButton()).toHaveTextContent(optionData[0].name);
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
              <Select.Option key={option.id} optionIndex={index} value={option}>
                {option.name}
              </Select.Option>
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
    it('Trigger에 as Props로 전달된 컴포넌트가 기본 버튼 대신에 렌더링 되어야 한다.', () => {
      render(
        <Select>
          <Select.Trigger as={<button>instead rendering!</button>} />
          <Select.List>
            {optionData.map((option, index) => (
              <Select.Option key={option.id} optionIndex={index} value={option}>
                {option.name}
              </Select.Option>
            ))}
          </Select.List>
        </Select>,
      );

      expect(getTriggerButton()).toHaveTextContent('instead rendering!');
    });

    it('Trigger에 as Props로 전달된 컴포넌트의 이벤트 리스너가 기존 Trigger의 리스너와 함께 동작해야 한다.', async () => {
      const onClick = jest.fn();

      render(
        <Select>
          <Select.Trigger as={<button onClick={onClick}>instead rendering!</button>} />
          <Select.List>
            {optionData.map((option, index) => (
              <Select.Option key={option.id} optionIndex={index} value={option}>
                {option.name}
              </Select.Option>
            ))}
          </Select.List>
        </Select>,
      );

      await userEvent.click(getTriggerButton());
      expect(onClick).toHaveBeenCalled();
      checkSelectList({
        shouldExist: true,
      });
    });

    it('Option의 render props를 통해 custom Option을 렌더링할 수 있어야 한다.', async () => {
      const onFocus = jest.fn((isFocused: boolean) => (isFocused ? 'focus' : ''));
      const onSelect = jest.fn((isSelected: boolean) => (isSelected ? 'select' : ''));

      render(
        <Select>
          <Select.Trigger>선택해주세요.</Select.Trigger>
          <Select.List>
            {optionData.map((option, index) => (
              <Select.Option key={option.id} optionIndex={index} value={option}>
                {({ isFocused, isSelected }) => (
                  <li role="option">
                    {onFocus(isFocused)}
                    {onSelect(isSelected)}
                    {option.name}
                  </li>
                )}
              </Select.Option>
            ))}
          </Select.List>
        </Select>,
      );

      await userEvent.click(getTriggerButton());
      await userEvent.hover(getSpecificOption({ optionIndex: 1 }));
      expect(getSpecificOption({ optionIndex: 1 })).toHaveTextContent('focus');
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
              <Select.Option key={option.id} optionIndex={index} value={option}>
                {option.name}
              </Select.Option>
            ))}
          </Select.List>
        </Select>,
      );
      await userEvent.click(getTriggerButton());

      const options = queryAllOption();
      await userEvent.click(options[2]);

      expect(onChange).toHaveBeenCalledWith(optionData[2]);
    });

    /**
     * @TODO value 제네릭 타입 공유 이후 다시 처리하기.
     */

    // it('value가 undefined로 주어져도 해당 옵션으로 Trigger의 텍스트가 대치되어야 한다.', async () => {
    //   render(
    //     <Select value={undefined}>
    //       <Select.Trigger>{({ value }) => value.name}</Select.Trigger>
    //       <Select.List>
    //         {optionData.map((option, index) => (
    //           <Select.Option key={option.id} optionIndex={index} value={option}>
    //             {option.name}
    //           </Select.Option>
    //         ))}
    //       </Select.List>
    //     </Select>,
    //   );
    //   await userEvent.click(getTriggerButton());
    //   await userEvent.click(
    //     getSpecificOption({
    //       optionIndex: 1,
    //     }),
    //   );
    //   expect(getTriggerButton()).toHaveTextContent(optionData[1].name);
    // });
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
              <Select.Option key={option.id} optionIndex={index} value={option}>
                {option.name}
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
              <Select.Option key={option.id} optionIndex={index} value={option}>
                {option.name}
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
              <Select.Option key={option.id} optionIndex={index} value={option}>
                {option.name}
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

      expect(getTriggerButton()).toHaveTextContent(optionData[1].name);
    });

    it('Enter로 Option 선택이 가능해야 한다.', async () => {
      render(selectInterface);
      await userEvent.click(getTriggerButton());

      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      expect(getTriggerButton()).toHaveTextContent(optionData[1].name);
    });
  });

  describe('value가 object 타입일 때', () => {
    it('Option을 선택했을 때 onChange 함수가 object와 함께 실행되어야 한다.', async () => {
      const onChange = jest.fn((value) => value);
      render(
        <Select value={optionData[0]} onChange={onChange}>
          <Select.Trigger>Select Option!</Select.Trigger>
          <Select.List>
            {optionData.map((option, index) => (
              <Select.Option key={option.id} optionIndex={index} value={option}>
                {option.name}
              </Select.Option>
            ))}
          </Select.List>
        </Select>,
      );
      await userEvent.click(getTriggerButton());

      const options = queryAllOption();
      await userEvent.click(options[2]);

      expect(onChange).toHaveBeenCalledWith(optionData[2]);
    });
  });
});
