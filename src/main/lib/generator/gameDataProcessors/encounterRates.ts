import type { ROMInfo } from "@lib/gameData/romInfo"
import { getAdjustedEncounterRates } from "@lib/generator/dataConverters/encounterRates"
import type { Settings } from "@shared/appData/settingsFromViewModel"

export const updateEncounterRates = (
  settings: Settings,
  romInfo: ROMInfo,
) => {
  if (!settings.CHANGE_POKEMON_ENCOUNTER_RATIOS.VALUE) { return }
  
  const encounterRateSettings = settings.CHANGE_POKEMON_ENCOUNTER_RATIOS.SETTINGS
    
  romInfo.gameData.encounters.forEach((encounter) => {
    switch (encounter.type) {
    case "FISHING": {
      switch (encounter.rod) {
      case "OLD": {
        encounter.rate = getAdjustedEncounterRates(encounterRateSettings.OLD_ROD, 255)[encounter.slot]
        break
      }
      case "GOOD": {
        encounter.rate = getAdjustedEncounterRates(encounterRateSettings.GOOD_ROD, 255)[encounter.slot]
        break
      }
      case "SUPER": {
        encounter.rate = getAdjustedEncounterRates(encounterRateSettings.SUPER_ROD, 255)[encounter.slot]
        break
      }
      }
      break
    }
    case "TREE": {
      encounter.rate = encounterRateSettings.TREE[encounter.slot]
      break
    }
    case "ROCK": {
      encounter.rate = encounterRateSettings.ROCK[encounter.slot]
      break
    }
    case "CONTEST": {
      encounter.rate = encounterRateSettings.CONTEST[encounter.slot]
      break
    }
    }
  })
}