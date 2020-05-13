<script>
  import { afterUpdate } from 'svelte';
  import FigmaInput from './FigmaInput';
  import FigmaSelectmenu from './FigmaSelectmenu';
  import FigmaTextarea from './FigmaTextarea';
  import FormLabel from './FormLabel';

  export let className = null;
  export let disableActions = false;
  export let invertView = false;
  export let itemIsLocked = false;
  export let kind = 'inputText';
  export let labelText = 'Type something…';
  export let placeholder = null;
  export let nameId = 'text-input-id';
  export let value = null;

  const originalValue = value;
  let isDirty = false;
  let isLocked = itemIsLocked;
  let wasUnlocked = false;

  const restoreValue = () => {
    value = originalValue;
  };

  // watching locking changes and restore value if item becomes locked
  $: {
    if (!wasUnlocked && isLocked) {
      restoreValue();
    }

    wasUnlocked = isLocked;
  }

  afterUpdate(() => {
    if (value !== originalValue) {
      isDirty = true;
    } else {
      isDirty = false;
    }
  });
</script>

<span class={className}>
  <FormLabel
    on:handleRestore={() => restoreValue()}
    disableActions={disableActions}
    labelText={labelText}
    invertView={invertView}
    isDirty={isDirty}
    bind:isLocked={isLocked}
    nameId={nameId}
    parentIsLocked={itemIsLocked}
  />

  {#if kind === 'inputText'}
    <FigmaInput
      className="form-element element-type-text"
      disabled={isLocked || itemIsLocked}
      invertView={invertView}
      nameId={nameId}
      placeholder={placeholder}
      bind:value={value}
    />
  {/if}

  {#if kind === 'inputTextarea'}
    <FigmaTextarea
      className="form-element element-type-textarea"
      disabled={isLocked || itemIsLocked}
      invertView={invertView}
      nameId={nameId}
      placeholder={placeholder}
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
