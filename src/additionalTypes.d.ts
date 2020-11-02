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
    annotationText?: string,
    documentationUri?: string,
    isInteractive: boolean,
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
    kind: string,
    name: string,
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
} // declare global

export {}
