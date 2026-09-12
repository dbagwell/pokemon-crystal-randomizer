import type { APOptions } from "@shared/appData/apOptions"
import type { Settings } from "@shared/appData/settingsFromViewModel"

export const generateAPOptions = (apOptions: APOptions, settings: Settings) => {
  const gameName = "Pokemon Krystal"
  return {
    name: apOptions.slotName,
    game: gameName,
    requires: {
      version: "0.6.7",
      game: {
        [gameName]: "0.7.0",
      },
    },
    [gameName]: {
      progression_balancing: apOptions.progressionBalancing,
      settings: settings,
    },
  }
}