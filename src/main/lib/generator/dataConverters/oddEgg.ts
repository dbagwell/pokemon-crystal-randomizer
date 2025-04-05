import { ROMInfo } from "@lib/gameData/romInfo"
import { itemsMap } from "@shared/gameData/items"
import { movesMap } from "@shared/gameData/moves"
import { pokemonMap } from "@shared/gameData/pokemon"
import type { OddEgg } from "@shared/types/gameData/oddEgg"
import { bytesFrom, isNotNullish } from "@shared/utils"

export const bytesFromOddEgg = (oddEgg: OddEgg) => {
  return [
    pokemonMap[oddEgg.pokemonId].numericId,
    isNotNullish(oddEgg.item) ? itemsMap[oddEgg.item].numericId : 0,
    ...oddEgg.moves.map((move) => {
      return movesMap[move.id].numericId
    }).concat(Array(4 - oddEgg.moves.length).fill(0)),
    ...bytesFrom(oddEgg.ot, 2),
    ...bytesFrom(oddEgg.experience, 3, true),
    ...bytesFrom(oddEgg.statExperience.hp, 2, true),
    ...bytesFrom(oddEgg.statExperience.attack, 2, true),
    ...bytesFrom(oddEgg.statExperience.defence, 2, true),
    ...bytesFrom(oddEgg.statExperience.speed, 2, true),
    ...bytesFrom(oddEgg.statExperience.special, 2, true),
    (oddEgg.dvs.attack << 4) + oddEgg.dvs.defence,
    (oddEgg.dvs.speed << 4) + oddEgg.dvs.special,
    ...oddEgg.moves.map((move) => {
      return move.pp
    }).concat(Array(4 - oddEgg.moves.length).fill(0)),
    oddEgg.hatchCyclesRemaining,
    isNotNullish(oddEgg.pokerus) ? (oddEgg.pokerus.strain << 4) + oddEgg.pokerus.daysRemaining : 0,
    0,
    0,
    oddEgg.level,
    0,
    0,
    0,
    0,
    ...bytesFrom(oddEgg.stats.hp, 2, true),
    ...bytesFrom(oddEgg.stats.attack, 2, true),
    ...bytesFrom(oddEgg.stats.defence, 2, true),
    ...bytesFrom(oddEgg.stats.speed, 2, true),
    ...bytesFrom(oddEgg.stats.specialAttack, 2, true),
    ...bytesFrom(oddEgg.stats.specialDefence, 2, true),
    ...ROMInfo.bytesFromText(oddEgg.name),
  ]
}