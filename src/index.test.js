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
  test('should add all rules', () => {
    const { Component, onChangeSpy, renderSpy } = setup();
    const result = shallow(
      <Component minLen={2} maxLen={3} specialChars={4} uppercaseChars={5} digits={6}/>
    ).dive();
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
  });

  test('should attach onChange, value and type props to input element', () => {
    const { Component } = setup();
    const result = shallow(<Component/>).dive();
    const input = result.find('input');
    expect(typeof input.prop('onChange')).toBe('function');
    expect(input.prop('value')).toEqual('');
    expect(input.prop('type')).toEqual('password');
  });

  test('should change input type when toggled', () => {
    const { Component } = setup();
    const result = shallow(<Component/>).dive();

    expect(result.find('input').prop('type')).toEqual('password');
    result.setState({ isVisible: true });
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
    input.simulate('change', { target: { name: 'test', value: testValue } });
    expect(result.state().value).toBe(testValue);

    expect(renderSpy).toHaveBeenCalled();
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });
});

function setup() {
  /* eslint-disable react/jsx-closing-bracket-location */
  const renderSpy = jest.fn(
    ({ getProgressProps, getInputProps }) => (
      <div>
        <input {...getInputProps()} />
        <progress {...getProgressProps()} />
      </div>
    ),
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