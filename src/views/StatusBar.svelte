<script>
  import { beforeUpdate } from 'svelte';
  import {
    currentFilter,
    isSelection,
    isStyles,
  } from './stores';

  import FigmaSwitch from './forms-controls/FigmaSwitch';

  export let numberSelected = 0;

  let wasIsSelection = $isSelection;

  const statusText = (isStyle, count) => {
    const labelType = isStyle ? 'style' : 'component';
    const newStatusText = count === 1 ? labelType : `${labelType}s`;
    return newStatusText;
  };

  const setCurrentFilters = (newIsSelection) => {
    parent.postMessage({
      pluginMessage: {
        action: 'setFilters',
        payload: {
          newIsSelection,
          newIsStyles: $isStyles,
          newFilter: $currentFilter,
        },
      },
    }, '*');
  };

  beforeUpdate(() => {
    if (wasIsSelection !== $isSelection) {
      setCurrentFilters($isSelection);
    }

    wasIsSelection = $isSelection;
  });
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
    {numberSelected} {statusText($isStyles, numberSelected)} {$isSelection ? 'selected' : ''}
  </p>
  <FigmaSwitch
    disabled={!$isStyles}
    labelText="Watch selection"
    nameId="watch-selection"
    bind:value={$isSelection}
  />
</footer>
