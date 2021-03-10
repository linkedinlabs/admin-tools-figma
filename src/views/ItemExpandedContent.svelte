<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import { currentFilter, isStyles } from './stores';
  import ComponentData from './ComponentData';
  import Description from './Description';
  import FormActions from './forms-controls/FormActions';
  import FormUnit from './forms-controls/FormUnit';
  import {
    checkFilterMatch,
    deepCopy,
    deepCompare,
  } from '../Tools';

  export let isLocked = false;
  export let item = null;

  let dirtyItem = deepCopy(item);
  let originalItem = deepCopy(item);
  let isDirty = false;
  let resetValue = false;
  let wasCurrentFilter = $currentFilter;
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

    // check if filter has changed (components only)
    if (!$isStyles && (wasCurrentFilter !== $currentFilter)) {
      resetValue = true;
    }

    // tee off a full reset
    if (resetValue) {
      handleReset();
    }

    // set trackers
    wasCurrentFilter = $currentFilter;
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
    {#if $isStyles || checkFilterMatch($currentFilter, 'all-components')}
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
    {/if}

    {#if !$isStyles && dirtyItem.componentData}
      <ComponentData
        bind:item={dirtyItem}
        savedItem={originalItem}
        isLocked={isLocked}
        resetValue={resetValue}
        isAllTab={$currentFilter === 'all-components'}
        on:saveSignal={() => handleSave()}
      />
    {/if}
  </span>

  {#if isDirty}
    <FormActions
      on:resetSignal={() => handleReset()}
      on:saveSignal={() => handleSave()}
    />
  {/if}
</section>
