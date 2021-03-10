<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import { currentFilter, isStyles } from './stores';
  import ComponentData from './ComponentData';
  import Description from './Description';
  import FormActions from './forms-controls/FormActions';
  import FormUnit from './forms-controls/FormUnit';
  import IconInline from './IconInline';
  import {
    checkFilterMatch,
    deepCopy,
    deepCompare,
  } from '../Tools';

  export let editorItem;
  export let editableItemIds = [];

  let originalEditableItemIds = editableItemIds;
  let dirtyItem = deepCopy(editorItem);
  let originalItem = deepCopy(editorItem);
  let isDirty = false;
  let itemCount = originalEditableItemIds.length;
  let resetValue = false;
  let wasCurrentFilter = $currentFilter;
  let wasResetValue = false;

  const handleReset = () => {
    originalItem = deepCopy(editorItem);
    dirtyItem = deepCopy(editorItem);
    originalEditableItemIds = editableItemIds;
    isDirty = false;
    resetValue = true;
  };

  const handleSave = (currentItem, itemIds) => {
    parent.postMessage({
      pluginMessage: {
        action: 'submit-bulk',
        payload: {
          updatedItem: dirtyItem,
          itemIds,
        },
      },
    }, '*');
  };

  const setClasses = (classes, hasMultiple) => {
    if (hasMultiple) {
      return `${classes} has-multiple`;
    }
    return classes;
  };

  const compareEditableIds = (currentArray, originalArray) => {
    let isEqual = true;
    currentArray.forEach((id) => {
      if (!originalArray.includes(id)) {
        isEqual = false;
      }
    });

    originalArray.forEach((id) => {
      if (!currentArray.includes(id)) {
        isEqual = false;
      }
    });

    return isEqual;
  };

  beforeUpdate(() => {
    // check `editorItem` against dirty to see if it was updated in the form
    isDirty = deepCompare(editorItem, dirtyItem);

    // check `editorItem` against original to see if it was updated on the Figma side
    if (deepCompare(editorItem, originalItem)) {
      resetValue = true;
    }

    // check if filter has changed (components only)
    if (!$isStyles && (wasCurrentFilter !== $currentFilter)) {
      resetValue = true;
    }

    // check selected item ids against original to see if items were locked/unlocked
    if (!compareEditableIds(editableItemIds, originalEditableItemIds)) {
      originalEditableItemIds = editableItemIds;
      itemCount = originalEditableItemIds.length;
      handleReset();
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

<section class="expanded-content editor">
  <span class="divider-top"><hr class="inner"></span>
  {#if editorItem.overrides && editorItem.overrides.length > 0}
    <p class="banner-text">
      <strong>WARNING:</strong>
      Fields marked with
      <IconInline
        invertView={true}
        isWarning={true}
      >
        <svg viewBox="0 0 512 512">
          <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
        </svg>
      </IconInline>
      have conflicting values in your selection that will be overridden if changed.
    </p>
  {/if}
  <span class="form-element-holder">
    {#if $isStyles || checkFilterMatch($currentFilter, 'all-components')}
      <span class="form-row">
        <FormUnit
          className={setClasses('form-unit split-40', editorItem.overrides.includes('group'))}
          hasMultiple={editorItem.overrides.includes('group')}
          invertView={true}
          kind="inputText"
          labelText="Group&nbsp;&nbsp;&nbsp;/"
          nameId="editor-test-group"
          resetValue={resetValue}
          on:saveSignal={() => handleSave(dirtyItem, editableItemIds)}
          bind:value={dirtyItem.group}
        />
        <FormUnit
          className={setClasses('form-unit split-60', editorItem.overrides.includes('name'))}
          hasMultiple={editorItem.overrides.includes('name')}
          invertView={true}
          kind="inputText"
          labelText="Name"
          nameId="editor-test-name"
          resetValue={resetValue}
          on:saveSignal={() => handleSave(dirtyItem, editableItemIds)}
          bind:value={dirtyItem.name}
        />
      </span>

      <Description
        bind:description={dirtyItem.description}
        invertView={true}
        isEditor={true}
        itemCount={itemCount}
        itemId="editor-test"
        resetValue={resetValue}
        on:saveSignal={() => handleSave(dirtyItem, editableItemIds)}
      />
    {/if}

    {#if !$isStyles && dirtyItem.componentData}
      <ComponentData
        invertView={true}
        isEditor={true}
        bind:item={dirtyItem}
        savedItem={originalItem}
        resetValue={resetValue}
        overrides={editorItem.overrides}
        isAllTab={$currentFilter === 'all-components'}
        on:saveSignal={() => handleSave(dirtyItem, editableItemIds)}
      />
    {/if}
  </span>

  {#if isDirty}
    <FormActions
      invertView={true}
      on:resetSignal={() => handleReset()}
      on:saveSignal={() => handleSave(dirtyItem, editableItemIds)}
    />
  {/if}
</section>
