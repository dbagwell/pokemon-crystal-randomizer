<div
  style:position="absolute"
  style:background-color={colors.appBackground}
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
            <div
              style:display="flex"
              style:width="{100 / viewModel.tabViewModels.length}%"
              style:height="auto"
              style:border-radius="15px 15px 0 0"
              style:align-items="center"
              style:background-color={viewModel.selectedTabId === tabViewModel.id ? colors.background : colors.inactiveTabBackground}
              style:cursor={viewModel.selectedTabId === tabViewModel.id ? "inherit" : "pointer"}
              style:z-index={viewModel.selectedTabId === tabViewModel.id ? "1" : "auto"}
              on:click={() => {
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
                  style:color={viewModel.selectedTabId === tabViewModel.id ? colors.activeTint : colors.deemphasizedText}
                >
                  {tabViewModel.name}
                </div>
                <div
                  style:background-color={viewModel.selectedTabId === tabViewModel.id ? colors.activeTint : "inherit"}
                  style:height="3px"
                  style:width="90%"
                >
                </div>
              </Stack>
            </div>
          {/each}
        </Stack>
      </div>
    </div>
    <div
      bind:this={mainContentContainer}
      style:flex-grow="1"
      style:flex-shrink="1"
      style:background-color={colors.background}
      style:box-shadow="0 -2px 5px #00000070"
      style:height="auto"
      style:overflow="scroll"
    >
      {#each viewModel.tabViewModels as tabViewModel (tabViewModel.id)}
        {#if viewModel.selectedTabId === tabViewModel.id}
          <Stack
            alignment="fill"
            direction="vertical"
            distribution="start"
            minSpacing={20}
            padding={20}
            width="100%"
          >
            {#each tabViewModel.viewModels as subViewModel (subViewModel.id)}
              <SettingsInputView viewModel={subViewModel}/>
            {/each}
          </Stack>
        {/if}
      {/each}
    </div>
    <div
      style:background-color={colors.background}
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

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import DialogContainer, { showErrorDialog, showSuccessDialog } from "@components/dialogs/DialogContainer.svelte"
  import TextField from "@components/inputs/TextField.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import SettingsInputView from "@components/settingsInputViews/SettingsInputView.svelte"
  import ProgressIndicator, { hideProgressIndicator, showProgressIndicator } from "@components/utility/ProgressIndicator.svelte"
  import { colors } from "@scripts/colors"
  import { defaultAppViewModel } from "@shared/appData/defaultAppViewModel"
  import { onMount } from "svelte"
  
  // export let initialSettings: any | undefined
  
  let mainContentContainer: HTMLElement
  let seed = ""
  let viewModel = defaultAppViewModel()
  
  onMount(() => {
    try {
      const newViewModel = defaultAppViewModel()
      // setConfigValuesFromSettings("", "", newConfig, initialSettings)
      viewModel = newViewModel
    } catch (error) {
      showErrorDialog(error)
    }
  })
  
  const generateROMButtonClicked = async () => {
    try {
      showProgressIndicator()
    // TODO:
      // const response = await window.mainAPI.generateROM(seed === "" ? undefined : seed, getSettingsFromConfig(config))
      // showSuccessDialog(response.message)
    } catch (error) {
      showErrorDialog(error)
    } finally {
      hideProgressIndicator()
    }
  }
</script>