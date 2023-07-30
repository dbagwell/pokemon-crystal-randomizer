import MainWindow from "@components/MainWindow.svelte"
import type { MainAPI } from "@mainAPI" // Only the type is allowed to be imported, the type keyword must be placed outside of the brackets.
import { RendererAPI } from "@scripts/ipc/rendererAPI"
import { bindMainApi, exposeWindowApi } from "electron-affinity/window"

const bindMainAPI = async () => {
  window.mainAPI = await bindMainApi<MainAPI>("MainAPI")
}

exposeWindowApi(new RendererAPI())
bindMainAPI()

new MainWindow({
  target: document.getElementById("mainWindow")!,
})