<script>
  import { afterUpdate, beforeUpdate, createEventDispatcher } from 'svelte';
  import { sessionKey } from './stores';
  import FigmaInput from './forms-controls/FigmaInput';
  import FormLabel from './forms-controls/FormLabel';
  import FormUnit from './forms-controls/FormUnit';

  export let description = null;
  export let invertView = false;
  export let isEditor = false;
  export let isLocked = false;
  export let itemCount = 1;
  export let itemId = null;
  export let resetValue = false;

  const dispatch = createEventDispatcher();
  let descriptionArray = [];
  let lockedKeys = [];
  let newKeyValuePair = {
    key: null,
    value: null,
    count: 0,
  };

  /**
   * @description Takes a `currentDescription` string and parses it: splitting each
   * line into an array, and further splitting each line into a key/value pair using the
   * `:` as the signifier for the end of the key.
   *
   * @kind function
   * @name parseDescription
   *
   * @param {string} currentDescription A string representing the node/style description
   * to be parsed.
   *
   * @returns {Array} The parsed description as an array of key/value pairs.
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
          count: 1,
        };

        if (!currentDescriptionArray.includes(newKeyValue)) {
          let keyExists = false;
          currentDescriptionArray.forEach((keyValue) => {
            if ((keyValue.key === newKeyValue.key)) {
              keyExists = true;
              if (
                (keyValue.value !== newKeyValue.value)
                && (keyValue.value !== `remove-${$sessionKey}`)
              ) {
                keyValue.value = null; // eslint-disable-line no-param-reassign
              }
              keyValue.count += 1; // eslint-disable-line no-param-reassign
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

  const parseDescriptionSimple = (currentDescription) => {
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

        currentDescriptionArray.push(newKeyValue);
      }
    });

    return currentDescriptionArray;
  };

  const compileDescription = (updatedDescriptionArray, existingDescription) => {
    let existingDescriptionArray = [];

    // for bulk editing, use descriptions from all selected
    if (isEditor) {
      existingDescriptionArray = parseDescriptionSimple(existingDescription);

      updatedDescriptionArray.forEach((updatedDescriptionItem) => {
        if (updatedDescriptionItem.value && !lockedKeys.includes(updatedDescriptionItem.key)) {
          let keyExists = false;
          existingDescriptionArray.forEach((item) => {
            if (item.key === updatedDescriptionItem.key) {
              keyExists = true;
              item.value = updatedDescriptionItem.value; // eslint-disable-line no-param-reassign
            }
          });

          if (!keyExists) {
            let currentCount = 0;
            while (currentCount < itemCount) {
              existingDescriptionArray.push(updatedDescriptionItem);
              currentCount += 1;
            }
          }
        }
      });

      // temporarily remove keys of locked fields
      lockedKeys.forEach((key) => {
        const keyIndexes = [];
        existingDescriptionArray.forEach((item, index) => {
          if (item.key === key) {
            keyIndexes.push(index);
          }
        });

        if (keyIndexes.length > 0) {
          // remove each
          keyIndexes.forEach((keyIndex) => {
            existingDescriptionArray = [
              ...existingDescriptionArray.slice(0, keyIndex),
              ...existingDescriptionArray.slice(keyIndex + 1),
            ];
          });
        }
      });
    } else {
      existingDescriptionArray = updatedDescriptionArray;
    }

    // compile the description
    let string = null;
    const stringArray = [];
    existingDescriptionArray.forEach((item) => {
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
      description = compileDescription(descriptionArray, description);
      newKeyValuePair = {
        key: null,
        value: null,
        count: 0,
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

      description = compileDescription(descriptionArray, description);
      dispatch('saveSignal');
    }
  };

  const handleLockUnlock = (key, inputIsLocked) => {
    if (inputIsLocked) {
      if (!lockedKeys.includes(key)) {
        lockedKeys.push(key);
      }
    } else {
      const keyIndex = lockedKeys.findIndex(foundKey => foundKey === key);
      if (keyIndex > -1) {
        // remove it
        lockedKeys = [
          ...lockedKeys.slice(0, keyIndex),
          ...lockedKeys.slice(keyIndex + 1),
        ];
      }
    }

    // trigger an update
    description = compileDescription(descriptionArray, description);
  };

  const editorLabel = (labelText, count) => {
    let fullText = labelText;
    if (itemCount !== count) {
      const endText = count === 1 ? 'field' : 'fields';
      fullText = `${labelText} (${count} ${endText})`;
    }
    return fullText;
  };

  beforeUpdate(() => {
    if (resetValue) {
      // update display array because of parent-level changes
      descriptionArray = parseDescription(description);
      description = compileDescription(descriptionArray, description);
    }
  });

  afterUpdate(() => {
    if (description && descriptionArray.length < 1) {
      // update display array
      descriptionArray = parseDescription(description);
    }

    if (!resetValue && description && descriptionArray.length > 0) {
      description = compileDescription(descriptionArray, description);
    }
  });
</script>

<span
  class={`form-row form-header${invertView ? ' invert' : ''}`}
>
  Description Metadata
</span>

{#each descriptionArray as descriptionEntry, i (descriptionEntry.key)}
  <FormUnit
    className={`form-row${isEditor && (descriptionEntry.value === null) ? ' has-multiple' : ''}`}
    on:deleteSignal={() => removeEntry(descriptionEntry.key)}
    hasMultiple={isEditor && descriptionEntry.value === null}
    invertView={invertView}
    isDeletable={true}
    itemIsLocked={isLocked}
    kind="inputText"
    labelText={!isEditor ? descriptionEntry.key : editorLabel(descriptionEntry.key, descriptionEntry.count)}
    on:lockUnlockSignal={customEvent => handleLockUnlock(descriptionEntry.key, customEvent.detail)}
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
    placeholder="Label (i.e. ”Token”)"
    on:saveSignal={() => addEntry(newKeyValuePair)}
    bind:value={newKeyValuePair.key}
  />
  <FigmaInput
    className="form-element element-type-text-new split-60"
    disabled={isLocked}
    invertView={invertView}
    nameId={`add-new-description-value-${itemId}`}
    placeholder="Value (i.e. primary-01”)"
    on:saveSignal={() => addEntry(newKeyValuePair)}
    bind:value={newKeyValuePair.value}
  />
</span>
