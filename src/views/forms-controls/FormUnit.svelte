<script>
  import { afterUpdate } from 'svelte';
  import FigmaInput from './FigmaInput';
  import FigmaSelectmenu from './FigmaSelectmenu';
  import FigmaTextarea from './FigmaTextarea';
  import FormLabel from './FormLabel';

  export let className = null;
  export let disableActions = false;
  export let disableCopy = false;
  export let hasMultiple = false;
  export let invertView = false;
  export let isDirty = false;
  export let itemIsLocked = false;
  export let kind = 'inputText';
  export let labelText = 'Type something…';
  export let placeholder = null;
  export let nameId = 'text-input-id';
  export let resetValue = false;
  export let value = null;

  let originalValue = value;
  let isLocked = itemIsLocked;
  let wasUnlocked = false;

  const restoreValue = () => {
    value = originalValue;
  };

  afterUpdate(() => {
    // watch locking changes and restore value if item becomes locked
    if (!wasUnlocked && isLocked) {
      restoreValue();
    }

    // update the comparison variable
    wasUnlocked = isLocked;

    if (value !== originalValue) {
      isDirty = true;
    } else {
      isDirty = false;
    }

    // reset based on higher-level update
    if (resetValue) {
      originalValue = value;
      isDirty = false;
    }
  });
</script>

<span class={className}>
  <FormLabel
    on:handleRestore={() => restoreValue()}
    disableActions={disableActions}
    disableCopy={disableCopy}
    labelText={labelText}
    invertView={invertView}
    isDirty={isDirty}
    bind:isLocked={isLocked}
    nameId={nameId}
    parentIsLocked={itemIsLocked}
    value={value}
  />

  {#if kind === 'inputText'}
    <FigmaInput
      className="form-element element-type-text"
      disabled={isLocked || itemIsLocked}
      invertView={invertView}
      nameId={nameId}
      placeholder={hasMultiple ? 'multiple…' : placeholder}
      bind:value={value}
    />
  {/if}

  {#if kind === 'inputTextarea'}
    <FigmaTextarea
      className="form-element element-type-textarea"
      disabled={isLocked || itemIsLocked}
      invertView={invertView}
      nameId={nameId}
      placeholder={hasMultiple ? 'multiple…' : placeholder}
      bind:value={value}
    />
  {/if}

  {#if kind === 'inputSelect'}
    <FigmaSelectmenu
      className="form-element element-type-select split-50"
      disabled={isLocked || itemIsLocked}
      invertView={invertView}
      nameId={nameId}
      bind:value={value}
    />
  {/if}
</span>
