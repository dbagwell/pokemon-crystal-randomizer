import type { FishingGroupId } from "@shared/types/gameDataIds/fishingGroups"
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
  rate: number
} | {
  type: "ROCK"
  rate: number
})) | ({
  type: "FISHING"
  group: FishingGroupId
  rod: "OLD" | "GOOD" | "SUPER"
  isSwarm?: boolean
  rate: number
} & ({
  isTimeGroup: false
  pokemonId: PokemonId
  level: number
} | {
  isTimeGroup: true
  timeGroupIndex: number
}))