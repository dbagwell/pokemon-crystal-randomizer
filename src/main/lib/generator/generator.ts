
import { generatorLog, playerSpecificLog } from "@lib/generator/log"
import { createPCRP } from "@lib/generator/pcrpProcessor"
import { getVanillaROM } from "@lib/userData/vanillaROM"
import { attemptWriteFile, getFilePathFromUserInput } from "@lib/utils/dialogUtils"
import type { GeneratorMethod, GeneratorParams, PlayerOptionsParams } from "@mainShared/generatorUtils"
import { Patch } from "@mainShared/patch"
import { type PlayerOptions, type Settings } from "@shared/appData/settingsFromViewModel"
import type { DataHunk } from "@shared/romUtils/dataHunk"
import { bankAddressOfROMOffset, bankOfROMOffset, romBankSize, type ROMInfo } from "@shared/romUtils/romInfo"
import type { PlayerSpecificGameData } from "@shared/types/gameData/gameData"
import { bytesFromTextData } from "@shared/utils/textConverters"
import { hexStringFrom, isNotNullish, isNullish } from "@utils"
import { app } from "electron"
import fs from "fs"
import path from "path"
import { Worker } from "worker_threads"

type GeneratorData = {
  romInfo: ROMInfo
  settings: Settings
  seed: string
  checkValue: string
}

type PlayerOptionsResponse = {
  playerSpecificGameData: PlayerSpecificGameData
  hunks: DataHunk[]
}

export const dispatchWorker = async <GeneratorMethodType extends GeneratorMethod>(params: {
  method: GeneratorMethodType
  params: GeneratorMethodType extends "generatorDataFrom" ? GeneratorParams : GeneratorMethodType extends "applyPlayerOptionsToROM" ? PlayerOptionsParams : never
}): Promise<GeneratorMethodType extends "generatorDataFrom" ? GeneratorData : GeneratorMethodType extends "applyPlayerOptionsToROM" ? PlayerOptionsResponse : never> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "generatorDataFromWorker.js"), { workerData: params })
    worker.on("message", resolve)
    worker.on("error", reject)
    worker.on("exit", (code) => {
      if (code !== 0) { reject(new Error(`Worker stopped with exit code ${code}`)) }
    })
  })
}

export const generateROM = async (params: {
  data: GeneratorData
  playerOptions: PlayerOptions
  showInputInRenderer: boolean
  defaultFileName?: string
  inputROM?: Buffer
  forceOverwrite?: boolean
  throwErrorOnWriteFailure?: boolean
  skipWritingOutputFile?: boolean
}) => {
  const {
    data,
    playerOptions,
    showInputInRenderer,
    defaultFileName,
    inputROM,
    forceOverwrite,
    throwErrorOnWriteFailure,
    skipWritingOutputFile,
  } = params
  
  const inputFileData = inputROM ?? await getVanillaROM(showInputInRenderer)
  
  if (isNullish(inputFileData)) {
    throw new Error("A Pokémon Crystal Version 1.1 ROM is required.")
  }
  
  const sharedOutputFileData = Buffer.from(inputFileData)
  
  const basePatch = Patch.fromYAML(
    data.romInfo,
    "randomizerBase.yml",
    {},
    {
      versionNumber: hexStringFrom(bytesFromTextData(app.getVersion())),
      checkValue: hexStringFrom(bytesFromTextData(data.checkValue)),
    },
  )
  
  data.romInfo.patchHunks.push(...basePatch.hunks)
  
  data.romInfo.patchHunks.forEach((hunk) => {
    sharedOutputFileData.set(hunk.values, bankOfROMOffset(hunk.offset) * romBankSize + (bankAddressOfROMOffset(hunk.offset) - (bankOfROMOffset(hunk.offset) === 0 ? 0 : romBankSize)))
  })
  
  const outputFileData = Buffer.from(sharedOutputFileData)
  
  const {
    playerSpecificGameData,
    hunks,
  } = await dispatchWorker({
    method: "applyPlayerOptionsToROM",
    params: {
      seed: data.checkValue,
      settings: data.settings,
      playerOptions: playerOptions,
      romData: outputFileData,
    },
  })
  
  hunks.forEach((hunk) => {
    outputFileData.set(hunk.values, bankOfROMOffset(hunk.offset) * romBankSize + (bankAddressOfROMOffset(hunk.offset) - (bankOfROMOffset(hunk.offset) === 0 ? 0 : romBankSize)))
  })
  
  return {
    inputFileData: inputFileData,
    sharedOutputFileData: sharedOutputFileData,
    playerSpecificGameData: playerSpecificGameData,
    ...writeRomData({
      fileData: outputFileData,
      defaultFileName: defaultFileName ?? data.checkValue,
      forcePromptForLocation: isNullish(defaultFileName),
      forceOverwrite: forceOverwrite,
      throwErrorOnWriteFailure: throwErrorOnWriteFailure,
      skipWritingOutputFile: skipWritingOutputFile,
    }),
  }
}

export const writeRomData = (params: {
  fileData: Buffer
  defaultFileName: string
  forcePromptForLocation: boolean
  forceOverwrite?: boolean
  throwErrorOnWriteFailure?: boolean
  skipWritingOutputFile?: boolean
}) => {
  const {
    fileData,
    defaultFileName,
    forcePromptForLocation,
    forceOverwrite,
    throwErrorOnWriteFailure,
    skipWritingOutputFile,
  } = params
  
  let filePath: string | undefined
  
  const dialogParams = {
    title: "Save Generated ROM to:",
    buttonLabel: "Generate",
    fileType: "gbc" as const,
    defaultFilePath: `${defaultFileName}.gbc`,
  }
  
  if (!(skipWritingOutputFile ?? false)) {
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
  }
  
  return {
    fullOutputFilePath: filePath ?? "",
    outputPathWithoutExtension: filePath?.replace(/\.gbc$/, "") ?? "",
  }
}

export const generateLog = (params: {
  data: GeneratorData
  defaultFileName?: string
  forceOverwrite?: boolean
  throwErrorOnWriteFailure?: boolean
}) => {
  const {
    data,
    defaultFileName,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
  
  const log = generatorLog({
    seed: data.seed,
    checkValue: data.checkValue,
    settings: data.settings,
    gameData: data.romInfo.gameData,
  })
  
  attemptWriteFile({
    dialogTitle: "Save log to:",
    fileType: "text",
    defaultFilePath: `${defaultFileName}.log.txt`,
    data: log,
    forceOverwrite: forceOverwrite,
    throwErrorOnWriteFailure: throwErrorOnWriteFailure,
  })
}

export const generatePlayerSpecificLog = (params: {
  playerOptions: PlayerOptions
  gameData: PlayerSpecificGameData
  defaultFileName?: string
  forceOverwrite?: boolean
  throwErrorOnWriteFailure?: boolean
}) => {
  const {
    playerOptions,
    gameData,
    defaultFileName,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
  
  if (
    (!playerOptions.CHANGE_TRAINER_CLASS_NAMES.VALUE || !playerOptions.CHANGE_TRAINER_CLASS_NAMES.SETTINGS.CREATE_LOG)
    && (!playerOptions.CHANGE_TRAINER_NAMES.VALUE || !playerOptions.CHANGE_TRAINER_NAMES.SETTINGS.CREATE_LOG)
  ) {
    return
  }
  
  const log = playerSpecificLog(gameData)
  
  attemptWriteFile({
    dialogTitle: "Save names log to:",
    fileType: "text",
    defaultFilePath: `${defaultFileName}.names.log.txt`,
    data: log,
    forceOverwrite: forceOverwrite,
    throwErrorOnWriteFailure: throwErrorOnWriteFailure,
  })
}

export const generatePatch = (params: {
  checkValue: string
  settings: Settings
  inputROMData: Buffer
  sharedOutputROMData: Buffer
  defaultFileName?: string
  forceOverwrite?: boolean
  throwErrorOnWriteFailure?: boolean
}) => {
  const {
    checkValue,
    settings,
    inputROMData,
    sharedOutputROMData,
    defaultFileName,
    forceOverwrite,
    throwErrorOnWriteFailure,
  } = params
  
  const pcrpData = createPCRP({
    checkValue: checkValue,
    settings: settings,
    inputROMData: inputROMData,
    sharedOutputROMData: sharedOutputROMData,
  })
            
  attemptWriteFile({
    dialogTitle: "Save patch to:",
    fileType: "pcrp",
    defaultFilePath: `${defaultFileName}.pcrp`,
    data: pcrpData,
    forceOverwrite: forceOverwrite,
    throwErrorOnWriteFailure: throwErrorOnWriteFailure,
  })
}