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
  style:box-shadow="5px 5px 5px #00000070"
  style:border-radius="20px"
  style:top="50%"
  style:left="50%"
  style:max-width="95vw"
  style:max-height="95vh"
  style:transform="translate(-50%, -50%)"
  style:z-index={zIndexes.dialogLayer}
>
  <DialogContent {...contentProps}/>
</div>

<script lang="ts">
  import DialogContent from "@components/dialogs/DialogContent.svelte"
  import { zIndexes } from "@scripts/constants"
  import type { DialogInputInfo } from "@shared/types/dialog"
  import type { Snippet } from "svelte"
  
  type Props = {
    title?: string
    message?: string
    extraContent?: Snippet<[{ getInput?: () => any }]>
    inputInfo?: DialogInputInfo
    hasCancelButton?: boolean
    submitButtonLabel?: string
    onCancel?: () => void
    onSubmit?: (inputValue: any) => void
    onDismiss: () => void
  }
  
  const props: Props = $props()
  
  const {
    onCancel,
    onSubmit,
    onDismiss,
  } = props
  
  const contentProps = $derived({
    ...props,
    onCancel: () => {
      cancelButtonClicked()
    },
    onSubmit: (inputValue: any) => {
      onSubmit?.(inputValue)
      open = false
    },
  })
  
  let open = $state(true)
  
  const cancelButtonClicked = () => {
    onCancel?.()
    open = false
  }
  
  $effect(() => { open; openListener() })
  const openListener = () => {
    if (!open) {
      onDismiss()
    }
  }
  
</script>