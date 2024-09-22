import type { FishingGroupId } from "@shared/types/gameDataIds/fishingGroups"
import type { FishingRodId } from "@shared/types/gameDataIds/fishingRods"
import type { GameMapId } from "@shared/types/gameDataIds/gameMaps"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { TreeGroupId } from "@shared/types/gameDataIds/treeGroups"

export type Encounter = ({
  pokemonId: PokemonId
  level: number
} & ((({
  type: "LAND"
  time: "MORNING" | "DAY" | "NIGHT"
  isSwarm?: boolean
} | {
  type: "WATER"
}) & {
  mapId: GameMapId
  slot: number
}) | {
  type: "FISHING_TIME_GROUP"
  timeGroupIndex: number
  time: "DAY" | "NIGHT"
} | {
  type: "TREE"
  group: TreeGroupId
  rarity: "COMMON" | "RARE"
  slot: number
  rate: number
} | {
  type: "ROCK"
  slot: number
  rate: number
})) | ({
  type: "FISHING"
  group: FishingGroupId
  rod: FishingRodId
  slot: number
  rate: number
} & ({
  isTimeGroup: false
  pokemonId: PokemonId
  level: number
} | {
  isTimeGroup: true
  timeGroupIndex: number
})) | {
  type: "CONTEST"
  slot: number
  pokemonId: PokemonId
  minLevel: number
  maxLevel: number
  rate: number
}