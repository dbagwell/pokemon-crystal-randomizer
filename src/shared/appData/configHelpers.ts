import type { defaultConfig } from "@shared/appData/defaultConfig"
import { isBoolean, isNotNullish, isNullish, isNumber, isString } from "@shared/utils"

export type Config = ReturnType<typeof defaultConfig>

type MappedConfig<T> = T extends { type: "FormSection", subElementConfigs: infer SubConfigs }
  ? { [K in keyof SubConfigs]: MappedConfig<SubConfigs[K]> } | (T extends { hasToggle: true } ? undefined : never)
  : T extends { type: "ToggleInput" }
    ? boolean
    : T extends { type: "TextInput" }
      ? string | (T extends { required: true } ? never : undefined)
      : T extends { type: "IntegerInput" }
        ? number | (T extends { required: true } ? never : undefined)
        : T extends { type: "SelectorInput", options: (infer Option)[] }
          ? T extends { multiselect: true, selectedOptionIds: (infer OptionId extends string)[] }
            ? Option extends { id: OptionId, subElementConfigs?: infer OptionSubConfig }
              ? ({ [I in OptionId]?: { [K in keyof OptionSubConfig]: MappedConfig<OptionSubConfig[K]> } } | OptionId)[]
              : never
            : T extends { value?: infer OptionId extends string }
              ? Option extends { id: OptionId, subElementConfigs: infer OptionSubConfig }
                ? { value: OptionId, config: { [K in keyof OptionSubConfig]: MappedConfig<OptionSubConfig[K]> } } | undefined
                : OptionId | (T extends { required: true } ? never : undefined)
              : never
          : T extends { type: "IntegerGroupInput" }
            ? number[]
            : never

export type Settings = MappedConfig<Config>

export const getSettingsFromConfig = (config: Config): Settings => {
  return mappedConfig(config)
}

const mappedSubConfigs = <T extends Record<Key, FormElementConfig>, Key extends string>(configs: T): { [K in Key]: MappedConfig<T[K]> } => {
  return (Object.keys(configs) as Key[]).reduce((result: { [K in Key]?: MappedConfig<T[K]> }, key) => {
    const stuff = {
      ...result,
      [key]: mappedConfig(configs[key]),
    }
    return stuff
  }, {}) as { [K in Key]: MappedConfig<T[K]> }
}

const mappedConfig = <T extends FormElementConfig>(config: T): MappedConfig<T> => {
  switch (config.type) {
  case "FormSection": {
    return !config.hasToggle || config.toggleValue ? mappedSubConfigs(config.subElementConfigs) as MappedConfig<T> : undefined as MappedConfig<T>
  }
  case "ToggleInput":
  case "TextInput":
  case "IntegerInput": {
    return config.value as MappedConfig<T>
  }
  case "SelectorInput": {
    if (config.multiselect) {
      return config.options.filter((option) => {
        return config.selectedOptionIds.includes(option.id)
      }).map((option) => {
        if (isNotNullish(option.subElementConfigs)) {
          return {
            [option.id]: mappedSubConfigs(option.subElementConfigs),
          }
        } else {
          return option.id
        }
      }, {}) as MappedConfig<T>
    } else {
      const selectedOption = config.options.find((option) => {
        return option.id === config.value
      })
        
      if (isNotNullish(selectedOption?.subElementConfigs)) {
        return {
          value: selectedOption.id,
          config: mappedSubConfigs(selectedOption.subElementConfigs),
        } as unknown as MappedConfig<T>
      } else {
        return config.value as MappedConfig<T>
      }
    }
  }
  case "IntegerGroupInput": {
    return config.values as MappedConfig<T>
  }
  }
}

const throwConfigTypeError = (path: string, expectedType: string, value: any) => {
  throw new Error(`Invalid value for '${path}'. Expected ${expectedType} value but found ${typeof value} value '${value}'.`)
}

export const setConfigValuesFromSettings = (superConfigPath: string, configId: string, config: FormElementConfig, settings: any) => {
  if (isNullish(settings) || config.type !== "FormSection" && isNullish(settings[configId])) {
    return
  }
  
  let configPath = superConfigPath
  
  if (config.type !== "FormSection" || isNotNullish(config.label)) {
    configPath = configPath === "" ? configId : `${configPath}.${configId}`
  }
  
  switch (config.type) {
  case "FormSection": {
    const knownKeys = Object.keys(config.subElementConfigs)
    
    let unknownKey: string | undefined
    
    if (configId === "") {
      unknownKey = Object.keys(settings).find((key) => {
        return !knownKeys.includes(key)
      })
    } else if (isNotNullish(settings[configId])) {
      unknownKey = Object.keys(settings[configId]).find((key) => {
        return !knownKeys.includes(key)
      })
    }
    
    if (unknownKey) {
      throw new Error(`Unknown value ${unknownKey}${configPath === "" ? "" : ` for ${configPath}`}.`)
    }
    
    if (config.hasToggle) {
      config.toggleValue = isNotNullish(settings[configId])
    }
    
    Object.entries(config.subElementConfigs).forEach(([id, subConfig]) => {
      setConfigValuesFromSettings(configPath, id, subConfig, settings[configId] ?? settings)
    })
    break
  }
  case "ToggleInput": {
    if (!isBoolean(settings[configId])) {
      throwConfigTypeError(configPath, "boolean", settings[configId])
    }
    
    config.value = settings[configId]
    break
  }
  case "TextInput": {
    if (!isString(settings[configId])) {
      throwConfigTypeError(configPath, "string", settings[configId])
    }
    
    if (isNotNullish(config.maxCharacters) && settings[configId].length > config.maxCharacters) {
      throw new Error(`Invalid value for '${configPath}. Value must be less than or equal to ${config.maxCharacters} characters long.`)
    }
    
    config.value = settings[configId]
    break
  }
  case "IntegerInput": {
    if (!isNumber(settings[configId]) || !Number.isInteger(settings[configId])) {
      throwConfigTypeError(configPath, "integer", settings[configId])
    } else if (isNotNullish(config.min) && settings[configId] < config.min) {
      throw new Error(`Invalid value for '${configPath}. Value must be greater than or equal to ${config.min}.`)
    } else if (isNotNullish(config.max) && settings[configId] > config.max) {
      throw new Error(`Invalid value for '${configPath}. Value must be greater than or equal to ${config.max}.`)
    }
    
    config.value = settings[configId]
    break
  }
  case "SelectorInput": {
    let settingsArray: any[] = []
    let numberOfSelections = 0
    
    if (config.multiselect) {
      if (!Array.isArray(settings[configId])) {
        throwConfigTypeError(configPath, "array", settings[configId])
      }
      
      settingsArray = settings[configId]
    } else {
      settingsArray = [settings[configId]]
    }
      
    settingsArray.forEach((setting: any) => {
      if (isNullish(setting)) {
        return
      }
      
      if (isString(setting)) {
        const option = config.options.find((option) => {
          return option.id === setting
        })
        
        if (isNullish(option)) {
          throw new Error(`Unknown value '${setting}' for '${configPath}'.`)
        }
        
        if (config.multiselect) {
          config.selectedOptionIds.push(option.id)
        } else {
          config.value = option.id
        }
        
        numberOfSelections += 1
      } else {
        const entries = Object.entries(setting)
        
        if (!config.multiselect && entries.length > 1) {
          throw new Error(`Only one selection is allowed for '${configPath}', found mulitple.`)
        }
        
        entries.forEach((entry) => {
          const selectedOptionId = entry[0]
          const selectedOptionSettings = entry[1]
          
          const option = config.options.find((option) => {
            return option.id === selectedOptionId
          })
          
          if (isNullish(option)) {
            throw new Error(`Unknown value '${selectedOptionId}' for '${configPath}'.`)
          }
        
          if (config.multiselect) {
            config.selectedOptionIds.push(option.id)
          } else {
            config.value = option.id
          }
          
          if (isNotNullish(option.subElementConfigs)) {
            Object.entries(option.subElementConfigs).forEach(([id, subConfig]) => {
              setConfigValuesFromSettings(configPath, id, subConfig, selectedOptionSettings)
            })
          }
          
          numberOfSelections += 1
        })
      }
      
      if (config.multiselect && isNotNullish(config.maxSelections) && config.maxSelections < numberOfSelections) {
        throw new Error(`Too many values for '${configPath}. Must be less than or equal to ${config.maxSelections}.`)
      }
    })
    break
  }
  case "IntegerGroupInput": {
    const values = settings[configId]
    if (Array.isArray(values)) {
      values.forEach((value, index) => {
        const valueConfigPath = `${configPath}.${index}`
        if (!isNumber(value) || !Number.isInteger(value)) {
          throwConfigTypeError(valueConfigPath, "integer", value)
        } else if (isNotNullish(config.min) && value < config.min) {
          throw new Error(`Invalid value for '${valueConfigPath}. Value must be greater than or equal to ${config.min}.`)
        } else if (isNotNullish(config.max) && value > config.max) {
          throw new Error(`Invalid value for '${valueConfigPath}. Value must be greater than or equal to ${config.max}.`)
        }
      })
      
      if (isNotNullish(config.sum) && values.reduce((result, value) => { return result + value }, 0) !== config.sum) {
        throw new Error(`Invalid value for '${configPath}. Values must add up to ${config.sum}.`)
      }
      
      config.values = values
    } else {
      throwConfigTypeError(configPath, "array", values)
    }
    break
  }
  }
}