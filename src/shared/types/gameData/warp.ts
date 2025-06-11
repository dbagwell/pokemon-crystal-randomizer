import type { GameMapId } from "@shared/types/gameDataIds/gameMaps"
import { type ItemLocationId, itemLocationIds } from "@shared/types/gameDataIds/itemLocations"
import { type ItemId, itemIds } from "@shared/types/gameDataIds/items"
import { type LogicalAccessAreaId, logicalAccessAreaIds } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import { type PokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { type WarpId, warpIds } from "@shared/types/gameDataIds/warps"
import { isNumber } from "@shared/utils"

export type Warp = {
  id: WarpId
  mapId: GameMapId
  index: number
  areaId: LogicalAccessAreaId
  type: WarpType
  polarity?: WarpPolarity
  distinguisher?: string
  direction: WarpDirection
  accessRequirements?: AccessRequirement[]
  coordinate: [number, number]
  romOffset: [number, number]
  linkedWarpId?: WarpId
}
  
export type AccessRequirement =
  | WarpId
  | LogicalAccessAreaId
  | ItemLocationId
  | PokemonId
  | ItemId
  | { item: ItemId, number: number }
  | number
  | "INACCESSIBLE"
  
export const isAccessRequirement = (value: any): value is AccessRequirement => {
  return logicalAccessAreaIds.includes(value)
    || warpIds.includes(value)
    || itemLocationIds.includes(value)
    || pokemonIds.includes(value)
    || itemIds.includes(value)
    || isNumber(value)
    || value === "INACCESSIBLE"
}

export const warpTypes = [
  "DOOR",
  "CAVE",
  "STAIRS",
  "LADDER",
  "WARP_PAD",
  "HOLE",
  "NONE",
] as const

export type WarpType = typeof warpTypes[number]

export const warpPolarities = [
  "IN",
  "OUT",
  "UP",
  "DOWN",
] as const

export type WarpPolarity = typeof warpPolarities[number]

export const warpDirections = [
  "UP",
  "DOWN",
  "LEFT",
  "RIGHT",
  "ANY",
] as const

export type WarpDirection = typeof warpDirections[number]