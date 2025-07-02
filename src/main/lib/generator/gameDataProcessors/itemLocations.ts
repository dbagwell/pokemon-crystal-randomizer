import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import { getYAML } from "@lib/utils/yamlUtils"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import type { ItemLocation } from "@shared/types/gameData/itemLocation"
import type { LogicalAccessArea, LogicalAreaAccessOption } from "@shared/types/gameData/logicalAccessArea"
import type { Mart, SpecialShop } from "@shared/types/gameData/mart"
import { type AccessRequirement, isAccessRequirement, type Warp } from "@shared/types/gameData/warp"
import { type ItemLocationId, itemLocationIds, regularHiddenItemLocationIds, regularItemBallLocationIds, tmItemBallLocationIds } from "@shared/types/gameDataIds/itemLocations"
import { type BadgeItemId, badgeItemIds, ballItemIds, type HoldableItemId, holdableItemIds, type ItemId, itemIds, regularItemIds, repelItemIds, simpleHealingItemIds, tmItemIds } from "@shared/types/gameDataIds/items"
import { type LogicalAccessAreaId, logicalAccessAreaIds } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import { martGroupIds } from "@shared/types/gameDataIds/martGroups"
import { type MartId, martIds, type SpecialShopId, specialShopIds } from "@shared/types/gameDataIds/marts"
import { type PokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { type WarpId, warpIds } from "@shared/types/gameDataIds/warps"
import { compact, isNotNullish, isNullish, isNumber, isObject, isString, removeFirstElementFromArrayWhere } from "@shared/utils"
import path from "path"

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
  
  if (settings.START_WITH_ITEMS.SETTINGS.REPLACE_EXISTING_ITEMS) {
    const startingItems = startingItemIds(settings)
    
    itemLocationIds.forEach((locationId) => {
      if (startingItems.includes(romInfo.gameData.itemLocations[locationId].itemId)) {
        const replacement = settings.START_WITH_ITEMS.SETTINGS.REPLACE_EXISTING_ITEMS.SETTINGS.REPLACEMENT
        
        if (replacement === "RANDOM") {
          romInfo.gameData.itemLocations[locationId].itemId = random.element({ array: [...holdableItemIds] })
        } else {
          romInfo.gameData.itemLocations[locationId].itemId = replacement
        }
      }
    })
  }
}

const pokemonRequirements: ItemId[] = [
  "HIVEBADGE",
  "FOGBADGE",
  "PLAINBADGE",
  "ZEPHYRBADGE",
  "GLACIERBADGE",
  "RISINGBADGE",
  "HM01",
  "HM03",
  "HM04",
  "HM05",
  "HM06",
  "HM07",
  "SQUIRTBOTTLE",
  "PASS",
  "S_S_TICKET",
  "CARD_KEY",
  "CLEAR_BELL",
  "RAINBOW_WING",
  "BICYCLE",
  "POKEGEAR",
  "RADIO_CARD",
  "EXPN_CARD",
  "POKEDEX",
  "TM02",
  "TM08",
  "TM12",
  "OLD_ROD",
  "GOOD_ROD",
  "SUPER_ROD",
]

export const shuffleItems = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (!settings.SHUFFLE_ITEMS.VALUE) {
    return
  }
  
  const shuffleItemsSettings = settings.SHUFFLE_ITEMS.SETTINGS
  
  const locationsToShuffle: ({
    type: "NORMAL"
    locationId: ItemLocationId
    shuffleGroupIndex: number
  } | {
    type: "MART"
    martId: MartId
    shopMenuIndex: number
    shuffleGroupIndex: number
  } | {
    type: "SPECIAL_SHOP"
    shopId: SpecialShopId
    shopMenuIndex: number
    shuffleGroupIndex: number
  })[] = []
  
  const itemsToShuffle: { itemId: ItemId, shuffleGroupIndex: number }[] = []
  
  const startingItems = startingItemIds(settings)
  
  Object.values(romInfo.gameData.itemLocations).forEach((location) => {
    const shuffleGroupIndex = shuffleItemsSettings.GROUPS.findIndex((shuffleGroup) => {
      const groupId = shuffleGroup.find((groupId) => {
        return groupId === location.groupId
      })
      
      return isNotNullish(groupId)
    })
    
    if (shuffleGroupIndex !== -1 && !shuffleItemsSettings.EXCLUDE_LOCATIONS.includes(location.id)) {
      locationsToShuffle.push({
        type: "NORMAL",
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
  
  const shopsShuffleGroupIndex = shuffleItemsSettings.GROUPS.findIndex((group) => {
    return group.includes("SHOPS")
  })
  
  if (shopsShuffleGroupIndex >= 0) {
    Object.values(romInfo.gameData.marts).forEach((mart) => {
      mart.items.forEach((itemId, index) => {
        const ignoredMartIds: MartId[] = [
          "CHERRYGROVE_1",
          "GOLDENROD_5F_1",
          "GOLDENROD_5F_2",
          "GOLDENROD_5F_3",
          "GOLDENROD_5F_5",
          "GOLDENROD_5F_6",
          "GOLDENROD_5F_7",
          settings.BUYABLE_TM12 ? "GOLDENROD_5F_4" : "GOLDENROD_5F_8",
        ]
        
        if (!ignoredMartIds.includes(mart.id) && !shuffleItemsSettings.EXCLUDE_LOCATIONS.includes(mart.groupId)) {
          locationsToShuffle.push({
            type: "MART",
            martId: mart.id,
            shopMenuIndex: index,
            shuffleGroupIndex: shopsShuffleGroupIndex,
          })
        
          itemsToShuffle.push({
            itemId: itemId,
            shuffleGroupIndex: shopsShuffleGroupIndex,
          })
        
          mart.items[index] = undefined as unknown as ItemId
        }
      })
    })
    
    Object.values(romInfo.gameData.specialShops).forEach((shop) => {
      shop.items.forEach((itemInfo, index) => {
        if (!shuffleItemsSettings.EXCLUDE_LOCATIONS.includes(shop.id)) {
          locationsToShuffle.push({
            type: "SPECIAL_SHOP",
            shopId: shop.id,
            shopMenuIndex: index,
            shuffleGroupIndex: shopsShuffleGroupIndex,
          })
        
          itemsToShuffle.push({
            itemId: itemInfo.itemId,
            shuffleGroupIndex: shopsShuffleGroupIndex,
          })
        
          shop.items[index].itemId = undefined as unknown as ItemId
        }
      })
    })
  }
  
  const progressionItemIds = new Set<ItemId>([
    ...badgeItemIds,
    ...pokemonRequirements,
  ])
  
  Object.values(romInfo.gameData.areas).forEach((area) => {
    area.accessOptions.forEach((accessOption) => {
      if (Array.isArray(accessOption)) {
        accessOption.forEach((requirement) => {
          if (itemIds.includes(requirement as ItemId) || isObject(requirement) && itemIds.includes(requirement.item)) {
            progressionItemIds.add(isObject(requirement) ? requirement.item : requirement as ItemId)
          }
        })
      }
    })
  })
  
  Object.values(romInfo.gameData.warps).forEach((warp) => {
    warp.accessRequirements?.forEach((accessRequirement) => {
      if (itemIds.includes(accessRequirement as ItemId) || isObject(accessRequirement) && itemIds.includes(accessRequirement.item)) {
        progressionItemIds.add(isObject(accessRequirement) ? accessRequirement.item : accessRequirement as ItemId)
      }
    })
  })
  
  Object.values(romInfo.gameData.itemLocations).forEach((location) => {
    location.accessRequirements?.forEach((accessRequirement) => {
      if (itemIds.includes(accessRequirement as ItemId) || isObject(accessRequirement) && itemIds.includes(accessRequirement.item)) {
        progressionItemIds.add(isObject(accessRequirement) ? accessRequirement.item : accessRequirement as ItemId)
      }
    })
  })
  
  const remainingConsumableProgressionItems: typeof itemsToShuffle = []
  const remainingProgressionItems: typeof itemsToShuffle = []
  
  itemsToShuffle.filter((itemInfo) => {
    return [...progressionItemIds].includes(itemInfo.itemId)
  }).reduce((result, itemInfo) => {
    if (!result.some((resultItemInfo) => { return resultItemInfo.itemId === itemInfo.itemId })) {
      result.push(itemInfo)
    }
    
    return result
  }, [] as typeof itemsToShuffle).forEach((itemInfo) => {
    if (shuffleItemsSettings.IMPROVED_CONSUMABLE_ACCESS_LOGIC && holdableItemIds.includes(itemInfo.itemId as HoldableItemId)) {
      remainingConsumableProgressionItems.push(itemInfo)
    } else {
      remainingProgressionItems.push(itemInfo)
    }
  })
  
  remainingConsumableProgressionItems.forEach((itemInfo) => {
    removeFirstElementFromArrayWhere(itemsToShuffle, (itemToSuffleInfo) => {
      return itemToSuffleInfo.itemId === itemInfo.itemId && itemToSuffleInfo.shuffleGroupIndex === itemInfo.shuffleGroupIndex
    })
  })
  
  remainingProgressionItems.forEach((itemInfo) => {
    removeFirstElementFromArrayWhere(itemsToShuffle, (itemToSuffleInfo) => {
      return itemToSuffleInfo.itemId === itemInfo.itemId && itemToSuffleInfo.shuffleGroupIndex === itemInfo.shuffleGroupIndex
    })
  })
  
  if (shuffleItemsSettings.GROUPS.flat().includes("SHOPS")) {
    shuffleItemsSettings.GUARANTEED_SHOP_ITEMS.forEach((itemType) => {
      const remainingMartGroupIds = [...martGroupIds.filter((martGroupId) => { return !shuffleItemsSettings.EXCLUDE_LOCATIONS.includes(martGroupId) })]
      
      while (remainingMartGroupIds.length > 0) {
        const shopId = remainingMartGroupIds.find((id) => { return id === "CHERRYGROVE" }) ?? random.element({ array: remainingMartGroupIds })
        const shopIndex = remainingMartGroupIds.indexOf(shopId)
        remainingMartGroupIds.splice(shopIndex, 1)
      
        const locationInfo = random.element({
          array: locationsToShuffle.filter((locationInfo) => {
            return locationInfo.type === "MART" && romInfo.gameData.marts[locationInfo.martId].groupId === shopId && isNullish(romInfo.gameData.marts[locationInfo.martId].items[locationInfo.shopMenuIndex])
          }),
        }) as typeof locationsToShuffle[number] & { type: "MART" }
        
        const filterArray = (() => {
          switch (itemType) {
          case "BALL": return ballItemIds
          case "REPEL": return repelItemIds
          case "SIMPLE_HEALING_ITEM": return simpleHealingItemIds
          }
        })().filter((itemId) => {
          return !shuffleItemsSettings.PREVENT_SHOP_ITEMS.includes(itemId)
        })
        
        const selectedItemInfo = random.element({
          array: itemsToShuffle.filter((itemInfo) => {
            return (filterArray as readonly ItemId[]).includes(itemInfo.itemId) && locationInfo.shuffleGroupIndex === itemInfo.shuffleGroupIndex
          }),
          allowUndefined: true,
        })
        
        if (isNullish(selectedItemInfo)) {
          break
        }
        
        const condition = (itemInfo: typeof itemsToShuffle[number]) => {
          return itemInfo.itemId === selectedItemInfo.itemId && itemInfo.shuffleGroupIndex === selectedItemInfo.shuffleGroupIndex
        }
        
        if (remainingConsumableProgressionItems.some(condition)) {
          removeFirstElementFromArrayWhere(remainingConsumableProgressionItems, condition)
        } else {
          removeFirstElementFromArrayWhere(itemsToShuffle, condition)
        }
        
        romInfo.gameData.marts[locationInfo.martId].items[locationInfo.shopMenuIndex] = selectedItemInfo.itemId
      }
    })
  }
  
  const progressBannedShopLocations: typeof locationsToShuffle = []
      
  if (shuffleItemsSettings.DECREASE_PROGRESS_IN_SHOPS.VALUE) {
    const allShopLocations = locationsToShuffle.filter((locationInfo) => {
      return locationInfo.type === "MART" || locationInfo.type === "SPECIAL_SHOP"
    })
    
    const numberOfBannedShopLocations = Math.round(allShopLocations.length * shuffleItemsSettings.DECREASE_PROGRESS_IN_SHOPS.SETTINGS.PERCENTAGE / 100)
    
    for (let i = 0; i < numberOfBannedShopLocations; i++) {
      progressBannedShopLocations.push(random.element({
        array: allShopLocations,
        remove: true,
      }))
    }
  }
  
  while (remainingProgressionItems.length > 0) {
    const itemsArray = remainingConsumableProgressionItems.length > 0 ? remainingConsumableProgressionItems : remainingProgressionItems
    
    const selectedItemInfo = random.element({ array: itemsArray })
    
    const selectedItemIndex = itemsArray.findIndex((itemInfo) => {
      return itemInfo.itemId === selectedItemInfo.itemId && itemInfo.shuffleGroupIndex === selectedItemInfo.shuffleGroupIndex
    })
    
    itemsArray.splice(selectedItemIndex, 1)
    
    const invalidLocations: (ItemLocationId | MartId | SpecialShopId)[] = []
    let foundLocation = false
    
    while (!foundLocation) {
      const accessibleItemLocationsWithoutSelectedItem = getAccessibleItemLocations({
        itemLocationsMap: romInfo.gameData.itemLocations,
        warpsMap: romInfo.gameData.warps,
        areasMap: romInfo.gameData.areas,
        martsMap: romInfo.gameData.marts,
        specialShopsMap: romInfo.gameData.specialShops,
        usableItems: [
          ...startingItems,
          ...remainingConsumableProgressionItems.map((itemInfo) => {
            return itemInfo.itemId
          }),
          ...remainingProgressionItems.map((itemInfo) => {
            return itemInfo.itemId
          }),
        ],
        allowNormalConsumables: !shuffleItemsSettings.IMPROVED_CONSUMABLE_ACCESS_LOGIC,
      })
      
      const locationInfo = random.element({
        array: accessibleItemLocationsWithoutSelectedItem.filter((accessibleLocationInfo) => {
          if (accessibleLocationInfo.type === "NORMAL") {
            if (remainingConsumableProgressionItems.length > 0) {
              return false
            }
            
            return !invalidLocations.includes(accessibleLocationInfo.locationId) && locationsToShuffle.find((locationInfo) => {
              return locationInfo.type === "NORMAL" && locationInfo.locationId === accessibleLocationInfo.locationId
            })?.shuffleGroupIndex === selectedItemInfo.shuffleGroupIndex
          } else if (shuffleItemsSettings.PREVENT_SHOP_ITEMS.includes(selectedItemInfo.itemId)) {
            return false
          } else if (accessibleLocationInfo.type === "MART") {
            return !invalidLocations.includes(accessibleLocationInfo.martId) && (remainingConsumableProgressionItems.length > 0 || !progressBannedShopLocations.some((locationInfo) => {
              return locationInfo.type === "MART" && locationInfo.martId === accessibleLocationInfo.martId && locationInfo.shopMenuIndex === accessibleLocationInfo.shopMenuIndex
            })) && locationsToShuffle.find((locationInfo) => {
              return locationInfo.type === "MART" && locationInfo.martId === accessibleLocationInfo.martId
            })?.shuffleGroupIndex === selectedItemInfo.shuffleGroupIndex
          } else {
            return !invalidLocations.includes(accessibleLocationInfo.shopId) && (remainingConsumableProgressionItems.length > 0 || !progressBannedShopLocations.some((locationInfo) => {
              return locationInfo.type === "SPECIAL_SHOP" && locationInfo.shopId === accessibleLocationInfo.shopId && locationInfo.shopMenuIndex === accessibleLocationInfo.shopMenuIndex
            })) && locationsToShuffle.find((locationInfo) => {
              return locationInfo.type === "SPECIAL_SHOP" && locationInfo.shopId === accessibleLocationInfo.shopId
            })?.shuffleGroupIndex === selectedItemInfo.shuffleGroupIndex
          }
        }),
      })
      
      if (locationInfo.type === "NORMAL") {
        romInfo.gameData.itemLocations[locationInfo.locationId].itemId = selectedItemInfo.itemId
      } else if (locationInfo.type === "MART") {
        romInfo.gameData.marts[locationInfo.martId].items[locationInfo.shopMenuIndex] = selectedItemInfo.itemId
      } else {
        romInfo.gameData.specialShops[locationInfo.shopId].items[locationInfo.shopMenuIndex].itemId = selectedItemInfo.itemId
      }
      
      const accessibleItemLocationsWithoutOtherItems = getAccessibleItemLocations({
        itemLocationsMap: romInfo.gameData.itemLocations,
        warpsMap: romInfo.gameData.warps,
        areasMap: romInfo.gameData.areas,
        martsMap: romInfo.gameData.marts,
        specialShopsMap: romInfo.gameData.specialShops,
        usableItems: startingItems,
        allowNormalConsumables: !shuffleItemsSettings.IMPROVED_CONSUMABLE_ACCESS_LOGIC,
      })
      
      if (accessibleItemLocationsWithoutOtherItems.length === 0) {
        if (locationInfo.type === "NORMAL") {
          romInfo.gameData.itemLocations[locationInfo.locationId].itemId = undefined as unknown as ItemId
        } else if (locationInfo.type === "MART") {
          romInfo.gameData.marts[locationInfo.martId].items[locationInfo.shopMenuIndex] = undefined as unknown as ItemId
        } else {
          romInfo.gameData.specialShops[locationInfo.shopId].items[locationInfo.shopMenuIndex].itemId = undefined as unknown as ItemId
        }
        
        invalidLocations.push(locationInfo.type === "NORMAL" ? locationInfo.locationId : locationInfo.type === "MART" ? locationInfo.martId : locationInfo.shopId)
      } else {
        foundLocation = true
      }
    }
  }
  
  locationsToShuffle.filter((locationInfo) => {
    return locationInfo.type === "NORMAL" && isNullish(romInfo.gameData.itemLocations[locationInfo.locationId].itemId)
    || locationInfo.type === "MART" && isNullish(romInfo.gameData.marts[locationInfo.martId].items[locationInfo.shopMenuIndex])
    || locationInfo.type === "SPECIAL_SHOP" && isNullish(romInfo.gameData.specialShops[locationInfo.shopId].items[locationInfo.shopMenuIndex].itemId)
  }).toSorted((locationInfo1) => {
    return locationInfo1.type === "MART" || locationInfo1.type === "SPECIAL_SHOP" ? -1 : 1
  }).forEach((locationInfo) => {
    const selectedItemId = random.element({
      array: itemsToShuffle.filter((itemInfo) => {
        return itemInfo.shuffleGroupIndex === locationInfo.shuffleGroupIndex && (locationInfo.type === "NORMAL" || !shuffleItemsSettings.PREVENT_SHOP_ITEMS.includes(itemInfo.itemId))
      }),
    }).itemId
    
    if (locationInfo.type === "NORMAL") {
      romInfo.gameData.itemLocations[locationInfo.locationId].itemId = selectedItemId
    } else if (locationInfo.type === "MART") {
      romInfo.gameData.marts[locationInfo.martId].items[locationInfo.shopMenuIndex] = selectedItemId
    } else {
      romInfo.gameData.specialShops[locationInfo.shopId].items[locationInfo.shopMenuIndex].itemId = selectedItemId
    }
        
    const selectedItemIndex = itemsToShuffle.findIndex((itemInfo) => {
      return itemInfo.itemId === selectedItemId && itemInfo.shuffleGroupIndex === locationInfo.shuffleGroupIndex
    })
    
    itemsToShuffle.splice(selectedItemIndex, 1)
  })
  
  if (shopsShuffleGroupIndex >= 0) {
    if (!settings.EARLY_CHERRYGROVE_MART_POKE_BALLS) {
      romInfo.gameData.marts.CHERRYGROVE_1.items = romInfo.gameData.marts.CHERRYGROVE_2.items.slice(1)
    }
    
    if (!settings.EARLY_GOLDENROD_MART_TMS) {
      if (settings.BUYABLE_TM12) {
        romInfo.gameData.marts.GOLDENROD_5F_4.items = romInfo.gameData.marts.GOLDENROD_5F_8.items.slice(1, romInfo.gameData.marts.GOLDENROD_5F_8.items.length - 1)
      }
      
      romInfo.gameData.marts.GOLDENROD_5F_1.items = [...romInfo.gameData.marts.GOLDENROD_5F_4.items].splice(romInfo.gameData.marts.GOLDENROD_5F_4.items.length - 2, 2)
      romInfo.gameData.marts.GOLDENROD_5F_2.items = [...romInfo.gameData.marts.GOLDENROD_5F_4.items].splice(romInfo.gameData.marts.GOLDENROD_5F_4.items.length - 1, 1)
      romInfo.gameData.marts.GOLDENROD_5F_3.items = [...romInfo.gameData.marts.GOLDENROD_5F_4.items].splice(romInfo.gameData.marts.GOLDENROD_5F_4.items.length - 2, 1)
      
      if (settings.BUYABLE_TM12) {
        const addedItem = romInfo.gameData.marts.GOLDENROD_5F_8.items[romInfo.gameData.marts.GOLDENROD_5F_8.items.length - 1]
        romInfo.gameData.marts.GOLDENROD_5F_5.items = [...romInfo.gameData.marts.GOLDENROD_5F_1.items, addedItem]
        romInfo.gameData.marts.GOLDENROD_5F_6.items = [...romInfo.gameData.marts.GOLDENROD_5F_2.items, addedItem]
        romInfo.gameData.marts.GOLDENROD_5F_7.items = [...romInfo.gameData.marts.GOLDENROD_5F_3.items, addedItem]
      }
    }
  }
}

const getAccessibleItemLocations = (params: {
  itemLocationsMap: IdMap<ItemLocationId, ItemLocation>
  warpsMap: IdMap<WarpId, Warp>
  areasMap: IdMap<LogicalAccessAreaId, LogicalAccessArea>
  martsMap: IdMap<MartId, Mart>
  specialShopsMap: IdMap<SpecialShopId, SpecialShop>
  usableItems: ItemId[]
  allowNormalConsumables: boolean
}): ({
  type: "NORMAL"
  locationId: ItemLocationId
} | {
  type: "MART"
  martId: MartId
  shopMenuIndex: number
} | {
  type: "SPECIAL_SHOP"
  shopId: SpecialShopId
  shopMenuIndex: number
})[] => {
  const {
    itemLocationsMap,
    warpsMap,
    areasMap,
    martsMap,
    specialShopsMap,
    usableItems,
    allowNormalConsumables,
  } = params
  
  const accessibleWarps: WarpId[] = []
  const accessibleAreas: LogicalAccessAreaId[] = ["PLAYERS_HOUSE_2F"]
  const accessibleItems: ItemId[] = [...usableItems]
  const accessibleItemLocations: ItemLocationId[] = []
  const accessibleMarts: MartId[] = []
  const accessibleSpecialShops: SpecialShopId[] = []
  
  const numberOfAccessibleBadges = () => {
    return accessibleItems.reduce((result, itemId) => {
      if (badgeItemIds.includes(itemId as BadgeItemId)) {
        return result + 1
      } else {
        return result
      }
    }, 0)
  }
  
  const isAccessRequirementSatisfied = (requirement: LogicalAreaAccessOption | AccessRequirement): boolean => {
    if (Array.isArray(requirement)) {
      return requirement.reduce((result, requirement) => {
        return result && isAccessRequirementSatisfied(requirement)
      }, true)
    } else if (isObject(requirement)) {
      return accessibleItems.filter((item) => {
        return item === requirement.item
      }).length >= requirement.number || accessibleMarts.some((martId) => {
        return martsMap[martId].items.includes(requirement.item)
      })
    } else if (warpIds.includes(requirement as WarpId)) {
      return accessibleWarps.includes(requirement as WarpId)
    } else if (logicalAccessAreaIds.includes(requirement as LogicalAccessAreaId)) {
      return accessibleAreas.includes(requirement as LogicalAccessAreaId)
    } else if (itemLocationIds.includes(requirement as ItemLocationId)) {
      return accessibleItemLocations.includes(requirement as ItemLocationId)
    } else if (itemIds.includes(requirement as ItemId)) {
      return accessibleItems.includes(requirement as ItemId)
    } else if (pokemonIds.includes(requirement as PokemonId)) {
      // This currently checks accessiblity of all the items required (with vanilla warps) to see all the random encounter slots
      // It will need to be updated once we shuffle warps, also if we want to add an option to just check if specific pokemon are accessible
      return new Set(accessibleItems).isSupersetOf(new Set(pokemonRequirements)) && numberOfAccessibleBadges() >= 7
    } else if (isNumber(requirement)) {
      return numberOfAccessibleBadges() >= requirement
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
        
        if (isNotNullish(location.itemId) && (!holdableItemIds.includes(location.itemId as HoldableItemId) || allowNormalConsumables)) {
          accessibleItems.push(location.itemId)
        }
        
        didUpdate = true
      }
    })
    
    martIds.filter((martId) => {
      return !accessibleMarts.includes(martId)
    }).forEach((martId) => {
      const mart = martsMap[martId]
      if (accessibleAreas.includes(mart.areaId) && (mart.accessRequirements ?? []).reduce((result, accessRequirement) => {
        return result && isAccessRequirementSatisfied(accessRequirement)
      }, true)) {
        accessibleMarts.push(martId)
        
        mart.items.forEach((itemId) => {
          accessibleItems.push(itemId)
        })
        
        didUpdate = true
      }
    })
    
    specialShopIds.filter((shopId) => {
      return !accessibleSpecialShops.includes(shopId)
    }).forEach((shopId) => {
      const shop = specialShopsMap[shopId]
      if (accessibleAreas.includes(shop.areaId) && (shop.accessRequirements ?? []).reduce((result, accessRequirement) => {
        return result && isAccessRequirementSatisfied(accessRequirement)
      }, true)) {
        accessibleSpecialShops.push(shopId)
        
        shop.items.forEach((itemInfo) => {
          accessibleItems.push(itemInfo.itemId)
        })
        
        didUpdate = true
      }
    })
  }
  
  return [
    ...accessibleItemLocations.filter((locationId) => {
      return isNullish(itemLocationsMap[locationId].itemId)
    }).map((locationId) => {
      return {
        type: "NORMAL" as const,
        locationId: locationId,
      }
    }),
    ...accessibleMarts.flatMap((martId) => {
      return compact(martsMap[martId].items.map((itemId, index) => {
        if (isNullish(itemId)) {
          return {
            type: "MART" as const,
            martId: martId,
            shopMenuIndex: index,
          }
        } else {
          return undefined
        }
      }))
    }),
    ...accessibleSpecialShops.flatMap((shopId) => {
      return compact(specialShopsMap[shopId].items.map((itemInfo, index) => {
        if (isNullish(itemInfo.itemId)) {
          return {
            type: "SPECIAL_SHOP" as const,
            shopId: shopId,
            shopMenuIndex: index,
          }
        } else {
          return undefined
        }
      }))
    }),
  ]
}

export const updateAccessLogic = (
  settings: Settings,
  romInfo: ROMInfo,
) => {
  if (!settings.SHUFFLE_ITEMS.VALUE) {
    return
  }
  
  const addAccessRequirements = (params: {
    areaIds: LogicalAccessAreaId[]
    requirements: AccessRequirement[]
    matchingRequirements?: AccessRequirement[]
    modifyMutualAccess?: boolean
  }) => {
    const {
      areaIds,
      requirements,
      matchingRequirements,
      modifyMutualAccess,
    } = params
  
    areaIds.forEach((areaId) => {
      const area = romInfo.gameData.areas[areaId]
      area.accessOptions = area.accessOptions.map((option) => {
        const optionArray = [option].flat()
        
        if (new Set(optionArray).isSupersetOf(new Set(matchingRequirements)) && (!(modifyMutualAccess ?? false) || new Set(optionArray.filter((option) => { return isString(option) })).intersection(new Set(areaIds)).size > 0)) {
          optionArray.push(...requirements)
          return optionArray
        } else {
          return option
        }
      })
    })
  }
  
  const removeAccessRequirements = (params: {
    areaIds: LogicalAccessAreaId[]
    requirements: AccessRequirement[]
    matchingRequirements?: AccessRequirement[]
    modifyMutualAccess?: boolean
  }) => {
    const {
      areaIds,
      requirements,
      matchingRequirements,
      modifyMutualAccess,
    } = params
  
    areaIds.forEach((areaId) => {
      const area = romInfo.gameData.areas[areaId]
      area.accessOptions = area.accessOptions.map((option) => {
        const optionArray = [option].flat()
      
        if (new Set(optionArray).isSupersetOf(new Set(matchingRequirements)) && (!(modifyMutualAccess ?? false) || new Set(optionArray.filter((option) => { return isString(option) })).intersection(new Set(areaIds)).size > 0)) {
          return optionArray.filter((requirement) => {
            return !requirements.includes(requirement)
          })
        } else {
          return option
        }
      })
    })
  }
  
  if (settings.REMOVE_ROUTE_30_ROADBLOCK) {
    removeAccessRequirements({
      areaIds: [
        "ROUTE_30_CHERRYGROVE_SIDE",
        "ROUTE_30_VIOLET_SIDE",
      ],
      requirements: [
        "ELMS_LAB",
        "MYSTERY_EGG",
      ],
      modifyMutualAccess: true,
    })
  }
  
  if (settings.REMOVE_ILEX_CUT_TREE) {
    removeAccessRequirements({
      areaIds: [
        "ILEX_FOREST_SOUTH_AREA",
        "ILEX_FOREST_NORTH_AREA",
      ],
      requirements: [
        "HIVEBADGE",
        "HM01",
      ],
      modifyMutualAccess: true,
    })
  }
  
  if (settings.CLEAR_GOLDENROD_STORE_BASEMENT) {
    removeAccessRequirements({
      areaIds: [
        "GOLDENROD_DEPT_STORE_B1F_STORAGE_AREA",
      ],
      requirements: [
        "GOLDENROD_DEPT_STORE_ELEVATOR",
      ],
      matchingRequirements: [
        "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA",
      ],
    })
  }
  
  if (settings.SKIP_FLORIA) {
    romInfo.gameData.itemLocations.GOLDENROD_FLOWER_SHOP_OWNERS_GIFT.accessRequirements = romInfo.gameData.itemLocations.GOLDENROD_FLOWER_SHOP_OWNERS_GIFT.accessRequirements?.filter((requirement) => {
      return requirement !== "ROUTE_36_WEST_AREA" && requirement !== "GOLDENROD_CITY_MAIN_AREA"
    })
  }
  
  if (settings.SKIP_MAHOGANY_ROCKETS) {
    const itemLocation = romInfo.gameData.itemLocations["TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT"]
    itemLocation.areaId = "LAKE_OF_RAGE_MAIN_AREA"
    itemLocation.accessRequirements = [
      "LAKE_OF_RAGE_SURF_AREA_SHINYS_GIFT",
    ]
  }
  
  if (settings.SKIP_GOLDENROD_ROCKETS) {
    const locationsToChange: ItemLocationId[] = [
      "RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT",
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    ]
    
    locationsToChange.forEach((locationId) => {
      const itemLocation = romInfo.gameData.itemLocations[locationId]
      itemLocation.areaId = "LAKE_OF_RAGE_MAIN_AREA"
      itemLocation.accessRequirements = [
        "LAKE_OF_RAGE_SURF_AREA_SHINYS_GIFT",
      ]
    })
    
    romInfo.gameData.areas.TEAM_ROCKET_BASE_B2F_CENTRAL_AREA.accessOptions.push([
      "TEAM_ROCKET_BASE_B2F_SOUTH_AREA",
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
    ])
    
    romInfo.gameData.areas.TEAM_ROCKET_BASE_B3F_ADMIN_AREA.accessOptions.push([
      "TEAM_ROCKET_BASE_B3F_NW_AREA",
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
    ])
    
    romInfo.gameData.areas.ROUTE_44.accessOptions.push([
      "MAHOGANY_TOWN",
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
    ]),
    
    // TODO: This should acutally be added an additional separate access option, instead of just replacing the previous requirement, but we don't currently support that for warps
    romInfo.gameData.warps.RADIO_TOWER_2F_STAIRS_UP.accessRequirements = [
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
    ]
    
    romInfo.gameData.areas.RADIO_TOWER_3F_EAST_AREA.accessOptions.push([
      "RADIO_TOWER_3F_WEST_AREA",
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
    ])
    
    romInfo.gameData.areas.RADIO_TOWER_3F_WEST_AREA.accessOptions.push([
      "RADIO_TOWER_3F_EAST_AREA",
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
    ])
  }
  
  if (settings.REMOVE_ROCKET_GRUNTS.includes("GOLDENROD_FLOWER_SHOP")) {
    removeAccessRequirements({
      areaIds: [
        "GOLDENROD_CITY_FLOWER_SHOP_AREA",
        "GOLDENROD_CITY_MAIN_AREA",
      ],
      requirements: [
        "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
      ],
      modifyMutualAccess: true,
    })
  }
  
  if (settings.RADIO_CARD_QUIZ_ALWAYS_ACCESSIBLE) {
    romInfo.gameData.itemLocations.RADIO_TOWER_1F_QUIZ_PRIZE.accessRequirements = undefined
  }
  
  if (settings.BUENA_ALWAYS_GIVES_ITEM) {
    romInfo.gameData.itemLocations.RADIO_TOWER_2F_BUENAS_GIFT.accessRequirements = undefined
  }
  
  if (settings.REMOVE_ROCKET_GRUNTS.includes("GOLDENROD_SE_AREA")) {
    removeAccessRequirements({
      areaIds: [
        "GOLDENROD_CITY_EAST_AREA",
        "GOLDENROD_CITY_MAIN_AREA",
      ],
      requirements: [
        "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
      ],
      modifyMutualAccess: true,
    })
  }
  
  romInfo.gameData.itemLocations.ROUTE_39_FARMHOUSE_LADYS_GIFT.accessRequirements = romInfo.gameData.numberOfMiltankBerries > 0 ? [
    "ROUTE_39_BARN",
    { item: "BERRY", number: romInfo.gameData.numberOfMiltankBerries },
  ] : undefined
  
  romInfo.gameData.specialShops.MOOMOO_FARM.accessRequirements = romInfo.gameData.numberOfMiltankBerries > 0 ? [
    "ROUTE_39_BARN",
    { item: "BERRY", number: romInfo.gameData.numberOfMiltankBerries },
  ] : undefined
  
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
  
  if (settings.CLIMB_TIN_TOWER_FOR_HO_OH_CHAMBER) {
    romInfo.gameData.warps.RUINS_OF_ALPH_HO_OH_CHAMBER_TOP_CAVE_IN.accessRequirements = ["TIN_TOWER_ROOF"]
  }
  
  if (settings.SKIP_GOLDENROD_ROCKETS) {
    const locationsToChange: ItemLocationId[] = [
      "DRAGON_SHRINE_BADGE",
    ]
    
    locationsToChange.forEach((locationId) => {
      const itemLocation = romInfo.gameData.itemLocations[locationId]
      itemLocation.areaId = "BLACKTHORN_GYM_1F_BACK_AREA"
    })
  }
  
  if (settings.RIDE_TRAIN_WITHOUT_POWER) {
    removeAccessRequirements({
      areaIds: [
        "GOLDENROD_MAGNET_TRAIN_STATION",
        "SAFFRON_MAGNET_TRAIN_STATION",
      ],
      requirements: [
        "POWER_PLANT",
        "MACHINE_PART",
      ],
      modifyMutualAccess: true,
    })
  }
  
  if (settings.ENABLE_GS_BALL_EVENT) {
    romInfo.gameData.itemLocations.GOLDENROD_POKECENTER_1F_LINK_RECEPTIONISTS_GIFT.accessRequirements = [
      "HALL_OF_FAME",
    ]
  }
  
  if (settings.CHANGE_SS_AQUA_REQUIREMENTS.includes("SKIP_E4")) {
    removeAccessRequirements({
      areaIds: [
        "FAST_SHIP_1F_MAIN_AREA",
        "OLIVINE_PORT_NORTH_AREA",
      ],
      requirements: [
        "HALL_OF_FAME",
      ],
    })
  }
  
  if (settings.FLY_TO_OLIVINE_FROM_PORT) {
    romInfo.gameData.areas.OLIVINE_CITY.accessOptions.push([
      "OLIVINE_PORT_NORTH_AREA",
      "STORMBADGE",
      "HM02",
    ])
    
    romInfo.gameData.areas.OLIVINE_CITY.accessOptions.push([
      "OLIVINE_PORT_SOUTH_AREA",
      "STORMBADGE",
      "HM02",
    ])
  }
  
  if (settings.CHANGE_PHONE_CALL_TRAINER_BEHAVIOUR.includes("SKIP_TO_STRONGEST_AVAILABLE_REMATCH")) {
    const powerPlantRequirements: AccessRequirement[] = [
      "POKEGEAR",
      "POWER_PLANT_MANAGERS_GIFT",
    ]
    
    romInfo.gameData.itemLocations.OLIVINE_LIGHTHOUSE_2F_HUEYS_GIFT.accessRequirements = [...powerPlantRequirements]
    romInfo.gameData.itemLocations.ROUTE_44_VANCES_GIFT.accessRequirements = [...powerPlantRequirements]
    romInfo.gameData.itemLocations.ROUTE_45_PARRYS_GIFT.accessRequirements = [...powerPlantRequirements]
    romInfo.gameData.itemLocations.ROUTE_46_NORTH_AREA_ERINS_GIFT.accessRequirements = [...powerPlantRequirements]
    romInfo.gameData.itemLocations.ROUTE_30_CHERRYGROVE_SIDE_JOEYS_GIFT.accessRequirements = [
      "POKEGEAR",
      "HALL_OF_FAME",
    ]
  }
  
  if (settings.EARLY_CHERRYGROVE_MART_POKE_BALLS) {
    romInfo.gameData.marts.CHERRYGROVE_2.accessRequirements = []
  }
  
  if (settings.EARLY_GOLDENROD_MART_TMS) {
    romInfo.gameData.marts.GOLDENROD_5F_8.accessRequirements = []
  }
  
  if (settings.SHUFFLE_ITEMS.VALUE && settings.SHUFFLE_ITEMS.SETTINGS.GROUPS.flat().includes("SHOPS")) {
    romInfo.gameData.marts.MAHOGANY_1.accessRequirements = []
  }
  
  if (settings.EARLY_MOUNT_SILVER.VALUE) {
    removeAccessRequirements({
      areaIds: [
        "VICTORY_ROAD_GATE_WEST_AREA",
        "VICTORY_ROAD_GATE_NORTH_AREA",
      ],
      requirements: [
        "OAKS_LAB",
        16,
      ],
      modifyMutualAccess: true,
    })
  } else if (settings.RANDOMIZE_NUMBER_OF_BADGES_FOR_OAK.VALUE) {
    removeAccessRequirements({
      areaIds: [
        "VICTORY_ROAD_GATE_WEST_AREA",
        "VICTORY_ROAD_GATE_NORTH_AREA",
      ],
      requirements: [
        16,
      ],
      modifyMutualAccess: true,
    })
    
    addAccessRequirements({
      areaIds: [
        "VICTORY_ROAD_GATE_WEST_AREA",
        "VICTORY_ROAD_GATE_NORTH_AREA",
      ],
      requirements: [
        romInfo.gameData.numberOfBadgesForOak,
      ],
      modifyMutualAccess: true,
    })
  }
  
  settings.SHUFFLE_ITEMS.SETTINGS.ACCESS_MODIFIERS.forEach((rulesetId) => {
    let rulesetInfo: any
    
    try {
      rulesetInfo = getYAML([path.resolve(__dirname, "accessRulesets", `${rulesetId}.yml`)])
    } catch (error) {
      throw new Error(`Cannot find selected ruleset of additional access modifiers '${rulesetId}'.`)
    }
    
    if (!isObject(rulesetInfo)) {
      throw new Error(`Access modifier ruleset '${rulesetId} is in an incorrect format.`)
    }
    
    if (isNotNullish(rulesetInfo.addedAreaRequirements)) {
      if (!Array.isArray(rulesetInfo.addedAreaRequirements)) {
        throw new Error(`Access modifier ruleset '${rulesetId} is in an incorrect format.`)
      }
      
      rulesetInfo.addedAreaRequirements.forEach((rule: any) => {
        if (!(
          isObject(rule)
        && Array.isArray(rule.requirements)
        && Array.isArray(rule.areaIds)
        && (Array.isArray(rule.matchingRequirements) || isNullish(rule.matchingRequirements))
        && rule.requirements.every((requirement: any) => {
          return isAccessRequirement(requirement)
        })
        && rule.areaIds.every((id: any) => {
          return logicalAccessAreaIds.includes(id)
        })
        && (rule.matchingRequirements?.every((requirement: any) => {
          return isAccessRequirement(requirement)
        }) ?? true)
        )) {
          throw new Error(`Access modifier ruleset '${rulesetId} is in an incorrect format.`)
        }
    
        addAccessRequirements(rule)
      })
    }
    
    if (isNotNullish(rulesetInfo.addedItemLocationAndWarpRequirements)) {
      if (!Array.isArray(rulesetInfo.addedItemLocationAndWarpRequirements)) {
        throw new Error(`Access modifier ruleset '${rulesetId} is in an incorrect format.`)
      }
      
      rulesetInfo.addedItemLocationAndWarpRequirements.forEach((rule: any) => {
        if (!(
          isObject(rule)
        && Array.isArray(rule.requirements)
        && Array.isArray(rule.itemLocationAndWarpIds)
        && rule.requirements.every((requirement: any) => {
          return isAccessRequirement(requirement)
        })
        && rule.itemLocationAndWarpIds.every((id: any) => {
          return itemLocationIds.includes(id) || warpIds.includes(id)
        })
        )) {
          throw new Error(`Access modifier ruleset '${rulesetId} is in an incorrect format.`)
        }
    
        rule.itemLocationAndWarpIds.forEach((id: any) => {
          if (itemLocationIds.includes(id)) {
            romInfo.gameData.itemLocations[id as ItemLocationId].accessRequirements = [
              ...romInfo.gameData.itemLocations[id as ItemLocationId].accessRequirements ?? [],
              ...rule.requirements,
            ]
          } else {
            romInfo.gameData.warps[id as WarpId].accessRequirements = [
              ...romInfo.gameData.warps[id as WarpId].accessRequirements ?? [],
              ...rule.requirements,
            ]
          }
        })
      })
    }
  })
}

const startingItemIds = (settings: Settings) => {
  const startingItemsSettings = settings.START_WITH_ITEMS.SETTINGS
  
  return [
    ...startingItemsSettings.BADGES,
    ...startingItemsSettings.HMS,
    ...startingItemsSettings.KEY_ITEMS,
    ...startingItemsSettings.MENU_ITEMS,
    ...Object.keys(startingItemsSettings.TMS),
    ...Object.keys(startingItemsSettings.REGULAR_ITEMS),
    ...Object.keys(startingItemsSettings.BALLS),
  ] as ItemId[]
}