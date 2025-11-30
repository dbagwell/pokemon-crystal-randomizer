import "material-icons/iconfont/material-icons.css"

import AppView from "@components/AppView.svelte"
import PlayerOptionsWindow from "@components/PlayerOptionsWindow.svelte"
import ReleaseNotesWindow from "@components/ReleaseNotesWindow.svelte"
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
  const containerDiv = document.getElementById("contentContainer")!
  
  containerDiv.style.width = "100vw"
  containerDiv.style.height = "100vh"
  containerDiv.style.maxWidth = "100vw"
  containerDiv.style.maxHeight = "100vh"
  
  switch (windowType) {
  case "GENERATOR": {
    const initialAppData = (await window.mainAPI.getInitialAppData()).result
    document.title = `Pokémon Crystal Randomizer ${initialAppData.appVersion}`
    
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
    document.title = "Player Options"
    
    mount(PlayerOptionsWindow, {
      target: containerDiv,
      props: {
        initialPlayerOptions: (await window.mainAPI.getPlayerOptions()).result,
      },
    })
    
    break
  }
  case "RELEASE_NOTES": {
    document.title = "Auto Update"
    mount(ReleaseNotesWindow, {
      target: containerDiv,
    })
    break
  }
  }
}

init()