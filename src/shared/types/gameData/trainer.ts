import type { HoldableItemId } from "@shared/types/gameDataIds/items"
import type { MoveId } from "@shared/types/gameDataIds/moves"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { TrainerGroupId } from "@shared/types/gameDataIds/trainerGroups"

export type Trainer = {
  name: string
  groupId: TrainerGroupId
  pokemon: {
    id: PokemonId
    level: number
    itemId?: HoldableItemId
    moves: MoveId[]
  }[]
}