import React from 'react';

import PasswordInput from '../../src/react-password-indicator';
import Code from '../utils/Code';

const Basic = () => (
  <div>
    <h2>Custom Rules</h2>
    <PasswordInput
      minLen={5}
      rules={[
        {
          key: 'myCustomRule',
          message: 'Your password must contain the \'@\' character',
          rule: (val) => val.indexOf('@') !== -1,
        }
      ]}
    >
      {({ getInputProps, valid, errors, touched }) => (
        <React.Fragment>
          <p>
            Enter password:
            <input {...getInputProps()} className={touched ? (valid ? 'success' : 'error') : ''} />
          </p>
          {touched && (
            valid
                ? <p>Password is valid!</p>
                : (
                  <p>
                    Password is invalid due to following errors:
                    <ul>
                      {errors.map((e) => (<li key={e.key}>{e.message}</li>))}
                    </ul>
                  </p>
                )
          )}
        </React.Fragment>
      )}
    </PasswordInput>
    <Code language="language-jsx">
      {`<PasswordInput
  minLen={5}
  rules={[
    {
      key: 'myCustomRule',
      message: 'Your password must contain the \'@\' character',
      rule: (val) => val.indexOf('@') !== -1,
    }
  ]}
>
  {({ getInputProps, valid, errors, touched }) => (
    <React.Fragment>
      <p>
        Enter password:
        <input {...getInputProps()} className={touched ? (valid ? 'success' : 'error') : ''} />
      </p>
      {touched && (
        valid
            ? <p>Password is valid!</p>
            : (
              <p>
                Password is invalid due to following errors:
                <ul>
                  {errors.map((e) => (<li key={e.key}>{e.message}</li>))}
                </ul>
              </p>
            )
      )}
    </React.Fragment>
  )}
</PasswordInput>`}
    </Code>
  </div>
);

export default Basic;