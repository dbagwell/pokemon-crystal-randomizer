import type { PlayerOptions, Settings } from "@shared/appData/settingsFromViewModel"
import type { GameData } from "@shared/types/gameData/gameData"

export type GenerateParams = {
  appVersion: string
  seed?: string
  settings: Settings
  playerOptions: PlayerOptions
  inputROM: Uint8Array
  gameData?: GameData
  shouldAddAPChanges: boolean
  shouldCreateROM: boolean
  shouldCreateLog: boolean
  shouldCreatePatch: boolean
  shouldCreateGameData: boolean
}

export type GenerateResult = {
  checkValue: string
  rom?: Uint8Array
  log?: string
  namesLog?: string
  patch?: Uint8Array
  gameData: GameData
}

export type PatchParams = {
  inputROM: Uint8Array
  patchData: Uint8Array
}

export type PatchResult = {
  rom: Uint8Array
  patchInfo?: any
}

export type ApplyPlayerOptionsParams = {
  seed: string
  settings: Settings
  playerOptions: PlayerOptions
  rom: Uint8Array
}

export type ApplyPlayerOptionsResult = {
  rom: Uint8Array
  namesLog?: string
}

export type WorkerParams = {
  jobId: "generate"
  jobParams: GenerateParams
} | {
  jobId: "patch"
  jobParams: PatchParams
} | {
  jobId: "applyPlayerOptions"
  jobParams: ApplyPlayerOptionsParams
}