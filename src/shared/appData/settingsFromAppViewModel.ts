import type {
  AppViewModel,
  ConfigurableMultiSelectorViewModel,
  ConfigurableSelectorOption,
  InputViewModel,
  IntegerInputViewModel,
  SelectorOption,
  SimpleMultiSelectorViewModel,
  SingleSelectorViewModel,
  TabViewModel,
  TextInputViewModel,
  ToggleViewModel,
} from "@shared/types/viewModels"
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

type SettingsFromToggleViewModel<ViewModelType extends ToggleViewModel> =
  ViewModelType extends { subViewModels: InputViewModel[] } ? {
    VALUE: boolean
    SETTINGS: Expand<SettingsFromArrayOfInputViewModels<ViewModelType["subViewModels"]>>
  }
  : boolean
const settingsFromToggleViewModel = <ViewModel extends ToggleViewModel>(viewModel: ViewModel): SettingsFromToggleViewModel<ViewModel> => {
  if ("subViewModels" in viewModel) {
    return {
      VALUE: viewModel.isOn,
      SETTINGS: settingsFromArrayOfInputViewModels(viewModel.subViewModels),
    } as SettingsFromToggleViewModel<ViewModel>
  } else {
    return viewModel.isOn as SettingsFromToggleViewModel<ViewModel>
  }
}

type SettingsFromArrayOfInputViewModels<ArrayType extends InputViewModel[]> = {
  [ViewModelType in ArrayType[number] as ViewModelType["id"]]: SettingsFromInputViewModel<ViewModelType>
}
const settingsFromArrayOfInputViewModels = <ArrayType extends InputViewModel[]>(viewModels: ArrayType): SettingsFromArrayOfInputViewModels<ArrayType> => {
  return reduceArrayIntoRecord(viewModels, (result, viewModel) => {
    result[viewModel.id] = settingsFromInputViewModel(viewModel) as SettingsFromInputViewModel<ArrayType[number]>
  }) as SettingsFromArrayOfInputViewModels<ArrayType>
}

type SettingsFromIntegerInputViewModel<ViewModelType extends IntegerInputViewModel> = ViewModelType extends { isRequired: true } ? number : number | undefined
const settingsFromIntegerInputViewModel = <ViewModelType extends IntegerInputViewModel>(viewModel: ViewModelType): SettingsFromIntegerInputViewModel<ViewModelType> => {
  return viewModel.value as SettingsFromIntegerInputViewModel<ViewModelType>
}

type SettingsFromTextInputViewModel<ViewModelType extends TextInputViewModel> = ViewModelType extends { isRequired: true } ? string : string | undefined
const settingsFromTextInputViewModel = <ViewModelType extends TextInputViewModel>(viewModel: ViewModelType): SettingsFromTextInputViewModel<ViewModelType> => {
  return viewModel.value as SettingsFromTextInputViewModel<ViewModelType>
}

type SettingsFromSelectorViewModel<ViewModelType extends SingleSelectorViewModel> =
  keyof SettingsFromArrayOfSelectorOptions<ViewModelType["options"]> extends never ? ViewModelType["options"][number]["id"]
  : {
    VALUE: ViewModelType["options"][number]["id"]
    SETTINGS: Expand<SettingsFromArrayOfSelectorOptions<ViewModelType["options"]>>
  }
const settingsFromSelectorViewModel = <ViewModelType extends SingleSelectorViewModel>(viewModel: ViewModelType): SettingsFromSelectorViewModel<ViewModelType> => {
  const optionIds = viewModel.options.map((option) => { return option.id })
  const optionSettings = settingsFromArrayOfSelectorOptions(viewModel.options, optionIds)
  
  if (Object.keys(optionSettings).length > 0) {
    return {
      VALUE: viewModel.selectedOptionId,
      SETTINGS: optionSettings,
    } as SettingsFromSelectorViewModel<ViewModelType>
  } else {
    return viewModel.selectedOptionId as SettingsFromSelectorViewModel<ViewModelType>
  }
}

type SettingsFromSimpleMultiSelectorViewModel<ViewModelType extends SimpleMultiSelectorViewModel> = ViewModelType["options"][number]["id"][]
const settingsFromSimpleMultiSelectorViewModel = <ViewModelType extends SimpleMultiSelectorViewModel>(viewModel: ViewModelType): SettingsFromSimpleMultiSelectorViewModel<ViewModelType> => {
  return viewModel.selectedOptionIds as SettingsFromSimpleMultiSelectorViewModel<ViewModelType>
}

type SettingsFromConfigurableMultiSelectorViewModel<ViewModelType extends ConfigurableMultiSelectorViewModel> = Expand<Partial<SettingsFromArrayOfSelectorOptions<ViewModelType["options"]>>>
const settingsFromConfigurableMultiSelectorViewModel = <ViewModelType extends ConfigurableMultiSelectorViewModel>(viewModel: ViewModelType): SettingsFromConfigurableMultiSelectorViewModel<ViewModelType> => {
  const optionSettings = settingsFromArrayOfSelectorOptions(viewModel.options, viewModel.selectedOptionIds)
  return optionSettings as SettingsFromConfigurableMultiSelectorViewModel<ViewModelType>
}

type SettingsFromArrayOfSelectorOptions<ArrayType extends SelectorOption[]> = {
  [OptionType in ArrayType[number] as OptionType extends ConfigurableSelectorOption ? OptionType["id"] : never]: SettingsFromSelectorOption<OptionType>
}
const settingsFromArrayOfSelectorOptions = <ArrayType extends SelectorOption[]>(options: ArrayType, allowedIds: ArrayType[number]["id"][]): SettingsFromArrayOfSelectorOptions<ArrayType> => {
  return reduceArrayIntoRecord(options, (result, option) => {
    if ("viewModels" in option && allowedIds.includes(option.id)) {
      result[option.id] = settingsFromSelectorOption(option) as SettingsFromSelectorOption<ArrayType[number]>
    }
  }) as SettingsFromArrayOfSelectorOptions<ArrayType>
}

type SettingsFromSelectorOption<OptionType extends SelectorOption> =
  OptionType extends ConfigurableSelectorOption ? Expand<SettingsFromConfigurableSelectorOption<OptionType>>
  : undefined
const settingsFromSelectorOption = <OptionType extends SelectorOption>(option: OptionType): SettingsFromSelectorOption<OptionType> => {
  if ("viewModels" in option) {
    return settingsFromConfigurableSelectorOption(option) as SettingsFromSelectorOption<OptionType>
  } else {
    return undefined as SettingsFromSelectorOption<OptionType>
  }
}

type SettingsFromConfigurableSelectorOption<OptionType extends ConfigurableSelectorOption> = {
  [ViewModelType in OptionType["viewModels"][number] as ViewModelType["id"]]: SettingsFromInputViewModel<ViewModelType>
}
const settingsFromConfigurableSelectorOption = <OptionType extends ConfigurableSelectorOption>(option: OptionType): SettingsFromConfigurableSelectorOption<OptionType> => {
  return reduceArrayIntoRecord(option.viewModels, (optionSettings, viewModel) => {
    optionSettings[viewModel.id] = settingsFromInputViewModel(viewModel) as SettingsFromInputViewModel<OptionType["viewModels"][number]>
  }) as SettingsFromConfigurableSelectorOption<OptionType>
}

type SettingsFromInputViewModel<ViewModelType extends InputViewModel> =
  ViewModelType extends IntegerInputViewModel ? SettingsFromIntegerInputViewModel<ViewModelType>
  : ViewModelType extends TextInputViewModel ? SettingsFromTextInputViewModel<ViewModelType>
  : ViewModelType extends SingleSelectorViewModel ? Expand<SettingsFromSelectorViewModel<ViewModelType>>
  : ViewModelType extends SimpleMultiSelectorViewModel ? Expand<SettingsFromSimpleMultiSelectorViewModel<ViewModelType>>
  : ViewModelType extends ConfigurableMultiSelectorViewModel ? Expand<SettingsFromConfigurableMultiSelectorViewModel<ViewModelType>>
  : ViewModelType extends ToggleViewModel ? SettingsFromToggleViewModel<ViewModelType>
  : never
const settingsFromInputViewModel = <SubViewModelType extends InputViewModel>(subViewModel: SubViewModelType): SettingsFromInputViewModel<SubViewModelType> => {
  switch (subViewModel.type) {
  case "INTEGER_INPUT": {
    return settingsFromIntegerInputViewModel(subViewModel) as SettingsFromInputViewModel<SubViewModelType>
  }
  case "TEXT_INPUT": {
    return settingsFromTextInputViewModel(subViewModel) as SettingsFromInputViewModel<SubViewModelType>
  }
  case "SINGLE_SELECTOR": {
    return settingsFromSelectorViewModel(subViewModel) as SettingsFromInputViewModel<SubViewModelType>
  }
  case "SIMPLE_MULTI_SELECTOR": {
    return settingsFromSimpleMultiSelectorViewModel(subViewModel) as SettingsFromInputViewModel<SubViewModelType>
  }
  case "CONFIGURABLE_MULTI_SELECTOR": {
    return settingsFromConfigurableMultiSelectorViewModel(subViewModel) as SettingsFromInputViewModel<SubViewModelType>
  }
  case "TOGGLE": {
    return settingsFromToggleViewModel(subViewModel) as SettingsFromInputViewModel<SubViewModelType>
  }
  default: {
    const unhandledCase: never = subViewModel
    throw new Error(`Unhandled case: ${unhandledCase}`)
  }
  }
}