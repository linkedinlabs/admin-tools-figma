<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<style>
  /* components/scene-navigator > .scene-navigator-back-arrow */
</style>

<p class="scene-navigator-back-arrow">
  <button on:click={() => dispatch('handleClick')}>
    <span class="icon">
      <svg viewBox="0 0 8 14">
        <path d="M7.23538 1L1 7L7.23538 13"/>
      </svg>
    </span>
    <span class="text">
      Back
    </span>
  </button>
</p>
