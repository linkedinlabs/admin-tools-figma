<script>
  import {
    currentFilter,
    keystopKeysOptions,
    keystopKeysInitOptions,
    libraryOptions,
    libraryStatusOptions,
    roleOptions,
  } from './stores';
  import ComponentVariants from './ComponentVariants';
  import FormUnit from './forms-controls/FormUnit';
  import KeystopKeys from './KeystopKeys';
  import AriaLabels from './AriaLabels';
  import AriaHeading from './AriaHeading';
  import {
    checkFilterMatch,
    compareArrays,
    setBulkSelectOptions,
  } from '../Tools';

  export let invertView = false;
  export let isEditor = false;
  export let overrides = [];
  export let item = null;
  export let savedItem = null;
  export let isLocked = false;
  export let resetValue = false;
  export let isAllTab;

  const setClasses = (classes, hasMultiple) => {
    if (hasMultiple) {
      return `${classes} has-multiple`;
    }
    return classes;
  };

  const restoreKeys = () => {
    item.componentData.keys = savedItem.componentData.keys;
  };
</script>

<style>
  .a11y-header {
    margin: 10px 0 0 19px;
    font-size: 11px;
    color: rgb(155, 155, 155);
    display: flex;
    align-items: center;
  }
</style>

{#if checkFilterMatch($currentFilter, 'design-system')}
{#if isAllTab}
  <span
    class={`form-row form-header${invertView ? ' invert' : ''}`}
  >
    Design System
  </span>
  {/if}

  {#if (item.componentData.variants && item.componentData.variants.length > 0)}
    <ComponentVariants
      invertView={invertView}
      isEditor={isEditor}
      itemIsLocked={isLocked}
      itemId={item.id}
      resetValue={resetValue}
      bind:variants={item.componentData.variants}
    />
  {/if}

  <FormUnit
    className={setClasses('form-row', overrides.includes('annotationText'))}
    hasMultiple={overrides.includes('annotationText') && item.componentData.keys.length === 0}
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

  <FormUnit
    className="form-row form-unit split-50"
    disableCopy={true}
    hasMultiple={isEditor && item.componentData.library === 'blank--multiple'}
    invertView={invertView}
    itemIsLocked={isLocked}
    kind="inputSelect"
    labelText="Library"
    nameId={`item-library-${item.id}`}
    options={setBulkSelectOptions($libraryOptions, item.componentData.library, isEditor)}
    resetValue={resetValue}
    bind:value={item.componentData.library}
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
      options={setBulkSelectOptions($libraryStatusOptions, item.componentData.usageStatus, isEditor)}
      resetValue={resetValue}
      bind:value={item.componentData.usageStatus}
    />
    <FormUnit
      className={setClasses('form-unit split-40', overrides.includes('version'))}
      hasMultiple={overrides.includes('version')}
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
    className={setClasses('form-row', overrides.includes('documentationUri'))}
    hasMultiple={overrides.includes('documentationUri')}
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
{/if}

{#if checkFilterMatch($currentFilter, 'interaction')}
  {#if isAllTab}
    <span class={`form-row form-header${invertView ? ' invert' : ''}`}>
      Purpose & Interaction
    </span>
  {/if}

  <span class="a11y-header">Keyboard
    <FormUnit 
      className="form-row form-unit fixed-150"
      itemIsLocked={isLocked}
      disableCopy={true}
      hasMultiple={overrides.includes('hasKeystop')}
      invertView={invertView}
      kind="inputSwitch"
      nameId={`has-keystop-${item.id}`}
      a11yField={true}
      bind:value={item.componentData.hasKeystop}
      isDirty={item.componentData.hasKeystop !== savedItem.componentData.hasKeystop}
      preserveDirtyProp={true}
    />
  </span>
  {#if item.componentData.hasKeystop}
    <FormUnit
      className="form-row form-unit fixed-150"
      itemIsLocked={isLocked}
      disableCopy={true}
      hasMultiple={overrides.includes('allowKeystopPassthrough')}
      invertView={invertView}
      kind="inputSwitch"
      labelText="Passthrough"
      nameId={`allow-keystop-passthrough-${item.id}`}
      a11yField={true}
      bind:value={item.componentData.allowKeystopPassthrough}
      isDirty={item.componentData.allowKeystopPassthrough !== savedItem.componentData.allowKeystopPassthrough}
      preserveDirtyProp={true}
    />
    <KeystopKeys
      invertView={invertView}
      hasMultiple={overrides.includes('keys')}
      isEditor={isEditor}
      itemId={item.id}
      itemIsLocked={isLocked}
      options={$keystopKeysOptions}
      optionsInit={$keystopKeysInitOptions}
      bind:keys={item.componentData.keys}
      isDirty={compareArrays(item.componentData.keys, savedItem.componentData.keys)}
      preserveDirtyProp={true}
      on:restoreSignal={() => restoreKeys()}
    />
  {/if}

  <span class="a11y-header">Labels
    <FormUnit
      className="form-row form-unit fixed-150"
      kind="inputSwitch"
      nameId={`has-labels-${item.id}`}
      invertView={invertView}
      itemIsLocked={isLocked}
      hasMultiple={overrides.includes('hasLabels')}
      isDirty={savedItem.componentData.hasLabels !== item.componentData.hasLabels}
      bind:value={item.componentData.hasLabels}
      preserveDirtyProp={true}
      a11yField={true}
    />
  </span>

  {#if item.componentData.hasLabels}
    <FormUnit
      className="form-row form-unit fixed-150"
      disableCopy={true}
      hasMultiple={overrides.includes('role')}
      invertView={invertView}
      itemIsLocked={isLocked}
      kind="inputSelect"
      labelText="Role"
      nameId={`item-aria-role-${item.id}`}
      options={setBulkSelectOptions($roleOptions, item.componentData.role, isEditor)}
      bind:value={item.componentData.role}
      isDirty={item.componentData.role !== savedItem.componentData.role}
      preserveDirtyProp={true}
      a11yField={true}
    />
    <AriaLabels 
      role={item.componentData.role}
      invertView={invertView}
      overrides={overrides}
      isEditor={isEditor}
      itemId={item.id}
      itemIsLocked={isLocked}
      savedLabels={savedItem.componentData.labels}
      bind:labels={item.componentData.labels}
    />
  {/if}

  <span class="a11y-header">
    Heading
    <FormUnit
      className="form-row form-unit fixed-150"
      kind="inputSwitch"
      nameId={`has-heading-${item.id}`}
      invertView={invertView}
      itemIsLocked={isLocked}
      hasMultiple={overrides.includes('hasHeading')}
      isDirty={savedItem.componentData.hasHeading !== item.componentData.hasHeading}
      bind:value={item.componentData.hasHeading}
      preserveDirtyProp={true}
      a11yField={true}
    />
  </span>
  {#if item.componentData.hasHeading}
    <AriaHeading 
      invertView={invertView}
      overrides={overrides}
      isEditor={isEditor}
      itemId={item.id}
      itemIsLocked={isLocked}
      savedHeading={savedItem.componentData.heading}
      bind:heading={item.componentData.heading}
    />
  {/if}
{/if}
