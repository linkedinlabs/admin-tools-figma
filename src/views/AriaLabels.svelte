<script>
  import FormUnit from './forms-controls/FormUnit';
  
  const defaultLabels = {
    alt: null,
    visible: null,
    a11y: null,
  };

  export let invertView = false;
  export let overrides;
  export let itemId = null;
  export let role;
  export let savedLabels = { ...defaultLabels }; // label data from last save to node metadata
  export let labels = { ...defaultLabels }; // reactive prop from parent
</script>

{#if (labels && role !== 'image-decorative')}
  {#if (role === 'image')}
    <FormUnit
      className="form-row"
      kind="inputText"
      labelText="Alt text"
      nameId={`${itemId}-label-alt`}
      placeholder="Short description of the scene"
      invertView={invertView}
      itemIsLocked={false}
      hasMultiple={overrides && overrides.includes('alt')}
      isDirty={savedLabels.alt !== labels.alt}
      bind:value={labels.alt}
      preserveDirtyProp={true}
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
      hasMultiple={overrides && overrides.includes('visible')}
      isDirty={savedLabels.visible !== labels.visible}
      bind:value={labels.visible}
      preserveDirtyProp={true}
    />
    <FormUnit
      className="form-row"
      kind="inputText"
      labelText="A11y label"
      nameId={`${itemId}-label-a11y`}
      placeholder="Leave empty to use visible label"
      invertView={invertView}
      itemIsLocked={false}
      hasMultiple={overrides && overrides.includes('a11y')}
      isDirty={savedLabels.a11y !== labels.a11y}
      bind:value={labels.a11y}
      preserveDirtyProp={true}
    />
  {/if}
{/if}


  