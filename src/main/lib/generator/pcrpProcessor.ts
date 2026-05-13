import { attemptWriteNamesLogFile, attemptWriteROMFile } from "@lib/generator/generator"
import { performJob } from "@lib/generator/worker"
import { getPlayerOptions, listenForPlayerOptions } from "@lib/userData/userData"
import { getVanillaROM } from "@lib/userData/vanillaROM"
import { forceCloseWindow, showWindow } from "@lib/utils/windowManager"
import { applyPlayerOptionsToViewModel } from "@shared/appData/applySettingsToViewModel"
import { defaultPlayerOptionsViewModel } from "@shared/appData/defaultPlayerOptionsViewModel"
import { type PlayerOptions, playerOptionsFromViewModel, type Settings } from "@shared/appData/settingsFromViewModel"
import { isNotNullish, isNullish, isObject, isSemanticVersion, isSemanticVersionLower } from "@shared/utils"
import { app, dialog, shell } from "electron"
import fs from "fs"

export const handlePCRPFile = async (filePath: string) => {
  try {
    const patchData = fs.readFileSync(filePath)
    const vanillaROMData = await getVanillaROM(false)
    
    const patchResult = await performJob({
      jobId: "patch",
      jobParams: {
        inputROM: vanillaROMData,
        patchData: patchData,
      },
    })
    
    const showWarning = (message: string) => {
      const result = dialog.showMessageBoxSync({
        message: message,
        buttons: [
          "Continue",
          "Cancel",
        ],
      })
    
      if (result === 0) {
        return true
      } else {
        return false
      }
    }
    
    let continuePatching = true
    let shouldApplyPlayerOptions = true
    
    if (
      !isObject(patchResult.patchInfo!)
      || !isSemanticVersion(patchResult.patchInfo!.settingsVersion)
      || !isSemanticVersion(patchResult.patchInfo!.minimumSupportedVersion)
      || !isObject(patchResult.patchInfo!.settings)
    ) {
      shouldApplyPlayerOptions = false
      continuePatching = showWarning("The patch file is missing information that would allow it to safely apply your custom player options. Generate the ROM with the default player options?")
    } else if (isSemanticVersionLower(app.getVersion(), patchResult.patchInfo!.minimumSupportedVersion)) {
      shouldApplyPlayerOptions = false
      continuePatching = showWarning(`The patch file does not support applying custom player options using a version of Pokémon Crystal Randomizer lower than ${patchResult.patchInfo!.minimumSupportedVersion}. Generate the ROM with the default player options?`)
    } else if (isSemanticVersionLower(patchResult.patchInfo!.settingsVersion, "0.3.0")) {
      shouldApplyPlayerOptions = false
      continuePatching = showWarning(`The patch file was created using Pokémon Crystal Randomizer version ${patchResult.patchInfo!.settingsVersion}, but the current version doesn't support applying custom player options using patches created with that version. Generate the ROM with the default player options?`)
    }
    
    if (!continuePatching) {
      return
    }
    
    let validatedPlayerOptions: PlayerOptions | undefined
    let namesLog: string | undefined
    
    if (shouldApplyPlayerOptions) {
      let playerOptions = getPlayerOptions()
      const playerOptionsViewModel = defaultPlayerOptionsViewModel()
    
      if (isNullish(playerOptions)) {
        const window = await showWindow({
          windowType: "PLAYER_OPTIONS",
          width: 350,
          height: 700,
        })
      
        let isWindowClosed = false
      
        const closeWindow = async () => {
          if (!isWindowClosed) {
            forceCloseWindow(window)
          }
        }
      
        window.once("close", () => {
        // For some reason, when the window is closed with a keyboard shortcut, there is a delay before it disappears
        // so when we get the notification that it's about to close, we do our workaround to hide and force close it
          closeWindow()
        })
      
        const closedPromise = new Promise((resolve) => {
          window.once("closed", async () => {
            isWindowClosed = true
          
            // For some reason, the window hasn't fully closed yet, and without this delay there is undefined behaviour that can lead to the app crashing
            setTimeout(() => {
              resolve(undefined)
            }, 1)
          })
        })
      
        const playerOptionsPromise = listenForPlayerOptions()
      
        playerOptions = await Promise.race([
          closedPromise, // The user closed the window without saving, just use the default player options.
          playerOptionsPromise, // Use the new playerOptions set by the user.
        ])
      
        await closeWindow()
      }
    
      applyPlayerOptionsToViewModel(playerOptions, playerOptionsViewModel, [])
      validatedPlayerOptions = playerOptionsFromViewModel(playerOptionsViewModel)
    
      const applyPlayerOptionsResult = await performJob({
        jobId: "applyPlayerOptions",
        jobParams: {
          seed: patchResult.patchInfo!.checkValue ?? filePath,
          settings: patchResult.patchInfo!.settings as Settings,
          playerOptions: validatedPlayerOptions,
          rom: patchResult.rom,
        },
      })
      
      patchResult.rom = applyPlayerOptionsResult.rom
      namesLog = applyPlayerOptionsResult.namesLog
    }
    
    const fileInfo = attemptWriteROMFile({
      fileData: patchResult.rom,
      defaultFilePathWithoutExtension: patchResult.patchInfo!.checkValue,
      forcePromptForLocation: true,
      forceOverwrite: false,
      throwErrorOnWriteFailure: false,
    })
    
    if (isNotNullish(namesLog)) {
      attemptWriteNamesLogFile({
        log: namesLog,
        defaultFilePathWithoutExtension: fileInfo.outputPathWithoutExtension,
        forceOverwrite: false,
        throwErrorOnWriteFailure: false,
      })
    }
    
    shell.openPath(fileInfo.fullOutputFilePath)
  } catch (error) {
    throw new Error(`Error patching ROM:\n\n${error}`, { cause: error })
  }
}