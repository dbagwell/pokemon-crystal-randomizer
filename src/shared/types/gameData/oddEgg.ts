import type { HoldableItemId } from "@shared/types/gameDataIds/items"
import type { MoveId } from "@shared/types/gameDataIds/moves"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"

export type OddEgg = {
  pokemonId: PokemonId
  item?: HoldableItemId
  moves: {
    id: MoveId
    pp: number
  }[]
  ot: number
  experience: number
  statExperience: {
    hp: number
    attack: number
    defence: number
    speed: number
    special: number
  }
  dvs: {
    attack: number
    defence: number
    speed: number
    special: number
  }
  hatchCyclesRemaining: number
  pokerus?: {
    strain: number
    daysRemaining: number
  }
  level: number
  stats: {
    hp: number
    attack: number
    defence: number
    speed: number
    specialAttack: number
    specialDefence: number
  }
  name: string
}