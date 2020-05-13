<script>
  import { createEventDispatcher } from 'svelte';

  import ButtonLock from './forms-controls/ButtonLock';
  import ButtonOpenClose from './forms-controls/ButtonOpenClose';

  export let groupIsLocked = 'unlocked';
  export let isGroupContainer = false;
  export let isLocked = false;
  export let isOpen = false;
  export let labelGroupText = null;
  export let labelText = 'Item name here';
  export let type = 'master-item';

  const dispatch = createEventDispatcher();

  let groupWasUnlocked = false;
  let wasUnlocked = false;

  // set initial locking status
  if (!isGroupContainer && groupIsLocked) {
    isLocked = true;
  }

  // watch parent locking changes to match an item unlock
  $: {
    // lock item if group is locked
    if ((groupWasUnlocked) && (groupIsLocked === 'locked')) {
      isLocked = true;
    }

    // unlock item if group is unlocked
    if ((!groupWasUnlocked) && (groupIsLocked === 'unlocked')) {
      isLocked = false;
    }

    // the header is a group header
    if (isGroupContainer) {
      if (!wasUnlocked && isLocked) {
        groupIsLocked = 'locked';
      }

      if (wasUnlocked && !isLocked) {
        groupIsLocked = 'unlocked';
      }

      if (!groupWasUnlocked && groupIsLocked === 'partial') {
        isLocked = false;
      }
    }

    // the header is an item header
    if (!isGroupContainer) {
      // bubble up unlock events to make sure the group
      // lock status is representative
      if (wasUnlocked && !isLocked) {
        dispatch('handleUnlock');
      }
    }

    // set tracking flags
    groupWasUnlocked = groupIsLocked !== 'locked';
    wasUnlocked = isLocked;
  }
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
        <ButtonLock bind:isLocked={isLocked}/>
      {/if}
      <ButtonOpenClose
        on:handleUpdate={() => dispatch('handleUpdate')}
        isOpen={isOpen}
      />
    </span>
  </span>
</header>
