import type { AppViewModel, ConfigurableMultiSelectorViewModel, InputViewModel, IntegerInputViewModel, SimpleMultiSelectorViewModel, SingleSelectorViewModel, TextInputViewModel, ToggleViewModel } from "@shared/types/viewModels"
import { compact, isBoolean, isNotNullish, isNullish, isNumber, isObject, isString } from "@shared/utils"

export const applySettingsToAppViewModel = (settings: any, viewModel: AppViewModel, warnings: string[]) => {
  if (isNullish(settings)) {
    return
  }
  
  try {
    viewModel.tabViewModels.forEach((tabViewModel) => {
      tabViewModel.viewModels.forEach((subViewModel) => {
        applySettingsToInputViewModel(settings[subViewModel.id], subViewModel, subViewModel.id, warnings)
      })
    })
  } catch (error) {
    throw new Error(`Unable to apply settings: ${error}`)
  }
}

const applySettingsToInputViewModel = (settings: any, viewModel: InputViewModel, path: string, warnings: string[]) => {
  switch (viewModel.type) {
  case "INTEGER_INPUT": {
    applySettingsToIntegerInputViewModel(settings, viewModel, path, warnings)
    break
  }
  case "TEXT_INPUT": {
    applySettingsToTextInputViewModel(settings, viewModel, path, warnings)
    break
  }
  case "SINGLE_SELECTOR": {
    applySettingsToSingleSelectorViewModel(settings, viewModel, path, warnings)
    break
  }
  case "SIMPLE_MULTI_SELECTOR": {
    applySettingsToSimpleMultiSelectorViewModel(settings, viewModel, path, warnings)
    break
  }
  case "CONFIGURABLE_MULTI_SELECTOR": {
    applySettingsToConfigurableMultiSelectorViewModel(settings, viewModel, path, warnings)
    break
  }
  case "TOGGLE": {
    applySettingsToToggleViewModel(settings, viewModel, path, warnings)
    break
  }
  default: {
    const unhandledCase: never = viewModel
    throw new Error(`Unhandled case: ${unhandledCase}`)
  }
  }
}

const applySettingsToIntegerInputViewModel = (settings: any, viewModel: IntegerInputViewModel, path: string, warnings: string[]) => {
  if (isNullish(settings)) {
    if (viewModel.isRequired) {
      warnings.push(missingValueWarning(path, "integer"))
    } else {
      viewModel.value = undefined
    }
  } else if (isNumber(settings) && Number.isInteger(settings)) {
    viewModel.value = settings
  } else {
    warnings.push(invalidValueWarning(path, "integer", settings))
  }
}

const applySettingsToTextInputViewModel = (settings: any, viewModel: TextInputViewModel, path: string, warnings: string[]) => {
  if (isNullish(settings)) {
    if (viewModel.isRequired) {
      warnings.push(missingValueWarning(path, "string"))
    } else {
      viewModel.value = undefined
    }
  } else if (isString(settings)) {
    viewModel.value = settings
  } else {
    warnings.push(invalidValueWarning(path, "string", settings))
  }
}

const applySettingsToToggleViewModel = (settings: any, viewModel: ToggleViewModel, path: string, warnings: string[]) => {
  const expectedSettingsType = "boolean or a dictionary of with a 'VALUE' and 'SETTINGS'"
  const hasConfigurableSettings = "viewModels" in viewModel
  const value = isBoolean(settings) ? settings : settings.VALUE
  
  if (isBoolean(value)) {
    viewModel.isOn = value
  } else if (isNullish(settings)) {
    warnings.push(missingValueWarning(path, expectedSettingsType))
    return
  } else if (!hasConfigurableSettings || !isObject(settings)) {
    warnings.push(invalidValueWarning(path, expectedSettingsType, value))
  } else if (isNullish(settings.VALUE)) {
    warnings.push(missingValueWarning(`${path}.VALUE`, "boolean"))
  } else {
    warnings.push(invalidValueWarning(`${path}.VALUE`, "boolean", value))
  }
  
  if (!hasConfigurableSettings) {
    if (isNotNullish(settings.SETTINGS)) {
      warnings.push(unexpectedKeyWarning(path, "SETTINGS"))
    }
    
    return
  }
  
  if (isObject(settings)) {
    Object.keys(settings).forEach((key) => {
      if (key !== "VALUE" && key !== "SETTINGS") {
        warnings.push(unexpectedKeyWarning(path, key))
      }
    })
  }
  
  if (isObject(settings.SETTINGS)) {
    const subViewModelIds = viewModel.viewModels.map((subViewModel) => {
      return subViewModel.id
    })
    
    Object.keys(settings.SETTINGS).find((key) => {
      if (!subViewModelIds.includes(key)) {
        warnings.push(unexpectedKeyWarning(`${path}.SETTINGS`, key))
      }
    })
  } else if (isNotNullish(settings.SETTINGS)) {
    warnings.push(invalidValueWarning(`${path}.SETTINGS`, "a dictionary of settings", settings.SETTINGS))
  }
    
  viewModel.viewModels.forEach((subViewModel) => {
    applySettingsToInputViewModel(settings.SETTINGS[subViewModel.id], subViewModel, `${path}.SETTINGS.${subViewModel.id}`, warnings)
  })
}

const applySettingsToSingleSelectorViewModel = (settings: any, viewModel: SingleSelectorViewModel, path: string, warnings: string[]) => {
  const hasConfigurableOptions = viewModel.options.find((option) => {
    return "viewModels" in option
  })
  
  const optionIds = viewModel.options.map((option) => { return option.id })
  const elipsis = optionIds.length > 4 ? "..., " : ""
  const expectedValueType = `one of [${optionIds[0]}, ${optionIds[1]}, ${optionIds[2]}, ${elipsis}${optionIds[optionIds.length - 1]}]`
  const expectedSettingsType = `${expectedValueType}${hasConfigurableOptions ? "or a dictionary with a 'VALUE' and 'SETTINGS'" : ""}`
  
  const selectedOptionId = isString(settings) ? settings : settings.VALUE
  
  if (!hasConfigurableOptions && isObject(settings)) {
    warnings.push(invalidValueWarning(path, expectedSettingsType, selectedOptionId))
  } else if (optionIds.includes(selectedOptionId)) {
    viewModel.selectedOptionId = selectedOptionId
  } else if (isNullish(settings)) {
    warnings.push(missingValueWarning(path, expectedSettingsType))
    return
  } else if (isString(settings) || !hasConfigurableOptions || !isObject(settings)) {
    warnings.push(invalidValueWarning(path, expectedSettingsType, selectedOptionId))
  } else if (isNullish(settings.VALUE)) {
    warnings.push(missingValueWarning(`${path}.VALUE`, expectedValueType))
  } else {
    warnings.push(invalidValueWarning(`${path}.VALUE`, expectedValueType, selectedOptionId))
  }
  
  if (!hasConfigurableOptions) {
    if (isNotNullish(settings.SETTINGS)) {
      warnings.push(unexpectedKeyWarning(path, "SETTINGS"))
    }
    
    return
  }
  
  if (isObject(settings)) {
    Object.keys(settings).forEach((key) => {
      if (key !== "VALUE" && key !== "SETTINGS") {
        warnings.push(unexpectedKeyWarning(path, key))
      }
    })
  }
  
  if (isObject(settings.SETTINGS)) {
    Object.keys(settings.SETTINGS).find((key) => {
      if (!optionIds.includes(key)) {
        warnings.push(unexpectedKeyWarning(`${path}.SETTINGS`, key))
      }
    })
  } else if (isNotNullish(settings.SETTINGS)) {
    warnings.push(invalidValueWarning(`${path}.SETTINGS`, "a dictionary of options", settings.SETTINGS))
  }
  
  viewModel.options.forEach((option) => {
    if ("viewModels" in option) {
      if (isNullish(settings.SETTINGS) || isNullish(settings.SETTINGS[option.id])) {
        if (option.id === selectedOptionId) {
          warnings.push(missingValueWarning(`${path}.SETTINGS.${option.id}`, "a dictionary of option configurations"))
        }
        
        return
      }
      
      const viewModelIds = option.viewModels.map((viewModel) => {
        return viewModel.id
      })
      
      Object.keys(settings.SETTINGS[option.id]).forEach((key) => {
        if (!viewModelIds.includes(key)) {
          warnings.push(unexpectedKeyWarning(`${path}.SETTINGS.${option.id}`, key))
        }
      })
      
      option.viewModels.forEach((viewModel) => {
        applySettingsToInputViewModel(settings.SETTINGS[option.id][viewModel.id], viewModel, `${path}.SETTINGS.${option.id}.${viewModel.id}`, warnings)
      })
    } else if (isNotNullish(settings.SETTINGS) && isNotNullish(settings.SETTINGS[option.id])) {
      warnings.push(unexpectedKeyWarning(`${path}.SETTINGS`, option.id))
    }
  })
}

const applySettingsToSimpleMultiSelectorViewModel = (settings: any, viewModel: SimpleMultiSelectorViewModel, path: string, warnings: string[]) => {
  const optionIds = viewModel.options.map((option) => { return option.id })
  const elipsis = optionIds.length > 4 ? "..., " : ""
  const expectedValues = `[${optionIds[0]}, ${optionIds[1]}, ${optionIds[2]}, ${elipsis}${optionIds[optionIds.length - 1]}]`
  const expectedValueType = `one of ${expectedValues}`
  const expectedSettingsType = `array of ${expectedValues}`
  
  if (Array.isArray(settings)) {
    viewModel.selectedOptionIds = compact(settings.map((value, index) => {
      if (isNullish(value)) {
        return undefined
      } else if (isString(value) && optionIds.includes(value)) {
        return value
      } else {
        warnings.push(invalidValueWarning(`${path}.${index}`, expectedValueType, value))
      }
    }))
  } else if (isNotNullish(settings)) {
    warnings.push(invalidValueWarning(path, expectedSettingsType, settings))
  }
}

const applySettingsToConfigurableMultiSelectorViewModel = (settings: any, viewModel: ConfigurableMultiSelectorViewModel, path: string, warnings: string[]) => {
  const expectedSettingsType = "dictionary of option configurations"
  
  if (isNullish(settings)) {
    return
  } else if (!isObject(settings) || Array.isArray(settings)) {
    warnings.push(invalidValueWarning(path, expectedSettingsType, settings))
    return
  }
  
  viewModel.selectedOptionIds = compact(Object.keys(settings).map((key) => {
    const optionIds = viewModel.options.map((option) => { return option.id })
    
    if (!optionIds.includes(key)) {
      warnings.push(unexpectedKeyWarning(path, key))
      return undefined
    }
    
    viewModel.options.find((option) => {
      return option.id === key
    })?.viewModels.forEach((viewModel) => {
      applySettingsToInputViewModel(settings[key], viewModel, `${path}.${key}`, warnings)
    })
    
    return key
  }))
}

const missingValueWarning = (path: string, expectedType: string) => {
  return `Missing value at path '${path}'. Expected ${expectedType}. Using default instead.`
}

const invalidValueWarning = (path: string, expectedType: string, foundValue: any) => {
  return `Invalid value at path '${path}'. Expected ${expectedType} but found '${foundValue}'. Using default instead.`
}

const unexpectedKeyWarning = (path: string, key: string) => {
  return `Unexpected key '${key}' at path '${path}'.`
}