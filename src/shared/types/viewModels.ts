import type { defaultAppViewModel } from "@shared/appData/defaultAppViewModel"

// Integer Input View Model

export type IntegerInputViewModel = ReturnType<typeof createIntegerInputViewModel>
export const createIntegerInputViewModel = <IdType extends string, IsRequiredType extends boolean>(params: {
  id: IdType
  name?: string
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

// Text Input View Model

export type TextInputViewModel = ReturnType<typeof createTextInputViewModel>
export const createTextInputViewModel = <IdType extends string, IsRequiredType extends boolean>(params: {
  id: IdType
  name?: string
  description?: string
  maxCharacters?: number
  isRequired: IsRequiredType
  value: IsRequiredType extends true ? string : string | undefined
}) => {
  return {
    ...params,
    type: "TEXT_INPUT" as const,
  }
}

// Selector View Model

export type SelectorViewModel = ReturnType<typeof createSelectorViewModel>
export const createSelectorViewModel = <IdType extends string, SelectedOptionIdType extends OptionType["id"], OptionType extends SelectorOption>(params: {
  id: IdType
  name?: string
  description?: string
  selectedOptionId: SelectedOptionIdType
  options: OptionType[]
}) => {
  return {
    ...params,
    type: "SELECTOR" as const,
  }
}

// Selector Options

export type SelectorOption = SimpleSelectorOption | ConfigurableSelectorOption

export type SimpleSelectorOption = ReturnType<typeof createSimpleSelectorOption>
export const createSimpleSelectorOption = <IdType extends string>(params: {
  id: IdType
  name: string
  description?: string
}) => {
  return params
}

export type ConfigurableSelectorOption = ReturnType<typeof createConfigurableSelectorOption>
export const createConfigurableSelectorOption = <IdType extends string, ViewModelArrayType extends InputViewModelubViewModelArray>(params: {
  id: IdType,
  name: string,
  description?: string,
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
  isOn: boolean
}) => {
  return {
    ...params,
    type: "TOGGLE" as const,
  }
}

export type ConfigurableToggleViewModel = ReturnType<typeof createConfigurableToggleViewModel>
export const createConfigurableToggleViewModel = <IdType extends string, SubViewModelsType extends InputViewModelubViewModelArray>(params: {
  id: IdType
  name: string
  description?: string
  isOn: boolean
  subViewModels: SubViewModelsType
}) => {
  return {
    ...params,
    type: "TOGGLE" as const,
  }
}

// Input View Models

export type InputViewModel = IntegerInputViewModel | TextInputViewModel | SelectorViewModel | ToggleViewModel
type InputViewModelubViewModelArray = InputViewModel[] | [] // Workaround to suppress circular type reference error

// Tab View Model

export type TabViewModel = ReturnType<typeof createTabViewModel>
export const createTabViewModel = <SubViewModelType extends ToggleViewModel>(params: {
  id: string
  name: string
  subViewModels: SubViewModelType[]
}) => {
  return params
}

// App View Model

export type AppViewModel = ReturnType<typeof defaultAppViewModel>