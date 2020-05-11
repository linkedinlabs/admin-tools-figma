<script>
  import EditorExpandedContent from './EditorExpandedContent';
  import ItemExpandedContent from './ItemExpandedContent';
  import ItemGroupHeader from './ItemGroupHeader';

  export let numberSelected = 0;

  let isOpenEditor = false;
  let isOpenTypography = true;
  let groups = [];

  let masterItems = [
    {
      id: 1,
      labelGroupText: 'Display',
      labelText: 'Display Large',
      locked: true,
      isOpen: false,
      kind: 'typography',
    },
    {
      id: 2,
      labelGroupText: 'Display',
      labelText: 'Display Large Bold',
      locked: true,
      isOpen: false,
      kind: 'typography',
    },
    {
      id: 3,
      labelGroupText: 'Display',
      labelText: 'Display XLarge',
      locked: false,
      isOpen: true,
      kind: 'typography',
    },
  ];

  let typographyItems = masterItems.filter(masterItem => masterItem.kind === 'typography');

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

  const handleGroupUpdate = (group) => {
    // locate original group based on passed group `name`
    const grabIndex = 0;
    const updatedGroup = groups.filter(groupItem => groupItem.name === group.name)[grabIndex];

    // toggle `isOpen`
    updatedGroup.isOpen = !group.isOpen;

    // re-insert back into groups list
    const itemIndex = groups.findIndex(groupItem => groupItem.name === group.name);
    groups = [
      ...groups.slice(0, itemIndex),
      ...[updatedGroup],
      ...groups.slice(itemIndex + 1),
    ];

    // update by type
    typographyItems = masterItems.filter(masterItem => masterItem.kind === 'typography');
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
    typographyItems = masterItems.filter(masterItem => masterItem.kind === 'typography');
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

  const sortGroupItems = (allItems) => {
    allItems.forEach((item) => {
      if (!itemExists(groups, 'name', item.labelGroupText)) {
        const groupItem = {
          name: item.labelGroupText,
          isOpen: true,
        };
        groups = [...groups, groupItem];
      }
    });

    return groups;
  };

  const filterItemsByGroup = (allItems, groupType) => {
    const filteredItems = allItems.filter(item => item.labelGroupText === groupType);
    return filteredItems;
  };
</script>

<section class="options" id="action-options">
  <ul id="sample-list">
    <li class={`bulk-editor${isOpenEditor ? ' expanded' : ''}`}>
      <ItemGroupHeader
        on:handleUpdate={() => handleIsOpenUpdate('editor')}
        isOpen={isOpenEditor}
        labelText={isOpenEditor ? `Modifying ${numberSelected} styles` : 'Modify all unlocked'}
        type="bulk-editor"
      />
      {#if isOpenEditor}
        <EditorExpandedContent/>
      {/if}
    </li>

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
              isOpen={true}
              labelText={`${group.name} Typography`}
              type="group-type"
            />
          </li>

          {#if group.isOpen}
            {#each filterItemsByGroup(typographyItems, group.name) as item (item.id)}
              <li class={`master-item${item.isOpen ? ' expanded' : ''}`}>
                <ItemGroupHeader
                  on:handleUpdate={() => handleItemUpdate(item)}
                  bind:isLocked={item.locked}
                  isOpen={item.isOpen}
                  labelGroupText={item.labelGroupText}
                  labelText={item.labelText}
                  type="master-item"
                />
                {#if item.isOpen}
                  <ItemExpandedContent item={item}/>
                {/if}
              </li>
            {/each}
          {/if}
        {/each}
      {/if}
    {/if}
  </ul>
</section>
