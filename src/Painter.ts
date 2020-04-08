import Messenger from './Messenger';
import { asyncImageRequest, dataNamespace } from './Tools';
import { DATA_KEYS } from './constants';

/**
 * @description Makes an async call to the plugin UI thread to load a remote image,
 * retrieve the image data, and load it into a Figma `Image` object.
 *
 * @kind function
 * @name loadRemoteImage
 *
 * @param {string} remoteUrl The full URL of the image to request.
 *
 * @returns {Object} A result object container success/error status and log/toast messages.
 */
const loadRemoteImage = async (remoteUrl) => {
  const messenger = new Messenger({ for: figma, in: figma.currentPage });

  // load the remote image and extract the data
  const imageData: Uint8Array = await asyncImageRequest({
    requestUrl: remoteUrl,
    messenger,
  });

  // create the image within figma
  const image: Image = await figma.createImage(imageData);
  return image;
};

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
  node: TextNode
    | EllipseNode
    | PolygonNode
    | RectangleNode
    | StarNode;

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
   * @name replaceText
   *
   * @returns {Object} A result object container success/error status and log/toast messages.
   */
  replaceText() {
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

    // load basic node data
    const lockedData = this.node.getSharedPluginData(dataNamespace(), DATA_KEYS.locked);
    const locked: boolean = lockedData ? JSON.parse(lockedData) : false;
    const textProposedKey: string = `${DATA_KEYS.textProposed}-${this.sessionKey}`;
    const proposedTextData = this.node.getSharedPluginData(dataNamespace(), textProposedKey);
    const proposedText = JSON.parse(proposedTextData || null);

    // if the node is marked as locked, shouldn’t do anything to it
    if (locked) {
      result.status = 'error';
      result.messages.log = `Layer ${this.node.id} is locked`;
      return result;
    }

    // if there is no proposed text, return with error
    if (!proposedText) {
      result.status = 'error';
      result.messages.log = `Layer ${this.node.id} is missing proposed text`;
      return result;
    }

    // set the node to manipulate
    const textNode: TextNode = this.node as TextNode;

    // if the current text matches the proposed text, nothing to do
    if (proposedText === textNode.characters) {
      result.status = 'success';
      result.messages.log = 'Current text matches proposed; nothing to replace';
      return result;
    }

    // update the node’s text with the proposed text
    // update (replace) the text
    const updatedCharacters: string = proposedText;
    textNode.characters = updatedCharacters;

    // return a successful result
    result.status = 'success';
    result.messages.log = `Layer ${textNode.id} text updated`;
    return result;
  }

  /**
   * @description Locates proposed content in a shape node’s Settings object and updates
   * the node’s fill.
   *
   * @kind function
   * @name replaceFill
   *
   * @returns {Object} A result object container success/error status and log/toast messages.
   */
  async replaceFill() {
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

    // load basic node data
    const lockedData = this.node.getSharedPluginData(dataNamespace(), DATA_KEYS.locked);
    const locked: boolean = lockedData ? JSON.parse(lockedData) : false;
    const textProposedKey: string = `${DATA_KEYS.textProposed}-${this.sessionKey}`;
    const proposedTextData = this.node.getSharedPluginData(dataNamespace(), textProposedKey);
    const proposedText = JSON.parse(proposedTextData || null);

    // if the node is marked as locked, shouldn’t do anything to it
    if (locked) {
      result.status = 'error';
      result.messages.log = `Layer ${this.node.id} is locked`;
      return result;
    }

    // if there is no proposed content, return with error
    if (!proposedText) {
      result.status = 'error';
      result.messages.log = `Layer ${this.node.id} is missing proposed shape`;
      return result;
    }

    // nothing to do if `proposedText` is “original”
    if (proposedText === 'original') {
      result.status = 'success';
      result.messages.log = `Layer ${this.node.id} does not need to change`;
      return result;
    }

    // update the node’s fill with the proposed image
    const shapeNode: EllipseNode
      | PolygonNode
      | RectangleNode
      | StarNode = this.node as EllipseNode | PolygonNode | RectangleNode | StarNode;

    // set the proposed image URL
    let remoteUrl: string = null;
    const serverLocation: string = process.env.MEDIA_URL ? process.env.MEDIA_URL : 'https://somewhere.com';
    remoteUrl = `${serverLocation}${proposedText}`;

    // load the remote image
    const newImage = await loadRemoteImage(remoteUrl);

    // apply the image as a fill
    if (newImage) {
      // create the new image fill
      // TKTK - this should not reset all other fills
      const newFills = [];
      const newPaint: ImagePaint = {
        type: 'IMAGE',
        imageHash: newImage.hash,
        scaleMode: 'FILL',
      };
      newFills.push(newPaint);

      // set the image as the new fill
      shapeNode.fills = newFills;

      // update the proposed content to match the new fill
      shapeNode.setSharedPluginData(
        dataNamespace(),
        textProposedKey,
        JSON.stringify(newImage.hash),
      );

      // return a successful result
      result.status = 'success';
      result.messages.log = `Layer ${shapeNode.id} fill updated`;
      return result;
    }

    result.status = 'error';
    result.messages.log = `There was an error setting image: ${proposedText} on ${shapeNode.id}`;
    return result;
  }
}
