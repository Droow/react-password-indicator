# React Password Indicator
Package providing flexible yet powerful password input with fully customizable render

## Installation

`npm install --save react-password-indicator` or `yarn add react-password-indicator`

## Usage

```
...
import PasswordInput from 'react-passsword-indicator';
...
const errorMessages = {
    minLen: (required, current) => 'Minimal password length is ${requred}`,
};

...
render() {
    return (
        <PasswordInput>
            {({ status, progress, inputProps, passed, visible, errors, toggleShowPassword, touched }) => (
                <div>
                  <input {...inputProps} />
                  <button onClick={toggleShowPassword}>{visible ? 'Hide' : 'Show'}</button><br />
                  {touched &&
                    <div>
                      <progress value={progress.percent} max={100} />
                      <p>Password is {passed ? '' : 'in'}valid!</p>
                      {errors &&
                        <ul>
                          {errors.map((e) => <li key={e}>{errorMessages[e]}</li>)}
                        </ul>
                      }
                    </div>
                  }
                </div>
              )}
        </PasswordInput>
    );
}
...
```

## License
MIT
