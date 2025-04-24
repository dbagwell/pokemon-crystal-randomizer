import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import { hiddenItemLocationIds, regularItemBallLocationIds, tmItemBallLocationIds } from "@shared/types/gameDataIds/itemLocations"
import { ballItemIds, regularItemIds, tmItemIds } from "@shared/types/gameDataIds/items"

export const updateItems = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (settings.RANDOMIZE_REGULAR_ITEM_BALLS.VALUE) {
    const availableItemIds = [
      ...regularItemIds,
      ...ballItemIds,
    ].filter((itemId) => {
      return !settings.BANNED_ITEMS.includes(itemId) && !settings.RANDOMIZE_REGULAR_ITEM_BALLS.SETTINGS.BAN.includes(itemId)
    })
    
    regularItemBallLocationIds.forEach((locationId) => {
      romInfo.gameData.itemLocations[locationId].itemId = random.element({
        array: availableItemIds,
        errorInfo: {
          elementName: "item",
          mainSettingName: "RANDOMIZE_REGULAR_ITEM_BALLS",
          conflictingSettings: [
            "RANDOMIZE_REGULAR_ITEM_BALLS.SETTINGS.BAN",
            "BANNED_ITEMS",
          ],
        },
      })
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
      romInfo.gameData.itemLocations[locationId].itemId = random.element({
        array: availableItemIds,
        errorInfo: {
          elementName: "item",
          mainSettingName: "RANDOMIZE_TM_ITEM_BALLS",
          conflictingSettings: [
            "RANDOMIZE_TM_ITEM_BALLS.SETTINGS.BAN",
            "BANNED_ITEMS",
          ],
        },
      })
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
      romInfo.gameData.itemLocations[locationId].itemId = random.element({
        array: availableItemIds,
        errorInfo: {
          elementName: "item",
          mainSettingName: "RANDOMIZE_HIDDEN_ITEMS",
          conflictingSettings: [
            "RANDOMIZE_HIDDEN_ITEMS.SETTINGS.BAN",
            "BANNED_ITEMS",
          ],
        },
      })
    })
  }
}

export const shuffleItems = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  settings.SHUFFLED_ITEM_GROUPS.forEach((group) => {
    const itemLocations = Object.values(romInfo.gameData.itemLocations).filter((location) => {
      return group.includes(location.groupId)
        && location.id !== "NATIONAL_PARK_BUG_CONTEST_EAST_ITEM_BALL"
        && location.id !== "NATIONAL_PARK_BUG_CONTEST_WEST_ITEM_BALL"
        && location.id !== "NATIONAL_PARK_BUG_CONTEST_HIDDEN_ITEM"
    })
    
    const itemIds = itemLocations.map((location) => {
      return location.itemId
    })
    
    itemLocations.forEach((location) => {
      location.itemId = random.element({ array: itemIds, remove: true })
    })
  })
}

export const syncContestItems = (romInfo: ROMInfo) => {
  romInfo.gameData.itemLocations["NATIONAL_PARK_BUG_CONTEST_EAST_ITEM_BALL"].itemId = romInfo.gameData.itemLocations["NATIONAL_PARK_EAST_ITEM_BALL"].itemId
  romInfo.gameData.itemLocations["NATIONAL_PARK_BUG_CONTEST_WEST_ITEM_BALL"].itemId = romInfo.gameData.itemLocations["NATIONAL_PARK_WEST_ITEM_BALL"].itemId
  romInfo.gameData.itemLocations["NATIONAL_PARK_BUG_CONTEST_HIDDEN_ITEM"].itemId = romInfo.gameData.itemLocations["NATIONAL_PARK_HIDDEN_ITEM"].itemId
}