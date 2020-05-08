<script>
  export let className = null;
  export let disabled = null;
  export let invertView = false;
  export let nameId = null;
  export let placeholder = null;
  export let value = null;

  if (className && invertView) {
    className = `${className} inverted`;
  }
</script>

<style>
  /* components/figma-input */
</style>

<span class={className}>
  <textarea
    disabled={disabled}
    id={nameId}
    name={nameId}
    placeholder={placeholder}
    bind:value={value}
  ></textarea>
</span>
