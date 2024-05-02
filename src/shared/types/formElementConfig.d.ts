type FormSectionConfig = {
  type: "FormSection",
  label: string,
  description?: string,
  layout: "vertical" | "horizontal",
  subElementConfigs: Dictionary<FormElementConfig>,
} & ({
  hasToggle?: false,
} | {
  hasToggle: true,
  label: string,
  toggleValue: boolean,
})

type ToggleInputConfig = {
  type: "ToggleInput",
  label: string,
  description?: string,
  value: boolean,
}

type TextInputConfig = {
  type: "TextInput"
  label: string,
  description?: string,
  value?: string,
  maxCharacters?: number,
} & ({
  required?: false,
} | {
  required: true,
  value: string,
})

type IntegerInputConfig = {
  type: "IntegerInput"
  label: string,
  description?: string,
  min?: number,
  max?: number,
} & ({
  required: false,
  value?: number,
} | {
  required: true,
  value: number,
})

type SelectorInputOption = {
  id: string,
  label: string,
  description?: string,
  subElementConfigs?: Dictionary<FormElementConfig>,
}

type SelectorInputConfig = {
  type: "SelectorInput",
  label: string,
  description?: string,
  options: SelectorInputOption[],
} & (({
  multiselect: false,
  value?: string,
} & ({
  required?: false,
} | {
  required: true,
  value: string,
})) | ({
  multiselect: true,
  maxSelections?: number,
  selectedOptionIds: string[],
}))

type FormElementConfig =
  | FormSectionConfig
  | ToggleInputConfig
  | TextInputConfig
  | IntegerInputConfig
  | SelectorInputConfig