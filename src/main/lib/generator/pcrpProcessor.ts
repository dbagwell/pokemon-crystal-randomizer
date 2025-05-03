import { generateROM, generatorDataFrom } from "@lib/generator/generator"
import { getPlayerOptions, listenForPlayerOptions } from "@lib/userData/userData"
import { applyPlayerOptionsToViewModel, applySettingsToViewModel } from "@shared/appData/applySettingsToViewModel"
import { defaultPlayerOptionsViewModel } from "@shared/appData/defaultPlayerOptionsViewModel"
import { defaultSettingsViewModel } from "@shared/appData/defaultSettingsViewModel"
import { playerOptionsFromViewModel, type Settings, settingsFromViewModel } from "@shared/appData/settingsFromViewModel"
import { isNullish, isObject, isString } from "@shared/utils"
import { app, shell } from "electron"
import fs from "fs"
import { compressToUint8Array, decompressFromUint8Array } from "lz-string"
import path from "path"
import yaml from "yaml"

import { showWindow } from "../../windowManager"

export const createPCRP = (params: {
  seed: string,
  settings: Settings,
}) => {
  const {
    seed,
    settings,
  } = params
  
  const info = {
    version: app.getVersion(),
    seed: seed,
    settings: settings,
  }
  
  const infoString = yaml.stringify(info)
  return compressToUint8Array(infoString)
}

export const handlePCRPFile = async (filePath: string) => {
  try {
    const data = fs.readFileSync(filePath)
    const infoString = decompressFromUint8Array(data)
    const info = yaml.parse(infoString)
    
    if (!isObject(info) || !isString(info.version) || !isString(info.seed)) {
      throw new Error(`Unable to decode file '${filePath}' because it is in an incorrect format.`)
    }
    
    if (info.version !== app.getVersion()) {
      throw new Error(`Unable to patch ROM. Patch file '${filePath}' was created using a different version of Pokémon Crystal Randomizer, use that version instead.\n`
        + `Current Version: ${app.getVersion()}\nPatch Version: ${info.version}`)
    }
    
    const settingsViewModel = defaultSettingsViewModel()
    const warnings: string[] = []
    applySettingsToViewModel(info.settings, settingsViewModel, warnings)
    
    if (warnings.length > 0) {
      throw new Error(`Unable to patch ROM. Found one or more issues with settings decoded from the patch file '${filePath}'.`)
    }
    
    let playerOptions = getPlayerOptions()
    const playerOptionsViewModel = defaultPlayerOptionsViewModel()
    
    if (isNullish(playerOptions)) {
      const window = await showWindow({
        windowType: "PLAYER_OPTIONS",
        width: 350,
        height: 700,
      })
      
      let isWindowClosed = false
      
      const forceCloseWindow = async () => {
        if (!isWindowClosed) {
          // Close the window
          // window.close() doesn't work for some reason, so we use window.destroy() instead
          // window.destroy() has a delay, so we hide the window first
          // window.hide() also has a delay unless we listen and wait for the hide event
          
          const hidePromise = new Promise<void>((resolve) => {
            window.once("hide", async () => {
              resolve()
            })
          })
          
          window.hide()
          await hidePromise
          window.destroy()
        }
      }
      
      window.once("close", () => {
        // For some reason, when the window is closed with a keyboard shortcut, there is a delay before it disappears
        // so when we get the notification that it's about to close, we do our workaround to hide and force close it
        forceCloseWindow()
      })
      
      const closedPromise = new Promise((resolve) => {
        window.once("closed", async () => {
          isWindowClosed = true
          
          // For some reason, the window hasn't fully closed yet, and without this delay there is undefined behaviour that can lead to the app crashing
          setTimeout(() => {
            resolve(undefined)
          }, 1)
        })
      })
      
      const playerOptionsPromise = listenForPlayerOptions()
      
      playerOptions = await Promise.race([
        closedPromise, // The user closed the window without saving, just use the default player options.
        playerOptionsPromise, // Use the new playerOptions set by the user.
      ])
      
      await forceCloseWindow()
    }
    
    applyPlayerOptionsToViewModel(playerOptions, playerOptionsViewModel, [])
    
    const generatorData = generatorDataFrom({
      customSeed: info.seed,
      settings: settingsFromViewModel(settingsViewModel),
    })
    
    const filePathInfo = await generateROM({
      data: generatorData,
      playerOptions: playerOptionsFromViewModel(playerOptionsViewModel),
      showInputInRenderer: false,
      defaultFileName: filePath.replace(new RegExp(`${path.basename(filePath)}$`), path.basename(filePath, ".pcrp")),
    })
    
    shell.openPath(filePathInfo.full)
  } catch (error) {
    throw new Error(`Error patching ROM:\n\n${error}`)
  }
}