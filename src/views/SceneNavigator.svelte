<script>
  import { beforeUpdate } from 'svelte';
  import { currentFilter, isStyles } from './stores';

  import SceneBackArrow from './forms-controls/SceneBackArrow';

  let currentItems = [];

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

  const setCurrentFilters = (newIsStyles, newFilter) => {
    parent.postMessage({
      pluginMessage: {
        action: 'setFilters',
        payload: { newIsStyles, newFilter },
      },
    }, '*');
  };

  const setCurrentItems = (useStyles) => {
    currentItems = menuItems.filter(
      item => item.type === (useStyles ? 'styles' : 'components'),
    );
  };

  const handleItemClick = (selectedId) => {
    setCurrentFilters($isStyles, selectedId);
  };

  // temp to handle style/components switch
  const handleBackClick = () => {
    const newIsStyles = !$isStyles;

    // reset filters
    const newFilter = newIsStyles ? 'all-styles' : 'all-components';
    setCurrentFilters(newIsStyles, newFilter);
  };

  beforeUpdate(() => {
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
        class:selected="{item.id === $currentFilter}"
        on:click={() => handleItemClick(item.id)}
      >
        {item.text}
      </button>
    </li>
    {/each}
  </ul>
</nav>
