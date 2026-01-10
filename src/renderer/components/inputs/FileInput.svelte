<label style:cursor="pointer">
  <input
    bind:this={inputElement}
    style:position="absolute"
    style:width="0"
    style:height="0"
    accept={allowedFileTypes}
    type="file"
    bind:value={value}
    bind:files={files}
  />
  <button
    bind:this={buttonElement}
    style:cursor="pointer"
    style:background-color="transparent"
    style:border="3px dashed {colors.inactiveTint}"
    style:width="100%"
    onclick={handleClickEvent}
    ondragleave={handleDragLeaveEvent}
    ondragover={handleDragOverEvent}
    ondrop={handleDropEvent}
    onmouseenter={handleMouseEnterEvent}
    onmouseleave={handleMouseLeaveEvent}
  >
    <Stack
      alignment="fill"
      direction="vertical"
      distribution="fill"
      minSpacing={20}
      padding={20}
    >
      <div
        style:text-align="center"
        style:color={colors.inactiveTint}
      >
        {title}
      </div>
      <div
        style:text-align="center"
        style:font-size="50px"
        style:color={colors.inactiveTint}
        class="material-icons"
      >
        upload_file
      </div>
      <div
        style:text-align="center"
        style:color={colors.inactiveTint}
      >
        Click to choose a file or drag it here.
      </div>
      {#if isNotNullish(errorMessage)}
        <div
          style:height="1px"
          style:background-color={colors.inactiveTint}
        >
        </div>
        <div
          style:text-align="center"
          style:color={colors.destructiveTint}
        >
          {errorMessage}
        </div>
      {/if}
      {#if isNotNullish(files?.[0]?.name)}
        <div
          style:height="1px"
          style:background-color={colors.inactiveTint}
        >
        </div>
        <Stack
          alignment="center"
          direction="horizontal"
          distribution="center"
          minSpacing={5}
        >
          <div
            style:text-align="center"
            style:color={colors.text}
            class="material-icons"
          >
            description
          </div>
          <div
            style:text-align="center"
            style:color={colors.text}
          >
            {files[0].name}
          </div>
          <Button
            style="deemphasized-text"
            icon="cancel"
            isDestructive={true}
            onClick={() => { files = undefined; value = "" }}
          />
        </Stack>
      {/if}
    </Stack>
  </button>
</label>

<script lang="ts">
  import Button from "@components/buttons/Button.svelte"
  import Stack from "@components/layout/Stack.svelte"
  import { colors } from "@scripts/colors"
  import { isNotNullish } from "@shared/utils"
  
  type Props = {
    allowedFileTypes?: string
    value?: string
    files?: FileList
    title?: string
  }
  
  /* eslint-disable prefer-const */
  let {
    allowedFileTypes,
    value = $bindable(),
    files = $bindable(),
    title,
  }: Props = $props()
  /* eslint-enable prefer-const */
  
  let inputElement: HTMLElement
  let buttonElement: HTMLElement
  
  let errorMessage: string | undefined = $state(undefined)
  
  const handleDragOverEvent = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (isNotNullish(event.dataTransfer)) {
      event.dataTransfer.dropEffect = "copy"
    }
    
    updateStyle(true)
  }
  
  const handleDragLeaveEvent = () => {
    updateStyle(false)
  }
  
  const handleDropEvent = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (isNotNullish(event.dataTransfer)) {
      const allowedExtensions = allowedFileTypes?.split(",").map((value) => {
        return value.trim().replace(/^\./, "")
      }) ?? []
      
      const filteredFilesTransfer = new DataTransfer()
      
      ;[...event.dataTransfer.files].forEach((file) => {
        console.log(file)
        if (allowedExtensions.includes(file.name.split(".").toReversed()[0])) {
          filteredFilesTransfer.items.add(file)
        }
      })
      
      if (filteredFilesTransfer.files.length > 0) {
        files = filteredFilesTransfer.files
        errorMessage = undefined
      } else {
        errorMessage = "Invalid File Type"
      }
    }
  }
  
  const handleClickEvent = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    inputElement.click()
  }
  
  const handleMouseEnterEvent = () => {
    updateStyle(true)
  }
  
  const handleMouseLeaveEvent = () => {
    updateStyle(false)
  }
  
  const updateStyle = (isHovered: boolean) => {
    buttonElement.style.borderColor = isHovered ? colors.primaryTint : colors.inactiveTint
  }
</script>