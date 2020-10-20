<script>
  import ButtonCopy from './ButtonCopy';
  import ButtonLock from './ButtonLock';
  import ButtonRestore from './ButtonRestore';

  export let disableActions = false;
  export let disableCopy = false;
  export let hide = false;
  export let invertView = false;
  export let isDirty = false;
  export let isLocked = false;
  export let labelText = null;
  export let nameId = null;
  export let parentIsLocked = false;
  export let value = null;

  // watch parent locking changes to match an item unlock
  $: {
    isLocked = parentIsLocked;
  }
</script>

<style>
  /* components/form-elements > @form-label */
</style>

<span
  class:hidden={hide}
  class={`form-label${invertView ? ' inverted' : ''}${isDirty ? ' dirty' : ''}`}
>
  <span class="text">
    <label for={nameId}>{@html labelText}</label>
  </span>
  {#if !disableActions}
    <span class="actions">
      {#if isDirty}<ButtonRestore on:handleRestore/>{/if}
      <ButtonLock
        bind:isLocked
        disabled={parentIsLocked}
      />
      {#if value && !disableCopy}
        <ButtonCopy valueToCopy={value}/>
      {/if}
    </span>
  {/if}
</span>
