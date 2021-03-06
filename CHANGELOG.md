## v1.0.0
- Add more controlled options:
    * `onBlur`
    * `onValidate`
- Add options to choose if validate on change or on blur
- `onChange` now returns only input value and not the validation result (use `onValidate` for that)
- Add more examples to storybook (controlled)

## v0.5.1
- Add `required` predefined rule

## v0.5.0
- Add `informed` integration support
- Add more examples to storybook

## v0.4.1
- Add storybook
- Update readme

## v0.4.0
- Return all rules in render function
- Add `hasRulePassed` function to detect passed rules

## v0.3.0
- Rules are now re-validated when changed dynamically
- Rules are now re-validated when value changes in controlled mode
- Add new predefined rule to allow easy password confirmation validation
- Add demo page to readme

## v0.2.1
- Fallback to default message for predefined rules if wrong type is supplied

## v0.2.0
- Improve message management
- Allow only unique rules
- Allow rules to be dynamically changed
- Minor bug fixes

## v0.1.0
Initial version