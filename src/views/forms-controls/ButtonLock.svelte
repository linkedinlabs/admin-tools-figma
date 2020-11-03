<script>
  import { createEventDispatcher } from 'svelte';

  export let disabled = false;
  export let isLocked = false;

  const dispatch = createEventDispatcher();

  const handleClick = () => {
    isLocked = !isLocked;
    dispatch('handleUpdate');
  };
</script>

<style>
  /* components/icon-button > @button-icon */
</style>

<button
  on:click={() => handleClick()}
  class={`item-toggle action-lock-toggle${isLocked ? ' locked' : ''}`}
  disabled={disabled}
>
  <span class="label">
    {`${isLocked ? 'Unlock' : 'Lock'} item`}
  </span>
  {#if isLocked}
    <span class="icon locked">
      <svg viewBox="0 0 16 16">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 5.5V7H6.5V5.5C6.5 4.67157 7.17157 4 8 4C8.82843 4 9.5 4.67157 9.5 5.5ZM5.5 7V5.5C5.5 4.11929 6.61929 3 8 3C9.38071 3 10.5 4.11929 10.5 5.5V7H11C11.2761 7 11.5 7.22386 11.5 7.5V12.5C11.5 12.7761 11.2761 13 11 13H5C4.72386 13 4.5 12.7761 4.5 12.5V7.5C4.5 7.22386 4.72386 7 5 7H5.5Z"/>
      </svg>
    </span>
  {:else}
    <span class="icon unlocked">
      <svg viewBox="0 0 16 16">
        <g clip-path="url(#clip0)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6V7H10.5C10.7761 7 11 7.22386 11 7.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V7.5C4 7.22386 4.22386 7 4.5 7H9V4.5C9 3.11929 10.1193 2 11.5 2C12.8807 2 14 3.11929 14 4.5V6H13V4.5C13 3.67157 12.3284 3 11.5 3C10.6716 3 10 3.67157 10 4.5V6Z"/>
        </g>
        <defs>
          <clipPath id="clip0">
          <path d="M0 0H16V16H0V0Z" fill="white"/>
        </clipPath>
        </defs>
      </svg>
    </span>
  {/if}
</button>
