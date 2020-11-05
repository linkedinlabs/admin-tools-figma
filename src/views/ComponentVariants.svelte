<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import FormUnit from './forms-controls/FormUnit';
  import { compareArrays, updateArray } from '../Tools';

  export let hasMultiple = false;
  export let invertView = false;
  export let isEditor = false;
  export let isLocked = false;
  export let itemId = null;
  export let resetValue = false;
  export let variants = null;

  let dirtyVariants = variants ? [...variants] : [];
  let originalVariants = variants ? [...variants] : [];

  const setNameId = (variantKey, id) => {
    const keyAsSlug = variantKey.toLowerCase().replace(' ', '-');
    const nameId = `ignore-variant-${keyAsSlug}-${itemId}`;
    return nameId
  }

  const setOptions = (variantsArray) => {
    const options = [];
    variantsArray.forEach((variant) => {
      const option = {
        id: setNameId(variant.key, itemId),
        text: variant.key,
        value: variant.ignore,
      }
      options.push(option);
    });
    return options;
  }

  beforeUpdate(() => {
    // check `variants` against original to see if it was updated on the Figma side
    if (compareArrays(variants, originalVariants)) {
      dirtyVariants = variants ? [...variants] : [];
      originalVariants = variants ? [...variants] : [];
      resetValue = true;
    }

    // check `variants` against dirty to see if it was updated in the plugin UI
    if (compareArrays(variants, dirtyVariants)) {
      variants = dirtyVariants ? [...dirtyVariants] : [];
      dirtyVariants = variants ? [...variants] : [];
      resetValue = true;
    }
  });

  afterUpdate(() => {
    if (resetValue) {
      resetValue = false;
    }
  });
</script>

<FormUnit
  className="form-row form-unit"
  disableCopy={true}
  hasMultiple={isEditor && variants === 'blank--multiple'}
  invertView={invertView}
  itemIsLocked={isLocked}
  kind="inputSwitchSet"
  labelText="Variants to ignore in token name"
  nameId={`item-variants-${itemId}`}
  options={setOptions(variants)}
  resetValue={resetValue}
  bind:value={variants}
/>
