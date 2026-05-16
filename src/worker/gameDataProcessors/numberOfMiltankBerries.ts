import type { Settings } from "@shared/appData/settingsFromViewModel"
import type { ROMInfo } from "@shared/romUtils/romInfo"
import type { Random } from "@worker/random"

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