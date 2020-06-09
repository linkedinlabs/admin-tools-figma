<script>
  import { createEventDispatcher } from 'svelte';

  import ButtonLock from './forms-controls/ButtonLock';
  import ButtonOpenClose from './forms-controls/ButtonOpenClose';

  export let groupIsLocked = 'unlocked';
  export let isGroupContainer = false;
  export let isLocked = false;
  export let isOpen = false;
  export let isTypeContainer = false;
  export let labelGroupText = null;
  export let labelText = 'Item name here';
  export let type = 'master-item';
  export let typeIsLocked = 'unlocked';

  const dispatch = createEventDispatcher();

  let groupWasUnlocked = 'unlocked';
  let typeWasUnlocked = 'unlocked';
  let wasUnlocked = 'unlocked';

  // set initial locking status
  if (!isGroupContainer && groupIsLocked === 'locked') {
    isLocked = true;
  }

  if (!isTypeContainer && typeIsLocked === 'locked') {
    isLocked = true;

    if (isGroupContainer) {
      groupIsLocked = 'locked';
    }
  }

  // watch parent locking changes to match an item unlock
  $: {
    // lock item if type is locked
    if ((typeWasUnlocked !== 'locked') && (typeIsLocked === 'locked')) {
      isLocked = true;
    }

    // lock item if group is locked
    if ((groupWasUnlocked !== 'locked') && (groupIsLocked === 'locked')) {
      isLocked = true;
    }

    // unlock item if group is unlocked
    if (!isTypeContainer && !isGroupContainer && (groupWasUnlocked === 'locked') && (groupIsLocked === 'unlocked')) {
      isLocked = false;
    }

    // unlock group if type is unlocked
    if (isGroupContainer && (typeWasUnlocked === 'locked') && (typeIsLocked === 'unlocked') && (groupWasUnlocked === 'locked') && (groupIsLocked === 'locked')) {
      isLocked = false;
    }

    // the header is a type header
    if (isTypeContainer) {
      if (!wasUnlocked && isLocked) {
        typeIsLocked = 'locked';
      }

      if ((typeIsLocked !== 'partial') && wasUnlocked && !isLocked) {
        typeIsLocked = 'unlocked';
      }
    }

    // the header is a group header
    if (isGroupContainer) {
      if (!wasUnlocked && isLocked) {
        groupIsLocked = 'locked';
      }

      if ((groupIsLocked !== 'partial') && wasUnlocked && !isLocked) {
        groupIsLocked = 'unlocked';
      }
    }

    // the header is an item header
    if (!isGroupContainer && !isTypeContainer) {
      // bubble up unlock events to make sure the group
      // lock status is representative
      if (wasUnlocked && !isLocked) {
        dispatch('handleUnlock');
      }
    }

    // set tracking flags
    groupWasUnlocked = groupIsLocked;
    typeWasUnlocked = typeIsLocked;
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
