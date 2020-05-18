<script>
  import { isStyles } from './stores';
  import BlankState from './BlankState';
  import FontPreload from './FontPreload';
  import SampleOptions from './SampleOptions';
  import SceneNavigator from './SceneNavigator';
  import StatusBar from './StatusBar';

  export let inspect = 'components';
  export let numberSelected;

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

  {#if numberSelected > 0}
    <SampleOptions numberSelected={numberSelected}/>
  {:else}
    <BlankState/>
  {/if}

  <StatusBar numberSelected={numberSelected}/>
</div>
