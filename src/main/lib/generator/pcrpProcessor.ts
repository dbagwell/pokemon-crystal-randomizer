import { applyPlayerOptionsToROM, writeRomData } from "@lib/generator/generator"
import { getPlayerOptions, listenForPlayerOptions } from "@lib/userData/userData"
import { getVanillaROM } from "@lib/userData/vanillaROM"
import { forceCloseWindow, showWindow } from "@lib/utils/windowManager"
import { applyPlayerOptionsToViewModel } from "@shared/appData/applySettingsToViewModel"
import { defaultPlayerOptionsViewModel } from "@shared/appData/defaultPlayerOptionsViewModel"
import { playerOptionsFromViewModel, type Settings } from "@shared/appData/settingsFromViewModel"
import { bytesFrom, isNotNullish, isNullish, isObject, isSemanticVersion, isSemanticVersionLower, numberFrom } from "@shared/utils"
import { app, dialog, shell } from "electron"
import fs from "fs"
import { compressToUint8Array, decompressFromUint8Array } from "lz-string"
import path from "path"
import yaml from "yaml"
import { crc32 } from "zlib"

export const createPCRP = (params: {
  inputROMData: Buffer
  sharedOutputROMData: Buffer
  settings: Settings
}) => {
  const {
    inputROMData,
    sharedOutputROMData,
    settings,
  } = params
  
  const encode = (value: number) => {
    const result = []
    let remainder = value
    
    while (remainder >= 0) {
      let byte = remainder & 0b01111111
      remainder >>= 7
      
      if (remainder === 0) {
        byte += 0b10000000
      }
      
      result.push(byte)
      remainder--
    }
    
    return Buffer.from(result)
  }
  
  const metadata = Buffer.from(compressToUint8Array(yaml.stringify({
    settingsVersion: app.getVersion(),
    minimumSupportedVersion: "0.3.0",
    settings: settings,
  })))
  
  const buffers: Buffer[] = []
   
  buffers.push(Buffer.from("BPS1", "ascii"))
  buffers.push(encode(inputROMData.length))
  buffers.push(encode(sharedOutputROMData.length))
  buffers.push(encode(metadata.length))
  buffers.push(metadata)
  
  let currentAction: {
    action: 0
    length: number
  } | {
    action: 1
    data: number[]
  } | undefined
  
  const processCurrentAction = () => {
    if (isNullish(currentAction)) {
      return
    }
    
    if (currentAction.action === 0) {
      buffers.push(encode(currentAction.action | currentAction.length - 1 << 2))
    } else if (currentAction.action === 1) {
      buffers.push(encode(currentAction.action | currentAction.data.length - 1 << 2))
      buffers.push(Buffer.from(currentAction.data))
    }
  }
  
  sharedOutputROMData.forEach((byte, index) => {
    let action: number | undefined
    if (inputROMData[index] === byte) {
      action = 0
    } else {
      action = 1
    }
    
    if (action !== currentAction?.action) {
      processCurrentAction()
      
      if (action === 0) {
        currentAction = {
          action: action,
          length: 0,
        }
      } else if (action === 1) {
        currentAction = {
          action: action,
          data: [],
        }
      }
    }
    
    if (currentAction?.action === 0) {
      currentAction.length++
    } else if (currentAction?.action === 1) {
      currentAction.data.push(byte)
    }
  })
  
  processCurrentAction()
  
  buffers.push(Buffer.from(bytesFrom(crc32(inputROMData), 4)))
  buffers.push(Buffer.from(bytesFrom(crc32(sharedOutputROMData), 4)))
  
  const data = Buffer.concat(buffers)
  
  return Buffer.concat([
    data,
    Buffer.from(bytesFrom(crc32(data), 4)),
  ])
}

export const handlePCRPFile = async (filePath: string) => {
  try {
    const patchData = fs.readFileSync(filePath)
    const vanillaROMData = await getVanillaROM(false)
      
    if (isNullish(vanillaROMData)) {
      throw new Error("A Pokémon Crystal Version 1.1 ROM is required.")
    }
    
    let currentIndex = 0
    
    const getBytes = (count: number) => {
      const bytes = patchData.subarray(currentIndex, currentIndex + count)
      currentIndex += count
      return bytes
    }
    
    const getNumber = (signed?: boolean) => {
      let value = 0
      let shift = 1
      
      let byte = 0
      do {
        byte = getBytes(1)[0]
        value += (byte & 0b01111111) * shift
        
        if ((byte & 0b10000000) === 0) {
          shift <<= 7
          value += shift
        }
      } while ((byte & 0b10000000) === 0)
      
      if (signed) {
        return ((value & 0b1) === 1 ? -1 : 1) * (value >> 1)
      } else {
        return value
      }
    }
    
    const formatDeclartion = getBytes(4).toString("ascii")
    
    if (formatDeclartion !== "BPS1") {
      throw new Error(`Unable to decode file '${filePath}' because it is in an incorrect format.`)
    }
    
    getNumber() // source size
    const targetSize = getNumber() // target size
    
    const metadataSize = getNumber()
    const metadata = getBytes(metadataSize)
    const infoString = decompressFromUint8Array(metadata)
    const info = isNotNullish(infoString) ? yaml.parse(infoString) : undefined
    
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
      !isObject(info)
      || !isSemanticVersion(info.settingsVersion)
      || !isSemanticVersion(info.minimumSupportedVersion)
      || !isObject(info.settings)
    ) {
      shouldApplyPlayerOptions = false
      continuePatching = showWarning("The patch file is missing information that would allow it to safely apply your custom player options. Generate the ROM with the default player options?")
    } else if (isSemanticVersionLower(app.getVersion(), info.minimumSupportedVersion)) {
      shouldApplyPlayerOptions = false
      continuePatching = showWarning(`The patch file does not support applying custom player options using a version of Pokémon Crystal Randomizer lower than ${info.minimumSupportedVersion}. Generate the ROM with the default player options?`)
    } else if (isSemanticVersionLower(info.settingsVersion, "0.3.0")) {
      shouldApplyPlayerOptions = false
      continuePatching = showWarning(`The patch file was created using Pokémon Crystal Randomizer version ${info.settingsVersion}, but the current version doesn't support applying custom player options using patches created with that version. Generate the ROM with the default player options?`)
    }
    
    if (!continuePatching) {
      return
    }
    
    const newROMData = Buffer.alloc(targetSize)
    let outputOffset = 0
    let sourceRelativeOffset = 0
    let targetRelativeOffset = 0
    
    while (currentIndex < patchData.length - 12) {
      const actionInfo = getNumber()
      const action = actionInfo & 0b11
      const actionLength = (actionInfo >> 2) + 1
      
      if (action === 0) {
        const bytes = vanillaROMData.subarray(outputOffset, outputOffset + actionLength)
        newROMData.set(bytes, outputOffset)
      } else if (action === 1) {
        newROMData.set(getBytes(actionLength), outputOffset)
      } else if (action === 2) {
        sourceRelativeOffset += getNumber(true)
        const bytes = vanillaROMData.subarray(sourceRelativeOffset, sourceRelativeOffset + actionLength)
        newROMData.set(bytes, outputOffset)
        sourceRelativeOffset += actionLength
      } else {
        targetRelativeOffset += getNumber(true)
        let writeIndex = outputOffset
        for (let remainingLength = actionLength; remainingLength > 0; remainingLength--) {
          newROMData[writeIndex] = newROMData[targetRelativeOffset]
          writeIndex++
          targetRelativeOffset++
        }
      }
      
      outputOffset += actionLength
    }
    
    const sourceChecksum = numberFrom([...getBytes(4)])
    const targetChecksum = numberFrom([...getBytes(4)])
    const patchChecksum = numberFrom([...getBytes(4)])
    
    if (sourceChecksum !== crc32(vanillaROMData)) {
      throw new Error("Unable to apply patch. Patch was created using a different source ROM.")
    }
    
    if (targetChecksum !== crc32(newROMData)) {
      throw new Error("Error appling patch. Patched ROM checksum doesn't match.")
    }
    
    if (patchChecksum !== crc32(patchData.subarray(0, patchData.length - 4))) {
      throw new Error("Unable to apply patch. Patch is corrupted.")
    }
    
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
    
      applyPlayerOptionsToROM({
        settings: info.settings as Settings,
        playerOptions: playerOptionsFromViewModel(playerOptionsViewModel),
        romData: newROMData,
      })
    }
    
    const fileInfo = writeRomData({
      fileData: newROMData,
      forcePromptForLocation: false,
      defaultFileName: filePath.replace(new RegExp(`${path.basename(filePath)}$`), path.basename(filePath, ".pcrp")),
    })
    
    shell.openPath(fileInfo.fullOutputFilePath)
  } catch (error) {
    throw new Error(`Error patching ROM:\n\n${error}`)
  }
}