<script>
  import {
    roleOptions,
    libraryOptions,
    libraryStatusOptions,
  } from './stores';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormUnit from './forms-controls/FormUnit';

  export let item = null;
  export let isLocked = false;
  export let resetValue = false;
</script>

<span class="form-row form-header">
  Design System
</span>

<FormUnit
  className="form-row"
  disableCopy={true}
  itemIsLocked={isLocked}
  kind="inputSelect"
  labelText="Library"
  nameId={`item-library-${item.id}`}
  options={$libraryOptions}
  resetValue={resetValue}
  bind:value={item.componentData.library}
/>

<FormUnit
  className="form-row"
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
    itemIsLocked={isLocked}
    kind="inputSelect"
    labelText="Library"
    nameId={`item-usageStatus-${item.id}`}
    options={$libraryStatusOptions}
    resetValue={resetValue}
    bind:value={item.componentData.usageStatus}
  />
  <FormUnit
    className="form-unit split-40"
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
  itemIsLocked={isLocked}
  kind="inputText"
  labelText="Documentation link"
  nameId={`item-documentationUri-${item.id}`}
  placeholder="https://something… or go/something…"
  resetValue={resetValue}
  on:saveSignal
  bind:value={item.componentData.documentationUri}
/>

<span class="form-row form-header">
  Purpose & Interaction
</span>

<span class="form-row">
  <FigmaSwitch
    className="form-element element-type-switch"
    disabled={isLocked}
    labelText="Interactive?"
    nameId="is-interactive"
    bind:value={item.componentData.isInteractive}
  />
</span>

<FormUnit
  className="form-row"
  disableCopy={true}
  itemIsLocked={isLocked}
  kind="inputSelect"
  labelText="ARIA Role"
  nameId={`item-library-${item.id}`}
  options={$roleOptions}
  resetValue={resetValue}
  bind:value={item.componentData.role}
/>
