import type { Encounter } from "@shared/types/gameData/encounter"
import type { Item } from "@shared/types/gameData/item"
import type { ItemLocation } from "@shared/types/gameData/itemLocation"
import type { LogicalAccessArea } from "@shared/types/gameData/logicalAccessArea"
import type { MapObjectEvent } from "@shared/types/gameData/mapObjectEvent"
import type { Mart, SpecialShop } from "@shared/types/gameData/mart"
import type { OddEgg } from "@shared/types/gameData/oddEgg"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import type { TeachableMove } from "@shared/types/gameData/teachableMove"
import type { Trade } from "@shared/types/gameData/trade"
import type { Trainer } from "@shared/types/gameData/trainer"
import type { Warp } from "@shared/types/gameData/warp"
import type { EventPokemonId } from "@shared/types/gameDataIds/eventPokemon"
import type { ItemLocationId } from "@shared/types/gameDataIds/itemLocations"
import type { HoldableItemId, ItemId } from "@shared/types/gameDataIds/items"
import type { LogicalAccessAreaId } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import type { MartId, SpecialShopId } from "@shared/types/gameDataIds/marts"
import type { MoveId } from "@shared/types/gameDataIds/moves"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { StarterLocationId } from "@shared/types/gameDataIds/starterLocations"
import type { TeachableMoveId } from "@shared/types/gameDataIds/teachableMoves"
import type { TradeId } from "@shared/types/gameDataIds/trades"
import type { UnownLetterId } from "@shared/types/gameDataIds/unownLetters"
import type { UnownSetId } from "@shared/types/gameDataIds/unownSets"
import type { WarpId } from "@shared/types/gameDataIds/warps"

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
  unownSets: Record<UnownSetId, UnownLetterId[]>
  dratiniMoves: {
    regular: MoveId[]
    special: MoveId[]
  }
  trades: IdMap<TradeId, Trade>
  teachableMoves: IdMap<TeachableMoveId, TeachableMove>
  trainers: Trainer[]
  mapObjectEvents: [MapObjectEvent]
  marts: IdMap<MartId, Mart>
  specialShops: IdMap<SpecialShopId, SpecialShop>
  moveTutorCost: number
  numberOfMiltankBerries: number
  itemLocations: IdMap<ItemLocationId, ItemLocation>
  warps: IdMap<WarpId, Warp>
  areas: IdMap<LogicalAccessAreaId, LogicalAccessArea>
  numberOfBadgesForOak: number
  items: IdMap<ItemId, Item>
}