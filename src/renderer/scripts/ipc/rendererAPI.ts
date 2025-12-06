import { showDialog } from "@components/dialogs/DialogContainer.svelte"
import { setReleaseNotes } from "@components/ReleaseNotesWindow.svelte"
import type { DialogInputInfo } from "@shared/types/dialog"
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
  
  readonly setReleaseNotes = async (params: {
    requestId: string,
    releaseNotes: string,
    currentVersionNumber: string,
    newVersionNumber: string,
  }): Promise<void> => {
    setReleaseNotes(
      params.releaseNotes,
      params.currentVersionNumber,
      params.newVersionNumber,
      (selectedAction) => {
        window.mainAPI.processReleaseNotesResponse({
          requestId: params.requestId,
          selectedAction: selectedAction,
        })
      },
    )
  }
  
}