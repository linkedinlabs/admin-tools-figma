<script>
  import { beforeUpdate } from 'svelte';
  import { currentFilter, isStyles } from './stores';
  import BlankState from './BlankState';
  import FontPreload from './FontPreload';
  import ItemsList from './ItemsList';
  import SceneNavigator from './SceneNavigator';
  import StatusBar from './StatusBar';

  export let filter = 'all-components';
  export let inspect = 'components';
  export let selected = null;

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
  });
</script>

<!-- compile options -->
<svelte:options accessors={true}/>

<!-- core layout -->
<div>
  <FontPreload/>
  <SceneNavigator />

  {#if selected && selected.items.length > 0}
    <ItemsList selected={selected}/>
  {:else}
    <BlankState/>
  {/if}

  <StatusBar numberSelected={selected ? selected.items.length : 0}/>
</div>
