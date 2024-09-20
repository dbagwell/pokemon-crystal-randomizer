import { generateROM } from "@lib/generator/generator"
import { rendererAPIResponseListeners } from "@lib/ipc/rendererAPIUtils"
import { getPreviousSettings, setPreviousSettings } from "@lib/userData/userData"
import { getVanillaROM } from "@lib/userData/vanillaROM"
import type { Settings } from "@shared/appData/configHelpers"
import { isNullish } from "@shared/utils"
import { dialog } from "electron"
import { type ElectronMainApi, RelayedError } from "electron-affinity/main"
import fs from "fs"

export class MainAPI implements ElectronMainApi<MainAPI> {
  
  readonly getPreviousSettings = async (): Promise<Response<any | undefined>> => {
    return getPreviousSettings()
  }
  
  readonly generateROM = async (seed: string | undefined, settings: Settings): Promise<Response<void>> => {
    try {
      const vanillaData = await getVanillaROM()
        
      if (isNullish(vanillaData)) {
        throw new Error("A Pokémon Crystal Version 1.1 ROM is required.")
      }
      
      const generatorResult = generateROM(vanillaData, seed, settings)
      
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

export type Response<Result> = Result extends void ? {
  message?: string,
} : {
  message?: string,
  result: Result,
}

export type ProcessInputRequestParams = {
  requestId: string,
  inputValue: any,
}