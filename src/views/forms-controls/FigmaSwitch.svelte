<script>
  import IconInline from '../IconInline';

  export let className = 'switch';
  export let disabled = false;
  export let hasMultiple = false;
  export let invertView = false;
  export let labelText = null;
  export let nameId = null;
  export let value = false;

  if (className && invertView) {
    className = `${className} inverted`;
  }
</script>

<style>
  /* components/figma-switch */
  .switch-wrapper {
    display: flex;
    align-items: center;
  }
  label {
    white-space: nowrap;
    padding-left: 8px;
  }
  label.invertView {
    color: #ccc;
  }
</style>

<div class="switch-wrapper">
  {#if labelText}
    <label class:invertView for={nameId}>
      {labelText}
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
  {/if} 
  <span class={className}>
    <input
      bind:checked={value}
      class={`switch__toggle${hasMultiple && value === null ? ' has-multiple' : ''}`}
      disabled={disabled}
      id={nameId}
      name={nameId}
      type="checkbox"
    >
    <label
      class="switch__label"
      for={nameId}
    >
    </label>
  </span>
</div>
