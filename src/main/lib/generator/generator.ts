import { ROMInfo } from "@lib/gameData/romInfo"
import { DataHunk, Patch } from "@lib/generator/patch"
import type { GeneratorSetting } from "@shared/types/generatorSettings"
import { compact, hexStringFrom } from "@utils"
import { app } from "electron"
import hash from "object-hash"

export const generateROM = (data: Buffer, settings: GeneratorSetting[]): {
  seed: string,
  data: Buffer,
} => {
  const romInfo = ROMInfo.vanilla()
  
  let hunks: DataHunk[] = []
  
  settings.forEach((setting) => {
    switch (setting.id) {
    case "additionalOptions": {
      const values = setting.value as string[]
      const additionalOptionsPatch = Patch.fromYAML(
        romInfo,
        "additionalOptions.yml",
        {
          options: compact([
            values.includes("instantText") ? "options/textSpeedWithInstantText.yml" : "options/textSpeed.yml",
            values.includes("holdToMash") ? "options/holdToMash.yml" : null,
            "options/battleScene.yml",
            "options/battleShift.yml",
            values.includes("nicknames") ? "options/nicknames.yml" : null,
            "options/stereoSound.yml",
            values.includes("rideMusic") ? "options/rideMusic.yml" : null,
            "options/menuAccount.yml",
            "options/printTone.yml",
            "options/frameType.yml",
          ]),
        },
      )
      
      hunks = [...hunks, ...additionalOptionsPatch.hunks]
      
      break
    }
    default: {
      break
    }
    }
  })
  
  const checkValue = hunks.length > 0 ? hash(hunks).slice(0, 8).toUpperCase() : "00000000"
  
  const basePatch = Patch.fromYAML(
    romInfo,
    "randomizerBase.yml",
    {},
    {
      versionNumber: hexStringFrom(ROMInfo.displayCharacterBytesFrom(app.getVersion()), " "),
      checkValue: hexStringFrom(ROMInfo.displayCharacterBytesFrom(checkValue), " "),
    },
  )
      
  hunks = [...hunks, ...basePatch.hunks]
  
  hunks.forEach((hunk) => {
    data.set(hunk.values, hunk.offset.bank() * ROMInfo.bankSize + (hunk.offset.bankAddress() - (hunk.offset.bank() === 0 ? 0 : ROMInfo.bankSize)))
  })
  
  return {
    seed: "",
    data: data,
  }
}