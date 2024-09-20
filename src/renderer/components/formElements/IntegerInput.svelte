<Textfield
  input$max={config.max}
  input$min={config.min}
  label={config.label}
  type="number"
  bind:value={value}
  on:blur={textFieldBlurHandler}
  on:focus={textFieldFocusHandler}
/>  <!-- TODO: Description -->
<script lang="ts">
  import { showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import { isNotNullish } from "@shared/utils"
  import Textfield from "@smui/textfield"
  import { onMount } from "svelte"
  
  export let config: IntegerInputConfig
  
  let oldValue: number = Number.NaN
  let value: number = Number.NaN
  let hasMounted = false
  let error: string | null = null
  
  onMount(() => {
    value = config.value ?? Number.NaN
    hasMounted = true
  })
  
  const textFieldFocusHandler = () => {
    oldValue = value
    error = null
  }
  
  const textFieldBlurHandler = () => {
    if (isNotNullish(error)) {
      value = oldValue
      showErrorDialog(error)
    }
  }
  
  $: value, valueListener()
  const valueListener = () => {
    if (!hasMounted) {
      return
    }
    
    if (config.required && Number.isNaN(value)) {
      error = `${config.label} is required.`
    } else if (Number.isNaN(value)) {
      config.value = undefined
    } else if (!Number.isInteger(value)) {
      error = `${config.label} must be an integer.`
    } else if (isNotNullish(config.min) && value < config.min) {
      error = `${config.label} must be greater than or equal to ${config.min}.`
    } else if (isNotNullish(config.max) && value > config.max) {
      error = `${config.label} must be less than or equal to ${config.max}.`
    } else {
      error = null
      config.value = value
    }
  }
  
  $: config.value, configValueListener()
  const configValueListener = () => {
    value = config.value ?? Number.NaN
  }
</script>