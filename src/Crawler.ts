import { CONTAINER_NODE_TYPES } from './constants';

/**
 * @description A class to handle traversing an array of selected items and return useful items
 * (child nodes, first in selection, node position, dimensions and position of node gaps
 * and overlapping node negative space).
 *
 * @class
 * @name Crawler
 *
 * @constructor
 *
 * @property selectionArray The array of selected items.
 */
export default class Crawler {
  array: Array<SceneNode>;
  constructor({ for: selectionArray }) {
    this.array = selectionArray;
  }

  /**
   * @description Returns the first item in the array.
   *
   * @kind function
   * @name first
   * @returns {Object} The first node item in the array.
   */
  first() {
    return this.array[0];
  }

  /**
   * @description Looks into the selection array for any groups and pulls out individual nodes,
   * effectively flattening the selection.
   *
   * @kind function
   * @name all
   *
   * @returns {Object} All items (including children) individual in an updated array.
   */
  all() {
    const initialSelection = this.array;
    const flatSelection = [];

    // iterate through initial selection
    initialSelection.forEach((node: any) => {
      if (
        node.type !== CONTAINER_NODE_TYPES.group
        && node.type !== CONTAINER_NODE_TYPES.frame
        && node.type !== CONTAINER_NODE_TYPES.component
        && node.type !== CONTAINER_NODE_TYPES.instance
        && node.visible
        && !node.locked
      ) {
        // non-frame or -group nodes get added to the final selection
        flatSelection.push(node);
      } else {
        // +++ frames and groups are checked for child nodes

        // set initial holding array and add first level of children
        let innerLayers = [];
        if (node.visible && !node.locked) {
          node.children.forEach((child) => {
            if (child.visible && !node.locked) {
              innerLayers.push(child);
            }
          });
        }

        /**
         * @description Iterates through `innerLayers`, adding normal nodes to the `flatSelection`
         * array, while adding any additional children nodes into the `innerLayers` array.
         *
         * @kind function
         * @name iterateKnownChildren
         * @returns {null}
         *
         * @private
         */
        const iterateKnownChildren = (): void => {
          // iterate through known child nodes in `innerLayers`,
          // adding more children to the array as they are found in descendent nodes
          innerLayers.forEach((
            innerLayer: {
              children: any,
              id: string,
              type: string,
              visible: boolean,
              locked: boolean,
            },
          ) => {
            if (
              innerLayer.type !== CONTAINER_NODE_TYPES.group
              && innerLayer.type !== CONTAINER_NODE_TYPES.frame
              && innerLayer.type !== CONTAINER_NODE_TYPES.component
              && innerLayer.type !== CONTAINER_NODE_TYPES.instance
              && innerLayer.visible
              && !innerLayer.locked
            ) {
              // non-frame or -group nodes get added to the final selection
              flatSelection.push(innerLayer);
            } else if (innerLayer.visible && !innerLayer.locked) {
              innerLayer.children.forEach((child) => {
                if (child.visible && !child.locked) {
                  innerLayers.push(child);
                }
              });
            }

            // update the overall list of child nodes, removing the node that was just examined.
            // this array should eventually be empty, breaking the `while` loop
            const innerLayerIndex = innerLayers.findIndex(
              foundInnerLayer => (foundInnerLayer.id === innerLayer.id),
            );
            innerLayers = [
              ...innerLayers.slice(0, innerLayerIndex),
              ...innerLayers.slice(innerLayerIndex + 1),
            ];
          });

          return null;
        };

        // loop through the `innerLayers` array as long as it is not empty
        while (innerLayers.length > 0) {
          iterateKnownChildren();
        }
      }
    });

    return flatSelection;
  }

  /**
   * @description Looks into the selection array for any groups and pulls out individual nodes,
   * effectively flattening the selection.
   *
   * @kind function
   * @name allSorted
   *
   * @returns {Object} All items (including children) individual in an updated array.
   */
  allSorted() {
    // start with flattened selection of all nodes
    const nodes = this.all();

    // sort by `y` position and then `x` if `y` values are equal
    const sortByPosition = (nodeA, nodeB) => {
      const aPos = { x: nodeA.absoluteTransform[0][2], y: nodeA.absoluteTransform[1][2] };
      const bPos = { x: nodeB.absoluteTransform[0][2], y: nodeB.absoluteTransform[1][2] };

      if (aPos.y === bPos.y) {
        return aPos.x - bPos.x;
      }
      return aPos.y - bPos.y;
    };

    const sortedLayers = nodes.sort(sortByPosition);
    return sortedLayers;
  }

  /**
   * @description Looks into the selection array for any groups and pulls out
   * individual TextNode nodes.
   *
   * @kind function
   * @name text
   *
   * @returns {Array} All TextNode items in an array.
   */
  text(): Array<TextNode> {
    // filter and retain immediate text nodes
    const filterTypes: Array<('TEXT')> = ['TEXT'];
    const textNodes: Array<TextNode> = this.filterByTypes(filterTypes);

    return textNodes;
  }

  /**
   * @description Looks into the selection array for any groups and pulls out
   * individual nodes based on the supplied type(s).
   *
   * @kind function
   * @name filterByTypes
   * @param {Array} filterTypes Array of type constants to filter for (inclusive).
   * in the selection.
   *
   * @returns {Array} All TextNode items in an array.
   */
  filterByTypes(
    filterTypes: Array<('ELLIPSE' | 'POLYGON' | 'RECTANGLE' | 'STAR' | 'TEXT')>,
  ): Array<any> {
    // start with flattened selection of all nodes, ordered by position on the artboard
    const nodes = this.allSorted();

    // filter and retain immediate type-matched nodes
    const filteredNodes: Array<
      TextNode
      | EllipseNode
      | PolygonNode
      | RectangleNode
      | StarNode
    > = nodes.filter(
      node => filterTypes.includes(node.type),
    );

    // iterate through components to find additional type-matched nodes
    const componentNodes: Array<ComponentNode | InstanceNode> = nodes.filter(
      node => (
        (node.type === 'COMPONENT' || node.type === 'INSTANCE') && node.visible && !node.locked
      ),
    );
    if (componentNodes) {
      componentNodes.forEach((componentNode: ComponentNode | InstanceNode) => {
        // find type-matched node inside components
        const innerTextNodesUntyped: any = componentNode.findAll(
          (node: any) => filterTypes.includes(node.type),
        );
        const innerTextNodes: Array<
          TextNode
          | EllipseNode
          | PolygonNode
          | RectangleNode
          | StarNode
        > = innerTextNodesUntyped.filter(
          node => filterTypes.includes(node.type),
        );

        if (innerTextNodes) {
          // add any type-matched nodes to the overall selection
          innerTextNodes.forEach(innerTextNode => filteredNodes.push(innerTextNode));
        }
      });
    }

    return filteredNodes;
  }
}
