import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { StarterLocationId } from "@shared/types/gameDataIds/starterLocations"

export type StarterLocation = {
  id: StarterLocationId,
  pokemonId: PokemonId,
  name: string,
}