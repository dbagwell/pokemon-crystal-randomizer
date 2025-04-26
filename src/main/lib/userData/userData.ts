import { getYAML } from "@lib/utils/yamlUtils"
import type { PlayerOptions, Settings } from "@shared/appData/settingsFromViewModel"
import { isString } from "@shared/utils"
import crypto from "crypto"
import { app } from "electron"
import fs from "fs"
import path from "path"
import yaml from "yaml"

export const userDataPath = path.resolve(app.getPath("userData"), "userData")

const preferencesPath = path.resolve(userDataPath, "preferences.yml")
const settingsPath = path.resolve(userDataPath, "settings")
const previousSettingsPath = path.resolve(settingsPath, ".previousSettings.yml")
const playerOptionsPath = path.resolve(settingsPath, ".playerOptions.yml")

// Preferences

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

// Log Preference

export const getLogPreference = () => {
  const preferences = getPreferences()
  return preferences?.logPreference === true
}

export const setLogPreference = (preference: boolean) => {
  const preferences = getPreferences() ?? {}
  preferences.logPreference = preference
  setPreferences(preferences)
}

// Create Patch Preference

export const getCreatePatchPreference = () => {
  const preferences = getPreferences()
  return preferences?.createPatch === true
}

export const setCreatePatchPreference = (preference: boolean) => {
  const preferences = getPreferences() ?? {}
  preferences.createPatch = preference
  setPreferences(preferences)
}

// Preset Ids

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

// Previous Settings

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

// Player Options

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
  } finally {
    Object.values(playerOptionsListeners).forEach((listener) => {
      listener(playerOptions)
    })
  }
}

export const playerOptionsListeners: Dictionary<(playerOptions: PlayerOptions) => void> = {}

export const listenForPlayerOptions = async (): Promise<PlayerOptions> => {
  return await new Promise<PlayerOptions>((resolve) => {
    const listenerId = crypto.randomUUID()
    
    playerOptionsListeners[listenerId] = (playerOptions: PlayerOptions) => {
      resolve(playerOptions)
      delete playerOptionsListeners[listenerId]
    }
  })
}

// Saved Settings

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

// Updates

export const getIgnoredUpdateVersions = (): string[] => {
  return getPreferences()?.ignoredUpdateVersions
}

export const ignoreUpdateVersion = (version: string) => {
  const preferences = getPreferences()
  preferences.ignoredUpdateVersions = [
    ...preferences.ignoredUpdateVersions ?? [],
    version,
  ]
  
  setPreferences(preferences)
}