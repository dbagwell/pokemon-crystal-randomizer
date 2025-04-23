import { getYAML } from "@lib/utils/yamlUtils"
import type { PlayerOptions, Settings } from "@shared/appData/settingsFromViewModel"
import { isString } from "@shared/utils"
import { app } from "electron"
import fs from "fs"
import path from "path"
import yaml from "yaml"

export const userDataPath = path.resolve(app.getPath("userData"), "userData")

const preferencesPath = path.resolve(userDataPath, "preferences.yml")
const settingsPath = path.resolve(userDataPath, "settings")
const previousSettingsPath = path.resolve(settingsPath, ".previousSettings.yml")
const playerOptionsPath = path.resolve(settingsPath, ".playerOptions.yml")

export const getPreferences = (): any | undefined => {
  try {
    return getYAML([preferencesPath])
  } catch {
    return undefined
  }
}

export const setPreferences = (preferences: unknown) => {
  try {
    fs.writeFileSync(preferencesPath, yaml.stringify(preferences))
  } catch {
    // Do nothing
  }
}

export const getPreviousPresetId = (): string => {
  const preferences = getPreferences()
  const lastPresetId = preferences?.lastPresetId
  
  if (isString(lastPresetId)) {
    return lastPresetId
  } else {
    return "VANILLA"
  }
}

export const setPreviousPresetId = (presetId: string) => {
  const preferences = getPreferences() ?? {}
  preferences.lastPresetId = presetId
  setPreferences(preferences)
}

export const getLogPreference = () => {
  const preferences = getPreferences()
  return preferences?.logPreference === true
}

export const setLogPreference = (preference: boolean) => {
  const preferences = getPreferences() ?? {}
  preferences.logPreference = preference
  setPreferences(preferences)
}

export const getCreatePatchPreference = () => {
  const preferences = getPreferences()
  return preferences?.createPatch === true
}

export const setCreatePatchPreference = (preference: boolean) => {
  const preferences = getPreferences() ?? {}
  preferences.createPatch = preference
  setPreferences(preferences)
}

export const getSettingsForPresetId = (id: string): unknown | undefined => {
  if (id === "CUSTOM") {
    return getPreviousSettings()
  } else {
    try {
      const presetPath = path.resolve(__dirname, "presets", `${id}.yml`)
      const customPresetPath = path.resolve(settingsPath, `${id}.yml`)
      return getYAML([presetPath, customPresetPath])
    } catch {
      return undefined
    }
  }
}

export const getPreviousSettings = (): unknown | undefined => {
  try {
    return getYAML([previousSettingsPath])
  } catch {
    return undefined
  }
}

export const setPreviousSettings = (settings: Settings) => {
  try {
    fs.mkdirSync(settingsPath, { recursive: true })
    fs.writeFileSync(previousSettingsPath, yaml.stringify(settings))
  } catch {
    // Do nothing
  }
}

export const getPlayerOptions = (): unknown | undefined => {
  try {
    return getYAML([playerOptionsPath])
  } catch {
    return undefined
  }
}

export const setPlayerOptions = (playerOptions: PlayerOptions) => {
  try {
    fs.mkdirSync(settingsPath, { recursive: true })
    fs.writeFileSync(playerOptionsPath, yaml.stringify(playerOptions))
  } catch {
    // Do nothing
  }
}

export const getSavedSettings = (name: string) => {
  try {
    return getYAML([path.resolve(settingsPath, `${name}.yml`)])
  } catch {
    return undefined
  }
}

export const saveSettings = (settings: Settings, name: string) => {
  const fileName = `${name}.yml`
  fs.mkdirSync(settingsPath, { recursive: true })
  fs.writeFileSync(path.resolve(settingsPath, fileName), yaml.stringify(settings), { flag: "wx" })
}

export const getSavedSettingsNames = () => {
  fs.mkdirSync(settingsPath, { recursive: true })
  return fs.readdirSync(settingsPath).filter((fileName) => {
    return !fileName.startsWith(".") && fileName.endsWith(".yml")
  }).map((fileName) => {
    return fileName.replace(/\.yml$/, "")
  })
}

export const removeSavedSettings = (name: string) => {
  const fileName = `${name}.yml`
  fs.rmSync(path.resolve(settingsPath, fileName), { force: true })
}