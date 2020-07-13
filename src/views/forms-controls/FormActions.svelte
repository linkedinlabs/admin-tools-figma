<script>
  import { createEventDispatcher } from 'svelte';

  export let invertView = false;

  const dispatch = createEventDispatcher();
  const handleSave = () => dispatch('saveSignal');
  const handleReset = () => dispatch('resetSignal');
</script>

<span class="form-action-controls">
  <button
    class={`button--secondary${invertView ? ' invert' : ''}`}
    on:click={() => handleReset()}
  >
    Restore
  </button>
  <button
    class="button--primary"
    on:click={() => handleSave()}
  >
    Apply changes
  </button>
</span>
