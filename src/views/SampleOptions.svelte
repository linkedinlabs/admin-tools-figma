<script>
  import ItemExpandedContent from './ItemExpandedContent';
  import ItemGroupHeader from './ItemGroupHeader';

  let masterItems = [
    {
      id: 1,
      labelGroupText: 'Display',
      labelText: 'x Display Large',
      isLocked: true,
      isOpen: false,
    },
    {
      id: 2,
      labelGroupText: 'Display',
      labelText: 'x Display Large Bold',
      isLocked: true,
      isOpen: false,
    },
    {
      id: 3,
      labelGroupText: 'Display',
      labelText: 'x Display XLarge',
      isLocked: false,
      isOpen: true,
    },
  ];

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
  };
</script>

<section class="options" id="action-options">
  <ul id="sample-list">
    <li class="bulk-editor">
      <ItemGroupHeader
        isOpen={true}
        labelText="Modify all unlocked"
        type="bulk-editor"
      />
    </li>

    <li class="style-type">
      <ItemGroupHeader
        isOpen={true}
        labelText="Typography"
        type="style-type"
      />
    </li>

    <li class="group-type">
      <ItemGroupHeader
        isOpen={true}
        labelText="Display Typography"
        type="group-type"
      />
    </li>
    
    {#each masterItems as item (item.id)}
      <li class={`master-item${item.isOpen ? ' expanded' : ''}`}>
        <ItemGroupHeader
          on:handleUpdate={() => handleItemUpdate(item)}
          isLocked={item.isLocked}
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
  </ul>
</section>
