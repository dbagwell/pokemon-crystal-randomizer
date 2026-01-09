<div
  style:position="absolute"
  style:background-color={colors.tertiarySurface}
  style:width="100%"
  style:height="100%"
>
  <Stack
    alignment="fill"
    direction="vertical"
    distribution="fill"
    height="100%"
    width="100%"
  >
    <div>
      <div style:overflow-x="auto">
        <Stack
          alignment="fill"
          direction="horizontal"
          distribution="fill"
          minSpacing={3}
          minWidth="570px"
          padding={[5, 5, 0, 5]}
        >
          {#each settingsViewModel.tabViewModels as tabViewModel (tabViewModel.id)}
            <button
              style:display="flex"
              style:width="{100 / settingsViewModel.tabViewModels.length}%"
              style:height="auto"
              style:border-radius="15px 15px 0 0"
              style:align-items="center"
              style:background-color={settingsViewModel.selectedTabId === tabViewModel.id ? colors.primarySurface : colors.secondarySurface}
              style:border="0px none transparent"
              style:cursor={settingsViewModel.selectedTabId === tabViewModel.id ? "inherit" : "pointer"}
              style:z-index={settingsViewModel.selectedTabId === tabViewModel.id ? "1" : "auto"}
              onclick={() => {
                settingsViewModel.selectedTabId = tabViewModel.id
                mainContentContainer.scrollTo(0, 0)
              }}
            >
              <Stack
                alignment="center"
                direction="vertical"
                distribution="end"
                height="100%"
                minSpacing={10}
                padding={[10, 5, 5, 5]}
                width="100%"
              >
                <div
                  style:text-align="center"
                  style:font-size="16px"
                  style:color={settingsViewModel.selectedTabId === tabViewModel.id ? colors.primaryTint : colors.subtleText}
                >
                  {tabViewModel.name}
                </div>
                <div
                  style:background-color={settingsViewModel.selectedTabId === tabViewModel.id ? colors.primaryTint : "inherit"}
                  style:height="3px"
                  style:width="90%"
                >
                </div>
              </Stack>
            </button>
          {/each}
        </Stack>
      </div>
    </div>
    <div
      bind:this={mainContentContainer}
      style:flex-grow="1"
      style:flex-shrink="1"
      style:background-color={colors.primarySurface}
      style:box-shadow="0 -2px 5px #00000070"
      style:height="auto"
      style:overflow="auto"
    >
      {#each settingsViewModel.tabViewModels as tabViewModel (tabViewModel.id)}
        {#if settingsViewModel.selectedTabId === tabViewModel.id}
          <Stack
            alignment="start"
            direction="vertical"
            distribution="start"
            minSpacing={20}
            padding={20}
            width="100%"
          >
            {#each tabViewModel.viewModels as subViewModel, index (subViewModel.id)}
              <SettingsInputView bind:viewModel={tabViewModel.viewModels[index]}/>
            {/each}
          </Stack>
        {/if}
      {/each}
    </div>
    <div
      style:background-color={colors.primarySurface}
      style:box-shadow="0 -2px 5px #00000070"
    >
      <div style:overflow-x="auto">
        <Stack
          alignment="fill"
          direction="horizontal"
          distribution="fill"
          minSpacing={20}
          padding={[5, 20, 20, 20]}
        >
          <Stack
            alignment="start"
            direction="vertical"
            distribution="end"
            minSpacing={10}
          >
            <AutocompleteTextField
              clearOnFocus={true}
              clearOnSelect={false}
              filter={currentPresetName}
              onRemove={showRemovePresetConfirmation}
              onSelect={(presetId) => { presetSelected(presetId ?? "VANILLA") }}
              options={presetOptions}
              previousSelection={optionFrom(currentPreset)}
              restoreOnBlur={true}
              title="Choose Preset"
            />
          </Stack>
          <Stack
            alignment="start"
            direction="vertical"
            distribution="end"
            minSpacing={10}
          >
            <Button
              style="text"
              onClick={importSettingsButtonClicked}
              title="Import Settings"
            />
            <Button
              style="text"
              onClick={exportSettingsButtonClicked}
              title="Export Settings"
            />
            <Button
              style="text"
              isDisabled={currentPreset.id !== "CUSTOM"}
              onClick={createNewPresetButtonClicked}
              title="Create New Preset"
            />
          </Stack>
          <div style:flex-grow="2"></div>
          <Stack
            alignment="start"
            direction="vertical"
            distribution="end"
            minSpacing={10}
          >
            <TextField
              title="Custom Seed"
              type="text"
              bind:value={seed}
            />
            <ToggleView bind:viewModel={generateLogToggleViewModel}/>
            <ToggleView bind:viewModel={generatePatchFileToggleViewModel}/>
          </Stack>
          <Stack
            alignment="center"
            direction="vertical"
            distribution="end"
            minSpacing={20}
          >
            <Button
              style="text"
              onClick={playerOptionsButtonClicked}
              title="Player Options"
            />
            <Button
              style="fill"
              onClick={generateROMButtonClicked}
              title="GENERATE"
            />
          </Stack>
        </Stack>
      </div>
    </div>
  </Stack>
</div>

<ProgressIndicator/>

<DialogContainer/>

<Tooltip/>

{#snippet playerOptionsView(inputAccessor: { getInput?: () => PlayerOptions })}
  <PlayerOptionsView
    initialPlayerOptions={playerOptions}
    inputAccessor={inputAccessor}
    onPlayerOptionsUpdated={onPlayerOptionsUpdated}
  />
{/snippet}

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import DialogContainer, { showDialog, showErrorDialog, showSuccessDialog } from "@components/dialogs/DialogContainer.svelte"
  import AutocompleteTextField, { optionFrom } from "@components/inputs/AutocompleteTextField.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import PlayerOptionsView from "@components/PlayerOptionsView.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import ToggleView from "@components/settingsInputViews/ToggleView.svelte"
  import ProgressIndicator, { hideProgressIndicator, showProgressIndicator } from "@components/utility/ProgressIndicator.svelte"
  import Tooltip from "@components/utility/Tooltip.svelte"
  import { colors } from "@scripts/colors"
  import { applyPlayerOptionsToViewModel, applySettingsToViewModel } from "@shared/appData/applySettingsToViewModel"
  import { defaultPlayerOptionsViewModel } from "@shared/appData/defaultPlayerOptionsViewModel"
  import { defaultSettingsViewModel } from "@shared/appData/defaultSettingsViewModel"
  import { presetsMap } from "@shared/appData/presets"
  import { type PlayerOptions, playerOptionsFromViewModel, type Settings, settingsFromViewModel } from "@shared/appData/settingsFromViewModel"
  import { createSimpleToggleViewModel } from "@shared/types/viewModels"
  import { isNullish } from "@shared/utils"
  import { onMount } from "svelte"
  import yaml from "yaml"
  
  type Props = {
    appVersion: string
    lastSelectedPresetId: string
    lastSelectedSettings: unknown | undefined
    initialPlayerOptions: unknown | undefined
    customPresetNames: string[]
    logPreference: boolean
    createPatchPreference: boolean
  }
  
  /* eslint-disable prefer-const */
  let {
    appVersion,
    lastSelectedPresetId,
    lastSelectedSettings,
    initialPlayerOptions,
    customPresetNames,
    logPreference,
    createPatchPreference,
  }: Props = $props()
  /* eslint-enable prefer-const */
  
  let mainContentContainer: HTMLElement
  let seed = $state("")
  let settingsViewModel = $state(defaultSettingsViewModel())
  let playerOptions = $state(initialPlayerOptions)
  let generateLogToggleViewModel = $state(createSimpleToggleViewModel({
    id: "CREATE_LOG" as const,
    name: "Generate Log File",
    description: "Creates a file that contains a record of all the settings that were used and all the random assignments that were made when generating the game.",
    isOn: logPreference,
  }))
  
  let generatePatchFileToggleViewModel = $state(createSimpleToggleViewModel({
    id: "CREATE_PATCH",
    name: "Generate Patch File",
    description: "Creates a '.pcrp' file that can be shared with others to generate the same game with the same settings and randomization.",
    isOn: createPatchPreference,
  }))
  
  const currentPreset = $derived.by(() => {
    lastSelectedPresetId
    lastSelectedSettings
    settingsViewModel
    return _currentPreset()
  })
  const _currentPreset = () => {
    // Normalize the last selected settings and compare
    const lastSettingsViewModel = defaultSettingsViewModel()
    applySettingsToViewModel(lastSelectedSettings, lastSettingsViewModel, [])
    if (JSON.stringify(settingsFromViewModel(lastSettingsViewModel)) === JSON.stringify(currentSettings())) {
      return (presetsMap as any)[lastSelectedPresetId] ?? {
        id: lastSelectedPresetId,
        name: lastSelectedPresetId,
      }
    } else {
      return presetsMap.CUSTOM
    }
  }
  
  const currentPresetName = $derived(currentPreset.name)
  
  const presetOptions = $derived.by(() => { customPresetNames; return _presetOptions() })
  const _presetOptions = () => {
    return [
      ...Object.values(presetsMap).filter((preset) => {
        return preset.id !== "CUSTOM"
      }).map((preset) => {
        return optionFrom(preset)
      }),
      ...customPresetNames.map((name) => {
        return optionFrom({
          id: name,
          name: name,
          isRemovable: true,
        })
      }),
    ]
  }
  
  const currentSettings = () => {
    return settingsFromViewModel($state.snapshot(settingsViewModel) as typeof settingsViewModel)
  }
  
  onMount(() => {
    applyNewSettings(lastSelectedSettings)
  })
  
  const onPlayerOptionsUpdated = (updatedPlayerOptons: PlayerOptions) => {
    playerOptions = updatedPlayerOptons
  }
  
  const applyNewSettings = (settings: unknown | undefined) => {
    try {
      const warnings: string[] = []
      const newViewModel = defaultSettingsViewModel()
      applySettingsToViewModel(settings, newViewModel, warnings)
      settingsViewModel = newViewModel
      
      if (warnings.length > 0) {
        showDialog({
          title: "Warning",
          message: `Found invalid data while loading settings.\n\n${warnings.join("\n\n")}`,
          submitButtonLabel: "OK",
        })
      }
    } catch (error) {
      showErrorDialog(error)
    }
  }
  
  const presetSelected = async (presetId: string) => {
    if (currentPreset.id !== "CUSTOM" && presetId === lastSelectedPresetId || currentPreset.id === "CUSTOM" && presetId === "CUSTOM") {
      return
    }
    
    showProgressIndicator()
    lastSelectedPresetId = presetId
    lastSelectedSettings = (await window.mainAPI.getPresetSettings(lastSelectedPresetId)).result
    applyNewSettings(lastSelectedSettings)
    hideProgressIndicator()
  }
  
  const showRemovePresetConfirmation = (id: string) => {
    showDialog({
      title: "Remove Preset?",
      message: `Are you sure you would like to remove the '${id}' preset?\nThis action cannot be undone.`,
      submitButtonLabel: "Remove",
      hasCancelButton: true,
      onSubmit: async () => {
        try {
          showProgressIndicator()
          const response = await window.mainAPI.removeSavedSettings(id)
          
          customPresetNames = customPresetNames.filter((name) => {
            return name !== id
          })
          
          if (lastSelectedPresetId === id) {
            lastSelectedPresetId = "CUSTOM"
          }
          
          showSuccessDialog(response.message)
        } catch (error) {
          showErrorDialog(error)
        } finally {
          hideProgressIndicator()
        }
      },
    })
  }
  
  const importSettingsButtonClicked = () => {
    showDialog({
      title: "Import Settings",
      submitButtonLabel: "Import",
      hasCancelButton: true,
      inputInfo: {
        title: "YAML Settings File",
        type: "file",
        fileExtension: ".yml, .yaml",
      },
      onSubmit: async (inputValue) => {
        if (isNullish(inputValue)) {
          showErrorDialog("Unable to read selected file.")
        } else if (!(inputValue instanceof DataView)) {
          showErrorDialog(`Received invalid input type from input dialog. Expected a file but got input type of '${typeof inputValue}'.`)
        }
        
        const fileData = inputValue as DataView
        const settings = yaml.parse(new TextDecoder().decode(fileData.buffer))
        
        applyNewSettings(settings)
        
        if (settings.VERSION !== appVersion) {
          showDialog({
            title: "Unexpected Version",
            message: "The imported settings were exported from a different version of the app and may not behave as expected.\n"
              + `App Version: ${appVersion}\nImported Settings Version: ${settings.VERSION}`,
            submitButtonLabel: "OK",
          })
        }
      },
    })
  }
  
  const exportSettingsButtonClicked = async () => {
    try {
      showProgressIndicator()
      const response = await window.mainAPI.exportSettings(currentSettings())
      showSuccessDialog(response.message)
    } catch (error) {
      showErrorDialog(error)
    } finally {
      hideProgressIndicator()
    }
  }
  
  const playerOptionsButtonClicked = () => {
    const savePlayerOptions = async () => {
      showProgressIndicator()
      await window.mainAPI.savePlayerOptions($state.snapshot(playerOptions))
      hideProgressIndicator()
    }
    
    showDialog({
      title: "Player Options",
      message: "The following options are meant to be customized on a per player basis and are not included when exporting settings or sharing patches with others.",
      extraContent: playerOptionsView,
      submitButtonLabel: "Done",
      onSubmit: savePlayerOptions,
      onCancel: savePlayerOptions,
    })
  }
  
  const createNewPresetButtonClicked = () => {
    showDialog({
      title: "Create New Preset",
      message: "Save the current settings as a preset that can be reused in the future.",
      submitButtonLabel: "Create",
      hasCancelButton: true,
      inputInfo: {
        title: "Preset Name",
        type: "text",
        validator: (text) => {
          const nameExists = presetOptions.find((option) => {
            return option.id === text
          })
          
          if (nameExists) {
            return "Preset name already exists."
          } else if (text === "") {
            return ""
          } else {
            return undefined
          }
        },
      },
      onSubmit: async (name) => {
        try {
          showProgressIndicator()
          const response = await window.mainAPI.saveSettings(currentSettings(), name)
          
          customPresetNames = [
            ...customPresetNames,
            name,
          ]
          
          lastSelectedPresetId = name
          lastSelectedSettings = settingsFromViewModel(settingsViewModel)
          
          showSuccessDialog(response.message)
        } catch (error) {
          showErrorDialog(error)
        } finally {
          hideProgressIndicator()
        }
      },
    })
  }
  
  const generateROMButtonClicked = async () => {
    const settings = currentSettings()
    
    let recommendation = ""
    
    if (
      settings.RANDOMIZE_RANDOM_ENCOUNTERS.VALUE && (
        !settings.RANDOMIZE_HM_COMPATIBILITY.VALUE ||
        settings.RANDOMIZE_HM_COMPATIBILITY.SETTINGS.PERCENTAGE !== 100
      )
    ) {
      recommendation = "It is recommended to enable the 'Randomize HM Compatibility' setting and set the 'Percentage' to '100' if the 'Randomize Random Encounters' setting is enabled."
    } else if (
      settings.RANDOMIZE_HM_COMPATIBILITY.VALUE &&
      settings.RANDOMIZE_HM_COMPATIBILITY.SETTINGS.PERCENTAGE !== 100
    ) {
      recommendation = "It is recommended to set the 'Randomize HM Compatibility Percentage' to '100' if the 'Randomize HM Compatibility' setting is enabled."
    }
    
    if (recommendation !== "") {
      showDialog({
        title: "WARNING!",
        message: "Using the current settings could result in a game that is impossible to progress.\n"
          + `${recommendation}\nThis is so that you don't end up in a situation where you are unable to catch any Pokémon that can learn the HM's required to progress the game.`,
        submitButtonLabel: "Continue Anyways",
        hasCancelButton: true,
        onSubmit: () => {
          generateROM(settings)
        },
      })
    } else {
      generateROM(settings)
    }
  }
  
  const generateROM = async (settings: Settings) => {
    const playerOptionsViewModel = defaultPlayerOptionsViewModel()
    applyPlayerOptionsToViewModel(playerOptions, playerOptionsViewModel, [])
    
    try {
      showProgressIndicator()
      const response = await window.mainAPI.generateROM(
        seed === "" ? undefined : seed,
        settings,
        playerOptionsFromViewModel(playerOptionsViewModel),
        currentPreset.id,
        generateLogToggleViewModel.isOn,
        generatePatchFileToggleViewModel.isOn,
      )
      showSuccessDialog(response.message)
    } catch (error) {
      showErrorDialog(error)
    } finally {
      hideProgressIndicator()
    }
  }
</script>