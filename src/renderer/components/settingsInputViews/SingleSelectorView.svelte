<Stack
  alignment="fill"
  direction="vertical"
  distribution="start"
>
  <div use:tooltip={isNotNullish(viewModel.description) ? descriptionTooltip : undefined}>
    <AutocompleteTextField
      clearOnFocus={true}
      clearOnSelect={false}
      filter={filter}
      onSelect={handleAutocompleteSelection}
      options={viewModel.options.map((option) => {
        return {
          id: option.id,
          name: option.name,
          description: option.description,
          keywords: option.name,
          value: option.id,
        }
      })}
      previousSelection={previousSelection}
      restoreOnBlur={true}
      title={viewModel.name}
    />
  </div>
  {#each viewModel.options as option (option.id)}
    {#if option.id === viewModel.selectedOptionId && "viewModels" in option}
      <div
        style:border-left="2px solid {colors.activeTint}"
        style:border-radius="0 0 0 20px"
      >
        <Stack
          alignment="start"
          direction="vertical"
          distribution="start"
          minSpacing={15}
          padding={[10, 0, 10, 20]}
          wrap={true}
        >
          {#each option.viewModels as subViewModel (subViewModel.id)}
            <SettingsInputView viewModel={subViewModel}/>
          {/each}
        </Stack>
      </div>
    {/if}
  {/each}
</Stack>

{#snippet descriptionTooltip()}
  <TextTooltip text={viewModel.description!}/>
{/snippet}

<script lang="ts">
  import AutocompleteTextField, { type Option } from "@components/inputs/AutocompleteTextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import TextTooltip from "@components/utility/TextTooltip.svelte"
  import { tooltip } from "@components/utility/Tooltip.svelte"
  import { colors } from "@scripts/colors"
  import type { SingleSelectorViewModel } from "@shared/types/viewModels"
  import { isNotNullish } from "@shared/utils"
  
  type Props = {
    viewModel: SingleSelectorViewModel
  }
  
  const {
    viewModel = $bindable(),
  }: Props = $props()
  
  const filter: string = $derived.by(() => {
    return viewModel.options.find((option) => {
      return option.id === viewModel.selectedOptionId
    })?.name ?? ""
  })
  
  const previousSelection: Option | undefined = $derived.by(() => {
    return viewModel.options.find((option) => {
      return option.id === viewModel.selectedOptionId
    }) as Option
  })
  
  const handleAutocompleteSelection = (optionId: string | undefined) => {
    if (isNotNullish(optionId)) {
      viewModel.selectedOptionId = optionId
    } else {
      throw new Error("SingleSelectorView received undefined Option Id.")
    }
  }
</script>