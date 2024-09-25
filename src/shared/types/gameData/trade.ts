import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { TradeId } from "@shared/types/gameDataIds/trades"

export type Trade = {
  id: TradeId
  askPokemonId: PokemonId
  offerPokemonId: PokemonId
}