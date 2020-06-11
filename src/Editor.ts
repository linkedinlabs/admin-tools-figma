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
  item: BaseNode | BaseStyle;
  constructor({ for: itemToUpdate }) {
    this.item = itemToUpdate;
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

    /* eslint-disable no-console */
    console.log('update the thing');
    console.log(this.item);
    console.log(updatedItem);
    /* eslint-enable no-console */

    // return a successful result
    result.status = 'success';
    result.messages.log = `Item ${this.item.id} updated`;
    return result;
  }
}
