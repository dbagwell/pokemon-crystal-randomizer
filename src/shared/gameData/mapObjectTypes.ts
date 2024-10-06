import type { MapObjectType } from "@shared/types/gameData/mapObjectType"
import type { MapObjectTypeId } from "@shared/types/gameDataIds/mapObjectTypes"

export const mapObjectTypesMap: IdMap<MapObjectTypeId, MapObjectType> = {
  SCRIPT: {
    id: "SCRIPT",
    numericId: 0,
  },
  ITEMBALL: {
    id: "ITEMBALL",
    numericId: 1,
  },
  TRAINER: {
    id: "TRAINER",
    numericId: 2,
  },
} as const