<script>
  import FormUnit from './forms-controls/FormUnit';
  
  export let hasMultiple = false;
  export let invertView = false;
  export let isEditor = false;
  export let itemId = null;
  export let role = null;
  export let savedLabels = {}; // label data from last save to node metadata
  export let labels = {}; // reactive prop from parent
</script>
  
{#if isEditor && hasMultiple}
  <span class="form-row indent text-buffer has-multiple">
    Multiple label assignments applied…<br />
    Changes here will override all values on the selected components.
  </span>
{/if}

{#if (role !== 'image-decorative')}
  {#if (role === 'image')}
    <FormUnit
      className="form-row"
      kind="inputText"
      labelText="Alt text"
      nameId={`${itemId}-label-alt`}
      placeholder="Short description of the scene"
      invertView={invertView}
      itemIsLocked={false}
      hasUnsavedChanges={savedLabels.alt !== labels.alt}
      bind:value={labels.alt}
    />
  {:else}
    <FormUnit
      className="form-row"
      kind="inputText"
      labelText="Visible label"
      nameId={`${itemId}-label-visible`}
      placeholder="Leave empty to use a11y label"
      invertView={invertView}
      itemIsLocked={false}
      isDirty={savedLabels.visible !== labels.visible}
      bind:value={labels.visible}
    />
    <FormUnit
      className="form-row"
      kind="inputText"
      labelText="A11y label"
      nameId={`${itemId}-label-a11y`}
      placeholder="Leave empty to use visible label"
      invertView={invertView}
      itemIsLocked={false}
      isDirty={savedLabels.a11y !== labels.a11y}
      bind:value={labels.a11y}
    />
  {/if}
{/if}


  