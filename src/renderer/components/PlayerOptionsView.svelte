<Stack
  alignment="start"
  direction="vertical"
  distribution="start"
  minSpacing={20}
  padding={20}
  width="100%"
>
  {#each playerOptionsViewModel.viewModels as subViewModel, index (subViewModel.id)}
    <SettingsInputView bind:viewModel={playerOptionsViewModel.viewModels[index]}/>
  {/each}
</Stack>

<script lang="ts">
  import { showDialog, showErrorDialog } from "@components/dialogs/DialogContainer.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import { applyPlayerOptionsToViewModel } from "@shared/appData/applySettingsToViewModel"
  import { defaultPlayerOptionsViewModel } from "@shared/appData/defaultPlayerOptionsViewModel"
  import { type PlayerOptions, playerOptionsFromViewModel } from "@shared/appData/settingsFromViewModel"
  import { onMount } from "svelte"
  
  type Props = {
    initialPlayerOptions: unknown
    onPlayerOptionsUpdated?: (playerOptions: PlayerOptions) => void
    inputAccessor: { getInput?: () => PlayerOptions }
  }
  
  const {
    initialPlayerOptions,
    onPlayerOptionsUpdated,
    inputAccessor,
  }: Props = $props()
  
  let hasMounted = false
  let playerOptionsViewModel = $state(defaultPlayerOptionsViewModel())
  const playerOptions = $derived(playerOptionsFromViewModel(playerOptionsViewModel))
  
  $effect(() => { playerOptions; playerOptionsListener() })
  const playerOptionsListener = () => {
    if (hasMounted) {
      onPlayerOptionsUpdated?.(playerOptions)
    }
  }
  
  onMount(() => {
    inputAccessor.getInput = () => {
      return playerOptionsFromViewModel(playerOptionsViewModel)
    }
    
    try {
      const warnings: string[] = []
      const newViewModel = playerOptionsViewModel
      applyPlayerOptionsToViewModel(initialPlayerOptions, newViewModel, warnings)
      playerOptionsViewModel = newViewModel
      
      if (warnings.length > 0) {
        showDialog({
          title: "Warning",
          message: `Found invalid data while loading previous player options.\n\n${warnings.join("\n\n")}`,
          submitButtonLabel: "OK",
        })
      }
    } catch (error) {
      showErrorDialog(error)
    } finally {
      hasMounted = true
    }
  })
</script>