<script>
  import FontPreload from './FontPreload';
  import SceneNavigator from './SceneNavigator';
  import StatusBar from './StatusBar';
  import Title from './Title';

  export let name;
  export let numberSelected;
</script>

<div>
  <FontPreload/>
  <SceneNavigator/>
  <Title name={name}/>
  <Title override={true}/>
  <StatusBar numberSelected={numberSelected}/>
</div>
