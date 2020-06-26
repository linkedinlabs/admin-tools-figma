<script>
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import { sessionKey } from './stores';
  import FigmaInput from './forms-controls/FigmaInput';
  import FormLabel from './forms-controls/FormLabel';
  import FormUnit from './forms-controls/FormUnit';

  export let description = null;
  export let invertView = false;
  export let isEditor = false;
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

        const newKeyValue = {
          key: split[keyIndex].replace(': ', ''),
          value: split[valueIndex] || null,
        };

        if (!currentDescriptionArray.includes(newKeyValue)) {
          let keyExists = false;
          currentDescriptionArray.forEach((keyValue) => {
            if (keyValue.key === newKeyValue.key) {
              keyExists = true;
              if (keyValue.value !== newKeyValue.value) {
                keyValue.value = null; // eslint-disable-line no-param-reassign
              }
            }
          });

          if (!keyExists) {
            currentDescriptionArray.push(newKeyValue);
          }
        }
      }
    });

    return currentDescriptionArray;
  };

  const compileDescription = (currentDescriptionArray) => {
    let string = null;
    const stringArray = [];
    currentDescriptionArray.forEach((item) => {
      let snippet = `${item.key}: ${item.value}`;
      if (!item.value) {
        snippet = `${item.key}: `;
      }
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
      if (!isEditor) {
        // remove it
        descriptionArray = [
          ...descriptionArray.slice(0, keyIndex),
          ...descriptionArray.slice(keyIndex + 1),
        ];
      } else {
        // for editor, add a flag
        descriptionArray[keyIndex].value = `remove-${$sessionKey}`;
      }

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
    hasMultiple={isEditor && descriptionEntry.value === null}
    invertView={invertView}
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
    invertView={invertView}
    labelText="Add new…"
    nameId={`add-new-description-key-${itemId}`}
    disableActions={true}
  />
  <FigmaInput
    className="form-element element-type-text-new split-40"
    disabled={isLocked}
    invertView={invertView}
    nameId={`add-new-description-key-${itemId}`}
    placeholder="Add stuff to me…"
    on:saveSignal={() => addEntry(newKeyValuePair)}
    bind:value={newKeyValuePair.key}
  />
  <FigmaInput
    className="form-element element-type-text-new split-60"
    disabled={isLocked}
    invertView={invertView}
    nameId={`add-new-description-value-${itemId}`}
    placeholder="Add other stuff to me…"
    on:saveSignal={() => addEntry(newKeyValuePair)}
    bind:value={newKeyValuePair.value}
  />
</span>
