<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import FormLabel from './forms-controls/FormLabel';
  import FigmaSwitchSet from './forms-controls/FigmaSwitchSet';
  import { compareArrays } from '../Tools';

  export let invertView = false;
  export let isEditor = false;
  export let itemId = null;
  export let itemIsLocked = false;
  export let resetValue = false;
  export let variants = null;

  let originalVariants = variants.map((variant) => ({ ...variant }));
  let isDirty = false;
  let isLocked = itemIsLocked;
  let wasUnlocked = false;

  const restoreValue = () => {
    variants = originalVariants.map((variant) => ({ ...variant }));
    resetValue = true;
    isDirty = false;
  };

  const setNameId = (variantKey, currentItemId) => {
    const keyAsSlug = variantKey.toLowerCase().replace(' ', '-');
    const nameId = `ignore-variant-${keyAsSlug}-${currentItemId}`;
    return nameId;
  };

  const setOptions = (variantsArray, currentItemId) => {
    const options = [];
    variantsArray.forEach((variant) => {
      const option = {
        id: setNameId(variant.key, currentItemId),
        text: variant.key,
        value: variant.ignore,
      };
      options.push(option);
    });
    return options;
  };

  beforeUpdate(() => {
    // check `variants` against original to see if it was updated on the Figma side
    if (compareArrays(variants, originalVariants)) {
      isDirty = true;
    } else {
      isDirty = false;
    }

    // watch locking changes and restore value if item becomes locked
    if (!wasUnlocked && isLocked) {
      restoreValue();
    }

    // update the comparison variable
    wasUnlocked = isLocked;
  });

  afterUpdate(() => {
    if (resetValue) {
      originalVariants = variants.map((variant) => ({ ...variant }));
      setOptions(variants, itemId);
      resetValue = false;
      isDirty = false;
    }
  });
</script>

<style>
  .inputSwitchSet {
    padding-left: 8px;
  }
</style>


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
      invertView={invertView}
      bind:isDirty={isDirty}
      isEditor={isEditor}
      nameId={`item-variants-${itemId}`}
      options={setOptions(variants, itemId)}
      optionValueKeys={['key', 'ignore']}
      resetValue={resetValue}
      bind:value={variants}
    />
  </span>
</span>
