import type { ConfigurableMultiSelectorViewModel, GroupMultiSelectorViewModel, InputViewModel, IntegerInputGroupViewModel, IntegerInputViewModel, PlayerOptionsViewModel, SettingsViewModel, SimpleMultiSelectorViewModel, SingleSelectorViewModel, TextInputViewModel, ToggleViewModel } from "@shared/types/viewModels"
import { compact, isBoolean, isNotNullish, isNullish, isNumber, isObject, isString } from "@shared/utils"

export const applyPlayerOptionsToViewModel = (playerOptions: any, viewModel: PlayerOptionsViewModel, warnings: string[]) => {
  if (isNullish(playerOptions)) {
    return
  }
  
  try {
    viewModel.viewModels.forEach((subViewModel) => {
      applySettingsToInputViewModel(playerOptions[subViewModel.id], subViewModel, subViewModel.id, warnings)
    })
  } catch (error) {
    throw new Error(`Unable to apply player options: ${error}`)
  }
}

export const applySettingsToViewModel = (settings: any, viewModel: SettingsViewModel, warnings: string[]) => {
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
  case "INTEGER_INPUT_GROUP": {
    applySettingsToIntegerInputGroupViewModel(settings, viewModel, path, warnings)
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
  case "GROUP_MULTI_SELECTOR": {
    applySettingsToGroupMultiSelectorViewModel(settings, viewModel, path, warnings)
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
    if (isNotNullish(viewModel.min) && isNotNullish(viewModel.max) && (settings < viewModel.min || settings > viewModel.max)) {
      warnings.push(outOfRangeWarning(path, viewModel.min, viewModel.max, settings))
      viewModel.value = settings < viewModel.min ? viewModel.min : viewModel.max
    } else if (isNotNullish(viewModel.min) && settings < viewModel.min) {
      warnings.push(`Invalid value at path '${path}'. Expected integer greater than '${viewModel.min}' but found ${settings}. Using default instead.`)
    } else if (isNotNullish(viewModel.max) && settings > viewModel.max) {
      warnings.push(`Invalid value at path '${path}'. Expected integer less than '${viewModel.max}' but found ${settings}. Using default instead.`)
    } else {
      viewModel.value = settings
    }
  } else {
    warnings.push(invalidValueWarning(path, "integer", settings))
  }
}

const applySettingsToIntegerInputGroupViewModel = (settings: any, viewModel: IntegerInputGroupViewModel, path: string, warnings: string[]) => {
  if (isNullish(settings)) {
    warnings.push(missingValueWarning(path, "array of integers"))
    return
  } else if (!Array.isArray(settings)) {
    warnings.push(invalidValueWarning(path, "array of integers", settings))
    return
  }
  
  if (settings.length > viewModel.values.length) {
    warnings.push(`Too many selections at path '${path}'. Removing the extras.`)
  }
  
  const values = viewModel.values.map((value) => { return value })
  
  settings.forEach((value, index) => {
    if (isNumber(value) && Number.isInteger(value)) {
      values[index] = value
    } else if (value < viewModel.min || value > viewModel.max) {
      warnings.push(outOfRangeWarning(`${path}.${index}`, viewModel.min, viewModel.max, value))
      value[index] = value < viewModel.min ? viewModel.min : viewModel.max
    } else {
      warnings.push(invalidValueWarning(`${path}.${index}`, "integer", value))
    }
  })
  
  const sum = values.reduce((result, value) => { return result + value }, 0)
  
  if (isNotNullish(viewModel.sum) && sum !== viewModel.sum) {
    warnings.push(invalidValueWarning(path, `array of integers adding up to ${sum}`, settings))
  } else {
    viewModel.values = values
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
  const value = isObject(settings) ? settings?.VALUE ?? false : settings ?? false
  
  if (isBoolean(value)) {
    viewModel.isOn = value
  } else if (!hasConfigurableSettings || !isObject(settings)) {
    warnings.push(invalidValueWarning(path, expectedSettingsType, value))
  } else if (isNullish(settings.VALUE)) {
    warnings.push(missingValueWarning(`${path}.VALUE`, "boolean"))
  } else {
    warnings.push(invalidValueWarning(`${path}.VALUE`, "boolean", value))
  }
  
  if (isNullish(settings) || !value) {
    return
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
    applySettingsToInputViewModel(settings.SETTINGS?.[subViewModel.id], subViewModel, `${path}.SETTINGS.${subViewModel.id}`, warnings)
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
  
  const selectedOptionId = isString(settings) ? settings : settings?.VALUE
  
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
      if (isNullish(settings.SETTINGS) || isNullish(settings.SETTINGS?.[option.id])) {
        if (option.id === selectedOptionId) {
          warnings.push(missingValueWarning(`${path}.SETTINGS.${option.id}`, "a dictionary of option configurations"))
        }
        
        return
      }
      
      const viewModelIds = option.viewModels.map((viewModel) => {
        return viewModel.id
      })
      
      Object.keys(settings.SETTINGS?.[option.id]).forEach((key) => {
        if (!viewModelIds.includes(key)) {
          warnings.push(unexpectedKeyWarning(`${path}.SETTINGS.${option.id}`, key))
        }
      })
      
      option.viewModels.forEach((viewModel) => {
        applySettingsToInputViewModel(settings.SETTINGS?.[option.id]?.[viewModel.id], viewModel, `${path}.SETTINGS.${option.id}.${viewModel.id}`, warnings)
      })
    } else if (isNotNullish(settings.SETTINGS) && isNotNullish(settings.SETTINGS?.[option.id])) {
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
    let numberOfSelections = 0
    viewModel.selectedOptionIds = compact(settings.map((value, index) => {
      if (isNotNullish(viewModel.maxSelections)) {
        if (numberOfSelections === viewModel.maxSelections + 1) {
          warnings.push(tooManySelectionsWarning(path))
        }
        
        if (numberOfSelections >= viewModel.maxSelections) {
          return undefined
        }
      }
      
      if (isNullish(value)) {
        return undefined
      } else if (isString(value) && optionIds.includes(value)) {
        numberOfSelections++
        return value
      } else {
        warnings.push(invalidValueWarning(`${path}.${index}`, expectedValueType, value, true))
        return undefined
      }
    }))
  } else if (isNotNullish(settings)) {
    warnings.push(invalidValueWarning(path, expectedSettingsType, settings))
  }
}

const applySettingsToConfigurableMultiSelectorViewModel = (settings: any, viewModel: ConfigurableMultiSelectorViewModel, path: string, warnings: string[]) => {
  if (isNullish(settings)) {
    return
  } else if (!isObject(settings) || Array.isArray(settings)) {
    warnings.push(invalidValueWarning(path, "dictionary of option configurations", settings))
    return
  }
  
  let numberOfSelections = 0
  
  viewModel.selectedOptionIds = compact(Object.keys(settings).map((key) => {
    if (isNotNullish(viewModel.maxSelections)) {
      if (numberOfSelections === viewModel.maxSelections + 1) {
        warnings.push(tooManySelectionsWarning(path))
      }
      
      if (numberOfSelections >= viewModel.maxSelections) {
        return undefined
      }
    }
    
    const optionIds = viewModel.options.map((option) => { return option.id })
    
    if (!optionIds.includes(key)) {
      warnings.push(unexpectedKeyWarning(path, key))
      return undefined
    }
    
    viewModel.options.find((option) => {
      return option.id === key
    })?.viewModels.forEach((viewModel) => {
      applySettingsToInputViewModel(settings[key]?.[viewModel.id], viewModel, `${path}.${key}`, warnings)
    })
    
    numberOfSelections++
    
    return key
  }))
}

const applySettingsToGroupMultiSelectorViewModel = (settings: any, viewModel: GroupMultiSelectorViewModel, path: string, warnings: string[]) => {
  const optionIds = viewModel.options.map((option) => { return option.id })
  const elipsis = optionIds.length > 4 ? "..., " : ""
  const expectedValues = `[${optionIds[0]}, ${optionIds[1]}, ${optionIds[2]}, ${elipsis}${optionIds[optionIds.length - 1]}]`
  const expectedValueType = `one of ${expectedValues}`
  const expectedSettingsType = `array of arrays of ${expectedValues}`
  const expectedArrayType = `array of ${expectedValues}`
  
  if (Array.isArray(settings)) {
    viewModel.selectedOptionIds = []
    settings.forEach((group, outerIndex) => {
      viewModel.selectedOptionIds[outerIndex] = []
      if (Array.isArray(group)) {
        return group.forEach((value, innerIndex) => {
          if (isNullish(value)) {
            return
          } else if (isString(value) && optionIds.includes(value)) {
            if (viewModel.selectedOptionIds.flat().includes(value)) {
              warnings.push(duplicateValueWarning(path, value))
            } else {
              viewModel.selectedOptionIds[outerIndex] = [
                ...viewModel.selectedOptionIds[outerIndex],
                value,
              ]
            }
          } else {
            warnings.push(invalidValueWarning(`${path}.${outerIndex}.${innerIndex}`, expectedValueType, value, true))
          }
        })
      } else {
        warnings.push(invalidValueWarning(`${path}.${outerIndex}`, expectedArrayType, settings))
      }
    })
  } else if (isNotNullish(settings)) {
    warnings.push(invalidValueWarning(path, expectedSettingsType, settings))
  }
}

const missingValueWarning = (path: string, expectedType: string) => {
  return `Missing value at path '${path}'. Expected ${expectedType}. Using default instead.`
}

const invalidValueWarning = (path: string, expectedType: string, foundValue: any, ignored: boolean = false) => {
  return `Invalid value at path '${path}'. Expected ${expectedType} but found '${foundValue}'. ${ignored ? "Ignoring." : "Using default instead."}`
}

const unexpectedKeyWarning = (path: string, key: string) => {
  return `Unexpected key '${key}' at path '${path}'.`
}

const tooManySelectionsWarning = (path: string) => {
  return `Too many selections at path '${path}'. Removing the extras.`
}

const duplicateValueWarning = (path: string, value: any) => {
  return `Duplicate value '${value}' at path '${path}'. Removing the extra.`
}

const outOfRangeWarning = (path: string, min: number, max: number, foundValue: number) => {
  return `Invalid value at path '${path}'. Expected integer between '${min}' and '${max}' but found '${foundValue}'. Using '${foundValue < min ? min : max}' instead.`
}