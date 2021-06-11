import Crawler from './Crawler';
import Editor from './Editor';
import Painter from './Painter';
import Presenter from './Presenter';
import Messenger from './Messenger';
import { parseStyleValue, resizeGUI } from './Tools';
import { DATA_KEYS, GUI_SETTINGS } from './constants';

/**
 * A shared helper function to set up in-UI messages and the logger.
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
//  * Triggers Figma’s change watcher by randomly re-naming a node and then returning
//  * it to it’s original name. This is used in the context of applying new data to a main
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
//   // this is used to allow main components to be republished with changes
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
 * Retrieves the current options saved to `clientStorage`. If none exist,
 * defaults are set.
 *
 * @kind function
 * @name getOptions
 *
 * @returns {Object} Returns the options (currently `currentView` and `isMercadoMode`).
 */
const getOptions = async (): Promise<PluginOptions> => {
  // set default options
  let options: PluginOptions = {
    isSelection: true,
    isStyles: true,
    filter: null,
    currentView: 'general',
  };

  // retrieve last used, and use if they exist
  const lastUsedOptions: PluginOptions = await figma.clientStorage.getAsync(DATA_KEYS.options);
  if (lastUsedOptions) {
    options = lastUsedOptions;
  }

  // check for defaults
  const { currentView }: { currentView: PluginViewTypes } = options;

  if (!currentView) {
    options.currentView = 'general';
  }

  return options;
};

/**
 * Invokes Figma’s `setRelaunchData` on the passed node and (if applicable),
 * the container component node.
 *
 * @kind function
 * @name setRelaunchCommands
 *
 * @returns {null}
 */
const setRelaunchCommands = (): void => {
  // add “Open Stapler” to page
  figma.currentPage.parent.setRelaunchData({
    tools: '',
  });

  return null;
};

/**
 * A class to handle core app logic and dispatch work to other classes.
 *
 * @class
 * @name App
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
   * Resets the plugin GUI back to the original state or closes it entirely,
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
   * Takes a selection and invokes Painter’s `detachInstanceRecursive` to
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

  /**
   * Takes a selection and selects any hidden layers within.
   *
   * @kind function
   * @name selectHiddenLayers
   *
   * @returns {null}
   */
  selectHiddenLayers() {
    const { messenger, selection } = assemble(figma);

    // handle empty selections
    if (!selection.length) {
      messenger.toast('Error: One or more layers must be selected.');
      return this.closeOrReset();
    }

    const hiddenLayers = selection.reduce((layers, item) => {
      if (!item.visible) {
        layers.push(item);
      }
      const hiddenChildren = item.findAll((layer) => !layer.visible);
      return layers.concat(hiddenChildren);
    }, []);

    if (hiddenLayers.length) {
      figma.currentPage.selection = hiddenLayers;
      messenger.toast(`Success! ${hiddenLayers.length} hidden layers selected.`);
    } else {
      messenger.toast('There are no hidden layers within your selection.');
    }

    return this.closeOrReset();
  }

  /**
   * Takes a payload with `updatedItem` (edited item params) and `itemIds` (the
   * IDs of items to edit) and passes the params into the Editor class.
   *
   * @kind function
   * @name handleUpdate
   *
   * @param {Object} payload An object containing `updatedItem` (edited item params) and
   * `itemIds` (the IDs of items to edit.
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
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

    // add the relaunch button
    setRelaunchCommands();

    return this.closeOrReset();
  }

  /**
   * Takes a selection of `ComponentNode`(s) and, assuming they are wrapped
   * components (a frame wrapped around an `InstanceNode`), pulls the description from
   * the lower-level instance and applies it to the top-level component. Any status
   * messages are logged and displayed with toast messages in the Figma UI.
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
      const inheritDescriptionResult = painter.inheritParentItem('description');

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
   * Takes a selection of `ComponentNode`(s) and, assuming they are wrapped
   * components (a frame wrapped around an `InstanceNode`), pulls the name from
   * the lower-level instance and applies it to the top-level component. Any status
   * messages are logged and displayed with toast messages in the Figma UI.
   *
   * @kind function
   * @name inheritName
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   *
   * @returns {null}
   */
  inheritName(sessionKey: number) {
    const { messenger, selection } = assemble(figma);
    const nodes: Array<SceneNode> = selection;
    const resultsArray = [];

    // handle empty selections
    if (selection.length === 0) {
      messenger.toast('🤔 A main component must be selected');
      return this.closeOrReset();
    }

    // iterate selected nodes and inherit parent names
    nodes.forEach((node) => {
      const painter = new Painter({ node, sessionKey });
      const inheritNameResult = painter.inheritParentItem('name');

      messenger.handleResult(inheritNameResult);
      resultsArray.push(inheritNameResult.status);
    });

    // provide toast feedback based on results
    let toastMsg = null;
    if (!resultsArray.includes('error')) {
      toastMsg = 'All names were inherited! 🥳';
    }

    if (!toastMsg && (selection.length === 1)) {
      toastMsg = '🤔 The selected layer needs to be a component';
    }

    if (!toastMsg && resultsArray.includes('success')) {
      toastMsg = 'Names were inherited! 🥳';
    }

    if (!toastMsg) {
      toastMsg = 'Something went wrong… 😢';
    }

    messenger.toast(toastMsg);
    return this.closeOrReset();
  }

  /**
   * Triggers a UI refresh with the current selection.
   *
   * @kind function
   * @name refreshGUI
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   */
  static async refreshGUI(sessionKey: number) {
    const { messenger, selection } = assemble(figma);

    // retrieve existing options
    const options: PluginOptions = await getOptions();
    const { currentView } = options;

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

    if (options) {
      // update filters with existing options from storage
      Object.keys(filters).forEach((key) => {
        let optionKey = key.replace('new', '');
        optionKey = `${optionKey.charAt(0).toLowerCase()}${optionKey.slice(1)}`;
        if (options[optionKey] !== undefined) {
          filters[key] = options[optionKey];
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
      selected = presenter.extractComponents();
    }

    // set UI size based on selection
    let newGUIHeight = GUI_SETTINGS.default.height;
    if (currentView === 'general') {
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
    } else {
      newGUIHeight = GUI_SETTINGS.tokenImport.height;
    }

    // send the updates to the UI
    figma.ui.postMessage({
      action: 'refreshState',
      payload: {
        currentView: options.currentView,
        filters,
        selected,
        sessionKey,
        guiStartSize: newGUIHeight,
      },
    });

    // resize UI, if necessary
    if (currentView === 'general') {
      figma.ui.resize(
        GUI_SETTINGS.default.width,
        newGUIHeight,
      );
      messenger.log(`Updating the UI with ${nodes.length} selected ${nodes.length === 1 ? 'node' : 'nodes'}`);
    } else {
      messenger.log('Updating the UI with Token Import');
    }
  }

  /**
   * Resizes the plugin UI based on either a default, or a provided
   * `bodyHeight` in the `payload` object. The object is sent from the UI thread.
   *
   * @kind function
   * @name resizeGUI
   *
   * @param {Object} payload Should contain `bodyHeight` as the height of the current
   * contents calculated in the UI.
   * @param {number} payload.bodyHeight The height (in points) of the current contents calculated
   * in the UI thread.
   *
   * @returns {Promise} Returns a promise for resolution.
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

  /**
   * Sets new filter options to `clientStorage` and then triggers a UI refresh.
   * The saved options are used in the refresh to filter content.
   *
   * @kind function
   * @name setFilters
   *
   * @param {Object} filters An object with filters to show/hide elements in the UI. Options
   * include `newIsStyles` (whether or not the UI should be editing styles or components),
   * `newIsSelection` (whether or not the UI is watching a selection or loading all available)
   * styles, and `newFilter` (an optional filter to set).
   * @param {string} filters.newFilter An optional filter to set.
   * @param {boolean} filters.newIsSelection Whether or not the UI is watching a selection
   * or loading all available.
   * @param {boolean} filters.newIsStyles Whether or not the UI should be editing styles
   * or components.
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
   * Triggers a UI refresh and then displays the General plugin UI.
   *
   * @kind function
   * @name showToolbar
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   */
  static async showToolbar(sessionKey: number) {
    const { messenger } = assemble(figma);

    // retrieve existing options
    const options: PluginOptions = await getOptions();

    // set new view without changing other options
    options.currentView = 'general';

    // save new options to storage
    await figma.clientStorage.setAsync(DATA_KEYS.options, options);

    // setup the UI
    await App.refreshGUI(sessionKey);
    App.showGUI({ messenger });
  }

  /**
   * Triggers a UI refresh and then displays the Token Import UI.
   *
   * @kind function
   * @name showTokenImport
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   */
  static async showTokenImport(sessionKey: number) {
    const { messenger } = assemble(figma);

    // retrieve existing options
    const options: PluginOptions = await getOptions();

    // set new view without changing other options
    options.currentView = 'token-import';

    // save new options to storage
    await figma.clientStorage.setAsync(DATA_KEYS.options, options);

    // setup the UI
    await App.refreshGUI(sessionKey);
    App.showGUI({
      size: 'tokenImport',
      messenger,
    });
  }

  /**
   * Parses CSV list of style names and values and creates corresponding Figma
   * paint styles in the file.
   *
   * @kind function
   * @name createPaintStyles
   * @param {string} styles The unprocessed string of style names and values,
   * in CSV format.
   *
   * @returns {null}
   */
  static createPaintStyles(styles) {
    // quick & dirty CSV parsing - no special parsing
    const CSVToArray = (strData) => strData.split('\n').map((line) => {
      // since token names won't have commas but values might, split only on the first comma
      const [first, ...rest] = line.split(',');
      const second = rest.join(',');
      return [first, second];
    });

    const { messenger } = assemble(figma);

    // parse CSV & remove header row
    const parsedValues = CSVToArray(styles).slice(1);

    parsedValues.forEach((style) => {
      const [styleName, styleValue] = style;
      const parsedStyleValue: RGBA = parseStyleValue(styleValue);

      const figmaPaintStyle: PaintStyle = figma.createPaintStyle();
      figmaPaintStyle.name = styleName;

      const styleColor: RGB = {
        r: parsedStyleValue.r,
        g: parsedStyleValue.g,
        b: parsedStyleValue.b,
      };

      const opacity = (typeof parsedStyleValue.a === 'number') ? parsedStyleValue.a : 1;
      const solidPaint: SolidPaint = {
        type: 'SOLID',
        color: styleColor,
        opacity,
      };

      figmaPaintStyle.paints = [solidPaint];
    });

    messenger.toast(`${parsedValues.length} color styles updated.`);

    return null;
  }

  /**
   * Displays the plugin GUI within Figma.
   *
   * @kind function
   * @name showGUI
   *
   * @param {Object} options Can include `size` calling one of the UI sizes defined
   * in GUI_SETTINGS and/or an initialized instance of the Messenger class for
   * logging (`messenger`). Both are optional.
   * @param {string} options.size An optional string calling one of the UI sizes
   * defined in GUI_SETTINGS (currently `default` or `info`).
   * @param {Object} options.messenger An optional initialized instance of the Messenger class.
   * @param {Function} options.messenger.log The log function from the Messenger class.
   *
   * @returns {null}
   */
  static async showGUI(options: {
    size?:
      'default'
      | 'info'
      | 'tokenImport',
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
