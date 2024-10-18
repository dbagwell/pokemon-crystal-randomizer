import type { AppViewModel, ConfigurableSelectorOption, IntegerInputViewModel, SelectorOption, SelectorViewModel, TabViewModel, ToggleSubViewModel, ToggleViewModel } from "@shared/types/viewModels"
import { reduceArrayIntoRecord } from "@shared/utils"

type ArrayOfSettingsFromArrayOfTabViewModels<ArrayType extends TabViewModel[]> = {
  [I in keyof ArrayType]: SettingsFromTabViewModel<ArrayType[I]>
}

type SettingsFromAppViewModel = ObjectFromIntersectionOfArrayValues<ArrayOfSettingsFromArrayOfTabViewModels<AppViewModel["tabViewModels"]>>
export const settingsFromAppViewModel = (appViewModel: AppViewModel): SettingsFromAppViewModel => {
  return Object.assign({}, ...appViewModel.tabViewModels.map((tabViewModel) => {
    return settingsFromTabViewModel(tabViewModel)
  })) as SettingsFromAppViewModel
}

type SettingsFromTabViewModel<ViewModelType extends TabViewModel> = SettingsFromArrayOfToggleViewModels<ViewModelType["subViewModels"]>
const settingsFromTabViewModel = <ViewModelType extends TabViewModel>(viewModel: ViewModelType): SettingsFromTabViewModel<ViewModelType> => {
  return settingsFromArrayOfToggleViewModels(viewModel.subViewModels) as SettingsFromTabViewModel<ViewModelType>
}

type SettingsFromArrayOfToggleViewModels<ArrayType extends ToggleViewModel[]> = {
  [ViewModelType in ArrayType[number] as ViewModelType["id"]]: SettingsFromToggleViewModel<ViewModelType>
}
const settingsFromArrayOfToggleViewModels = <ArrayType extends ToggleViewModel[]>(viewModels: ArrayType): SettingsFromArrayOfToggleViewModels<ArrayType> => {
  return reduceArrayIntoRecord(viewModels, (result, viewModel) => {
    result[viewModel.id] = settingsFromToggleViewModel(viewModel) as SettingsFromToggleViewModel<ArrayType[number]>
  }) as SettingsFromArrayOfToggleViewModels<ArrayType>
}

type SettingsFromToggleViewModel<ViewModelType extends ToggleViewModel> = ViewModelType extends { subViewModels: ToggleSubViewModel[] }
  ? {
    VALUE: boolean
    SETTINGS: Expand<SettingsFromArrayOfToggleSubViewModels<ViewModelType["subViewModels"]>>
  }
  : boolean
const settingsFromToggleViewModel = <ViewModel extends ToggleViewModel>(viewModel: ViewModel): SettingsFromToggleViewModel<ViewModel> => {
  if ("subViewModels" in viewModel) {
    return {
      VALUE: viewModel.isOn,
      SETTINGS: settingsFromArrayOfToggleSubViewModels(viewModel.subViewModels),
    } as SettingsFromToggleViewModel<ViewModel>
  } else {
    return viewModel.isOn as SettingsFromToggleViewModel<ViewModel>
  }
}

type SettingsFromArrayOfToggleSubViewModels<ArrayType extends ToggleSubViewModel[]> = {
  [ViewModelType in ArrayType[number] as ViewModelType["id"]]: SettingsFromToggleSubViewModel<ViewModelType>
}
const settingsFromArrayOfToggleSubViewModels = <ArrayType extends ToggleSubViewModel[]>(viewModels: ArrayType): SettingsFromArrayOfToggleSubViewModels<ArrayType> => {
  return reduceArrayIntoRecord(viewModels, (result, viewModel) => {
    result[viewModel.id] = settingsFromToggleSubViewModel(viewModel) as SettingsFromToggleSubViewModel<ArrayType[number]>
  }) as SettingsFromArrayOfToggleSubViewModels<ArrayType>
}

type SettingsFromToggleSubViewModel<ViewModelType extends ToggleSubViewModel> = ViewModelType extends IntegerInputViewModel
  ? SettingsFromIntegerInputViewModel<ViewModelType>
  : ViewModelType extends ToggleViewModel
    ? SettingsFromToggleViewModel<ViewModelType>
    : ViewModelType extends SelectorViewModel
      ? Expand<SettingsFromSelectorViewModel<ViewModelType>>
      : never
const settingsFromToggleSubViewModel = <SubViewModelType extends ToggleSubViewModel>(subViewModel: SubViewModelType): SettingsFromToggleSubViewModel<SubViewModelType> => {
  switch (subViewModel.type) {
  case "INTEGER_INPUT": {
    return settingsFromIntegerInputViewModel(subViewModel) as SettingsFromToggleSubViewModel<SubViewModelType>
  }
  case "TOGGLE": {
    return settingsFromToggleViewModel(subViewModel) as SettingsFromToggleSubViewModel<SubViewModelType>
  }
  case "SELECTOR": {
    return settingsFromSelectorViewModel(subViewModel) as SettingsFromToggleSubViewModel<SubViewModelType>
  }
  default: {
    const unhandledCase: never = subViewModel
    throw new Error(`Unhandled case: ${unhandledCase}`)
  }
  }
}

type SettingsFromIntegerInputViewModel<ViewModelType extends IntegerInputViewModel> = ViewModelType extends { isRequired: true } ? number : number | undefined
const settingsFromIntegerInputViewModel = <ViewModelType extends IntegerInputViewModel>(viewModel: ViewModelType): SettingsFromIntegerInputViewModel<ViewModelType> => {
  return viewModel.value as SettingsFromIntegerInputViewModel<ViewModelType>
}

type SettingsFromSelectorViewModel<ViewModelType extends SelectorViewModel> = keyof SettingsFromArrayOfSelectorOptions<ViewModelType["options"]> extends never
  ? ViewModelType["options"][number]["id"]
  : {
    VALUE: ViewModelType["options"][number]["id"]
    SETTINGS: Expand<SettingsFromArrayOfSelectorOptions<ViewModelType["options"]>>
  }
const settingsFromSelectorViewModel = <ViewModelType extends SelectorViewModel>(viewModel: ViewModelType): SettingsFromSelectorViewModel<ViewModelType> => {
  const optionSettings = settingsFromArrayOfSelectorOptions(viewModel.options)
  
  if (Object.keys(optionSettings).length > 0) {
    return {
      VALUE: viewModel.selectedOptionId,
      SETTINGS: optionSettings,
    } as SettingsFromSelectorViewModel<ViewModelType>
  } else {
    return viewModel.selectedOptionId as SettingsFromSelectorViewModel<ViewModelType>
  }
}

type SettingsFromArrayOfSelectorOptions<ArrayType extends SelectorOption[]> = {
  [OptionType in ArrayType[number] as OptionType extends { viewModels: ToggleViewModel[] } ? OptionType["id"] : never]: SettingsFromSelectorOption<OptionType>
}
const settingsFromArrayOfSelectorOptions = <ArrayType extends SelectorOption[]>(options: ArrayType): SettingsFromArrayOfSelectorOptions<ArrayType> => {
  return reduceArrayIntoRecord(options, (result, option) => {
    if ("viewModels" in option) {
      result[option.id] = settingsFromSelectorOption(option) as SettingsFromSelectorOption<ArrayType[number]>
    }
  }) as SettingsFromArrayOfSelectorOptions<ArrayType>
}

type SettingsFromSelectorOption<OptionType extends SelectorOption> = OptionType extends ConfigurableSelectorOption
  ? Expand<SettingsFromConfigurableSelectorOption<OptionType>>
  : undefined
const settingsFromSelectorOption = <OptionType extends SelectorOption>(option: OptionType): SettingsFromSelectorOption<OptionType> => {
  if ("viewModels" in option) {
    return settingsFromConfigurableSelectorOption(option) as SettingsFromSelectorOption<OptionType>
  } else {
    return undefined as SettingsFromSelectorOption<OptionType>
  }
}

type SettingsFromConfigurableSelectorOption<OptionType extends ConfigurableSelectorOption> = {
  [ViewModelType in OptionType["viewModels"][number] as ViewModelType["id"]]: SettingsFromToggleViewModel<ViewModelType>
}
const settingsFromConfigurableSelectorOption = <OptionType extends ConfigurableSelectorOption>(option: OptionType): SettingsFromConfigurableSelectorOption<OptionType> => {
  return reduceArrayIntoRecord(option.viewModels, (optionSettings, viewModel) => {
    optionSettings[viewModel.id] = settingsFromToggleViewModel(viewModel) as SettingsFromToggleViewModel<OptionType["viewModels"][number]>
  }) as SettingsFromConfigurableSelectorOption<OptionType>
}