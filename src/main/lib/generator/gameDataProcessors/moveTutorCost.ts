import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"

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