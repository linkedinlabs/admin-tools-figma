import {
  ASSIGNMENTS,
  CONTAINER_NODE_TYPES,
  DATA_KEYS,
  DATA_KEYS_REALISH,
  DATA_KEYS_SPECTER,
  GUI_SETTINGS,
  PLUGIN_IDENTIFIER,
} from './constants';

const hexRgb = require('hex-rgb');

// --- helper functions
/**
 * An approximation of `forEach` but run in an async manner.
 *
 * @kind function
 * @name asyncForEach
 *
 * @param {Array} array An array to iterate.
 * @param {Function} callback A function to feed the single/iterated item back to.
 *
 * @returns {null} Runs the callback function.
 */
const asyncForEach = async (
  array: Array<any>,
  callback: Function,
): Promise<Function> => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
  }
  return null;
};

/**
 * An approximation of `setTimeout` but run in an async manner
 * with logging to Messenger.
 *
 * @kind function
 * @name pollWithPromise
 *
 * @param {Function} externalCheck The external function to run a check against.
 * The function should resolve to `true`.
 * @param {Object} messenger An initialized instance of the Messenger class for logging (optional).
 * @param {Function} messenger.log The log function from the Messenger class.
 * @param {string} name The name of the check for logging purposes (optional).
 *
 * @returns {Promise} Returns a promise for resolution.
 */
const pollWithPromise = (
  externalCheck: Function,
  messenger?: { log: Function },
  name?: string,
): Promise<Function> => {
  const isReady: Function = externalCheck;
  const checkName = name || externalCheck.name;

  const checkIsReady = (resolve) => {
    if (messenger) { messenger.log(`Checking: ${checkName} 🤔`); }

    if (isReady()) {
      if (messenger) { messenger.log(`Resolve ${checkName} 🙏`); }

      resolve(true);
    } else {
      setTimeout(checkIsReady, 25, resolve);
    }
  };
  return new Promise(checkIsReady);
};

/**
 * Manages the process of passing a network request along to the plugin
 * UI and waiting for the response.
 *
 * @kind function
 * @name asyncNetworkRequest
 *
 * @param {Object} options An object including the request options: The URL the request should
 * go to (`requestUrl`), headers to pass along to the request (optional), an optional request
 * body (`bodyToSend`), and an initialized instance of the Messenger class for logging (optional).
 * @param {string} options.requestUrl The URL the request should go to.
 * @param {any} options.headers Headers to pass along to the request (optional).
 * @param {any} options.bodyToSend An optional request body.
 * @param {Object} options.messenger An optional initialized instance of the Messenger class.
 * @param {Object} options.messenger.log The log function from the Messenger class.
 *
 * @returns {Object} Returns the result of the network request (response).
 */
const asyncNetworkRequest = async (options: {
  requestUrl: string,
  headers?: any,
  bodyToSend?: any,
  messenger?: { log: Function },
}) => {
  const {
    requestUrl,
    headers,
    bodyToSend,
    messenger,
  } = options;

  // set blank response
  let response = null;

  // polling function to check for a response from the plugin UI
  const awaitResponse = async () => {
    // simple function to check for existence of a response
    const responseExists = () => (response !== null);

    // set a one-time use listener
    figma.ui.once('message', (msg) => {
      if (msg && msg.apiResponse) { response = msg.apiResponse; }
    });

    await pollWithPromise(responseExists, messenger);
  };

  // makes the request by passing the options along to the plugin UI
  const makeRequest = () => {
    figma.ui.postMessage({
      action: 'networkRequest',
      payload: {
        route: requestUrl,
        headers,
        bodyToSend,
      },
    });

    if (messenger) {
      messenger.log(`Network request: ${requestUrl}`);
    }
  };

  // do the things
  makeRequest();
  await awaitResponse();
  return response;
};

/**
 * Similar to `asyncNetworkRequest`, manages the process for requesting the
 * download of a remote image.
 *
 * @kind function
 * @name asyncImageRequest
 *
 * @param {Object} options An object including the request options: The URL the request should
 * go to (`requestUrl`) and an initialized instance of the Messenger class for logging (optional).
 * @param {string} options.requestUrl The URL the request should go to.
 * @param {Object} options.messenger An optional initialized instance of the Messenger class.
 * @param {Object} options.messenger.log The log function from the Messenger class.
 *
 * @returns {Object} Returns the result of the network request (response).
 */
const asyncImageRequest = async (options: {
  requestUrl: string,
  messenger?: { log: Function },
}) => {
  const {
    messenger,
    requestUrl,
  } = options;

  // set blank response
  let response = null;

  // polling function to check for a response from the plugin UI
  const awaitResponse = async () => {
    // simple function to check for existence of a response
    const responseExists = () => (response !== null);

    // set a one-time use listener
    figma.ui.once('message', (msg) => {
      if (msg && msg.imageResponse) { response = msg.imageResponse; }
    });

    await pollWithPromise(responseExists, messenger);
  };

  // makes the request by passing the options along to the plugin UI
  const makeRequest = () => {
    figma.ui.postMessage({
      action: 'imageRequest',
      payload: {
        route: requestUrl,
      },
    });

    if (messenger) {
      messenger.log(`Request image at: ${requestUrl}`);
    }
  };

  // do the things
  makeRequest();
  await awaitResponse();
  return response;
};

// we need to wait for the UI to be ready:
// network calls are made through the UI iframe
const awaitUIReadiness = async (messenger?) => {
  // set UI readiness check to falsey
  let ready = false;

  // simple function to check truthiness of `ready`
  const isUIReady = () => ready;

  // set a one-time use listener
  figma.ui.once('message', (msg) => {
    if (msg && msg.loaded) { ready = true; }
  });

  await pollWithPromise(isUIReady, messenger);
};

/**
 * A helper function that uses `fetch` to make a network request.
 * This helper can only be used from the UI thread. The main thread of the plugin
 * cannot make network requests. From the main thread, use `asyncNetworkRequest`. The result
 * is a message posted to the main thread of the plugin with the results of the `fetch` call.
 *
 * @kind function
 * @name makeNetworkRequest
 *
 * @param {Object} options The network request options, containing the URL/route for the
 * request (`route`), the `method` of the request (default is `POST`), optional
 * request `headers`, and an optional request body (`bodyToSend`).
 * @param {string} options.route The URL (or local route) the request should go to.
 * @param {string} options.method The request method (i.e. GET, POST, etc.).
 * @param {any} options.headers Headers to pass along to the request (optional).
 * @param {any} options.bodyToSend An optional request body.
 */
const makeNetworkRequest = (options: {
  route: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers?: any,
  bodyToSend?: any,
}) => {
  const { route, headers, bodyToSend } = options;
  const body = bodyToSend ? JSON.stringify(bodyToSend) : null;
  const method = options.method || 'POST';

  fetch(route, { // eslint-disable-line no-undef
    method,
    headers,
    body,
  })
    .then((response) => {
      response.json()
        .then((json) => {
          if (json) {
            // return json blob back to main thread
            parent.postMessage({ pluginMessage: { apiResponse: json } }, '*');
          }
        });
    })
    .catch((err) => console.error(err)); // eslint-disable-line no-console
};

/**
 * A reusable helper function to take an array and check if an item exists
 * based on a `key`/`value` pair.
 *
 * @kind function
 * @name existsInArray
 *
 * @param {Array} array The array to be checked.
 * @param {string} value The value to test against `key`.
 * @param {string} key String representing the key to match against `value` (default is `id`).
 *
 * @returns {boolean}
 */
const existsInArray = (
  array: Array<any>,
  value,
  key: string = 'id',
) => {
  let doesExist = false;
  const itemIndex = array.findIndex(
    (foundItem) => (foundItem[key] === value),
  );

  if (itemIndex > -1) {
    doesExist = true;
  }

  return doesExist;
};

/**
 * A reusable helper function to take an array and add or remove data from it
 * based on a top-level key and a defined action.
 *
 * @kind function
 * @name updateArray
 *
 * @param {Array} array The array to be modified.
 * @param {Object} item Object containing the new bit of data to add, remove, or update.
 * @param {string} itemKey String representing the key to match (default is `id`).
 * @param {string} action Constant string representing the action to take
 * (`add`, `update`, or `remove`).
 *
 * @returns {Object} The modified array.
 */
const updateArray = (
  array,
  item,
  itemKey: string = 'id',
  action: 'add' | 'update' | 'remove' = 'add',
) => {
  let updatedArray = array;

  // find the index of a pre-existing `id` match on the array
  const itemIndex: number = updatedArray.findIndex(
    (foundItem) => (foundItem[itemKey] === item[itemKey]),
  );

  // if a match exists
  if (itemIndex > -1) {
    if (action === 'update') {
      // remove it and re-add it
      updatedArray = [
        ...updatedArray.slice(0, itemIndex),
        ...[item],
        ...updatedArray.slice(itemIndex + 1),
      ];
    } else {
      // remove it
      updatedArray = [
        ...updatedArray.slice(0, itemIndex),
        ...updatedArray.slice(itemIndex + 1),
      ];
    }
  }

  // if the `action` is `add`, append the new `item` to the array
  if (action === 'add') {
    updatedArray.push(item);
  }

  return updatedArray;
};

/**
 * Takes two one-dimensional arrays and compare them. Returns `true` if they
 * are different. Order of the array does not matter.
 *
 * @kind function
 * @name compareArrays
 *
 * @param {Array} array1 A one-dimensional array.
 * @param {Array} array2 A one-dimensional array to compare against.
 *
 * @returns {boolean} Returns `true` if the arrays are different, `false` if they have identical
 * values.
 */

const compareArrays = (array1: Array<any>, array2: Array<any>) => {
  // compares two values; uses `deepCompare` if values are an object
  const isMatch = (value1: any, value2: any) => {
    let match = false;
    if ((typeof value1 === 'object') && (value1 !== null)) {
      match = !deepCompare(value1, value2); // eslint-disable-line no-use-before-define
    } else {
      match = (value2 === value1);
    }
    return match;
  };

  let isDifferent = false;

  if (!array1 && !array2) {
    return isDifferent;
  }

  if ((!array1 && array2) || (!array2 && array1)) {
    isDifferent = true;
    return isDifferent;
  }

  if (array1.length !== array2.length) {
    isDifferent = true;
    return isDifferent;
  }

  array1.forEach((value) => {
    const itemIndex = array2.findIndex((foundValue) => isMatch(value, foundValue));

    if (itemIndex < 0) {
      isDifferent = true;
    }
  });

  if (isDifferent) {
    return isDifferent;
  }

  array2.forEach((value) => {
    const itemIndex = array1.findIndex((foundValue) => isMatch(value, foundValue));

    if (itemIndex < 0) {
      isDifferent = true;
    }
  });

  return isDifferent;
};

/**
 * Clones a multi-dimensional object without references.
 *
 * @kind function
 * @name deepCopy
 *
 * @param {Object} objectToClone An object to clone.
 *
 * @returns {Object} The cloned object, without references.
 */
const deepCopy = (objectToClone: Object) => {
  let clonedObject: Object = null;

  if (typeof objectToClone !== 'object' || objectToClone === null) {
    return objectToClone; // return if objectToClone is not object/array
  }

  // create an array or object to hold the values
  clonedObject = Array.isArray(objectToClone) ? [] : {};

  Object.keys(objectToClone).forEach((key: string) => {
    const value: any = objectToClone[key];

    // recursively copy for nested objects, including arrays
    clonedObject[key] = deepCopy(value);
  });

  return clonedObject;
};

/**
 * Creates a list of select options specifically for bulk editor.
 *
 * @kind function
 * @name setBulkSelectOptions
 *
 * @param {Array} options The original options in the item editor.
 * @param {string} currentValue The selected value of the options.
 * @param {string} addNullAllowed A flag for whether to allow a null value in the options.
 *
 * @returns {boolean} Returns a new list of options for the bulk editor.
 */
const setBulkSelectOptions = (options, currentValue, addNullAllowed) => {
  let finalizedOptions = options;
  if (addNullAllowed && (currentValue === null || currentValue === 'blank--multiple')) {
    const nullOption = {
      value: 'blank--multiple',
      text: 'multiple…',
      disabled: false,
    };
    finalizedOptions = deepCopy(options);
    finalizedOptions.unshift(nullOption);
  }

  return finalizedOptions;
};

/**
 * Compares two multi-dimensional objects. Returns `true` if they are different.
 *
 * @kind function
 * @name deepCompare
 *
 * @param {Object} unmodifiedObject An object to compare.
 * @param {Object} modifiedObject An object to compare against `unmodifiedObject`.
 *
 * @returns {boolean} Returns `true` if the objects are different, `false` if they are identical.
 */
const deepCompare = (unmodifiedObject: Object, modifiedObject: Object) => {
  let isDifferent: boolean = false;

  if (typeof unmodifiedObject !== 'object' || unmodifiedObject === null) {
    return isDifferent;
  }

  Object.entries(unmodifiedObject).forEach(([key, value]) => {
    // check for inner object/array first
    if ((typeof value === 'object') && (value !== null)) {
      if (
        modifiedObject[key] === undefined
        || deepCompare(value, modifiedObject[key])
      ) {
        isDifferent = true;
      }

      if (value.constructor === Array) {
        if (compareArrays(value, modifiedObject[key])) {
          isDifferent = true;
        }
      }
    } else if (modifiedObject[key] !== value) {
      if (modifiedObject[key] !== 'blank--multiple') {
        isDifferent = true;
      }
    }
  });

  return isDifferent;
};

/**
 * Takes a node object and traverses parent relationships until the top-level
 * `CONTAINER_NODE_TYPES.frame` node is found. Returns the frame node.
 *
 * @kind function
 * @name findTopFrame
 * @param {Object} node A Figma node object.
 *
 * @returns {Object} The top-level `CONTAINER_NODE_TYPES.frame` node.
 */
const findTopFrame = (node: any) => {
  let { parent } = node;

  // if the parent is a page, we're done
  if (parent && parent.type === 'PAGE') {
    return node;
  }

  // loop through each parent until we find the outermost FRAME
  if (parent) {
    while (parent && parent.parent.type !== 'PAGE') {
      parent = parent.parent;
    }
  }
  return parent;
};

/**
 * Reverse iterates the node tree to determine the top-level component instance
 * (if one exists) for the node. This allows you to easily find a Master Component when dealing
 * with an instance that may be nested within several component instances.
 *
 * @kind function
 * @name findTopInstance
 *
 * @param {Object} node A Figma node object (`SceneNode`).
 *
 * @returns {Object} Returns the top component instance (`InstanceNode`) or `null`.
 */
const findTopInstance = (node: any) => {
  let { parent } = node;
  let currentNode = node;
  let currentTopInstance: InstanceNode = null;

  if (parent) {
    // iterate until the parent is a page
    while (parent && parent.type !== 'PAGE') {
      currentNode = parent;
      if (currentNode.type === CONTAINER_NODE_TYPES.instance) {
        // update the top-most main component with the current one
        currentTopInstance = currentNode;
      }
      parent = parent.parent;
    }
  }

  if (currentTopInstance) {
    return currentTopInstance;
  }
  return null;
};

/**
 * Reverse iterates the node tree to determine the top-level component
 * (if one exists) for the node. This allows you to check if a node is part of a component.
 *
 * @kind function
 * @name findTopComponent
 *
 * @param {Object} node A Figma node object (`SceneNode`).
 *
 * @returns {Object} Returns the component (`ComponentNode`) or `null`.
 */
const findTopComponent = (node: any) => {
  // return self if component
  if (node.type === CONTAINER_NODE_TYPES.component) {
    return node;
  }

  let { parent } = node;
  let currentNode = node;
  let componentNode: ComponentNode = null;
  if (parent) {
    // iterate until the parent is a page or component is found;
    // components cannot nest inside other components, so we can stop at the first
    // found component
    while (parent && parent.type !== 'PAGE' && componentNode === null) {
      currentNode = parent;
      if (currentNode.type === CONTAINER_NODE_TYPES.component) {
        // update the top-most main component with the current one
        componentNode = currentNode;
      }
      parent = parent.parent;
    }
  }

  if (componentNode) {
    return componentNode;
  }
  return null;
};

/**
 * Maps the nesting order of a node within the tree and then uses that “map”
 * as a guide to find the peer node within the an instance’s Master Component.
 *
 * @kind function
 * @name matchMasterPeerNode
 *
 * @param {Object} node A Figma node object (`SceneNode`).
 * @param {Object} topNode A Figma instance node object (`InstanceNode`).
 *
 * @returns {Object} Returns the main component or `null`.
 */
const matchMasterPeerNode = (node: any, topNode: InstanceNode) => {
  // finds the `index` of self in the parent’s children list
  const indexAtParent = (childNode: any): number => childNode.parent.children.findIndex(
    (child) => child.id === childNode.id,
  );

  // set some defaults
  let { parent } = node;
  const childIndices = [];
  const mainComponentNode = topNode.mainComponent;
  let mainPeerNode = null;
  let currentNode = node;

  // iterate up the chain, collecting indices in each child list
  if (parent) {
    childIndices.push(indexAtParent(node));
    while (parent && parent.id !== topNode.id) {
      currentNode = parent;
      parent = parent.parent;
      childIndices.push(indexAtParent(currentNode));
    }
  }

  // navigate down the chain of the corresponding main component using the
  // collected child indices to locate the peer node
  if (childIndices.length > 0 && mainComponentNode) {
    const childIndicesReversed = childIndices.reverse();
    let { children } = mainComponentNode;
    let selectedChild = null;

    childIndicesReversed.forEach((childIndex, index) => {
      selectedChild = children[childIndex];
      if ((childIndicesReversed.length - 1) > index) {
        children = selectedChild.children;
      }
    });

    // the last selected child should be the peer node
    if (selectedChild) {
      mainPeerNode = selectedChild;
    }
  }

  return mainPeerNode;
};

/**
 * A lookup function to easily retrieve the data namespace used for shared
 * plugin data. Note: changing this function will potentially make it impossible for existing
 * users to retrieve data saved to nodes before the change.
 *
 * @kind function
 * @name dataNamespace
 *
 * @param {string} pluginName The plugin name to use for lookup.
 *
 * @returns {string} The data namespace for the supplied plugin.
 */
const dataNamespace = (pluginName: 'realish' | 'specter' = null): string => {
  let identifier: string = null;
  let key: string = null;

  switch (pluginName) {
    case 'realish':
      identifier = process.env.PLUGIN_IDENTIFIER_REALISH
        ? process.env.PLUGIN_IDENTIFIER_REALISH : pluginName;
      key = process.env.SECRET_KEY_REALISH ? process.env.SECRET_KEY_REALISH : '1234';
      break;
    case 'specter':
      identifier = process.env.PLUGIN_IDENTIFIER_SPECTER
        ? process.env.PLUGIN_IDENTIFIER_SPECTER : pluginName;
      key = process.env.SECRET_KEY_SPECTER ? process.env.SECRET_KEY_SPECTER : '1234';
      break;
    default:
      identifier = PLUGIN_IDENTIFIER;
      key = process.env.SECRET_KEY ? process.env.SECRET_KEY : '1234';
  }

  let namespace: string = `${identifier.toLowerCase()}${key.toLowerCase()}`;
  namespace = namespace.replace(/[^0-9a-z]/gi, '');
  return namespace;
};

/**
 * A shared helper function to retrieve plugin data on a node from a
 * peer plugin (Realish or Specter).
 *
 * @kind function
 * @name getPeerPluginData
 *
 * @param {Object} node The text node to retrieve the assignment on.
 * @param {string} pluginName The plugin name to use for lookup.
 *
 * @returns {string} The assignment is returned as an unparsed JSON string.
 */
const getPeerPluginData = (
  node: SceneNode,
  pluginName: 'realish' | 'specter',
) => {
  let dataKey: string = null;
  let parsedData = null;

  switch (pluginName) {
    case 'realish':
      dataKey = DATA_KEYS_REALISH.assignment;
      break;
    case 'specter':
      dataKey = DATA_KEYS_SPECTER.bundle;
      break;
    default:
      dataKey = DATA_KEYS.bundle;
  }

  let pluginData = node.getSharedPluginData(
    dataNamespace(pluginName),
    dataKey,
  );

  if (!pluginData) {
    const topInstanceNode = findTopInstance(node);
    if (topInstanceNode) {
      const peerNode = matchMasterPeerNode(node, topInstanceNode);
      if (peerNode) {
        pluginData = peerNode.getSharedPluginData(
          dataNamespace(pluginName),
          dataKey,
        );
      }
    }
  }

  if (pluginData) {
    parsedData = JSON.parse(pluginData);
  }

  return parsedData;
};

/* eslint-disable jsdoc/require-param-type */
/**
 * A shared helper function to set plugin data on a node for retrieval by
 * a peer plugin (Realish or Specter).
 *
 * @kind function
 * @name setPeerPluginData
 *
 * @param {Object} node The text node to retrieve the assignment on.
 * @param updatedPluginData A bit of data to save to the node.
 * @param {string} pluginName The plugin name to use for lookup.
 *
 * @returns {string} The assignment is returned as an unparsed JSON string.
 */
/* eslint-enable jsdoc/require-param-type */
const setPeerPluginData = (
  node: SceneNode,
  updatedPluginData,
  pluginName: 'realish' | 'specter',
): void => {
  let dataKey: string = null;
  let nodeToUpdate: SceneNode = node;

  switch (pluginName) {
    case 'realish':
      dataKey = DATA_KEYS_REALISH.assignment;
      break;
    case 'specter':
      dataKey = DATA_KEYS_SPECTER.bundle;
      break;
    default:
      dataKey = DATA_KEYS.bundle;
  }

  const pluginData = node.getSharedPluginData(
    dataNamespace(pluginName),
    dataKey,
  );

  if (!pluginData) {
    const topInstanceNode = findTopInstance(node);
    if (topInstanceNode) {
      const peerNode = matchMasterPeerNode(node, topInstanceNode);
      if (peerNode) {
        nodeToUpdate = peerNode;
      }
    }
  }

  nodeToUpdate.setSharedPluginData(
    dataNamespace(pluginName),
    dataKey,
    JSON.stringify(updatedPluginData),
  );

  return null;
};

/**
 * An async function to load multiple typefaces using Figma’s `loadFontAsync`.
 *
 * @kind function
 * @name loadTypefaces
 *
 * @param {Array} typefaces An array of typefaces to load. Typefaces in the array must be
 * formatted to match Figma’s `FontName` type.
 * @param {Object} messenger An initialized instance of the Messenger class for logging (optional).
 * @param {Function} messenger.log The log function from the Messenger class.
 *
 * @returns {Promise} Returns a promise for resolution.
 */
const loadTypefaces = async (
  typefaces: Array<FontName>,
  messenger?: { log: Function },
) => {
  messenger.log('begin loading typefaces');
  await asyncForEach(typefaces, async (typeface: FontName) => {
    await figma.loadFontAsync(typeface);
    messenger.log(`loading ${typeface.family} ${typeface.style} typeface`);
  });

  messenger.log('done loading typefaces');
};

/**
 * Resizes the plugin iframe GUI within the Figma app.
 *
 * @kind function
 * @name resizeGUI
 * @param {string} type A string representing the `type` of GUI to load.
 * @param {Object} ui An instance of `figma.ui` with the GUI pre-loaded.
 * @param {Function} ui.resize An instance of `figma.ui.resize` function.
 *
 * @returns {null}
 */
const resizeGUI = (
  type: string,
  ui: { resize: Function },
): void => {
  ui.resize(
    GUI_SETTINGS[type].width,
    GUI_SETTINGS[type].height,
  );

  return null;
};

/**
 * Checks a node’s `type` to see if it is a `TextNode`.
 *
 * @kind function
 * @name isTextNode
 *
 * @param {Object} node The node to check.
 *
 * @returns {boolean} `true` if the node is a `TextNode`.
 */
const isTextNode = (node: any): node is TextNode => node.type === 'TEXT';

/**
 * Checks if a supplied `assignment` string and `nodeType` is valid (it can be
 * matched with an entry in `ASSIGNMENTS`).
 *
 * @kind function
 * @name isValidAssignment
 *
 * @param {string} assignment The assignment to check (`id` in `ASSIGNMENTS`).
 * @param {string} nodeType The type to check (`nodeType` in `ASSIGNMENTS`).
 *
 * @returns {boolean} `true` if the assignment is valid.
 */
const isValidAssignment = (assignment: string, nodeType: 'shape' | 'text'): boolean => {
  let isValid = false;

  if (assignment === ASSIGNMENTS.unassigned.id) {
    isValid = true;
    return isValid;
  }

  Object.keys(ASSIGNMENTS).forEach((key) => {
    if (ASSIGNMENTS[key].id === assignment && ASSIGNMENTS[key].nodeType === nodeType) {
      isValid = true;
    }
  });
  return isValid;
};

/**
 * Checks the `FEATURESET` environment variable from webpack and
 * determines if the featureset build should be `internal` or not.
 *
 * @kind function
 * @name isInternal
 *
 * @returns {boolean} `true` if the build is internal, `false` if it is not.
 */
const isInternal = (): boolean => {
  const buildIsInternal: boolean = process.env.FEATURESET === 'internal';
  return buildIsInternal;
};

/**
 * Checks two supplied filters and returns `true` if they match.
 *
 * @kind function
 * @name checkFilterMatch
 *
 * @param {string} currentFilter A filter to check.
 * @param {string} filterToMatch A filter to check against.
 *
 * @returns {boolean} `true` if the filters match.
 */
const checkFilterMatch = (
  currentFilter: string,
  filterToMatch: string,
): boolean => {
  let isMatch: boolean = false;

  if (
    (currentFilter === filterToMatch)
    || (currentFilter === 'all-components')
  ) {
    isMatch = true;
  }

  return isMatch;
};

const convertHexToDecimal = (hexValue: {
  r: number,
  g: number,
  b: number,
  a: number,
}) => {
  const decimal = {
    r: (hexValue.r / 255),
    g: (hexValue.g / 255),
    b: (hexValue.b / 255),
    a: hexValue.a,
  };

  return decimal;
};

const hexToDecimalRgb = (hexColor: string, opacity?: number): {
  r: number,
  g: number,
  b: number,
  a: number
} => {
  const rgbColor: { red: number, green: number, blue: number, alpha: number } = hexRgb(hexColor);

  const r: number = (rgbColor.red / 255);
  const g: number = (rgbColor.green / 255);
  const b: number = (rgbColor.blue / 255);
  const a: number = rgbColor.alpha || opacity || 1;

  const decimalRgb: {
    r: number, g: number, b: number, a: number
  } = {
    r, g, b, a,
  };

  return decimalRgb;
};

const parseStyleValue = (styleValue: string) => {
  let parsedStyleValue;
  if (styleValue === 'transparent') {
    // if value is "transparent"
    parsedStyleValue = {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    };
  } else if (styleValue.slice(1, 5) === 'rgba') {
    // if value is of format "rgba(r, g, b, a)"
    const colorTuple = styleValue
      .slice(1, -1) // take off "" marks first
      .slice(5, -1) // take off rgba and parens
      .split(',');

    parsedStyleValue = convertHexToDecimal({
      r: parseInt(colorTuple[0], 10), // int [0, 255]
      g: parseInt(colorTuple[1], 10),
      b: parseInt(colorTuple[2], 10),
      a: parseFloat(colorTuple[3]), // float [0, 1]
    });
  } else if (styleValue[0] === '#') {
    // if value is of format "#xxxxxx"
    parsedStyleValue = hexToDecimalRgb(styleValue, 1);
  }

  return parsedStyleValue;
};

export {
  asyncForEach,
  asyncImageRequest,
  asyncNetworkRequest,
  awaitUIReadiness,
  checkFilterMatch,
  compareArrays,
  dataNamespace,
  deepCompare,
  deepCopy,
  existsInArray,
  findTopComponent,
  findTopFrame,
  findTopInstance,
  getPeerPluginData,
  hexToDecimalRgb,
  isInternal,
  isTextNode,
  isValidAssignment,
  loadTypefaces,
  makeNetworkRequest,
  matchMasterPeerNode,
  parseStyleValue,
  pollWithPromise,
  resizeGUI,
  setBulkSelectOptions,
  setPeerPluginData,
  updateArray,
};
