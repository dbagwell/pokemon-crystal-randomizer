import type { EventFlagId } from "@shared/types/gameDataIds/eventFlags"
import type { MapObjectTypeId } from "@shared/types/gameDataIds/mapObjectTypes"
import type { OverworldMovementBehaviourId } from "@shared/types/gameDataIds/overworldMovementBehaviours"
import type { OverworldSpritePalletId } from "@shared/types/gameDataIds/overworldSpritePallets"
import type { OverworldSpriteId } from "@shared/types/gameDataIds/overworldSprites"

export type MapObjectEvent = {
  id?: MapObjectEventId
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

const mapObjectEventIds = [
  "GOLDENROD_FLOWER_SHOP_ROCKET_GRUNT",
  "GOLDENROD_SE_AREA_ROCKET_GRUNT",
  "GOLDENROD_UNDERGROUND_WAREHOUSE_DIRECTOR",
  "RADIO_TOWER_1F_RADIO_CARD_QUIZ_WOMAN",
] as const

type MapObjectEventId = typeof mapObjectEventIds[number]