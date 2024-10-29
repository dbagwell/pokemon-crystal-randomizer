<Stack
  alignment="fill"
  direction="vertical"
  distribution="start"
>
  <AutocompleteTextField
    bind:this={autocompleteTextField}
    clearOnFocus={true}
    clearOnSelect={true}
    label={viewModel.name ?? ""}
    options={availableOptions.map((option) => {
      return {
        id: option.id,
        name: option.name,
        keywords: option.name,
        value: option.id,
      }
    })}
    restoreOnBlur={false}
    on:select={handleAutocompleteSelection}
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
        </Stack>
      {/each}
    </Stack>
  {/if}
</Stack>

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import AutocompleteTextField from "@components/inputs/AutocompleteTextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  import type { SelectorOption, SimpleMultiSelectorViewModel } from "@shared/types/viewModels"
  import { isNotNullish } from "@shared/utils"
  import { onMount } from "svelte"
  
  export let viewModel: SimpleMultiSelectorViewModel
  
  let availableOptions: SelectorOption[] = []
  let selectedOptions: SelectorOption[] = []
  
  let autocompleteTextField: AutocompleteTextField
  
  onMount(() => {
    viewModel = viewModel
  })
  
  const handleAutocompleteSelection = (event: CustomEvent) => {
    const option = viewModel.options.find((option) => {
      return option.id === event.detail
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
  
  $: viewModel.selectedOptionIds, valueListener()
  const valueListener = () => {
    selectedOptions = viewModel.selectedOptionIds.map((id) => {
      return viewModel.options.find((option) => {
        return option.id === id
      })!
    })
    
    availableOptions = viewModel.options.filter((option) => {
      return !viewModel.selectedOptionIds.includes(option.id)
    })
  }
</script>