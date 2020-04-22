<script>
  export let name = 'bob';
  export let override = false;
</script>

<style>
  h1 {
    color: red;
  }
</style>

<h1>
  <span class:override="{override}">
    hello {name}
  </span>
</h1>
