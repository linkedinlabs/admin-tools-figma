import Presenter from './Presenter';

/** WIP
 * @description A class to handle traversing an array of selected items and return useful items
 * (child nodes, first in selection, node position, dimensions and position of node gaps
 * and overlapping node negative space).
 *
 * @class
 * @name Editor
 *
 * @constructor
 *
 * @property selectionArray The item of selected items.
 */
export default class Editor {
  array: Array<BaseNode | BaseStyle>;
  constructor({ for: currentSelection }) {
    this.array = currentSelection;
  }

  /** WIP
   * @description Looks into the selection array for any groups and pulls out individual nodes,
   * effectively flattening the selection.
   *
   * @kind function
   * @name update
   *
   * @returns {Object} All items (including children) individual in an updated array.
   */
  update(updatedItem) {
    const result: {
      status: 'error' | 'success',
      messages: {
        toast: string,
        log: string,
      },
    } = {
      status: null,
      messages: {
        toast: null,
        log: null,
      },
    };

    // grab existing style presentation object for comparison
    const selectIndex = 0;
    const presenter = new Presenter({ for: this.array });
    const existingItems = presenter.extractStyles();
    const existingItem = existingItems.filter(item => item.id === updatedItem.id)[selectIndex];

    // kick out if we can't find a match
    if (!existingItem) {
      result.status = 'error';
      result.messages.log = `Could not find ${updatedItem.id} in selection`;
      return result;
    }

    // grab the Figma `BaseStyle` for updating
    const baseStyle: BaseStyle = figma.getStyleById(existingItem.id);

    // kick out if we can't find a match
    if (!baseStyle) {
      result.status = 'error';
      result.messages.log = `Could not find ${updatedItem.id} in document`;
      return result;
    }

    // console.log(existingItem);
    // console.log(updatedItem);

    // iterate the presentation objects, locating changes
    Object.entries(updatedItem).forEach(([key, value]) => {
      if (existingItem[key] && existingItem[key] !== value) {
        switch (key) {
          case 'name':
          case 'group': {
            const updatedName = `${updatedItem.group} / ${updatedItem.name}`;
            baseStyle.name = updatedName;
            break;
          }
          default: {
            if (baseStyle[key]) {
              baseStyle[key] = value;
            }
          }
        }
      }
    });

    // return a successful result
    result.status = 'success';
    result.messages.log = `Item ${updatedItem.id} updated`;
    return result;
  }
}
