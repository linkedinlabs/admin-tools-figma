<script>
  import { createEventDispatcher } from 'svelte';

  import ButtonLock from './forms-controls/ButtonLock';
  import ButtonOpenClose from './forms-controls/ButtonOpenClose';

  export let isOpen = false;
  export let isLocked = false;
  export let labelGroupText = null;
  export let labelText = 'Item name here';
  export let type = 'master-item';

  const dispatch = createEventDispatcher();
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
