import type { MainAPIInterface } from "@shared/types/ipc/mainAPIInterface"
import type { MainApiBinding } from "electron-affinity/window"

declare global {
  interface Window {
    mainAPI: MainApiBinding<MainAPIInterface>
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>
  }
}