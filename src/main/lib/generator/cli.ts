import { generateLog, generatePatch, generateROM, generatorDataFrom } from "@lib/generator/generator"
import { getPlayerOptions, getSettingsForPresetId } from "@lib/userData/userData"
import { getVanillaROM, getVanillaROMData, hasVanillaROM } from "@lib/userData/vanillaROM"
import { getYAML } from "@lib/utils/yamlUtils"
import { applyPlayerOptionsToViewModel, applySettingsToViewModel } from "@shared/appData/applySettingsToViewModel"
import { defaultPlayerOptionsViewModel } from "@shared/appData/defaultPlayerOptionsViewModel"
import { defaultSettingsViewModel } from "@shared/appData/defaultSettingsViewModel"
import { playerOptionsFromViewModel, type Settings, settingsFromViewModel } from "@shared/appData/settingsFromViewModel"
import { isNotNullish, isNullish } from "@shared/utils"
import path from "path"

export const generateFromCLI = async (args: string[]) => {
  const getBooleanArg = (name: string) => {
    return args.includes(`--${name}`)
  }
  
  const getStringArg = (name: string) => {
    const nameIndex = args.indexOf(`--${name}`)
    return nameIndex < 0 ? undefined : args[nameIndex + 1]
  }
  
  const shouldGenerateROM = getBooleanArg("rom")
  const shouldGenerateLog = getBooleanArg("log")
  const shouldGeneratePatch = getBooleanArg("patch")
  const presetId = getStringArg("preset")
  const settingsFilePath = getStringArg("settings")
  const seed = getStringArg("seed")
  const vanillaROMPath = getStringArg("inputROM")
  const outputDir = getStringArg("outputDir")
  const name = getStringArg("name")
  const force = getBooleanArg("force")
  
  let inputROMData: Buffer | undefined
  
  if (!(shouldGenerateROM || shouldGenerateLog || shouldGeneratePatch)) {
    console.error("Must specify at least one of '--rom', '--log', or '--patch' to generate.")
    return
  }
  
  if (isNotNullish(presetId) && isNotNullish(settingsFilePath)) {
    console.error("Can only specify one of '--preset' and '--settings'.")
    return
  }
  
  if (isNullish(outputDir)) {
    console.error("'--outputDir' is required.")
    return
  }
  
  if (shouldGenerateROM) {
    if (isNotNullish(vanillaROMPath)) {
      try {
        inputROMData = getVanillaROMData(vanillaROMPath)
      } catch (error) {
        console.error(`${error}`)
        return
      }
    } else if (!hasVanillaROM()) {
      console.error("Unable to find Vanilla Pokémon Crystal Version 1.1 ROM and no '--inputROM' was specified.")
      return
    } else {
      inputROMData = await getVanillaROM(false)
    }
  }
  
  let settings: Settings | undefined
  
  if (isNotNullish(presetId)) {
    settings = getSettingsForPresetId(presetId) as Settings
    
    if (isNullish(settings)) {
      console.error("Cannot find specified '--preset'.")
      return
    }
  } else if (isNotNullish(settingsFilePath)) {
    try {
      settings = getYAML([settingsFilePath])
    } catch (error) {
      console.error(`Cannot find specified '--settings'.\n\n${error}`)
      return
    }
  }
  
  const warnings: string[] = []
  const settingsViewModel = defaultSettingsViewModel()
  applySettingsToViewModel(settings, settingsViewModel, warnings)
  
  const playerOptions = getPlayerOptions()
  const playerOptionsViewModel = defaultPlayerOptionsViewModel()
  applyPlayerOptionsToViewModel(playerOptions, playerOptionsViewModel, warnings)
  
  warnings.forEach((warning) => {
    console.log(warning)
  })
  
  const generatorData = generatorDataFrom({
    customSeed: seed,
    settings: settingsFromViewModel(settingsViewModel),
  })
  
  const baseFilePath = path.resolve(outputDir, name ?? generatorData.checkValue)
  
  if (shouldGenerateROM) {
    try {
      await generateROM({
        data: generatorData,
        playerOptions: playerOptionsFromViewModel(playerOptionsViewModel),
        showInputInRenderer: false,
        defaultFileName: baseFilePath,
        inputROM: inputROMData,
        forceOverwrite: force,
        throwErrorOnWriteFailure: true,
      })
    } catch (error) {
      console.error(`${error}`)
    }
  }
  
  if (shouldGenerateLog) {
    try {
      generateLog({
        data: generatorData,
        defaultFileName: baseFilePath,
        forceOverwrite: force,
        throwErrorOnWriteFailure: true,
      })
    } catch (error) {
      console.error(`${error}`)
    }
  }
  
  if (shouldGeneratePatch) {
    try {
      generatePatch({
        data: generatorData,
        defaultFileName: baseFilePath,
        forceOverwrite: force,
        throwErrorOnWriteFailure: true,
      })
    } catch (error) {
      console.error(`${error}`)
    }
  }
}