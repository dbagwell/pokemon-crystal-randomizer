import { type APOptions, defaultAutoSellItemIds } from "@shared/appData/apOptions"
import type { Settings } from "@shared/appData/settingsFromViewModel"

export const generateAPOptions = (apOptions: APOptions, settings: Settings) => {
  const gameName = "Pokemon Krystal"
  return {
    name: `${apOptions.SLOT_NAME}{NUMBER}`,
    game: gameName,
    requires: {
      version: "0.6.7",
      game: {
        [gameName]: "0.7.0",
      },
    },
    [gameName]: {
      progression_balancing: apOptions.PROGRESSION_BALANCING,
      auto_sell_items: apOptions.AUTO_SELL_ITEMS.VALUE
        ? apOptions.AUTO_SELL_ITEMS.SETTINGS.ITEM_SET.VALUE === "DEFAULT"
          ? defaultAutoSellItemIds
          : apOptions.AUTO_SELL_ITEMS.SETTINGS.ITEM_SET.SETTINGS.CUSTOM.ITEMS
        : [],
      settings: settings,
    },
  }
}