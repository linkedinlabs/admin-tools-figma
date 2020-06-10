import Messenger from './Messenger';
import { asyncForEach, resizeGUI } from './Tools';
import { GUI_SETTINGS } from './constants';

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

  /**
   * @description Triggers a UI refresh and then displays the plugin UI.
   *
   * @kind function
   * @name showToolbar
   *
   * @param {string} sessionKey A rotating key used during the single run of the plugin.
   */
  static showToolbar(sessionKey: number) {
    const { messenger } = assemble(figma);

    App.refreshGUI(sessionKey);
    App.showGUI({ messenger });
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
    type TypeName =
      'Effect'
      | 'Grid'
      | 'Typography'
      | 'Color & Fill';

    const nodes: Array<SceneNode> = selection;
    const nodesCount = nodes.length;
    const styleIds = [];

    // set array of data with information from each node
    const selected: Array<{
      id: string,
      description: string,
      isOpen: boolean,
      group: string,
      kind: string,
      locked: boolean,
      name: string,
      type: StyleType,
      typeName: TypeName,
    }> = [];

    await asyncForEach(nodes, async (node) => {
      const {
        effectStyleId,
        fillStyleId,
        gridStyleId,
        strokeStyleId,
        textStyleId,
      } = node;

      if (effectStyleId) { styleIds.push(effectStyleId); }
      if (fillStyleId) { styleIds.push(fillStyleId); }
      if (gridStyleId) { styleIds.push(gridStyleId); }
      if (strokeStyleId) { styleIds.push(strokeStyleId); }
      if (textStyleId) { styleIds.push(textStyleId); }
    });

    const selectedStyles: Array<BaseStyle> = [];
    const uniqueStyleIds: Array<string> = [...new Set(styleIds)];

    // iterate style IDs and load the styles into the `selectedStyles` array
    uniqueStyleIds.forEach((styleId) => {
      const style: BaseStyle = figma.getStyleById(styleId);
      if (style) {
        const { id, description, name } = style;
        const kind: 'style' | 'component' = 'style';
        const { type }: { type: StyleType } = style;

        const nameArray = name.split(' / ');
        let nameGroup: string = null;
        let nameClean: string = name;

        if (nameArray.length > 1) {
          const gIndex: number = 0;
          nameGroup = nameArray[gIndex].trim();

          nameArray.shift();
          nameClean = nameArray.join(' / ');
        }

        let typeName: TypeName = null;

        switch (type) {
          case 'EFFECT':
            typeName = 'Effect';
            break;
          case 'GRID':
            typeName = 'Grid';
            break;
          case 'TEXT':
            typeName = 'Typography';
            break;
          default: // PAINT
            typeName = 'Color & Fill';
        }

        selectedStyles.push(style);

        // update the bundle of info for the current `node` in the selection
        selected.push({
          id,
          description,
          isOpen: false,
          group: nameGroup,
          kind,
          locked: false,
          name: nameClean,
          type,
          typeName,
        });
      }
    });

    // send the updates to the UI
    figma.ui.postMessage({
      action: 'refreshState',
      payload: {
        sessionKey,
        selected,
      },
    });

    // resize the UI
    let newGUIHeight = GUI_SETTINGS.default.height;
    if (nodesCount > 0) {
      newGUIHeight = ((nodesCount - 1) * 62) + newGUIHeight;
    }

    figma.ui.resize(
      GUI_SETTINGS.default.width,
      newGUIHeight,
    );

    messenger.log(`Updating the UI with ${nodes.length} selected ${nodes.length === 1 ? 'layer' : 'layers'}`);
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

    // reset the working state
    const message: {
      action: string,
    } = {
      action: 'resetState',
    };
    figma.ui.postMessage(message);
    return null;
  }
}
