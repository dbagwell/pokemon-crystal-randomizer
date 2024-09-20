import type { FishingGroupId } from "@shared/types/gameDataIds/fishingGroups"
import type { GameMapGroupId } from "@shared/types/gameDataIds/gameMapGroups"
import type { GameMapId } from "@shared/types/gameDataIds/gameMaps"
import type { TreeGroupId } from "@shared/types/gameDataIds/treeGroups"

export type GameMap = {
  id: GameMapId
  numericId: number
  mapGroup: GameMapGroupId
  encounterRegion?: "JOHTO" | "KANTO"
  landEncounterRates?: [number, number, number]
  waterEncounterRate?: number
  swarmEncounterRates?: [number, number, number]
  fishingGroup?: FishingGroupId
  treeGroup?: TreeGroupId
}