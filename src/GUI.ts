import './assets/css/main.scss';
import App from './views/App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'dude',
  },
});

window.app = app; // eslint-disable-line no-undef

export default app;
