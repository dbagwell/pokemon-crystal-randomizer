<Stack
  alignment="fill"
  direction="vertical"
  distribution="start"
>
  <AutocompleteTextField
    clearOnFocus={true}
    clearOnSelect={true}
    onSelect={handleAutocompleteSelection}
    options={availableOptions.map((option) => {
      return {
        id: option.id,
        name: option.name,
        keywords: option.name,
        value: option.id,
      }
    })}
    restoreOnBlur={false}
    title={viewModel.name ?? ""}
  />
  <!-- TODO: Description -->
  {#if viewModel.selectedOptionIds.length > 0}
    <Stack
      alignment="fill"
      direction="vertical"
      distribution="start"
      minSpacing={5}
      padding={5}
    >
      {#each selectedOptions as selectedOption, index (selectedOption.id)}
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
          >
            {selectedOption.name}
          </div>
          <Stack
            alignment="start"
            direction="vertical"
            distribution="start"
            minSpacing={10}
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
</Stack>

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import AutocompleteTextField from "@components/inputs/AutocompleteTextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
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