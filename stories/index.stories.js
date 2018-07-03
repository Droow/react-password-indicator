import React from 'react';
import { storiesOf } from '@storybook/react';

import { Basic, WithBar, WithErrors, WithRules, WithMessages } from './Uncontrolled';
import { Basic as CBasic } from './Controlled';
import Welcome from './Welcome';

storiesOf('Introduction', module).add('Getting Started', Welcome);

storiesOf('Basic usage (uncontrolled)', module)
  .add('Basic example', Basic)
  .add('Error messages', WithErrors)
  .add('Progress bar', WithBar)
  .add('Custom rules', WithRules)
  .add('Custom messages', WithMessages);

storiesOf('Controlled mode', module)
  .add('Basic example', () => <CBasic />);