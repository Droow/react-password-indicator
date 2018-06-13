import React from 'react';
import { shallow } from 'enzyme';

import PasswordInput from '../';

describe('messages', () => {
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

  test('should use default messages if none supplied', () => {
    const result = Input();
    const msgKeys = Object.keys(result.instance().errorMessages);
    expect(msgKeys.length).toBe(5);
    expect(msgKeys.includes('minLen')).toBe(true);
    expect(msgKeys.includes('maxLen')).toBe(true);
  });

  test('should use default messages if none supplied', () => {
    const result = Input({ defaultMessages: { myCustomRule: 'My Message' }});
    const msgKeys = Object.keys(result.instance().errorMessages);
    expect(msgKeys.length).toBe(6);
    expect(msgKeys.includes('myCustomRule')).toBe(true);
  });

  test('should accept string and function as messages', () => {
    const result = Input({
      minLen: 10,
      maxLen: 20,
      defaultMessages: {
        myCustomRule: 'My Message',
        minLen: (val) => `Min ${val}`,
        maxLen: { test: 'Bad' },
      },
      rules: [
        { key: 'myCustomRule', rule: () => true },
        { key: 'myCustomRule2', rule: () => true, message: (val) => `${val}`, value: 2 },
        { key: 'myCustomRule3', rule: () => true, message: 'string' },
        { key: 'myCustomRuleNoMessage', rule: () => true },
        { key: 'myCustomRuleInvalidMessage', rule: () => true, message: { test: 'bad' } },
      ],
    });
    const rules = result.instance().rules;
    expect(rules.filter((r) => r.key === 'minLen')[0].message).toEqual('Min 10');
    expect(rules.filter((r) => r.key === 'maxLen')[0].message).toEqual('Missing message for rule maxLen');
    expect(rules.filter((r) => r.key === 'myCustomRule')[0].message).toEqual('My Message');
    expect(rules.filter((r) => r.key === 'myCustomRule2')[0].message).toEqual('2');
    expect(rules.filter((r) => r.key === 'myCustomRule3')[0].message).toEqual('string');
    expect(rules.filter((r) => r.key === 'myCustomRuleNoMessage')[0].message).toEqual('Missing message for rule myCustomRuleNoMessage');
    expect(rules.filter((r) => r.key === 'myCustomRuleInvalidMessage')[0].message).toEqual('Missing message for rule myCustomRuleInvalidMessage');
  });
});