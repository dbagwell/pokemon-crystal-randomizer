import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"

export const updateNumberOfMiltankBerries = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (settings.RANDOMIZE_NUMBER_OF_BERRIES_FOR_MILTANK.VALUE) {
    const range = settings.RANDOMIZE_NUMBER_OF_BERRIES_FOR_MILTANK.SETTINGS.RANGE
    romInfo.gameData.numberOfMiltankBerries = random.int(range.MIN, range.MAX)
  }
}