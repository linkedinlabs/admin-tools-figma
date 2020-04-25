<script>
  import FigmaSwitch from './forms-controls/FigmaSwitch';
  import { isStyles } from './stores';

  export let watchSelection = false;
  export let numberSelected = 0;

  if (!$isStyles && !watchSelection) {
    watchSelection = true;
  }

  const labelType = $isStyles ? 'style' : 'component';
  $: statusText = numberSelected === 1 ? labelType : `${labelType}s`;
</script>

<style>
  /* components/status-bar */
</style>

<footer class="status-bar">
  <p>
    {numberSelected} {statusText} {watchSelection ? 'selected' : ''}
  </p>
  {#if $isStyles}
  <FigmaSwitch
    bind:checked={watchSelection}
    labelText="Watch selection"
  />
  {/if}
</footer>
