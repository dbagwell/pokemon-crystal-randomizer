<div
  style:background-color={colors.primarySurface}
  style:border-radius="inherit"
  style:max-height="inherit"
>
  <Stack
    alignment="fill"
    direction="vertical"
    distribution="fill"
    maxHeight="inherit"
    minSpacing={20}
    padding={50}
  >
    {#if isNotNullish(title)}
      <div use:textStyle={"title"}>
        {title}
      </div>
    {/if}
  
    {#if isNotNullish(message) || isNotNullish(extraContent)}
      <div
        style:min-height="20px"
        style:overflow="auto"
      >
        <Stack
          alignment="start"
          direction="vertical"
          distribution="fill"
          minSpacing={10}
        >
        
          {#if isNotNullish(message)}
            {#each message.split("\n") as paragraph}
              <div use:textStyle={"content"}>{paragraph}</div>
            {/each}
          {/if}
    
          {#if isNotNullish(extraContent)}
            {@render extraContent(extraContentInputAccessor)}
          {/if}
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
  import { textStyle } from "@scripts/textStyle"
  import type { DialogInputInfo } from "@shared/types/dialog"
  import { isNotNullish, isNullish } from "@utils"
  import type { Snippet } from "svelte"
  
  type Props = {
    title?: string
    message?: string
    extraContent?: Snippet<[{ getInput?: () => any }]>
    inputInfo?: DialogInputInfo
    hasCancelButton?: boolean
    submitButtonLabel?: string
    onCancel?: () => void
    onSubmit?: ((inputValue: any) => void)
  }
  
  const {
    title,
    message,
    extraContent,
    inputInfo,
    hasCancelButton = false,
    submitButtonLabel = "Submit",
    onCancel,
    onSubmit,
  }: Props = $props()
  
  let selectedFileName: string | undefined = $state()
  let files: FileList | undefined = $state()
  let textValue = $state("")
  
  const extraContentInputAccessor: { getInput?: () => any } = {}
  
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
    } else {
      const value = extraContentInputAccessor.getInput?.()
      if (isNotNullish(value)) {
        return value
      }
    }
    
    return undefined
  }
  
  const cancelButtonClicked = () => {
    onCancel?.()
  }
  
  const submitButtonClicked = async () => {
    const value = await inputValue()
    onSubmit?.(value)
  }
  
</script>