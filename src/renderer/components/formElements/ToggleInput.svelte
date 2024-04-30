<!-- TODO: Make this checkbox a component and style it up -->
<label style:cursor="pointer">
  <input
    style:cursor="pointer"
    type="checkbox"
    bind:checked={config.value}
  />
  {config.label}
</label>
<!-- TODO: Description -->

<script lang="ts">
  export let config: ToggleInputConfig
</script>