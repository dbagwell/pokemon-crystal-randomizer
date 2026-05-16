import type { HoldableItemId } from "@shared/types/gameDataIds/items"
import type { MoveId } from "@shared/types/gameDataIds/moves"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { TrainerClassId } from "@shared/types/gameDataIds/trainerClasses"

export type Trainer = {
  name: string
  party?: number
  unused?: boolean
  classId: TrainerClassId
  isContestTrainer?: boolean
  pokemon: {
    id: PokemonId
    level: number
    itemId?: HoldableItemId
    moves: MoveId[]
  }[]
}