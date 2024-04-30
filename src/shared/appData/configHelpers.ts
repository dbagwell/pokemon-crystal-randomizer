import { isNotNullish, isNullish, isNumber, isString } from "@shared/utils"

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

// TODO: Do more validation here
export const setConfigValuesFromSettings = (configId: string, config: FormElementConfig, settings: any) => {
  switch (config.type) {
  case "FormSection": {
    let subConfigSettings = settings
    if (isNotNullish(settings) && isNotNullish(config.label)) {
      if (config.hasToggle) {
        config.toggleValue = settings[configId]
        subConfigSettings = settings[`${configId}_CONFIG`]
      } else {
        subConfigSettings = settings[configId]
      }
    }
    
    Object.entries(config.subElementConfigs).forEach(([id, subConfig]) => {
      setConfigValuesFromSettings(id, subConfig, subConfigSettings)
    })
    break
  }
  case "ToggleInput": {
    if (isNotNullish(settings) && settings[configId] === true) {
      config.value = settings[configId]
    } else {
      config.value = undefined
    }
    break
  }
  case "TextInput": {
    if (isNotNullish(settings) && isString(settings[configId])) {
      config.value = settings[configId]
    } else {
      config.value = undefined
    }
    break
  }
  case "IntegerInput": {
    if (isNotNullish(settings) && isNumber(settings[configId]) && Number.isInteger(settings[configId])) {
      config.value = settings[configId]
    } else if (!config.required) {
      config.value = undefined
    }
    break
  }
  case "SelectorInput": {
    let settingsArray: any[] = []
    const selectedOptionIds: string[] = []
    const optionSettings: Record<string, any> = {}
    
    if (isNotNullish(settings)) {
      if (config.multiselect) {
        if (Array.isArray(settings[configId])) {
          settingsArray = settings[configId]
        }
      } else {
        settingsArray = [settings[configId]]
      }
    }
      
    settingsArray.forEach((setting: any) => {
      if (isNullish(setting)) {
        return
      }
      
      if (isString(setting)) {
        selectedOptionIds.push(setting)
      } else {
        const entries = Object.entries(setting)
        if (entries.length > 0) {
          const settingTuple = entries[0]
          selectedOptionIds.push(settingTuple[0])
          optionSettings[settingTuple[0]] = settingTuple[1]
        }
      }
    })
    
    if (config.multiselect) {
      config.selectedOptionIds = []
    } else {
      config.value = undefined
    }
    
    config.options.forEach((option) => {
      if (selectedOptionIds.includes(option.id)) {
        if (config.multiselect) {
          config.selectedOptionIds.push(option.id)
        } else {
          config.value = option.id
        }
      }
      
      if (isNotNullish(option.subElementConfigs)) {
        Object.entries(option.subElementConfigs).forEach(([id, subConfig]) => {
          setConfigValuesFromSettings(id, subConfig, optionSettings[option.id] ?? {})
        })
      }
    })
    break
  }
  }
}