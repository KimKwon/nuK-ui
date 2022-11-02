<div align="center">
    <h3>
        nuK UI
    </h3>
    <p>practice implement accessible-headless-ui.</p>
    <br />
    <p>:sparkles: trying to implement fully accessible UI. </p>
    <p>⭐️ considered about flexibility of components' change. </p>
</div>

---

## Todo

- [ ] value can handle object
- [ ] option can be disabled

*later*
- [ ] can select multiple options

---

## Index

* <a href="#selectbox">SelectBox</a>


---

## Components

See Demo 👉 [Click!](https://codesandbox.io/p/github/KimKwon/nuK-ui/draft/nifty-boyd?file=%2FREADME.md&selection=%5B%7B%22endColumn%22%3A36%2C%22endLineNumber%22%3A331%2C%22startColumn%22%3A36%2C%22startLineNumber%22%3A331%7D%5D&workspace=%257B%2522activeFileId%2522%253A%2522cl9zqmpg70001lribc94h4szg%2522%252C%2522openFiles%2522%253A%255B%2522%252FREADME.md%2522%255D%252C%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522gitSidebarPanel%2522%253A%2522COMMIT%2522%252C%2522sidekickItems%2522%253A%255B%257B%2522type%2522%253A%2522PREVIEW%2522%252C%2522taskId%2522%253A%2522dev%2522%252C%2522port%2522%253A5173%252C%2522key%2522%253A%2522cl9zqn1vz00bt3b6mbo2xvlsy%2522%252C%2522isMinimized%2522%253Afalse%257D%252C%257B%2522key%2522%253A%2522cl9zqmsue000k3b6md0udl2nk%2522%252C%2522type%2522%253A%2522PROJECT_SETUP%2522%252C%2522isMinimized%2522%253Atrue%257D%255D%257D)

### SelectBox

#### Basic Example

```javascript
import { useState } from 'react';
import Select from './components/Select';

function App() {
  const options = ['Purple', 'Black', 'Yellow', 'Red', 'Blue', 'Green'];
  const [value, setValue] = useState(options[0]);

  return (
      <Select value={value} onChange={setValue}>
        <Select.Trigger>Select Option!</Select.Trigger>
        <Select.List>
          {options.map((option, index) => (
            <Select.Option key={option} optionIndex={index} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select.List>
      </Select>
  );
}
```

#### Use custom Trigger by `as` props

```javascript
import { useState } from 'react';
import Select from './components/Select';

function App() {
  const options = ['Purple', 'Black', 'Yellow', 'Red', 'Blue', 'Green'];
  const [value, setValue] = useState(options[0]);
  
  const customButton = (
    <button
      type="button"
      onClick={() => {
        console.log('Custom Trigger Button.');
      }}
    >
      Try Open it.
    </button>
  );

  return (
      <Select value={value} onChange={setValue}>
        <Select.Trigger as={customButton} />
        <Select.List>
          {options.map((option, index) => (
            <Select.Option key={option} optionIndex={index} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select.List>
      </Select>
  );
}
```

#### Use custom option by using render props

you can provide `Select.Option` 's `children` with function that has (`isSelected, isFocused`) params. 

```javascript
import { useState } from 'react';
import Select from './components/Select';

function App() {
  const options = ['Purple', 'Black', 'Yellow', 'Red', 'Blue', 'Green'];
  const [value, setValue] = useState(options[0]);
  
  const customButton = (
    <button
      type="button"
      onClick={() => {
        console.log('Custom Trigger Button.');
      }}
    >
      Try Open it.
    </button>
  );

  return (
      <Select defaultValue={options[0]} value={value} onChange={setValue}>
        <Select.Trigger>Select Option!</Select.Trigger>
        <Select.List>
          {options.map((option, index) => (
            <Select.Option key={option} optionIndex={index} value={option}>
              {({ isSelected, isFocused }) => (
                <li>
                  {option}
                  {isSelected && 'Select!'}
                  {isFocused && 'Focus!'}
                </li>
              )}
            </Select.Option>
          ))}
        </Select.List>
      </Select>
  );
}
```
