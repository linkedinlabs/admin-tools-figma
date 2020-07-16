<script>
  import {
    roleOptions,
    libraryOptions,
    libraryStatusOptions,
  } from './stores';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormUnit from './forms-controls/FormUnit';
  import { deepCopy } from '../Tools';

  export let invertView = false;
  export let isEditor = false;
  export let item = null;
  export let isLocked = false;
  export let resetValue = false;

  const setOptions = (options, addNull) => {
    let finalizedOptions = options;
    if (addNull) {
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
</script>

<span
  class={`form-row form-header${invertView ? ' invert' : ''}`}
>
  Design System
</span>

<FormUnit
  className="form-row"
  disableCopy={true}
  hasMultiple={isEditor && item.componentData.library === 'blank--multiple'}
  invertView={invertView}
  itemIsLocked={isLocked}
  kind="inputSelect"
  labelText="Library"
  nameId={`item-library-${item.id}`}
  options={setOptions($libraryOptions, isEditor)}
  resetValue={resetValue}
  bind:value={item.componentData.library}
/>

<FormUnit
  className="form-row"
  hasMultiple={isEditor && item.componentData.annotationText === null}
  invertView={invertView}
  itemIsLocked={isLocked}
  kind="inputText"
  labelText="Annotation text override"
  nameId={`item-annotationText-${item.id}`}
  placeholder="Add an engineering-specific annotation…"
  resetValue={resetValue}
  on:saveSignal
  bind:value={item.componentData.annotationText}
/>

<span class="form-row">
  <FormUnit
    className="form-unit split-60"
    disableCopy={true}
    hasMultiple={isEditor && item.componentData.usageStatus === 'blank--multiple'}
    invertView={invertView}
    itemIsLocked={isLocked}
    kind="inputSelect"
    labelText="Status"
    nameId={`item-usageStatus-${item.id}`}
    options={setOptions($libraryStatusOptions, isEditor)}
    resetValue={resetValue}
    bind:value={item.componentData.usageStatus}
  />
  <FormUnit
    className="form-unit split-40"
    hasMultiple={isEditor && item.componentData.version === null}
    invertView={invertView}
    itemIsLocked={isLocked}
    kind="inputText"
    labelText="Version"
    nameId={`item-version-${item.id}`}
    placeholder="1.0"
    resetValue={resetValue}
    on:saveSignal
    bind:value={item.componentData.version}
  />
</span>

<FormUnit
  className="form-row"
  hasMultiple={isEditor && item.componentData.documentationUri === null}
  invertView={invertView}
  itemIsLocked={isLocked}
  kind="inputText"
  labelText="Documentation link"
  nameId={`item-documentationUri-${item.id}`}
  placeholder="https://something… or go/something…"
  resetValue={resetValue}
  on:saveSignal
  bind:value={item.componentData.documentationUri}
/>

<span
  class={`form-row form-header${invertView ? ' invert' : ''}`}
>
  Purpose & Interaction
</span>

<span class="form-row">
  <FigmaSwitch
    className="form-element element-type-switch"
    disabled={isLocked}
    invertView={invertView}
    labelText="Interactive?"
    nameId="is-interactive"
    bind:value={item.componentData.isInteractive}
  />
</span>

<FormUnit
  className="form-row"
  disableCopy={true}
  hasMultiple={isEditor && item.componentData.role === 'blank--multiple'}
  invertView={invertView}
  itemIsLocked={isLocked}
  kind="inputSelect"
  labelText="ARIA Role"
  nameId={`item-library-${item.id}`}
  options={setOptions($roleOptions, isEditor)}
  resetValue={resetValue}
  bind:value={item.componentData.role}
/>
