<script>
  import { isStyles } from './stores';

  import FigmaSwitch from './forms-controls/FigmaSwitch';

  export let watchSelection = true;
  export let numberSelected = 0;

  if (!$isStyles && !watchSelection) {
    watchSelection = true;
  }

  const statusText = (isStyle, count) => {
    const labelType = isStyle ? 'style' : 'component';
    const newStatusText = count === 1 ? labelType : `${labelType}s`;
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
    {numberSelected} {statusText($isStyles, numberSelected)} {watchSelection ? 'selected' : ''}
  </p>
  <!-- temp disabled for all - eventually allow Styles to pick -->
  <FigmaSwitch
    disabled={!$isStyles || $isStyles}
    labelText="Watch selection"
    nameId="watch-selection"
    bind:value={watchSelection}
  />
</footer>
