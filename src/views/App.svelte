<script>
  import BlankState from './BlankState';
  import FontPreload from './FontPreload';
  import SceneNavigator from './SceneNavigator';
  import StatusBar from './StatusBar';

  export let numberSelected;
</script>

<div>
  <FontPreload/>
  <SceneNavigator/>

  {#if numberSelected > 0}
    <ul id="layer-list"></ul>
  {:else}
    <BlankState/>
  {/if}

  <StatusBar numberSelected={numberSelected}/>
</div>
