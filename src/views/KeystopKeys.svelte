<script>
  import { createEventDispatcher } from 'svelte';
  import FormUnit from './forms-controls/FormUnit';
  import FormLabel from './forms-controls/FormLabel';
  import { updateArray, setBulkSelectOptions } from '../Tools';

  const dispatch = createEventDispatcher();

  export let hasMultiple = false;
  export let invertView = false;
  export let isEditor = false;
  export let itemIsLocked;
  export let itemId = null;
  export let options = null;
  export let optionsInit = null;
  export let isDirty;
  export let keys = [];

  let newKeyValue = 'no-key';
  let isLocked = itemIsLocked;

  $: if (isLocked) {
    dispatch('restoreSignal');
  }

  const addKey = (newKey) => {
    if (!keys.includes(newKey)) {
      keys = [...keys, newKey];
    }
    newKeyValue = 'no-key';
  };

  const removeKey = (keyToRemove) => {
    const keyIndex = keys.findIndex(key => key === keyToRemove);
    if (keyIndex > -1) {
      keys = [
        ...keys.slice(0, keyIndex),
        ...keys.slice(keyIndex + 1),
      ];
    }
  };

  const updateSelect = (params) => {
    const keyboardOptions = setBulkSelectOptions(options, 'space', isEditor);
    const keyboardOptionsInit = setBulkSelectOptions(optionsInit, 'no-key', isEditor);

    const currentKeys = params.keys;
    const selectType = params.type;
    let selectedValue = null;

    let modifiedSelectOptions = [...keyboardOptionsInit];
    if (selectType !== 'init') {
      modifiedSelectOptions = [...keyboardOptions];
      selectedValue = params.value;
    }

    if (currentKeys) {
      // remove existing key entries
      currentKeys.forEach((keyEntry) => {
        const compareValue = { value: keyEntry };
        if ((selectType === 'init') || (keyEntry !== selectedValue)) {
          modifiedSelectOptions = updateArray(
            modifiedSelectOptions,
            compareValue,
            'value',
            'remove',
          );
        }
      });

      // remove double dividers
      let lastIsDivider = false;
      modifiedSelectOptions.forEach((optionsEntry) => {
        const isDivider = optionsEntry.value.includes('divider--');

        if (isDivider && !lastIsDivider) {
          lastIsDivider = true;
        } else if (isDivider && lastIsDivider) {
          modifiedSelectOptions = updateArray(
            modifiedSelectOptions,
            optionsEntry,
            'value',
            'remove',
          );
        } else {
          lastIsDivider = false;
        }
      });

      // remove divider if it is last
      const lastOptionIndex = modifiedSelectOptions.length - 1;
      const lastOption = modifiedSelectOptions[lastOptionIndex];
      if (lastOption.value.includes('divider--')) {
        modifiedSelectOptions = updateArray(
          modifiedSelectOptions,
          lastOption,
          'value',
          'remove',
        );
      }
    }
    return modifiedSelectOptions;
  };
</script>

<span class="form-row form-unit fixed-150">
  <FormLabel
    on:handleRestore={() => dispatch('restoreSignal')}
    disableCopy={true}
    invertView={invertView}
    isDirty={isDirty}
    parentIsLocked={itemIsLocked}
    bind:isLocked={isLocked}
    labelText="Keys"
    hasMultiple={hasMultiple}
    a11yField={true}
  />
</span>


{#each keys as key, i (key)}
  <FormUnit
    className="form-row indent"
    on:deleteSignal={() => removeKey(key)}
    disableActions={true}
    hideLabel={true}
    isDeletable={true}
    itemIsLocked={isLocked}
    parentIsLocked={itemIsLocked}
    invertView={invertView}
    kind="inputSelect"
    labelText="Add focus stop keys"
    nameId={`item-keystop-key-${key}-${itemId}`}
    options={updateSelect({ keys, type: 'selected', value: key })}
    selectWatchChange={true}
    bind:value={key}
    preserveDirtyProp={true}
  />
{/each}
{#if !isLocked}
  <FormUnit
    className="form-row indent"
    disableActions={true}
    hideLabel={true}
    invertView={invertView}
    itemIsLocked={false}
    parentIsLocked={itemIsLocked}
    kind="inputSelect"
    labelText="Add focus stop keys"
    nameId={`item-keystop-key-add-${itemId}`}
    options={updateSelect({ keys, type: 'init' })}
    selectWatchChange={true}
    on:changeSignal={() => addKey(newKeyValue)}
    bind:value={newKeyValue}
    preserveDirtyProp={true}
  />
{/if}
