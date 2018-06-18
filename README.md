[![npm version](https://badge.fury.io/js/react-password-indicator.svg)](https://badge.fury.io/js/react-password-indicator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.com/Droow/react-password-indicator.svg?branch=master)](https://travis-ci.com/Droow/react-password-indicator)
[![Coverage Status](https://coveralls.io/repos/github/Droow/react-password-indicator/badge.svg?branch=master)](https://coveralls.io/github/Droow/react-password-indicator?branch=master)

# React Password Indicator
Package providing flexible yet powerful password input with fully customizable render.

## Installation

You can install this package using one of these commands:
> `npm install --save react-password-indicator`

> `yarn add react-password-indicator`

This package also depends on `react` and `prop-types`. Please make sure you have those installed as well.

## Usage
[DEMO](https://droow.github.io/react-password-indicator/)

You can play with sandbox here:

[![Edit o772lmq6](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/o772lmq6)

Basic usage:
```jsx
import React from 'react';
import PasswordInput from 'react-passsword-indicator';

// Custom error messages
const errorMessages = {
    minLen: 'Password is not long enough!',
    maxLen: (val) => `Password exceeded the maximum length of ${val}`,
    customAtRule: 'Missing @! This message will be overriden.',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }
  
  render() {
    return (
      <div>
        {/* Using controlled mode to toggle password visibility */}
        <button onClick={() => this.setState((state) => ({ visible: !state.visible }))}>Show password</button>
        <PasswordInput
          minLen={4} // Optional predefined rule
          digits={2} // Optional predefined rule
          maxLen={10} // Optional predefined rule
          specialChars={2} // Optional predefined rule
          uppercaseChars={2} // Optional predefined rule
          defaultMessages={errorMessages}
          // Controlled mode
          // if not set the toggleShowPassword function in the render function should be used
          isVisible={this.state.visible} 
          onChange={(value, state) => console.log('Current pass', value, 'and progress', state)}
          // Additional custom rules
          rules={[
            {
              rule: (val) => val.indexOf('@') > -1,
              key: 'customAtRule',
              // override the default message
              message:'Your password must contain the @ char.',
            }
          ]}
        >
          {({
            getInputProps,
            getProgressProps,
            valid,
            isVisible,
            errors,
            toggleShowPassword,
            touched
          }) => (
            <div>
              <input {...getInputProps()} />
              {/*
              Uncontrolled mode
              just using provided function and the visibility state is internal
              WARNING: Doesn't work when isVisible prop is provided to the PasswordInput
              */}
              <button onClick={toggleShowPassword}>{isVisible ? 'Hide' : 'Show'}</button><br />
              {touched &&
                <div>
                  <progress {...getProgressProps()} />
                  <p>Password is {valid ? '' : 'in'}valid!</p>
                  {errors &&
                    <ul>
                      {errors.map((e) => <li key={e.key}>{e.message}</li>)}
                    </ul>
                  }
                </div>
              }
            </div>
          )}
        </PasswordInput>
      </div>
    );
  }
}
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

### mustMatch
> `string` | defaults to undefined

Predefined rule to check if password matches given string. Can be used for password confirmation.

### render
> `function({})` | _required_

You *have to* use this or the children to pass your custom render function. See more in [Render Prop Function](#Render Prop Function)

### isVisible
> `boolean`

Can be used in controlled mode to control the visibility of password in input element.

### value
> `string`

Can be used in controlled mode.

### name
> `string`

Name will be passed down to input and also to onChange event.

### defaultMessages
> `object`

You can override default messages or add messages for your custom rules here. If you dont supply message for your custom rule here, then you have to provide the message in rule itself (see [rules](#rules) prop).

Should have following shape:
```js
{
   // Override default message for predefined rule
  minLen: (val) => `Minimal password length id ${val}`,
  // If you dont need the value, string is also acceptable
  maxLen: 'Password is too long!',
  // Message for custom rule
  myRuleKey: 'Your custom message here',
}
```

### rules
> `array`

Array of additional custom rules in following format:
```js
{
  key: 'myRuleKey', // required - each rule needs unique identification
  rule: (value) => value.indexOf('@') > -1, // required - the validation function (has to return true or false)
  // optional error message - required if you did not set the default message
  message: 'Password is not valid for my custom rule',
}
``` 

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
