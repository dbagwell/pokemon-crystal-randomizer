import type { PatchParams } from "@shared/appData/workerTypes"
import { isNotNullish, numberFrom } from "@shared/utils"
import { decompressFromUint8Array } from "lz-string"
import yaml from "yaml"
import { crc32 } from "zlib"

export const patch = (params: PatchParams) => {
  const inputROM = Buffer.from(params.inputROM)
  const patchData = Buffer.from(params.patchData)
  
  let currentIndex = 0
  
  const getBytes = (count: number) => {
    const bytes = patchData.subarray(currentIndex, currentIndex + count)
    currentIndex += count
    return bytes
  }
  
  const getNumber = (signed?: boolean) => {
    let value = 0
    let shift = 1
    
    let byte: number
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
    throw new Error("Unable to decode patch file because it is in an incorrect format.")
  }
  
  getNumber() // source size
  const targetSize = getNumber() // target size
  
  const metadataSize = getNumber()
  const metadata = getBytes(metadataSize)
  const infoString = decompressFromUint8Array(metadata)
  const info = isNotNullish(infoString) ? yaml.parse(infoString) : undefined
  
  const newROMData = Buffer.alloc(targetSize)
  let outputOffset = 0
  let sourceRelativeOffset = 0
  let targetRelativeOffset = 0
  
  while (currentIndex < patchData.length - 12) {
    const actionInfo = getNumber()
    const action = actionInfo & 0b11
    const actionLength = (actionInfo >> 2) + 1
    
    if (action === 0) {
      const bytes = inputROM.subarray(outputOffset, outputOffset + actionLength)
      newROMData.set(bytes, outputOffset)
    } else if (action === 1) {
      newROMData.set(getBytes(actionLength), outputOffset)
    } else if (action === 2) {
      sourceRelativeOffset += getNumber(true)
      const bytes = inputROM.subarray(sourceRelativeOffset, sourceRelativeOffset + actionLength)
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
  
  if (sourceChecksum !== crc32(inputROM)) {
    throw new Error("Unable to apply patch. Patch was created using a different source ROM.")
  }
  
  if (targetChecksum !== crc32(newROMData)) {
    throw new Error("Error appling patch. Patched ROM checksum doesn't match.")
  }
  
  if (patchChecksum !== crc32(patchData.subarray(0, patchData.length - 4))) {
    throw new Error("Unable to apply patch. Patch is corrupted.")
  }
  
  return {
    rom: newROMData,
    patchInfo: info,
  }
}