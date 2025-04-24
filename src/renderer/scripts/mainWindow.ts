import "material-icons/iconfont/material-icons.css"

import AppView from "@components/AppView.svelte"
import PlayerOptionsWindow from "@components/PlayerOptionsWindow.svelte"
import type { MainAPI } from "@mainAPI" // Only the type is allowed to be imported, the type keyword must be placed outside of the brackets.
import { updateColors } from "@scripts/colors"
import { RendererAPI } from "@scripts/ipc/rendererAPI"
import type { WindowType } from "@shared/appData/windowTypes"
import { bindMainApi, exposeWindowApi } from "electron-affinity/window"
import { mount } from "svelte"

const init = async () => {
  exposeWindowApi(new RendererAPI())
  window.mainAPI = await bindMainApi<MainAPI>("MainAPI")
  
  updateColors()
  
  const windowType = new URLSearchParams(window.location.search).get("windowType") as WindowType
  const containerDiv = document.getElementById("mainWindow")!
  
  containerDiv.style.width = "100vw"
  containerDiv.style.height = "100vh"
  containerDiv.style.maxWidth = "100vw"
  containerDiv.style.maxHeight = "100vh"
  
  switch (windowType) {
  case "GENERATOR": {
    const initialAppData = (await window.mainAPI.getInitialAppData()).result
    
    mount(AppView, {
      target: containerDiv,
      props: {
        appVersion: initialAppData.appVersion,
        lastSelectedPresetId: initialAppData.presetId,
        lastSelectedSettings: initialAppData.settings,
        initialPlayerOptions: initialAppData.playerOptions,
        customPresetNames: initialAppData.customPresetNames,
        logPreference: initialAppData.logPreference,
        createPatchPreference: initialAppData.createPatchPreference,
      },
    })
      
    break
  }
  case "PLAYER_OPTIONS": {
    mount(PlayerOptionsWindow, {
      target: containerDiv,
      props: {
        initialPlayerOptions: (await window.mainAPI.getPlayerOptions()).result,
      },
    })
  }
  }
}

init()