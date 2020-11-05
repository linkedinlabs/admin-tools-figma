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
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormUnit from './forms-controls/FormUnit';
  import KeystopKeys from './KeystopKeys';
  import { checkFilterMatch, deepCopy } from '../Tools';

  export let invertView = false;
  export let isEditor = false;
  export let item = null;
  export let isLocked = false;
  export let resetValue = false;

  const setClasses = (classes, hasValues) => {
    if (hasValues) {
      return `${classes} has-multiple`;
    }
    return classes;
  };

  const setOptions = (options, currentValue, addNullAllowed) => {
    let finalizedOptions = options;
    if (addNullAllowed && (currentValue === null || currentValue === 'blank--multiple')) {
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

{#if checkFilterMatch($currentFilter, 'design-system')}
  <span
    class={`form-row form-header${invertView ? ' invert' : ''}`}
  >
    Design System
  </span>

  <FormUnit
    className="form-row form-unit split-50"
    disableCopy={true}
    hasMultiple={isEditor && item.componentData.library === 'blank--multiple'}
    invertView={invertView}
    itemIsLocked={isLocked}
    kind="inputSelect"
    labelText="Library"
    nameId={`item-library-${item.id}`}
    options={setOptions($libraryOptions, item.componentData.library, isEditor)}
    resetValue={resetValue}
    bind:value={item.componentData.library}
  />

  <ComponentVariants
    hasMultiple={isEditor && item.componentData.variants === 'blank--multiple'}
    invertView={invertView}
    isLocked={isLocked}
    itemId={item.id}
    resetValue={resetValue}
    bind:variants={item.componentData.variants}
  />

  <FormUnit
    className={setClasses('form-row', isEditor && item.componentData.annotationTextHasValues)}
    hasMultiple={isEditor && item.componentData.annotationTextHasValues && item.componentData.keys.length === 0}
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
      options={setOptions($libraryStatusOptions, item.componentData.usageStatus, isEditor)}
      resetValue={resetValue}
      bind:value={item.componentData.usageStatus}
    />
    <FormUnit
      className={setClasses('form-unit split-40', isEditor && item.componentData.versionHasValues)}
      hasMultiple={isEditor && item.componentData.versionHasValues}
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
    className={setClasses('form-row', isEditor && item.componentData.documentationUriHasValues)}
    hasMultiple={isEditor && item.componentData.documentationUriHasValues}
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
  <span
    class={`form-row form-header${invertView ? ' invert' : ''}`}
  >
    Purpose & Interaction
  </span>

  <span class="form-row">
    <FigmaSwitch
      className="form-element element-type-switch"
      disabled={isLocked}
      hasMultiple={isEditor && item.componentData.hasKeystopHasValues}
      invertView={invertView}
      labelText="Has a focus stop?"
      nameId={`has-keystop-${item.id}`}
      bind:value={item.componentData.hasKeystop}
    />
  </span>

  {#if item.componentData.hasKeystop}
    <KeystopKeys
      invertView={invertView}
      hasMultiple={isEditor && item.componentData.keysHasValues}
      isEditor={isEditor}
      itemId={item.id}
      bind:keys={item.componentData.keys}
      options={$keystopKeysOptions}
      optionsInit={$keystopKeysInitOptions}
      resetValue={resetValue}
      setOptions={setOptions}
    />
    <span class="form-row indent">
      <FigmaSwitch
        className="form-element element-type-switch"
        disabled={isLocked}
        hasMultiple={isEditor && item.componentData.allowKeystopPassthroughHasValues}
        invertView={invertView}
        labelText="Allow pass-through focus?"
        nameId={`allow-keystop-passthrough-${item.id}`}
        bind:value={item.componentData.allowKeystopPassthrough}
      />
    </span>
  {/if}

  <FormUnit
    className="form-row form-unit split-50"
    disableCopy={true}
    hasMultiple={isEditor && item.componentData.role === 'blank--multiple'}
    invertView={invertView}
    itemIsLocked={isLocked}
    kind="inputSelect"
    labelText="ARIA Role"
    nameId={`item-aria-role-${item.id}`}
    options={setOptions($roleOptions, item.componentData.role, isEditor)}
    resetValue={resetValue}
    bind:value={item.componentData.role}
  />
{/if}
