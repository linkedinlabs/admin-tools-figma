<script>
  import { beforeUpdate } from 'svelte';
  import FigmaSwitch from './FigmaSwitch';
  import { compareArrays } from '../../Tools';

  export let disabled = false;
  export let invertView = false;
  export let isDirty = false;
  export let isEditor = false;
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
      const cKeyIndex = 0;
      const vKeyIndex = 1;
      const compareKey = optionValueKeys[cKeyIndex];
      const valueKey = optionValueKeys[vKeyIndex];

      const valueIndex = value.findIndex(valItem => valItem[compareKey] === option.text);
      if (valueIndex > -1) {
        value[valueIndex][valueKey] = option.value;
      }
    });
  };

  beforeUpdate(() => {
    // if the the arrays are different
    if (compareArrays(options, originalOptions)) {
      // update the value
      updateValue(options);
      isDirty = true;

      // reset the options
      originalOptions = options ? [...options] : [];
    }
  });
</script>

{#each options as option (option.id)}
  <span class="switch-set">
    <FigmaSwitch
      className="form-element element-type-switch"
      disabled={disabled}
      hasMultiple={isEditor && option.value === null}
      invertView={invertView}
      labelText={option.text}
      nameId={`${nameId}-${option.id}`}
      bind:value={option.value}
    />
  </span>
{/each}
