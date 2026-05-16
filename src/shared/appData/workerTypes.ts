import type { PlayerOptions, Settings } from "@shared/appData/settingsFromViewModel"

export type GenerateParams = {
  appVersion: string
  seed?: string
  settings: Settings
  playerOptions: PlayerOptions
  inputROM: Uint8Array
  shouldCreateROM: boolean
  shouldCreateLog: boolean
  shouldCreatePatch: boolean
}

export type GenerateResult = {
  checkValue: string
  rom?: Uint8Array
  log?: string
  namesLog?: string
  patch?: Uint8Array
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