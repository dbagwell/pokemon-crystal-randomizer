<Stack
  alignment="fill"
  direction="vertical"
  distribution="start"
>
  <AutocompleteTextField
    bind:this={autocompleteTextField}
    clearOnFocus={true}
    clearOnSelect={false}
    label={viewModel.name ?? ""}
    options={viewModel.options.map((option) => {
      return {
        id: option.id,
        name: option.name,
        keywords: option.name,
        value: option.id,
      }
    })}
    restoreOnBlur={true}
    on:select={handleAutocompleteSelection}
  />
  <!-- TODO: Description -->
  {#each viewModel.options as option (option.id)}
    {#if option.id === viewModel.selectedOptionId && "viewModels" in option}
      <div
        style:border-left="2px solid {colors.separator}"
        style:border-radius="0 0 0 20px"
      >
        <Stack
          alignment="start"
          direction="vertical"
          distribution="start"
          minSpacing={10}
          padding={[10, 0, 0, 20]}
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

<script lang="ts">
  import AutocompleteTextField from "@components/inputs/AutocompleteTextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import { colors } from "@scripts/colors"
  import type { SingleSelectorViewModel } from "@shared/types/viewModels"
  import { isNullish } from "@shared/utils"
  import { onMount } from "svelte"
  
  export let viewModel: SingleSelectorViewModel
  
  let autocompleteTextField: AutocompleteTextField
  
  onMount(() => {
    viewModel = viewModel
  })
  
  const handleAutocompleteSelection = (event: CustomEvent) => {
    viewModel.selectedOptionId = event.detail
  }
  
  $: viewModel.selectedOptionId, valueListener()
  const valueListener = () => {
    if (isNullish(autocompleteTextField)) {
      return
    }
    
    const option = viewModel.options.find((option) => {
      return option.id === viewModel.selectedOptionId
    })
    
    autocompleteTextField.filter = option?.name ?? ""
    autocompleteTextField.previousSelection = option
  }
</script>