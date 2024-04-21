import type { EggGroupId } from "@shared/types/gameDataIds/eggGroups"
import type { GrowthRateId } from "@shared/types/gameDataIds/growthRates"
import type { HMItemId, HoldableItemId, ItemId, RegularItemId, TMItemId } from "@shared/types/gameDataIds/items"
import type { ItemType } from "@shared/types/gameDataIds/itemTypes"
import type { MoveId } from "@shared/types/gameDataIds/moves"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { PokemonTypeId } from "@shared/types/gameDataIds/pokemonTypes"

export type EvolutionMethod = {
  type: "LEVEL",
  level: number,
} | {
  type: "TRADE",
  item?: HoldableItemId,
} | {
  type: "ITEM",
  item: RegularItemId,
} | {
  type: "HAPPINESS",
  time?: "DAY" | "NIGHT",
} | {
  type: "STAT",
  level: number,
  stats: "ATTACK_LESS_THAN_DEFENCE" | "ATTACK_GREATER_THAN_DEFENCE" | "ATTACK_EQUAL_DEFENCE"
}

export type Pokemon = {
  id: PokemonId,
  numericId: number,
  name: string,
  baseStats: {
    hp: number,
    attack: number,
    defence: number,
    speed: number,
    specialAttack: number,
    specialDefence: number,
  },
  types: [PokemonTypeId, PokemonTypeId?],
  catchRate: number,
  baseExperience: number,
  items: [HoldableItemId?, HoldableItemId?],
  eggCycles: number,
  growthRate: GrowthRateId,
  eggGroups: [EggGroupId?, EggGroupId?],
  tmMoves: TMItemId[],
  hmMoves: HMItemId[],
  levelUpMoves: {
    moveId: MoveId,
    level: number,
  }[],
  eggMoves?: MoveId[],
  evolutions?: {
    pokemonId: PokemonId,
    method: EvolutionMethod,
  }[],
}

export type Item = {
  id: ItemId,
  type: ItemType,
  hexId: string, // TODO: Change This to a numeric id
  name: string,
}

export type ItemCategory = {
  id: string,
  name: string,
  slotSize: number,
  maxSlots: number,
  items: Item[],
}