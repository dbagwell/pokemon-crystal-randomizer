<Stack
  alignment="fill"
  direction="vertical"
  distribution="start"
>
  <Stack
    alignment="center"
    direction="horizontal"
    distribution="start"
    minSpacing={10}
  >
    <div
      style:background-color={viewModel.selectedOptionIds.length > 0 ? colors.activeTint : colors.separator}
      style:border-radius="5px"
      style:width="20px"
      style:height="20px"
    >
    </div>
    <div
      style:color={colors.text}
      use:tooltip={isNotNullish(viewModel.description) ? descriptionTooltip : undefined}
    >
      {viewModel.name}
    </div>
  </Stack>
  <div
    style:border-left="2px solid {viewModel.selectedOptionIds.length > 0 ? colors.activeTint : colors.separator}"
    style:border-radius="0 0 0 20px"
    style:margin-left="9px"
  >
    {#if viewModel.selectedOptionIds.length > 0 || availableOptions.length > 0}
      <Stack
        alignment="fill"
        direction="vertical"
        distribution="start"
        minSpacing={5}
        padding={[5, 0, 10, 20]}
      >
        {#if viewModel.selectedOptionIds.length > 0}
          <Stack
            alignment="fill"
            direction="vertical"
            distribution="start"
            minSpacing={5}
          >
            {#each selectedOptions as selectedOption, index (selectedOption.id)}
              {#snippet optionDescriptionTooltip()}
                <TextTooltip text={selectedOption.description!}/>
              {/snippet}
      
              <Stack
                alignment="center"
                direction="horizontal"
                distribution="fill"
                minSpacing={5}
              >
                <Button
                  style="icon"
                  isDestructive={true}
                  onClick={() => { removeSelectedValue(index) }}
                  title="cancel"
                />
                <div
                  style:text-wrap="nowrap"
                  style:flex-grow="1"
                  style:color={colors.text}
                  style:font-size="16px"
                  use:tooltip={isNotNullish(selectedOption.description) ? optionDescriptionTooltip : undefined}
                >
                  {selectedOption.name}
                </div>
                <Stack
                  alignment="start"
                  direction="vertical"
                  distribution="start"
                  minSpacing={15}
                  padding={[10, 0, 0, 20]}
                  wrap={true}
                >
                  {#each selectedOption.viewModels as subViewModel, index (subViewModel.id)}
                    <SettingsInputView viewModel={selectedOption.viewModels[index]}/>
                  {/each}
                </Stack>
              </Stack>
            {/each}
          </Stack>
        {/if}
        {#if availableOptions.length > 0}
          <AutocompleteTextField
            clearOnFocus={true}
            clearOnSelect={true}
            onSelect={handleAutocompleteSelection}
            options={availableOptions.map((option) => {
              return {
                id: option.id,
                name: option.name,
                description: option.description,
                keywords: option.name,
                value: option.id,
              }
            })}
            restoreOnBlur={false}
            title="Choose"
          />
        {/if}
      </Stack>
    {/if}
  </div>
</Stack>

{#snippet descriptionTooltip()}
  <TextTooltip text={viewModel.description!}/>
{/snippet}

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import AutocompleteTextField from "@components/inputs/AutocompleteTextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import TextTooltip from "@components/utility/TextTooltip.svelte"
  import { tooltip } from "@components/utility/Tooltip.svelte"
  import { colors } from "@scripts/colors"
  import type { ConfigurableMultiSelectorViewModel, ConfigurableSelectorOption } from "@shared/types/viewModels"
  import { isNotNullish } from "@shared/utils"
  
  type Props = {
    viewModel: ConfigurableMultiSelectorViewModel
  }
  
  let {
    viewModel = $bindable(),
  }: Props = $props()
  
  const availableOptions: ConfigurableSelectorOption[] = $derived.by(() => {
    return viewModel.options.filter((option) => {
      return !viewModel.selectedOptionIds.includes(option.id)
    })
  })
  
  const selectedOptions: ConfigurableSelectorOption[] = $derived.by(() => {
    return viewModel.selectedOptionIds.map((id) => {
      return viewModel.options.find((option) => {
        return option.id === id
      })!
    })
  })
  
  const handleAutocompleteSelection = (optionId: string | undefined) => {
    const option = viewModel.options.find((option) => {
      return option.id === optionId
    })
    
    if (isNotNullish(option)) {
      viewModel.selectedOptionIds.push(option.id)
      viewModel.selectedOptionIds = viewModel.selectedOptionIds
    }
  }
  
  const removeSelectedValue = (index: number) => {
    viewModel.selectedOptionIds.splice(index, 1)
    viewModel.selectedOptionIds = viewModel.selectedOptionIds
  }
  
</script>