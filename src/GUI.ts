import './assets/css/main.scss';
import App from './views/App.svelte'; // eslint-disable-line import/extensions

const app = new App({
  target: document.body,
  props: {
    name: 'dude',
  },
});

/**
 * @description Posts a message to the main thread with `loaded` set to `true`. Used in the
 * main thread to indicate the GUI is listening.
 *
 * @kind function
 * @name sendLoadedMsg
 *
 * @returns {null}
 */
const sendLoadedMsg = (): void => {
  // send message to main thread indicating UI has loaded
  parent.postMessage({ pluginMessage: { loaded: true } }, '*');

  return null;
};

// init GUI
window.app = app; // eslint-disable-line no-undef
// watchActions();
// watchIncomingMessages();
sendLoadedMsg();

export default app;
