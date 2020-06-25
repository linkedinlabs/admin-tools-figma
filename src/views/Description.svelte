<script>
  import { afterUpdate } from 'svelte';
  import FormUnit from './forms-controls/FormUnit';

  export let description = null;
  export let isLocked = false;
  export let itemId = null;
  export let resetValue = false;

  let descriptionArray = [];

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
