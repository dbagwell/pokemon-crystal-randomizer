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
  "ILEX_FOREST_LASS",
  "ROUTE_1_FRUIT_TREE",
  "ROUTE_2_FOREST_AREA_FRUIT_TREE",
  "ROUTE_8_FRUIT_TREE",
  "ROUTE_11_FRUIT_TREE",
  "ROUTE_26_FRUIT_TREE",
  "ROUTE_29_FRUIT_TREE",
  "ROUTE_30_CHERRYGROVE_SIDE_SOUTH_FRUIT_TREE",
  "ROUTE_30_CHERRYGROVE_SIDE_NORTH_FRUIT_TREE",
  "ROUTE_31_FRUIT_TREE",
  "ROUTE_33_FRUIT_TREE",
  "ROUTE_35_SURF_AREA_FRUIT_TREE",
  "ROUTE_36_WEST_AREA_FRUIT_TREE",
  "ROUTE_37_LEFT_FRUIT_TREE",
  "ROUTE_37_MIDDLE_FRUIT_TREE",
  "ROUTE_37_RIGHT_FRUIT_TREE",
  "ROUTE_38_FRUIT_TREE",
  "ROUTE_39_FRUIT_TREE",
  "ROUTE_42_MIDDLE_CUT_AREA_LEFT_FRUIT_TREE",
  "ROUTE_42_MIDDLE_CUT_AREA_MIDDLE_FRUIT_TREE",
  "ROUTE_42_MIDDLE_CUT_AREA_RIGHT_FRUIT_TREE",
  "ROUTE_43_SURF_CUT_AREA_FRUIT_TREE",
  "ROUTE_44_FRUIT_TREE",
  "ROUTE_45_FRUIT_TREE",
  "ROUTE_46_NORTH_AREA_LEFT_FRUIT_TREE",
  "ROUTE_46_NORTH_AREA_RIGHT_FRUIT_TREE",
  "PEWTER_CITY_LEFT_FRUIT_TREE",
  "PEWTER_CITY_RIGHT_FRUIT_TREE",
  "FUCHSIA_CITY_CUT_AREA_FRUIT_TREE",
  "VIOLET_CITY_FRUIT_TREE",
  "AZALEA_TOWN_FRUIT_TREE",
  "MAHOGANY_MART_1F_ROCKET_SALESMAN",
  "VICTORY_ROAD_GATE_ROUTE_28_GUARD",
  "MAHOGANY_TOWN_STREET_VENDOR",
  "RADIO_TOWER_2F_BLUE_CARD_REWARD_LADY",
  "TEAM_ROCKET_BASE_B2F_LANCE",
  "MORNING_MT_MOON_SHOP_OWNER",
  "DRAGONS_DEN_1F_CLAIR",
] as const

type MapObjectEventId = typeof mapObjectEventIds[number]