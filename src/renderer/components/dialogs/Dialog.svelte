<Dialog bind:open={open}>
  {#if isNotNullish(title)}
    <Title>{title}</Title>
  {/if}
  
  <Content>
    {#if isNotNullish(message)}
      {message}
    {/if}
    
    {#if isNotNullish(inputInfo)}
      <Textfield
        bind:this={textfield}
        input$accept={inputInfo.fileExtension}
        label={inputInfo.title}
        type={inputInfo.type}
        bind:value={textfieldValue}
        bind:files={files}
      />
    {/if}
  </Content>
  
  <Actions>
    {#if hasCancelButton}
      <Button on:click={onCancel}>
        <Label>Cancel</Label>
      </Button>
    {/if}
    
    <Button
      bind:this={submitButton}
      variant="raised"
      on:click={submitButtonClicked}
    >
      <Label>{submitButtonLabel}</Label>
    </Button>
  </Actions>
</Dialog>

<script lang="ts">
  
  import Button, { Label } from "@smui/button"
  import Dialog, { Actions, Content, Title } from "@smui/dialog"
  import Textfield from "@smui/textfield"
  import { isNotNullish, isNullish } from "@utils"

  export let open = true
  export let title: string | undefined
  export let message: string | undefined
  export let inputInfo: DialogInputInfo | undefined
  export let hasCancelButton = false
  export let submitButtonLabel = "Submit"
  export let onCancel: () => void | undefined
  export let onSubmit: ((inputValue: any) => void) | undefined
  
  let textfield: Textfield
  let submitButton: Button
  
  let textfieldValue = "" // Workaround for https://github.com/hperrin/svelte-material-ui/issues/628
  let files: FileList | undefined
  
  const selectedFile = (): File | undefined => {
    if (isNotNullish(files) && files.length !== 0) {
      return files[0]
    }
  }
  
  const inputValue = async (): Promise<any> => {
    if (inputInfo?.type === "file") {
      const file = selectedFile()
      if (isNotNullish(file)) {
        return new DataView(await file.arrayBuffer())
      }
    } else {
      if (textfieldValue !== "") {
        return textfieldValue
      }
    }
  }
  
  const submitButtonClicked = async () => {
    if (isNullish(inputInfo)) {
      onSubmit?.(undefined)
      return
    }
    
    const value = await inputValue()
    
    if (isNotNullish(value)) {
      onSubmit?.(value)
    }
  }
  
  $: files, textfieldValue, filesChanged()
  const filesChanged = async () => {
    if (submitButton !== null && submitButton !== undefined) {
      submitButton.getElement().disabled = isNullish(await inputValue())
    }
  }
  
  $: open, openListener()
  const openListener = () => {
    if (!open) {
      onCancel()
    }
  }
  
</script>