<script>
  import ItemExpandedContent from './ItemExpandedContent';
  import ItemGroupHeader from './ItemGroupHeader';

  const masterItems = [
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
