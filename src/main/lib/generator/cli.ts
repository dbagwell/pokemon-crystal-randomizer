import { generate } from "@lib/generator/generator"
import { getPlayerOptions, getSettingsForPresetId } from "@lib/userData/userData"
import { getVanillaROM, getVanillaROMData, hasVanillaROM } from "@lib/userData/vanillaROM"
import { applyPlayerOptionsToViewModel, applySettingsToViewModel } from "@shared/appData/applySettingsToViewModel"
import { defaultPlayerOptionsViewModel } from "@shared/appData/defaultPlayerOptionsViewModel"
import { defaultSettingsViewModel } from "@shared/appData/defaultSettingsViewModel"
import { playerOptionsFromViewModel, type Settings, settingsFromViewModel } from "@shared/appData/settingsFromViewModel"
import { isNotNullish, isNullish } from "@shared/utils"
import { getYAML } from "@yamlUtils/yamlUtils"
import { app } from "electron"

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
  const validatedSettings = settingsFromViewModel(settingsViewModel)
  
  const playerOptions = getPlayerOptions()
  const playerOptionsViewModel = defaultPlayerOptionsViewModel()
  applyPlayerOptionsToViewModel(playerOptions, playerOptionsViewModel, warnings)
  const validatedPlayerOptions = playerOptionsFromViewModel(playerOptionsViewModel)
  
  warnings.forEach((warning) => {
    console.log(warning)
  })
  
  try {
    await generate({
      generateParams: {
        appVersion: app.getVersion(),
        seed: seed,
        settings: validatedSettings,
        playerOptions: validatedPlayerOptions,
        inputROM: inputROMData,
        shouldCreateROM: shouldGenerateROM,
        shouldCreateLog: shouldGenerateLog,
        shouldCreatePatch: shouldGeneratePatch,
      },
      outputDirPath: outputDir,
      defaultFileName: name,
      forceOverwrite: force,
      throwErrorOnWriteFailure: true,
    })
  } catch (error) {
    console.error(`${error}`)
  }
}