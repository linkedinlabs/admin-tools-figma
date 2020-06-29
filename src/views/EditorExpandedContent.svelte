<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import Description from './Description';
  import FigmaInput from './forms-controls/FigmaInput';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormLabel from './forms-controls/FormLabel';
  import FormUnit from './forms-controls/FormUnit';

  export let editorItem;
  export let editableItemIds = [];

  let originalEditableItemIds = editableItemIds;
  let dirtyItem = Object.assign({}, editorItem);
  let originalItem = Object.assign({}, editorItem);
  let isDirty = false;
  let itemCount = originalEditableItemIds.length;
  let resetValue = false;

  const handleReset = () => {
    dirtyItem = Object.assign({}, editorItem);
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

    if (!compareEditableIds(editableItemIds, originalEditableItemIds)) {
      originalEditableItemIds = editableItemIds;
      itemCount = originalEditableItemIds.length;
      handleReset();
    }
  });

  afterUpdate(() => {
    if (resetValue) {
      resetValue = false;
      originalItem = Object.assign({}, editorItem);
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
      className={setClasses('form-row', editorItem.descriptionHasValues)}
      hasMultiple={editorItem.descriptionHasValues}
      invertView={true}
      kind="inputTextarea"
      labelText="Description"
      nameId="editor-test-description"
      placeholder="Description"
      resetValue={resetValue}
      value={dirtyItem.description}
    />

    <span class="form-row">
      <FormLabel
        invertView={true}
        labelText="Add new…"
        nameId="add-new-label"
        disableActions={true}
      />
      <FigmaInput
        className="form-element element-type-text-new split-40"
        invertView={true}
        nameId="add-new-label"
        placeholder="Add stuff to me…"
      />
      <FigmaInput
        className="form-element element-type-text-new split-60"
        invertView={true}
        nameId="add-new-text"
        placeholder="Add other stuff to me…"
      />
    </span>

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
