<script>
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import FigmaInput from './forms-controls/FigmaInput';
  import FormLabel from './forms-controls/FormLabel';
  import FormUnit from './forms-controls/FormUnit';

  export let description = null;
  export let isLocked = false;
  export let itemId = null;
  export let resetValue = false;

  const dispatch = createEventDispatcher();
  let descriptionArray = [];
  let newKeyValuePair = {
    key: null,
    value: null,
  };

  /** WIP
   * @description Looks into the selection array for any groups and pulls out individual nodes,
   * effectively flattening the selection.
   *
   * @kind function
   * @name parseDescription
   *
   * @returns {Object} All items (including children) individual in an updated array.
   */
  const parseDescription = (currentDescription) => {
    const currentDescriptionArray = [];
    const lineArray = currentDescription.split('\n');

    lineArray.forEach((line) => {
      if (line && line !== '') {
        const keyIndex = 0;
        const valueIndex = 1;
        const split = line.split(/: (.+)/);

        currentDescriptionArray.push({
          key: split[keyIndex],
          value: split[valueIndex],
        });
      }
    });

    return currentDescriptionArray;
  };

  const compileDescription = (currentDescriptionArray) => {
    let string = null;
    const stringArray = [];
    currentDescriptionArray.forEach((item) => {
      const snippet = `${item.key}: ${item.value}`;
      stringArray.push(snippet);
    });

    string = stringArray.join('\n');
    return string;
  };

  const addEntry = (keyValuePair) => {
    const { key, value } = keyValuePair;
    const keyExists = descriptionArray.filter(item => item.key === key).length !== 0;

    // add new description entry if unique
    if (!keyExists && key && value) {
      descriptionArray.push(keyValuePair);
      description = compileDescription(descriptionArray);
      newKeyValuePair = {
        key: null,
        value: null,
      };
      dispatch('saveSignal');
    }
  };

  const removeEntry = (key) => {
    const keyIndex = descriptionArray.findIndex(item => item.key === key);

    if (keyIndex > -1) {
      // remove it
      descriptionArray = [
        ...descriptionArray.slice(0, keyIndex),
        ...descriptionArray.slice(keyIndex + 1),
      ];

      description = compileDescription(descriptionArray);
      dispatch('saveSignal');
    }
  };

  afterUpdate(() => {
    if (description && descriptionArray.length < 1) {
      // update display array
      descriptionArray = parseDescription(description);
    }

    if (!resetValue) {
      // update bound description
      description = compileDescription(descriptionArray);
    }

    if (resetValue) {
      // update display array because of parent-level changes
      descriptionArray = parseDescription(description);
    }
  });
</script>

{#each descriptionArray as descriptionEntry, i (descriptionEntry.key)}
  <FormUnit
    className="form-row"
    on:deleteSignal={() => removeEntry(descriptionEntry.key)}
    isDeletable={true}
    itemIsLocked={isLocked}
    kind="inputText"
    labelText={descriptionEntry.key}
    nameId={`item-description-${i}-${itemId}`}
    placeholder="Type something…"
    resetValue={resetValue}
    on:saveSignal
    bind:value={descriptionEntry.value}
  />
{/each}

<span class="form-row">
  <FormLabel
    labelText="Add new…"
    nameId={`add-new-description-key-${itemId}`}
    disableActions={true}
  />
  <FigmaInput
    className="form-element element-type-text-new split-40"
    disabled={isLocked}
    nameId={`add-new-description-key-${itemId}`}
    placeholder="Add stuff to me…"
    on:saveSignal={() => addEntry(newKeyValuePair)}
    bind:value={newKeyValuePair.key}
  />
  <FigmaInput
    className="form-element element-type-text-new split-60"
    disabled={isLocked}
    nameId={`add-new-description-value-${itemId}`}
    placeholder="Add other stuff to me…"
    on:saveSignal={() => addEntry(newKeyValuePair)}
    bind:value={newKeyValuePair.value}
  />
</span>
