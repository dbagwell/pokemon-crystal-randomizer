<Stack
  alignment="start"
  direction="vertical"
  distribution="end"
  minSpacing={3}
  padding={0}
  width="100%"
>
  {#if isNotNullish(viewModel.name)}
    <div>
      {viewModel.name}
    </div>
  {/if}
  <textarea
    style:border="1px solid {colors.inactiveTint}"
    style:border-radius="10px 10px 0px 10px"
    style:background-color="transparent"
    style:box-sizing="border-box"
    style:color={colors.text}
    style:font-family="monospace"
    style:font-size="15px"
    style:outline="none"
    style:padding="5px"
    style:margin="0"
    style:width="100%"
    onblur={textFieldBlurHandler}
    bind:value={value}
  ></textarea>
</Stack>

<script lang="ts">
  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  import type { MultilineTextInputViewModel } from "@shared/types/viewModels"
  import { isNotNullish, isNullish } from "@shared/utils"
  
  type Props = {
    viewModel: MultilineTextInputViewModel
  }
  
  const {
    viewModel = $bindable(),
  }: Props = $props()
  
  let value: string | undefined = $state(viewModel.value)
  
  const textFieldBlurHandler = () => {
    if (isNullish(value) || value === "") {
      viewModel.value = undefined
    } else {
      viewModel.value = value
    }
  }
  
  $effect(() => { viewModel.value; viewModelValueListener() })
  const viewModelValueListener = () => {
    value = viewModel.value
  }
</script>