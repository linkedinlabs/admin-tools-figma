<script>
  export let checked = false;
  export let className = 'switch';
  export let disabled = false;
  export let invertView = false;
  export let labelText = null;
  export let nameId = null;

  if (className && invertView) {
    className = `${className} inverted`;
  }
</script>

<style>
  /* components/figma-switch */
</style>

<span class={className}>
  <input
    class="switch__toggle"
    disabled={disabled}
    id={nameId}
    name={nameId}
    type="checkbox"
    bind:checked={checked}
  >
  <label
    class="switch__label"
    for={nameId}
  >
    {#if labelText}{labelText}{/if}
  </label>
</span>
