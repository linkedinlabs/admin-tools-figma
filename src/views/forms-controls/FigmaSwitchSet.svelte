<script>
  import { beforeUpdate } from 'svelte';
  import FormLabel from './FormLabel';
  import FigmaSwitch from './FigmaSwitch';
  import { compareArrays } from '../../Tools';

  export let disabled = false;
  export let hasMultiple = false;
  export let invertView = false;
  export let isDirty = false;
  export let nameId = null;
  export let options = [
    {
      id: 'unassigned',
      value: 'unassigned',
      text: 'Not assigned',
    },
  ];
  export let optionValueKeys = ['id', 'text'];
  export let value = null;

  let originalOptions = options ? [...options] : [];

  const updateValue = (currentOptions) => {
    currentOptions.forEach((option) => {
      const compareKey = optionValueKeys[0];
      const valueKey = optionValueKeys[1];

      const valueIndex = value.findIndex(valItem => valItem[compareKey] === option.text)
      if (valueIndex > -1) {
        value[valueIndex][valueKey] = option.value;
      }
    })
  }

  beforeUpdate(() => {
    if (compareArrays(options, originalOptions)) {
      console.log('they are different')
      // update the value
      updateValue(options);
      isDirty = true;

      // reset the options
      originalOptions = options ? [...options] : [];
    }
  })
</script>

{#each options as option (option.id)}
  <span class="switch-set">
    <FigmaSwitch
      className="form-element element-type-switch"
      disabled={disabled}
      invertView={invertView}
      labelText={option.text}
      nameId={`${nameId}-${option.id}`}
      bind:value={option.value}
    />
  </span>
{/each}
