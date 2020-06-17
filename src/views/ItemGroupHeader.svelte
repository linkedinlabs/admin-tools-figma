<script>
  import {
    beforeUpdate,
    createEventDispatcher,
    onMount,
  } from 'svelte';

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
  let wasUnlocked = false;

  // watch parent locking changes to match an item unlock
  beforeUpdate(() => {
    // lock item if type is locked
    if ((typeWasUnlocked !== 'locked') && (typeIsLocked === 'locked')) {
      dispatch('handleUpdate', 'setLock');
    }

    // lock item if group is locked
    if ((groupWasUnlocked !== 'locked') && (groupIsLocked === 'locked')) {
      dispatch('handleUpdate', 'setLock');
    }

    // unlock item if group is unlocked
    if (!isTypeContainer && !isGroupContainer && (groupWasUnlocked === 'locked') && (groupIsLocked === 'unlocked')) {
      dispatch('handleUpdate', 'setUnlock');
    }

    // unlock group if type is unlocked
    if (isGroupContainer && (typeWasUnlocked === 'locked') && (typeIsLocked === 'unlocked') && (groupWasUnlocked === 'locked') && (groupIsLocked === 'locked')) {
      dispatch('handleUpdate', 'setUnlock');
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
  });

  onMount(() => {
    // set initial locking status
    if (!isTypeContainer && !isGroupContainer && groupIsLocked === 'locked') {
      dispatch('handleUpdate', 'setLock');
    }

    if (!isTypeContainer && isGroupContainer && typeIsLocked === 'locked') {
      dispatch('handleUpdate', 'setLock');

      if (isGroupContainer) {
        groupIsLocked = 'locked';
      }
    }
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
        <!-- <ButtonLock bind:isLocked={isLocked}/> -->
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
