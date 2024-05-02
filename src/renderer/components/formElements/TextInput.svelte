<Textfield
  label={config.label}
  bind:value={value}
  on:blur={textFieldBlurHandler}
  on:focus={textFieldFocusHandler}
/>
<!-- TODO: Description -->
<script lang="ts">
  import { showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import { isNotNullish } from "@shared/utils"
  import Textfield from "@smui/textfield"
  import { onMount } from "svelte"
  
  export let config: TextInputConfig
  
  let oldValue: string = ""
  let value: string = ""
  let hasMounted = false
  let error: string | null = null
  
  onMount(() => {
    value = config.value ?? ""
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
    
    if (config.required && value === "") {
      error = `${config.label} is required.`
    } else if (value === "") {
      config.value = undefined
    } else if (isNotNullish(config.maxCharacters) && value.length > config.maxCharacters) {
      error = `${config.label} must be less than or equal to ${config.maxCharacters} characters long.`
    } else {
      config.value = value
    }
  }
  
  $: config.value, configValueListener()
  const configValueListener = () => {
    value = config.value ?? ""
  }
</script>