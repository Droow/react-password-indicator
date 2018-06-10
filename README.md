# React Password Indicator
Package providing flexible yet powerful password input with fully customizable render

## Installation

`npm install --save react-password-indicator` or `yarn add react-password-indicator`

## Usage

```jsx
...
import PasswordInput from 'react-passsword-indicator';
...
// Custom error messages
const errorMessages = {
    minLen: (required, current) => 'Minimal password length is ${requred}`,
};

...
render() {
    return (
      <PasswordInput
        minLen={4}
        digits={2}
        maxLen={10}
        specialChars={2}
        uppercaseChars={2}
        onChange={(val, state) => console.log('Current pass', val, 'and progress', state)}
        rules={[
            { rule: (val) => val.indexOf('@') > -1, key: 'customAtRule' }
        ]}
      >
        {({ status, progress, inputProps, progressProps, passed, isVisible, errors, toggleShowPassword, touched }) => (
          <div>
            <input {...inputProps} />
            <button onClick={toggleShowPassword}>{isVisible ? 'Hide' : 'Show'}</button><br />
            {touched &&
            <div>
              <progress {...progressProps} />
              <p>Password is {passed ? '' : 'in'}valid!</p>
              {errors &&
                <ul>
                  {errors.map((e) => <li key={e.key}>{errorMessages[e.key] || e,message}</li>)}
                </ul>
              }
            </div>
            }
          </div>
        )}
      </PasswordInput>
    );
}
...
```

## Props

### defaultValue
> `string` | defaults to empty string

You can set the default input value via this prop.

### minLen
> `number` | defaults to 0

Predefined rule to check password minimal length. Uses >= operator, if you want to use > you have to use a custom rule.

### maxLen
> `number` | defaults to 0

Predefined rule to check password maximal length. Uses >= operator, if you want to use > you have to use a custom rule.

### digits
> `number` | defaults to 0

Predefined rule to check password for minimal number of digits. Uses >= operator, if you want to use > you have to use a custom rule.

### specialChars
> `number` | defaults to 0

Predefined rule to check password for minimal number of special characters (?!@#$%^&*)(+=._-}{,"'[]). Uses >= operator, if you want to use > or different special chars you have to use a custom rule.

### uppercaseChars
> `number` | defaults to 0

Predefined rule to check password for minimal number of uppercase characters. Uses >= operator, if you want to use > you have to use a custom rule.

### render
> `function({})` | _required_

You *have to* use this or the children to pass your custom render function. See more in [Render Prop Function](#Render Prop Function)

### isVisible
> `boolean`

Can be used in controlled mode to control the visibility of password in input element. 

## Render Prop Function
This is where you render whatever you want to based on the state of `react-password-indicator`.
You can either use the render prop:
```jsx
<PasswordInput render={(props) => /* your render method implementation */} />
```

Or you can pass it as the children prop if you prefer to:
```jsx
<PasswordInput>{(props) => /* your render method implementation */}</PasswordInput>
```

The properties of passed to this render method are listed below:


### `getInputProps`

This method should be applied to the `input` you render.

### `getProgressProps`

This method should be applied to the `progress` you render. It returns object of this shape:

```js
{
  value: 2, // count of passed rules
  max: 7, // count of all rules
}
```

## License
MIT
