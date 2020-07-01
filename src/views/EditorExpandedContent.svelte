<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import Description from './Description';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormUnit from './forms-controls/FormUnit';

  export let editorItem;
  export let editableItemIds = [];

  let originalEditableItemIds = editableItemIds;
  let dirtyItem = Object.assign({}, editorItem);
  let originalItem = Object.assign({}, editorItem);
  let isDirty = false;
  let itemCount = originalEditableItemIds.length;
  let resetValue = false;
  let wasResetValue = false;

  const handleReset = () => {
    originalItem = Object.assign({}, editorItem);
    dirtyItem = Object.assign({}, editorItem);
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
    isDirty = false;
    Object.entries(editorItem).forEach(([key, value]) => {
      if (dirtyItem[key] !== value) {
        isDirty = true;
      }
    });

    // check `editorItem` against original to see if it was updated on the Figma side
    Object.entries(editorItem).forEach(([key, value]) => {
      if (originalItem[key] !== value) {
        resetValue = true;
      }
    });

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

    <FormUnit
      className="form-row"
      disableCopy={true}
      invertView={true}
      kind="inputSelect"
      labelText="Library"
      nameId="editor-test-library"
      value="component"
    />

    <span class="form-row">
      <FigmaSwitch
        className="form-element element-type-switch"
        invertView={true}
        labelText="Interactive?"
        nameId="is-interactive"
      />
    </span>
  </span>

  {#if isDirty}
    <span>
      <button
        on:click={() => handleReset()}
      >
        Restore
      </button>
      <button
        on:click={() => handleSave(dirtyItem, editableItemIds)}
      >
        Save Changes
      </button>
    </span>
  {/if}
</section>
