import React from 'react';
import { action } from '@storybook/addon-actions';
import { Form, Text } from 'informed';

import PasswordInput from '../../src/index';
import Code from '../utils/Code';

class Informed extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      status: { touched: false },
    }
  }

  handleToggleShowPassword = () => {
    this.setState((state) => ({ isVisible: !state.isVisible }));
  };

  handleOnChange = (value, status) => {
    action('input changed')(value, status);
  };

  render() {
    const { isVisible } = this.state;
    return(
      <div>
        <h2>Informed integration</h2>
        <p>You can easily integrate this component with <a href="https://www.npmjs.com/package/informed" target="_blank">Informed</a> (previously <code>react-form</code>).</p>
        <p>Unfortunately <code>validateOnChange</code> prop is not working correctly for now so is suggested to use <code>validateOnBlur</code> or just use validation on submit.</p>
        <button onClick={this.handleToggleShowPassword}>{isVisible ? 'hide password' : 'show password'}</button>
        <Form onSubmit={(e) => { action('form submitted')(e); }}>
          {({ formState }) => (
            <React.Fragment>
              <PasswordInput
                onChange={this.handleOnChange}
                minLen={5}
                digits={2}
                isVisible={isVisible}
                value={formState.values.password}
              >
                {({ getInputProps, valid, touched, validate }) => (
                  <p>
                    Enter password with minimal length of 5 and 2 digits: <br />
                    <Text
                      field="password"
                      className={touched ? (valid ? 'success' : 'error') : ''}
                      validateOnBlur
                      notify={['password_confirm']}
                      {...getInputProps({ validate })}
                    />
                  </p>
                )}
              </PasswordInput>
              <PasswordInput
                onChange={this.handleOnChange}
                mustMatch={formState.values.password}
                value={formState.values.password_confirm}
              >
                {({ getInputProps, valid, touched, validate }) => (
                  <p>
                    Confirm password: <br />
                    <Text
                      field="password_confirm"
                      className={touched ? (valid ? 'success' : 'error') : ''}
                      validateOnBlur
                      notify={['password']}
                      {...getInputProps({ validate })}
                    />
                  </p>
                )}
              </PasswordInput>
              <button type="submit">
                Submit
              </button>
              <h3>Current form status</h3>
              <label>Values:</label>
              <Code language="language-js">
                {JSON.stringify(formState.values, null, 2)}
              </Code>
              <label>Errors:</label>
              <Code language="language-js">
                {JSON.stringify(formState.errors, null, 2)}
              </Code>
              <label>Invalid:</label>
              <Code language="language-js">
                {JSON.stringify(formState.invalid, null, 2)}
              </Code>
            </React.Fragment>
          )}
        </Form>
        <h3>Code used</h3>
        <Code language="language-jsx">
          {`import { Form, Text } from 'informed';

...

<Form>
  {({ formState }) => (
    <React.Fragment>
      <PasswordInput
        minLen={5}
        digits={2}
        isVisible={isVisible}
        value={formState.values.password}
      >
        {({ getInputProps, valid, touched, validate }) => (
          <p>
            Enter password with minimal length of 5 and 2 digits: <br />
            <Text
              field="password"
              className={touched ? (valid ? 'success' : 'error') : ''}
              validateOnBlur
              notify={['password_confirm']}
              {...getInputProps({ validate })}
            />
          </p>
        )}
      </PasswordInput>
      <PasswordInput
        mustMatch={formState.values.password}
        value={formState.values.password_confirm}
      >
        {({ getInputProps, valid, touched, validate }) => (
          <p>
            Confirm password: <br />
            <Text
              field="password_confirm"
              className={touched ? (valid ? 'success' : 'error') : ''}
              validateOnBlur
              notify={['password']}
              {...getInputProps({ validate })}
            />
          </p>
        )}
      </PasswordInput>
      <button type="submit">
        Submit
      </button>
      <h3>Current form status</h3>
      <label>Values:</label>
      <Code language="language-js">
        {JSON.stringify(formState.values, null, 2)}
      </Code>
      <label>Errors:</label>
      <Code language="language-js">
        {JSON.stringify(formState.errors, null, 2)}
      </Code>
      <label>Invalid:</label>
      <Code language="language-js">
        {JSON.stringify(formState.invalid, null, 2)}
      </Code>
    </React.Fragment>
  )}
</Form>`}
        </Code>
      </div>
    );
  }
}

export default Informed;