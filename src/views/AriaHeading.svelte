<script>
  import FormUnit from './forms-controls/FormUnit';
  
  const defaultHeading = {
    level: 'no-level',
    visible: true,
    invisible: null,
  };

  export let invertView = false;
  export let itemId = null;
  export let overrides;
  export let itemIsLocked;
  export let savedHeading = { ...defaultHeading };
  export let heading = { ...defaultHeading };

  const levelOptions = [
    {
      value: 'no-level',
      text: 'None  (iOS/Android)',
      disabled: false,
    }, {
      value: 'divider--01',
      text: null,
      disabled: true,
    }, {
      value: '1',
      text: '1',
      disabled: false,
    }, {
      value: '2',
      text: '2',
      disabled: false,
    }, {
      value: '3',
      text: '3',
      disabled: false,
    }, {
      value: '4',
      text: '4',
      disabled: false,
    }, {
      value: '5',
      text: '5',
      disabled: false,
    }, {
      value: '6',
      text: '6',
      disabled: false,
    },
  ];

</script>
  
{#if heading && heading.level}
  <FormUnit
    className="form-row form-unit fixed-150"
    kind="inputSelect"
    options={levelOptions}
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
      labelText="Heading text"
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