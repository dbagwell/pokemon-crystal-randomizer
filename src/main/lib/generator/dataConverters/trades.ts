import { itemsMap } from "@shared/gameData/items"
import { pokemonMap } from "@shared/gameData/pokemon"
import { type Trade, tradeDialogSets, tradeGenders } from "@shared/types/gameData/trade"
import { bytesFrom } from "@shared/utils"
import { bytesFromTextData } from "@shared/utils/textConverters"

export const bytesFromTrade = (trade: Trade) => {
  return [
    tradeDialogSets[trade.dialogSetId],
    pokemonMap[trade.requestedPokémonId].numericId,
    pokemonMap[trade.offeredPokemonId].numericId,
    bytesFromTextData(trade.nickname.padEnd(11, "@")),
    (trade.dvs.speed << 4) + trade.dvs.special,
    (trade.dvs.attack << 4) + trade.dvs.defence,
    itemsMap[trade.heldItemId].numericId,
    bytesFrom(trade.originalTrainerId, 2),
    bytesFromTextData(trade.originalTrainerName.padEnd(11, "@")),
    tradeGenders[trade.genderId],
    0,
  ].flat()
}