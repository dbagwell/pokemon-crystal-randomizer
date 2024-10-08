import type { EventFlagId } from "@shared/types/gameDataIds/eventFlags"
import type { MapObjectTypeId } from "@shared/types/gameDataIds/mapObjectTypes"
import type { OverworldMovementBehaviourId } from "@shared/types/gameDataIds/overworldMovementBehaviours"
import type { OverworldSpritePalletId } from "@shared/types/gameDataIds/overworldSpritePallets"
import type { OverworldSpriteId } from "@shared/types/gameDataIds/overworldSprites"

export type MapObjectEvent = {
  romOffset: [number, number]
  coordinate: [number, number]
  spriteId: OverworldSpriteId
  movementBehaviourId: OverworldMovementBehaviourId
  movementRadius: [number, number]
  time: "ANY" | "MORNING" | "DAY" | "NIGHT" | [number, number]
  palletId?: OverworldSpritePalletId
  typeId: MapObjectTypeId
  sightRange: number
  scriptPointer: number
  flagId?: EventFlagId
}