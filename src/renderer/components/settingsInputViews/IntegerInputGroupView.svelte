<div
  style:color={colors.text}
  style:font-size="16px"
  use:tooltip={isNotNullish(viewModel.description) ? descriptionTooltip : undefined}
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
  {#each values as _, index (index)}
    <TextField
      bind:this={textFields[index]}
      max={viewModel.max}
      min={viewModel.min}
      onBlur={textFieldBlurHandler}
      onFocus={() => { textFieldFocusHandler(index) }}
      type="number"
      width={40}
      bind:value={values[index]}
    />
  {/each}
</Stack>

{#snippet descriptionTooltip()}
  <div>
    {viewModel.description}
  </div>
{/snippet}

<script lang="ts">
  import { showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import { tooltip } from "@components/utility/Tooltip.svelte"
  import { colors } from "@scripts/colors"
  import type { IntegerInputGroupViewModel } from "@shared/types/viewModels"
  import { isNotNullish, isNullish } from "@shared/utils"
  
  type Props = {
    viewModel: IntegerInputGroupViewModel
  }
  
  const {
    viewModel = $bindable(),
  }: Props = $props()
  
  const textFields: TextField<number, "number">[] = $state([])
  
  let oldValues: number[] = []
  let values: number[] = $state([])
  let currentIndex: number | null = null

  const textFieldFocusHandler = (index: number) => {
    if (isNullish(currentIndex)) {
      oldValues = values.map((value) => { return value })
    }
    
    currentIndex = index
  }

  const textFieldBlurHandler = () => {
    requestAnimationFrame(() => {
      if (isNullish(textFields.find((textField) => { return textField.isFocused() }))) {
        let error: string | null = null
    
        values.forEach((value) => {
          if (Number.isNaN(value)) {
            error = `All ${viewModel.name} values are required.`
          } else if (!Number.isInteger(value)) {
            error = `All ${viewModel.name} values must be integers.`
          } else if (isNotNullish(viewModel.min) && value < viewModel.min) {
            error = `All ${viewModel.name} values must be greater than or equal to ${viewModel.min}.`
          } else if (isNotNullish(viewModel.max) && value > viewModel.max) {
            error = `All ${viewModel.name} values must be less than or equal to ${viewModel.max}.`
          }
        })
    
        if (isNullish(error) && isNotNullish(viewModel.sum) && values.reduce((result, value) => { return result + value }, 0) !== viewModel.sum) {
          error = `All ${viewModel.name} values must add up to ${viewModel.sum}.`
        }
    
        if (isNullish(error)) {
          viewModel.values = values.map((value) => { return value })
          error = null
        } else {
          values = oldValues
          showErrorDialog(error)
        }
        
        currentIndex = null
      }
    })
  }
  
  $effect(() => { viewModel.values; viewModelValuesListener() })
  const viewModelValuesListener = () => {
    values = viewModel.values.map((value) => { return value })
  }
</script>