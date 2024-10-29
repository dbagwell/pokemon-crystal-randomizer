<TextField
  title={viewModel.name}
  type="text"
  bind:value={value}
  on:blur={textFieldBlurHandler}
  on:focus={textFieldFocusHandler}
/>  <!-- TODO: Description -->
<script lang="ts">
  import { showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import type { TextInputViewModel } from "@shared/types/viewModels"
  import { isNotNullish, isNullish } from "@shared/utils"
  import { onMount } from "svelte"
  
  export let viewModel: TextInputViewModel
  
  let oldValue: string | undefined = undefined
  let value: string | undefined = undefined
  let hasMounted = false
  let error: string | null = null
  
  onMount(() => {
    value = viewModel.value
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
    
    if (isNullish(value) || value === "") {
      if (viewModel.isRequired) {
        error = `${viewModel.name} is required.`
      } else {
        viewModel.value = undefined
      }
    } else if (isNotNullish(viewModel.maxCharacters) && value.length > viewModel.maxCharacters) {
      error = `${viewModel.name} must be less than or equal to ${viewModel.maxCharacters} characters long.`
    } else {
      error = null
      viewModel.value = value
    }
  }
  
  $: viewModel.value, configValueListener()
  const configValueListener = () => {
    value = viewModel.value
  }
</script>