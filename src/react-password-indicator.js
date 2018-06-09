import React from 'react';
import PropTypes from 'prop-types';

class PasswordInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      touched: false,
      passed: false,
      progress: 0,
      visible: false,
      errors: [],
    };

    this.rules = this.getRules();
  }

  /**
   * Gets all the rules needed for the password to pass.
   *
   * @returns {Array}
   */
  getRules() {
    const { minLen, maxLen, digits, uppercaseChars, specialChars } = this.props;
    const rules = this.props.rules;

    if (minLen !== 0) {
      rules.push({
        rule: (val) => val.length >= minLen,
        key: 'minLen',
        message: `Minimal length is ${minLen}`,
      });
    }

    if (maxLen !== 0) {
      rules.push({
        rule: (val) => val.length <= maxLen,
        key: 'maxLen',
        message: `Maximal length is ${maxLen}`,
        inverted: true,
      });
    }

    if (uppercaseChars !== 0) {
      rules.push({
        rule: (val) => {
          const match = val.match(/[A-Z]/g);
          return match && match.length >= uppercaseChars;
        },
        key: 'uppercaseChars',
        message: `Requires at least ${uppercaseChars} uppercase characters`,
      });
    }

    if (specialChars !== 0) {
      rules.push({
        rule: (val) => {
          const match = val.match(/[\?!@#\$%\^\&*\)\(\+=\.\_\-\}\{,\"\'\[\]]/g);
          return match && match.length >= specialChars;
        },
        key: 'specialChars',
        message: `Requires at least ${specialChars} special characters`,
      });
    }

    if (digits !== 0) {
      rules.push({
        rule: (val) => {
          const match = val.match(/[0-9]/g);
          return match && match.length >= digits;
        },
        key: 'digits',
        message: `Requires at least ${digits} digits`,
      });
    }

    return rules;
  }

  /**
   * Gets the state based on internal state or props
   * If a state value is passed via props, then that
   * is the value given, otherwise it's retrieved from
   * stateToMerge
   *
   * This will perform a shallow merge of the given state object
   * with the state coming from props
   * (for the controlled component scenario)
   * This is used in state updater functions so they're referencing
   * the right state regardless of where it comes from.
   *
   * @param {Object} stateToMerge defaults to this.state
   * @returns {Object} the state
   */
  getState(stateToMerge = this.state) {
    return Object.keys(stateToMerge).reduce((state, key) => {
      state[key] = this.isControlledProp(key)
        ? this.props[key]
        : stateToMerge[key];
      return state
    }, {});
  }

  /**
   * This determines whether a prop is a "controlled prop" meaning it is
   * state which is controlled by the outside of this component rather
   * than within this component.
   *
   * @param {String} key the key to check
   * @returns {Boolean} whether it is a controlled controlled prop
   */
  isControlledProp(key) {
    return this.props[key] !== undefined;
  }

  /**
   * Gets props which are intended for the input element.
   *
   * @returns {{type: *, onChange: PasswordInput.handleInputChange}}
   */
  getInputProps() {
    return {
      type: this.getState().visible ? 'text' : 'password',
      onChange: this.handleInputChange,
    }
  }

  /**
   *
   * @returns {{inputProps: {type: *, onChange: PasswordInput.handleInputChange}, toggleShowPassword: PasswordInput.handleToggleShowPassword}}
   */
  getRootProps() {
    return {
      inputProps: this.getInputProps(),
      toggleShowPassword: this.handleToggleShowPassword,
      ...this.getState(),
    };
  }

  /**
   *
   * @param e
   */
  handleInputChange = (e) => {
    const value = e.target.value;
    this.setState({
      value,
      touched: true,
      ...this.checkRules(value),
    }); // TODO: Internal set state (props on state change vs setstate)
  };

  /**
   *
   */
  handleToggleShowPassword = () => {
    this.setState((state) => ({ visible: !state.visible }));
  };

  /**
   *
   * @param value
   * @returns {{progress: {current: number, max: number, percent: number}, passed: boolean, errors: Array}}
   */
  checkRules(value) {
    const rulesCount = this.rules.filter((r) => !r.inverted).length;
    const ruleStep = 100 / rulesCount;
    let progress = { current: 0, max: rulesCount, percent: 0 };
    let passed = true;
    const errors = [];
    this.rules.forEach((r) => {
      const result = r.rule(value);
      if (result) {
        if (!r.inverted) {
          progress.current += 1;
          progress.percent += ruleStep;
        }
      } else {
        if (r.inverted) {
          progress.current -= 1;
          progress.percent -= ruleStep;
        }
        passed = false;
        errors.push({ key: r.key, message: r.message });
      }
    });

    return {
      progress,
      passed,
      errors,
    }
  }

  /**
   *
   * @param newState
   */
  setStateHelper(newState) {
    if (this.props.onStateChange) {
    }
  }

  render() {
    const children = this.props.render || this.props.children;

    const element = children(this.getRootProps());
    return React.cloneElement(element, {});
  }
}

PasswordInput.propTypes = {
  value: PropTypes.string,
  render: PropTypes.func,
  children: PropTypes.func,
  onChange: PropTypes.func,
  onStateChange: PropTypes.func,
  visible: PropTypes.bool,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      rule: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
      ]),
      key: PropTypes.string,
    }),
  ),
  minLen: PropTypes.number,
  maxLen: PropTypes.number,
  digits: PropTypes.number,
  specialChars: PropTypes.number,
  uppercaseChars: PropTypes.number,
};

PasswordInput.defaultProps = {
  onChange: () => {},
  onStateChange: () => {},
  minLen: 0,
  maxLen: 0,
  digits: 0,
  specialChars: 0,
  uppercaseChars: 0,
  rules: [],
};

export default PasswordInput;