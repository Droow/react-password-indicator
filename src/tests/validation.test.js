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
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
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
});