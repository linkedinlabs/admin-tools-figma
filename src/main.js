import './assets/css/main.scss';
import GUI from './GUI.svelte';

const app = new GUI({
  target: document.body,
  props: {
    name: 'dude',
  },
});

window.app = app; // eslint-disable-line no-undef

export default app;
