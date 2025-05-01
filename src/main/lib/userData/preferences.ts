import { userDataPath } from "@lib/userData/userData"
import { getYAML } from "@lib/utils/yamlUtils"
import { isBoolean, isString } from "@shared/utils"
import fs from "fs"
import path from "path"
import yaml from "yaml"

const preferencesPath = path.resolve(userDataPath, "preferences.yml")

export type UserPreferences = {
  lastPresetId: string
  logPreference: boolean
  createPatch: boolean
  ignoredUpdateVersions: string[]
}

const getPreferences = (): UserPreferences => {
  const defaultPreferences: UserPreferences = {
    lastPresetId: "VANILLA",
    logPreference: false,
    createPatch: false,
    ignoredUpdateVersions: [],
  }
  
  try {
    const preferences = getYAML([preferencesPath])
    
    const get = <Key extends keyof UserPreferences, Value extends UserPreferences[Key]>(key: Key, validator: (value: any) => boolean): { [K in Key]: Value } => {
      return validator(preferences[key]) ? {
        [key]: preferences[key],
      } as { [K in Key]: Value } : {
        [key]: defaultPreferences[key],
      } as { [K in Key]: Value }
    }
    
    return {
      ...get("lastPresetId", (value) => { return isString(value) }),
      ...get("logPreference", (value) => { return isBoolean(value) }),
      ...get("createPatch", (value) => { return isBoolean(value) }),
      ...get("ignoredUpdateVersions", (value) => { return Array.isArray(value) && value.reduce((result, value) => { return result && isString(value) }, true) }),
    }
  } catch {
    return defaultPreferences
  }
}

const setPreferences = (preferences: UserPreferences) => {
  try {
    fs.writeFileSync(preferencesPath, yaml.stringify(preferences))
  } catch {
    // Do nothing
  }
}

export const getPreference = <Key extends keyof UserPreferences, Value extends UserPreferences[Key]>(key: Key): Value => {
  return getPreferences()[key] as Value
}

export const setPreference = <Key extends keyof UserPreferences, Value extends UserPreferences[Key]>(key: Key, value: Value) => {
  const preferences = getPreferences()
  preferences[key] = value
  setPreferences(preferences)
}

export const ignoreUpdateVersion = (version: string) => {
  setPreference("ignoredUpdateVersions", [
    ...getPreference("ignoredUpdateVersions"),
    version,
  ])
}