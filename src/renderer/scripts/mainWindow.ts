import "material-icons/iconfont/material-icons.css"

import MainWindow from "@components/MainWindow.svelte"
import type { MainAPI } from "@mainAPI" // Only the type is allowed to be imported, the type keyword must be placed outside of the brackets.
import { RendererAPI } from "@scripts/ipc/rendererAPI"
import { bindMainApi, exposeWindowApi } from "electron-affinity/window"

const init = async () => {
  exposeWindowApi(new RendererAPI())
  window.mainAPI = await bindMainApi<MainAPI>("MainAPI")
  
  new MainWindow({
    target: document.getElementById("mainWindow")!,
    props: {
      initialSettings: await window.mainAPI.getPreviousSettings(),
    },
  })
}

init()