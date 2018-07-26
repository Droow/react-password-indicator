import React from 'react';
import { shallow } from 'enzyme';

import PasswordInput from '../';

describe('controlled mode', () => {
  test('should take the visibility value from props instead of state', () => {
    const result = shallow(<PasswordInput isVisible>
      {({ toggleShowPassword, getInputProps }) =>
        (<div>
          <a onClick={toggleShowPassword} />
          <input {...getInputProps()} />
        </div>)
      }
    </PasswordInput>);

    expect(result.find('input').prop('type')).toEqual('text');
    result.find('a').simulate('click');
    expect(result.find('input').prop('type')).toEqual('text');
  });

  test('should take the value from props instead of state', () => {
    const myVal = "adfadf";
    const result = shallow(<PasswordInput value={myVal}>
      {({ getInputProps }) =>
        (<div>
          <input {...getInputProps()} />
        </div>)
      }
    </PasswordInput>);

    expect(result.find('input').prop('value')).toEqual(myVal);
    result.find('input').simulate('change', { target: { value: 'myOther' }});
    expect(result.find('input').prop('value')).toEqual(myVal);
  });

  test('should fire the onValidate on blur when validating on blur function', () => {
    const onBlurSpy = jest.fn();
    const onValidateSpy = jest.fn();
    const result = shallow(
      <PasswordInput
        onBlur={onBlurSpy}
        onValidate={onValidateSpy}
        validateOnBlur={true}
      >
        {({ getInputProps }) =>
          <div>
            <input {...getInputProps()} />
          </div>
        }
      </PasswordInput>
    );

    result.find('input').simulate('change', { target: { value: 'someval' } });
    expect(onValidateSpy).toHaveBeenCalledTimes(0);
    result.find('input').simulate('blur');
    expect(onBlurSpy).toHaveBeenCalledTimes(1);
    expect(onValidateSpy).toHaveBeenCalledTimes(1);
  });

  test('should not fire the onValidate on blur when validating on change', () => {
    const onChangeSpy = jest.fn();
    const onValidateSpy = jest.fn();
    const result = shallow(
      <PasswordInput
        onChange={onChangeSpy}
        onValidate={onValidateSpy}
      >
        {({ getInputProps }) =>
          <div>
            <input {...getInputProps()} />
          </div>
        }
      </PasswordInput>
    );

    result.find('input').simulate('change', { target: { value: 'someval' } });
    expect(onValidateSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    result.find('input').simulate('blur');
    expect(onValidateSpy).toHaveBeenCalledTimes(1);
  });
});