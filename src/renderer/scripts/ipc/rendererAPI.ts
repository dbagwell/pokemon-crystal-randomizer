import { showDialog } from "@components/dialogs/DialogContainer.svelte"
import type { ElectronWindowApi } from "electron-affinity/window"

export class RendererAPI implements ElectronWindowApi<RendererAPI> {
  
  readonly showInputDialog = async (params: {
    requestId: string,
    title: string,
    message: string,
    inputInfo: DialogInputInfo,
    submitButtonLabel: string,
  }): Promise<void> => {
    showDialog({
      ...params,
      hasCancelButton: true,
      onCancel: () => {
        window.mainAPI.processInput({
          requestId: params.requestId,
          inputValue: undefined,
        })
      },
      onSubmit: (inputValue) => {
        window.mainAPI.processInput({
          requestId: params.requestId,
          inputValue: inputValue,
        })
      },
    })
  }
  
}