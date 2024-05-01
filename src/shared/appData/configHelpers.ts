import { compact, isBoolean, isNotNullish, isNullish, isNumber, isString } from "@shared/utils"

type Setting = { [key: string]: Setting } | (string | { [key: string]: Setting })[] | boolean | string | number | undefined

export const getSettingsFromConfigs = (configs: Dictionary<FormElementConfig>): { [key: string]: Setting } => {
  return Object.entries(configs).reduce((result, [id, config]) => {
    return {
      ...result,
      ...getSettingsFromConfig(id, config),
    }
  }, {})
}

const getSettingsFromConfig = (configId: string, config: FormElementConfig): { [key: string]: Setting } => {
  switch (config.type) {
  case "FormSection": {
    if (isNotNullish(config.label)) {
      if (config.hasToggle) {
        return {
          [configId]: config.toggleValue,
          [`${configId}_CONFIG`]: config.toggleValue ? getSettingsFromConfigs(config.subElementConfigs) : undefined,
        }
      } else {
        return {
          [configId]: getSettingsFromConfigs(config.subElementConfigs),
        }
      }
    } else {
      return getSettingsFromConfigs(config.subElementConfigs)
    }
  }
  case "ToggleInput":
  case "TextInput":
  case "IntegerInput": {
    return {
      [configId]: config.value,
    }
  }
  case "SelectorInput": {
    if (config.multiselect) {
      const selectedValues = config.options.filter((option) => {
        return config.selectedOptionIds.includes(option.id)
      }).map((option) => {
        if (isNotNullish(option.subElementConfigs)) {
          return {
            [option.id]: getSettingsFromConfigs(option.subElementConfigs),
          }
        } else {
          return option.id
        }
      })
      
      return {
        [configId]: selectedValues,
      }
    } else {
      const selectedOption = config.options.find((option) => {
        return option.id === config.value
      })
      
      if (isNotNullish(selectedOption?.subElementConfigs)) {
        return {
          [configId]: getSettingsFromConfigs(selectedOption.subElementConfigs),
        }
      } else {
        return {
          [configId]: config.value,
        }
      }
    }
  }
  }
}

const throwConfigTypeError = (path: string, expectedType: string, value: any) => {
  throw new Error(`Invalid value for '${path}'. Expected ${expectedType} value but found ${typeof value} value '${value}'.`)
}

const knownKeysForConfig = (config: FormSectionConfig): string[] => {
  return [
    ...Object.keys(config.subElementConfigs),
    ...Object.entries(config.subElementConfigs).reduce((result: string[], [key, subConfig]) => {
      return compact([
        ...result,
        ...subConfig.type === "FormSection" && isNullish(subConfig.label) ? knownKeysForConfig(subConfig) : [],
        subConfig.type === "FormSection" && subConfig.hasToggle ? `${key}_CONFIG` : undefined,
      ])
    }, []),
  ]
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
    const knownKeys = knownKeysForConfig(config)
    
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
    
    let subConfigSettings = settings
    
    if (isNotNullish(config.label)) {
      if (config.hasToggle) {
        if (isNotNullish(settings[configId])) {
          if (!isBoolean(settings[configId])) {
            throwConfigTypeError(configPath, "boolean", settings[configId])
          }
          
          config.toggleValue = settings[configId]
        }
        
        subConfigSettings = settings[`${configId}_CONFIG`]
        configPath += "_CONFIG"
      } else {
        subConfigSettings = settings[configId]
      }
    }
    
    Object.entries(config.subElementConfigs).forEach(([id, subConfig]) => {
      setConfigValuesFromSettings(configPath, id, subConfig, subConfigSettings)
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
    
    config.value = settings[configId]
    break
  }
  case "IntegerInput": {
    if (!isNumber(settings[configId]) || !Number.isInteger(settings[configId])) {
      throwConfigTypeError(configPath, "integer", settings[configId])
    } else if (isNotNullish(config.min) && settings[configId] < config.min) {
      throw new Error(`Invalid value for '${configPath}. Value must be greater than ${config.min}.`)
    } else if (isNotNullish(config.max) && settings[configId] > config.max) {
      throw new Error(`Invalid value for '${configPath}. Value must be greater than ${config.max}.`)
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
  }
}