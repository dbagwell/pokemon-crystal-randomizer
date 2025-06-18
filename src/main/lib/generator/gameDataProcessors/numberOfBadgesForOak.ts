import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"

export const updateNumberOfBadgesForOak = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (settings.RANDOMIZE_NUMBER_OF_BADGES_FOR_OAK.VALUE) {
    const range = settings.RANDOMIZE_NUMBER_OF_BADGES_FOR_OAK.SETTINGS.RANGE
    romInfo.gameData.numberOfBadgesForOak = random.int(range.MIN, range.MAX)
  }
}