import { isNotNullish } from "@shared/utils"
import { dialog } from "electron"
import fs from "fs"

export const attemptWriteFile = (params: {
  dialogTitle?: string
  buttonLabel?: string
  fileType: "text" | "yaml" | "gbc" | "pcrp"
  defaultFilePath: string
  data: string | NodeJS.ArrayBufferView,
}) => {
  const {
    dialogTitle,
    buttonLabel,
    fileType,
    defaultFilePath,
    data,
  } = params
  
  try {
    fs.writeFileSync(defaultFilePath, data, { flag: "wx" })
    return defaultFilePath
  } catch {
    const filePath = getFilePathFromUserInput({
      dialogTitle: dialogTitle,
      buttonLabel: buttonLabel,
      fileType: fileType,
      defaultFilePath: defaultFilePath,
    })
          
    if (isNotNullish(filePath)) {
      fs.writeFileSync(filePath, data)
    }
    
    return filePath
  }
}

export const getFilePathFromUserInput = (params: {
  dialogTitle?: string
  buttonLabel?: string
  fileType: "text" | "yaml" | "gbc" | "pcrp"
  defaultFilePath: string
}) => {
  const {
    dialogTitle,
    buttonLabel,
    fileType,
    defaultFilePath,
  } = params
  
  return dialog.showSaveDialogSync({
    title: dialogTitle ?? "Save file to:",
    defaultPath: defaultFilePath,
    filters: [
      fileType === "text" ? {
        name: "Text File",
        extensions: [
          ".txt",
        ],
      } : fileType === "yaml" ? {
        name: "YAML",
        extensions: [
          ".yml",
          ".yaml",
        ],
      } : fileType === "gbc" ? {
        name: "Game Boy Color ROM",
        extensions: [
          ".gbc",
        ],
      } : {
        name: "Pokémon Crystal Randomizer Patch",
        extensions: [
          ".pcrp",
        ],
      },
    ],
    buttonLabel: buttonLabel ?? "Save",
    properties: [
      "showOverwriteConfirmation",
    ],
  })
}