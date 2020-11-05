<script>
  import FormLabel from './FormLabel';
  import FigmaSwitch from './FigmaSwitch';

  export let disabled = false;
  export let hasMultiple = false;
  export let invertView = false;
  export let nameId = null;
  export let options = [
    {
      id: 'unassigned',
      value: 'unassigned',
      text: 'Not assigned',
    },
  ];
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
