import { useState } from 'react';
import Select from './components/Select';

function App() {
  const options = ['김치찜', '신전떡볶이', '역전우동', '라면', '김밥', '낚지비빔밥'];

  return (
    <main>
      <Select selectedOption={options[0]}>
        <Select.Trigger>옵션을 선택해주세요.</Select.Trigger>
        <Select.List>
          {options.map((option, index) => (
            <Select.Option key={index} value={option} />
          ))}
        </Select.List>
      </Select>
    </main>
  );
}

export default App;
