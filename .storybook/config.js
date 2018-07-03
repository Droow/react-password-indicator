import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

import './assets/prism';
//import './assets/normalize.css';
//import './assets/skeleton.css';
import './assets/prism.css';
import './assets/main.css';

setOptions({
  name: 'react-password-indicator',
  url: 'https://droow.github.io/react-password-indicator',
  showDownPanel: true,
  downPanelInRight: true,
});

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
