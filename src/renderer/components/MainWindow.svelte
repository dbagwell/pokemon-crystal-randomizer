<Paper>
  <Title>Pokémon Crystal Randomizer</Title>
  <Subtitle>Generate and apply patches to Pokémon Crystal Version.</Subtitle>
  <Content>
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
  import ProgressIndicator, { hideProgressIndicator, showProgressIndicator } from "@components/ProgressIndicator.svelte"
  import Button, { Label } from "@smui/button"
  import Paper, { Content, Subtitle, Title } from "@smui/paper"
  
  const generateROMButtonClicked = async () => {
    try {
      showProgressIndicator()
      const response = await window.mainAPI.generateROM()
      showSuccessDialog(response.message)
    } catch (error) {
      showErrorDialog(error)
    } finally {
      hideProgressIndicator()
    }
  }
</script>