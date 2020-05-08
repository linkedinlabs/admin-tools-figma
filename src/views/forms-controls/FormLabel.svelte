<script>
  import ButtonCopy from './ButtonCopy';
  import ButtonLock from './ButtonLock';
  import ButtonRestore from './ButtonRestore';

  export let labelText = null;
  export let invertView = false;
  export let isDirty = false;
  export let isLocked = false;
  export let nameId = null;
  export let disableActions = false;
</script>

<style>
  /* components/form-elements > @form-label */
</style>

<span class={`form-label${invertView ? ' inverted' : ''}${isDirty ? ' dirty' : ''}`}>
  <span class="text">
    <label for={nameId}>{labelText}</label>
  </span>
  {#if !disableActions}
    <span class="actions">
      {#if isDirty}<ButtonRestore on:handleRestore/>{/if}
      <ButtonLock bind:isLocked/>
      <ButtonCopy/>
    </span>
  {/if}
</span>
