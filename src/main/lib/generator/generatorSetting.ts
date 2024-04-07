import { getYAML } from "@lib/utils/yamlUtils"
import type { GeneratorSettingSpec } from "@shared/types/generatorSettings"
import { validateGeneratorSettingSpec } from "@shared/typeValidators/generatorSettings.validator"
import path from "path"

export const getAllGeneratorSettings = (): GeneratorSettingSpec[] => {
  const dirPath = path.resolve(__dirname, "generatorSettings")
  
  const settingsSpecFileNames = [
    "additionalOptions.yml",
  ]
  
  return settingsSpecFileNames.map((fileName) => {
    const yaml = getYAML([path.resolve(dirPath, fileName)])
    return validateGeneratorSettingSpec(yaml)
  })
}