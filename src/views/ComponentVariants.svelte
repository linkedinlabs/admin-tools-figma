<script>
  import { beforeUpdate } from 'svelte';
  import FormUnit from './forms-controls/FormUnit';

  export let hasMultiple = false;
  export let invertView = false;
  export let isEditor = false;
  export let isLocked = false;
  export let itemId = null;
  export let resetValue = false;
  export let variants = null;

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
  value={variants}
/>
