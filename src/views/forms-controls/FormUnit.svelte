<script>
  import { afterUpdate } from 'svelte';
  import FigmaInput from './FigmaInput';
  import FormLabel from './FormLabel';

  export let className = '';
  // export let disabled = false;
  export let invertView = false;
  export let kind = 'inputText';
  export let labelText = 'Type something…';
  export let placeholder = null;
  export let nameId = 'text-input-id';
  export let value = null;

  const originalValue = value;
  let isDirty = false;

  afterUpdate(() => {
    if (value !== originalValue) {
      isDirty = true;
    } else {
      isDirty = false;
    }
  });
</script>

<span class={`form-unit ${className}`}>
  <FormLabel
    labelText={`${labelText} dirty? ${isDirty ? '👍' : '👎'}`}
    invertView={invertView}
    nameId={nameId}
  />

  {#if kind === 'inputText'}
    <FigmaInput
      className="form-element element-type-text"
      invertView={invertView}
      nameId={nameId}
      placeholder={placeholder}
      bind:value={value}
    />
  {/if}
</span>
