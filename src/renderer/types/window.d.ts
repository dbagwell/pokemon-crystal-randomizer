import type { MainAPI } from "@mainAPI"
import type { MainApiBinding } from "electron-affinity/window"

declare global {
  interface Window {
    mainAPI: MainApiBinding<MainAPI>
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>
  }
}