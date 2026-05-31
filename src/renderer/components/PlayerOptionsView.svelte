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
  
  handleButton = async (id: ButtonId) => {
    switch (id) {
    case "IMPORT_CUSTOM_NAMES": {
      const namesLists = (await window.mainAPI.importCustomNames()).result
      playerOptions.CHANGE_NAMES.SETTINGS.METHOD.SETTINGS.CUSTOM_LIST.CLASS_NAMES = namesLists.CLASS_NAMES
      playerOptions.CHANGE_NAMES.SETTINGS.METHOD.SETTINGS.CUSTOM_LIST.TWINS_CLASS_NAMES = namesLists.TWINS_CLASS_NAMES
      playerOptions.CHANGE_NAMES.SETTINGS.METHOD.SETTINGS.CUSTOM_LIST.TRAINER_NAMES = namesLists.TRAINER_NAMES
      playerOptions.CHANGE_NAMES.SETTINGS.METHOD.SETTINGS.CUSTOM_LIST.TWINS_TRAINER_NAMES = namesLists.TWINS_TRAINER_NAMES
      playerOptions.CHANGE_NAMES.SETTINGS.METHOD.SETTINGS.CUSTOM_LIST.POKEMON_NICKNAMES = namesLists.POKEMON_NICKNAMES
      applyPlayerOptionsToViewModel(playerOptions, playerOptionsViewModel, [])
      
      break
    }
    case "EXPORT_CUSTOM_NAMES": {
      window.mainAPI.exportCustomNames({
        CLASS_NAMES: playerOptions.CHANGE_NAMES.SETTINGS.METHOD.SETTINGS.CUSTOM_LIST.CLASS_NAMES,
        TWINS_CLASS_NAMES: playerOptions.CHANGE_NAMES.SETTINGS.METHOD.SETTINGS.CUSTOM_LIST.TWINS_CLASS_NAMES,
        TRAINER_NAMES: playerOptions.CHANGE_NAMES.SETTINGS.METHOD.SETTINGS.CUSTOM_LIST.TRAINER_NAMES,
        TWINS_TRAINER_NAMES: playerOptions.CHANGE_NAMES.SETTINGS.METHOD.SETTINGS.CUSTOM_LIST.TWINS_TRAINER_NAMES,
        POKEMON_NICKNAMES: playerOptions.CHANGE_NAMES.SETTINGS.METHOD.SETTINGS.CUSTOM_LIST.POKEMON_NICKNAMES,
      })
      break
    }
    }
  }
</script>

<script
  lang="ts"
  module
>
  import type { ButtonId } from "@shared/appData/buttonIds"
  
  export let handleButton: (id: ButtonId) => void

</script>