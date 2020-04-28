<script>
  export let labelText = null;
  export let nameId = null;
  export let disableActions = false;
</script>

<style>
  /* components/form-elements > @form-label */
</style>

<span class="form-label">
  <span class="text">
    <label for={nameId}>{labelText}</label>
  </span>
  {#if !disableActions}
    <span class="actions">
      <button class="item-toggle action-restore inactive">
        <span class="label">
          Lock/unlock item
        </span>
        <span class="icon">
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M0.495605 0.495605L1.75766 1.75766C2.84335 0.671782 4.3431 0 5.99998 0C9.30629 0 12.0024 2.69818 12 6.00447C11.9976 9.31614 9.31222 12 6 12C4.4534 12 3.0435 11.4148 1.97956 10.4538C1.85586 10.3421 1.85006 10.1499 1.9679 10.0321L2.44544 9.55454C2.55426 9.44572 2.72978 9.43877 2.84465 9.54118C3.68257 10.2882 4.78778 10.7419 6 10.7419C8.62067 10.7419 10.7419 8.62108 10.7419 6C10.7419 3.37933 8.62108 1.25806 6 1.25806C4.6896 1.25806 3.50427 1.78846 2.64644 2.64644L3.95598 3.95601C4.13889 4.13891 4.00935 4.45161 3.7507 4.45161H0.290323C0.129992 4.45161 0 4.32162 0 4.16129V0.700911C0 0.442258 0.312726 0.312726 0.495605 0.495605Z"/>
          </svg>
        </span>
      </button>
      <button class="item-toggle action-lock-toggle">
        <span class="label">
          Lock/unlock item
        </span>
        <span class="icon locked">
          <svg viewBox="0 0 16 16">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 5.5V7H6.5V5.5C6.5 4.67157 7.17157 4 8 4C8.82843 4 9.5 4.67157 9.5 5.5ZM5.5 7V5.5C5.5 4.11929 6.61929 3 8 3C9.38071 3 10.5 4.11929 10.5 5.5V7H11C11.2761 7 11.5 7.22386 11.5 7.5V12.5C11.5 12.7761 11.2761 13 11 13H5C4.72386 13 4.5 12.7761 4.5 12.5V7.5C4.5 7.22386 4.72386 7 5 7H5.5Z"/>
          </svg>
        </span>
        <span class="icon unlocked">
          <svg viewBox="0 0 16 16">
            <g clip-path="url(#clip0)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6V7H10.5C10.7761 7 11 7.22386 11 7.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V7.5C4 7.22386 4.22386 7 4.5 7H9V4.5C9 3.11929 10.1193 2 11.5 2C12.8807 2 14 3.11929 14 4.5V6H13V4.5C13 3.67157 12.3284 3 11.5 3C10.6716 3 10 3.67157 10 4.5V6Z"/>
            </g>
            <defs>
              <clipPath id="clip0">
              <path d="M0 0H16V16H0V0Z" fill="white"/>
            </clipPath>
            </defs>
          </svg>
        </span>
      </button>
      <button class="item-toggle action-copy">
        <span class="label">
          Copy to clipboard
        </span>
        <span class="icon">
          <svg viewBox="0 0 16 16">
            <path class="fill" d="M5 10.25V12.5C5 13.3284 5.67157 14 6.5 14H12.5C13.3284 14 14 13.3284 14 12.5V8C14 7.17157 13.3284 6.5 12.5 6.5H11.75V8.5625C11.75 9.49448 10.9945 10.25 10.0625 10.25H5Z"/>
            <path class="stroke" d="M2.5 3.5C2.5 2.94772 2.94772 2.5 3.5 2.5H9.5C10.0523 2.5 10.5 2.94772 10.5 3.5V8C10.5 8.55228 10.0523 9 9.5 9H3.5C2.94772 9 2.5 8.55228 2.5 8V3.5Z"/>
          </svg>
        </span>
      </button>
    </span>
  {/if}
</span>
