import type { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { hiddenItemLocationIds, regularItemBallLocationIds, tmItemBallLocationIds } from "@shared/types/gameDataIds/itemLocations"
import { ballItemIds, regularItemIds, tmItemIds } from "@shared/types/gameDataIds/items"

export const updateItems = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number
) => {
  if (settings.RANDOMIZE_REGULAR_ITEM_BALLS) {
    const availableItemIds = [
      ...regularItemIds,
      ...ballItemIds,
    ].filter((itemId) => {
      return !settings.BANNED_ITEMS.includes(itemId)
    })
    
    regularItemBallLocationIds.forEach((locationId) => {
      romInfo.gameData.itemLocations[locationId].itemId = availableItemIds[randomInt(0, availableItemIds.length - 1)]
    })
    
    romInfo.gameData.mapObjectEvents.find((event) => {
      return event.flagId === "DRAGONS_DEN_B1F_DRAGON_FANG"
    })!.typeId = "ITEMBALL"
  }
  
  if (settings.RANDOMIZE_TM_ITEM_BALLS) {
    const availableItemIds = tmItemIds.filter((itemId) => {
      return !settings.BANNED_ITEMS.includes(itemId)
    })
    
    tmItemBallLocationIds.forEach((locationId) => {
      romInfo.gameData.itemLocations[locationId].itemId = availableItemIds[randomInt(0, availableItemIds.length - 1)]
    })
  }
  
  if (settings.RANDOMIZE_HIDDEN_ITEMS) {
    const availableItemIds = [
      ...regularItemIds,
      ...ballItemIds,
    ].filter((itemId) => {
      return !settings.BANNED_ITEMS.includes(itemId)
    })
    
    hiddenItemLocationIds.forEach((locationId) => {
      romInfo.gameData.itemLocations[locationId].itemId = availableItemIds[randomInt(0, availableItemIds.length - 1)]
    })
  }
}