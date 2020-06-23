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
    const extractedStyles = presenter.extractStyles();
    const existingItem = extractedStyles.items.filter(
      item => item.id === updatedItem.id,
    )[selectIndex];

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

  /** WIP
   * @description Looks into the selection array for any groups and pulls out individual nodes,
   * effectively flattening the selection.
   *
   * @kind function
   * @name updateBulk
   *
   * @returns {Object} All items (including children) individual in an updated array.
   */
  updateBulk(updatedItem, itemIds) {
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
    const presenter = new Presenter({ for: this.array });
    const extractedStyles = presenter.extractStyles();
    const existingItems = [];
    extractedStyles.items.forEach((item) => {
      if (itemIds.includes(item.id)) {
        existingItems.push(item);
      }
    });

    // kick out if we can't find a match
    if (existingItems.length < 1) {
      result.status = 'error';
      result.messages.log = 'Could not find matching items in selection';
      return result;
    }

    // grab the Figma `BaseStyle` for updating
    const baseStyles: Array<BaseStyle> = [];
    existingItems.forEach((item) => {
      const baseStyle: BaseStyle = figma.getStyleById(item.id);
      if (baseStyle) {
        baseStyles.push(baseStyle);
      }
    });

    // kick out if we can't find a match
    if (baseStyles.length < 1) {
      result.status = 'error';
      result.messages.log = 'Could not find matching styles in document';
      return result;
    }

    // iterate the presentation objects, locating changes
    Object.entries(updatedItem).forEach(([key, value]) => {
      if (value) {
        existingItems.forEach((existingItem) => {
          const selectIndex = 0;
          const baseStyle = baseStyles.filter(style => style.id === existingItem.id)[selectIndex];
          if (baseStyle && existingItem[key] && existingItem[key] !== value) {
            switch (key) {
              case 'name':
              case 'group': {
                let updatedName = null;
                if (updatedItem.group && updatedItem.name) {
                  updatedName = `${updatedItem.group} / ${updatedItem.name}`;
                } else if (updatedItem.group) {
                  updatedName = `${updatedItem.group} / ${existingItem.name}`;
                } else {
                  updatedName = `${existingItem.group} / ${updatedItem.name}`;
                }
                baseStyle.name = updatedName;
                break;
              }
              case 'id':
                // ID should never change
                break;
              default: {
                if (baseStyle[key]) {
                  baseStyle[key] = value;
                }
              }
            }
          }
        });
      }
    });

    // return a successful result
    result.status = 'success';
    result.messages.log = `Item ${updatedItem.id} updated`;
    return result;
  }
}
