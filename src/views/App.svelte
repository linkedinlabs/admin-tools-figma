<script>
  import { isStyles } from './stores';
  import BlankState from './BlankState';
  import FontPreload from './FontPreload';
  import ItemsList from './ItemsList';
  import SceneNavigator from './SceneNavigator';
  import StatusBar from './StatusBar';

  export let inspect = 'components';
  export let selected = null;

  const setIsStyles = (currentlyInspecting) => {
    const isStylesLocal = currentlyInspecting === 'styles';
    isStyles.set(isStylesLocal);
  };

  setIsStyles(inspect);
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
