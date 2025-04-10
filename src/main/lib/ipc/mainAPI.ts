import { generateROM } from "@lib/generator/generator"
import { rendererAPIResponseListeners } from "@lib/ipc/rendererAPIUtils"
import { getPreviousPlayerOptions, getPreviousPresetId, getSavedSettings, getSavedSettingsNames, getSettingsForPresetId, removeSavedSettings, saveSettings, setPreviousPlayerOptions, setPreviousPresetId, setPreviousSettings } from "@lib/userData/userData"
import { getVanillaROM } from "@lib/userData/vanillaROM"
import { type PresetId } from "@shared/appData/presets"
import type { PlayerOptions, Settings } from "@shared/appData/settingsFromViewModel"
import { isNullish } from "@shared/utils"
import { dialog } from "electron"
import { type ElectronMainApi, RelayedError } from "electron-affinity/main"
import fs from "fs"
import yaml from "yaml"

export class MainAPI implements ElectronMainApi<MainAPI> {
  
  readonly getPresetSettings = async (presetId: string): Promise<APIResponse<unknown | undefined>> => {
    return {
      result: getSettingsForPresetId(presetId),
    }
  }
  
  readonly getInitialAppData = async (): Promise<APIResponse<{
    presetId: PresetId,
    settings: unknown | undefined
    playerOptions: unknown | undefined
    customPresetNames: string[]
  }>> => {
    const lastPrestId = getPreviousPresetId()
    
    return {
      result: {
        presetId: lastPrestId,
        settings: getSettingsForPresetId(lastPrestId),
        playerOptions: getPreviousPlayerOptions(),
        customPresetNames: getSavedSettingsNames(),
      },
    }
  }
  
  readonly saveSettings = async (settings: Settings, name: string): Promise<VoidAPIResponse> => {
    try {
      saveSettings(settings, name)
      return {
        message: `Preset '${name}' created.`,
      }
    } catch (error: any) {
      console.log(error.stack)
      if (error.message.includes("EEXIST")) {
        throw new RelayedError(`Preset name '${name}' already exists.`)
      } else {
        throw new RelayedError(`${error}`)
      }
    }
  }
  
  readonly getSavedSettings = async (name: string): Promise<APIResponse<unknown | undefined>> => {
    return {
      result: getSavedSettings(name),
    }
  }
  
  readonly removeSavedSettings = async (name: string): Promise<VoidAPIResponse> => {
    try {
      removeSavedSettings(name)
      return {
        message: `Preset '${name}' removed.`,
      }
    } catch (error: any) {
      console.log(error.stack)
      throw new RelayedError(`${error}`)
    }
  }
  
  readonly generateROM = async (
    seed: string | undefined,
    settings: Settings,
    playerOptions: PlayerOptions,
    presetId: PresetId
  ): Promise<VoidAPIResponse> => {
    try {
      const vanillaData = await getVanillaROM()
        
      if (isNullish(vanillaData)) {
        throw new Error("A Pokémon Crystal Version 1.1 ROM is required.")
      }
      
      const generatorResult = generateROM(vanillaData, seed, settings, playerOptions)
      
      const filePath = dialog.showSaveDialogSync({
        title: "Save Generated ROM to:",
        defaultPath: undefined,
        filters: [
          {
            name: "Game Boy Colour ROM",
            extensions: [
              ".gbc",
            ],
          },
        ],
        buttonLabel: "Generate",
        properties: [
          "showOverwriteConfirmation",
        ],
      })
      
      if (isNullish(filePath)) {
        throw new Error("A save location must be specified.")
      }
      
      fs.writeFileSync(filePath, generatorResult.data)
      
      setPreviousSettings(settings)
      setPreviousPresetId(presetId)
      setPreviousPlayerOptions(playerOptions)
      
      return {
        message: "ROM Generated!",
      }
    } catch (error: any) {
      console.log(error.stack)
      throw new RelayedError(`${error}`)
    }
  }
  
  readonly processInput = async (params: ProcessInputRequestParams): Promise<void> => {
    rendererAPIResponseListeners[params.requestId]?.(params.inputValue)
    delete rendererAPIResponseListeners[params.requestId]
  }
  
}

export type VoidAPIResponse = {
  message?: string,
}

export type APIResponse<Result> = {
  message?: string,
  result: Result,
}

export type ProcessInputRequestParams = {
  requestId: string,
  inputValue: any,
}