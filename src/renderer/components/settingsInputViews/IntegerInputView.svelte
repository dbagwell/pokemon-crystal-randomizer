<TextField
  max={viewModel.max}
  min={viewModel.min}
  onBlur={textFieldBlurHandler}
  onFocus={textFieldFocusHandler}
  title={viewModel.name}
  type="number"
  bind:value={value}
/>  <!-- TODO: Description -->
<script lang="ts">
  import { showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import type { IntegerInputViewModel } from "@shared/types/viewModels"
  import { isNotNullish, isNullish } from "@shared/utils"
  
  type Props = {
    viewModel: IntegerInputViewModel
  }
  
  const {
    viewModel = $bindable(),
  }: Props = $props()
  
  let oldValue: number | undefined = undefined
  let value: number | undefined = $state(viewModel.value)
  let error: string | null = null
  
  const textFieldFocusHandler = () => {
    oldValue = value
    error = null
  }
  
  const textFieldBlurHandler = () => {
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
      
    if (isNotNullish(error)) {
      value = oldValue
      showErrorDialog(error)
    }
  }
  
  $effect(() => { viewModel.value; viewModelValueListener() })
  const viewModelValueListener = () => {
    value = viewModel.value
  }
</script>