<script>
  import ButtonLock from './forms-controls/ButtonLock';
  import ButtonOpenClose from './forms-controls/ButtonOpenClose';

  export let isOpen = false;
  export let isLocked = false;
  export let labelGroupText = null;
  export let labelText = 'Item name here';
  export let type = 'master-item';
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
        <ButtonLock isLocked={isLocked}/>
      {/if}
      <ButtonOpenClose isOpen={isOpen}/>
    </span>
  </span>
</header>
