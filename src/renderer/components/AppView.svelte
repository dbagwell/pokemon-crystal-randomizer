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
        alignment="center"
        direction="horizontal"
        distribution="fill"
        minSpacing={3}
        padding={20}
      >
        <TextField
          title="Custom Seed"
          type="text"
          bind:value={seed}
        />
        <Button
          style="fill"
          onClick={generateROMButtonClicked}
          title="GENERATE"
        />
      </Stack>
    </div>
  </Stack>
</div>

<ProgressIndicator/>

<DialogContainer/>

<Tooltip/>

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import DialogContainer, { showDialog, showErrorDialog, showSuccessDialog } from "@components/dialogs/DialogContainer.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import ProgressIndicator, { hideProgressIndicator, showProgressIndicator } from "@components/utility/ProgressIndicator.svelte"
  import Tooltip from "@components/utility/Tooltip.svelte"
  import { colors } from "@scripts/colors"
  import { applySettingsToAppViewModel } from "@shared/appData/applySettingsToAppViewModel"
  import { defaultAppViewModel } from "@shared/appData/defaultAppViewModel"
  import { type SettingsFromAppViewModel, settingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
  import { onMount } from "svelte"
  
  type Props = {
    initialSettings: unknown | undefined,
  }
  
  const { initialSettings }: Props = $props()
  
  let mainContentContainer: HTMLElement
  let seed = $state("")
  let viewModel = $state(defaultAppViewModel())
  
  onMount(() => {
    try {
      const warnings: string[] = []
      const newViewModel = defaultAppViewModel()
      applySettingsToAppViewModel(initialSettings, newViewModel, warnings)
      viewModel = newViewModel
      
      if (warnings.length > 0) {
        showDialog({
          title: "Warning",
          message: `Found invalid data while loading previous settings.\n\n${warnings.join("\n\n")}`,
          submitButtonLabel: "OK",
        })
      }
    } catch (error) {
      showErrorDialog(error)
    }
  })
  
  const generateROMButtonClicked = async () => {
    const settings = settingsFromAppViewModel($state.snapshot(viewModel) as typeof viewModel)
    
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
  
  const generateROM = async (settings: SettingsFromAppViewModel) => {
    try {
      showProgressIndicator()
      const response = await window.mainAPI.generateROM(seed === "" ? undefined : seed, settings)
      showSuccessDialog(response.message)
    } catch (error) {
      showErrorDialog(error)
    } finally {
      hideProgressIndicator()
    }
  }
</script>