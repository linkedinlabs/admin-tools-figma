<script>
  import { beforeUpdate } from 'svelte';
  import { lockedItems, openItems } from './stores';
  import EditorExpandedContent from './EditorExpandedContent';
  import ItemExpandedContent from './ItemExpandedContent';
  import ItemGroupHeader from './ItemGroupHeader';
  import {
    compareArrays,
    deepCopy,
    existsInArray,
  } from '../Tools';

  // props
  export let selected = null;

  // locals
  let isOpenEditor = false;
  let isOpenTypography = true;
  let { groups, items, types } = selected;
  let originalTypes = types;
  let originalGroups = groups;

  /**
   * @description A reusable helper function to take an array and add or remove data from it
   * based on a top-level key and a defined action.
   *
   * @kind function
   * @name updateArray
   *
   * @param {Array} array The array to be modified.
   * @param {Object} item Object containing the new bit of data to add, remove, or update.
   * @param {string} itemKey String representing the key to match (default is `id`).
   * @param {string} action Constant string representing the action to take
   * (`add`, `update`, or `remove`).
   *
   * @returns {Object} The modified array.
   */
  const updateArray = (
    array,
    item,
    itemKey,
    action,
  ) => {
    let updatedArray = array;

    // find the index of a pre-existing `id` match on the array
    const itemIndex = updatedArray.findIndex(
      foundItem => (foundItem[itemKey] === item[itemKey]),
    );

    // if a match exists
    if (itemIndex > -1) {
      if (action === 'update') {
        // remove it and re-add it
        updatedArray = [
          ...updatedArray.slice(0, itemIndex),
          ...[item],
          ...updatedArray.slice(itemIndex + 1),
        ];
      } else {
        // remove it
        updatedArray = [
          ...updatedArray.slice(0, itemIndex),
          ...updatedArray.slice(itemIndex + 1),
        ];
      }
    }

    // if the `action` is `add`, append the new `item` to the array
    if (action === 'add') {
      updatedArray.push(item);
    }

    return updatedArray;
  };

  /**
   * @description A reusable helper function to take an array and filter its items by
   * a supplied key. Only the filtered items are returned.
   *
   * @kind function
   * @name filterByKey
   *
   * @param {Array} array The array to be filtered.
   * @param {string} key String representing the key to match against `value` (default is `id`).
   * @param {string} value The value to test against `key`.
   *
   * @returns {Object} The modified array.
   */
  const filterByKey = (array, key, value) => {
    const filteredArray = array.filter(item => item[key] === value);
    return filteredArray;
  };

  const filterByKeys = (array, key1, value1, key2, value2) => {
    const filteredArray = array.filter(
      item => (item[key1] === value1) && (item[key2] === value2),
    );
    return filteredArray;
  };

  const compareTypesGroups = (currentArray, originalArray) => {
    let isEqual = true;
    if (currentArray.length !== originalArray.length) {
      isEqual = false;
    } else {
      currentArray.forEach((id) => {
        if (!originalArray.includes(id)) {
          isEqual = false;
        }
      });

      originalArray.forEach((id) => {
        if (!currentArray.includes(id)) {
          isEqual = false;
        }
      });
    }

    return isEqual;
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

    // ---- force open
    if (operationType === 'setOpen') {
      // retrieve open list from store and check for existing entry
      const updatedOpenItems = addEntry($openItems);

      // commit updated list to store
      openItems.set(updatedOpenItems);
    }

    // ---- force closed
    if (operationType === 'setClosed') {
      // retrieve open list from store and check for existing entry
      const updatedOpenItems = removeEntry($openItems);

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

  const handleTypeUpdate = (type, currentGroups, currentItems, operationType = 'toggleOpen') => {
    const updatedType = type;

    switch (operationType) {
      case 'toggleOpen':
        updateItemState(updatedType.id, operationType);
        break;
      case 'toggleLock': {
        let itemsOperationType = operationType;
        if (checkIsLocked(updatedType.id)) {
          itemsOperationType = 'setUnlock';
        } else {
          itemsOperationType = 'setLock';
        }

        // update the type
        updateItemState(updatedType.id, operationType);

        // update the groups
        const typeGroups = currentGroups.filter(group => group.typeId === type.id);
        typeGroups.forEach(group => updateItemState(group.id, itemsOperationType));

        // set all of the group’s items
        const typeItems = currentItems.filter(item => item.typeId === type.id);
        typeItems.forEach(item => updateItemState(item.id, itemsOperationType));
        break;
      }
      default:
    }

    // re-insert back into types list based on type `name`
    types = updateArray(types, updatedType, 'name', 'update');
  };

  const handleGroupUpdate = (group, type, currentItems, operationType = 'toggleOpen') => {
    const updatedGroup = group;
    let updatedType = null;

    switch (operationType) {
      case 'toggleOpen':
        updateItemState(updatedGroup.id, operationType);
        break;
      case 'toggleLock': {
        let itemsOperationType = operationType;
        if (checkIsLocked(updatedGroup.id)) {
          // unlock the type
          updatedType = type;
          updateItemState(updatedType.id, 'setUnlock');

          // set items op
          itemsOperationType = 'setUnlock';
        } else {
          itemsOperationType = 'setLock';
        }

        // update the group
        updateItemState(updatedGroup.id, operationType);

        // set all of the group’s items
        const groupItems = currentItems.filter(item => item.groupId === group.id);
        groupItems.forEach(item => updateItemState(item.id, itemsOperationType));
        break;
      }
      case 'partialUnlock':
        // unlock the type
        updatedType = type;
        updateItemState(updatedType.id, 'setUnlock');

        // unlock the group
        updateItemState(updatedGroup.id, 'setUnlock');
        break;
      default:
    }

    // re-insert back into groups list based on group `name`
    groups = updateArray(groups, updatedGroup, 'name', 'update');
    if (updatedType) {
      types = updateArray(types, updatedType, 'name', 'update');
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

  const setGroupsTypesOpen = (groupsTypes) => {
    groupsTypes.forEach((groupType) => {
      updateItemState(groupType.id, 'setOpen');
    });
  };

  const setEditableItems = (currentItems, lockedIdsArray) => {
    const unlockedItemIds = [];
    const unlockedItems = [];
    currentItems.forEach((item) => {
      // find the index of the locked ID
      const lockedIndex = lockedIdsArray.findIndex(
        foundId => (foundId === item.id),
      );

      if (lockedIndex < 0) {
        unlockedItems.push(item);
        unlockedItemIds.push(item.id);
      }
    });

    const editableItems = {
      items: unlockedItems,
      itemIds: unlockedItemIds,
    };
    return editableItems;
  };

  const setEditorItem = (currentItems, lockedIdsArray) => {
    const combineDescriptions = (descriptionStringsArray) => {
      const combinedDescription = descriptionStringsArray.join('\n');
      return combinedDescription;
    };

    const itemsToCompare = setEditableItems(currentItems, lockedIdsArray).items;
    const editorItem = {
      description: null,
      group: null,
      id: 'editor-item',
      kind: null,
      name: null,
      type: 'style',
      overrides: [],
    };

    const editorComponentData = {};

    const currentDescriptions = [];
    const currentGroups = [];
    const currentNames = [];
    let isComponents = true;
    itemsToCompare.forEach((item) => {
      // add all descriptions (they are parsed in `Description`)
      currentDescriptions.push(item.description);
      if (!currentGroups.includes(item.group)) {
        currentGroups.push(item.group);
      }
      if (!currentNames.includes(item.name)) {
        currentNames.push(item.name);
      }
      if (
        (item.type !== 'COMPONENT')
        && (item.type !== 'COMPONENT_SET')
      ) {
        isComponents = false;
      }
    });

    if (currentGroups.length >= 1) {
      editorItem.group = currentGroups.length === 1 ? currentGroups[0] : null;
      editorItem.overrides.push('group');
    }

    if (currentNames.length >= 1) {
      editorItem.name = currentNames.length === 1 ? currentNames[0] : null;
      editorItem.overrides.push('name');
    }

    if (currentDescriptions.length >= 1) {
      editorItem.description = combineDescriptions(currentDescriptions);
      editorItem.overrides.push('description');
    }

    if (isComponents) {
      editorItem.type = 'COMPONENT';

      // set up editorComponentData ------------
      // compare each successive value; if they do not match, set to `null`
      // and add them to the "overrides" list.
      itemsToCompare.forEach((item) => {
        if (item.componentData) {
          Object.keys(item.componentData).forEach((key) => {
            if (!Object.keys(editorComponentData).includes(key)) {
              if (key === 'heading') {
                editorComponentData[key] = {...item.componentData[key]};
              } else {
                editorComponentData[key] = typeof editorComponentData[key] === 'object'
                  ? deepCopy(item.componentData[key]) : item.componentData[key];
              }
            } else if (
              (editorComponentData[key] !== undefined)
              && (editorComponentData[key] !== null)
              && (editorComponentData[key].constructor === Array)
            ) {
              if (key !== 'variants') {
                if (compareArrays(item.componentData[key], editorComponentData[key])) {
                  editorComponentData[key] = [];
                  editorItem.overrides.push(key);
                }
              } else {
                item.componentData.variants.forEach((itemVariant) => {
                  if (!existsInArray(editorComponentData.variants, itemVariant.key, 'key')) {
                    editorComponentData.variants.push(itemVariant);
                  } else {
                    const compareVariantIndex = 0;
                    const compareVariant = editorComponentData.variants.filter(
                      editorVariant => editorVariant.key === itemVariant.key,
                    )[compareVariantIndex];

                    // if they are different, set ignore to `null`
                    // and set `hasMultiple` flag
                    if (itemVariant.ignore !== compareVariant.ignore) {
                      compareVariant.ignore = null;
                      compareVariant.hasMultiple = true;
                    }
                  }
                });
              }
            } else if (editorComponentData[key] !== item.componentData[key]) {
              if (['labels', 'heading'].includes(key)) {
                Object.entries(item.componentData[key]).forEach(([propKey, val]) => {
                  const hasProperty = editorComponentData[key].hasOwnProperty(propKey);
                  if (!(!hasProperty && !val)
                    && editorComponentData[key][propKey] !== val
                  ) {
                    editorItem.overrides.push(`${ key }-${ propKey }`);
                    editorComponentData[key][propKey] = null;
                  }
                });
              } else {
                editorComponentData[key] = null;
                editorItem.overrides.push(key);
              }
            }
          });
        }
      });
      editorItem.componentData = editorComponentData;
    }
    return editorItem;
  };

  const generateEditableLabel = (currentItems, lockedIdsArray) => {
    const itemCount = setEditableItems(currentItems, lockedIdsArray).itemIds.length;
    const itemText = itemCount === 1 ? 'style' : 'styles';
    const labelText = `Modifying ${itemCount} ${itemText}`;
    return labelText;
  };

  // set groups/types open initially
  setGroupsTypesOpen(types);
  setGroupsTypesOpen(groups);

  beforeUpdate(() => {
    groups = selected.groups;
    items = selected.items;
    types = selected.types;

    if (!compareTypesGroups(types, originalTypes)) {
      setGroupsTypesOpen(types);
      originalTypes = types;
    }

    if (!compareTypesGroups(groups, originalGroups)) {
      setGroupsTypesOpen(groups);
      originalGroups = groups;
    }
  });
</script>

<section
  class="options"
  id="action-options"
>
  <ul class="items-list">
    {#if setEditableItems(items, $lockedItems).itemIds.length > 1 || isOpenEditor}
      <li class={`bulk-editor${isOpenEditor ? ' expanded' : ''}`}>
        <ItemGroupHeader
          on:handleUpdate={() => handleIsOpenUpdate('editor')}
          isOpen={isOpenEditor}
          labelText={isOpenEditor ? generateEditableLabel(items, $lockedItems) : 'Modify all unlocked'}
          type="bulk-editor"
        />
        {#if isOpenEditor}
          <EditorExpandedContent
            editorItem={setEditorItem(items, $lockedItems)}
            editableItemIds={setEditableItems(items, $lockedItems).itemIds}
          />
        {/if}
      </li>
    {/if}

    {#each types as type (type.id)}
      {#if type.name !== 'Component'}
        <li class="style-type">
          <ItemGroupHeader
            on:handleUpdate={customEvent => handleTypeUpdate(type, groups, items, customEvent.detail)}
            isLocked={checkIsLocked(type.id)}
            isOpen={checkIsOpen(type.id)}
            isTypeContainer={true}
            labelText={type.name}
            type="style-type"
          />
        </li>
      {/if}

      {#if checkIsOpen(type.id)}
        {#each filterByKey(groups, 'typeId', type.id) as group (group.id)}
          <li class="group-type">
            <ItemGroupHeader
              on:handleUpdate={customEvent => handleGroupUpdate(group, type, items, customEvent.detail)}
              isGroupContainer={true}
              isLocked={checkIsLocked(group.id)}
              isOpen={checkIsOpen(group.id)}
              labelText={`${group.name ? group.name : 'Ungrouped'} ${type.name !== 'Component' ? type.name : ''}`}
              type="group-type"
            />
          </li>

          {#if checkIsOpen(group.id)}
            {#each filterByKeys(items, 'groupId', group.id, 'typeId', type.id) as item (item.id)}
              <li class={`main-item${checkIsOpen(item.id) ? ' expanded' : ''}`}>
                <ItemGroupHeader
                  on:handleUnlock={() => handleGroupUpdate(group, type, items, 'partialUnlock')}
                  on:handleUpdate={customEvent => updateItemState(item.id, customEvent.detail)}
                  isLocked={checkIsLocked(item.id)}
                  isOpen={checkIsOpen(item.id)}
                  labelGroupText={item.group}
                  labelText={item.nameDisplay}
                  type="main-item"
                />
                {#if checkIsOpen(item.id)}
                  <ItemExpandedContent
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
