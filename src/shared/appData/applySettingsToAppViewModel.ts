import type { AppViewModel, SelectorViewModel, ToggleViewModel } from "@shared/types/viewModels"
import { isBoolean, isNotNullish, isNullish, isNumber, isObject, isString } from "@shared/utils"

export const applySettingsToAppViewModel = (settings: any, appViewModel: AppViewModel, warnings: string[]) => {
  if (isNullish(settings)) {
    return
  }
  
  try {
    appViewModel.tabViewModels.forEach((tabViewModel) => {
      tabViewModel.subViewModels.forEach((subViewModel) => {
        applySettingsToToggleViewModel(settings[subViewModel.id], subViewModel, subViewModel.id, warnings)
      })
    })
  } catch (error) {
    throw new Error(`Unable to apply settings: ${error}`)
  }
}

const applySettingsToToggleViewModel = (settings: any, toggleViewModel: ToggleViewModel, path: string, warnings: string[]) => {
  const expectedSettingsType = "boolean or a dictionary of with a 'VALUE' and 'SETTINGS'"
  const hasConfigurableSettings = "subViewModels" in toggleViewModel
  const value = isBoolean(settings) ? settings : settings.VALUE
  
  if (isBoolean(value)) {
    toggleViewModel.isOn = value
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
    const subViewModelIds = toggleViewModel.subViewModels.map((subViewModel) => {
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
    
  toggleViewModel.subViewModels.forEach((subViewModel) => {
    const subSettings = settings.SETTINGS[subViewModel.id]
      
    switch (subViewModel.type) {
    case "INTEGER_INPUT": {
      if (isNullish(subSettings)) {
        if (subViewModel.isRequired) {
          warnings.push(missingValueWarning(`${path}.SETTINGS.${subViewModel.id}`, "integer"))
        } else {
          subViewModel.value = undefined
        }
      } else if (isNumber(subSettings) && Number.isInteger(subSettings)) {
        subViewModel.value = subSettings
      } else {
        warnings.push(invalidValueWarning(`${path}.SETTINGS.${subViewModel.id}`, "integer", subSettings))
      }
      break
    }
    case "TOGGLE": {
      applySettingsToToggleViewModel(subSettings, subViewModel, `${path}.SETTINGS.${subViewModel.id}`, warnings)
      break
    }
    case "SELECTOR": {
      applySettingsToSelectorViewModel(subSettings, subViewModel, `${path}.SETTINGS.${subViewModel.id}`, warnings)
      break
    }
    default: {
      const unhandledCase: never = subViewModel
      throw new Error(`Unhandled case: ${unhandledCase}`)
    }
    }
  })
}

const applySettingsToSelectorViewModel = (settings: any, viewModel: SelectorViewModel, path: string, warnings: string[]) => {
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
        applySettingsToToggleViewModel(settings.SETTINGS[option.id][viewModel.id], viewModel, `${path}.SETTINGS.${option.id}.${viewModel.id}`, warnings)
      })
    } else if (isNotNullish(settings.SETTINGS) && isNotNullish(settings.SETTINGS[option.id])) {
      warnings.push(unexpectedKeyWarning(`${path}.SETTINGS`, option.id))
    }
  })
}

const missingValueWarning = (path: string, expectedType: string) => {
  return `Missing value at path '${path}'. Expected ${expectedType}. Using default instead.`
}

const invalidValueWarning = (path: string, expectedType: string, foundValue: string) => {
  return `Invalid value at path '${path}'. Expected ${expectedType} but found '${foundValue}'. Using default instead.`
}

const unexpectedKeyWarning = (path: string, key: string) => {
  return `Unexpected key '${key}' at path '${path}'.`
}