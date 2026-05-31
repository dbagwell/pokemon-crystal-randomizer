import type { ButtonId } from "@shared/appData/buttonIds"
import type { defaultPlayerOptionsViewModel } from "@shared/appData/defaultPlayerOptionsViewModel"
import type { defaultSettingsViewModel } from "@shared/appData/defaultSettingsViewModel"

// Integer Input View Model

export type IntegerInputViewModel = ReturnType<typeof createIntegerInputViewModel>
export const createIntegerInputViewModel = <IdType extends string, IsRequiredType extends boolean>(params: {
  id: IdType
  name: string
  description?: string
  min?: number
  max?: number
  isRequired: IsRequiredType
  value: IsRequiredType extends true ? number : number | undefined
}) => {
  return {
    ...params,
    type: "INTEGER_INPUT" as const,
  }
}

// Integer Input Group View Model

export type IntegerInputGroupViewModel = ReturnType<typeof createIntegerInputGroupViewModel>
export const createIntegerInputGroupViewModel = <IdType extends string>(params: {
  id: IdType
  name: string
  description?: string
  min: number
  max: number
  sum?: number
  values: number[]
}) => {
  return {
    ...params,
    type: "INTEGER_INPUT_GROUP" as const,
  }
}

// Integer Range Input View Model

export type IntegerRangeInputViewModel = ReturnType<typeof createIntegerRangeInputViewModel>
export const createIntegerRangeInputViewModel = <IdType extends string>(params: {
  id: IdType
  name?: string
  description?: string
  min: number
  max: number
  selectedMinValue: number
  selectedMaxValue: number
}) => {
  return {
    ...params,
    type: "INTEGER_RANGE_INPUT" as const,
  }
}

// Text Input View Model

export type TextInputViewModel = ReturnType<typeof createTextInputViewModel>
export const createTextInputViewModel = <IdType extends string, IsRequiredType extends boolean>(params: {
  id: IdType
  name: string
  description?: string
  maxCharacters?: number
  maxInGameCharacters?: number
  isRequired: IsRequiredType
  value: IsRequiredType extends true ? string : string | undefined
}) => {
  return {
    ...params,
    type: "TEXT_INPUT" as const,
  }
}

// Multiline Text Input View Model

export type MultilineTextInputViewModel = ReturnType<typeof createMultilineTextInputViewModel>
export const createMultilineTextInputViewModel = <IdType extends string>(params: {
  id: IdType
  name?: string
  value?: string
}) => {
  return {
    ...params,
    type: "MULTILINE_TEXT_INPUT" as const,
  }
}

// Single Selector View Model

export type SingleSelectorViewModel = ReturnType<typeof createSingleSelectorViewModel>
export const createSingleSelectorViewModel = <IdType extends string, SelectedOptionIdType extends OptionType["id"], OptionType extends SelectorOption>(params: {
  id: IdType
  name?: string
  description?: string
  selectedOptionId: SelectedOptionIdType
  options: OptionType[]
}) => {
  return {
    ...params,
    type: "SINGLE_SELECTOR" as const,
  }
}

// Multi Selector View Models

export type SimpleMultiSelectorViewModel = ReturnType<typeof createSimpleMultiSelectorViewModel>
export const createSimpleMultiSelectorViewModel = <IdType extends string, SelectedOptionIdType extends OptionType["id"], OptionType extends SimpleSelectorOption>(params: {
  id: IdType
  name: string
  description?: string
  maxSelections?: number
  options: OptionType[]
}) => {
  return {
    selectedOptionIds: [] as SelectedOptionIdType[],
    ...params,
    type: "SIMPLE_MULTI_SELECTOR" as const,
  }
}

export type ConfigurableMultiSelectorViewModel = ReturnType<typeof createConfigurableMultiSelectorViewModel>
export const createConfigurableMultiSelectorViewModel = <IdType extends string, SelectedOptionIdType extends OptionType["id"], OptionType extends ConfigurableSelectorOption>(params: {
  id: IdType
  name: string
  description?: string
  maxSelections?: number
  options: OptionType[]
}) => {
  return {
    selectedOptionIds: [] as SelectedOptionIdType[],
    ...params,
    type: "CONFIGURABLE_MULTI_SELECTOR" as const,
  }
}

export type GroupMultiSelectorViewModel = ReturnType<typeof createGroupMultiSelectorViewModel>
export const createGroupMultiSelectorViewModel = <IdType extends string, SelectedOptionIdType extends OptionType["id"], OptionType extends SimpleSelectorOption>(params: {
  id: IdType
  name: string
  description?: string
  options: OptionType[]
}) => {
  return {
    selectedOptionIds: [] as SelectedOptionIdType[][],
    ...params,
    type: "GROUP_MULTI_SELECTOR" as const,
  }
}

// Selector Options

export type SelectorOption = SimpleSelectorOption | ConfigurableSelectorOption

export type SimpleSelectorOption = ReturnType<typeof createSimpleSelectorOption>
export const createSimpleSelectorOption = <IdType extends string | number>(params: {
  id: IdType
  name: string
  description?: string
  extraKeywords?: string
}) => {
  return params
}

export type ConfigurableSelectorOption = ReturnType<typeof createConfigurableSelectorOption>
export const createConfigurableSelectorOption = <IdType extends string, ViewModelArrayType extends InputViewModelArray>(params: {
  id: IdType,
  name: string,
  description?: string,
  extraKeywords?: string
  viewModels: ViewModelArrayType,
}) => {
  return params
}

// Toggle View Models

export type ToggleViewModel = SimpleToggleViewModel | ConfigurableToggleViewModel

export type SimpleToggleViewModel = ReturnType<typeof createSimpleToggleViewModel>
export const createSimpleToggleViewModel = <IdType extends string>(params: {
  id: IdType
  name: string
  description?: string
  isOn?: boolean
}) => {
  const { isOn: _, ...props } = params
  return {
    isOn: params.isOn ?? false,
    ...props,
    type: "TOGGLE" as const,
  }
}

export type ConfigurableToggleViewModel = ReturnType<typeof createConfigurableToggleViewModel>
export const createConfigurableToggleViewModel = <IdType extends string, ViewModelsType extends InputViewModelArray>(params: {
  id: IdType
  name: string
  description?: string
  isOn?: boolean
  viewModels: ViewModelsType
}) => {
  const { isOn: _, ...props } = params
  return {
    isOn: params.isOn ?? false,
    ...props,
    type: "TOGGLE" as const,
  }
}

// Input Group List

export type InputGroupListViewModel = ReturnType<typeof createInputGroupListViewModel>
export const createInputGroupListViewModel = <IdType extends string, ViewModelsType extends InputViewModelArray>(params: {
  id: IdType
  name: string
  description?: string
  itemName: string
  createGroupFunction: () => ViewModelsType
  groups: ViewModelsType[]
}) => {
  return {
    ...params,
    type: "INPUT_GROUP_LIST" as const,
  }
}

// Button

export type ButtonViewModel = ReturnType<typeof createButtonViewModel>
export const createButtonViewModel = (params: {
  id: ButtonId
  name: string
}) => {
  return {
    ...params,
    type: "BUTTON" as const,
  }
}

// Input View Models

export type InputViewModel =
  IntegerInputViewModel
  | IntegerInputGroupViewModel
  | IntegerRangeInputViewModel
  | TextInputViewModel
  | MultilineTextInputViewModel
  | SingleSelectorViewModel
  | SimpleMultiSelectorViewModel
  | ConfigurableMultiSelectorViewModel
  | GroupMultiSelectorViewModel
  | ToggleViewModel
  | InputGroupListViewModel
  | ButtonViewModel
type InputViewModelArray = InputViewModel[] | [] // Workaround to suppress circular type reference error

// Tab View Model

export type TabViewModel = ReturnType<typeof createTabViewModel>
export const createTabViewModel = <ViewModelType extends ToggleViewModel | SimpleMultiSelectorViewModel>(params: {
  id: string
  name: string
  viewModels: ViewModelType[]
}) => {
  return params
}

// App View Model

export type SettingsViewModel = ReturnType<typeof defaultSettingsViewModel>
export type PlayerOptionsViewModel = ReturnType<typeof defaultPlayerOptionsViewModel>