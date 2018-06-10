import React from 'react';
import { render, shallow } from 'enzyme';

import PasswordInput from '.';

describe('<PasswordInput/>', () => {
  test('should render a div via render prop', () => {
    const result = shallow(<PasswordInput render={() => <div>ABC</div>} />);
    expect(result.find('div').text()).toBe('ABC')
  });

  test('should render a div via children', () => {
    const result = shallow(<PasswordInput>{() => <div>ABC</div>}</PasswordInput>);
    expect(result.find('div').text()).toBe('ABC')
  });

});