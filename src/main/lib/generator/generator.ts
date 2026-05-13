import { performJob } from "@lib/generator/worker"
import { attemptWriteFile, getFilePathFromUserInput } from "@lib/utils/dialogUtils"
import type { GenerateParams } from "@shared/appData/workerTypes"
import { isNotNullish, isNullish } from "@utils"
import fs from "fs"
import path from "path"

export const generate = async (params: {
  generateParams: GenerateParams
  outputDirPath?: string
  defaultFileName?: string
  forceOverwrite: boolean
  throwErrorOnWriteFailure: boolean
}) => {
  const {
    generateParams,
    outputDirPath,
    defaultFileName,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
  
  const generateResult = await performJob({
    jobId: "generate",
    jobParams: generateParams,
  })
  
  let defaultFilePathWithoutExtension = isNullish(outputDirPath) ? generateResult.checkValue : path.resolve(outputDirPath, defaultFileName ?? generateResult.checkValue)
  
  if (generateParams.shouldCreateROM) {
    if (isNullish(generateResult.rom)) {
      throw new Error("Worker failed to return ROM when requested.")
    }
    
    const fileInfo = attemptWriteROMFile({
      fileData: generateResult.rom,
      defaultFilePathWithoutExtension: defaultFilePathWithoutExtension,
      forcePromptForLocation: isNullish(outputDirPath),
      forceOverwrite: forceOverwrite,
      throwErrorOnWriteFailure: throwErrorOnWriteFailure,
    })
    
    defaultFilePathWithoutExtension = fileInfo.outputPathWithoutExtension
  }
  
  if (generateParams.shouldCreateLog) {
    if (isNullish(generateResult.log)) {
      throw new Error("Worker failed to return log when requested.")
    }
    
    attemptWriteLogFile({
      log: generateResult.log,
      defaultFilePathWithoutExtension: defaultFilePathWithoutExtension,
      forceOverwrite: forceOverwrite,
      throwErrorOnWriteFailure: throwErrorOnWriteFailure,
    })
  }
  
  if (generateParams.shouldCreateROM && isNotNullish(generateResult.namesLog)) {
    attemptWriteNamesLogFile({
      log: generateResult.namesLog,
      defaultFilePathWithoutExtension: defaultFilePathWithoutExtension,
      forceOverwrite: forceOverwrite,
      throwErrorOnWriteFailure: throwErrorOnWriteFailure,
    })
  }
  
  if (generateParams.shouldCreatePatch) {
    if (isNullish(generateResult.patch)) {
      throw new Error("Worker failed to return patch when requested.")
    }
    
    attemptWritePatchFile({
      patchFileData: generateResult.patch,
      defaultFilePathWithoutExtension: defaultFilePathWithoutExtension,
      forceOverwrite: forceOverwrite,
      throwErrorOnWriteFailure: throwErrorOnWriteFailure,
    })
  }
}

export const attemptWriteROMFile = (params: {
  fileData: Uint8Array
  defaultFilePathWithoutExtension: string
  forcePromptForLocation: boolean
  forceOverwrite: boolean
  throwErrorOnWriteFailure: boolean
}) => {
  const {
    fileData,
    defaultFilePathWithoutExtension,
    forcePromptForLocation,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
  
  let filePath: string | undefined
  
  const dialogParams = {
    title: "Save Generated ROM to:",
    buttonLabel: "Generate",
    fileType: "gbc" as const,
    defaultFilePath: `${defaultFilePathWithoutExtension}.gbc`,
  }
  
  if (!forcePromptForLocation) {
    filePath = attemptWriteFile({
      ...dialogParams,
      data: fileData,
      forceOverwrite: forceOverwrite,
      throwErrorOnWriteFailure: throwErrorOnWriteFailure,
    })
  } else {
    filePath = getFilePathFromUserInput(dialogParams)
        
    if (isNotNullish(filePath)) {
      fs.writeFileSync(filePath, fileData)
    }
  }
    
  if (isNullish(filePath)) {
    throw new Error("A save location must be specified.")
  }
  
  return {
    fullOutputFilePath: filePath ?? "",
    outputPathWithoutExtension: filePath?.replace(/\.gbc$/, "") ?? "",
  }
}

export const attemptWriteLogFile = (params: {
  log: string
  defaultFilePathWithoutExtension: string
  forceOverwrite: boolean
  throwErrorOnWriteFailure: boolean
}) => {
  const {
    log,
    defaultFilePathWithoutExtension,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
  
  attemptWriteFile({
    dialogTitle: "Save log to:",
    fileType: "text",
    defaultFilePath: `${defaultFilePathWithoutExtension}.log.txt`,
    data: log,
    forceOverwrite: forceOverwrite,
    throwErrorOnWriteFailure: throwErrorOnWriteFailure,
  })
}

export const attemptWriteNamesLogFile = (params: {
  log: string
  defaultFilePathWithoutExtension: string
  forceOverwrite: boolean
  throwErrorOnWriteFailure: boolean
}) => {
  const {
    log,
    defaultFilePathWithoutExtension,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
  
  attemptWriteFile({
    dialogTitle: "Save names log to:",
    fileType: "text",
    defaultFilePath: `${defaultFilePathWithoutExtension}.names.log.txt`,
    data: log,
    forceOverwrite: forceOverwrite,
    throwErrorOnWriteFailure: throwErrorOnWriteFailure,
  })
}

export const attemptWritePatchFile = (params: {
  patchFileData: Uint8Array,
  defaultFilePathWithoutExtension: string
  forceOverwrite: boolean
  throwErrorOnWriteFailure: boolean
}) => {
  const {
    patchFileData,
    defaultFilePathWithoutExtension,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
            
  attemptWriteFile({
    dialogTitle: "Save patch to:",
    fileType: "pcrp",
    defaultFilePath: `${defaultFilePathWithoutExtension}.pcrp`,
    data: patchFileData,
    forceOverwrite: forceOverwrite,
    throwErrorOnWriteFailure: throwErrorOnWriteFailure,
  })
}