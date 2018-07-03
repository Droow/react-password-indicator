import React from 'react';

import PasswordInput from '../../src/react-password-indicator';
import Code from '../utils/Code';

const Basic = () => (
  <div>
    <h2>Basic Usage</h2>
    <PasswordInput minLen={5}>
      {({ getInputProps, touched, valid, isVisible, toggleShowPassword }) => (
        <React.Fragment>
          <p>
            Enter password with minimal length of 5:
            <input {...getInputProps()} className={touched ? (valid ? 'success' : 'error') : ''} />
            <button onClick={toggleShowPassword}>{isVisible ? 'hide' : 'show'}</button>
          </p>
          <p>Password is {valid ? '' : 'in'}valid!</p>
        </React.Fragment>
      )}
    </PasswordInput>
    <Code language="language-jsx">
      {`<PasswordInput minLen={5}>
  {({ getInputProps, touched, valid, isVisible, toggleShowPassword }) => (
    <React.Fragment>
      <p>
        Enter password with minimal length of 5:
        <input {...getInputProps()} className={touched ? (valid ? 'success' : 'error') : ''} />
        <button onClick={toggleShowPassword}>{isVisible ? 'hide' : 'show'}</button>
      </p>
      <p>Password is {valid ? '' : 'in'}valid!</p>
    </React.Fragment>
  )}
</PasswordInput>`}
    </Code>
  </div>
);

export default Basic;