import type { MapObjectEvent } from "@shared/types/gameData/mapObjectEvent"
import type { EventFlagId } from "@shared/types/gameDataIds/eventFlags"
import { type GameMapId, gameMapIds } from "@shared/types/gameDataIds/gameMaps"
import type { MapObjectTypeId } from "@shared/types/gameDataIds/mapObjectTypes"
import type { OverworldMovementBehaviourId } from "@shared/types/gameDataIds/overworldMovementBehaviours"
import type { OverworldSpritePalletId } from "@shared/types/gameDataIds/overworldSpritePallets"
import type { OverworldSpriteId } from "@shared/types/gameDataIds/overworldSprites"
import child_process from "child_process"
import fs from "fs"
import path from "path"
import util from "util"

const asyncExec = util.promisify(child_process.exec)
const pokecrystalPath: string = process.env.pokecrystalPath!

const mapFilePath = (mapId: GameMapId) => {
  const fileName = mapId.match(/[A-Z]+|[0-9]+/g)!.map((string) => {
    if (mapId.includes("FAST_SHIP_CABINS") && ["NNW", "NNE", "NE", "SE", "SW", "SSW", "NW"].includes(string)) {
      return `_${string}`
    } else if (string === "SSE") {
      return `_${string}_`
    } else {
      return string.slice(0, 1) + string.slice(1).toLowerCase()
    }
  }).join("")
  
  return path.resolve(pokecrystalPath, `maps/${fileName}.asm`)
}

gameMapIds.forEach((mapId) => {
  const filePath = mapFilePath(mapId)
  const fileText = fs.readFileSync(filePath, "utf-8")
  const updatedFileText = fileText.split("def_object_events\n").join(`def_object_events\n.${mapId}_object_events\n`)
  fs.writeFileSync(filePath, updatedFileText, "utf-8")
})

const makePokecrystal = async () => {
  await asyncExec(`cd ${pokecrystalPath} && make pokecrystal11.gbc`)
  
  const codeMapFileText = fs.readFileSync(path.resolve(pokecrystalPath, "pokecrystal11.map"), "utf-8")
  const romOffsets: Partial<Record<GameMapId, [number, number]>> = {}
  const objectEvents: MapObjectEvent[] = []
  
  ;[...codeMapFileText.matchAll(/ROMX bank #([0-9]+)[\s\S]*?TOTAL EMPTY/g)].forEach((bankMatch) => {
    const bank = parseInt(bankMatch[1])
    ;[...bankMatch[0].matchAll(/\$(\S*).*\.(\S*)_object_events/g)].forEach((lineMatch) => {
      romOffsets[lineMatch[2] as GameMapId] = [bank, parseInt(lineMatch[1], 16)]
    })
  })
  
  gameMapIds.forEach((mapId) => {
    const filePath = mapFilePath(mapId)
    const fileText = fs.readFileSync(filePath, "utf-8")
    const updatedFileText = fileText.split(`.${mapId}_object_events\n`).join("")
    fs.writeFileSync(filePath, updatedFileText, "utf-8")
    
    const regexes = [
      /object_event\s+(\S*)\s*,/,
      /\s*(\S*)\s*,/,
      /\s*SPRITE_(\S*)\s*,/,
      /\s*SPRITEMOVEDATA_(\S*)\s*,/,
      /\s*(\S*)\s*,/,
      /\s*(\S*)\s*,/,
      /\s*(\S*)\s*,/,
      /\s*(\S*)\s*,/,
      /\s*(PAL_NPC_(\S*)|0)\s*,/,
      /\s*OBJECTTYPE_(\S*)\s*,/,
      /\s*(\S*)\s*,/,
      /\s*(\S*)\s*,/,
      /\s*(EVENT_(\S*)|-1)\s*/,
    ]
    
    const regex = new RegExp(regexes.map((regex) => { return regex.source }).join(""), "g")
    
    const bank = romOffsets[mapId]![0]
    let address = romOffsets[mapId]![1]
    
    objectEvents.push(...[...updatedFileText.matchAll(regex)].map((match) => {
      const thing: MapObjectEvent = {
        romOffset: [bank, address],
        coordinate: [parseInt(match[1]), parseInt(match[2])],
        spriteId: match[3] as OverworldSpriteId,
        movementBehaviourId: match[4] as OverworldMovementBehaviourId,
        movementRadius: [parseInt(match[5]), parseInt(match[6])],
        time: match[7] === "-1"
          ? match[8] === "MORN"
            ? "MORNING"
            : match[8] === "NITE"
              ? "NIGHT"
              : match[8] === "DAY"
                ? "DAY"
                : "ANY"
          : [parseInt(match[7]), parseInt(match[8])],
        palletId: match[9] === "0" ? undefined : match[10] as OverworldSpritePalletId,
        typeId: match[11] as MapObjectTypeId,
        sightRange: parseInt(match[12]),
        scriptPointer: parseInt(codeMapFileText.match(`\\$(\\S*) = ${match[13]}\\n`)![1], 16),
        flagId: match[14] === "-1" ? undefined : match[15] as EventFlagId,
      }
      
      address += 13
      
      return thing
    }))
    
    const outputPath: string = process.env.outputPath!
    fs.writeFileSync(path.resolve(outputPath, "objectEvents.json"), JSON.stringify(objectEvents, null, 2), "utf-8")
  })
}

makePokecrystal()