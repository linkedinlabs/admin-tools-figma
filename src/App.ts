import Crawler from './Crawler';
import Editor from './Editor';
import Painter from './Painter';
import Presenter from './Presenter';
import Messenger from './Messenger';
import { resizeGUI } from './Tools';
import { DATA_KEYS, GUI_SETTINGS } from './constants';

/**
 * @description A shared helper function to set up in-UI messages and the logger.
 *
 * @kind function
 * @name assemble
 *
 * @param {Object} context The current context (event) received from Figma.
 *
 * @returns {Object} Contains an object with the current page as a javascript object,
 * a messenger instance, and a selection array (if applicable).
 */
const assemble = (context: any = null) => {
  const page = context.currentPage;
  const { selection } = context.currentPage;
  const messenger = new Messenger({ for: context, in: page });

  return {
    messenger,
    page,
    selection,
  };
};

// /**
//  * @description Triggers Figma’s change watcher by randomly re-naming a node and then returning
//  * it to it’s original name. This is used in the context of applying new data to a master
//  * component that needs to be re-published in a library. Data updates do not currently
//  * trigger Figma’s awareness of changes within the component.
//  *
//  * @kind function
//  * @name triggerFigmaChangeWatcher
//  *
//  * @param {Object} node The text node (`TextNode`) to trigger changes on.
//  *
//  * @returns {null}
//  */
// const triggerFigmaChangeWatcher = (
//   node:
//     TextNode
//     | EllipseNode
//     | PolygonNode
//     | RectangleNode
//     | StarNode,
// ): void => {
//   // rename the layer, and then rename it back, to trigger Figma's changes watcher
//   // this is used to allow master components to be republished with changes
//   const randomName: string = `${Date.now()}`;
//   const originalName: string = node.name;
//   let originalAutoRename: boolean = false;
//   if (node.type === 'TEXT') {
//     originalAutoRename = node.autoRename;
//   }
//   /* eslint-disable no-param-reassign */
//   node.name = randomName;
//   node.name = originalName;

//   if (node.type === 'TEXT') {
//     node.autoRename = originalAutoRename;
//   }
//   /* eslint-enable no-param-reassign */

//   return null;
// };

/**
 * @description A class to handle core app logic and dispatch work to other classes.
 *
 * @class
 * @name App
 *
 * @constructor
 *
 * @property shouldTerminate A boolean that tells us whether or not the GUI should remain open
 * at the end of the plugin’s current task.
 * @property terminatePlugin A convenience function for properly shutting down the plugin.
 */
export default class App {
  shouldTerminate: boolean;
  terminatePlugin: Function;

  constructor({
    shouldTerminate,
    terminatePlugin,
  }) {
    this.shouldTerminate = shouldTerminate;
    this.terminatePlugin = terminatePlugin;
  }

  /**
   * @description Resets the plugin GUI back to the original state or closes it entirely,
   * terminating the plugin.
   *
   * @kind function
   * @name closeOrReset
   *
   * @returns {null}
   */
  closeOrReset() {
    if (this.shouldTerminate) {
      return this.terminatePlugin();
    }

    return null;
  }

  /**
   * @description Takes a selection and invokes Painter’s `detachInstanceRecursive` to
   * detach the top-level component instance and any child instances from their main components.
   *
   * @kind function
   * @name detachInstances
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   *
   * @returns {null}
   */
  detachInstances(sessionKey: number) {
    const { messenger, selection } = assemble(figma);
    const nodes: Array<SceneNode> = selection;
    const resultsArray = [];

    // handle empty selections
    if (selection.length === 0) {
      messenger.toast('🤔 An instance of a component must be selected');
      return this.closeOrReset();
    }

    // iterate selected nodes and detach found instances
    nodes.forEach((node) => {
      const painter = new Painter({ node, sessionKey });
      const detachResult = painter.detachInstanceRecursive();

      messenger.handleResult(detachResult);
      resultsArray.push(detachResult.status);
    });

    // provide toast feedback based on results
    let toastMsg = null;
    if (!resultsArray.includes('error')) {
      toastMsg = 'All instances were detached! 🥳';
    }

    if (!toastMsg && (selection.length === 1)) {
      toastMsg = '🤔 The selected layer needs to be an instance of a component';
    }

    if (!toastMsg && resultsArray.includes('success')) {
      toastMsg = 'Instances were detached! 🥳';
    }

    if (!toastMsg) {
      toastMsg = 'Something went wrong… 😢';
    }

    messenger.toast(toastMsg);
    return this.closeOrReset();
  }

  /** WIP
   * @description Resets the plugin GUI back to the original state or closes it entirely,
   * terminating the plugin.
   *
   * @kind function
   * @name handleUpdate
   *
   * @returns {null}
   */
  handleUpdate(payload, sessionKey: number) {
    const { messenger, selection } = assemble(figma);
    const { updatedItem, itemIds } = payload;

    if (this.shouldTerminate) {
      return this.terminatePlugin();
    }

    // set up the Editor class to manipulate the selection
    const nodes: Array<SceneNode> = new Crawler({ for: selection }).all();
    const editor = new Editor({ for: nodes, sessionKey });

    // commit the updates
    let updateResult = null;
    if (itemIds) {
      updateResult = editor.updateBulk(updatedItem, itemIds);
    } else {
      updateResult = editor.update(updatedItem);
    }

    // display the message and terminate the plugin
    messenger.handleResult(updateResult);

    if (updateResult.status === 'success') {
      App.refreshGUI(sessionKey);
    }
    return this.closeOrReset();
  }

  /** WIP
   * @description Takes a selection and invokes Painter’s `detachInstanceRecursive` to
   * detach the top-level component instance and any child instances from their main components.
   *
   * @kind function
   * @name inheritDescription
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   *
   * @returns {null}
   */
  inheritDescription(sessionKey: number) {
    const { messenger, selection } = assemble(figma);
    const nodes: Array<SceneNode> = selection;
    const resultsArray = [];

    // handle empty selections
    if (selection.length === 0) {
      messenger.toast('🤔 A main component must be selected');
      return this.closeOrReset();
    }

    // iterate selected nodes and inherit parent descriptions
    nodes.forEach((node) => {
      const painter = new Painter({ node, sessionKey });
      const inheritDescriptionResult = painter.inheritParentDescription();

      messenger.handleResult(inheritDescriptionResult);
      resultsArray.push(inheritDescriptionResult.status);
    });

    // provide toast feedback based on results
    let toastMsg = null;
    if (!resultsArray.includes('error')) {
      toastMsg = 'All descriptions were inherited! 🥳';
    }

    if (!toastMsg && (selection.length === 1)) {
      toastMsg = '🤔 The selected layer needs to be a component';
    }

    if (!toastMsg && resultsArray.includes('success')) {
      toastMsg = 'Descriptions were inherited! 🥳';
    }

    if (!toastMsg) {
      toastMsg = 'Something went wrong… 😢';
    }

    messenger.toast(toastMsg);
    return this.closeOrReset();
  }

  /**
   * @description Triggers a UI refresh with the current selection.
   *
   * @kind function
   * @name refreshGUI
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   */
  static async refreshGUI(sessionKey: number) {
    const { messenger, selection } = assemble(figma);

    // set default filter
    const filters: {
      newFilter?: string,
      newIsSelection: boolean,
      newIsStyles: boolean,
    } = {
      newFilter: null,
      newIsSelection: true,
      newIsStyles: true,
    };

    // set up initial selection and Presenter class
    const nodes: Array<SceneNode> = new Crawler({ for: selection }).all();
    const presenter = new Presenter({ for: nodes });

    // get last-used filters from options
    const lastUsedOptions: {
      isSelection: boolean,
      isStyles: boolean,
      filter: string,
    } = await figma.clientStorage.getAsync(DATA_KEYS.options);

    if (lastUsedOptions) {
      // update filters with existing options from storage
      Object.keys(filters).forEach((key) => {
        let optionKey = key.replace('new', '');
        optionKey = `${optionKey.charAt(0).toLowerCase()}${optionKey.slice(1)}`;
        if (lastUsedOptions[optionKey] !== undefined) {
          filters[key] = lastUsedOptions[optionKey];
        }
      });
    }

    // set up selection based on filters
    let selected = null;
    if (filters.newIsStyles) {
      let filter: 'typography' | 'color-fill' | 'effects' | 'grid' = null;
      if (filters.newFilter !== 'all-styles') {
        filter = filters.newFilter as 'typography' | 'color-fill' | 'effects' | 'grid';
      }
      selected = presenter.extractStyles(filter, filters.newIsSelection);
    } else {
      selected = presenter.extractComponents(null);
    }

    // resize the UI based on selection
    let newGUIHeight = GUI_SETTINGS.default.height;
    if (selected && selected.items && selected.items.length > 0) {
      const itemTypeHeight = 33;
      const groupHeight = 49;
      newGUIHeight = 80 + 31;
      newGUIHeight += selected.items.length * itemTypeHeight;
      if (filters.newIsStyles) {
        newGUIHeight += selected.types.length * itemTypeHeight;
      }
      newGUIHeight += selected.groups.length * groupHeight;
    }

    // send the updates to the UI
    figma.ui.postMessage({
      action: 'refreshState',
      payload: {
        filters,
        selected,
        sessionKey,
        guiStartSize: newGUIHeight,
      },
    });

    figma.ui.resize(
      GUI_SETTINGS.default.width,
      newGUIHeight,
    );

    messenger.log(`Updating the UI with ${nodes.length} selected ${nodes.length === 1 ? 'node' : 'nodes'}`);
  }

  /** WIP
   * @description Triggers a UI refresh with the current selection.
   *
   * @kind function
   * @name resizeGUI
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   */
  static async resizeGUI(
    payload: { bodyHeight: number },
  ) {
    const { bodyHeight } = payload;
    const newGUIHeight = bodyHeight + 40; // add floating footer height

    if (bodyHeight) {
      figma.ui.resize(
        GUI_SETTINGS.default.width,
        newGUIHeight,
      );
    }
  }

  /** WIP
   * @description Triggers a UI refresh with the current selection.
   *
   * @kind function
   * @name setFilters
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   */
  static async setFilters(
    filters: {
      newFilter?: string,
      newIsSelection: boolean,
      newIsStyles: boolean,
    },
    sessionKey: number,
  ) {
    // save filters into options for re-use
    const options = {
      isSelection: filters.newIsSelection,
      isStyles: filters.newIsStyles,
      filter: filters.newFilter,
    };
    await figma.clientStorage.setAsync(DATA_KEYS.options, options);

    App.refreshGUI(sessionKey);
  }

  /**
   * @description Triggers a UI refresh and then displays the plugin UI.
   *
   * @kind function
   * @name showToolbar
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   */
  static async showToolbar(sessionKey: number) {
    const { messenger } = assemble(figma);

    await App.refreshGUI(sessionKey);
    App.showGUI({ messenger });
  }

  /**
   * @description Displays the plugin GUI within Figma.
   *
   * @kind function
   * @name showGUI
   *
   * @param {Object} options Can include `size` calling one of the UI sizes defined
   * in GUI_SETTINGS  and/or an initialized instance of the Messenger class for
   * logging (`messenger`). Both are optional.
   *
   * @returns {null}
   */
  static async showGUI(options: {
    size?: 'default' | 'info',
    messenger?: { log: Function },
  }) {
    const { size, messenger } = options;

    if (messenger) {
      const displayMessage: string = size ? ` at size: ${size}` : '';
      messenger.log(`Display GUI${displayMessage}`);
    }

    // set UI panel size
    if (size) {
      resizeGUI(size, figma.ui);
    }

    // show UI
    figma.ui.show();

    return null;
  }
}
