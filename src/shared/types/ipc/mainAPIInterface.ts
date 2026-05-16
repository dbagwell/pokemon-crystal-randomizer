import type { PlayerOptions, Settings } from "@shared/appData/settingsFromViewModel"

export interface MainAPIInterface {
  
  getPresetSettings(presetId: string): Promise<APIResponse<unknown | undefined>>
  
  getPlayerOptions(): Promise<APIResponse<unknown | undefined>>
  
  getInitialAppData(): Promise<APIResponse<{
    appVersion: string,
    presetId: string,
    settings: unknown | undefined
    playerOptions: unknown | undefined
    customPresetNames: string[]
    logPreference: boolean
    createPatchPreference: boolean
  }>>
  
  saveSettings(settings: Settings, name: string): Promise<VoidAPIResponse>
  
  getSavedSettings(name: string): Promise<APIResponse<unknown | undefined>>
  
  savePlayerOptions(playerOptions: PlayerOptions): Promise<VoidAPIResponse>
  
  removeSavedSettings(name: string): Promise<VoidAPIResponse>
  
  generateROM(
    seed: string | undefined,
    settings: Settings,
    playerOptions: PlayerOptions,
    presetId: string,
    shouldGenerateLog: boolean,
    createPatch: boolean,
  ): Promise<VoidAPIResponse>
  
  exportSettings(settings: Settings): Promise<VoidAPIResponse>
  
  processInput(params: ProcessInputRequestParams): Promise<void>
  
  processReleaseNotesResponse(params: ProcessReleaseNotesRequestParams): Promise<void>
  
}

export type VoidAPIResponse = {
  message?: string,
}

export type APIResponse<Result> = {
  message?: string,
  result: Result,
}

export type ProcessInputRequestParams = {
  requestId: string,
  inputValue: any,
}

export type ProcessReleaseNotesRequestParams = {
  requestId: string,
  selectedAction: "UPDATE" | "IGNORE" | "SKIP",
}