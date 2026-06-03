import type { PlayerOptions } from "@shared/appData/settingsFromViewModel"
import type { PlayerSpecificGameData } from "@shared/types/gameData/gameData"
import { bytesFromTextData, sanitizedNameList, stringFrom } from "@shared/utils/textConverters"
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
  
  const allNicknames = sanitizedNameList(method.SETTINGS.CUSTOM_LIST.POKEMON_NICKNAMES, 10, true)
  
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
  
  const getRandomNicknameWithMaxLength = (maxLength: number) => {
    let options = availableNicknames.filter((name) => {
      return bytesFromTextData(name).length <= maxLength
    })
  
    if (options.length === 0) {
      options = allNicknames.filter((name) => {
        return bytesFromTextData(name).length <= maxLength
      })
    }
  
    if (options.length === 0) {
      options = (availableNicknames.length !== 0 ? availableNicknames : allNicknames).map((name) => {
        return stringFrom(bytesFromTextData(name).slice(0, maxLength))
      })
    }
    
    return random.element({ array: options })
  }
  
  gameData.shuckieNickname = getRandomNicknameWithMaxLength(7)
  gameData.kenyaNickname = getRandomNicknameWithMaxLength(5)
}