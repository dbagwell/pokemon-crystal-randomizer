<Paper>
  <Title>Pokémon Crystal Randomizer</Title>
  <Subtitle>Generate and apply patches to Pokémon Crystal Version.</Subtitle>
  <Content>
    {#each generatorSettingsSpecs as generatorSettingsSpec, index}
      <GeneratorSettingInput
        bind:this={generatorSettingsInputs[index]}
        spec={generatorSettingsSpec}
      />
      <br>
    {/each}
    <br>
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
  import GeneratorSettingInput from "@components/GeneratorSettingInput.svelte"
  import ProgressIndicator, { hideProgressIndicator, showProgressIndicator } from "@components/ProgressIndicator.svelte"
  import type { GeneratorSettingSpec } from "@shared/types/generatorSettings"
  import { compact } from "@shared/utils"
  import Button, { Label } from "@smui/button"
  import Paper, { Content, Subtitle, Title } from "@smui/paper"
  
  export let generatorSettingsSpecs: GeneratorSettingSpec[]
  
  const generatorSettingsInputs: GeneratorSettingInput[] = []
  
  const generateROMButtonClicked = async () => {
    const settings = compact(generatorSettingsInputs.map((value) => {
      return value.getSetting()
    }))
    
    try {
      showProgressIndicator()
      const response = await window.mainAPI.generateROM(settings)
      showSuccessDialog(response.message)
    } catch (error) {
      showErrorDialog(error)
    } finally {
      hideProgressIndicator()
    }
  }
</script>