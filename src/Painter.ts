// import { dataNamespace, isTextNode } from './Tools';
import { DATA_KEYS } from './constants';

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
   * @description Locates proposed text in a text node’s Settings object and updates
   * the node’s characters.
   *
   * @kind function
   * @name detachInstance
   *
   * @returns {Object} A result object container success/error status and log/toast messages.
   */
  detachInstance() {
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

    const instanceNode: InstanceNode = this.node as InstanceNode;

    // if the node is not an instance, return with error
    if (!instanceNode.masterComponent) {
      result.status = 'error';
      result.messages.log = `Layer ${this.node.id} is not an instance`;
      return result;
    }

    // “detach” the node by cloning and re-framing
    
    console.log(`detach ${instanceNode.id}: ${instanceNode.name} from ${instanceNode.masterComponent.name}`);

    // return a successful result
    result.status = 'success';
    result.messages.log = `Layer ${this.node.id} detached from all components`;
    return result;
  }
}
