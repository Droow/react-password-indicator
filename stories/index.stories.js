import React from 'react';
import { storiesOf } from '@storybook/react';
import { withMarkdownNotes } from '@storybook/addon-notes';

import { Basic, WithBar, WithErrors, WithRules, WithMessages } from './Uncontrolled';
import { Basic as CBasic } from './Controlled';
import Welcome from './Welcome';
import readme from '../README.md';

storiesOf('Introduction', module)
  .add('Getting Started', withMarkdownNotes(readme)(Welcome));

storiesOf('Basic usage (uncontrolled)', module)
  .add('Basic example', Basic)
  .add('Error messages', WithErrors)
  .add('Progress bar', WithBar)
  .add('Custom rules', WithRules)
  .add('Custom messages', WithMessages);

storiesOf('Controlled mode', module)
  .add('Basic example', () => <CBasic />);