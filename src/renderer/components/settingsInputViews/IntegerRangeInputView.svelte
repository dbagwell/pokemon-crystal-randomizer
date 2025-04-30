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
      title={index === 0 ? "Minimum" : "Maximum"}
      type="number"
      bind:value={values[index]}
    />
  {/each}
</Stack>

{#snippet descriptionTooltip()}
  <TextTooltip text={viewModel.description!}/>
{/snippet}

<script lang="ts">
  import { showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import TextTooltip from "@components/utility/TextTooltip.svelte"
  import { tooltip } from "@components/utility/Tooltip.svelte"
  import { colors } from "@scripts/colors"
  import type { IntegerRangeInputViewModel } from "@shared/types/viewModels"
  import { isNotNullish, isNullish } from "@shared/utils"
  
  type Props = {
    viewModel: IntegerRangeInputViewModel
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
      if (isNullish(textFields.find((textField) => { return textField.getIsFocused() }))) {
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
        
        if (isNullish(error) && values[1] < values[0]) {
          error = "Maximum must be greater than or equal to Minimum."
        }
    
        if (isNullish(error)) {
          viewModel.selectedMinValue = values[0]
          viewModel.selectedMaxValue = values[1]
          error = null
        } else {
          values = oldValues
          showErrorDialog(error)
        }
        
        currentIndex = null
      }
    })
  }
  
  $effect(() => { viewModel.selectedMinValue; viewModel.selectedMaxValue; viewModelValuesListener() })
  const viewModelValuesListener = () => {
    values = [viewModel.selectedMinValue, viewModel.selectedMaxValue]
  }
</script>