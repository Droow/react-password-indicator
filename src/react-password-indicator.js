import React from 'react';
import PropTypes from 'prop-types';
// import StepProgress from './StepProgress';

class PasswordInput extends React.Component {
  /**
   * Appends new rule to a rule set but only if rule key is unique.
   *
   * @param rules
   * @param rule
   */
  static appendRule(rules, rule) {
    const sameRule = rules && rules.filter(r => r.key === rule.key);
    if (sameRule && sameRule.length > 0) {
      console.error(`react-password-indicator: Rule conflict with key "${rule.key}". The new rule is ignored.`); // eslint-disable-line
    } else {
      rules.push(rule);
    }
  }

  /**
   * Setups rules from props and initializes state.
   *
   * @param props
   */
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

    this.errorMessages = PasswordInput.getDefaultMessages(props.defaultMessages);
    this.rules = this.getRules(props);
  }

  /**
   * Makes sure that rules can be dynamically change.
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    let revalidate = false;
    // If any rules exists
    if (nextProps.rules.length > 0 || this.props.rules.length > 0) {
      const ruleKeys = this.props.rules.map(r => r.key);
      const nextRuleKeys = nextProps.rules.map(r => r.key);

      // If new rules are the same length check the keys...
      if (nextRuleKeys.length === ruleKeys.length) {
        const remaining = ruleKeys.filter(r => !nextRuleKeys.includes(r));
        const nextRemaining = nextRuleKeys.filter(r => !ruleKeys.includes(r));

        // If any rule has been added or removed then setup new rules
        if (remaining.length > 0 || nextRemaining.length > 0) {
          revalidate = true;
        } else {
          // Check if values of the rules changed (even when key is the same)
          this.rules.filter(r => r.value !== undefined).forEach((r) => {
            const rule = nextProps.rules.find(nr => nr.key === r.key);
            if (rule && rule.value !== r.value) {
              revalidate = true;
            }
          });
        }
      } else { // ...otherwise set new rules
        revalidate = true;
      }
    }

    if (this.props.mustMatch !== nextProps.mustMatch) {
      revalidate = true;
    }

    // Revalidate
    if (revalidate) {
      this.rules = this.getRules(nextProps);
      this.validate(this.getState().value);
    }

    // If we are in controlled mode, validate after value changed
    if (this.isControlledProp('value') && this.props.value !== nextProps.value) {
      this.validate(nextProps.value, true);
    }
  }

  /**
   * Setups rule message.
   *
   * @param {Object} rule
   * @param {string} rule.key Unique key of the rule
   * @param {string|number} rule.value
   * @param {string} rule.message Rule error message
   * @param {Object} rule.rest
   * @returns {{key: string, value: undefined, message: string}}
   */
  setupRule({
    key, value = undefined, message = undefined, ...rest
  }) {
    const m = PasswordInput.getMessageStringValue(
      message,
      value,
      PasswordInput.getMessageStringValue(
        this.errorMessages[key],
        value,
        `Missing message for rule ${key}`,
      ),
    );
    return {
      ...rest,
      key,
      value,
      message: m,
    };
  }

  /**
   * Gets the default messaged used for predefined rules.
   *
   * @param provided
   * @returns {{
   *  minLen: (function(*): string),
   *  maxLen: (function(*): string),
   *  digits: (function(*): string),
   *  uppercaseChars: (function(*): string),
   *  specialChars: (function(*): string)
   * }}
   */
  static getDefaultMessages(provided) {
    const defaultMessages = {
      minLen: val => `Minimal length is ${val}`,
      maxLen: val => `Maximal length is ${val}`,
      digits: val => `Requires at least ${val} digits`,
      uppercaseChars: val =>
        `Requires at least ${val} uppercase characters`,
      specialChars: val =>
        `Requires at least ${val} special characters`,
      mustMatch: 'Passwords must match',
      required: 'Password is required',
    };

    if (Object.keys(provided).length > 0) {
      Object.entries(provided).forEach(([key, cb]) => {
        if (typeof cb === 'string' || typeof cb === 'function') {
          defaultMessages[key] = cb;
        }
      });
    }

    return defaultMessages;
  }

  /**
   * Gets the message string value.
   * If function is supplied, then pass a value into it and return the output.
   * If string is supplied simply return it.
   * If neither of above, use fallback message.
   *
   * @param message
   * @param value
   * @param fallbackMessage
   * @returns string
   */
  static getMessageStringValue(message, value, fallbackMessage) {
    let m = fallbackMessage;
    const messageHelper = typeof message;
    if (message) {
      if (messageHelper === 'function') {
        m = message(value);
      } else if (messageHelper === 'string') {
        m = message;
      }
    }
    return m;
  }

  /**
   * Gets all the rules needed for the password to pass.
   *
   * @returns {Array}
   */
  getRules(props) {
    const {
      minLen,
      maxLen,
      digits,
      uppercaseChars,
      specialChars,
      mustMatch,
      required,
      rules: additionalRules,
    } = props;

    const rules = [];
    additionalRules.forEach(r => rules.push(this.setupRule(r)));

    if (required !== false) {
      PasswordInput.appendRule(rules, this.setupRule({
        rule: val => !!val,
        key: 'required',
      }));
    }

    if (minLen !== 0) {
      PasswordInput.appendRule(rules, this.setupRule({
        rule: (val, ruleVal) => val.length >= ruleVal,
        key: 'minLen',
        value: minLen,
      }));
    }

    if (maxLen !== 0) {
      PasswordInput.appendRule(rules, this.setupRule({
        rule: (val, ruleVal) => val.length <= ruleVal,
        key: 'maxLen',
        value: maxLen,
        inverted: true,
      }));
    }

    if (uppercaseChars !== 0) {
      PasswordInput.appendRule(rules, this.setupRule({
        rule: (val, ruleVal) => {
          const match = val.match(/[A-Z]/g);
          return match && match.length >= ruleVal;
        },
        key: 'uppercaseChars',
        value: uppercaseChars,
      }));
    }

    if (specialChars !== 0) {
      PasswordInput.appendRule(rules, this.setupRule({
        rule: (val, ruleVal) => {
          const match = val.match(/[\?!@#\$%\^\&*\)\(\+=\.\_\-\}\{,\"\'\[\]]/g); // eslint-disable-line
          return match && match.length >= ruleVal;
        },
        key: 'specialChars',
        value: specialChars,
      }));
    }

    if (digits !== 0) {
      PasswordInput.appendRule(rules, this.setupRule({
        rule: (val, ruleVal) => {
          const match = val.match(/[0-9]/g);
          return match && match.length >= ruleVal;
        },
        key: 'digits',
        value: digits,
      }));
    }

    if (mustMatch !== undefined) {
      PasswordInput.appendRule(rules, this.setupRule({
        rule: (val, ruleVal) => val === ruleVal,
        key: 'mustMatch',
        value: mustMatch,
      }));
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
   * @returns {{
   *  type: string,
   *  onChange: PasswordInput.handleInputChange,
   *  onBlur: PasswordInput.handleInputBlur,
   *  value: Object.value,
   * }}
   */
  getInputProps = (rest) => {
    const { isVisible, value } = this.getState();
    return {
      type: isVisible ? 'text' : 'password',
      onChange: this.handleInputChange,
      onBlur: this.handleInputBlur,
      value,
      ...rest,
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
   * @returns {{
   *  getInputProps:
   *    (function(*): {
   *      type: string,
   *      onChange: PasswordInput.handleInputChange,
   *      onBlur: PasswordInput.handleInputBlur,
   *      value: Object.value
   *    }),
   *  getProgressProps:
   *    (function(): {
   *      value: (number|PasswordInput.state.progress.current),
   *      max: PasswordInput.state.progress.max
   *    }),
   *  toggleShowPassword: PasswordInput.handleToggleShowPassword,
   *  hasRulePassed: (function(*): boolean),
   *  validate: (function(): *),
   *  touched: (boolean|*),
   *  errors: (Array|*),
   *  rules: *,
   *  valid: (boolean|*),
   *  isVisible: (boolean|*)
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
      hasRulePassed: this.hasRulePassed,
      validate: this.inputValidate,
      touched,
      errors,
      rules: this.rules,
      valid,
      isVisible,
    };
  }

  /**
   * Helper validation for informed (react-form).
   *
   * @returns {array|null}
   */
  inputValidate = () => {
    const state = this.validate(this.getState().value, true);
    return (state.errors.length ? state.errors : null);
  };

  /**
   * Checks if rule passed last validation.
   *
   * @param key
   * @returns {boolean}
   */
  hasRulePassed = key => !this.state.errors.find(e => e.key === key);

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

    if (this.isControlledProp('onChange')) {
      this.props.onChange(value);
    }

    this.setState({ value }, () => { // eslint-disable-line
      if (!this.props.validateOnBlur) {
        this.validate(value, true);
      }
    });
  };

  /**
   * Handles the input blur.
   */
  handleInputBlur = () => {
    const { value } = this.getState();

    if (this.isControlledProp('onBlur')) {
      this.props.onBlur(value);
    }

    if (this.props.validateOnBlur) {
      this.validate(value, true);
    }
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
   * Validates given value against all the rules and sets new state, but only if touched or forced.
   * Also fires the onChange callback if available.
   *
   * @param value
   * @param force
   */
  validate(value, force = this.state.touched) {
    if (force) {
      const newState = this.checkRules(value);
      this.setState({ ...newState, touched: true }, () => {
        if (this.isControlledProp('onValidate')) {
          this.props.onValidate(newState);
        }
      }); // eslint-disable-line
      return newState;
    }
    return null;
  }

  /**
   * Validates current password against all rules and returns the validation output.
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
      const result = r.value === undefined ? rule(value) : rule(value, r.value);

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
      touched: true,
    };
  }

  /**
   * Let's get this party started!
   */
  render() {
    const render = this.props.render || this.props.children;

    if (!render || typeof render !== 'function') {
      throw new Error('react-password-indicator: You must provide either children or the render function.');
    }

    return render(this.getRootProps());
  }
}

PasswordInput.propTypes = {
  defaultValue: PropTypes.string,
  defaultMessages: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ])),
  render: PropTypes.func,
  children: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onValidate: PropTypes.func,
  validateOnBlur: PropTypes.bool,
  rules: PropTypes.arrayOf(PropTypes.shape({
    rule: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ]).isRequired,
    key: PropTypes.string.isRequired,
    message: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
  })),
  minLen: PropTypes.number, // eslint-disable-line
  maxLen: PropTypes.number, // eslint-disable-line
  digits: PropTypes.number, // eslint-disable-line
  required: PropTypes.bool, // eslint-disable-line
  specialChars: PropTypes.number, // eslint-disable-line
  uppercaseChars: PropTypes.number, // eslint-disable-line
  mustMatch: PropTypes.string, // eslint-disable-line
  // These props are not unused, just eslint not recognizing them
  // because we are accessing them through getState method
  value: PropTypes.string, // eslint-disable-line
  isVisible: PropTypes.bool, // eslint-disable-line
};

PasswordInput.defaultProps = {
  minLen: 0,
  maxLen: 0,
  digits: 0,
  specialChars: 0,
  uppercaseChars: 0,
  required: false,
  mustMatch: undefined,
  rules: [],
  defaultValue: '',
  defaultMessages: {},
  validateOnBlur: false,
  // We need these props to be undefined
  // in order to check if they are controlled or not
  value: undefined,
  onChange: undefined,
  onBlur: undefined,
  onValidate: undefined,
  isVisible: undefined,
  render: undefined,
  children: undefined,
};

// PasswordInput.StepProgress = StepProgress;

export default PasswordInput;
