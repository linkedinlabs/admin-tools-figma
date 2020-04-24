<script>
  import FontPreload from './FontPreload';
  import SceneNavigator from './SceneNavigator';
  import Title from './Title';

  export let name;
</script>

<div>
  <FontPreload/>
  <SceneNavigator/>
  <Title name={name}/>
  <Title override={true}/>
</div>
