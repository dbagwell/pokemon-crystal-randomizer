<TextField
  max={viewModel.max}
  min={viewModel.min}
  title={viewModel.name}
  type="number"
  bind:value={value}
  on:blur={textFieldBlurHandler}
  on:focus={textFieldFocusHandler}
/>  <!-- TODO: Description -->
<script lang="ts">
  import { showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import type { IntegerInputViewModel } from "@shared/types/viewModels"
  import { isNotNullish, isNullish } from "@shared/utils"
  import { onMount } from "svelte"
  
  export let viewModel: IntegerInputViewModel
  
  let oldValue: number | undefined = undefined
  let value: number | undefined = undefined
  let hasMounted = false
  let error: string | null = null
  
  onMount(() => {
    value = viewModel.value ?? Number.NaN
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
    
    if (Number.isNaN(value) || isNullish(value)) {
      if (viewModel.isRequired) {
        error = `${viewModel.name} is required.`
      } else {
        viewModel.value = undefined
      }
    } else if (!Number.isInteger(value)) {
      error = `${viewModel.name} must be an integer.`
    } else if (isNotNullish(viewModel.min) && value < viewModel.min) {
      error = `${viewModel.name} must be greater than or equal to ${viewModel.min}.`
    } else if (isNotNullish(viewModel.max) && value > viewModel.max) {
      error = `${viewModel.name} must be less than or equal to ${viewModel.max}.`
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