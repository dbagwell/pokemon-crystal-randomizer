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
      <div style:overflow-x="scroll">
        <Stack
          alignment="fill"
          direction="horizontal"
          distribution="fill"
          minSpacing={3}
          minWidth="570px"
          padding={[5, 5, 0, 5]}
        >
          {#each viewModel.tabViewModels as tabViewModel (tabViewModel.id)}
            <button
              style:display="flex"
              style:width="{100 / viewModel.tabViewModels.length}%"
              style:height="auto"
              style:border-radius="15px 15px 0 0"
              style:align-items="center"
              style:background-color={viewModel.selectedTabId === tabViewModel.id ? colors.primarySurface : colors.secondarySurface}
              style:border="0px none transparent"
              style:cursor={viewModel.selectedTabId === tabViewModel.id ? "inherit" : "pointer"}
              style:z-index={viewModel.selectedTabId === tabViewModel.id ? "1" : "auto"}
              onclick={() => {
                viewModel.selectedTabId = tabViewModel.id
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
                  style:color={viewModel.selectedTabId === tabViewModel.id ? colors.primaryTint : colors.subtleText}
                >
                  {tabViewModel.name}
                </div>
                <div
                  style:background-color={viewModel.selectedTabId === tabViewModel.id ? colors.primaryTint : "inherit"}
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
      style:overflow="scroll"
    >
      {#each viewModel.tabViewModels as tabViewModel (tabViewModel.id)}
        {#if viewModel.selectedTabId === tabViewModel.id}
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
            onSelect={(presetId) => { presetSelected(presetId as PresetId ?? "VANILLA") }}
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
  </Stack>
</div>

<ProgressIndicator/>

<DialogContainer/>

<Tooltip/>

{#snippet playerOptionsView()}
  <Stack
    alignment="start"
    direction="vertical"
    distribution="start"
    minSpacing={20}
    padding={20}
    width="100%"
  >
    {#each playerOptionsViewModels as viewModel, index (viewModel.id)}
      <SettingsInputView bind:viewModel={playerOptionsViewModels[index]}/>
    {/each}
  </Stack>
{/snippet}

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import DialogContainer, { showDialog, showErrorDialog, showSuccessDialog } from "@components/dialogs/DialogContainer.svelte"
  import AutocompleteTextField, { optionFrom } from "@components/inputs/AutocompleteTextField.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import ToggleView from "@components/settingsInputViews/ToggleView.svelte"
  import ProgressIndicator, { hideProgressIndicator, showProgressIndicator } from "@components/utility/ProgressIndicator.svelte"
  import Tooltip from "@components/utility/Tooltip.svelte"
  import { colors } from "@scripts/colors"
  import { applySettingsToAppViewModel, applySettingsToPlayerOptionsViewModels } from "@shared/appData/applySettingsToAppViewModel"
  import { defaultAppViewModel } from "@shared/appData/defaultAppViewModel"
  import { defaultPlayerOptionsViewModels } from "@shared/appData/defaultPlayerOptionsViewModels"
  import { type PresetId, presetsMap } from "@shared/appData/presets"
  import { type SettingsFromAppViewModel, settingsFromAppViewModel, settingsFromPlayerOptionsModels, type SettingsFromPlayerOptionsViewModels } from "@shared/appData/settingsFromAppViewModel"
  import { onMount } from "svelte"
  
  type Props = {
    lastSelectedPresetId: PresetId
    lastSelectedSettings: unknown | undefined
    lastSelectedPlayerOptions: unknown | undefined
    customPresetNames: string[]
  }
  
  /* eslint-disable prefer-const */
  let {
    lastSelectedPresetId,
    lastSelectedSettings,
    lastSelectedPlayerOptions,
    customPresetNames,
  }: Props = $props()
  /* eslint-enable prefer-const */
  
  let mainContentContainer: HTMLElement
  let seed = $state("")
  let viewModel = $state(defaultAppViewModel())
  let playerOptionsViewModels = $state(defaultPlayerOptionsViewModels())
  
  const currentPreset = $derived.by(() => {
    lastSelectedPresetId
    lastSelectedSettings
    viewModel
    return _currentPreset()
  })
  const _currentPreset = () => {
    if (JSON.stringify(lastSelectedSettings) === JSON.stringify(currentSettings())) {
      return presetsMap[lastSelectedPresetId] ?? {
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
    return settingsFromAppViewModel($state.snapshot(viewModel) as typeof viewModel)
  }
  
  onMount(() => {
    applyNewSettings(lastSelectedSettings)
    initPlayerOptions()
  })
  
  const applyNewSettings = (settings: unknown | undefined) => {
    try {
      const warnings: string[] = []
      const newViewModel = defaultAppViewModel()
      applySettingsToAppViewModel(settings, newViewModel, warnings)
      viewModel = newViewModel
      
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
  
  const initPlayerOptions = () => {
    try {
      const warnings: string[] = []
      const newViewModels = defaultPlayerOptionsViewModels()
      applySettingsToPlayerOptionsViewModels(lastSelectedPlayerOptions, newViewModels, warnings)
      playerOptionsViewModels = newViewModels
      
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
  }
  
  const presetSelected = async (presetId: PresetId) => {
    if (presetId === lastSelectedPresetId || presetId === "CUSTOM") {
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
  
  const playerOptionsButtonClicked = () => {
    showDialog({
      title: "Player Options",
      message: "The following options are meant to be customized on a per player basis and are not included when exporting settings or sharing patches with others.",
      extraContent: playerOptionsView,
      submitButtonLabel: "Done",
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
          lastSelectedSettings = settingsFromAppViewModel(viewModel)
          
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
    const playerOptions = settingsFromPlayerOptionsModels(playerOptionsViewModels)
    
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
          generateROM(settings, playerOptions)
        },
      })
    } else {
      generateROM(settings, playerOptions)
    }
  }
  
  const generateROM = async (settings: SettingsFromAppViewModel, playerOptions: SettingsFromPlayerOptionsViewModels) => {
    try {
      showProgressIndicator()
      const response = await window.mainAPI.generateROM(seed === "" ? undefined : seed, settings, playerOptions, currentPreset.id)
      showSuccessDialog(response.message)
    } catch (error) {
      showErrorDialog(error)
    } finally {
      hideProgressIndicator()
    }
  }
</script>