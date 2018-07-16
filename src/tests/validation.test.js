import React from 'react';
import { shallow } from 'enzyme';

import PasswordInput from '../';

describe('validation', () => {
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

  test('should check for digits', () => {
    const compo = Input({ digits: 3 });

    const input = compo.find('input');
    const passValue = 'ask2lj3d5fh';
    const errorValue = 'askljdfh';

    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
  });

  test('should check for minimal length', () => {
    const compo = Input({ minLen: 8 });

    const input = compo.find('input');
    const passValue = '123456789';
    const errorValue = '12345';

    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
  });

  test('should check for special chars', () => {
    const compo = Input({ specialChars: 3 });

    const input = compo.find('input');
    const passValue = 'avsd!.@?';
    const errorValue = 'adfsas';

    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
  });

  test('should check for uppercase chars', () => {
    const compo = Input({ uppercaseChars: 3 });

    const input = compo.find('input');
    const passValue = 'asdfAAA';
    const errorValue = 'adfsas';

    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
  });

  test('should check for max length', () => {
    const compo = Input({ maxLen: 20 });

    const input = compo.find('input');
    const passValue = 'a123sd!.@AAA';
    const errorValue = 'adfsasasdkfjhaskjdfgaskjfg';

    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
    expect(compo.instance().hasRulePassed('maxLen')).toBe(true);
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
    expect(compo.instance().hasRulePassed('maxLen')).toBe(false);
  });

  test('should check for match', () => {
    const passValue = 'a123sd!.@AAA';
    const compo = Input({ mustMatch: passValue });

    const input = compo.find('input');
    const errorValue = 'adfsasasdkfjhaskjdfgaskjfg';

    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
  });

  test('should check if required', () => {
    const passValue = 'aaa';
    const compo = Input({ required: true });
    const input = compo.find('input');

    input.simulate('change', { target: { value: '' } });
    expect(compo.state().valid).toBe(false);
    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
  });

  test('should revalidate when rule value changed', () => {
    const compo = Input({ rules: [{ key: 'test', rule: (val, ruleVal) => val === ruleVal, value: 'a' }] });
    const input = compo.find('input');

    expect(compo.state().valid).toBe(false);
    input.simulate('change', { target: { value: 'a' } });
    expect(compo.state().valid).toBe(true);
    compo.setProps({ rules: [{ key: 'test', rule: (val, ruleVal) => val === ruleVal, value: 'ab' }] });
    expect(compo.state().valid).toBe(false);
    compo.setProps({ rules: [{ key: 'test', rule: (val, ruleVal) => val === ruleVal, value: 'ab' }] });
    expect(compo.state().valid).toBe(false);
  });

  test('should revalidate when in controlled mode and value changed', () => {
    const compo = Input({ value: '', minLen: 2 });
    expect(compo.state().valid).toBe(false);
    compo.setProps({ value: 'eee' });
    expect(compo.state().valid).toBe(true);
  });

  test('should revalidate when rules dynamically changed', () => {
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