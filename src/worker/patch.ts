import type { DataHunk } from "@shared/romUtils/dataHunk"
import type { ROMInfo } from "@shared/romUtils/romInfo"

import { type ExtraInclude, PatchInfo } from "./patchInfo"

export class Patch {
  
  readonly hunks: DataHunk[]
  
  constructor(hunks: DataHunk[]) {
    this.hunks = hunks
  }
  
  static readonly fromYAML = (romInfo: ROMInfo, filePath: string, extraIncludes: Dictionary<ExtraInclude | ExtraInclude[]> = {}, extraValues: Dictionary<string> = {}): Patch => {
    try {
      const patchInfo = new PatchInfo(filePath, extraIncludes, extraValues)
      return new Patch(patchInfo.hunks(romInfo))
    } catch (error) {
      throw new Error(`Error creating patch from file at ${filePath}.\n\n${error}`, { cause: error })
    }
  }
  
}