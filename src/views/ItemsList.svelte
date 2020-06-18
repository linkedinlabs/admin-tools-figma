<script>
  import { afterUpdate } from 'svelte';
  import { lockedItems, openItems } from './stores';
  import { filterByKey, updateArray } from '../Tools';
  import EditorExpandedContent from './EditorExpandedContent';
  import ItemExpandedContent from './ItemExpandedContent';
  import ItemGroupHeader from './ItemGroupHeader';

  // props
  export let selected = null;

  // locals
  let isOpenEditor = false;
  let isOpenTypography = true;
  let { groups, types } = selected;
  let masterItems = selected.items;

  // imported helpers used in the UI need a local reference
  const runFilterByKey = filterByKey;
  const runUpdateArray = updateArray;

  const handleTypeUpdate = (type, operationType = 'toggleOpen') => {
    const updatedType = type;

    switch (operationType) {
      case 'toggleOpen':
        // toggle `isOpen`
        updatedType.isOpen = !type.isOpen;
        break;
      case 'toggleLock': {
        if (type.lockingStatus === 'locked') {
          updatedType.lockingStatus = 'unlocked';
        } else {
          updatedType.lockingStatus = 'locked';
        }
        break;
      }
      case 'setLock': {
        updatedType.lockingStatus = 'locked';
        break;
      }
      case 'setUnlock': {
        updatedType.lockingStatus = 'unlocked';
        break;
      }
      default:
    }

    // re-insert back into types list based on type `name`
    types = runUpdateArray(types, updatedType, 'name', 'update');
  };

  const handleGroupUpdate = (group, type = null, operationType = 'toggleOpen') => {
    const updatedGroup = group;
    let updatedType = null;

    switch (operationType) {
      case 'toggleOpen':
        // toggle `isOpen`
        updatedGroup.isOpen = !group.isOpen;
        break;
      case 'toggleLock': {
        if (group.lockingStatus === 'locked') {
          updatedGroup.lockingStatus = 'unlocked';
        } else {
          updatedGroup.lockingStatus = 'locked';
        }
        break;
      }
      case 'setLock': {
        updatedGroup.lockingStatus = 'locked';
        break;
      }
      case 'setUnlock': {
        updatedGroup.lockingStatus = 'unlocked';
        break;
      }
      case 'partialUnlock':
        updatedType = type;
        updatedGroup.lockingStatus = 'partial';
        updatedType.lockingStatus = 'partial';
        break;
      default:
    }

    // re-insert back into groups list based on group `name`
    groups = runUpdateArray(groups, updatedGroup, 'name', 'update');
    if (updatedType) {
      types = runUpdateArray(types, updatedType, 'name', 'update');
    }
  };

  const updateItemState = (itemId, operationType = 'toggleOpen') => {
    const addOrRemoveEntry = (itemsArray) => {
      let updatedItemsArray = itemsArray;
      const itemIndex = itemsArray.findIndex(
        foundId => (foundId === itemId),
      );

      // add or remove entry
      if (itemIndex > -1) {
        updatedItemsArray = [
          ...updatedItemsArray.slice(0, itemIndex),
          ...updatedItemsArray.slice(itemIndex + 1),
        ];
      } else {
        updatedItemsArray.push(itemId);
      }

      return updatedItemsArray;
    };

    const removeEntry = (itemsArray) => {
      let updatedItemsArray = itemsArray;
      const itemIndex = itemsArray.findIndex(
        foundId => (foundId === itemId),
      );

      // add or remove entry
      if (itemIndex > -1) {
        updatedItemsArray = [
          ...updatedItemsArray.slice(0, itemIndex),
          ...updatedItemsArray.slice(itemIndex + 1),
        ];
      }

      return updatedItemsArray;
    };

    const addEntry = (itemsArray) => {
      // remove first to prevent duplicates
      const updatedItemsArray = removeEntry(itemsArray);
      updatedItemsArray.push(itemId);

      return updatedItemsArray;
    };

    // ---- toggle `isOpen`
    if (operationType === 'toggleOpen') {
      // retrieve open list from store and check for existing entry
      const updatedOpenItems = addOrRemoveEntry($openItems);

      // commit updated list to store
      openItems.set(updatedOpenItems);
    }

    // ---- toggle locking
    if (operationType === 'toggleLock') {
      // retrieve open list from store and check for existing entry
      const updatedLockedItems = addOrRemoveEntry($lockedItems);

      // commit updated list to store
      lockedItems.set(updatedLockedItems);
    }

    // ---- force locking
    if (operationType === 'setLock') {
      // retrieve open list from store and check for existing entry
      const updatedLockedItems = addEntry($lockedItems);

      // commit updated list to store
      lockedItems.set(updatedLockedItems);
    }

    // ---- force unlocking
    if (operationType === 'setUnlock') {
      // retrieve open list from store and check for existing entry
      const updatedLockedItems = removeEntry($lockedItems);

      // commit updated list to store
      lockedItems.set(updatedLockedItems);
    }
  };

  const handleIsOpenUpdate = (type) => {
    switch (type) { // eslint-disable-line default-case
      case 'editor':
        isOpenEditor = !isOpenEditor;
        break;
      case 'style-type':
        isOpenTypography = !isOpenTypography;
        break;
    }
  };

  const checkIsLocked = (itemId) => {
    let itemIsLocked = false;

    // check the store to see if an entry exists
    const itemIndex = $lockedItems.findIndex(foundId => (foundId === itemId));

    // if the index exists, the item is locked
    if (itemIndex > -1) {
      itemIsLocked = true;
    }

    return itemIsLocked;
  };

  const checkIsOpen = (itemId) => {
    let itemIsOpen = false;

    // check the store to see if an entry exists
    const itemIndex = $openItems.findIndex(foundId => (foundId === itemId));

    // if the index exists, the item is open
    if (itemIndex > -1) {
      itemIsOpen = true;
    }

    return itemIsOpen;
  };

  afterUpdate(async () => {
    masterItems = selected.items;
  });
</script>

<section class="options" id="action-options">
  <ul id="sample-list">
    <li class={`bulk-editor${isOpenEditor ? ' expanded' : ''}`}>
      <ItemGroupHeader
        on:handleUpdate={() => handleIsOpenUpdate('editor')}
        isOpen={isOpenEditor}
        labelText={isOpenEditor ? `Modifying ${selected.items ? selected.items.length : 0} styles` : 'Modify all unlocked'}
        type="bulk-editor"
      />
      {#if isOpenEditor}
        <EditorExpandedContent/>
      {/if}
    </li>

    {#each types as type (type.id)}
      <li class="style-type">
        <ItemGroupHeader
          on:handleUpdate={customEvent => handleTypeUpdate(type, customEvent.detail)}
          isLocked={type.lockingStatus === 'locked'}
          isOpen={type.isOpen}
          isTypeContainer={true}
          labelText={type.name}
          type="style-type"
          bind:typeIsLocked={type.lockingStatus}
        />
      </li>

      {#if type.isOpen}
        {#each runFilterByKey(groups, 'typeId', type.id) as group (group.id)}
          <li class="group-type">
            <ItemGroupHeader
              on:handleUpdate={customEvent => handleGroupUpdate(group, type, customEvent.detail)}
              bind:groupIsLocked={group.lockingStatus}
              isGroupContainer={true}
              isLocked={group.lockingStatus === 'locked'}
              isOpen={group.isOpen}
              labelText={`${group.name} ${type.name}`}
              type="group-type"
              typeIsLocked={type.lockingStatus}
            />
          </li>

          {#if group.isOpen}
            {#each runFilterByKey(masterItems, 'groupId', group.id) as item (item.id)}
              <li class={`master-item${checkIsOpen(item.id) ? ' expanded' : ''}`}>
                <ItemGroupHeader
                  on:handleUnlock={() => handleGroupUpdate(group, type, 'partialUnlock')}
                  on:handleUpdate={customEvent => updateItemState(item.id, customEvent.detail)}
                  groupIsLocked={group.lockingStatus}
                  isLocked={checkIsLocked(item.id)}
                  isOpen={checkIsOpen(item.id)}
                  labelGroupText={item.group}
                  labelText={item.name}
                  type="master-item"
                />
                {#if checkIsOpen(item.id)}
                  <ItemExpandedContent
                    groupIsLocked={group.lockingStatus}
                    isLocked={checkIsLocked(item.id)}
                    item={item}
                  />
                {/if}
              </li>
            {/each}
          {/if}
        {/each}
      {/if}
    {/each}
  </ul>
</section>
