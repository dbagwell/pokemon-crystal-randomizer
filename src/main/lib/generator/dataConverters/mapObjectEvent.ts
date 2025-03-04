import { ROMOffset } from "@lib/gameData/romInfo"
import { DataHunk } from "@lib/generator/patch"
import { eventFlagsMap } from "@shared/gameData/eventFlags"
import { mapObjectTypesMap } from "@shared/gameData/mapObjectTypes"
import { overworldMovementBehavioursMap } from "@shared/gameData/overworldMovementBehaviours"
import { overworldSpritePalletsMap } from "@shared/gameData/overworldSpritePallets"
import { overworldSpritesMap } from "@shared/gameData/overworldSprites"
import type { MapObjectEvent } from "@shared/types/gameData/mapObjectEvent"
import { bytesFrom, isNotNullish } from "@shared/utils"

export const dataHunkFromMapObjectEvent = (event: MapObjectEvent) => {
  return new DataHunk(
    ROMOffset.fromBankAddress(event.romOffset[0], event.romOffset[1]),
    bytesFromMapObjectEvent(event)
  )
}

const bytesFromMapObjectEvent = (event: MapObjectEvent) => {
  let timeArray = [-1, -1]
  
  if (event.time === "MORNING") {
    timeArray[1] = 1
  } else if (event.time === "DAY") {
    timeArray[1] = 2
  } else if (event.time === "NIGHT") {
    timeArray[1] = 4
  } else if (event.time !== "ANY") {
    timeArray = event.time
  }
  
  return [
    overworldSpritesMap[event.spriteId].numericId,
    event.coordinate[1] + 4,
    event.coordinate[0] + 4,
    overworldMovementBehavioursMap[event.movementBehaviourId].numericId,
    event.movementRadius[0] + (event.movementRadius[1] << 4),
    ...timeArray,
    ((isNotNullish(event.palletId) ? overworldSpritePalletsMap[event.palletId].numericId : 0) << 4) + mapObjectTypesMap[event.typeId].numericId,
    event.sightRange,
    ...bytesFrom(event.scriptPointer, 2),
    ...isNotNullish(event.flagId) ? bytesFrom(eventFlagsMap[event.flagId].numericId, 2) : [-1],
  ]
}