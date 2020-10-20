<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormUnit from './forms-controls/FormUnit';
  import { updateArray } from '../Tools';

  export let invertView = false;
  export let isEditor = false;
  export let itemId = null;
  export let options = null;
  export let optionsInit = null;
  export let keys = null;
  export let resetValue = false;
  export let setOptions = null;

  let newKeyValue = 'no-key';
  let dirtyKeys = keys ? [...keys] : [];
  let originalKeys = keys ? [...keys] : [];
  // tktk
  let hasMultiple = false;

  const addKey = (keyToAdd) => {
    console.log(`add me: ${keyToAdd}`);
    // check for existing and add if it does not exist
    const keyIndex = dirtyKeys.findIndex(key => key === keyToAdd);
    if (keyIndex < 0) {
      dirtyKeys.push(keyToAdd);
    };
  };

  const removeKey = (keyToRemove) => {
    console.log(`remove me: ${keyToRemove}`);
    const keyIndex = dirtyKeys.findIndex(key => key === keyToRemove);
    if (keyIndex > -1) {
      dirtyKeys = [
        ...dirtyKeys.slice(0, keyIndex),
        ...dirtyKeys.slice(keyIndex + 1),
      ];
    };
    newKeyValue = 'no-key';
  };

  const updateKey = (currentKeys, keyToUpdate, oldKeyIndex) => {
    const oldKey = currentKeys[oldKeyIndex];
    if (oldKey !== keyToUpdate) {
      removeKey(oldKey);

      if (keyToUpdate !== 'no-key') {
        addKey(keyToUpdate);
      }
    }
  };

  const compareArrays = (array1, array2) => {
    let isDifferent = false;

    if (!array1 && !array2) {
      return isDifferent;
    }

    if (
      (!array1 && array2)
      || (!array2 && array1)
    ) {
      isDifferent = true;
      return isDifferent;
    }

    if (array1.length !== array2.length) {
      isDifferent = true;
      return isDifferent;
    }

    array1.forEach((value) => {
      const itemIndex = array2.findIndex(
        foundValue => (foundValue === value),
      );

      if (itemIndex < 0) {
        isDifferent = true;
      }
    });

    if (isDifferent) {
      return isDifferent;
    }

    array2.forEach((value) => {
      const itemIndex = array1.findIndex(
        foundValue => (foundValue === value),
      );

      if (itemIndex < 0) {
        isDifferent = true;
      }
    });

    return isDifferent;
  };

  beforeUpdate(() => {
    // check `keys` against original to see if it was updated on the Figma side
    if (compareArrays(keys, originalKeys)) {
      dirtyKeys = keys ? [...keys] : [];
      originalKeys = keys ? [...keys] : [];
      resetValue = true;
    }
  });

  afterUpdate(() => {
    if (resetValue) {
      resetValue = false;
    }
  });
</script>

{#if options && optionsInit && keys}
  {#each dirtyKeys as dirtyKey, i (dirtyKey)}
    <FormUnit
      className="form-row indent"
      on:deleteSignal={() => removeKey(dirtyKey)}
      disableActions={true}
      hasMultiple={isEditor && hasMultiple}
      hideLabel={true}
      isDeletable={true}
      invertView={invertView}
      itemIsLocked={false}
      kind="inputSelect"
      labelText="Add focus stop keys"
      nameId={`item-keystop-key-${dirtyKey}-${itemId}`}
      options={setOptions(options, 'space', isEditor)}
      resetValue={resetValue}
      selectWatchChange={true}
      on:changeSignal={() => updateKey(originalKeys, dirtyKey, i)}
      bind:value={dirtyKey}
    />
  {/each}
  <FormUnit
    className="form-row indent"
    disableActions={true}
    hasMultiple={isEditor && hasMultiple}
    hideLabel={true}
    invertView={invertView}
    itemIsLocked={false}
    kind="inputSelect"
    labelText="Add focus stop keys"
    nameId={`item-keystop-key-add-${itemId}`}
    options={setOptions(optionsInit, 'no-key', isEditor)}
    resetValue={resetValue}
    selectWatchChange={true}
    on:changeSignal={() => addKey(newKeyValue)}
    bind:value={newKeyValue}
  />
{/if}
