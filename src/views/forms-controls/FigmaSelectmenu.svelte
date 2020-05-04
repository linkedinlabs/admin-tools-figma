<script>
  import { onMount } from 'svelte';
  import '../../vendor/figma-select-menu';

  export let className = null;
  export let disabled = false;
  export let nameId = null;
  export let value = null;
  export let options = [
    {
      value: 'unassigned',
      text: 'Not assigned',
      disabled: false,
    },
    {
      value: 'component',
      text: 'Component',
      disabled: false,
    },
    {
      value: 'foundation',
      text: 'Foundational Element',
      disabled: false,
    },
  ];

  let selected;

  const isSelected = match => match === value;
  const logSelection = () => console.log(`${nameId} selected is: ${selected}`); // eslint-disable-line no-console

  onMount(async () => {
    selectMenu.init({
      position: 'positionToSelection',
      selector: 'styled-select',
    });
  });

</script>

<style>
  /* components/figma-select-menu */
</style>

<span class={className}>
  <select
    bind:value={selected}
    class="styled-select select-menu"
    disabled={disabled}
    id={nameId}
    on:change={() => logSelection()}
  >
    {#each options as option (option.value)}
      <option
        disabled={option.disabled}
        selected={isSelected(option.value)}
        value={option.value}
      >
        {option.text}
      </option>
    {/each}
  </select>
</span>
