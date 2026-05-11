import type { PlayerOptions, Settings } from "@shared/appData/settingsFromViewModel"

export type GeneratorMethod = "generatorDataFrom" | "applyPlayerOptionsToROM"

export type GeneratorParams = {
  customSeed: string | undefined
  settings: Settings
}

export type PlayerOptionsParams = {
  seed: string
  settings: Settings
  playerOptions: PlayerOptions
  romData: Buffer
}