<script>
  export let isStyles = false;
</script>

<aside class="blank-state" id="blank">
  <span class="mark">
    <svg viewBox="0 0 70 65">
      <rect x="31.4908" y="38.906" width="10.9533" height="2.82609" fill="white"/>
      <rect x="47.9208" y="48.0435" width="17.7991" height="5.65217" fill="black"/>
      <rect x="45.1824" y="8.47826" width="17.7991" height="5.65217" fill="black"/>
      <rect x="12.3225" width="17.7991" height="5.65217" fill="black"/>
      <rect y="53.6956" width="65.7199" height="11.3043" fill="#FF3399"/>
      <rect x="4.10754" y="31.0869" width="61.6124" height="16.9565" fill="#3399FF"/>
      <path d="M4.10749 12.7174C4.89034 9.70212 8.0317 7.6703 10.9533 8.47823L65.7199 24.0217C68.6415 24.8297 70.6102 28.0717 69.8274 31.087L65.7199 48.0434L0 31.0869L4.10749 12.7174Z" fill="#FF3399"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M49.2899 45.2174C55.3392 45.2174 60.2432 40.1563 60.2432 33.9131C60.2432 27.6698 55.3392 22.6087 49.2899 22.6087C43.2405 22.6087 38.3365 27.6698 38.3365 33.9131C38.3365 40.1563 43.2405 45.2174 49.2899 45.2174Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5374 38.1522C26.5868 38.1522 31.4907 33.091 31.4907 26.8478C31.4907 20.6046 26.5868 15.5435 20.5374 15.5435C14.4881 15.5435 9.58411 20.6046 9.58411 26.8478C9.58411 33.091 14.4881 38.1522 20.5374 38.1522Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M49.2899 38.1522C51.5584 38.1522 53.3974 36.2543 53.3974 33.913C53.3974 31.5718 51.5584 29.6739 49.2899 29.6739C47.0214 29.6739 45.1824 31.5718 45.1824 33.913C45.1824 36.2543 47.0214 38.1522 49.2899 38.1522Z" fill="black"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5374 31.087C22.8059 31.087 24.6449 29.189 24.6449 26.8478C24.6449 24.5066 22.8059 22.6087 20.5374 22.6087C18.2689 22.6087 16.4299 24.5066 16.4299 26.8478C16.4299 29.189 18.2689 31.087 20.5374 31.087Z" fill="black"/>
    </svg>

  </span>
  <span class="text">
    {#if isStyles}
      To get started, select <br />a layer that uses styles local to your file…
    {:else}
      To get started, select <br />a component that is local to your file…
    {/if}
  </span>
</aside>
