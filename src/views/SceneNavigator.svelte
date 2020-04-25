<script>
  import { onMount } from 'svelte';

  import { isStyles } from './stores';

  import SceneBackArrow from './forms-controls/SceneBackArrow';

  let currentItems = [];
  let selected = 'all-components';

  const menuItems = [
    // components menu
    {
      text: 'All',
      id: 'all-components',
      type: 'components',
    },
    {
      text: 'Design System',
      id: 'design-system',
      type: 'components',
    },
    {
      text: 'Interaction',
      id: 'interaction',
      type: 'components',
    },
    {
      text: 'Labels & Data',
      id: 'labels-data',
      type: 'components',
    },
    // styles menu
    {
      text: 'All',
      id: 'all-styles',
      type: 'styles',
    },
    {
      text: 'Typography',
      id: 'typography',
      type: 'styles',
    },
    {
      text: 'Color & Fill',
      id: 'color-fill',
      type: 'styles',
    },
    {
      text: 'Effects',
      id: 'effects',
      type: 'styles',
    },
    {
      text: 'Grid',
      id: 'grid',
      type: 'styles',
    },
  ];

  const setCurrentItems = (useStyles) => {
    currentItems = menuItems.filter(
      item => item.type === (useStyles ? 'styles' : 'components'),
    );
  };

  const handleItemClick = (selectedId) => {
    selected = selectedId;
  };

  // temp
  const handleBackClick = () => {
    isStyles.set(!$isStyles);

    // reset menu
    setCurrentItems($isStyles);
    selected = $isStyles ? 'all-styles' : 'all-components';
  };

  onMount(() => {
    setCurrentItems($isStyles);
  });
</script>

<style>
  /* components/scene-navigator */
</style>

<nav class="scene-navigator components">
  <SceneBackArrow on:handleClick={handleBackClick}/>
  <ul>
    {#each currentItems as item, i}
    <li>
      <button
        class:selected="{selected === item.id}"
        on:click={() => handleItemClick(item.id)}
      >
        {item.text}
      </button>
    </li>
    {/each}
  </ul>
</nav>
