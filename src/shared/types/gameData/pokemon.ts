import type { EvolutionMethod } from "@shared/types/gameData/evolutionMethod"
import type { EggGroupId } from "@shared/types/gameDataIds/eggGroups"
import type { GrowthRateId } from "@shared/types/gameDataIds/growthRates"
import type { HMItemId, HoldableItemId, TMItemId } from "@shared/types/gameDataIds/items"
import type { MoveId } from "@shared/types/gameDataIds/moves"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { PokemonTypeId } from "@shared/types/gameDataIds/pokemonTypes"
import type { MoveTutorId } from "@shared/types/gameDataIds/teachableMoves"

export type Pokemon = {
  id: PokemonId
  numericId: number
  name: string
  baseStats: {
    hp: number
    attack: number
    defence: number
    speed: number
    specialAttack: number
    specialDefence: number
  }
  types: [PokemonTypeId, PokemonTypeId?]
  catchRate: number
  baseExperience: number
  items: [HoldableItemId | undefined, HoldableItemId | undefined]
  genderRatio: number
  eggCycles: number
  growthRate: GrowthRateId
  eggGroups: [EggGroupId, EggGroupId?]
  tmMoves: TMItemId[]
  hmMoves: HMItemId[]
  moveTutorMoves: MoveTutorId[]
  levelUpMoves: {
    moveId: MoveId
    level: number
  }[]
  eggMoves?: MoveId[]
  evolutions?: {
    pokemonId: PokemonId
    method: EvolutionMethod
  }[]
  spriteDimensions: number
}