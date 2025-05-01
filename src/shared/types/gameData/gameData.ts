import type { Encounter } from "@shared/types/gameData/encounter"
import type { ItemLocation } from "@shared/types/gameData/itemLocation"
import type { MapObjectEvent } from "@shared/types/gameData/mapObjectEvent"
import type { Mart } from "@shared/types/gameData/mart"
import type { OddEgg } from "@shared/types/gameData/oddEgg"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import type { TeachableMove } from "@shared/types/gameData/teachableMove"
import type { Trade } from "@shared/types/gameData/trade"
import type { Trainer } from "@shared/types/gameData/trainer"
import type { EventPokemonId } from "@shared/types/gameDataIds/eventPokemon"
import type { ItemLocationId } from "@shared/types/gameDataIds/itemLocations"
import type { HoldableItemId } from "@shared/types/gameDataIds/items"
import type { MartId } from "@shared/types/gameDataIds/marts"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { StarterLocationId } from "@shared/types/gameDataIds/starterLocations"
import type { TeachableMoveId } from "@shared/types/gameDataIds/teachableMoves"
import type { TradeId } from "@shared/types/gameDataIds/trades"

export type GameData = {
  introPokemonInfo?: {
    pokemonId: Exclude<PokemonId, "UNOWN">
  } | {
    pokemonId: "UNOWN"
    unownId: number
  }
  pokemon: IdMap<PokemonId, Pokemon>
  starters: Partial<Record<StarterLocationId, PokemonId>>
  starterItems: Partial<Record<StarterLocationId, HoldableItemId>>
  encounters: Encounter[]
  oddEggs: OddEgg[]
  eventPokemon: Record<EventPokemonId, PokemonId>
  trades: IdMap<TradeId, Trade>
  teachableMoves: IdMap<TeachableMoveId, TeachableMove>
  trainers: Trainer[]
  mapObjectEvents: [MapObjectEvent]
  marts: IdMap<MartId, Mart>
  moveTutorCost: number
  itemLocations: IdMap<ItemLocationId, ItemLocation>
}