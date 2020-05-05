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

  let selected = {
    value: null,
    text: null,
  };
  let isMenuOpen = false;

  const isSelected = match => match === value;
  const setSelected = (optionValue = value) => {
    const index = 0;

    if (optionValue) {
      selected = options.filter(option => option.value === optionValue)[index];
    } else {
      selected = options[index];
    }
    return selected;
  };
  // temp
  const logSelection = () => console.log(`${nameId} selected is: ${selected.value}`); // eslint-disable-line no-console

  // ui interactions
  const handleMenuClick = () => {
    isMenuOpen = !isMenuOpen;
    return isMenuOpen;
  };

  const handleItemClick = (optionValue) => {
    setSelected(optionValue);
    logSelection();
    isMenuOpen = false;
  };

  onMount(async () => {
    setSelected();
  });

</script>

<style>
  /* components/figma-select-menu */
</style>

<span class={className}>
  <div class="styled-select">
    <button
      class={`styled-select__button${isMenuOpen ? ' styled-select__button--active' : ''}`}
      on:click={() => handleMenuClick()}
    >
      <span class="styled-select__button-label">
        {selected.text}
      </span>
      <span class="styled-select__icon"></span>
    </button>
    <ul
      class={`styled-select__list${isMenuOpen ? ' styled-select__list--active' : ''}`}
      style="top: 0px;"
    >
      {#each options as option (option.value)}
        <li
          class={`styled-select__list-item${isSelected(option.value) ? 'styled-select__list-item--active' : ''}`}
          data-value={option.value}
          on:click={() => handleItemClick(option.value)}
          position="0"
        >
          <span class="styled-select__list-item-icon"></span>
          <span class="styled-select__list-item-text">
            {option.text}
          </span>
        </li>
      {/each}

    </ul>
  </div>
  <select
    bind:value={selected.value}
    class="styled-select select-menu"
    disabled={disabled}
    id={nameId}
    style="display:none"
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
