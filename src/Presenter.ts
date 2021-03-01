import { getPeerPluginData } from './Tools';
import { CONTAINER_NODE_TYPES } from './constants';

/**
 * @description Takes a node/style `type` and parses it for use as `typeId` in the
 * UI groups and type sets.
 *
 * @kind function
 * @name getTypeId
 *
 * @param {string} type Item type for parsing.
 *
 * @returns {string} The parsed `typeId` for use in managing groups.
 */
const getTypeId = (type: string) => {
  let typeId: string = type.toLowerCase();
  typeId = typeId.replace('_set', '');
  return typeId;
};

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
          typeId: getTypeId(item.type),
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
        const typeId = getTypeId(type);
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
    const extractedComponents: Array<ComponentNode | ComponentSetNode> = [];

    nodes.forEach((node: SceneNode) => {
      if (
        (node.type === CONTAINER_NODE_TYPES.component)
        || (node.type === CONTAINER_NODE_TYPES.componentSet)
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
        // base info
        const {
          id,
          description,
          name,
          type,
        }: {
          id: string,
          description: string,
          name: string,
          type: NodeType,
        } = component;

        // meta info
        const isVariant = component.parent
          && (component.parent.type === CONTAINER_NODE_TYPES.componentSet);
        const kind: 'style' | 'component' = 'component';
        const typeId = getTypeId(type);
        const variants: Array<{
          key: string,
          ignore: boolean,
        }> = [];

        // set up naming scheme + `groupId`
        const nameGroupArray = name.split(' / ');
        let nameGroup: string = null;
        let nameClean: string = name;
        let nameDisplay: string = name;
        let groupId = null;

        if (nameGroupArray.length > 1) {
          const gIndex: number = 0;
          nameGroup = nameGroupArray[gIndex].trim();

          nameGroupArray.shift();
          nameClean = nameGroupArray.join(' / ');
          nameDisplay = nameClean;

          groupId = `${typeId}-${nameGroup}`;
        }

        // set up a custom display name for Variants (mimics Figma’s treatment)
        if (isVariant) {
          const componentName = component.parent.name;
          const nameVariantArray = name.split(',');
          let nameIsCorrupt = false;
          if (nameVariantArray.length > 1) {
            const variantValues = [];
            nameVariantArray.forEach((variantValue) => {
              const variantValueArray = variantValue.split('=');
              if (variantValueArray.length === 2) {
                const valIndex = 1;
                const value = variantValueArray[valIndex];
                variantValues.push(value);
              } else {
                nameIsCorrupt = true;
              }
            });

            if (
              !nameIsCorrupt
              && componentName
              && (variantValues.length > 0)
            ) {
              nameDisplay = `${componentName}: ${variantValues.join(', ')}`;
            }
          }
        }

        // extract variants for the options and set up presentation object
        if (component.type === CONTAINER_NODE_TYPES.componentSet) {
          const variantKeysArray: Array<string> = [];
          const { children } = component;

          // extract variants
          children.forEach((node: SceneNode) => {
            if (node.type === CONTAINER_NODE_TYPES.component) {
              const nameVariantArray: Array<string> = node.name.split(',');
              nameVariantArray.forEach((variantKey) => {
                const variantKeyStripped = variantKey.trim();
                const variantKeyArray: Array<string> = variantKeyStripped.split('=');
                if (variantKeyArray.length === 2) {
                  const keyIndex: number = 0;
                  const key: string = variantKeyArray[keyIndex];

                  if (!variantKeysArray.includes(key)) {
                    variantKeysArray.push(key);
                  }
                }
              });
            }
          });

          // set up initial presentation object
          variantKeysArray.forEach((variantKey: string) => {
            const variant: {
              key: string,
              ignore: boolean,
            } = {
              key: variantKey,
              ignore: false,
            };

            variants.push(variant);
          });
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
          role: 'no-role',
          labels: {
            alt: null,
            visible: false,
            a11y: null,
          },
          type: 'component',
          usageStatus: 'production',
          variants,
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

          // check for old `role` data and migrate
          if (existingComponentData.role && (existingComponentData.role === 'none')) {
            existingComponentData.role = 'no-role';
          }

          // update variants - underlying variants can change, so must always be updated.
          // we use the current `variants` array, flip any ignore/true matches to `true`
          // and then replace the existing bundle with the updated, current bundle
          existingComponentData.variants.forEach((existingVariant) => {
            variants.forEach((variant) => {
              if (
                (variant.key === existingVariant.key)
                && (existingVariant.ignore)
              ) {
                variant.ignore = true; // eslint-disable-line no-param-reassign
              }
            });
          });
          existingComponentData.variants = variants;

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
