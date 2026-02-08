import type { DialogInputInfo } from "@shared/types/dialog"

export interface RendererAPIInterface {
  
  showInputDialog(params: {
    requestId: string,
    title: string,
    message: string,
    inputInfo: DialogInputInfo,
    submitButtonLabel: string,
  }): Promise<void>
  
  setReleaseNotes(params: {
    requestId: string,
    releaseNotes: { version: string, note: string | null }[],
    currentVersionNumber: string,
    newVersionNumber: string,
  }): Promise<void>
  
}