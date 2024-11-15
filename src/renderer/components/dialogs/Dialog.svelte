<div
  style:display={open ? "block" : "none"}
  style:position="fixed"
  style:inset="0"
  style:width="100%"
  style:height="100%"
  style:background-color="#00000055"
  style:backdrop-filter="blur(10px)"
  style:z-index={zIndexes.dialogLayer}
  onclick={cancelButtonClicked}
>
</div>
<div
  style:position="absolute"
  style:margin="auto"
  style:width="auto"
  style:height="auto"
  style:background-color={colors.primarySurface}
  style:box-shadow="5px 5px 5px #00000070"
  style:border-radius="20px"
  style:top="50%"
  style:left="50%"
  style:transform="translate(-50%, -50%)"
  style:z-index={zIndexes.dialogLayer}
>
  <Stack
    alignment="fill"
    direction="vertical"
    distribution="fill"
    minSpacing={20}
    padding={50}
  >
    {#if isNotNullish(title)}
      <div use:textStyle={"title"}>
        {title}
      </div>
    {/if}
  
    {#if isNotNullish(message)}
      <div use:textStyle={"content"}>{message}</div>
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
        bind:isDisabled={isSubmitButtonDisabled}
      />
    </Stack>
  </Stack>
</div>

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import FileInput from "@components/inputs/FileInput.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  import { zIndexes } from "@scripts/constants"
  import { textStyle } from "@scripts/textStyle"
  import type { DialogInputInfo } from "@shared/types/dialog"
  import { isNotNullish, isNullish } from "@utils"
  
  type Props = {
    title?: string
    message?: string
    inputInfo?: DialogInputInfo
    hasCancelButton?: boolean
    submitButtonLabel?: string
    onCancel: () => void
    onSubmit: ((inputValue: any) => void)
    onDismiss: () => void
  }
  
  const {
    title,
    message,
    inputInfo,
    hasCancelButton = false,
    submitButtonLabel = "Submit",
    onCancel,
    onSubmit,
    onDismiss,
  }: Props = $props()
  
  let selectedFileName: string | undefined = $state()
  let files: FileList | undefined = $state()
  let open = $state(true)
  let isSubmitButtonDisabled = $state(false)
  
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
  
  $effect(() => { files; selectedFileName; filesChanged() })
  const filesChanged = async () => {
    if (isNotNullish(inputInfo)) {
      isSubmitButtonDisabled = isNullish(await inputValue())
    }
  }
  
  $effect(() => { open; openListener() })
  const openListener = () => {
    if (!open) {
      onDismiss()
    }
  }
  
</script>