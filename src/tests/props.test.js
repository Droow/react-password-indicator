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
    compo.setProps({ rules: [{ key: 'testRule2', rule: () => true, message: ''}]});
    expect(inst.rules.length).toBe(1);
    compo.setProps({ rules: []});
    expect(inst.rules.length).toBe(0);
  });

  test('should revalidate when in controlled mode and value changed', () => {
    const compo = Input({ value: '', minLen: 2 });
    expect(compo.state().valid).toBe(false);
    compo.setProps({ value: 'ee' });
    expect(compo.state().valid).toBe(true);
  });

  test('should revalidate when routes dynamically changed', () => {
    const compo = Input({ rules: [{ key: 'testRule', rule: () => false, alwaysValidate: true, message: '' }] });
    const input = compo.find('input');

    expect(compo.state().valid).toBe(false);
    input.simulate('change', { target: { value: 'aa' } });
    expect(compo.state().valid).toBe(false);
    compo.setProps({ rules: [{ key: 'testRule2', rule: () => true, alwaysValidate: true, message: '' }] });
    expect(compo.state().valid).toBe(true);
    compo.setProps({ rules: [{ key: 'testRule2', rule: () => true, alwaysValidate: true, message: '' }, { key: 'testRule', rule: () => false, alwaysValidate: true, message: '' }] });
    expect(compo.state().valid).toBe(false);
  });

  test('should revalidate when mustMatch prop changed', () => {
    const compo = Input({ mustMatch: 'a' });
    const input = compo.find('input');

    expect(compo.state().valid).toBe(false);
    compo.setProps({ mustMatch: 'aa' });
    expect(compo.state().valid).toBe(false);
    input.simulate('change', { target: { value: 'aa' } });
    expect(compo.state().valid).toBe(true);
    compo.setProps({ mustMatch: 'bb' });
    expect(compo.state().valid).toBe(false);
  });
});
