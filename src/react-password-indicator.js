import React from 'react';
import PropTypes from 'prop-types';

class PasswordInput extends React.Component {
  /**
   * Appends new rule to a rule set but only if rule key is unique
   *
   * @param rules
   * @param rule
   */
  static appendRule(rules, rule) {
    const sameRule = rules && rules.filter(r => r.key === rule.key);
    if (sameRule && sameRule.length > 0) {
      console.error(`react-password-indicator: Rule conflict with key "${rule.key}". The new rule is ignored.`);
    } else {
      rules.push(rule);
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue, // eslint-disable-line
      touched: false,
      valid: false,
      progress: { current: 0 },
      errors: [],
      isVisible: false,
    };

    this.rules = this.getRules(props.rules);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: Length can be the same but the keys not so check for that too
    if (nextProps.rules.length !== this.props.rules.length) {
      this.rules = this.getRules(nextProps.rules);
    }
  }

  /**
   * Gets all the rules needed for the password to pass.
   *
   * @returns {Array}
   */
  getRules(rules) {
    const {
      minLen, maxLen, digits, uppercaseChars, specialChars,
    } = this.props;

    if (minLen !== 0) {
      PasswordInput.appendRule(rules, {
        rule: val => val.length >= minLen,
        key: 'minLen',
        message: `Minimal length is ${minLen}`,
      });
    }

    if (maxLen !== 0) {
      PasswordInput.appendRule(rules, {
        rule: val => val.length <= maxLen,
        key: 'maxLen',
        message: `Maximal length is ${maxLen}`,
        inverted: true,
      });
    }

    if (uppercaseChars !== 0) {
      PasswordInput.appendRule(rules, {
        rule: (val) => {
          const match = val.match(/[A-Z]/g);
          return match && match.length >= uppercaseChars;
        },
        key: 'uppercaseChars',
        message: `Requires at least ${uppercaseChars} uppercase characters`,
      });
    }

    if (specialChars !== 0) {
      PasswordInput.appendRule(rules, {
        rule: (val) => {
          const match = val.match(/[\?!@#\$%\^\&*\)\(\+=\.\_\-\}\{,\"\'\[\]]/g); // eslint-disable-line
          return match && match.length >= specialChars;
        },
        key: 'specialChars',
        message: `Requires at least ${specialChars} special characters`,
      });
    }

    if (digits !== 0) {
      PasswordInput.appendRule(rules, {
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
      state[key] = this.isControlledProp(key) // eslint-disable-line
        ? this.props[key]
        : stateToMerge[key];
      return state;
    }, {});
  }

  /**
   * Gets props which are intended for the input element.
   *
   * @returns {{type: *, onChange: PasswordInput.handleInputChange}}
   */
  getInputProps = () => {
    const { isVisible, value } = this.getState();
    const { name } = this.props;
    return {
      type: isVisible ? 'text' : 'password',
      onChange: this.handleInputChange,
      value,
      name,
    };
  };

  /**
   * Gets props which are intended for the progress element.
   *
   * @returns {{
   *  value: (number|PasswordInput.state.progress.current),
   *  max: PasswordInput.state.progress.max
   * }}
   */
  getProgressProps = () => {
    const { current, max } = this.state.progress;
    return { value: current, max };
  };

  /**
   * Gets all the props that are passed to the render.
   *
   * @returns {{
   *  getInputProps: (function(): {
   *    type: string,
   *    onChange: PasswordInput.handleInputChange,
   *    value: Object.value,
   *    name: PasswordInput.props.name
   *  }),
   *  getProgressProps: (function(): {
   *    value: (number|PasswordInput.state.progress.current),
   *    max: PasswordInput.state.progress.max
   *  }),
   *  toggleShowPassword: PasswordInput.handleToggleShowPassword
   * }}
   */
  getRootProps() {
    const {
      touched, errors, valid, isVisible,
    } = this.state;
    return {
      getInputProps: this.getInputProps,
      getProgressProps: this.getProgressProps,
      toggleShowPassword: this.handleToggleShowPassword,
      touched,
      errors,
      valid,
      isVisible,
    };
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
   * Handles the input change.
   * @param e
   */
  handleInputChange = (e) => {
    const { value } = e.target;
    const newState = this.checkRules(value);
    if (this.isControlledProp('onChange')) {
      this.props.onChange(value, newState);
    }
    this.setState({ ...newState, value, touched: true }); // eslint-disable-line
  };

  /**
   * Handles the show password toggle.
   */
  handleToggleShowPassword = () => {
    if (!this.isControlledProp('isVisible')) {
      this.setState(state => ({ isVisible: !state.isVisible }));
    }
  };

  /**
   * Validates current password against all supplied rules.
   *
   * @param value
   * @returns {{
   *  progress: {
   *    current: number,
   *    max: number,
   *    percent: number
   *  },
   *  valid: boolean,
   *  errors: Array
   * }}
   */
  checkRules(value) {
    const rulesCount = this.rules.filter(r => !r.inverted).length;
    const ruleStep = 100 / rulesCount;
    const progress = { current: 0, max: rulesCount, percent: 0 };
    let valid = true;
    const errors = [];
    // Validate each rule
    this.rules.forEach((r) => {
      const { rule, inverted, ...rest } = r;
      const result = rule(value);
      if (result) {
        // Lets increment the progress when a rule passes
        if (!inverted) {
          progress.current += 1;
          progress.percent += ruleStep;
        }
      } else {
        /*
         Some rules might be inverted (maximum length for example)
         so they are passed automatically and we should decrement
         the progress when they are not valid any more.
        */
        if (inverted) {
          progress.current -= 1;
          progress.percent -= ruleStep;
        }
        valid = false;
        errors.push(rest);
      }
    });

    return {
      progress,
      valid,
      errors,
    };
  }

  /**
   * Let's get this party started!
   */
  render() {
    const children = this.props.render || this.props.children;

    if (!children) {
      throw new Error('react-password-indicator: You must provide either children or the render function.');
    }

    const element = children(this.getRootProps());
    return React.cloneElement(element, {});
  }
}

PasswordInput.propTypes = {
  value: PropTypes.string, // eslint-disable-line
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  render: PropTypes.func,
  children: PropTypes.func,
  onChange: PropTypes.func,
  isVisible: PropTypes.bool, // eslint-disable-line
  rules: PropTypes.arrayOf(PropTypes.shape({
    rule: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ]).isRequired,
    key: PropTypes.string.isRequired,
    message: PropTypes.string,
  })),
  minLen: PropTypes.number,
  maxLen: PropTypes.number,
  digits: PropTypes.number,
  specialChars: PropTypes.number,
  uppercaseChars: PropTypes.number,
};

PasswordInput.defaultProps = {
  minLen: 0,
  maxLen: 0,
  digits: 0,
  specialChars: 0,
  uppercaseChars: 0,
  rules: [],
  defaultValue: '',
  value: undefined,
  name: undefined,
  onChange: undefined,
  isVisible: undefined,
  render: undefined,
  children: undefined,
};

export default PasswordInput;
