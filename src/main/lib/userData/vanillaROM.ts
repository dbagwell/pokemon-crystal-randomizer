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
  fs.mkdirSync(romsPath, { recursive: true })
  fs.writeFileSync(vanilla11ROMPath, data)
}

export const getVanillaROM = async (showInputInRenderer: boolean): Promise<Buffer | nullish> => {
  const existingVanillaROM = storedVanillaROM()
  
  if (isNotNullish(existingVanillaROM)) {
    return existingVanillaROM
  }
  
  let fileData: DataView | nullish
  
  if (showInputInRenderer) {
    fileData = await makeRendererAPIRequest(
      (requestId: string) => {
        rendererAPIS["mainWindow"]?.showInputDialog({
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
        resolve: (result: DataView | nullish) => void,
        reject
      ) => {
        if (isNullish(inputValue) || inputValue instanceof DataView) {
          resolve(inputValue)
        } else {
          reject(new Error(`Received invalid input type from input dialog. Expected a file but got input type of '${typeof inputValue}'.`))
        }
      }
    )
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
    
    fileData = new DataView(fs.readFileSync(filePath[0]).buffer)
  }
  
  if (isNullish(fileData)) {
    return undefined
  }
  
  const data = Buffer.from(fileData.buffer)
  
  if (crypto.createHash("md5").update(data).digest("hex") !== ROMInfo.vanillaMD5Hash) {
    throw new Error("The provided file is not a valid ROM of Pokémon Crystal Version 1.1.")
  }
  
  setVanillaROM(data)
  
  return data
}