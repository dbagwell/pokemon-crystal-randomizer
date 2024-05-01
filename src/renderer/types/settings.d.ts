type CategoryLayout = "column" | "row"

type Category = {
  id: string,
  title: string,
  description?: string,
  subcategories?: Category[],
  settings?: Setting[],
  layout?: CategoryLayout,
}

type Setting = BooleanSetting | IntegerSetting | SelectionSetting | MultiselectSetting

type BaseSetting = {
  id: string,
  title: string,
  description?: string,
  preset?: any,
}

type BooleanSetting = BaseSetting & {
  type: "boolean",
  settings?: Setting[],
}

type IntegerSetting = BaseSetting & {
  type: "integer",
  min: number,
  max: number,
  default: number,
}

type SelectionSetting = BaseSetting & {
  type: "selection"
  values: SelectionSettingValue[],
}

type MultiselectSetting = BaseSetting & {
  type: "multiselect"
  maxSelections?: number,
  values: SelectionSettingValue[],
}

type SelectionSettingValue = {
  id: string,
  name: string,
  description?: string,
  setting?: Setting,
}