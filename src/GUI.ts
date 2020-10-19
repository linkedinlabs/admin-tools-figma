import './assets/css/main.scss';
import App from './views/App.svelte'; // eslint-disable-line import/extensions

const app = new App({
  target: document.body,
  props: {
    inspect: 'styles',
    filter: 'all-styles',
    selected: null,
    newSessionKey: null,
    useSelection: false,
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

/**
 * @description Receives objects with the currently selected items/groups/types and
 * any filters, and passes them along to the Svelte UI class.
 *
 * @kind function
 * @name updateSelected
 *
 * @param {Object} selected An object containing `items`, `groups`, and `types` arrays
 * formatted for presentation in the UI.
 * @param {Object} filters An object with filters to show/hide elements in the UI.
 * @param {string} sessionKey A rotating key used during the single run of the plugin.
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
    newIsSelection?: boolean,
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

    const newUseSelection = filters.newIsSelection;
    const newInspect = filters.newIsStyles ? 'styles' : 'components';
    app.inspect = newInspect;
    app.newSessionKey = sessionKey;
    app.useSelection = newUseSelection;
  }

  return null;
};

/**
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
watchIncomingMessages();
sendLoadedMsg();

export default app;
