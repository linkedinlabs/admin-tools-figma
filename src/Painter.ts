/**
 * @description A class to add elements directly onto Figma file frames.
 *
 * @class
 * @name Painter
 *
 * @constructor
 *
 * @property node The TextNode in the Figma file that we want to modify.
 * @property sessionKey The current session identifier.
 */
export default class Painter {
  node: SceneNode;
  sessionKey: number;
  constructor({ node, sessionKey }) {
    this.node = node;
    this.sessionKey = sessionKey;
  }

  /**
   * @description Takes an `InstanceNode` and detaches it (and ALL children) from any linked
   * main components (`ComponentNode`. The high-level instance is recreated as a frame, and
   * then all children get cloned and inserted into the instance.
   *
   * @kind function
   * @name detachInstanceRecursive
   *
   * @returns {Object} A result object container success/error status and log/toast messages.
   */
  detachInstanceRecursive() {
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

    const cloneInstanceIntoFrame = (
      newNode: FrameNode,
      sourceNode: any, // type to `any` for more flexibility while cloning
    ) => {
      // iterate over the full object and set writeable values
      const protoObject = Object.getPrototypeOf(sourceNode);
      Object.keys(protoObject).forEach((key: string) => {
        switch (key) {
          case 'id':
          case 'parent':
          case 'removed':
          case 'absoluteTransform':
          case 'width':
          case 'height':
          case 'children':
          case 'overlayPositionType':
          case 'overlayBackground':
          case 'overlayBackgroundInteraction':
          case 'mainComponent':
          case 'scaleFactor':
          case 'reactions':
          case 'type':
            // not writeable; do nothing
            break;
          default: {
            const value: any = sourceNode[key];
            newNode[key] = value; // eslint-disable-line no-param-reassign
          }
        }
      });

      // set things that cannot be directly copied
      newNode.resizeWithoutConstraints(sourceNode.width, sourceNode.height);

      // insert new frame at the correct index
      const sourceIndex = sourceNode.parent.children.indexOf(sourceNode);
      sourceNode.parent.insertChild((sourceIndex + 1), newNode);

      // re-add children
      // mysteriously, this actually detaches any childen instances, eliminating the
      // need for a recursive function
      sourceNode.children.forEach((childNode) => {
        const clonedNode: SceneNode = childNode.clone();
        newNode.appendChild(clonedNode);
      });

      return newNode;
    };

    // set node as instance
    const instanceNode: InstanceNode = this.node as InstanceNode;

    // if the node is not an instance, return with error
    if (!instanceNode.mainComponent) {
      result.status = 'error';
      result.messages.log = `Layer ${this.node.id} is not an instance`;
      return result;
    }

    // “detach” the node by cloning and re-framing
    let newFrame: FrameNode = figma.createFrame();

    // clone the instance
    newFrame = cloneInstanceIntoFrame(newFrame, instanceNode);

    if (newFrame) {
      instanceNode.remove();

      // return a successful result
      result.status = 'success';
      result.messages.log = `Layer ${this.node.id} detached from all components and cloned as ${newFrame.id}`;
      return result;
    }

    result.status = 'error';
    result.messages.log = `Layer ${this.node.id} was not detached`;
    return result;
  }

  /**
   * @description Takes a wrapped `ComponentNode` (component wrapped around an instance of another
   * component) reads the key (`name` or `description`) from the main component of the wrapped
   * instance and applies it to the outer component.
   *
   * @kind function
   * @name inheritParentItem
   *
   * @returns {Object} A result object container success/error status and log/toast messages.
   */
  inheritParentItem(key: 'description' | 'name' = 'description') {
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

    // set node as component
    const componentNode: ComponentNode = this.node as ComponentNode;

    // if the node is not an instance, return with error
    if (componentNode.type !== 'COMPONENT') {
      result.status = 'error';
      result.messages.log = `Layer ${this.node.id} is not a component`;
      return result;
    }

    const firstChildNodeIndex = 0;
    const childInstanceNode: InstanceNode = componentNode.children[
      firstChildNodeIndex] as InstanceNode;

    if (
      childInstanceNode.type !== 'INSTANCE'
      || !childInstanceNode.mainComponent
    ) {
      result.status = 'error';
      result.messages.log = `Layer ${this.node.id} is not a wrapped component`;
      return result;
    }

    if (childInstanceNode) {
      const { mainComponent }: { mainComponent: ComponentNode } = childInstanceNode;
      const itemToInherit: string = mainComponent[key];

      componentNode[key] = itemToInherit; // eslint-disable-line no-param-reassign

      // return a successful result
      result.status = 'success';
      result.messages.log = `Layer ${this.node.id} ${key} inherited from ${childInstanceNode.mainComponent.id}`;
      return result;
    }

    result.status = 'error';
    result.messages.log = `Layer ${this.node.id} could not inherit a ${key}`;
    return result;
  }
}
