import { getYAML } from "@lib/utils/yamlUtils"
import { type PresetId, presetIds } from "@shared/appData/presets"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { isString } from "@shared/utils"
import { app } from "electron"
import fs from "fs"
import path from "path"
import yaml from "yaml"

export const userDataPath = path.resolve(app.getPath("userData"), "userData")

const preferencesPath = path.resolve(userDataPath, "preferences.yml")
const settingsPath = path.resolve(userDataPath, "settings")
const previousSettingsPath = path.resolve(settingsPath, ".previousSettings.yml")

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

export const getPreviousPresetId = (): PresetId => {
  const preferences = getPreferences()
  const lastPresetId = preferences?.lastPresetId
  
  if (isString(lastPresetId) && (presetIds as readonly string[]).includes(lastPresetId)) {
    return lastPresetId as PresetId
  } else {
    return "VANILLA"
  }
}

export const setPreviousPresetId = (presetId: PresetId) => {
  const preferences = getPreferences() ?? {}
  preferences.lastPresetId = presetId
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

export const setPreviousSettings = (settings: SettingsFromAppViewModel) => {
  try {
    fs.mkdirSync(settingsPath, { recursive: true })
    fs.writeFileSync(previousSettingsPath, yaml.stringify(settings))
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

export const saveSettings = (settings: SettingsFromAppViewModel, name: string) => {
  const fileName = `${name}.yml`
  fs.mkdirSync(settingsPath, { recursive: true })
  fs.writeFileSync(path.resolve(settingsPath, fileName), yaml.stringify(settings), { flag: "wx" })
}

export const getSavedSettingsNames = () => {
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