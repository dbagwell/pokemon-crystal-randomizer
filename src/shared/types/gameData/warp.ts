import type { GameMapId } from "@shared/types/gameDataIds/gameMaps"
import type { ItemLocationId } from "@shared/types/gameDataIds/itemLocations"
import type { ItemId } from "@shared/types/gameDataIds/items"
import type { LogicalAccessAreaId } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { WarpId } from "@shared/types/gameDataIds/warps"

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
  | number
  | "INACCESSIBLE"

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