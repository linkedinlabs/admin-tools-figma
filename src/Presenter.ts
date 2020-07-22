import { getPeerPluginData } from './Tools';
import { CONTAINER_NODE_TYPES } from './constants';

/** WIP
 * @description Looks into the selection array for any groups and pulls out individual nodes,
 * effectively flattening the selection.
 *
 * @kind function
 * @name setGroups
 *
 * @returns {Object} All items (including children) individual in an updated array.
 */
const setGroups = (allItems, types: Array<PresenterTypeGroup>) => {
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

/** WIP
 * @description Looks into the selection array for any groups and pulls out individual nodes,
 * effectively flattening the selection.
 *
 * @kind function
 * @name setTypes
 *
 * @returns {Object} All items (including children) individual in an updated array.
 */
const setTypes = (allItems) => {
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

/** WIP
 * @description A class to bridge Figma objects and the presentation layer.
 *
 * @class
 * @name Presenter
 *
 * @constructor
 *
 * @property selectionArray The item of selected items.
 */
export default class Presenter {
  nodes: Array<BaseNode | BaseStyle>;
  constructor({ for: nodesArray }) {
    this.nodes = nodesArray;
  }

  /** WIP
   * @description Looks into the selection array for any groups and pulls out individual nodes,
   * effectively flattening the selection.
   *
   * @kind function
   * @name extractStyles
   *
   * @returns {Object} All items (including children) individual in an updated array.
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

        if (nameArray.length > 1) {
          const gIndex: number = 0;
          nameGroup = nameArray[gIndex].trim();

          nameArray.shift();
          nameClean = nameArray.join(' / ');

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

  /** WIP
   * @description Looks into the selection array for any groups and pulls out individual nodes,
   * effectively flattening the selection.
   *
   * @kind function
   * @name extractComponents
   *
   * @returns {Object} All items (including children) individual in an updated array.
   */
  extractComponents = (filter?: 'typography' | 'color-fill' | 'effects' | 'grid') => { // eslint-disable-line @typescript-eslint/no-unused-vars
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
          componentIds.push(instanceNode.masterComponent.id);
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
        const typeId = type.toLowerCase();
        let groupId = null;

        const nameArray = name.split(' / ');
        let nameGroup: string = null;
        let nameClean: string = name;

        if (nameArray.length > 1) {
          const gIndex: number = 0;
          nameGroup = nameArray[gIndex].trim();

          nameArray.shift();
          nameClean = nameArray.join(' / ');

          groupId = `${typeId}-${nameGroup}`;
        }
        const typeName: PresenterTypeName = 'Component';

        // set up plugin data
        let componentData: PresenterComponentData = {
          annotationText: null,
          documentationUri: null,
          isInteractive: false,
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
          kind,
          name: nameClean,
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
