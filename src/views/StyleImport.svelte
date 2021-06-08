<script>
  let value = '';

  const importStyleCSV = (styles) => {
    parent.postMessage({
      pluginMessage: {
        action: 'sendStyleValues',
        payload: styles,
      },
    }, '*');
  };
</script>

<aside class="style-import" id="style-import">
  <h1>Import style CSV</h1>
  <textarea placeholder={'Paste style CSV values here...'} bind:value={value}></textarea>
  <button 
    on:click={() => importStyleCSV(value)}
  >
    Import
  </button>
</aside>
