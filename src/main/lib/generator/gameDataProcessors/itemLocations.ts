import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import type { ItemLocation } from "@shared/types/gameData/itemLocation"
import type { LogicalAccessArea, LogicalAreaAccessOption } from "@shared/types/gameData/logicalAccessArea"
import type { AccessRequirement, Warp } from "@shared/types/gameData/warp"
import { type ItemLocationId, itemLocationIds, regularHiddenItemLocationIds, regularItemBallLocationIds, tmItemBallLocationIds } from "@shared/types/gameDataIds/itemLocations"
import { type BadgeItemId, badgeItemIds, ballItemIds, type ItemId, itemIds, regularItemIds, tmItemIds } from "@shared/types/gameDataIds/items"
import { type LogicalAccessAreaId, logicalAccessAreaIds } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import { type PokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { type WarpId, warpIds } from "@shared/types/gameDataIds/warps"
import { isNotNullish, isNullish, isNumber } from "@shared/utils"

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
  
  if (settings.RANDOMIZE_REGULAR_HIDDEN_ITEMS.VALUE) {
    const availableItemIds = [
      ...regularItemIds,
      ...ballItemIds,
    ].filter((itemId) => {
      return !settings.BANNED_ITEMS.includes(itemId) && !settings.RANDOMIZE_REGULAR_HIDDEN_ITEMS.SETTINGS.BAN.includes(itemId)
    })
    
    regularHiddenItemLocationIds.forEach((locationId) => {
      romInfo.gameData.itemLocations[locationId].itemId = random.element({
        array: availableItemIds,
        errorInfo: {
          elementName: "item",
          mainSettingName: "RANDOMIZE_REGULAR_HIDDEN_ITEMS",
          conflictingSettings: [
            "RANDOMIZE_REGULAR_HIDDEN_ITEMS.SETTINGS.BAN",
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
  const locationsToShuffle: { locationId: ItemLocationId, shuffleGroupIndex: number }[] = []
  const itemsToShuffle: { itemId: ItemId, shuffleGroupIndex: number }[] = []
  
  if (settings.CHANGE_TIN_TOWER_REQUIREMENTS.includes("SKIP_BEASTS")) {
    romInfo.gameData.itemLocations["TIN_TOWER_1F_NORTH_SAGES_GIFT"].accessRequirements = romInfo.gameData.itemLocations["TIN_TOWER_1F_NORTH_SAGES_GIFT"].accessRequirements?.filter((requirement) => {
      return requirement !== "SUICUNE" && requirement !== "RAIKOU" && requirement !== "ENTEI"
    })
  }
  
  if (settings.CHANGE_TIN_TOWER_REQUIREMENTS.includes("SKIP_E4")) {
    romInfo.gameData.itemLocations["TIN_TOWER_1F_NORTH_SAGES_GIFT"].accessRequirements = romInfo.gameData.itemLocations["TIN_TOWER_1F_NORTH_SAGES_GIFT"].accessRequirements?.filter((requirement) => {
      return requirement !== "HALL_OF_FAME"
    })
  }
  
  if (settings.CHANGE_TIN_TOWER_REQUIREMENTS.includes("OPEN_STAIRS_WITH_RAINBOW_WING")) {
    romInfo.gameData.warps["TIN_TOWER_1F_STAIRS_UP"].accessRequirements = romInfo.gameData.warps["TIN_TOWER_1F_STAIRS_UP"].accessRequirements?.map((requirement) => {
      if (requirement === "TIN_TOWER_1F_NORTH_SAGES_GIFT") {
        return "RAINBOW_WING"
      } else {
        return requirement
      }
    })
  }
  
  Object.values(romInfo.gameData.itemLocations).forEach((location) => {
    if (
      location.id === "NATIONAL_PARK_BUG_CONTEST_EAST_ITEM_BALL"
      || location.id === "NATIONAL_PARK_BUG_CONTEST_WEST_ITEM_BALL"
      || location.id === "NATIONAL_PARK_BUG_CONTEST_HIDDEN_ITEM"
    ) {
      return
    }
    
    const shuffleGroupIndex = settings.SHUFFLED_ITEM_GROUPS.findIndex((shuffleGroup) => {
      const groupId = shuffleGroup.find((groupId) => {
        return groupId === location.groupId
      })
      
      return isNotNullish(groupId)
    })
    
    if (shuffleGroupIndex !== -1) {
      locationsToShuffle.push({
        locationId: location.id,
        shuffleGroupIndex: shuffleGroupIndex,
      })
      
      itemsToShuffle.push({
        itemId: location.itemId,
        shuffleGroupIndex: shuffleGroupIndex,
      })
      
      location.itemId = undefined as unknown as ItemId
    }
  })
  
  const progressionItemIds = new Set<ItemId>(badgeItemIds)
  
  Object.values(romInfo.gameData.areas).forEach((area) => {
    area.accessOptions.forEach((accessOption) => {
      if (Array.isArray(accessOption)) {
        accessOption.forEach((requirement) => {
          if (itemIds.includes(requirement as ItemId)) {
            progressionItemIds.add(requirement as ItemId)
          }
        })
      }
    })
  })
  
  Object.values(romInfo.gameData.warps).forEach((warp) => {
    warp.accessRequirements?.forEach((accessRequirement) => {
      if (itemIds.includes(accessRequirement as ItemId)) {
        progressionItemIds.add(accessRequirement as ItemId)
      }
    })
  })
  
  Object.values(romInfo.gameData.itemLocations).forEach((location) => {
    location.accessRequirements?.forEach((accessRequirement) => {
      if (itemIds.includes(accessRequirement as ItemId)) {
        progressionItemIds.add(accessRequirement as ItemId)
      }
    })
  })
  
  const remainingProgressionItems = itemsToShuffle.filter((itemInfo) => {
    return [...progressionItemIds].includes(itemInfo.itemId)
  })
  
  while (remainingProgressionItems.length > 0) {
    const selectedItemInfo = random.element({ array: remainingProgressionItems })
    
    const selectedItemIndex = remainingProgressionItems.findIndex((itemInfo) => {
      return itemInfo.itemId === selectedItemInfo.itemId
    })
    
    remainingProgressionItems.splice(selectedItemIndex, 1)
    
    const invalidLocations: ItemLocationId[] = []
    let foundLocation = false
    
    while (!foundLocation) {
      const accessibleItemLocationsWithoutSelectedItem = getAccessibleItemLocations({
        itemLocationsMap: romInfo.gameData.itemLocations,
        warpsMap: romInfo.gameData.warps,
        areasMap: romInfo.gameData.areas,
        usableItems: remainingProgressionItems.map((itemInfo) => {
          return itemInfo.itemId
        }),
      })
      
      const locationId = random.element({ array: accessibleItemLocationsWithoutSelectedItem.filter((locationId) => { return !invalidLocations.includes(locationId) && locationsToShuffle.find((locationInfo) => { return locationInfo.locationId === locationId })?.shuffleGroupIndex === selectedItemInfo.shuffleGroupIndex }) })
      
      romInfo.gameData.itemLocations[locationId].itemId = selectedItemInfo.itemId
      
      const accessibleItemLocationsWithoutOtherItems = getAccessibleItemLocations({
        itemLocationsMap: romInfo.gameData.itemLocations,
        warpsMap: romInfo.gameData.warps,
        areasMap: romInfo.gameData.areas,
        usableItems: [],
      })
      
      if (accessibleItemLocationsWithoutOtherItems.length === 0) {
        romInfo.gameData.itemLocations[locationId].itemId = undefined as unknown as ItemId
        
        invalidLocations.push(locationId)
      } else {
        foundLocation = true
      }
    }
  }
  
  const nonProgressionItems = itemsToShuffle.filter((itemInfo) => {
    return ![...progressionItemIds].includes(itemInfo.itemId)
  })
  
  locationsToShuffle.filter((locationInfo) => {
    return isNullish(romInfo.gameData.itemLocations[locationInfo.locationId].itemId)
  }).forEach((locationInfo) => {
    const selectedItemId = random.element({ array: nonProgressionItems.filter((itemInfo) => { return itemInfo.shuffleGroupIndex === locationInfo.shuffleGroupIndex }) }).itemId
    romInfo.gameData.itemLocations[locationInfo.locationId].itemId = selectedItemId
        
    const selectedItemIndex = nonProgressionItems.findIndex((itemInfo) => {
      return itemInfo.itemId === selectedItemId
    })
    
    nonProgressionItems.splice(selectedItemIndex, 1)
  })
}

export const syncContestItems = (romInfo: ROMInfo) => {
  romInfo.gameData.itemLocations["NATIONAL_PARK_BUG_CONTEST_EAST_ITEM_BALL"].itemId = romInfo.gameData.itemLocations["NATIONAL_PARK_EAST_ITEM_BALL"].itemId
  romInfo.gameData.itemLocations["NATIONAL_PARK_BUG_CONTEST_WEST_ITEM_BALL"].itemId = romInfo.gameData.itemLocations["NATIONAL_PARK_WEST_ITEM_BALL"].itemId
  romInfo.gameData.itemLocations["NATIONAL_PARK_BUG_CONTEST_HIDDEN_ITEM"].itemId = romInfo.gameData.itemLocations["NATIONAL_PARK_HIDDEN_ITEM"].itemId
}

const getAccessibleItemLocations = (params: {
  itemLocationsMap: IdMap<ItemLocationId, ItemLocation>
  warpsMap: IdMap<WarpId, Warp>
  areasMap: IdMap<LogicalAccessAreaId, LogicalAccessArea>
  usableItems: ItemId[]
}): ItemLocationId[] => {
  const {
    itemLocationsMap,
    warpsMap,
    areasMap,
    usableItems,
  } = params
  
  const accessibleWarps: WarpId[] = []
  const accessibleAreas: LogicalAccessAreaId[] = ["PLAYERS_HOUSE_2F"]
  const accessibleItems: ItemId[] = [...usableItems]
  const accessibleItemLocations: ItemLocationId[] = []
  
  const numberOfAccessibleBadges = accessibleItems.reduce((result, itemId) => {
    if (badgeItemIds.includes(itemId as BadgeItemId)) {
      return result + 1
    } else {
      return result
    }
  }, 0)
  
  const isAccessRequirementSatisfied = (requirement: LogicalAreaAccessOption | AccessRequirement): boolean => {
    if (Array.isArray(requirement)) {
      return requirement.reduce((result, requirement) => {
        return result && isAccessRequirementSatisfied(requirement)
      }, true)
    } else if (warpIds.includes(requirement as WarpId)) {
      return accessibleWarps.includes(requirement as WarpId)
    } else if (logicalAccessAreaIds.includes(requirement as LogicalAccessAreaId)) {
      return accessibleAreas.includes(requirement as LogicalAccessAreaId)
    } else if (itemLocationIds.includes(requirement as ItemLocationId)) {
      return accessibleItemLocations.includes(requirement as ItemLocationId)
    } else if (itemIds.includes(requirement as ItemId)) {
      return accessibleItems.includes(requirement as ItemId)
    } else if (pokemonIds.includes(requirement as PokemonId)) {
      return false // TODO: Need to properly check if pokemon are accessible
    } else if (isNumber(requirement)) {
      return numberOfAccessibleBadges >= requirement
    } else {
      return false // This should never happen
    }
  }
  
  let didUpdate = true
    
  while (didUpdate) {
    didUpdate = false
    
    warpIds.filter((warpId) => {
      return !accessibleWarps.includes(warpId)
    }).forEach((warpId) => {
      const warp = warpsMap[warpId]
      if (accessibleAreas.includes(warp.areaId) && (warp.accessRequirements ?? []).reduce((result, accessRequirement) => {
        return result && isAccessRequirementSatisfied(accessRequirement)
      }, true)) {
        accessibleWarps.push(warpId)
        didUpdate = true
      }
    })
    
    logicalAccessAreaIds.filter((areaId) => {
      return !accessibleAreas.includes(areaId)
    }).forEach((areaId) => {
      if (areasMap[areaId].accessOptions.reduce((result, accessOption) => {
        return result || isAccessRequirementSatisfied(accessOption)
      }, false)) {
        accessibleAreas.push(areaId)
        didUpdate = true
      }
    })
    
    itemLocationIds.filter((locationId) => {
      return !accessibleItemLocations.includes(locationId)
    }).forEach((locationId) => {
      const location = itemLocationsMap[locationId]
      if (accessibleAreas.includes(location.areaId) && (location.accessRequirements ?? []).reduce((result, accessRequirement) => {
        return result && isAccessRequirementSatisfied(accessRequirement)
      }, true)) {
        accessibleItemLocations.push(locationId)
        
        if (isNotNullish(itemLocationsMap[locationId].itemId)) {
          accessibleItems.push(itemLocationsMap[locationId].itemId)
          didUpdate = true
        }
      }
    })
  }
  
  return accessibleItemLocations.filter((locationId) => { return isNullish(itemLocationsMap[locationId].itemId) })
}