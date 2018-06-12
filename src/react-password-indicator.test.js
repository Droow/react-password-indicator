import React from 'react';
import { shallow } from 'enzyme';

import PasswordInput from '.';

describe('rendering', () => {
  test('should render a div via render prop', () => {
    const result = shallow(<PasswordInput render={() => <div>ABC</div>} />);
    expect(result.find('div').text()).toBe('ABC');
  });

  test('should render a div via children', () => {
    const result = shallow(<PasswordInput>{() => <div>ABC</div>}</PasswordInput>);
    expect(result.find('div').text()).toBe('ABC');
  });

  test('should throw error when no render function is provided', () => {
    expect(() => shallow(<PasswordInput />)).toThrow();
  });
});

describe('props', () => {
  /*test('should add all rules', () => {
    const { Component } = setup();
    const result = shallow(
      <PasswordInput minLen={2} maxLen={3} specialChars={4} uppercaseChars={5} digits={6} render={() => <div />}/>
    );
    const rules = result.instance().rules;

    expect(rules).toContainEqual(
      expect.objectContaining({ key: 'minLen', message: expect.anything(), rule: expect.anything() })
    );
    expect(rules).toContainEqual(
      expect.objectContaining({ key: 'maxLen', message: expect.anything(), rule: expect.anything() })
    );
    expect(rules).toContainEqual(
      expect.objectContaining({ key: 'specialChars', message: expect.anything(), rule: expect.anything() })
    );
    expect(rules).toContainEqual(
      expect.objectContaining({ key: 'uppercaseChars', message: expect.anything(), rule: expect.anything() })
    );
    expect(rules).toContainEqual(
      expect.objectContaining({ key: 'digits', message: expect.anything(), rule: expect.anything() })
    );
    expect(rules.length).toBe(5);
  });*/

  test('should attach onChange, value and type props to input element', () => {
    const { Component } = setup();
    const result = shallow(<Component/>).dive();
    const input = result.find('input');
    expect(typeof input.prop('onChange')).toBe('function');
    expect(input.prop('value')).toEqual('');
    expect(input.prop('type')).toEqual('password');
  });

  test('should change input type when toggled', () => {
    const result = shallow(
      <PasswordInput>
        {({toggleShowPassword, getInputProps}) =>
          <div>
            <a onClick={toggleShowPassword} />
            <input {...getInputProps()} />
          </div>
        }
      </PasswordInput>);

    expect(result.find('input').prop('type')).toEqual('password');
    //result.setState({ isVisible: true });
    result.find('a').simulate('click');
    result.update();
    expect(result.find('input').prop('type')).toEqual('text');
  });

});

describe('handlers', () => {
  test('should register input change and change the state properly', () => {
    const { Component, onChangeSpy, renderSpy } = setup();
    const result = shallow(<Component/>).dive();
    const input = result.find('input');
    const testValue = 'askljdfh';

    expect(result.state().value).toBe('');
    input.simulate('change', { target: { value: testValue } });
    expect(result.state().value).toBe(testValue);

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });
});

describe('validation', () => {
  test('should check for digits', () => {
    const { Component } = setup();
    const compo = shallow(
      <Component digits={3}/>
    ).dive();

    const input = compo.find('input');
    const passValue = 'ask2lj3d5fh';
    const errorValue = 'askljdfh';

    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
  });

  test('should check for minimal length', () => {
    const { Component } = setup();
    const compo = shallow(
      <Component minLen={8}/>
    ).dive();

    const input = compo.find('input');
    const passValue = '123456789';
    const errorValue = '12345';

    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
  });

  test('should check for special chars', () => {
    const { Component } = setup();
    const compo = shallow(
      <Component specialChars={3}/>
    ).dive();

    const input = compo.find('input');
    const passValue = 'a123sd!.@?';
    const errorValue = 'adfsas';

    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
  });

  test('should check for uppercase chars', () => {
    const { Component } = setup();
    const compo = shallow(
      <Component uppercaseChars={3}/>
    ).dive();

    const input = compo.find('input');
    const passValue = 'a123sd!.@AAA';
    const errorValue = 'adfsas';

    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
  });

  test('should check for max length', () => {
    const { Component } = setup();
    const compo = shallow(
      <Component maxLen={20}/>
    ).dive();

    const input = compo.find('input');
    const passValue = 'a123sd!.@AAA';
    const errorValue = 'adfsasasdkfjhaskjdfgaskjfg';

    input.simulate('change', { target: { value: passValue } });
    expect(compo.state().valid).toBe(true);
    input.simulate('change', { target: { value: errorValue } });
    expect(compo.state().valid).toBe(false);
  });
});

/*describe('controlled mode', () => {
  test('should toggle password visibility', () => {
    const { Component } = setup();
    const result = shallow(<Component>({ toggleShowPassword</Component>)
    expect(result.find('input').prop('type')).toEqual('password');
    result.setState({ isVisible: true });
    result.update();
    expect(result.find('input').prop('type')).toEqual('text');
  });
});*/

function setup() {
  /* eslint-disable react/jsx-closing-bracket-location */
  const renderSpy = // jest.fn(
    ({ getProgressProps, getInputProps }) => (
      <div>
        <input {...getInputProps()} />
        <progress {...getProgressProps()} />
      </div>
    //),
  );

  const onChangeSpy = jest.fn();

  function BasicPasswordInput(props) {
    return <PasswordInput {...props} onChange={onChangeSpy} render={renderSpy} />
  }

  return {
    Component: BasicPasswordInput,
    renderSpy,
    onChangeSpy,
  }
}
