import { getYAML } from "@lib/utils/yamlUtils"
import { app } from "electron"
import fs from "fs"
import path from "path"
import yaml from "yaml"

export const userDataPath = path.resolve(app.getPath("userData"), "userData")

const settingsPath = path.resolve(userDataPath, "settings")
const previousSettingsPath = path.resolve(settingsPath, ".previousSettings.yml")

export const getPreviousSettings = (): any | undefined => {
  try {
    return getYAML([previousSettingsPath])
  } catch {
    return undefined
  }
}

export const setPreviousSettings = (settings: any) => {
  try {
    fs.mkdirSync(settingsPath, { recursive: true })
    fs.writeFileSync(previousSettingsPath, yaml.stringify(settings))
  } catch {
    // Do nothing
  }
}