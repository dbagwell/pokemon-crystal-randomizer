import type { Settings } from "@shared/appData/settingsFromViewModel"
import type { ROMInfo } from "@shared/romUtils/romInfo"
import type { Random } from "@worker/random"

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