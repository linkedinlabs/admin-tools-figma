// ++++++++++++++++++++++++++ Specter for Figma +++++++++++++++++++++++++++
import App from './App';
import Messenger from './Messenger';
import { awaitUIReadiness } from './Tools';

// GUI management -------------------------------------------------

/**
 * Shuts down the plugin and closes the GUI.
 *
 * @kind function
 * @name terminatePlugin
 *
 * @returns {null}
 */
const terminatePlugin = (): void => {
  // close the plugin without suppressing error messages
  figma.closePlugin();
  return null;
};

// watch for commands -------------------------------------------------

/**
 * Takes a unique string (`type`) and calls the corresponding action
 * in the App class. Also does some housekeeping duties such as pre-loading typefaces
 * and managing the GUI.
 *
 * @kind function
 * @name dispatcher
 *
 * @param {Object} action An object comprised of `type`, a string representing the action received
 * from the GUI and `visual` a boolean indicating if the command came from the GUI or the menu.
 * @param {string} action.type A string representing the action received from the GUI.
 * @param {Object} action.payload Any additional parameters/data to pass to the main thread.
 * @param {boolean} action.visual Indicates if the command came from the GUI or the menu.
 * @param {number} action.sessionKey A rotating key used during the single run of the plugin.
 *
 * @returns {null}
 */
const dispatcher = async (action: {
  type: string,
  payload?: any,
  visual: boolean,
  sessionKey: number,
}) => {
  const {
    payload,
    sessionKey,
    type,
    visual,
  } = action;

  // if the action is not visual, close the plugin after running
  const shouldTerminate: boolean = !visual;

  // pass along some GUI management and navigation functions to the App class
  const app = new App({
    shouldTerminate,
    terminatePlugin,
  });

  // run the action in the App class based on type
  const runAction = async () => {
    switch (type) {
      case 'detach-instances':
        app.detachInstances(sessionKey);
        break;
      case 'select-hidden':
        app.selectHiddenLayers();
        break;
      case 'inherit-description':
        app.inheritDescription(sessionKey);
        break;
      case 'inherit-name':
        app.inheritName(sessionKey);
        break;
      case 'resize':
        App.resizeGUI(payload);
        break;
      case 'setFilters':
        App.setFilters(payload, sessionKey);
        break;
      case 'submit':
      case 'submit-bulk':
        app.handleUpdate(payload, sessionKey);
        break;
      case 'sendStyleValues':
        App.displayStyleValues(payload);
        break;
      case 'import-token-values':
        App.showTokenImport(sessionKey);
        break;
      case 'tools':
        App.showToolbar(sessionKey);
        break;
      default:
        return null;
    }

    return null;
  };

  runAction();

  return null;
};
export default dispatcher;

/**
 * Acts as the main wrapper function for the plugin. Run by default
 * when Figma calls the plugin.
 *
 * @kind function
 * @name main
 *
 * @returns {null}
 */
const main = async () => {
  // set up rotating key (use a timestamp)
  // this key is only used during the single run of the plugin
  const SESSION_KEY: number = Math.round((new Date()).getTime() / 1000);

  // set up logging
  const messenger = new Messenger({ for: figma, in: figma.currentPage });

  // set up the UI, hidden by default -----------------------------------------
  figma.showUI(__html__, { visible: false }); // eslint-disable-line no-undef

  // make sure UI has finished setting up
  await awaitUIReadiness(messenger);

  // watch menu commands ------------------------------------------------------
  if (figma.command) {
    dispatcher({
      type: figma.command,
      visual: false,
      sessionKey: SESSION_KEY,
    });
  }

  // watch GUI action clicks --------------------------------------------------
  figma.ui.onmessage = (msg: { action: string, payload: any }): void => {
    const { action, payload } = msg;

    // watch for actions and send to `dispatcher`
    if (action) {
      dispatcher({
        type: action,
        payload,
        visual: true,
        sessionKey: SESSION_KEY,
      });
    }

    // ignore everything else
    return null;
  };

  // watch selection changes on the Figma level -------------------------------
  figma.on('selectionchange', () => {
    App.refreshGUI(SESSION_KEY);
  });
};

// run main as default
main();
