<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
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
    maxHeight="100vh"
    minSpacing={20}
    padding={50}
  >
    {#if isNotNullish(title)}
      <div use:textStyle={"title"}>
        {title}
      </div>
    {/if}
  
    {#if isNotNullish(message)}
      <div
        style:min-height="20px"
        style:overflow="scroll"
      >
        <Stack
          alignment="start"
          direction="vertical"
          distribution="fill"
          minSpacing={10}
        >
          {#each message.split("\n") as paragraph}
            <div use:textStyle={"content"}>{paragraph}</div>
          {/each}
        </Stack>
      </div>
    {/if}
  
    {#if isNotNullish(inputInfo)}
      {#if inputInfo.type === "file"}
        <FileInput
          allowedFileTypes={inputInfo.fileExtension}
          title={inputInfo.title}
          bind:value={selectedFileName}
          bind:files={files}
        />
      {:else if inputInfo.type === "text"}
        <TextField
          title={inputInfo.title}
          type="text"
          bind:value={textValue}
        />
        {#if isNotNullish(validationError)}
          <div use:textStyle={"error"}>
            {validationError}
          </div>
        {/if}
      {/if}
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
      {#await isSubmitButtonDisabled}
        {@render submitButton(true)}
      {:then isDisabled}
        {@render submitButton(isDisabled)}
      {/await}
    </Stack>
  </Stack>
</div>

{#snippet submitButton(isDisabled: boolean)}
  <Button
    style="fill"
    flexGrow={true}
    isDisabled={isDisabled}
    onClick={submitButtonClicked}
    title={submitButtonLabel}
  />
{/snippet}

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import FileInput from "@components/inputs/FileInput.svelte"
  import TextField from "@components/inputs/TextField.svelte"
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
  let textValue = $state("")
  
  const isSubmitButtonDisabled = $derived.by(async () => { files; selectedFileName; return await _isSubmitButtonDisabled() })
  const _isSubmitButtonDisabled = async () => {
    if (isNotNullish(inputInfo)) {
      if (inputInfo.type === "file") {
        return isNullish(await inputValue())
      } else if (inputInfo.type === "text") {
        return isNotNullish(inputInfo.validator?.(textValue))
      } else {
        return true // Should never happen
      }
    } else {
      return false
    }
  }
  
  const validationError = $derived.by(() => {
    if (inputInfo?.type !== "text") {
      return undefined
    }
    
    const error = inputInfo?.validator?.(textValue)
    
    if (error === "") {
      return undefined
    } else {
      return error
    }
  })
  
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
    } else if (inputInfo?.type === "text") {
      return textValue
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
  
  $effect(() => { open; openListener() })
  const openListener = () => {
    if (!open) {
      onDismiss()
    }
  }
  
</script>