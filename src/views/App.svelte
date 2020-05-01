<script>
  import BlankState from './BlankState';
  import FontPreload from './FontPreload';
  import SampleOptions from './SampleOptions';
  import SceneNavigator from './SceneNavigator';
  import StatusBar from './StatusBar';

  export let numberSelected;
</script>

<div>
  <FontPreload/>
  <SceneNavigator/>

  {#if numberSelected > 0}
    <SampleOptions numberSelected={numberSelected}/>
  {:else}
    <BlankState/>
  {/if}

  <StatusBar numberSelected={numberSelected}/>
</div>
