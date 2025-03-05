<label style:cursor="pointer">
  <input
    style:position="absolute"
    style:width="0"
    style:height="0"
    accept={allowedFileTypes}
    type="file"
    bind:value={value}
    bind:files={files}
  />
  <button
    style:border="3px dashed {colors.inactiveTint}"
    style:width="100%"
    ondragover={handleDragOverEvent}
    ondrop={handleDropEvent}
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
            style="icon"
            isDestructive={true}
            onClick={() => { files = undefined; value = "" }}
            title="cancel"
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
  
  const handleDragOverEvent = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (isNotNullish(event.dataTransfer)) {
      event.dataTransfer.dropEffect = "copy"
    }
  }
  
  const handleDropEvent = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (isNotNullish(event.dataTransfer)) {
      files = event.dataTransfer.files
    }
  }
</script>