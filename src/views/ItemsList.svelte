<script>
  import { onMount } from 'svelte';
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

  const setTypes = (allItems) => {
    const typeItems = [];
    allItems.forEach((item) => {
      if (!typeItems.includes(item.type)) {
        types.push({
          name: item.typeName,
          isOpen: true,
          locked: false,
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

  const handleGroupUpdate = (group, operationType = 'toggleOpen') => {
    const updatedGroup = group;

    switch (operationType) {
      case 'toggleOpen':
        // toggle `isOpen`
        updatedGroup.isOpen = !group.isOpen;
        break;
      case 'partialUnlock':
        updatedGroup.lockingStatus = 'partial';
        break;
      default:
    }

    // re-insert back into groups list based on group `name`
    groups = updateArray(groups, updatedGroup, 'name', 'update');
  };

  const handleItemUpdate = (item) => {
    const updatedItem = item;

    // toggle `isOpen`
    updatedItem.isOpen = !item.isOpen;

    // re-insert back into masterItems list based on item `id`
    masterItems = updateArray(masterItems, updatedItem, 'id', 'update');
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

  onMount(async () => {
    types = setTypes(masterItems);
    groups = setGroups(masterItems, types);
  });
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
          on:handleUpdate={() => handleIsOpenUpdate('style-type')}
          isOpen={type.isOpen}
          labelText={type.name}
          type="style-type"
        />
      </li>

      {#if type.isOpen}
        {#each runFilterByKey(groups, 'type', type.type) as group (group.name)}
          <li class="group-type">
            <ItemGroupHeader
              on:handleUpdate={() => handleGroupUpdate(group)}
              bind:groupIsLocked={group.lockingStatus}
              isGroupContainer={true}
              isOpen={group.isOpen}
              labelText={`${group.name} ${type.name}`}
              type="group-type"
            />
          </li>

          {#if group.isOpen}
            {#each runFilterByKey(masterItems, 'group', group.name) as item (item.id)}
              <li class={`master-item${item.isOpen ? ' expanded' : ''}`}>
                <ItemGroupHeader
                  on:handleUnlock={() => handleGroupUpdate(group, 'partialUnlock')}
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
