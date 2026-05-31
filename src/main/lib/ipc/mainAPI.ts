import { generate } from "@lib/generator/generator"
import { rendererAPIResponseListeners } from "@lib/ipc/rendererAPIUtils"
import { getPreference, setPreference } from "@lib/userData/preferences"
import { getPlayerOptions, getSavedSettings, getSavedSettingsNames, getSettingsForPresetId, removeSavedSettings, saveSettings, setPlayerOptions, setPreviousSettings } from "@lib/userData/userData"
import { getVanillaROM } from "@lib/userData/vanillaROM"
import { type NameListId, nameListIds, nameLists } from "@shared/appData/nameListIds"
import { type PlayerOptions, type Settings } from "@shared/appData/settingsFromViewModel"
import type { MainAPIInterface } from "@shared/types/ipc/mainAPIInterface"
import { isNotNullish, isNullish, numberFrom } from "@shared/utils"
import { app, dialog } from "electron"
import { type ElectronMainApi, RelayedError } from "electron-affinity/main"
import fs from "fs"
import yaml from "yaml"

export class MainAPI implements ElectronMainApi<MainAPI>, MainAPIInterface {
  
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
      if (error.message.includes("EEXIST") as boolean) {
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
      
      const vanillaROM = await getVanillaROM(true)
      
      await generate({
        generateParams: {
          appVersion: app.getVersion(),
          seed: seed,
          settings: settings,
          playerOptions: playerOptions,
          inputROM: vanillaROM,
          shouldCreateROM: true,
          shouldCreateLog: shouldGenerateLog,
          shouldCreatePatch: createPatch,
        },
        forceOverwrite: false,
        throwErrorOnWriteFailure: false,
      })
      
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
  
  readonly importCustomNames = async (): Promise<APIResponse<Partial<Record<NameListId, string>>>> => {
    try {
      const filePath = dialog.showOpenDialogSync({
        title: "Import Custom Names from:",
        filters: [
          {
            name: "text",
            extensions: [
              "txt",
              "rncn",
            ],
          },
        ],
        buttonLabel: "Import",

      })
        
      if (isNullish(filePath)) {
        throw new Error("No file selected.")
      }
      
      const fileData = fs.readFileSync(filePath[0])
      const importedLists: Partial<Record<NameListId, string>> = {}
      
      if (isNotNullish(filePath[0].match(/.rncn$/))) {
        let currentIndex = 1
        nameLists.toSorted((a, b) => {
          return a.rncnSortOrder - b.rncnSortOrder
        }).forEach((list) => {
          if (currentIndex >= fileData.length) {
            return
          }
          
          const size = numberFrom([...fileData.subarray(currentIndex, currentIndex + 4)], true)
          currentIndex += 4
          const listData = fileData.subarray(currentIndex, currentIndex + size)
          currentIndex += size
          
          importedLists[list.id] = listData.toString().replaceAll("\r\n", "\n")
        })
      } else {
        const fileText = fileData.toString().replaceAll(/\n\n+/g, "\n")
        nameListIds.forEach((id) => {
          importedLists[id] = fileText.match(`##### ${id} #####\n([\\s\\S]*?)(\n?#####|$)`)?.[1]
        })
      }
      
      return {
        result: importedLists,
      }
    } catch (error: any) {
      console.log(error.stack)
      throw new RelayedError(`${error}`)
    }
  }
  
  readonly exportCustomNames = async (lists: Partial<Record<NameListId, string>>): Promise<VoidAPIResponse> => {
    try {
      const filePath = dialog.showSaveDialogSync({
        title: "Save Exported Names to:",
        defaultPath: "names.txt",
        filters: [
          {
            name: "text",
            extensions: [
              "txt",
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
      
      const text = Object.entries(lists).flatMap(([id, names]) => {
        return [
          `##### ${id} #####`,
          names ?? "",
        ]
      }).join("\n\n")
      
      fs.writeFileSync(filePath, text)
      
      return {
        message: "Names exported!",
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
  
  readonly processReleaseNotesResponse = async (params: ProcessReleaseNotesRequestParams): Promise<void> => {
    rendererAPIResponseListeners[params.requestId]?.(params.selectedAction)
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

export type ProcessReleaseNotesRequestParams = {
  requestId: string,
  selectedAction: "UPDATE" | "IGNORE" | "SKIP",
}