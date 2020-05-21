import {
  ASSIGNMENTS,
  CONTAINER_NODE_TYPES,
  DATA_KEYS,
  GUI_SETTINGS,
  PLUGIN_IDENTIFIER,
} from './constants';

// --- helper functions
/**
 * @description An approximation of `forEach` but run in an async manner.
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
 * @description An approximation of `setTimeout` but run in an async manner
 * with logging to Messenger.
 *
 * @kind function
 * @name pollWithPromise
 *
 * @param {Function} externalCheck The external function to run a check against.
 * The function should resolve to `true`.
 * @param {Object} messenger An initialized instance of the Messenger class for logging (optional).
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
 * @description Manages the process of passing a network request along to the plugin
 * UI and waiting for the response.
 *
 * @kind function
 * @name asyncNetworkRequest
 *
 * @param {Object} options An object including the request options: The URL the request should
 * go to (`requestUrl`), headers to pass along to the request (optional), an optional request
 * body (`bodyToSend`), and an initialized instance of the Messenger class for logging (optional).
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
 * @description Similar to `asyncNetworkRequest`, manages the process for requesting the
 * download of a remote image.
 *
 * @kind function
 * @name asyncImageRequest
 *
 * @param {Object} options An object including the request options: The URL the request should
 * go to (`requestUrl`) and an initialized instance of the Messenger class for logging (optional).
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
 * @description A helper function that uses `fetch` to make a network request.
 * This helper can only be used from the UI thread. The main thread of the plugin
 * cannot make network requests. From the main thread, use `asyncNetworkRequest`.
 *
 * @kind function
 * @name makeNetworkRequest
 *
 * @param {Object} options The network request options, containing the URL/route for the
 * request (`route`), the `method` of the request (default is `POST`), optional
 * request `headers`, and an optional request body (`bodyToSend`).
 *
 * @returns {null} Posts a message to the main thread of the plugin with the results
 * of the `fetch` call.
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
    .catch(err => console.error(err)); // eslint-disable-line no-console
};

/** WIP
 * @description A reusable helper function to take an array and add or remove data from it
 * based on a top-level key and a defined action.
 *
 * @kind function
 * @name existsInArray
 *
 * @param {Array} array The array to be modified.
 * @param {Object} item Object containing the new bit of data to add, remove, or update.
 * @param {string} itemKey String representing the key to match (default is `id`).
 * @param {string} action Constant string representing the action to take
 * (`add`, `update`, or `remove`).
 *
 * @returns {Object} The modified array.
 */
const existsInArray = (array, key, value) => {
  let doesExist = false;
  const itemIndex = array.findIndex(
    foundItem => (foundItem[key] === value),
  );

  if (itemIndex > -1) {
    doesExist = true;
  }

  return doesExist;
};

/** WIP
 * @description A reusable helper function to take an array and add or remove data from it
 * based on a top-level key and a defined action.
 *
 * @kind function
 * @name filterByKey
 *
 * @param {Array} array The array to be modified.
 * @param {Object} item Object containing the new bit of data to add, remove, or update.
 * @param {string} itemKey String representing the key to match (default is `id`).
 * @param {string} action Constant string representing the action to take
 * (`add`, `update`, or `remove`).
 *
 * @returns {Object} The modified array.
 */
const filterByKey = (array, key, value) => {
  const filteredArray = array.filter(item => item[key] === value);
  return filteredArray;
};

/**
 * @description A reusable helper function to take an array and add or remove data from it
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
    foundItem => (foundItem[itemKey] === item[itemKey]),
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
 * @description Takes a node object and traverses parent relationships until the top-level
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
    return parent;
  }

  // loop through each parent until we find the outermost FRAME
  if (parent) {
    while (parent && parent.type !== CONTAINER_NODE_TYPES.frame) {
      parent = parent.parent;
    }
  }
  return parent;
};

/**
 * @description Reverse iterates the node tree to determine the top-level component instance
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
        // update the top-most master component with the current one
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
 * @description Reverse iterates the node tree to determine the top-level component
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
        // update the top-most master component with the current one
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
 * @description Maps the nesting order of a node within the tree and then uses that “map”
 * as a guide to find the peer node within the an instance’s Master Component.
 *
 * @kind function
 * @name matchMasterPeerNode
 *
 * @param {Object} node A Figma node object (`SceneNode`).
 * @param {Object} topNode A Figma instance node object (`InstanceNode`).
 *
 * @returns {Object} Returns the master component or `null`.
 */
const matchMasterPeerNode = (node: any, topNode: InstanceNode) => {
  // finds the `index` of self in the parent’s children list
  const indexAtParent = (childNode: any): number => childNode.parent.children.findIndex(
    child => child.id === childNode.id,
  );

  // set some defaults
  let { parent } = node;
  const childIndices = [];
  const masterComponentNode = topNode.masterComponent;
  let masterPeerNode = null;
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

  // navigate down the chain of the corresponding master component using the
  // collected child indices to locate the peer node
  if (childIndices.length > 0 && masterComponentNode) {
    const childIndicesReversed = childIndices.reverse();
    let { children } = masterComponentNode;
    let selectedChild = null;

    childIndicesReversed.forEach((childIndex, index) => {
      selectedChild = children[childIndex];
      if ((childIndicesReversed.length - 1) > index) {
        children = selectedChild.children;
      }
    });

    // the last selected child should be the peer node
    if (selectedChild) {
      masterPeerNode = selectedChild;
    }
  }

  return masterPeerNode;
};

/**
 * @description A shared helper functional to easily retrieve the data namespace used
 * for shared plugin data. Changing this function will potentially make it impossible
 * for existing users to retrieve data saved to nodes before the change.
 *
 * @kind function
 * @name dataNamespace
 *
 * @returns {string} `true` if the build is internal, `false` if it is not.
 */
const dataNamespace = (): string => {
  const identifier: string = PLUGIN_IDENTIFIER;
  const key: string = process.env.SECRET_KEY ? process.env.SECRET_KEY : '1234';
  let namespace: string = `${identifier.toLowerCase()}${key.toLowerCase()}`;
  namespace = namespace.replace(/[^0-9a-z]/gi, '');
  return namespace;
};

/**
 * @description A shared helper function to retrieve type assignment data in raw form (JSON).
 *
 * @kind function
 * @name getNodeAssignmentData
 *
 * @param {Object} node The text node to retrieve the assignment on.
 *
 * @returns {string} The assignment is returned as an unparsed JSON string.
 */
const getNodeAssignmentData = (node: SceneNode) => {
  let assignmentData = node.getSharedPluginData(dataNamespace(), DATA_KEYS.assignment);

  if (!assignmentData) {
    const topInstanceNode = findTopInstance(node);
    if (topInstanceNode) {
      const peerNode = matchMasterPeerNode(node, topInstanceNode);
      if (peerNode) {
        assignmentData = peerNode.getSharedPluginData(dataNamespace(), DATA_KEYS.assignment);
      }
    }
  }

  return assignmentData;
};

/**
 * @description An async function to load multiple typefaces using Figma’s `loadFontAsync`.
 *
 * @kind function
 * @name loadTypefaces
 *
 * @param {Array} typefaces An array of typefaces to load. Typefaces in the array must be
 * formatted to match Figma’s `FontName` type.
 * @param {Object} messenger An initialized instance of the Messenger class for logging (optional).
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
 * @description Resizes the plugin iframe GUI within the Figma app.
 *
 * @kind function
 * @name resizeGUI
 * @param {string} type A string representing the `type` of GUI to load.
 * @param {Function} ui An instance of `figma.ui` with the GUI pre-loaded.
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
 * @description Checks a node’s `type` to see if it is a `TextNode`.
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
 * @description Checks if a supplied `assignment` string and `nodeType` is valid (it can be
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
 * @description Checks the `FEATURESET` environment variable from webpack and
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

export {
  asyncForEach,
  asyncImageRequest,
  asyncNetworkRequest,
  awaitUIReadiness,
  dataNamespace,
  existsInArray,
  filterByKey,
  findTopComponent,
  findTopFrame,
  findTopInstance,
  getNodeAssignmentData,
  isInternal,
  isTextNode,
  isValidAssignment,
  loadTypefaces,
  makeNetworkRequest,
  matchMasterPeerNode,
  pollWithPromise,
  resizeGUI,
  updateArray,
};
