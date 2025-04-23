import { generateROM } from "@lib/generator/generator"
import { getPlayerOptions } from "@lib/userData/userData"
import { applyPlayerOptionsToViewModel, applySettingsToViewModel } from "@shared/appData/applySettingsToViewModel"
import { defaultPlayerOptionsViewModel } from "@shared/appData/defaultPlayerOptionsViewModel"
import { defaultSettingsViewModel } from "@shared/appData/defaultSettingsViewModel"
import { playerOptionsFromViewModel, type Settings, settingsFromViewModel } from "@shared/appData/settingsFromViewModel"
import { isObject, isString } from "@shared/utils"
import { app, shell } from "electron"
import fs from "fs"
import { compressToUint8Array, decompressFromUint8Array } from "lz-string"
import path from "path"
import yaml from "yaml"

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
    
    const playerOptions = getPlayerOptions()
    const playerOptionsViewModel = defaultPlayerOptionsViewModel()
    applyPlayerOptionsToViewModel(playerOptions, playerOptionsViewModel, [])
    
    const generatorResult = await generateROM({
      customSeed: info.seed,
      settings: settingsFromViewModel(settingsViewModel),
      playerOptions: playerOptionsFromViewModel(playerOptionsViewModel),
      showInputInRenderer: false,
      defaultFileName: filePath.replace(new RegExp(`${path.basename(filePath)}$`), path.basename(filePath, ".pcrp")) + ".gbc",
      generateLog: false,
    })
    
    shell.openPath(generatorResult.outputFilePath)
  } catch (error) {
    throw new Error(`Error patching ROM:\n\n${error}`)
  }
}