<script>
  import ButtonCopy from './ButtonCopy';
  import ButtonLock from './ButtonLock';
  import ButtonRestore from './ButtonRestore';

  export let labelText = null;
  export let nameId = null;
  export let disableActions = false;
</script>

<style>
  /* components/form-elements > @form-label */
</style>

<span class="form-label">
  <span class="text">
    <label for={nameId}>{labelText}</label>
  </span>
  {#if !disableActions}
    <span class="actions">
      <ButtonRestore isActive={true} />
      <ButtonLock/>
      <ButtonCopy/>
    </span>
  {/if}
</span>
