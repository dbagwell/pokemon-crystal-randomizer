import "material-icons/iconfont/material-icons.css"

import AppView from "@components/AppView.svelte"
import type { MainAPI } from "@mainAPI" // Only the type is allowed to be imported, the type keyword must be placed outside of the brackets.
import { updateColors } from "@scripts/colors"
import { RendererAPI } from "@scripts/ipc/rendererAPI"
import { bindMainApi, exposeWindowApi } from "electron-affinity/window"
import { mount } from "svelte"

const init = async () => {
  exposeWindowApi(new RendererAPI())
  window.mainAPI = await bindMainApi<MainAPI>("MainAPI")
  
  updateColors()
  
  const initialAppData = (await window.mainAPI.getInitialAppData()).result
  
  mount(AppView, {
    target: document.getElementById("mainWindow")!,
    props: {
      appVersion: initialAppData.appVersion,
      lastSelectedPresetId: initialAppData.presetId,
      lastSelectedSettings: initialAppData.settings,
      lastSelectedPlayerOptions: initialAppData.playerOptions,
      customPresetNames: initialAppData.customPresetNames,
      logPreference: initialAppData.logPreference,
      createPatchPreference: initialAppData.createPatchPreference,
    },
  })
}

init()