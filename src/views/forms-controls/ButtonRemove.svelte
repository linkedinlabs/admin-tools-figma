<script>
  import { createEventDispatcher } from 'svelte';

  export let invertView = false;

  const dispatch = createEventDispatcher();
  const handleClick = () => {
    dispatch('handleUpdate');
  };
</script>

<style>
  /* components/icon-button > @button-icon */
</style>

<button
  class={`inline-button action-remove${invertView ? ' inverted' : ''}`}
  on:click={() => handleClick()}
>
  <span class="label">
    Remove field
  </span>
  <span class="icon">
    <svg viewBox="0 0 32 32">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M21 16.5H10V15.5H21V16.5Z"/>
    </svg>
  </span>
</button>
