<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  // import { lockedItems } from './stores';
  import FigmaInput from './forms-controls/FigmaInput';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormLabel from './forms-controls/FormLabel';
  import FormUnit from './forms-controls/FormUnit';

  export let editableItems = [];

  let editableItemIds = [];
  let resetItems = false;
  const editorItem = {
    id: 'editor-item',
    description: {
      value: null,
      hasValues: false,
    },
    group: {
      value: null,
      hasValues: false,
    },
    kind: {
      value: null,
      hasValues: false,
    },
    name: {
      value: null,
      hasValues: false,
    },
  };

  const setEditorItem = (itemsToCompare) => {
    const descriptions = [];
    const groups = [];
    const names = [];

    itemsToCompare.forEach((item) => {
      if (!descriptions.includes(item.description)) {
        descriptions.push(item.description);
      }
      if (!groups.includes(item.group)) {
        groups.push(item.group);
      }
      if (!names.includes(item.name)) {
        names.push(item.name);
      }
    });

    if (groups.length >= 1) {
      editorItem.group.value = groups.length === 1 ? groups[0] : null;
      editorItem.group.hasValues = true;
    }

    if (names.length >= 1) {
      editorItem.name.value = names.length === 1 ? names[0] : null;
      editorItem.name.hasValues = true;
    }

    if (descriptions.length >= 1) {
      editorItem.description.value = descriptions.length === 1 ? descriptions[0] : null;
      editorItem.description.hasValues = true;
    }
  };

  const extractValue = (item) => {
    if (item.value && item.hasValues) {
      return item.value;
    }
    return null;
  };

  const setClasses = (classes, item) => {
    if (!item.value && item.hasValues) {
      return `${classes} has-multiple`;
    }
    return classes;
  };

  const hasMultiple = item => (!item.value && item.hasValues);

  beforeUpdate(() => {
    if (editableItemIds !== editableItems.itemsIdArray) {
      resetItems = true;
    }
  });

  afterUpdate(() => {
    setEditorItem(editableItems.items);
    editableItemIds = editableItems.itemsIdArray;

    if (resetItems) {
      resetItems = false;
    }
  });
</script>

<section class="expanded-content editor">
  <span class="divider-top"><hr class="inner"></span>

  <span class="form-element-holder">
    <span class="form-row">
      <FormUnit
        className={setClasses('form-unit split-40', editorItem.group)}
        hasMultiple={hasMultiple(editorItem.name)}
        invertView={true}
        kind="inputText"
        labelText="Group&nbsp;&nbsp;&nbsp;/"
        nameId="editor-test-group"
        resetValue={resetItems}
        value={extractValue(editorItem.group)}
      />
      <FormUnit
        className={setClasses('form-unit split-60', editorItem.name)}
        hasMultiple={hasMultiple(editorItem.name)}
        invertView={true}
        kind="inputText"
        labelText="Name"
        nameId="editor-test-name"
        resetValue={resetItems}
        value={extractValue(editorItem.name)}
      />
    </span>
    
    <FormUnit
      className={setClasses('form-row', editorItem.description)}
      hasMultiple={hasMultiple(editorItem.name)}
      invertView={true}
      kind="inputTextarea"
      labelText="Description"
      nameId="editor-test-description"
      placeholder="Description"
      resetValue={resetItems}
      value={extractValue(editorItem.description)}
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
</section>
