import React from 'react';
import { shallow } from 'enzyme';

import PasswordInput from '../';

describe('handlers', () => {
  test('should register input change and change the state properly', () => {
    const { Component, onChangeSpy } = setup(true);
    const result = shallow(<Component />).dive();
    const input = result.find('input');
    const testValue = 'askljdfh';

    expect(result.state().value).toBe('');
    input.simulate('change', { target: { value: testValue } });
    expect(result.state().value).toBe(testValue);

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  test('should change input type when toggled', () => {
    const result = shallow(<PasswordInput>
      {({ toggleShowPassword, getInputProps }) =>
        (<div>
          <a onClick={toggleShowPassword} />
          <input {...getInputProps()} />
        </div>)
      }
    </PasswordInput>);

    expect(result.find('input').prop('type')).toEqual('password');
    result.find('a').simulate('click');
    expect(result.find('input').prop('type')).toEqual('text');
  });
});

function setup(withSpy = false) {
  /* eslint-disable react/jsx-closing-bracket-location */
  const render = ({ getProgressProps, getInputProps }) => (
    <div>
      <input {...getInputProps()} />
      <progress {...getProgressProps()} />
    </div>
  );

  const onChangeSpy = jest.fn();

  function BasicPasswordInput(props) {
    return <PasswordInput {...props} onChange={withSpy ? onChangeSpy : undefined} render={render} />;
  }

  return {
    Component: BasicPasswordInput,
    onChangeSpy,
  };
}