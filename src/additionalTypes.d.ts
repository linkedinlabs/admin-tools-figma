declare global {
  // Internal Declarations
  type PresenterTypeName =
    'Effect'
    | 'Grid'
    | 'Typography'
    | 'Color & Fill'
    | 'Component';

  type PresenterTypeGroup = {
    id: string,
    name: string,
    type: StyleType | NodeType,
    typeId?: string,
  };

  type PresenterComponentData = {
    allowKeystopPassthrough: boolean,
    annotationText?: string,
    documentationUri?: string,
    hasKeystop: boolean,
    keys: Array<'arrows-left-right' | 'arrows-up-down' | 'enter' | 'escape' | 'space'>,
    library: 'unassigned' | 'art-deco' | 'mercado',
    role: 'none' | 'button' | 'checkbox' | 'link' | 'option' | 'radio' | 'slider' | 'switch' | 'tab' | 'other',
    type: 'component' | 'foundation',
    usageStatus: 'alpha' | 'beta' | 'production' | 'planned-deprecation' | 'deprecated',
    version?: string,
  }

  type PresenterItem = {
    componentData?: PresenterComponentData,
    description: string,
    group: string,
    groupId: string,
    id: string,
    isVariant?: boolean,
    kind: string,
    name: string,
    nameDisplay: string,
    type: StyleType | NodeType,
    typeId: string,
    typeName: PresenterTypeName,
  };

  // Vendor Declarations

  // for attaching Svelte to window global
  interface Window {
    app: Function;
  }

  // Figma’s typings in npm package @figma/plugin-typings

  // temp until Figma updates their types
  type ComponentSetTypeTemp = 'COMPONENT_SET';
  type NodeTypeTemp = NodeType & ComponentSetTypeTemp;
} // declare global

export {}
