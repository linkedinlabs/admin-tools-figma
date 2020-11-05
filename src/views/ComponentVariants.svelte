<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import FormLabel from './forms-controls/FormLabel';
  import FigmaSwitchSet from './forms-controls/FigmaSwitchSet';
  import { compareArrays, updateArray } from '../Tools';

  export let hasMultiple = false;
  export let invertView = false;
  export let isEditor = false;
  export let itemId = null;
  export let itemIsLocked = false;
  export let resetValue = false;
  export let variants = null;

  let originalVariants = variants.map(variant => ({ ...variant }));
  let isDirty = false;
  let isLocked = itemIsLocked;
  let wasUnlocked = false;

  const restoreValue = () => {
    variants = originalVariants.map(variant => ({ ...variant }));;
    console.log(variants)
    resetValue = true;
    isDirty = false;
  };

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
      // originalVariants = variants.map(variant => ({ ...variant }));
      // resetValue = true;
      isDirty = true;
    }

    console.log('variants')
    console.log(variants)
    console.log('originalVariants')
    console.log(originalVariants)

    // watch locking changes and restore value if item becomes locked
    if (!wasUnlocked && isLocked) {
      restoreValue();
    }

    // update the comparison variable
    wasUnlocked = isLocked;
  });

  afterUpdate(() => {
    if (resetValue) {
      setOptions(variants);
      resetValue = false;
      isDirty = false;
    }
  });
</script>


<span class="form-row form-unit">
  <FormLabel
    on:handleRestore={() => restoreValue()}
    disableCopy={true}
    invertView={invertView}
    isDirty={isDirty}
    bind:isLocked={isLocked}
    labelText="Variants ignored in token name"
    nameId={`item-variants-${itemId}`}
    parentIsLocked={itemIsLocked}
  />

  <span class="form-inner-row inputSwitchSet">
    <FigmaSwitchSet
      disabled={isLocked || itemIsLocked}
      hasMultiple={hasMultiple}
      invertView={invertView}
      bind:isDirty={isDirty}
      nameId={`item-variants-${itemId}`}
      options={setOptions(variants)}
      optionValueKeys={['key', 'ignore']}
      resetValue={resetValue}
      bind:value={variants}
    />
  </span>
</span>
