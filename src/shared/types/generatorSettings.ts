export type GeneratorSettingSpec = {
  id: string,
  title: string,
  description: string,
  category: string,
  type: GeneratorSettingType,
  values?: GeneratorSettingValueSpec[],
}

export type GeneratorSettingType = "boolean" | "integer" | "item" | "array"

export type GeneratorSettingValueSpec = {
  id: string,
  name: string,
  description: string,
}

export type GeneratorSetting = {
  id: string,
  value: any,
}