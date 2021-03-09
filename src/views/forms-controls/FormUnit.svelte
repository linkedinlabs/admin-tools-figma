<script>
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import ButtonRemove from './ButtonRemove';
  import FigmaInput from './FigmaInput';
  import FigmaSelectMenu from './FigmaSelectMenu';
  import FigmaTextarea from './FigmaTextarea';
  import FigmaSwitch from './FigmaSwitch';
  import FormLabel from './FormLabel';
  import ButtonCopy from './ButtonCopy';
  import ButtonRestore from './ButtonRestore';

  export let className = null;
  export let disableActions = false;
  export let disableCopy = false;
  export let disableLock = false;
  export let hasMultiple = false;
  export let hideLabel = false;
  export let invertView = false;
  export let isDeletable = false;
  export let isDirty = false;
  export let itemIsLocked = false;
  export let kind = 'inputText';
  export let labelText = 'Type something…';
  export let placeholder = null;
  export let nameId = 'text-input-id';
  export let resetValue = false;
  export let selectWatchChange = false;
  export let value = null;
  export let options = [];
  export let preserveDirtyProp; // temp way to avoid updates for component with new prop-based updates
  export let a11yField; // temp way for Lynne to use different styling for a11y fields

  const dispatch = createEventDispatcher();
  let originalValue = value;
  let isLocked = itemIsLocked;
  let wasUnlocked = false;

  const restoreValue = () => {
    value = originalValue;
  };

  const handleDelete = () => dispatch('deleteSignal');

  afterUpdate(() => {
    // watch locking changes and restore value if item becomes locked
    if (!wasUnlocked && isLocked) {
      restoreValue();
      dispatch('lockUnlockSignal', isLocked);
    }

    if (wasUnlocked && !isLocked) {
      dispatch('lockUnlockSignal', isLocked);
    }

    // update the comparison variable
    wasUnlocked = isLocked;

    if (!preserveDirtyProp && (value !== originalValue) && (value !== 'blank--multiple')) {
      isDirty = true;
    } else if (!preserveDirtyProp) {
      isDirty = false;
    }

    // reset based on higher-level update
    if (resetValue && !preserveDirtyProp) {
      originalValue = value;
      isDirty = false;
    }
  });
</script>

<span class={className}>
  <FormLabel
    on:handleRestore={() => restoreValue()}
    disableActions={disableActions}
    disableCopy={disableCopy || kind === 'inputSwitch'}
    disableLock={disableLock}
    hide={hideLabel}
    invertView={invertView}
    isDirty={isDirty}
    bind:isLocked={isLocked}
    labelText={labelText}
    nameId={nameId}
    parentIsLocked={itemIsLocked}
    value={value}
    hasMultiple={hasMultiple}
    a11yField={a11yField}
  />

  <span class="form-inner-row indented">
    {#if kind === 'inputText'}
      <FigmaInput
        className="form-element element-type-text"
        disabled={isLocked || itemIsLocked}
        invertView={invertView}
        nameId={nameId}
        hasMultiple={hasMultiple}
        placeholder={hasMultiple ? 'multiple…' : placeholder}
        on:saveSignal
        bind:value={value}
      />
    {/if}

    {#if kind === 'inputTextarea'}
      <FigmaTextarea
        className="form-element element-type-textarea"
        disabled={isLocked || itemIsLocked}
        invertView={invertView}
        nameId={nameId}
        placeholder={hasMultiple ? 'multiple…' : placeholder}
        bind:value={value}
      />
    {/if}

    {#if kind === 'inputSelect'}
      <FigmaSelectMenu
        className="form-element element-type-select"
        disabled={isLocked || itemIsLocked}
        hasMultiple={hasMultiple}
        invertView={invertView}
        nameId={nameId}
        options={options}
        on:changeSignal
        bind:value={value}
        watchChange={selectWatchChange}
      />
    {/if}


    {#if kind === 'inputSwitch'}
      <FigmaSwitch
        className="form-element element-type-switch"
        disabled={isLocked || itemIsLocked}
        hasMultiple={hasMultiple}
        invertView={invertView}
        nameId={nameId}
        options={options}
        on:saveSignal
        bind:value={value}
        watchChange={selectWatchChange}
      />
    {/if}

    {#if a11yField}
      <span class="actions">
        {#if isDirty && value !== 'blank--multiple'}<ButtonRestore on:handleRestore={() => restoreValue()}/>{/if}
        {#if value && !disableCopy && kind.includes('Text')}
          <ButtonCopy valueToCopy={value}/>
        {/if}
      </span>
    {/if}

    {#if isDeletable}
      <ButtonRemove
        disabled={isLocked || itemIsLocked}
        on:handleUpdate={() => handleDelete()}
        invertView={invertView}
      />
    {/if}
  </span>
</span>
