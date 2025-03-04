import type { FishingGroupId } from "@shared/types/gameDataIds/fishingGroups"
import type { FishingRodId } from "@shared/types/gameDataIds/fishingRods"
import type { GameMapId } from "@shared/types/gameDataIds/gameMaps"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { TreeGroupId } from "@shared/types/gameDataIds/treeGroups"

export type LandEncounter = {
  type: "LAND"
  mapId: GameMapId
  slot: number
  time: "MORNING" | "DAY" | "NIGHT"
  pokemonId: PokemonId
  level: number
  isSwarm?: boolean
}

export type WaterEncounter = {
  type: "WATER"
  mapId: GameMapId
  slot: number
  pokemonId: PokemonId
  level: number
}

export type TreeEncounter = {
  type: "TREE"
  group: TreeGroupId
  rarity: "COMMON" | "RARE"
  slot: number
  rate: number
  pokemonId: PokemonId
  level: number
}

export type RockEncounter = {
  type: "ROCK"
  slot: number
  rate: number
  pokemonId: PokemonId
  level: number
}

export type FishingEncounter = {
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
})

export type FishingTimeGroupEncounter = {
  type: "FISHING_TIME_GROUP"
  timeGroupIndex: number
  time: "DAY" | "NIGHT"
  pokemonId: PokemonId
  level: number
}

export type ContestEncounter = {
  type: "CONTEST"
  slot: number
  pokemonId: PokemonId
  minLevel: number
  maxLevel: number
  rate: number
}

export type Encounter =
  LandEncounter
  | WaterEncounter
  | TreeEncounter
  | RockEncounter
  | FishingEncounter
  | FishingTimeGroupEncounter
  | ContestEncounter