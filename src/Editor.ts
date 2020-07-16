import Presenter from './Presenter';
import { getPeerPluginData, setPeerPluginData } from './Tools';
import { CONTAINER_NODE_TYPES } from './constants';

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
  sessionKey: string;

  constructor({ for: currentSelection, sessionKey }) {
    this.array = currentSelection;
    this.sessionKey = sessionKey;
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

    const selectIndex = 0;
    const presenter = new Presenter({ for: this.array });
    let existingItem = null;
    let baseItem: BaseStyle | ComponentNode = null;
    if (updatedItem.type !== CONTAINER_NODE_TYPES.component) {
      // grab existing style presentation object for comparison
      const extractedStyles = presenter.extractStyles();
      existingItem = extractedStyles.items.filter(
        item => item.id === updatedItem.id,
      )[selectIndex];

      // kick out if we can't find a match
      if (!existingItem) {
        result.status = 'error';
        result.messages.log = `Could not find ${updatedItem.id} in selection`;
        return result;
      }

      // grab the Figma `BaseStyle` for updating
      baseItem = figma.getStyleById(existingItem.id) as BaseStyle;
    } else {
      // grab existing component presentation object for comparison
      const extractedComponents = presenter.extractComponents();
      existingItem = extractedComponents.items.filter(
        item => item.id === updatedItem.id,
      )[selectIndex];

      // kick out if we can't find a match
      if (!existingItem) {
        result.status = 'error';
        result.messages.log = `Could not find ${updatedItem.id} in selection`;
        return result;
      }

      // grab the Figma `ComponentNode` for updating
      baseItem = figma.getNodeById(existingItem.id) as ComponentNode;

      // overwrite existing plugin data
      setPeerPluginData(
        baseItem,
        updatedItem.componentData,
        'specter',
      );
    }

    // kick out if we can't find a match
    if (!baseItem) {
      result.status = 'error';
      result.messages.log = `Could not find ${updatedItem.id} in document`;
      return result;
    }

    // iterate the presentation objects, locating changes
    Object.entries(updatedItem).forEach(([key, value]) => {
      if (
        (existingItem[key] !== undefined)
        && (existingItem[key] !== value)
      ) {
        switch (key) {
          case 'name':
          case 'group': {
            let updatedName = updatedItem.name;
            if (updatedItem.group) {
              updatedName = `${updatedItem.group} / ${updatedItem.name}`;
            }
            baseItem.name = updatedName;
            break;
          }
          default: {
            if (baseItem[key] !== undefined) {
              baseItem[key] = value;
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

    const presenter = new Presenter({ for: this.array });
    const existingItems = [];
    const baseItems: Array<BaseStyle | ComponentNode> = [];
    if (updatedItem.type !== CONTAINER_NODE_TYPES.component) {
      // grab existing style presentation objects for comparison
      const extractedStyles = presenter.extractStyles();
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
      existingItems.forEach((item) => {
        const baseStyle = figma.getStyleById(item.id) as BaseStyle;
        if (baseStyle) {
          baseItems.push(baseStyle);
        }
      });
    } else {
      // grab existing component presentation objects for comparison
      const extractedComponents = presenter.extractComponents();
      extractedComponents.items.forEach((item) => {
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

      // grab the Figma `ComponentNode` for updating
      existingItems.forEach((item) => {
        const componentNode = figma.getNodeById(item.id) as ComponentNode;
        if (componentNode) {
          baseItems.push(componentNode);
        }
      });
    }

    // kick out if we can't find matches
    if (baseItems.length < 1) {
      result.status = 'error';
      result.messages.log = 'Could not find matching items in document';
      return result;
    }

    // iterate the presentation objects, locating changes
    Object.entries(updatedItem).forEach(([key, value]) => {
      if (value) {
        existingItems.forEach((existingItem) => {
          const selectIndex = 0;
          const baseItem = baseItems.filter(
            styleOrNode => styleOrNode.id === existingItem.id,
          )[selectIndex];
          if (
            baseItem
            && existingItem[key] !== undefined
            && existingItem[key] !== value
          ) {
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
                baseItem.name = updatedName;
                break;
              }
              case 'description': {
                const updatedDescriptionArray = parseDescription(updatedItem.description);
                let existingDescriptionArray = parseDescription(existingItem.description);

                updatedDescriptionArray.forEach((updatedDescriptionItem) => {
                  if (updatedDescriptionItem.value) {
                    const existingIndex = existingDescriptionArray.findIndex(
                      existing => existing.key === updatedDescriptionItem.key,
                    );

                    if (existingIndex > -1) {
                      if (updatedDescriptionItem.value === `remove-${this.sessionKey}`) {
                        // remove it
                        existingDescriptionArray = [
                          ...existingDescriptionArray.slice(0, existingIndex),
                          ...existingDescriptionArray.slice(existingIndex + 1),
                        ];
                      } else {
                        existingDescriptionArray[
                          existingIndex].value = updatedDescriptionItem.value;
                      }
                    } else if (updatedDescriptionItem.value !== `remove-${this.sessionKey}`) {
                      existingDescriptionArray.push(updatedDescriptionItem);
                    }
                  }
                });

                const updatedDescription = compileDescription(existingDescriptionArray);
                baseItem.description = updatedDescription;
                break;
              }
              case 'componentData': {
                const existingComponentData: PresenterComponentData = getPeerPluginData(
                  baseItem as ComponentNode,
                  'specter',
                );

                Object.entries(value).forEach(([innerKey, innerValue]) => {
                  if (
                    (!innerKey.includes('HasValues'))
                    && (innerValue !== 'blank--multiple')
                    && (innerValue !== null)
                    && (existingComponentData[innerKey] !== innerValue)
                  ) {
                    existingComponentData[innerKey] = innerValue;
                  }
                });

                if (existingComponentData) {
                  setPeerPluginData(
                    baseItem as ComponentNode,
                    existingComponentData,
                    'specter',
                  );
                }
                break;
              }
              case 'id':
              case 'type':
                // ID should never change
                // type should never change
                break;
              default: {
                if (baseItem[key] !== undefined) {
                  baseItem[key] = value;
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
