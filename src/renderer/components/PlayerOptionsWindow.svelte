<DialogContent
  extraContent={playerOptionsView}
  message={"Customize your individual game experience.\nThe selected options will be used as the default options for all patches going forward, but can be changed from within the main randomizer application at any time.\nCertain options may not be used depending on the settings used to generate the patch."}
  onSubmit={savePlayerOptions}
  submitButtonLabel="Continue"
  title="Player Options"
/>

<ProgressIndicator/>

<DialogContainer/>

<Tooltip/>

{#snippet playerOptionsView(inputAccessor: { getInput?: () => PlayerOptions })}
  <PlayerOptionsView
    initialPlayerOptions={initialPlayerOptions}
    inputAccessor={inputAccessor}
  />
{/snippet}

<script lang="ts">
  import DialogContainer from "@components/dialogs/DialogContainer.svelte"
  import DialogContent from "@components/dialogs/DialogContent.svelte"
  import PlayerOptionsView from "@components/PlayerOptionsView.svelte"
  import ProgressIndicator, { hideProgressIndicator, showProgressIndicator } from "@components/utility/ProgressIndicator.svelte"
  import Tooltip from "@components/utility/Tooltip.svelte"
  import type { PlayerOptions } from "@shared/appData/settingsFromViewModel"
  
  type Props = {
    initialPlayerOptions: unknown
  }
  
  const {
    initialPlayerOptions,
  }: Props = $props()
  
  const savePlayerOptions = async (playerOptions: PlayerOptions) => {
    showProgressIndicator()
    await window.mainAPI.savePlayerOptions(playerOptions)
    hideProgressIndicator()
  }
</script>
  