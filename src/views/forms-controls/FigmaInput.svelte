<script>
  export let className = null;
  export let nameId = null;
  export let placeholder = null;
  export let value = null;
</script>

<style>
  /* components/figma-input */
</style>

<span class={className}>
  <input
    id={nameId}
    name={nameId}
    placeholder={placeholder}
    type="text"
    bind:value={value}
  >
</span>
