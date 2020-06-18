<script>
  import { beforeUpdate, createEventDispatcher } from 'svelte';

  import ButtonLock from './forms-controls/ButtonLock';
  import ButtonOpenClose from './forms-controls/ButtonOpenClose';

  export let isGroupContainer = false;
  export let isLocked = false;
  export let isOpen = false;
  export let isTypeContainer = false;
  export let labelGroupText = null;
  export let labelText = 'Item name here';
  export let type = 'master-item';

  const dispatch = createEventDispatcher();

  let wasUnlocked = false;

  // watch parent locking changes to match an item unlock
  beforeUpdate(() => {
    // the header is an item header
    if (!isGroupContainer && !isTypeContainer) {
      // bubble up unlock events to make sure the group
      // lock status is representative
      if (wasUnlocked && !isLocked) {
        dispatch('handleUnlock');
      }
    }

    // set tracking flags
    wasUnlocked = isLocked;
  });
</script>

<style>
  /* components/list-headers */
</style>

<header class:isOpen class={`item-group-header ${type}`}>
  <span class="left">
    <span class="text">
      {#if labelGroupText}
        <em>
          {labelGroupText}
        </em>
      {/if}
      {labelText}
    </span>
  </span>
  <span class="right">
    <span class="actions">
      {#if type !== 'bulk-editor'}
        <ButtonLock
          on:handleUpdate={() => dispatch('handleUpdate', 'toggleLock')}
          isLocked={isLocked}
        />
      {/if}
      <ButtonOpenClose
        on:handleUpdate={() => dispatch('handleUpdate', 'toggleOpen')}
        isOpen={isOpen}
      />
    </span>
  </span>
</header>
