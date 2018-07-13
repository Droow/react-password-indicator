import React from 'react';
import { shallow } from 'enzyme';

import PasswordInput from '../';

describe('controlled mode', () => {
  test('should take the visibility value from props instead of state', () => {
    const result = shallow(<PasswordInput isVisible>
      {({ toggleShowPassword, getInputProps }) =>
        (<div>
          <a onClick={toggleShowPassword} />
          <input {...getInputProps()} />
        </div>)
      }
    </PasswordInput>);

    expect(result.find('input').prop('type')).toEqual('text');
    result.find('a').simulate('click');
    expect(result.find('input').prop('type')).toEqual('text');
  });
  /*
    test('should take the value from props instead of state', () => {
      const onChangeSpy = jest.fn(() => null);
      const result = shallow(
        <PasswordInput onChange={onChangeSpy} >
          {({toggleShowPassword, getInputProps}) =>
            <div>
              <a onClick={toggleShowPassword} />
              <input {...getInputProps()} />
            </div>
          }
        </PasswordInput>
      );

      result.find('input').simulate('change', { target: { value: 'someval' } });
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    }); */
});