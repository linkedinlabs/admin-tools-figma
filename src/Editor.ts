import Presenter from './Presenter';

/** WIP
 * @description Looks into the selection array for any groups and pulls out individual nodes,
 * effectively flattening the selection.
 *
 * @kind function
 * @name parseDescription
 *
 * @returns {Object} All items (including children) individual in an updated array.
 */
const parseDescription = (currentDescription) => {
  const currentDescriptionArray = [];
  const lineArray = currentDescription.split('\n');

  lineArray.forEach((line) => {
    if (line && line !== '') {
      const keyIndex = 0;
      const valueIndex = 1;
      const split = line.split(/: (.+)/);

      const newKeyValue = {
        key: split[keyIndex].replace(': ', ''),
        value: split[valueIndex] || null,
      };

      if (!currentDescriptionArray.includes(newKeyValue)) {
        let keyExists = false;
        currentDescriptionArray.forEach((keyValue) => {
          if (keyValue.key === newKeyValue.key) {
            keyExists = true;
            if (keyValue.value !== newKeyValue.value) {
              keyValue.value = null; // eslint-disable-line no-param-reassign
            }
          }
        });

        if (!keyExists) {
          currentDescriptionArray.push(newKeyValue);
        }
      }
    }
  });

  return currentDescriptionArray;
};

const compileDescription = (currentDescriptionArray) => {
  let string = null;
  const stringArray = [];
  currentDescriptionArray.forEach((item) => {
    let snippet = `${item.key}: ${item.value}`;
    if (!item.value) {
      snippet = `${item.key}: `;
    }
    stringArray.push(snippet);
  });

  string = stringArray.join('\n');
  return string;
};

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
              case 'description': {
                const updatedDescriptionArray = parseDescription(updatedItem.description);
                const existingDescriptionArray = parseDescription(existingItem.description);

                updatedDescriptionArray.forEach((updatedDescriptionItem) => {
                  if (updatedDescriptionItem.value) {
                    const existingIndex = existingDescriptionArray.findIndex(
                      existing => existing.key === updatedDescriptionItem.key,
                    );

                    if (existingIndex > -1) {
                      existingDescriptionArray[existingIndex].value = updatedDescriptionItem.value;
                    } else {
                      existingDescriptionArray.push(updatedDescriptionItem);
                    }
                  }
                });

                const updatedDescription = compileDescription(existingDescriptionArray);
                baseStyle.description = updatedDescription;
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
