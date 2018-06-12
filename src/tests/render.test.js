import React from 'react';
import { shallow } from 'enzyme';

import PasswordInput from '../';

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