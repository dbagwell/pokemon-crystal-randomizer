<div
  style:color={colors.text}
  style:font-size="16px"
>
  {viewModel.name}
</div>
<Stack
  alignment="start"
  direction="horizontal"
  distribution="start"
  minSpacing={10}
  padding={[0, 0, 0, 0]}
  wrap={true}
>
  {#each values as value, index (index)}
    <TextField
      bind:this={textFields[index]}
      max={viewModel.max}
      min={viewModel.min}
      type="number"
      width={40}
      bind:value={value}
      on:blur={textFieldBlurHandler}
      on:focus={() => { textFieldFocusHandler(index) }}
    />
  {/each}
</Stack>
<!-- TODO: Description -->
<script lang="ts">
  import { showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  import type { IntegerInputGroupViewModel } from "@shared/types/viewModels"
  import { isNotNullish, isNullish } from "@shared/utils"
  import { onMount } from "svelte"
  
  export let viewModel: IntegerInputGroupViewModel
  
  const textFields: TextField<number, "number">[] = []
  
  let oldValues: number[] = []
  let values: number[] = []
  let currentIndex: number | null = null
  let hasMounted = false
  let error: string | null = null
  
  onMount(() => {
    hasMounted = true
  })

  const textFieldFocusHandler = (index: number) => {
    if (isNullish(currentIndex)) {
      oldValues = values.map((value) => { return value })
    }
    
    currentIndex = index
  }

  const textFieldBlurHandler = () => {
    requestAnimationFrame(() => {
      if (isNullish(textFields.find((textField) => { return textField.isFocused() }))) {
        if (isNotNullish(error)) {
          values = oldValues
          showErrorDialog(error)
        }
        
        currentIndex = null
      }
    })
  }

  $: values, valuesListener()
  const valuesListener = () => {
    if (!hasMounted) {
      return
    }
    
    let foundNewError = false
    
    values.forEach((value) => {
      if (Number.isNaN(value)) {
        error = `All ${viewModel.name} values are required.`
        foundNewError = true
      } else if (!Number.isInteger(value)) {
        error = `All ${viewModel.name} values must be integers.`
        foundNewError = true
      } else if (isNotNullish(viewModel.min) && value < viewModel.min) {
        error = `All ${viewModel.name} values must be greater than or equal to ${viewModel.min}.`
        foundNewError = true
      } else if (isNotNullish(viewModel.max) && value > viewModel.max) {
        error = `All ${viewModel.name} values must be less than or equal to ${viewModel.max}.`
        foundNewError = true
      }
    })
    
    if (!foundNewError && isNotNullish(viewModel.sum) && values.reduce((result, value) => { return result + value }, 0) !== viewModel.sum) {
      error = `All ${viewModel.name} values must add up to ${viewModel.sum}.`
      foundNewError = true
    }
    
    if (!foundNewError) {
      viewModel.values = values.map((value) => { return value })
      error = null
    }
  }

  $: viewModel.values, viewModelValuesListener()
  const viewModelValuesListener = () => {
    values = viewModel.values.map((value) => { return value })
  }
</script>