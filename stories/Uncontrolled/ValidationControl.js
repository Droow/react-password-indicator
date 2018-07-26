import React from 'react';

import PasswordInput from '../../src/react-password-indicator';
import Code from '../utils/Code';

const Basic = () => (
  <div>
    <h2>Validation control</h2>
    <p>Validation on change is the default behaviour, if you want to validate on blur, just add the <code>validateOnBlur</code> prop.</p>
    <PasswordInput minLen={5} digits={2} specialChars={2} validateOnBlur>
      {({ getInputProps, getProgressProps, valid, hasRulePassed, rules, errors, touched }) => (
        <React.Fragment>
          <p>
            Enter password:
            <input {...getInputProps()} className={touched ? (valid ? 'success' : 'error') : ''} />
          </p>
          {touched && (
            <div>
              <progress {...getProgressProps()} />
              <p>Password is {!valid && 'in'}valid!</p>
            </div>
          )}
          <p>
            Password rules:
            <ul>
              {rules.map((r) => (
                <li key={r.key} className={touched ? (hasRulePassed(r.key) ? 'success' : 'error') : ''}>{r.message}</li>
              ))}
            </ul>
          </p>
        </React.Fragment>
      )}
    </PasswordInput>
    <Code language="language-jsx">
      {`<PasswordInput minLen={5} digits={2} specialChars={2} validateOnBlur>
  {({ getInputProps, getProgressProps, valid, hasRulePassed, rules, errors, touched }) => (
    <React.Fragment>
      <p>
        Enter password:
        <input {...getInputProps()} className={touched ? (valid ? 'success' : 'error') : ''} />
      </p>
      {touched && (
        <div>
          <progress {...getProgressProps()} />
          <p>Password is {!valid && 'in'}valid!</p>
        </div>
      )}
      <p>
        Password rules:
        <ul>
          {rules.map((r) => (
            <li
              key={r.key}
              className={touched ? (hasRulePassed(r.key) ? 'success' : 'error') : ''}
            >
              {r.message}
            </li>
          ))}
        </ul>
      </p>
    </React.Fragment>
  )}
</PasswordInput>`}
    </Code>
  </div>
);

export default Basic;