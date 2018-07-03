import React from 'react';
import { linkTo } from '@storybook/addon-links';

export default () => (
  <div>
    <h1>React Password Indicator</h1>
    <p>Flexible yet powerful password input with fully customizable render.</p>
    <h2>Getting Started</h2>
    <p>
      You should start with <a href="#" onClick={(e) => { e.preventDefault(); linkTo('Basic usage (uncontrolled)', 'Basic example')() }}>
        basic examples
      </a> and continue with <a href="#" onClick={(e) => { e.preventDefault(); linkTo('Controlled mode', 'Basic example')() }}>
        controlled mode
      </a> if you need.
    </p>
    <h2>Props</h2>
    See the <strong>NOTES</strong> tab on the right to see all possible props.
  </div>
);