<script>
  import { afterUpdate, onMount } from 'svelte';
  import {
    existsInArray,
    filterByKey,
    updateArray,
  } from '../Tools';
  import EditorExpandedContent from './EditorExpandedContent';
  import ItemExpandedContent from './ItemExpandedContent';
  import ItemGroupHeader from './ItemGroupHeader';

  // props
  export let items = null;

  // locals
  let isOpenEditor = false;
  let isOpenTypography = true;
  let groups = [];
  let masterItems = items;
  let types = [];

  // imported helpers used in the UI need a local reference
  const runFilterByKey = filterByKey;
  const runUpdateArray = updateArray;

  const setTypes = (allItems) => {
    const typeItems = [];
    allItems.forEach((item) => {
      if (!typeItems.includes(item.type)) {
        types.push({
          name: item.typeName,
          lockingStatus: 'unlocked', // locked, partial, unlocked
          isOpen: true,
          type: item.type,
        });
        typeItems.push(item.type);
      }
    });
    return types;
  };

  const setGroups = (allItems, typesToMatch) => {
    let groupItems = [];
    allItems.forEach((item) => {
      const grabIndex = 0;
      const typeItem = typesToMatch.filter(type => type.name === item.typeName)[grabIndex];
      if (typeItem && !existsInArray(groupItems, 'name', item.group)) {
        const groupItem = {
          name: item.group,
          lockingStatus: 'unlocked', // locked, partial, unlocked
          isOpen: true,
          type: typeItem.type,
        };
        groupItems = [...groupItems, groupItem];
      }
    });

    return groupItems;
  };

  const handleTypeUpdate = (type, operationType = 'toggleOpen') => {
    const updatedType = type;

    switch (operationType) {
      case 'toggleOpen':
        // toggle `isOpen`
        updatedType.isOpen = !type.isOpen;
        break;
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

  const handleItemUpdate = (item) => {
    const updatedItem = item;

    // toggle `isOpen`
    updatedItem.isOpen = !item.isOpen;

    // re-insert back into masterItems list based on item `id`
    masterItems = runUpdateArray(masterItems, updatedItem, 'id', 'update');
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

  $: {
    console.log('items here')
    console.log(items)
  }

  onMount(async () => {
    types = setTypes(masterItems);
    groups = setGroups(masterItems, types);
  });

  afterUpdate(async () => {
    masterItems = items;
  })
</script>

<section class="options" id="action-options">
  <ul id="sample-list">
    <li class={`bulk-editor${isOpenEditor ? ' expanded' : ''}`}>
      <ItemGroupHeader
        on:handleUpdate={() => handleIsOpenUpdate('editor')}
        isOpen={isOpenEditor}
        labelText={isOpenEditor ? `Modifying ${items ? items.length : 0} styles` : 'Modify all unlocked'}
        type="bulk-editor"
      />
      {#if isOpenEditor}
        <EditorExpandedContent/>
      {/if}
    </li>

    {#each types as type (type.name)}
      <li class="style-type">
        <ItemGroupHeader
          on:handleUpdate={() => handleTypeUpdate(type)}
          isLocked={type.lockingStatus === 'locked'}
          isOpen={type.isOpen}
          isTypeContainer={true}
          labelText={type.name}
          type="style-type"
          bind:typeIsLocked={type.lockingStatus}
        />
      </li>

      {#if type.isOpen}
        {#each runFilterByKey(groups, 'type', type.type) as group (group.name)}
          <li class="group-type">
            <ItemGroupHeader
              on:handleUpdate={() => handleGroupUpdate(group, type)}
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
            {#each runFilterByKey(masterItems, 'group', group.name) as item (item.id)}
              <li class={`master-item${item.isOpen ? ' expanded' : ''}`}>
                <ItemGroupHeader
                  on:handleUnlock={() => handleGroupUpdate(group, type, 'partialUnlock')}
                  on:handleUpdate={() => handleItemUpdate(item)}
                  groupIsLocked={group.lockingStatus}
                  bind:isLocked={item.locked}
                  isOpen={item.isOpen}
                  labelGroupText={item.group}
                  labelText={item.name}
                  type="master-item"
                />
                {#if item.isOpen}
                  <ItemExpandedContent
                    on:handleUpdate={() => handleItemUpdate(item)}
                    groupIsLocked={group.lockingStatus}
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
