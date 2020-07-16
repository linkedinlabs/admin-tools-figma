<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import { isStyles } from './stores';
  import ComponentData from './ComponentData';
  import Description from './Description';
  import FormActions from './forms-controls/FormActions';
  import FormUnit from './forms-controls/FormUnit';
  import { deepCopy, deepCompare } from '../Tools';

  export let editorItem;
  export let editableItemIds = [];

  let originalEditableItemIds = editableItemIds;
  let dirtyItem = deepCopy(editorItem);
  let originalItem = deepCopy(editorItem);
  let isDirty = false;
  let itemCount = originalEditableItemIds.length;
  let resetValue = false;
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

  const setClasses = (classes, hasValues) => {
    if (hasValues) {
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

    // set tracker
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

  <span class="form-element-holder">
    <span class="form-row">
      <FormUnit
        className={setClasses('form-unit split-40', editorItem.groupHasValues)}
        hasMultiple={editorItem.groupHasValues}
        invertView={true}
        kind="inputText"
        labelText="Group&nbsp;&nbsp;&nbsp;/"
        nameId="editor-test-group"
        resetValue={resetValue}
        on:saveSignal={() => handleSave(dirtyItem, editableItemIds)}
        bind:value={dirtyItem.group}
      />
      <FormUnit
        className={setClasses('form-unit split-60', editorItem.nameHasValues)}
        hasMultiple={editorItem.nameHasValues}
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

    {#if !$isStyles && dirtyItem.componentData}
      <ComponentData
        invertView={true}
        isEditor={true}
        bind:item={dirtyItem}
        resetValue={resetValue}
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
