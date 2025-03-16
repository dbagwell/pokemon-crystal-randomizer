import type { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { hiddenItemLocationIds, regularItemBallLocationIds, tmItemBallLocationIds } from "@shared/types/gameDataIds/itemLocations"
import { ballItemIds, regularItemIds, tmItemIds } from "@shared/types/gameDataIds/items"

export const updateItems = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number
) => {
  if (settings.RANDOMIZE_REGULAR_ITEM_BALLS.VALUE) {
    const availableItemIds = [
      ...regularItemIds,
      ...ballItemIds,
    ].filter((itemId) => {
      return !settings.BANNED_ITEMS.includes(itemId) && !settings.RANDOMIZE_REGULAR_ITEM_BALLS.SETTINGS.BAN.includes(itemId)
    })
    
    regularItemBallLocationIds.forEach((locationId) => {
      romInfo.gameData.itemLocations[locationId].itemId = availableItemIds[randomInt(0, availableItemIds.length - 1)]
    })
    
    romInfo.gameData.mapObjectEvents.find((event) => {
      return event.flagId === "DRAGONS_DEN_B1F_DRAGON_FANG"
    })!.typeId = "ITEMBALL"
  }
  
  if (settings.RANDOMIZE_TM_ITEM_BALLS.VALUE) {
    const availableItemIds = tmItemIds.filter((itemId) => {
      return !settings.BANNED_ITEMS.includes(itemId) && !settings.RANDOMIZE_TM_ITEM_BALLS.SETTINGS.BAN.includes(itemId)
    })
    
    tmItemBallLocationIds.forEach((locationId) => {
      romInfo.gameData.itemLocations[locationId].itemId = availableItemIds[randomInt(0, availableItemIds.length - 1)]
    })
  }
  
  if (settings.RANDOMIZE_HIDDEN_ITEMS.VALUE) {
    const availableItemIds = [
      ...regularItemIds,
      ...ballItemIds,
    ].filter((itemId) => {
      return !settings.BANNED_ITEMS.includes(itemId) && !settings.RANDOMIZE_HIDDEN_ITEMS.SETTINGS.BAN.includes(itemId)
    })
    
    hiddenItemLocationIds.forEach((locationId) => {
      romInfo.gameData.itemLocations[locationId].itemId = availableItemIds[randomInt(0, availableItemIds.length - 1)]
    })
  }
}

export const shuffleItems = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number
) => {
  settings.SHUFFLED_ITEM_GROUPS.forEach((group) => {
    const itemLocations = Object.values(romInfo.gameData.itemLocations).filter((location) => {
      return group.includes(location.groupId)
    })
    
    const itemIds = itemLocations.map((location) => {
      return location.itemId
    })
    
    itemLocations.forEach((location) => {
      const itemIndex = randomInt(0, itemIds.length - 1)
      location.itemId = itemIds[itemIndex]
      itemIds.splice(itemIndex, 1)
    })
  })
}