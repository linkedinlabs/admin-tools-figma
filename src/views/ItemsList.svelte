<script>
  import EditorExpandedContent from './EditorExpandedContent';
  import ItemExpandedContent from './ItemExpandedContent';
  import ItemGroupHeader from './ItemGroupHeader';

  export let items = null;

  let isOpenEditor = false;
  let isOpenTypography = true;
  let groups = [];

  // let masterItems = [
  //   {
  //     id: 1,
  //     group: 'Display',
  //     name: 'Display Large',
  //     locked: true,
  //     isOpen: false,
  //     type: 'TEXT',
  //     typeName: 'Typography',
  //   },
  //   {
  //     id: 2,
  //     group: 'Display',
  //     name: 'Display Large Bold',
  //     locked: true,
  //     isOpen: false,
  //     type: 'TEXT',
  //     typeName: 'Typography',
  //   },
  //   {
  //     id: 3,
  //     group: 'Display',
  //     name: 'Display XLarge',
  //     locked: false,
  //     isOpen: true,
  //     type: 'TEXT',
  //     typeName: 'Typography',
  //   },
  // ];


  let masterItems = items;
  let styleTypes = [];

  const setStyleTypes = (array) => {
    const typesFound = [];
    array.forEach(item => {
      if (!typesFound.includes(item.type)) {
        styleTypes.push({
          name: item.typeName,
          isOpen: true,
          locked: false,
          type: item.type,
        });
        typesFound.push(item.type)        
      }
    });
    return styleTypes;
  }

  let typographyItems = masterItems.filter(masterItem => masterItem.type === 'TEXT');
  let fillItems = masterItems.filter(masterItem => masterItem.type === 'PAINT');

  const itemsByType = (array, filterType) => {
    const filteredItems = masterItems.filter(masterItem => masterItem.type === filterType);
    return filteredItems;
  }

  const itemExists = (array, key, value) => {
    let doesExist = false;
    const itemIndex = array.findIndex(
      foundItem => (foundItem[key] === value),
    );

    if (itemIndex > -1) {
      doesExist = true;
    }

    return doesExist;
  };

  const handleGroupUpdate = (group, operationType = 'toggleOpen') => {
    // locate original group based on passed group `name`
    const grabIndex = 0;
    const updatedGroup = groups.filter(groupItem => groupItem.name === group.name)[grabIndex];

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

    // re-insert back into groups list
    const itemIndex = groups.findIndex(groupItem => groupItem.name === group.name);
    groups = [
      ...groups.slice(0, itemIndex),
      ...[updatedGroup],
      ...groups.slice(itemIndex + 1),
    ];

    // update by type
    typographyItems = masterItems.filter(masterItem => masterItem.type === 'TEXT');
  };

  const handleItemUpdate = (item) => {
    // locate original item based on passed item `id`
    const grabIndex = 0;
    const updatedItem = masterItems.filter(masterItem => masterItem.id === item.id)[grabIndex];

    // toggle `isOpen`
    updatedItem.isOpen = !item.isOpen;

    // re-insert back into masterItems list
    const itemIndex = masterItems.findIndex(masterItem => masterItem.id === item.id);
    masterItems = [
      ...masterItems.slice(0, itemIndex),
      ...[updatedItem],
      ...masterItems.slice(itemIndex + 1),
    ];

    // update by type
    typographyItems = masterItems.filter(masterItem => masterItem.type === 'TEXT');
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

  const sortGroupItems = (allItems, filterType) => {
    let groupItems = [];
    allItems.forEach((item) => {
      if (item.type === filterType && !itemExists(groupItems, 'name', item.group)) {
        const groupItem = {
          name: item.group,
          lockingStatus: 'unlocked', // locked, partial, unlocked
          isOpen: true,
        };
        groupItems = [...groupItems, groupItem];
      }
    });

    return groupItems;
  };

  const filterItemsByGroup = (allItems, groupType) => {
    const filteredItems = allItems.filter(item => item.group === groupType);
    return filteredItems;
  };
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

    {#each setStyleTypes(masterItems) as styleType (styleType.name)}
      <li class="style-type">
        <ItemGroupHeader
          on:handleUpdate={() => handleIsOpenUpdate('style-type')}
          isOpen={styleType.isOpen}
          labelText={styleType.name}
          type="style-type"
        />
      </li>

      {#if styleType.isOpen}
        {#each sortGroupItems(masterItems, styleType.type) as group (group.name)}
          <li class="group-type">
            <ItemGroupHeader
              on:handleUpdate={() => handleGroupUpdate(group)}
              bind:groupIsLocked={group.lockingStatus}
              isGroupContainer={true}
              isOpen={group.isOpen}
              labelText={`${group.name} ${styleType.name}`}
              type="group-type"
            />
          </li>

          {#if group.isOpen}
            {#each filterItemsByGroup(masterItems, group.name) as item (item.id)}
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

    <!--
    {#if typographyItems}
      <li class="style-type">
        <ItemGroupHeader
          on:handleUpdate={() => handleIsOpenUpdate('style-type')}
          isOpen={isOpenTypography}
          labelText="Typography"
          type="style-type"
        />
      </li>

      {#if isOpenTypography}
        {#each sortGroupItems(typographyItems) as group (group.name)}
          <li class="group-type">
            <ItemGroupHeader
              on:handleUpdate={() => handleGroupUpdate(group)}
              bind:groupIsLocked={group.lockingStatus}
              isGroupContainer={true}
              isOpen={group.isOpen}
              labelText={`${group.name} Typography`}
              type="group-type"
            />
          </li>

          {#if group.isOpen}
            {#each filterItemsByGroup(typographyItems, group.name) as item (item.id)}
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
    {/if}
    -->
  </ul>
</section>
