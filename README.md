[![npm version](https://badge.fury.io/js/react-password-indicator.svg)](https://badge.fury.io/js/react-password-indicator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.com/Droow/react-password-indicator.svg?branch=master)](https://travis-ci.com/Droow/react-password-indicator)
[![Coverage Status](https://coveralls.io/repos/github/Droow/react-password-indicator/badge.svg?branch=master)](https://coveralls.io/github/Droow/react-password-indicator?branch=master)

# React Password Indicator
Package providing flexible yet powerful password input with fully customizable render.

## Installation

You can install this package using one of these commands:
> `npm i --save react-password-indicator`

> `yarn add react-password-indicator`

This package also depends on `react`. Please make sure you have it installed as well.

## Usage
*[Basic usage and demo](https://droow.github.io/react-password-indicator/)*

You can play with sandbox here:

[![Edit o772lmq6](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/o772lmq6)

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
  minLen: (val) => `Minimal password length is ${val}`,
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
  rule: (value, ruleValue) => value.indexOf(ruleValue) > -1, // required - the validation function (has to return true or false)
  // optional error message - required if you did not set the default message
  message: 'Password is not valid for my custom rule',
  value: '@' // allows dynamic rule value change  
}
```

If you don't need to change rule value dynamically, you can just skip it:
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

### Render props passed to the render function

#### `getInputProps`

This method should be applied to the `input` you render.

#### `getProgressProps`

This method should be applied to the `progress` you render. It returns object of this shape:

```js
{
  value: 2, // count of passed rules
  max: 7, // count of all rules
}
```

#### `validate`

This method returns all current errors or null when called. Useful for integration with `informed`.

#### `toggleShowPassword`
> `function`

Function used to toggle password visibility.

#### `hasRulePassed`
> `function(key)`

Returns true if password passed the validation on this rule.

#### `valid`
> `boolean`

Indicates if the password has passed all the rules.

#### `isVisible`
> `boolean`

Indicates if the password is visible (input element has type or 'text' instead of 'password').

#### `errors`
> `array`

All the errors that occurred during password validation. 


#### `touched`
> `boolean`

Indicates if the password input has been changed.

#### `rules`
> `array`

All the rules currently applied to password validation.

## License
MIT
