import { ROMInfo } from "@lib/gameData/romInfo"
import { rendererAPIS } from "@lib/ipc/rendererAPIUtils"
import { makeRendererAPIRequest } from "@lib/ipc/rendererAPIUtils"
import { userDataPath } from "@lib/userData/userData"
import { isNotNullish, isNullish } from "@shared/utils"
import crypto from "crypto"
import { dialog } from "electron"
import fs from "fs"
import path from "path"

const romsPath = path.resolve(userDataPath, "roms")
const vanilla11ROMPath = path.resolve(romsPath, "vanilla11.gbc")

const storedVanillaROM = (): Buffer | undefined => {
  try {
    return fs.readFileSync(vanilla11ROMPath)
  } catch {
    return undefined
  }
}

export const setVanillaROM = async (data: Buffer) => {
  if (crypto.createHash("md5").update(data).digest("hex") !== ROMInfo.vanillaMD5Hash) {
    throw new Error("The provided file is not a valid ROM of Pokémon Crystal Version 1.1.")
  }
  
  fs.mkdirSync(romsPath, { recursive: true })
  fs.writeFileSync(vanilla11ROMPath, data)
}

export const hasVanillaROM = () => {
  return fs.existsSync(vanilla11ROMPath)
}

export const getVanillaROM = async (showInputInRenderer: boolean): Promise<Buffer | undefined> => {
  const existingVanillaROM = storedVanillaROM()
  
  if (isNotNullish(existingVanillaROM)) {
    return existingVanillaROM
  }
  
  let fileData: Buffer | undefined
  
  if (showInputInRenderer) {
    fileData = await makeRendererAPIRequest(
      (requestId: string) => {
        rendererAPIS.generatorWindow?.showInputDialog({
          requestId: requestId,
          title: "ROM Required",
          message: "Please provide a Pokémon Crystal Version 1.1 ROM.",
          inputInfo: {
            title: "Pokémon Crystal '.gbc' File",
            type: "file",
            fileExtension: ".gbc",
          },
          submitButtonLabel: "Continue",
        })
      },
      (
        inputValue: any,
        resolve: (result: Buffer | undefined) => void,
        reject
      ) => {
        if (isNullish(inputValue)) {
          resolve(undefined)
        } else if (inputValue instanceof DataView) {
          resolve(Buffer.from(inputValue.buffer))
        } else {
          reject(new Error(`Received invalid input type from input dialog. Expected a file but got input type of '${typeof inputValue}'.`))
        }
      }
    )
  
    if (isNullish(fileData)) {
      return undefined
    }
  
    setVanillaROM(fileData)
  } else {
    dialog.showMessageBoxSync({
      title: "ROM Required",
      message: "Please provide a Pokémon Crystal Version 1.1 ROM.",
      buttons: [
        "OK",
      ],
    })
    
    const filePath = dialog.showOpenDialogSync({
      title: "Please provide a Pokémon Crystal Version 1.1 ROM.",
      filters: [
        {
          name: "Game Boy Color ROM",
          extensions: [
            "gbc",
          ],
        },
      ],
      buttonLabel: "Use File",
    })
    
    if (isNullish(filePath)) {
      throw new Error("Pokémon Crystal Version 1.1 ROM is required.")
    }
    
    fileData = getVanillaROMData(filePath[0])
  }
  
  return fileData
}

export const getVanillaROMData = (filePath: string) => {
  const data = fs.readFileSync(filePath)
  setVanillaROM(data)
  return data
}