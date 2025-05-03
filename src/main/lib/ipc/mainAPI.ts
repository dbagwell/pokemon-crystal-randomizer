import { generateLog, generatePatch, generateROM, generatorDataFrom } from "@lib/generator/generator"
import { rendererAPIResponseListeners } from "@lib/ipc/rendererAPIUtils"
import { getPreference, setPreference } from "@lib/userData/preferences"
import { getPlayerOptions, getSavedSettings, getSavedSettingsNames, getSettingsForPresetId, removeSavedSettings, saveSettings, setPlayerOptions, setPreviousSettings } from "@lib/userData/userData"
import type { PlayerOptions, Settings } from "@shared/appData/settingsFromViewModel"
import { isNullish } from "@shared/utils"
import { app, dialog } from "electron"
import { type ElectronMainApi, RelayedError } from "electron-affinity/main"
import fs from "fs"
import yaml from "yaml"

export class MainAPI implements ElectronMainApi<MainAPI> {
  
  readonly getPresetSettings = async (presetId: string): Promise<APIResponse<unknown | undefined>> => {
    return {
      result: getSettingsForPresetId(presetId),
    }
  }
  
  readonly getPlayerOptions = async (): Promise<APIResponse<unknown | undefined>> => {
    return {
      result: getPlayerOptions(),
    }
  }
  
  readonly getInitialAppData = async (): Promise<APIResponse<{
    appVersion: string,
    presetId: string,
    settings: unknown | undefined
    playerOptions: unknown | undefined
    customPresetNames: string[]
    logPreference: boolean
    createPatchPreference: boolean
  }>> => {
    const lastPrestId = getPreference("lastPresetId")
    
    return {
      result: {
        appVersion: app.getVersion(),
        presetId: lastPrestId,
        settings: getSettingsForPresetId(lastPrestId),
        playerOptions: getPlayerOptions(),
        customPresetNames: getSavedSettingsNames(),
        logPreference: getPreference("logPreference"),
        createPatchPreference: getPreference("createPatch"),
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
  
  readonly savePlayerOptions = async (playerOptions: PlayerOptions): Promise<VoidAPIResponse> => {
    setPlayerOptions(playerOptions)
    return {}
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
    presetId: string,
    shouldGenerateLog: boolean,
    createPatch: boolean,
  ): Promise<VoidAPIResponse> => {
    try {
      setPreviousSettings(settings)
      setPreference("lastPresetId", presetId)
      setPlayerOptions(playerOptions)
      setPreference("logPreference", shouldGenerateLog)
      setPreference("createPatch", createPatch)
      
      const data = generatorDataFrom({
        customSeed: seed,
        settings: settings,
      })
      
      const filePathInfo = await generateROM({
        data: data,
        playerOptions: playerOptions,
        showInputInRenderer: true,
      })
      
      if (shouldGenerateLog) {
        generateLog({
          data: data,
          defaultFileName: filePathInfo.withoutExtension,
        })
      }
      
      if (createPatch) {
        generatePatch({
          data: data,
          defaultFileName: filePathInfo.withoutExtension,
        })
      }
      
      return {
        message: "ROM Generated!",
      }
    } catch (error: any) {
      console.log(error.stack)
      throw new RelayedError(`${error}`)
    }
  }
  
  readonly exportSettings = async (settings: Settings): Promise<VoidAPIResponse> => {
    try {
      const filePath = dialog.showSaveDialogSync({
        title: "Save Exported Settings to:",
        defaultPath: undefined,
        filters: [
          {
            name: "YAML",
            extensions: [
              "yml",
              "yaml",
            ],
          },
        ],
        buttonLabel: "Export",
        properties: [
          "showOverwriteConfirmation",
        ],
      })
        
      if (isNullish(filePath)) {
        throw new Error("A save location must be specified.")
      }
      
      const exportedSettings = `VERSION: "${app.getVersion()}"\n${yaml.stringify(settings)}`
      
      fs.writeFileSync(filePath, exportedSettings)
      
      return {
        message: "Settings exported!",
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