<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<style>
  /* components/icon-button > @button-icon */
</style>

<button
  class="item-toggle action-restore"
  on:click={() => dispatch('handleRestore')}
>
  <span class="label">
    Restore item
  </span>
  <span class="icon">
    <svg viewBox="0 0 12 12" fill="none">
      <path d="M0.495605 0.495605L1.75766 1.75766C2.84335 0.671782 4.3431 0 5.99998 0C9.30629 0 12.0024 2.69818 12 6.00447C11.9976 9.31614 9.31222 12 6 12C4.4534 12 3.0435 11.4148 1.97956 10.4538C1.85586 10.3421 1.85006 10.1499 1.9679 10.0321L2.44544 9.55454C2.55426 9.44572 2.72978 9.43877 2.84465 9.54118C3.68257 10.2882 4.78778 10.7419 6 10.7419C8.62067 10.7419 10.7419 8.62108 10.7419 6C10.7419 3.37933 8.62108 1.25806 6 1.25806C4.6896 1.25806 3.50427 1.78846 2.64644 2.64644L3.95598 3.95601C4.13889 4.13891 4.00935 4.45161 3.7507 4.45161H0.290323C0.129992 4.45161 0 4.32162 0 4.16129V0.700911C0 0.442258 0.312726 0.312726 0.495605 0.495605Z"/>
    </svg>
  </span>
</button>
