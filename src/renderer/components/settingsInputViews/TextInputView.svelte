<div use:tooltip={isNotNullish(viewModel.description) ? descriptionTooltip : undefined}>
  <TextField
    onBlur={textFieldBlurHandler}
    onFocus={textFieldFocusHandler}
    title={viewModel.name}
    type="text"
    bind:value={value}
  />
</div>

{#snippet descriptionTooltip()}
  <TextTooltip text={viewModel.description!}/>
{/snippet}

<script lang="ts">
  import { showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import TextTooltip from "@components/utility/TextTooltip.svelte"
  import { tooltip } from "@components/utility/Tooltip.svelte"
  import type { TextInputViewModel } from "@shared/types/viewModels"
  import { isNotNullish, isNullish } from "@shared/utils"
  import { inGameStringLength } from "@shared/utils/textConverters"
  
  type Props = {
    viewModel: TextInputViewModel
  }
  
  const {
    viewModel = $bindable(),
  }: Props = $props()
  
  let oldValue: string | undefined = undefined
  let value: string | undefined = $state(viewModel.value)
  let error: string | null = null
  
  const textFieldFocusHandler = () => {
    oldValue = value
    error = null
  }
  
  const textFieldBlurHandler = () => {
    if (isNullish(value) || value === "") {
      if (viewModel.isRequired) {
        error = `${viewModel.name} is required.`
      } else {
        viewModel.value = undefined
      }
    } else if (isNotNullish(viewModel.maxCharacters) && value.length > viewModel.maxCharacters) {
      error = `${viewModel.name} must be less than or equal to ${viewModel.maxCharacters} characters long.`
    } else if (isNotNullish(viewModel.maxInGameCharacters) && inGameStringLength(value) > viewModel.maxInGameCharacters) {
      error = `${viewModel.name} must be less than or equal to ${viewModel.maxInGameCharacters} "in game characters" long.`
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