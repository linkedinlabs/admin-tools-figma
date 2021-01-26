<script>
  import ButtonCopy from './ButtonCopy';
  import ButtonLock from './ButtonLock';
  import ButtonRestore from './ButtonRestore';
  import IconInline from '../IconInline';

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
  export let hasMultiple;

  // watch parent locking changes to match an item unlock
  $: {
    isLocked = parentIsLocked;
  }
</script>

<style>
  /* components/form-elements > @form-label */
  label {
    display: flex;
  }
</style>

<span
class:hidden={hide}
class={`form-label${invertView ? ' inverted' : ''}${isDirty ? ' dirty' : ''}`}
>
<span class="text">
    <label for={nameId}>
      {@html labelText}
      {#if hasMultiple} 
        <IconInline
          invertView={invertView}
          isWarning={true}
        >
          <svg viewBox="0 0 512 512">
            <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
          </svg>
        </IconInline>  
      {/if}
    </label>
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
