import { ROMInfo } from "@lib/gameData/romInfo"
import { Patch } from "@lib/generator/patch"
import { hexStringFrom } from "@utils"
import { app } from "electron"

export const generateROM = (data: Buffer): {
  seed: string,
  data: Buffer,
} => {
  const romInfo = ROMInfo.vanilla()
  
  const checkValueBytes = new Uint8Array(4)
  
  const patch = Patch.fromYAML(
    romInfo,
    "randomizerBase.yml",
    {},
    {
      versionNumber: hexStringFrom(ROMInfo.displayCharacterBytesFrom(app.getVersion()), " "),
      checkValue: hexStringFrom(ROMInfo.displayCharacterBytesFrom(hexStringFrom(Array.from(checkValueBytes))), " "),
    },
  )
  
  patch.hunks.forEach((hunk) => {
    data.set(hunk.values, hunk.offset.bank() * ROMInfo.bankSize + (hunk.offset.bankAddress() - (hunk.offset.bank() === 0 ? 0 : ROMInfo.bankSize)))
  })
  
  return {
    seed: "",
    data: data,
  }
}