import type {
  AppViewModel,
  ConfigurableMultiSelectorViewModel,
  ConfigurableSelectorOption,
  GroupMultiSelectorViewModel,
  InputViewModel,
  IntegerInputGroupViewModel,
  IntegerInputViewModel,
  PlayerOptionsViewModels,
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

export type SettingsFromPlayerOptionsViewModels = SettingsFromArrayOfToggleViewModels<PlayerOptionsViewModels>
export const settingsFromPlayerOptionsModels = (viewModels: PlayerOptionsViewModels): SettingsFromPlayerOptionsViewModels => {
  return settingsFromArrayOfToggleViewModels(viewModels) as SettingsFromPlayerOptionsViewModels
}

export type SettingsFromAppViewModel = ObjectFromIntersectionOfArrayValues<ArrayOfSettingsFromArrayOfTabViewModels<AppViewModel["tabViewModels"]>>
export const settingsFromAppViewModel = (appViewModel: AppViewModel): SettingsFromAppViewModel => {
  return Object.assign({}, ...appViewModel.tabViewModels.map((tabViewModel) => {
    return settingsFromTabViewModel(tabViewModel)
  })) as SettingsFromAppViewModel
}

type SettingsFromTabViewModel<ViewModelType extends TabViewModel> = SettingsFromArrayOfToggleViewModels<ViewModelType["viewModels"]>
const settingsFromTabViewModel = <ViewModelType extends TabViewModel>(viewModel: ViewModelType): SettingsFromTabViewModel<ViewModelType> => {
  return settingsFromArrayOfToggleViewModels(viewModel.viewModels) as SettingsFromTabViewModel<ViewModelType>
}

type SettingsFromArrayOfToggleViewModels<ArrayType extends InputViewModel[]> = {
  [ViewModelType in ArrayType[number] as ViewModelType["id"]]: SettingsFromInputViewModel<ViewModelType>
}
const settingsFromArrayOfToggleViewModels = <ArrayType extends InputViewModel[]>(viewModels: ArrayType): SettingsFromArrayOfToggleViewModels<ArrayType> => {
  return reduceArrayIntoRecord(viewModels, (result, viewModel) => {
    result[viewModel.id] = settingsFromInputViewModel(viewModel) as SettingsFromInputViewModel<ArrayType[number]>
  }) as SettingsFromArrayOfToggleViewModels<ArrayType>
}

type SettingsFromToggleViewModel<ViewModelType extends ToggleViewModel> =
  ViewModelType extends { viewModels: InputViewModel[] } ? {
    VALUE: boolean
    SETTINGS: SettingsFromArrayOfInputViewModels<ViewModelType["viewModels"]>
  }
  : boolean
const settingsFromToggleViewModel = <ViewModel extends ToggleViewModel>(viewModel: ViewModel): SettingsFromToggleViewModel<ViewModel> => {
  if ("viewModels" in viewModel) {
    return {
      VALUE: viewModel.isOn,
      SETTINGS: settingsFromArrayOfInputViewModels(viewModel.viewModels),
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

type SettingsFromIntegerInputGroupViewModel = number[]
const settingsFromIntegerInputGroupViewModel = <ViewModelType extends IntegerInputGroupViewModel>(viewModel: ViewModelType): SettingsFromIntegerInputGroupViewModel => {
  return viewModel.values as SettingsFromIntegerInputGroupViewModel
}

type SettingsFromTextInputViewModel<ViewModelType extends TextInputViewModel> = ViewModelType extends { isRequired: true } ? string : string | undefined
const settingsFromTextInputViewModel = <ViewModelType extends TextInputViewModel>(viewModel: ViewModelType): SettingsFromTextInputViewModel<ViewModelType> => {
  return viewModel.value as SettingsFromTextInputViewModel<ViewModelType>
}

type SettingsFromSelectorViewModel<ViewModelType extends SingleSelectorViewModel> =
  keyof SettingsFromArrayOfSelectorOptions<ViewModelType["options"]> extends never ? ViewModelType["options"][number]["id"]
  : {
    VALUE: ViewModelType["options"][number]["id"]
    SETTINGS: SettingsFromArrayOfSelectorOptions<ViewModelType["options"]>
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

type SettingsFromConfigurableMultiSelectorViewModel<ViewModelType extends ConfigurableMultiSelectorViewModel> = Partial<SettingsFromArrayOfSelectorOptions<ViewModelType["options"]>>
const settingsFromConfigurableMultiSelectorViewModel = <ViewModelType extends ConfigurableMultiSelectorViewModel>(viewModel: ViewModelType): SettingsFromConfigurableMultiSelectorViewModel<ViewModelType> => {
  const optionSettings = settingsFromArrayOfSelectorOptions(viewModel.options, viewModel.selectedOptionIds)
  return optionSettings as SettingsFromConfigurableMultiSelectorViewModel<ViewModelType>
}

type SettingsFromGroupMultiSelectorViewModel<ViewModelType extends GroupMultiSelectorViewModel> = ViewModelType["options"][number]["id"][][]
const settingsFromGroupMultiSelectorViewModel = <ViewModelType extends GroupMultiSelectorViewModel>(viewModel: ViewModelType): SettingsFromGroupMultiSelectorViewModel<ViewModelType> => {
  return viewModel.selectedOptionIds as SettingsFromGroupMultiSelectorViewModel<ViewModelType>
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
  OptionType extends ConfigurableSelectorOption ? SettingsFromConfigurableSelectorOption<OptionType>
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
  : ViewModelType extends IntegerInputGroupViewModel ? SettingsFromIntegerInputGroupViewModel
  : ViewModelType extends TextInputViewModel ? SettingsFromTextInputViewModel<ViewModelType>
  : ViewModelType extends SingleSelectorViewModel ? SettingsFromSelectorViewModel<ViewModelType>
  : ViewModelType extends SimpleMultiSelectorViewModel ? SettingsFromSimpleMultiSelectorViewModel<ViewModelType>
  : ViewModelType extends ConfigurableMultiSelectorViewModel ? SettingsFromConfigurableMultiSelectorViewModel<ViewModelType>
  : ViewModelType extends GroupMultiSelectorViewModel ? SettingsFromGroupMultiSelectorViewModel<ViewModelType>
  : ViewModelType extends ToggleViewModel ? SettingsFromToggleViewModel<ViewModelType>
  : never
const settingsFromInputViewModel = <ViewModelType extends InputViewModel>(viewModel: ViewModelType): SettingsFromInputViewModel<ViewModelType> => {
  switch (viewModel.type) {
  case "INTEGER_INPUT": {
    return settingsFromIntegerInputViewModel(viewModel) as SettingsFromInputViewModel<ViewModelType>
  }
  case "INTEGER_INPUT_GROUP": {
    return settingsFromIntegerInputGroupViewModel(viewModel) as SettingsFromInputViewModel<ViewModelType>
  }
  case "TEXT_INPUT": {
    return settingsFromTextInputViewModel(viewModel) as SettingsFromInputViewModel<ViewModelType>
  }
  case "SINGLE_SELECTOR": {
    return settingsFromSelectorViewModel(viewModel) as SettingsFromInputViewModel<ViewModelType>
  }
  case "SIMPLE_MULTI_SELECTOR": {
    return settingsFromSimpleMultiSelectorViewModel(viewModel) as SettingsFromInputViewModel<ViewModelType>
  }
  case "CONFIGURABLE_MULTI_SELECTOR": {
    return settingsFromConfigurableMultiSelectorViewModel(viewModel) as SettingsFromInputViewModel<ViewModelType>
  }
  case "GROUP_MULTI_SELECTOR": {
    return settingsFromGroupMultiSelectorViewModel(viewModel) as SettingsFromInputViewModel<ViewModelType>
  }
  case "TOGGLE": {
    return settingsFromToggleViewModel(viewModel) as SettingsFromInputViewModel<ViewModelType>
  }
  default: {
    const unhandledCase: never = viewModel
    throw new Error(`Unhandled case: ${unhandledCase}`)
  }
  }
}