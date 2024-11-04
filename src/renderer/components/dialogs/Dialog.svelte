<div
  style:display={open ? "block" : "none"}
  style:position="fixed"
  style:inset="0"
  style:width="100%"
  style:height="100%"
  style:background-color="#00000055"
  style:backdrop-filter="blur(10px)"
  style:z-index={zIndexes.dialogLayer}
  on:click|self={cancelButtonClicked}
>
  <div
    style:position="absolute"
    style:margin="auto"
    style:width="auto"
    style:height="auto"
    style:background-color={colors.background}
    style:box-shadow="5px 5px 5px #00000070"
    style:border-radius="20px"
    style:top="50%"
    style:left="50%"
    style:transform="translate(-50%, -50%)"
  >
    <Stack
      alignment="fill"
      direction="vertical"
      distribution="fill"
      minSpacing={20}
      padding={50}
    >
      {#if isNotNullish(title)}
        <div
          style:color={colors.text}
          style:font-size="20px"
        >
          {title}
        </div>
      {/if}
    
      {#if isNotNullish(message)}
        <div style:color={colors.text}>{message}</div>
      {/if}
    
      {#if isNotNullish(inputInfo)}
        <FileInput
          allowedFileTypes={inputInfo.fileExtension}
          title={inputInfo.title}
          bind:value={selectedFileName}
          bind:files={files}
        />
      {/if}
      <Stack
        alignment="fill"
        direction="horizontal"
        distribution="fill"
        minSpacing={20}
      >
        {#if hasCancelButton}
          <Button
            style="fill"
            flexGrow={true}
            isDestructive={true}
            onClick={cancelButtonClicked}
            title="Cancel"
          />
        {/if}
    
        <Button
          style="fill"
          flexGrow={true}
          onClick={submitButtonClicked}
          title={submitButtonLabel}
        />
      </Stack>
    </Stack>
  </div>
</div>

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import FileInput from "@components/inputs/FileInput.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  import { zIndexes } from "@scripts/constants"
  import type { DialogInputInfo } from "@shared/types/dialog"
  import { isNotNullish, isNullish } from "@utils"

  export let open = true
  export let title: string | undefined
  export let message: string | undefined
  export let inputInfo: DialogInputInfo | undefined
  export let hasCancelButton = false
  export let submitButtonLabel = "Submit"
  export let onCancel: () => void
  export let onSubmit: ((inputValue: any) => void)
  export let onDismiss: () => void
  
  let submitButton: Button
  let selectedFileName: string | undefined
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
    }
  }
  
  const cancelButtonClicked = () => {
    onCancel?.()
    open = false
  }
  
  const submitButtonClicked = async () => {
    if (isNullish(inputInfo)) {
      onSubmit?.(undefined)
      open = false
      return
    }
    
    const value = await inputValue()
    
    if (isNotNullish(value)) {
      onSubmit?.(value)
    }
    
    open = false
  }
  
  $: files, selectedFileName, filesChanged()
  const filesChanged = async () => {
    if (submitButton !== null && submitButton !== undefined) {
      submitButton.getElement().disabled = isNullish(await inputValue())
    }
  }
  
  $: open, openListener()
  const openListener = () => {
    if (!open) {
      onDismiss()
    }
  }
  
</script>