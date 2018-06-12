import React from 'react';
import { shallow } from 'enzyme';

import PasswordInput from '../';

describe('props', () => {
  let props;
  let mountedInput;
  const Input = (extraProps) => {
    if (!mountedInput) {
      mountedInput = shallow(<PasswordInput {...props} {...extraProps} />); // mount
    }
    return mountedInput;
  };

  beforeEach(() => {
    props = {
      render: ({ getProgressProps, getInputProps }) => (
        <div>
          <input {...getInputProps()} />
          <progress {...getProgressProps()} />
        </div>
      ),
      minLen: undefined,
    };
    mountedInput = undefined;
  });

  test('should attach onChange, value and type props to input element', () => {
    const result = Input();
    const input = result.find('input');
    expect(typeof input.prop('onChange')).toBe('function');
    expect(input.prop('value')).toEqual('');
    expect(input.prop('type')).toEqual('password');
  });

  test('should not allow two rules with identical key', () => {
    const original = console.error;

    console.error = jest.fn();
    shallow(
      <PasswordInput maxLen={20} rules={[{ key: 'maxLen', rule: () => true, message: '' }]}>
        {() => <div />}
      </PasswordInput>
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    console.error = original;
  });

  test('should update rules if new rule is dynamically added', () => {
    const compo = Input({ rules: [] });
    const inst = compo.instance();
    expect(inst.rules.length).toBe(0);
    compo.setProps({ rules: []});
    expect(inst.rules.length).toBe(0);
    compo.setProps({ rules: [{ key: 'testRule', rule: () => true, message: ''}]});
    expect(inst.rules.length).toBe(1);
    compo.setProps({ rules: [{ key: 'testRule2', rule: () => true, message: ''}]});
    expect(inst.rules.length).toBe(1);
    compo.setProps({ rules: []});
    expect(inst.rules.length).toBe(0);
  });
});
