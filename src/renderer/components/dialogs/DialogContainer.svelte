{#each dialogs as dialog (dialog.id)}

  <Dialog
    extraContent={dialog.params.extraContent}
    hasCancelButton={dialog.params.hasCancelButton}
    inputInfo={dialog.params.inputInfo}
    message={dialog.params.message}
    onCancel={() => {
      dialog.params.onCancel?.()
    }}
    onDismiss={() => {
      removeDialog(dialog.id)
    }}
    onSubmit={(inputValue) => {
      dialog.params.onSubmit?.(inputValue)
    }}
    submitButtonLabel={dialog.params.submitButtonLabel}
    title={dialog.params.title}
  />
  
{/each}

<script lang="ts">
  import Dialog from "@components/dialogs/Dialog.svelte"
  
  let dialogs: { id: string, params: ShowDialogParams }[] = []
  
  showDialog = (params: ShowDialogParams) => {
    dialogs.push({
      id: crypto.randomUUID(),
      params: params,
    })
    
    dialogs = dialogs
  }
  
  const removeDialog = (id: string) => {
    const index = dialogs.findIndex((value) => {
      return value.id === id
    })
    
    dialogs.splice(index, 1)
    dialogs = dialogs
  }
  
</script>

<script
  lang="ts"
  module
>
  import type { DialogInputInfo } from "@shared/types/dialog"
  import type { Snippet } from "svelte"

  type ShowDialogParams = {
    title?: string,
    message?: string,
    extraContent?: Snippet<[{ getInput?: () => any }]>,
    inputInfo?: DialogInputInfo,
    submitButtonLabel?: string,
    hasCancelButton?: boolean,
    onCancel?: () => void,
    onSubmit?: (inputValue: any) => void,
  }
  
  export let showDialog: (params: ShowDialogParams) => void
  
  export const showSuccessDialog = (message?: string) => {
    showDialog({
      title: "Success",
      message: message,
      submitButtonLabel: "OK",
    })
  }
  
  export const showErrorDialog = (error: unknown) => {
    showDialog({
      title: "Error",
      message: `${error}`,
      submitButtonLabel: "OK",
    })
    
    console.error(error)
  }

</script>