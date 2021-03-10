<script>
  import FormUnit from './forms-controls/FormUnit';
  import { setBulkSelectOptions } from '../Tools';
  import { levelOptions } from './stores';
  
  const defaultHeading = {
    level: 'no-level',
    visible: true,
    invisible: null,
  };

  export let invertView = false;
  export let itemId = null;
  export let isEditor;
  export let overrides;
  export let itemIsLocked;
  export let savedHeading = { ...defaultHeading };
  export let heading = { ...defaultHeading };

</script>
  
{#if heading}
  <FormUnit
    className="form-row form-unit fixed-150"
    kind="inputSelect"
    options={setBulkSelectOptions($levelOptions, heading.level, isEditor)}
    labelText="Level"
    nameId={`${itemId}-heading-level`}
    placeholder="Leave empty to use system default"
    invertView={invertView}
    itemIsLocked={itemIsLocked}
    hasMultiple={overrides.includes('heading-level')}
    isDirty={savedHeading.level !== heading.level}
    bind:value={heading.level}
    preserveDirtyProp={true}
    a11yField={true}
  />
  <FormUnit
    className="form-row form-unit fixed-150"
    kind="inputSwitch"
    labelText="Visible heading"
    nameId={`${itemId}-heading-visible`}
    placeholder="Leave empty to use a11y label"
    invertView={invertView}
    itemIsLocked={itemIsLocked}
    hasMultiple={overrides.includes('heading-visible')}
    isDirty={savedHeading.visible !== heading.visible}
    bind:value={heading.visible}
    preserveDirtyProp={true}
    a11yField={true}
  />
  {#if !heading.visible}
    <FormUnit
      className="form-row form-unit fixed-150"
      kind="inputText"
      labelText="Heading"
      nameId={`${itemId}-heading-invisible`}
      placeholder="e.g. 'Skip for now'"
      invertView={invertView}
      itemIsLocked={itemIsLocked}
      hasMultiple={overrides.includes('heading-invisible')}
      isDirty={savedHeading.invisible !== heading.invisible}
      bind:value={heading.invisible}
      preserveDirtyProp={true}
      a11yField={true}
    />
  {/if}
{/if}
