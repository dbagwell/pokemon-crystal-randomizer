import { generateROM } from "@lib/generator/generator"
import { createPCRP } from "@lib/generator/pcrpProcessor"
import { rendererAPIResponseListeners } from "@lib/ipc/rendererAPIUtils"
import { getCreatePatchPreference, getLogPreference, getPreviousPlayerOptions, getPreviousPresetId, getSavedSettings, getSavedSettingsNames, getSettingsForPresetId, removeSavedSettings, saveSettings, setCreatePatchPreference, setLogPreference, setPreviousPlayerOptions, setPreviousPresetId, setPreviousSettings } from "@lib/userData/userData"
import { attemptWriteFile } from "@lib/utils/dialogUtils"
import type { PlayerOptions, Settings } from "@shared/appData/settingsFromViewModel"
import { isNotNullish, isNullish } from "@shared/utils"
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
  
  readonly getInitialAppData = async (): Promise<APIResponse<{
    appVersion: string,
    presetId: string,
    settings: unknown | undefined
    playerOptions: unknown | undefined
    customPresetNames: string[]
    logPreference: boolean
    createPatchPreference: boolean
  }>> => {
    const lastPrestId = getPreviousPresetId()
    
    return {
      result: {
        appVersion: app.getVersion(),
        presetId: lastPrestId,
        settings: getSettingsForPresetId(lastPrestId),
        playerOptions: getPreviousPlayerOptions(),
        customPresetNames: getSavedSettingsNames(),
        logPreference: getLogPreference(),
        createPatchPreference: getCreatePatchPreference(),
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
    presetId: string,
    generateLog: boolean,
    createPatch: boolean,
  ): Promise<VoidAPIResponse> => {
    try {
      const generatorResult = await generateROM({
        customSeed: seed,
        settings: settings,
        playerOptions: playerOptions,
        showInputInRenderer: true,
        generateLog: generateLog,
      })
      
      setPreviousSettings(settings)
      setPreviousPresetId(presetId)
      setPreviousPlayerOptions(playerOptions)
      setLogPreference(generateLog)
      setCreatePatchPreference(createPatch)
      
      if (generateLog && isNotNullish(generatorResult.log)) {
        attemptWriteFile({
          dialogTitle: "Save log to:",
          fileType: "text",
          defaultFilePath: generatorResult.outputFilePath.replace(/\.gbc$/, ".log.txt"),
          data: generatorResult.log,
        })
      }
      
      if (createPatch) {
        const pcrpData = createPCRP({
          seed: generatorResult.seed,
          settings: settings,
        })
          
        attemptWriteFile({
          dialogTitle: "Save patch to:",
          fileType: "pcrp",
          defaultFilePath: generatorResult.outputFilePath.replace(/\.gbc$/, ".pcrp"),
          data: pcrpData,
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