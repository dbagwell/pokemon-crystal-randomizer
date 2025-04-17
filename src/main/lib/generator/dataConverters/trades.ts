import { ROMInfo } from "@lib/gameData/romInfo"
import { itemsMap } from "@shared/gameData/items"
import { pokemonMap } from "@shared/gameData/pokemon"
import { type Trade, tradeDialogSets, tradeGenders } from "@shared/types/gameData/trade"
import { bytesFrom } from "@shared/utils"

export const bytesFromTrade = (trade: Trade) => {
  return [
    tradeDialogSets[trade.dialogSetId],
    pokemonMap[trade.requestedPokémonId].numericId,
    pokemonMap[trade.offeredPokemonId].numericId,
    ROMInfo.bytesFromText(trade.nickname.padEnd(11, "@")),
    bytesFrom(trade.dvs, 2),
    itemsMap[trade.heldItemId].numericId,
    bytesFrom(trade.originalTrainerId, 2),
    ROMInfo.bytesFromText(trade.originalTrainerName.padEnd(11, "@")),
    tradeGenders[trade.genderId],
    0,
  ].flat()
}