import type { Random } from "@mainShared/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import type { ROMInfo } from "@shared/romUtils/romInfo"

export const updateMoveTutorCost = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (settings.RANDOMIZE_MOVE_TUTOR_COST.VALUE) {
    const range = settings.RANDOMIZE_MOVE_TUTOR_COST.SETTINGS.RANGE
    romInfo.gameData.moveTutorCost = random.int(range.MIN, range.MAX)
  }
}