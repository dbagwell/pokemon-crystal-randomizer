<Paper>
  <Title>Pokémon Crystal Randomizer</Title>
  <Subtitle>Generate and apply patches to Pokémon Crystal Version.</Subtitle>
  <Content>
    <Textfield
      label="Seed"
      bind:value={seed}
    />
    <FormSection config={config}/>
    <Button
      variant="raised"
      on:click={generateROMButtonClicked}
    >
      <Label>GENERATE ROM</Label>
    </Button>
  </Content>
</Paper>

<ProgressIndicator/>

<DialogContainer/>

<script lang="ts">
  import DialogContainer, { showErrorDialog, showSuccessDialog } from "@components/dialogs/DialogContainer.svelte"
  import FormSection from "@components/formElements/FormSection.svelte"
  import ProgressIndicator, { hideProgressIndicator, showProgressIndicator } from "@components/ProgressIndicator.svelte"
  import { setConfigValuesFromSettings } from "@shared/appData/configHelpers"
  import { defaultConfig } from "@shared/appData/defaultConfig"
  import Button, { Label } from "@smui/button"
  import Paper, { Content, Subtitle, Title } from "@smui/paper"
  import Textfield from "@smui/textfield"
  import { onMount } from "svelte"
  
  export let initialSettings: any | undefined
  
  let seed = ""
  let config = defaultConfig()
  
  onMount(() => {
    try {
      const newConfig = defaultConfig()
      setConfigValuesFromSettings("", "", newConfig, initialSettings)
      config = newConfig
    } catch (error) {
      showErrorDialog(error)
    }
  })
  
  const generateROMButtonClicked = async () => {
    try {
      showProgressIndicator()
      const response = await window.mainAPI.generateROM(seed, config)
      showSuccessDialog(response.message)
    } catch (error) {
      showErrorDialog(error)
    } finally {
      hideProgressIndicator()
    }
  }
</script>