import React from 'react';
import { linkTo } from '@storybook/addon-links';

import Code from './utils/Code';

export default () => (
  <div>
    <h1>React Password Indicator</h1>
    <p>Flexible yet powerful password input with fully customizable render.</p>
    <h2>Getting Started</h2>
    <strong>Install</strong>
    <Code>npm install --save react-password-indicator</Code>
    or
    <Code>yarn add react-password-indicator</Code>
    <h2>Read the docs</h2>
    <p>
      You should start with <a href="#" onClick={(e) => { e.preventDefault(); linkTo('Basic usage (uncontrolled)', 'Basic example')() }}>
      basic examples
    </a> and continue with <a href="#" onClick={(e) => { e.preventDefault(); linkTo('Controlled mode', 'Basic example')() }}>
      controlled mode
    </a> if you need.
    </p>
  </div>
);