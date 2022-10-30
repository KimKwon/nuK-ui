import { useState } from 'react';
import Select from './components/Select';

function App() {
  const options = ['김치찜', '신전떡볶이', '역전우동', '라면', '김밥', '낙지비빔밥'];
  const [value, setValue] = useState(options[0]);

  return (
    <main>
      <Select value={value} onChange={setValue}>
        <Select.Trigger>옵션을 선택해주세요.</Select.Trigger>
        <Select.List>
          {options.map((option, index) => (
            <Select.Option key={index} optionIndex={index} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select.List>
      </Select>
    </main>
  );
}

export default App;
