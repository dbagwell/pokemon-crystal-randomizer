import type { ROMInfo, ROMOffset } from "@lib/gameData/romInfo"
import { type DataFormat, type ExtraInclude, PatchInfo } from "@lib/generator/patchInfo"
import { bytesFrom, isNumber } from "@utils"

export class Patch {
  
  readonly hunks: DataHunk[]
  
  constructor(hunks: DataHunk[]) {
    this.hunks = hunks
  }
  
  static readonly fromYAML = (romInfo: ROMInfo, filePath: string, extraIncludes: Dictionary<ExtraInclude | ExtraInclude[]> = {}, extraValues: Dictionary<string> = {}): Patch => {
    const patchInfo = new PatchInfo(filePath, extraIncludes, extraValues)
    return new Patch(patchInfo.hunks(romInfo))
  }
  
}

export class DataHunk {
  
  readonly offset: ROMOffset
  readonly values: number[]
  
  constructor(offset: ROMOffset, dataFormat: DataFormat, referenceAddresses: Dictionary<number>) {
    this.offset = offset
    this.values = dataFormat.values.flatMap((value) => {
      if (isNumber(value)) {
        return value
      } else { // isString(value)
        return bytesFrom(referenceAddresses[value], 2)
      }
    })
  }
  
}