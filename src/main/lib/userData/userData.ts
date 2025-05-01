import { getYAML } from "@lib/utils/yamlUtils"
import type { PlayerOptions, Settings } from "@shared/appData/settingsFromViewModel"
import crypto from "crypto"
import { app } from "electron"
import fs from "fs"
import path from "path"
import yaml from "yaml"

export const userDataPath = path.resolve(app.getPath("userData"), "userData")

const settingsPath = path.resolve(userDataPath, "settings")
const previousSettingsPath = path.resolve(settingsPath, ".previousSettings.yml")
const playerOptionsPath = path.resolve(settingsPath, ".playerOptions.yml")

// Preset Ids

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