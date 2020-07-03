<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import Description from './Description';
  // import FigmaSwitch from './forms-controls/FigmaSwitch';
  import FormUnit from './forms-controls/FormUnit';

  export let isLocked = false;
  export let item = null;

  let dirtyItem = Object.assign({}, item);
  let originalItem = Object.assign({}, item);
  let isDirty = false;
  let resetValue = false;
  let wasResetValue = false;

  const handleReset = () => {
    originalItem = Object.assign({}, item);
    dirtyItem = Object.assign({}, item);
    isDirty = false;
    resetValue = true;
  };

  const handleSave = () => {
    parent.postMessage({
      pluginMessage: {
        action: 'submit',
        payload: { updatedItem: dirtyItem },
      },
    }, '*');
  };

  beforeUpdate(() => {
    // check `item` against dirty to see if it was updated in the form
    isDirty = false;
    Object.entries(item).forEach(([key, value]) => {
      if (dirtyItem[key] !== value) {
        isDirty = true;
      }
    });

    // check `item` against original to see if it was updated on the Figma side
    Object.entries(item).forEach(([key, value]) => {
      if (originalItem[key] !== value) {
        resetValue = true;
      }
    });

    // tee off a full reset
    if (resetValue) {
      handleReset();
    }

    // set tracker
    wasResetValue = resetValue;
  });

  afterUpdate(() => {
    if (resetValue || wasResetValue) {
      resetValue = false;
    }
  });
</script>

<section class={`expanded-content${isLocked ? ' locked' : ''}`}>
  <span class="divider-top"><hr class="inner"></span>

  <span class="form-element-holder">
    {#if item.group}
      <span class="form-row">
        <FormUnit
          className="form-unit split-40"
          itemIsLocked={isLocked}
          kind="inputText"
          labelText={`${item.group}&nbsp;&nbsp;&nbsp;/`}
          nameId={`item-group-${item.id}`}
          resetValue={resetValue}
          on:saveSignal={() => handleSave()}
          bind:value={dirtyItem.group}
        />
        <FormUnit
          className="form-unit split-60"
          itemIsLocked={isLocked}
          kind="inputText"
          labelText="Name"
          nameId={`item-name-${item.id}`}
          resetValue={resetValue}
          on:saveSignal={() => handleSave()}
          bind:value={dirtyItem.name}
        />
      </span>
    {:else}
      <FormUnit
        className="form-row"
        itemIsLocked={isLocked}
        kind="inputText"
        labelText="Name"
        nameId={`item-name-${item.id}`}
        resetValue={resetValue}
        on:saveSignal={() => handleSave()}
        bind:value={dirtyItem.name}
      />
    {/if}

    <Description
      bind:description={dirtyItem.description}
      isLocked={isLocked}
      itemId={item.id}
      resetValue={resetValue}
      on:saveSignal={() => handleSave()}
    />

    <!--
    <FormUnit
      className="form-row"
      disableCopy={true}
      itemIsLocked={isLocked}
      kind="inputSelect"
      labelText="Library"
      nameId={`item-library-${item.id}`}
      resetValue={resetValue}
      value="unassigned"
    />
    
    <span class="form-row">
      <FigmaSwitch
        className="form-element element-type-switch"
        disabled={isLocked}
        labelText="Interactive?"
        nameId="is-interactive"
      />
    </span>
    -->
  </span>

  {#if isDirty}
    <span>
      <button
        on:click={() => handleReset()}
      >
        Restore
      </button>
      <button
        on:click={() => handleSave()}
      >
        Save Changes
      </button>
    </span>
  {/if}
</section>
