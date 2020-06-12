/* eslint-disable import/prefer-default-export */

/**
 * @description A unique string to identify the plugin within Figma.
 * Changing one of these keys will break data retrieval or reset data in any
 * `xPluginData` getters/setters and potentially elsewhere.
 * [More info]{@link https://www.figma.com/plugin-docs/api/properties/nodes-setsharedplugindata/}
 *
 * @kind constant
 * @name PLUGIN_IDENTIFIER
 * @type {string}
 */
const PLUGIN_IDENTIFIER = 'com.linkedin.figma.admin-tool-plugin';

/**
 * @description The public-facing name for the plugin. This should match the
 * `name` stated in manifset.json.
 *
 * @kind constant
 * @name PLUGIN_NAME
 * @type {string}
 */
const PLUGIN_NAME = 'Admin Tool';

/**
 * @description An object containing the current string constants used as keys in plugin data.
 * Changing one of these keys will break data retrieval or reset data in any
 * `xPluginData` getters/setters and potentially elsewhere.
 *
 * @kind constant
 * @name DATA_KEYS
 * @type {Object}
 */
const DATA_KEYS = {
  options: `${PLUGIN_IDENTIFIER}.options-001`,
  assignment: `${PLUGIN_IDENTIFIER}.assignment-001`,
  textOriginal: `${PLUGIN_IDENTIFIER}.text-original-001`,
  textProposed: `${PLUGIN_IDENTIFIER}.text-proposed-001`,
  locked: `${PLUGIN_IDENTIFIER}.locked-001`,
};

/**
 * @description An object containing the available data type assignments. The `id` is
 * used for matching. The `text` is only used as a label.
 *
 * @kind constant
 * @name ASSIGNMENTS
 * @type {Object}
 */
const ASSIGNMENTS = {
  unassigned: { id: 'unassigned', text: 'Unassigned', nodeType: null },
  avatarCompany: { id: 'avatar-company', text: 'Company', nodeType: 'shape' },
  avatarPerson: { id: 'avatar-person', text: 'Person', nodeType: 'shape' },
  company: { id: 'company', text: 'Company', nodeType: 'text' },
  country: { id: 'country', text: 'Country', nodeType: 'text' },
  date: { id: 'date', text: 'Date', nodeType: 'text' },
  degreeBadge: { id: 'degree-badge', text: 'Degree Badge', nodeType: 'text' },
  domain: { id: 'domain', text: 'Domain Name', nodeType: 'text' },
  email: { id: 'email', text: 'Email', nodeType: 'text' },
  jobTitle: { id: 'job-title', text: 'Job Title', nodeType: 'text' },
  name: { id: 'name', text: 'Name', nodeType: 'text' },
  timestamp: { id: 'timestamp', text: 'Timestamp', nodeType: 'text' },
};
// unassigned
// avatar-company
// avatar-person
// company
// country
// date
// degree-badge
// domain
// email
// job-title
// name
// timestamp

/**
 * @description An object containing the current string constants the Figma API returns for
 * top-level (`main`) layer and `group` layer types.
 *
 * @kind constant
 * @name CONTAINER_NODE_TYPES
 * @type {Object}
 */
const CONTAINER_NODE_TYPES = {
  component: 'COMPONENT',
  frame: 'FRAME',
  group: 'GROUP',
  instance: 'INSTANCE',
};

/**
 * @description An object containing snippets of copy (text) to re-use across the plugin’s UI.
 *
 * @kind constant
 * @name GUI_CONTENT
 * @type {Object}
 */
const GUI_CONTENT = {
  relaunch: {
    layer: 'Generate random content for this layer.',
    component: 'Generate random content for layers inside this component.',
  },
};

/**
 * @description An object containing `height`/`width` settings for the plugin GUI window.
 *
 * @kind constant
 * @name GUI_SETTINGS
 * @type {Object}
 */
const GUI_SETTINGS = {
  default: {
    width: 360,
    height: 215,
  },
  quick: {
    width: 200,
    height: 326,
  },
  info: {
    width: 200,
    height: 324,
  },
};

export {
  ASSIGNMENTS,
  CONTAINER_NODE_TYPES,
  DATA_KEYS,
  GUI_CONTENT,
  GUI_SETTINGS,
  PLUGIN_IDENTIFIER,
  PLUGIN_NAME,
};
/* eslint-enable import/prefer-default-export */
