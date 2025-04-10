import type { HoldableItemId } from "@shared/types/gameDataIds/items"
import type { PokemonId } from "@shared/types/gameDataIds/pokemon"
import type { TradeId } from "@shared/types/gameDataIds/trades"

export const tradeDialogSets = {
  COLLECTOR: 0,
  HAPPY: 1,
  GIRL: 2,
  NEWBIE: 3,
}

export type TradeDialogSetId = keyof typeof tradeDialogSets

export const tradeGenders = {
  ANY: 0,
  MALE: 1,
  FEMALE: 2,
}

export const tradeGenderIds = Object.keys(tradeGenders) as (keyof typeof tradeGenders)[]

export type TradeGenderId = keyof typeof tradeGenders

export type Trade = {
  id: TradeId
  dialogSetId: TradeDialogSetId
  requestedPokémonId: PokemonId
  offeredPokemonId: PokemonId
  nickname: string
  dvs: number
  heldItemId: HoldableItemId
  originalTrainerId: number
  originalTrainerName: string
  genderId: TradeGenderId
}