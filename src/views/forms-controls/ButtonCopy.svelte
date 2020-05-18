<script>
  export let valueToCopy = null;

  const handleCopy = (value) => {
    if (value) {
      // navigator.clipboard is not currently available to Figma plugins
      // https://figmaplugins.slack.com/archives/CHPTY6TFD/p1584724622281200
      // ---
      // create a temporary <textarea> to hold the text for copying
      const tempTextareaElement = document.createElement('textarea');
      tempTextareaElement.classList.add('hide-visually'); // hide the text area

      // set the textarea contents to the value we want copied
      tempTextareaElement.innerText = value;

      // add the text area to the DOM and select the contents
      document.body.appendChild(tempTextareaElement);
      tempTextareaElement.select();

      // copy to the clipboard
      document.execCommand('copy');

      // remove the temp element
      tempTextareaElement.remove();
    }
  };
</script>

<style>
  /* components/icon-button > @button-icon */
</style>

<button
  class="item-toggle action-copy"
  on:click={() => handleCopy(valueToCopy)}
>
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
