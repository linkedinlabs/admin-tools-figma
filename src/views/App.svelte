<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import {
    currentFilter,
    isSelection,
    isStyles,
    sessionKey,
  } from './stores';
  import BlankState from './BlankState';
  import FontPreload from './FontPreload';
  import ItemsList from './ItemsList';
  import SceneNavigator from './SceneNavigator';
  import StatusBar from './StatusBar';
  import StyleImport from './StyleImport';

  export let filter = 'all-components';
  export let inspect = 'components';
  export let newSessionKey = null;
  export let selected = null;
  export let useSelection = false;

  let bodyHeight = 0;
  let wasBodyHeight = 0;

  const setCurrentFilter = (newFilter) => {
    currentFilter.set(newFilter);
  };

  const setIsStyles = (currentlyInspecting) => {
    const newIsStyles = currentlyInspecting === 'styles';
    isStyles.set(newIsStyles);
  };

  const setIsSelection = (currentlyUsingSelection) => {
    const newIsSelection = currentlyUsingSelection;
    isSelection.set(newIsSelection);
  };

  beforeUpdate(() => {
    setIsStyles(inspect);
    setIsSelection(useSelection);
    setCurrentFilter(filter);
    sessionKey.set(newSessionKey);

    if (wasBodyHeight !== bodyHeight && selected && selected.items.length > 0) {
      parent.postMessage({
        pluginMessage: {
          action: 'resize',
          payload: { bodyHeight },
        },
      }, '*');
    }
  });

  afterUpdate(() => {
    wasBodyHeight = bodyHeight;
  });
</script>

<!-- compile options -->
<svelte:options accessors={true}/>

<!-- core layout -->
<div bind:offsetHeight={bodyHeight}>
  <FontPreload/>
  <SceneNavigator />

  {#if selected && selected.items.length > 0}
    <ItemsList selected={selected}/>
  {:else}
    <StyleImport />
    <BlankState isStyles={$isStyles}/>
  {/if}

  <StatusBar numberSelected={selected ? selected.items.length : 0}/>
</div>
