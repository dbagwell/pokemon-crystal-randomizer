<Stack
  alignment="start"
  direction="vertical"
  distribution="start"
  minSpacing={20}
  padding={20}
  width="100%"
>
  {#each apOptionsViewModel.viewModels as subViewModel, index (subViewModel.id)}
    <SettingsInputView bind:viewModel={apOptionsViewModel.viewModels[index]}/>
  {/each}
</Stack>

<script lang="ts">
  import { showDialog, showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import { type APOptions, defaultAPOptionsViewModel } from "@shared/appData/apOptions"
  import { applyOptionsToViewModel } from "@shared/appData/applySettingsToViewModel"
  import { settingsFromArrayOfToggleViewModels } from "@shared/appData/settingsFromViewModel"
  import { onMount } from "svelte"
  
  type Props = {
    initialAPOptions: APOptions | undefined
    inputAccessor: { getInput?: () => APOptions }
  }
  
  const {
    initialAPOptions,
    inputAccessor,
  }: Props = $props()
  
  // svelte-ignore state_referenced_locally
  let apOptionsViewModel = $state(defaultAPOptionsViewModel())
  const apOptions = $derived(settingsFromArrayOfToggleViewModels(apOptionsViewModel.viewModels))
  
  onMount(() => {
    inputAccessor.getInput = () => {
      return apOptions
    }
    
    try {
      const warnings: string[] = []
      const newViewModel = apOptionsViewModel
      applyOptionsToViewModel(initialAPOptions, newViewModel, warnings)
      apOptionsViewModel = newViewModel
      
      if (warnings.length > 0) {
        showDialog({
          title: "Warning",
          message: `Found invalid data while loading previous player options.\n\n${warnings.join("\n\n")}`,
          submitButtonLabel: "OK",
        })
      }
    } catch (error) {
      showErrorDialog(error)
    }
  })
</script>