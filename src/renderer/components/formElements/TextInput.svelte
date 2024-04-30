<Textfield
  label={config.label}
  bind:value={value}
/>
<!-- TODO: Description -->
<script lang="ts">
  import Textfield from "@smui/textfield"
  import { onMount } from "svelte"
  
  export let config: TextInputConfig
  
  let value: string = ""
  let hasMounted = false
  
  onMount(() => {
    value = config.value ?? ""
    hasMounted = true
  })
  
  $: value, valueListener()
  const valueListener = () => {
    if (!hasMounted) {
      return
    }
    
    config.value = value === "" ? undefined : value
  }
  
  $: config.value, configValueListener()
  const configValueListener = () => {
    value = config.value ?? ""
  }
</script>