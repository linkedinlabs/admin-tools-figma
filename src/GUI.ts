import './assets/css/main.scss';
import App from './views/App.svelte'; // eslint-disable-line import/extensions

const app = new App({
  target: document.body,
  props: {
    inspect: 'styles',
    filter: 'all-styles',
    selected: null,
    newSessionKey: null,
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

/* process Messages from the plugin */

/** WIP
 * @description Clones a template html element and then updates the clone’s contents to match
 * the supplied options for each layer in the supplied array.
 *
 * @kind function
 * @name updateSelected
 *
 * @param {Array} items An array of items to clone. Each entry should include an `id`,
 * an `assignment`, `originalText`, `proposedText`, and a `locked` boolean.
 *
 * @returns {null}
 */
const updateSelected = (
  selected: {
    items: Array<PresenterItem>,
    groups: Array<PresenterTypeGroup>,
    types: Array<PresenterTypeGroup>,
  },
  filters: {
    newFilter?: string,
    newIsStyles?: boolean,
  },
  sessionKey: string,
): void => {
  if (selected) {
    app.selected = selected;
  }

  if (filters) {
    if (filters.newFilter) {
      app.filter = filters.newFilter;
    }

    const newInspect = filters.newIsStyles ? 'styles' : 'components';
    app.inspect = newInspect;
    app.newSessionKey = sessionKey;
  }
};

/** WIP
 * @description Watches for incoming messages from the plugin’s main thread and dispatches
 * them to the appropriate GUI actions.
 *
 * @kind function
 * @name watchIncomingMessages
 *
 * @returns {null}
 */
const watchIncomingMessages = (): void => {
  onmessage = ( // eslint-disable-line no-undef
    event: {
      data: {
        pluginMessage: {
          action: string,
          payload: any,
        }
      }
    },
  ) => {
    const { pluginMessage } = event.data;
    const { payload } = pluginMessage;
    const { filters, selected, sessionKey } = payload;

    switch (pluginMessage.action) {
      case 'refreshState':
        updateSelected(selected, filters, sessionKey);
        break;
      default:
        return null;
    }

    return null;
  };
};

// init GUI
window.app = app; // eslint-disable-line no-undef
// watchActions();
watchIncomingMessages();
sendLoadedMsg();

export default app;
