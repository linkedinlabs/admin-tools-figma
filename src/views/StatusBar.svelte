<script>
  import { isStyles } from './stores';

  import FigmaSwitch from './forms-controls/FigmaSwitch';

  export let watchSelection = false;
  export let numberSelected = 0;

  if (!$isStyles && !watchSelection) {
    watchSelection = true;
  }

  const statusText = (isStyle) => {
    const labelType = isStyle ? 'style' : 'component';
    const newStatusText = numberSelected === 1 ? labelType : `${labelType}s`;
    return newStatusText;
  };
</script>

<style>
  /* components/status-bar */

  .status-bar {
    position: fixed;
    bottom: 0;
    left: 0;
  }
</style>

<footer class="status-bar">
  <p>
    {numberSelected} {statusText($isStyles)} {watchSelection ? 'selected' : ''}
  </p>
  {#if $isStyles}
  <FigmaSwitch
    bind:checked={watchSelection}
    labelText="Watch selection"
  />
  {/if}
</footer>
