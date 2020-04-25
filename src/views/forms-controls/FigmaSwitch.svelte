<script>
  export let checked = false;
  export let labelText = null;
</script>
<style>
  /* components/figma-switch */
</style>

<span class="switch">
  <input
    class="switch__toggle"
    id="watch-selection"
    name="watch-selection"
    type="checkbox"
    value="watch-selection"
    bind:checked={checked}
  >
  <label
    class="switch__label"
    for="watch-selection"
  >
    {#if labelText}{labelText}{/if}
  </label>
</span>
