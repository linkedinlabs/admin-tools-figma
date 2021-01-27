<script>
  export let hideText = true;
  export let invertView = false;
  export let isWarning = false;
  export let text = 'Label';

  const setClasses = (
    currentHideText,
    currentInvertView,
    currentIsWarning,
  ) => {
    const classesArray = ['icon-inline'];

    if (currentHideText) {
      classesArray.push('hide-text');
    }

    if (currentInvertView) {
      classesArray.push('inverted');
    }

    if (currentIsWarning) {
      classesArray.push('warning');
    }

    const classesString = classesArray.join(' ');
    return classesString;
  };
</script>

<style>
  /* components/icon-inline @icon-inline */
</style>

<span
  class={setClasses(hideText, invertView, isWarning)}
>
  <span
    aria-hidden="true"
    class="icon"
    focusable="false"
    role="img"
  >
    <slot><!-- icon svg code here --></slot>
  </span>
  <span class="text">
    {text}
  </span>
</span>
