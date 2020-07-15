<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import {
    isStyles,
    libraryOptions,
    libraryStatusOptions,
  } from './stores';
  import Description from './Description';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormActions from './forms-controls/FormActions';
  import FormUnit from './forms-controls/FormUnit';
  import { deepCopy, deepCompare } from '../Tools';

  export let isLocked = false;
  export let item = null;

  let dirtyItem = deepCopy(item);
  let originalItem = deepCopy(item);
  let isDirty = false;
  let resetValue = false;
  let wasResetValue = false;

  const handleReset = () => {
    originalItem = deepCopy(item);
    dirtyItem = deepCopy(item);
    isDirty = false;
    resetValue = true;
  };

  const handleSave = () => {
    parent.postMessage({
      pluginMessage: {
        action: 'submit',
        payload: { updatedItem: dirtyItem },
      },
    }, '*');
  };

  beforeUpdate(() => {
    // check `item` against dirty to see if it was updated in the form
    isDirty = deepCompare(item, dirtyItem);

    // check `item` against original to see if it was updated on the Figma side
    if (deepCompare(item, originalItem)) {
      resetValue = true;
    }

    // tee off a full reset
    if (resetValue) {
      handleReset();
    }

    // set tracker
    wasResetValue = resetValue;
  });

  afterUpdate(() => {
    if (resetValue || wasResetValue) {
      resetValue = false;
    }
  });
</script>

<section class={`expanded-content${isLocked ? ' locked' : ''}`}>
  <span class="divider-top"><hr class="inner"></span>

  <span class="form-element-holder">
    {#if item.group}
      <span class="form-row">
        <FormUnit
          className="form-unit split-40"
          itemIsLocked={isLocked}
          kind="inputText"
          labelText="Group&nbsp;&nbsp;&nbsp;/"
          nameId={`item-group-${item.id}`}
          resetValue={resetValue}
          on:saveSignal={() => handleSave()}
          bind:value={dirtyItem.group}
        />
        <FormUnit
          className="form-unit split-60"
          itemIsLocked={isLocked}
          kind="inputText"
          labelText="Name"
          nameId={`item-name-${item.id}`}
          resetValue={resetValue}
          on:saveSignal={() => handleSave()}
          bind:value={dirtyItem.name}
        />
      </span>
    {:else}
      <FormUnit
        className="form-row"
        itemIsLocked={isLocked}
        kind="inputText"
        labelText="Name"
        nameId={`item-name-${item.id}`}
        resetValue={resetValue}
        on:saveSignal={() => handleSave()}
        bind:value={dirtyItem.name}
      />
    {/if}

    <Description
      bind:description={dirtyItem.description}
      isLocked={isLocked}
      itemId={item.id}
      resetValue={resetValue}
      on:saveSignal={() => handleSave()}
    />

    {#if !$isStyles}
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
        bind:value={dirtyItem.componentData.library}
      />

      <FormUnit
        className="form-row"
        itemIsLocked={isLocked}
        kind="inputText"
        labelText="Annotation text override"
        nameId={`item-annotationText-${item.id}`}
        placeholder="Add an engineering-specific annotation…"
        resetValue={resetValue}
        on:saveSignal={() => handleSave()}
        bind:value={dirtyItem.componentData.annotationText}
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
          bind:value={dirtyItem.componentData.usageStatus}
        />
        <FormUnit
          className="form-unit split-40"
          itemIsLocked={isLocked}
          kind="inputText"
          labelText="Version"
          nameId={`item-version-${item.id}`}
          placeholder="1.0"
          resetValue={resetValue}
          on:saveSignal={() => handleSave()}
          bind:value={dirtyItem.componentData.version}
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
        on:saveSignal={() => handleSave()}
        bind:value={dirtyItem.componentData.documentationUri}
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
          bind:value={dirtyItem.componentData.isInteractive}
        />
      </span>
    {/if}
  </span>

  {#if isDirty}
    <FormActions
      on:resetSignal={() => handleReset()}
      on:saveSignal={() => handleSave()}
    />
  {/if}
</section>
