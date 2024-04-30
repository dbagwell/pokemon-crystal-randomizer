<Textfield
  input$max={config.max}
  input$min={config.min}
  label={config.label}
  type="number"
  bind:value={value}
  on:blur={textFieldBlurHandler}
/>  <!-- TODO: Description -->
<script lang="ts">
  import { isNullish } from "@shared/utils"
  import Textfield from "@smui/textfield"
  import { onMount } from "svelte"
  
  export let config: IntegerInputConfig
  
  let value: string = ""
  let hasMounted = false
  
  onMount(() => {
    value = `${config.value}`
    hasMounted = true
  })
  
  const textFieldBlurHandler = () => {
    if (isNullish(config.value)) {
      if (value !== "") {
      // TODO: Show error "Invalid value."
      } else if (config.required) {
      // TODO: Show error "Label is required."
      }
    }
  }
  
  $: value, valueListener()
  const valueListener = () => {
    if (!hasMounted) {
      return
    }
    
    if (!config.required && value === "") {
      config.value = undefined
    }
    
    const numberValue = parseInt(value)
    
    if (
      Number.isInteger(numberValue)
        && (isNullish(config.min) || numberValue >= config.min)
        && (isNullish(config.max) || numberValue <= config.max)
    ) {
      config.value = numberValue
    }
  }
  
  $: config.value, configValueListener()
  const configValueListener = () => {
    value = `${config.value ?? ""}`
  }
</script>