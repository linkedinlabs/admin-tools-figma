import GUI from './GUI.svelte';

const app = new GUI({
  target: document.body,
  props: {
    name: 'dude'
  }
});

window.app = app;

export default app;
