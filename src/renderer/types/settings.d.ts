type CategoryLayout = "column" | "row"

type Category = {
  id: string,
  title: string,
  description?: string,
  subcategories?: Category[],
  settings?: Setting[],
  layout?: CategoryLayout,
}

type Setting = BaseSetting & (IntegerSetting | SelectionSetting)

type BaseSetting = {
  id: string,
  title: string,
  description?: string,
}

type IntegerSetting = {
  type: "integer",
  min: number,
  max: number,
  default: number,
  preset?: number,
}

type SelectionSetting = {
  type: "selection"
  maxSelections?: number,
  values: SelectionSettingValue[],
}

type SelectionSettingValue = {
  id: string,
  name: string,
  description?: string,
  setting?: Setting,
}