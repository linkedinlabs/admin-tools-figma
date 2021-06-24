<script>
  import { beforeUpdate } from 'svelte';
  import FigmaSwitch from './forms-controls/FigmaSwitch';

  let isClassicArtDeco = false;

  const toggleStyles = (toggle) => {
    parent.postMessage({
      pluginMessage: {
        action: 'toggle-theme',
        payload: {
          isClassicArtDeco: toggle,
        },
      },
    }, '*');
  };

  beforeUpdate(() => {
    toggleStyles(isClassicArtDeco);
  });
</script>

<aside class="theme-toggler" id="theme-toggler">
  <h1>Toggle to Classic (Art Deco)</h1>
  <FigmaSwitch
    className="theme-toggler-toggle"
    labelText="Toggle to Classic (Art Deco)"
    nameId="classic-art-deco"
    bind:value={isClassicArtDeco}
  />
</aside>
