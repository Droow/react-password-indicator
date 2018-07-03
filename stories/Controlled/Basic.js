import React from 'react';
import { action } from '@storybook/addon-actions';

import PasswordInput from '../../src/react-password-indicator';
import Code from '../utils/Code';

class Basic extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isVisible: false,
      value: '',
      status: {},
    }
  }

  handleToggleShowPassword = () => {
    this.setState((state) => ({ isVisible: !state.isVisible }));
  };

  handleOnChange = (value, status) => {
    action('input changed')(value, status);
    this.setState({ value, status });
  };

  render() {
    const { isVisible, value, status: { valid } } = this.state;
    return(
      <div>
        <h2>Basic Usage of controlled mode</h2>
        <button onClick={this.handleToggleShowPassword}>{isVisible ? 'hide password' : 'show password'}</button>
        <PasswordInput
          minLen={5}
          digits={2}
          isVisible={isVisible}
          value={value}
          onChange={this.handleOnChange}
        >
          {({ getInputProps, touched }) => (
            <p>
              Enter password with minimal length of 5 and 2 digits: <br />
              <input {...getInputProps()} className={touched ? (valid ? 'success' : 'error') : ''} />
            </p>
          )}
        </PasswordInput>
        <h3>Current password status</h3>
        <p>Password is {valid ? '' : 'in'}valid!</p>
        <Code language="language-js">
          {JSON.stringify(this.state.status, null, 2)}
        </Code>
        <h3>Code used</h3>
        <Code language="language-jsx">
          {`class App extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isVisible: false,
      value: '',
      status: {},
    }
  }

  handleToggleShowPassword = () => {
    this.setState((state) => ({ isVisible: !state.isVisible }));
  };

  handleOnChange = (value, status) => {
    this.setState({ value, status });
  };

  render() {
    const { isVisible, value, status: { valid } } = this.state;
    return(
      <div>
        <h2>Basic Usage of controlled mode</h2>
        <button onClick={this.handleToggleShowPassword}>{isVisible ? 'hide password' : 'show password'}</button>
        <PasswordInput
          minLen={5}
          digits={2}
          isVisible={isVisible}
          value={value}
          onChange={this.handleOnChange}
        >
          {({ getInputProps, touched }) => (
            <p>
              Enter password with minimal length of 5 and 2 digits: <br />
              <input {...getInputProps()} className={touched ? (valid ? 'success' : 'error') : ''} />
            </p>
          )}
        </PasswordInput>
        <h3>Current password status</h3>
        <p>Password is {valid ? '' : 'in'}valid!</p>
        <Code language="language-js">
          {JSON.stringify(this.state.status, null, 2)}
        </Code>
      </div>
    );
  }
}`}
        </Code>
      </div>
    );
  }
}

export default Basic;