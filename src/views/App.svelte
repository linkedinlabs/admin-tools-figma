<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import {
    currentFilter,
    isStyles,
    sessionKey,
  } from './stores';
  import BlankState from './BlankState';
  import FontPreload from './FontPreload';
  import ItemsList from './ItemsList';
  import SceneNavigator from './SceneNavigator';
  import StatusBar from './StatusBar';

  export let filter = 'all-components';
  export let inspect = 'components';
  export let selected = null;
  export let newSessionKey = null;

  let bodyHeight = 0;
  let wasBodyHeight = 0;

  const setCurrentFilter = (newFilter) => {
    currentFilter.set(newFilter);
  };

  const setIsStyles = (currentlyInspecting) => {
    const newIsStyles = currentlyInspecting === 'styles';
    isStyles.set(newIsStyles);
  };

  beforeUpdate(() => {
    setIsStyles(inspect);
    setCurrentFilter(filter);
    sessionKey.set(newSessionKey);

    if (wasBodyHeight !== bodyHeight && selected.items.length > 0) {
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
    <BlankState/>
  {/if}

  <StatusBar numberSelected={selected ? selected.items.length : 0}/>
</div>
