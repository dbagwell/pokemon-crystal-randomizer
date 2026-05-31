import type { PlayerOptions } from "@shared/appData/settingsFromViewModel"
import type { PlayerSpecificGameData } from "@shared/types/gameData/gameData"
import { bytesFromTextData, stringFrom, truncateToInGameStringLength } from "@shared/utils/textConverters"
import type { Random } from "@worker/random"

export const updatePokemonNicknames = (
  playerOptions: PlayerOptions,
  gameData: PlayerSpecificGameData,
  random: Random,
) => {
  if (!playerOptions.CHANGE_NAMES.VALUE) {
    return
  }
  
  const method = playerOptions.CHANGE_NAMES.SETTINGS.METHOD
  
  if (method.VALUE !== "CUSTOM_LIST") {
    return
  }
  
  const allNicknames = method.SETTINGS.CUSTOM_LIST.POKEMON_NICKNAMES?.split("\n").map((name) => {
    return truncateToInGameStringLength(name, 10)
  }).filter((name) => {
    return name.length > 0
  }) ?? []
  
  let availableNicknames: string[] = []
  Object.values(gameData.trades).forEach((trade) => {
    if (availableNicknames.length === 0) {
      availableNicknames = allNicknames.map((name) => { return name })
    }
    
    trade.nickname = random.element({
      array: availableNicknames,
      remove: true,
    })
  })
  
  let kenyaNameOptions = availableNicknames.filter((name) => {
    return bytesFromTextData(name).length <= 5
  })
  
  if (kenyaNameOptions.length === 0) {
    kenyaNameOptions = allNicknames.filter((name) => {
      return bytesFromTextData(name).length <= 5
    })
  }
  
  if (kenyaNameOptions.length === 0) {
    kenyaNameOptions = (availableNicknames.length !== 0 ? availableNicknames : allNicknames).map((name) => {
      return stringFrom(bytesFromTextData(name).slice(0, 5))
    })
  }
  
  gameData.kenyaNickname = random.element({ array: kenyaNameOptions })
}