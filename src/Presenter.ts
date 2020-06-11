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

  extractStyles = () => {
    type TypeName =
      'Effect'
      | 'Grid'
      | 'Typography'
      | 'Color & Fill';

    const { nodes } = this;
    const styleIds = [];

    // set array of data with information from each node
    const presentationArray: Array<{
      id: string,
      description: string,
      isOpen: boolean,
      group: string,
      kind: string,
      locked: boolean,
      name: string,
      type: StyleType,
      typeName: TypeName,
    }> = [];

    // get styles here
    const extractedStyles: Array<BaseStyle> = [];

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

    const uniqueStyleIds: Array<string> = [...new Set(styleIds)];

    // iterate style IDs and load the styles into the `extractedStyles` array
    uniqueStyleIds.forEach((styleId) => {
      const style: BaseStyle = figma.getStyleById(styleId);
      if (style) {
        const { id, description, name } = style;
        const kind: 'style' | 'component' = 'style';
        const { type }: { type: StyleType } = style;

        const nameArray = name.split(' / ');
        let nameGroup: string = null;
        let nameClean: string = name;

        if (nameArray.length > 1) {
          const gIndex: number = 0;
          nameGroup = nameArray[gIndex].trim();

          nameArray.shift();
          nameClean = nameArray.join(' / ');
        }

        let typeName: TypeName = null;

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
        presentationArray.push({
          id,
          description,
          isOpen: false,
          group: nameGroup,
          kind,
          locked: false,
          name: nameClean,
          type,
          typeName,
        });
      }
    });

    return presentationArray;
  }
}
