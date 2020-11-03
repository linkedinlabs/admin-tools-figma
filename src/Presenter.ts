import { getPeerPluginData } from './Tools';
import { CONTAINER_NODE_TYPES } from './constants';

/**
 * @description Set up the `groups` object for the UI Presentation. Items are
 * separated into groups based on their `groupId`.
 *
 * @kind function
 * @name setGroups
 *
 * @param {Array} allItems Array of items formatted for UI Presentation.
 * @param {Array} types Array of types formatted for UI Presentation.
 *
 * @returns {Object} All items (including children) individual in an updated array.
 */
const setGroups = (
  allItems: Array<PresenterItem>,
  types: Array<PresenterTypeGroup>,
) => {
  const groups: Array<PresenterTypeGroup> = [];

  types.forEach((type) => {
    const groupIds: Array<string> = [];
    allItems.forEach((item) => {
      if ((item.typeId === type.id) && !groupIds.includes(item.groupId)) {
        groups.push({
          id: item.groupId,
          name: item.group,
          type: item.type,
          typeId: item.type.toLowerCase(),
        });
        groupIds.push(item.groupId);
      }
    });
  });
  return groups;
};

/**
 * @description Set up the `types` object for the UI Presentation. Items are
 * separated into types based on their `typeId`.
 *
 * @kind function
 * @name setTypes
 *
 * @param {Array} allItems Array of items formatted for UI Presentation.
 *
 * @returns {Object} All items (including children) individual in an updated array.
 */
const setTypes = (allItems: Array<PresenterItem>) => {
  const types: Array<PresenterTypeGroup> = [];

  const typeIds: Array<string> = [];
  allItems.forEach((item) => {
    if (!typeIds.includes(item.typeId)) {
      types.push({
        id: item.typeId,
        name: item.typeName,
        type: item.type,
      });
      typeIds.push(item.typeId);
    }
  });
  return types;
};

/**
 * @description A class to bridge Figma objects and the presentation layer. Extracts styles from
 * the selection (or all found in the document) or extracts nodes from the selection. Filter
 * options set in the UI thread are applied to the resulting presentation array.
 *
 * @class
 * @name Presenter
 *
 * @constructor
 *
 * @property nodes Array of selected items.
 */
export default class Presenter {
  nodes: Array<BaseNode | BaseStyle>;
  constructor({ for: nodesArray }) {
    this.nodes = nodesArray;
  }

  /**
   * @description Pulls styles from an array of nodes (`isSelection` is enabled) otherwise reads
   * all available location styles from the document. An optional filter is applied to the resulting
   * array, and the array is formatted for UI Presentation.
   *
   * @kind function
   * @name extractStyles
   *
   * @param {string} filter An optional filter param to apply: `typography`, `color-fill`,
   * `effects`, or `grid` are valid options.
   * @param {boolean} isSelection Received from the UI. If set to `true`, styles should be pulled
   * from the selection of nodes rather than the current document.
   *
   * @returns {Object} All style items, groups, and types formatted for UI Presentation.
   */
  extractStyles = (
    filter?: 'typography' | 'color-fill' | 'effects' | 'grid',
    isSelection?: boolean,
  ) => {
    const { nodes } = this;
    const styleIds = [];

    // set array of data with information from each node
    const presentationObject: {
      items: Array<PresenterItem>,
      groups: Array<PresenterTypeGroup>,
      types: Array<PresenterTypeGroup>,
    } = {
      items: null,
      groups: null,
      types: null,
    };

    let items: Array<PresenterItem> = [];
    const extractedStyles: Array<BaseStyle> = [];

    // get styles here using either selection or all available in file
    if (isSelection) {
      nodes.forEach((node: SceneNode) => {
        const {
          effectStyleId,
          fillStyleId,
          gridStyleId,
          strokeStyleId,
          textStyleId,
        } = node as unknown as {
          effectStyleId: string,
          fillStyleId: string,
          gridStyleId: string,
          strokeStyleId: string,
          textStyleId: string,
        };

        if (effectStyleId) { styleIds.push(effectStyleId); }
        if (fillStyleId) { styleIds.push(fillStyleId); }
        if (gridStyleId) { styleIds.push(gridStyleId); }
        if (strokeStyleId) { styleIds.push(strokeStyleId); }
        if (textStyleId) { styleIds.push(textStyleId); }
      });
    } else {
      const paintStyles: Array<PaintStyle> = figma.getLocalPaintStyles();
      const textStyles: Array<TextStyle> = figma.getLocalTextStyles();
      const effectStyles: Array<EffectStyle> = figma.getLocalEffectStyles();
      const gridStyles: Array<GridStyle> = figma.getLocalGridStyles();

      paintStyles.forEach((style: PaintStyle) => styleIds.push(style.id));
      textStyles.forEach((style: TextStyle) => styleIds.push(style.id));
      effectStyles.forEach((style: EffectStyle) => styleIds.push(style.id));
      gridStyles.forEach((style: GridStyle) => styleIds.push(style.id));
    }

    const uniqueStyleIds: Array<string> = [...new Set(styleIds)];

    // iterate style IDs and load the styles into the `extractedStyles` array
    uniqueStyleIds.forEach((styleId) => {
      const style: BaseStyle = figma.getStyleById(styleId);
      if (style && !style.remote) {
        const { id, description, name } = style;
        const kind: 'style' | 'component' = 'style';
        const { type }: { type: StyleType } = style;
        const typeId = type.toLowerCase();
        let groupId = null;

        const nameArray = name.split(' / ');
        let nameGroup: string = null;
        let nameClean: string = name;
        let nameDisplay: string = name;

        if (nameArray.length > 1) {
          const gIndex: number = 0;
          nameGroup = nameArray[gIndex].trim();

          nameArray.shift();
          nameClean = nameArray.join(' / ');
          nameDisplay = nameClean;

          groupId = `${typeId}-${nameGroup}`;
        }

        let typeName: PresenterTypeName = null;

        switch (type) {
          case 'EFFECT':
            typeName = 'Effect';
            break;
          case 'GRID':
            typeName = 'Grid';
            break;
          case 'TEXT':
            typeName = 'Typography';
            break;
          default: // PAINT
            typeName = 'Color & Fill';
        }

        extractedStyles.push(style);

        // update the bundle of info for the current `node` in the selection
        items.push({
          id,
          description,
          group: nameGroup,
          groupId,
          kind,
          name: nameClean,
          nameDisplay,
          type,
          typeId,
          typeName,
        });
      }
    });

    // apply filter
    if (filter) {
      let filterType: StyleType = null;
      switch (filter) {
        case 'color-fill':
          filterType = 'PAINT';
          break;
        case 'effects':
          filterType = 'EFFECT';
          break;
        case 'grid':
          filterType = 'GRID';
          break;
        case 'typography':
          filterType = 'TEXT';
          break;
        default:
      }

      if (filterType) {
        items = items.filter(item => item.type === filterType);
      }
    }

    // create top-level types and groups
    const types = setTypes(items);
    const groups = setGroups(items, types);

    // set everything to the `presentationObject`
    presentationObject.items = items;
    presentationObject.groups = groups;
    presentationObject.types = types;

    return presentationObject;
  }

  /**
   * @description Pulls unique component nodes from the supplied array of nodes in the constructor.
   * The resulting array is formatted for UI Presentation.
   *
   * @kind function
   * @name extractComponents
   *
   * @returns {Object} All node items, groups, and types formatted for UI Presentation.
   */
  extractComponents = () => {
    const { nodes } = this;
    const componentIds = [];

    // set array of data with information from each node
    const presentationObject: {
      items: Array<PresenterItem>,
      groups: Array<PresenterTypeGroup>,
      types: Array<PresenterTypeGroup>,
    } = {
      items: null,
      groups: null,
      types: null,
    };

    const items: Array<PresenterItem> = [];

    // get styles here
    const extractedComponents: Array<ComponentNode> = [];

    nodes.forEach((node: SceneNode) => {
      if (
        (node.type === CONTAINER_NODE_TYPES.component)
        || (node.type === CONTAINER_NODE_TYPES.instance)
      ) {
        if (node.type === CONTAINER_NODE_TYPES.instance) {
          const instanceNode = node as InstanceNode;
          componentIds.push(instanceNode.mainComponent.id);
        } else {
          componentIds.push(node.id);
        }
      }
    });

    const uniqueComponentIds: Array<string> = [...new Set(componentIds)];

    // iterate component IDs and load the components into the `extractedComponents` array
    uniqueComponentIds.forEach((componentId) => {
      const component = figma.getNodeById(componentId) as ComponentNode;
      if (component && !component.remote) {
        const { id, description, name } = component;
        const kind: 'style' | 'component' = 'component';
        const { type }: { type: NodeType } = component;
        const isVariant = component.parent && (component.parent.type === 'COMPONENT_SET' as NodeTypeTemp);
        const typeId = type.toLowerCase();
        let groupId = null;

        const nameGroupArray = name.split(' / ');
        let nameGroup: string = null;
        let nameClean: string = name;
        let nameDisplay: string = name;

        if (nameGroupArray.length > 1) {
          const gIndex: number = 0;
          nameGroup = nameGroupArray[gIndex].trim();

          nameGroupArray.shift();
          nameClean = nameGroupArray.join(' / ');
          nameDisplay = nameClean;

          groupId = `${typeId}-${nameGroup}`;
        }
        if (isVariant) {
          const componentName = component.parent.name;
          const nameVariantArray = name.split(',');
          let nameIsCorrupt = false;
          if (nameVariantArray.length > 1) {
            const variantOptions = [];
            nameVariantArray.forEach((variantOption) => {
              const variantOptionArray = variantOption.split('=');
              if (variantOptionArray.length === 2) {
                const optIndex = 1;
                const option = variantOptionArray[optIndex];
                variantOptions.push(option);
              } else {
                nameIsCorrupt = true;
              }
            });

            if (
              !nameIsCorrupt
              && componentName
              && (variantOptions.length > 0)
            ) {
              nameDisplay = `${componentName}: ${variantOptions.join(', ')}`;
            }
          }
        }
        const typeName: PresenterTypeName = 'Component';

        // set up plugin data
        let componentData: PresenterComponentData = {
          allowKeystopPassthrough: false,
          annotationText: null,
          documentationUri: null,
          hasKeystop: false,
          keys: [],
          library: 'unassigned',
          role: 'none',
          type: 'component',
          usageStatus: 'production',
          version: '1.0',
        };
        const existingComponentData: PresenterComponentData = getPeerPluginData(
          component,
          'specter',
        );

        if (existingComponentData) {
          // backfill for components missing any newer data points
          Object.keys(componentData).forEach((key) => {
            if (existingComponentData[key] === undefined) {
              existingComponentData[key] = componentData[key];
            }
          });

          // set data
          componentData = existingComponentData;
        }

        extractedComponents.push(component);

        // update the bundle of info for the current `node` in the selection
        items.push({
          id,
          description,
          group: nameGroup,
          groupId,
          isVariant,
          kind,
          name: nameClean,
          nameDisplay,
          type,
          typeId,
          typeName,
          componentData,
        });
      }
    });

    // create top-level types and groups
    const types = setTypes(items);
    const groups = setGroups(items, types);

    // set everything to the `presentationObject`
    presentationObject.items = items;
    presentationObject.groups = groups;
    presentationObject.types = types;

    return presentationObject;
  }
}
