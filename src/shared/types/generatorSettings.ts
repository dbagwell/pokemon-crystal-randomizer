type Dictionary<Element> = { [key: string]: Element }

export type GeneratorSettingSpec = {
  id: string,
  title: string,
  description?: string,
  category?: string,
  type: GeneratorSettingType,
  max?: number,
  min?: number,
  values?: GeneratorSettingValueSpec[],
  valueTypes?: Dictionary<GeneratorSettingValueType>,
  defaultValue?: any,
}

export type GeneratorSettingValueType = {
  max?: number,
  input?: GeneratorSettingSpec,
}

export type GeneratorSettingType = "boolean" | "integer" | "item" | "array"

export type GeneratorSettingValueSpec = {
  id: string,
  name: string,
  description?: string,
  value?: string,
  type?: string,
}

export type GeneratorSetting = {
  id: string,
  value: any,
}