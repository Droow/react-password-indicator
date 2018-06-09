# React Password Indicator
Package providing flexible yet powerful password input with fully customizable render

## Installation

`npm install --save react-password-indicator` or `yarn add react-password-indicator`

## Usage

```jsx
...
import PasswordInput from 'react-passsword-indicator';
...
const errorMessages = {
    minLen: (required, current) => 'Minimal password length is ${requred}`,
};

...
render() {
    return (
        <PasswordInput>
            {({ status, progress, inputProps, passed, visible, errors, toggleShowPassword, touched }) => (
                <div>
                  <input {...inputProps} />
                  <button onClick={toggleShowPassword}>{visible ? 'Hide' : 'Show'}</button><br />
                  {touched &&
                    <div>
                      <progress value={progress.percent} max={100} />
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

### onStateChange
> `function({})` | _optional_

### minLen
> `number` | defaults to 0

### maxLen
> `number` | defaults to 0

### digits
> `number` | defaults to 0

### specialChars
> `number` | defaults to 0

### uppercaseChars
> `number` | defaults to 0

### render
> `function({})` | _required_

### visible
> `boolean`

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

## License
MIT
