import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import { getYAML } from "@lib/utils/yamlUtils"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import type { GameData } from "@shared/types/gameData/gameData"
import type { ItemLocation } from "@shared/types/gameData/itemLocation"
import type { Mart, SpecialShop } from "@shared/types/gameData/mart"
import { type AccessRequirement, isAccessRequirement, type Warp } from "@shared/types/gameData/warp"
import type { ItemLocationGroupId } from "@shared/types/gameDataIds/itemLocationGroups"
import { type ItemLocationId, itemLocationIds, regularHiddenItemLocationIds, regularItemBallLocationIds, tmItemBallLocationIds } from "@shared/types/gameDataIds/itemLocations"
import { type BadgeItemId, badgeItemIds, ballItemIds, type HoldableItemId, holdableItemIds, isItemId, type ItemId, type KeyItemId, keyItemIds, type MenuItemId, menuItemIds, regularItemIds, repelItemIds, simpleHealingItemIds, tmItemIds } from "@shared/types/gameDataIds/items"
import { type LogicalAccessAreaId, logicalAccessAreaIds } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import { martGroupIds } from "@shared/types/gameDataIds/martGroups"
import { type MartId, martIds, type SpecialShopId, specialShopIds } from "@shared/types/gameDataIds/marts"
import { isPokemonId } from "@shared/types/gameDataIds/pokemon"
import { type WarpId, warpIds } from "@shared/types/gameDataIds/warps"
import { getAllCombinations, isNotNullish, isNullish, isNumber, isObject, isString, removeFirstElementFromArrayWhere, removeSupersets } from "@shared/utils"
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
  
  if (settings.START_WITH_ITEMS.SETTINGS.REPLACE_EXISTING_ITEMS.VALUE) {
    const startingItems = startingItemIds(settings)
    
    itemLocationIds.forEach((locationId) => {
      if (
        startingItems.includes(romInfo.gameData.itemLocations[locationId].itemId)
        && (
          menuItemIds.includes(romInfo.gameData.itemLocations[locationId].itemId as MenuItemId)
          || keyItemIds.includes(romInfo.gameData.itemLocations[locationId].itemId as KeyItemId)
          || badgeItemIds.includes(romInfo.gameData.itemLocations[locationId].itemId as BadgeItemId)
        )
      ) {
        const replacement = settings.START_WITH_ITEMS.SETTINGS.REPLACE_EXISTING_ITEMS.SETTINGS.REPLACEMENT
        
        if (replacement === "RANDOM") {
          romInfo.gameData.itemLocations[locationId].itemId = random.element({ array: [...holdableItemIds] })
        } else {
          romInfo.gameData.itemLocations[locationId].itemId = replacement
        }
      }
    })
  }
  
  if (settings.ADD_KANTO_BADGES_TO_TRAINER_CARD) {
    romInfo.gameData.items.SOULBADGE.associatedValue = 0b00100000
    romInfo.gameData.items.MARSHBADGE.associatedValue = 0b00010000
  }
}

type GeneralItemLocation = {
  type: "ITEM_LOCATION" | "MART" | "SPECIAL_SHOP"
  id: string
  groupId: ItemLocationGroupId
  shuffleGroupIndex: number
  accessOptions: AccessRequirement[][]
  itemId: ItemId | undefined
}

const getLocationIdInfo = (locationId: string) => {
  try {
    return JSON.parse(locationId)
  } catch {
    return {
      itemLocationId: locationId,
    }
  }
}

export const shuffleItems = (
  settings: Settings,
  romInfo: ROMInfo,
  random: Random,
) => {
  if (!settings.SHUFFLE_ITEMS.VALUE) {
    return
  }
  
  const shuffleItemsSettings = settings.SHUFFLE_ITEMS.SETTINGS
  
  if (!settings.CHANGE_MYSTERY_GIFT) {
    shuffleItemsSettings.EXCLUDE_LOCATIONS.push("GOLDENROD_DEPT_STORE_5F_MYSTERY_GIFT_GIRLS_GIFT")
  }
  
  if (!settings.ENABLE_GS_BALL_EVENT) {
    shuffleItemsSettings.EXCLUDE_LOCATIONS.push("GOLDENROD_POKECENTER_1F_LINK_RECEPTIONISTS_GIFT")
  }
  
  const shopsShuffleGroupIndex = shuffleItemsSettings.GROUPS.findIndex((group) => {
    return group.includes("SHOPS")
  })
  
  let allItemLocations = generalItemLocations(romInfo.gameData, settings)
  const locationsToShuffle: GeneralItemLocation[] = []
  const itemsToShuffle: { itemId: ItemId, shuffleGroupIndex: number }[] = []
  const startingAccessibleItems = startingItemIds(settings).map((itemId) => {
    return {
      itemId: itemId,
      isFromMart: false,
    }
  })
  
  allItemLocations.forEach((location) => {
    const locationIdInfo = getLocationIdInfo(location.id)
    
    if (
      (location.type !== "ITEM_LOCATION" || !(shuffleItemsSettings.EXCLUDE_LOCATIONS as string[]).includes(location.id))
      && (location.type !== "MART" || !(shuffleItemsSettings.EXCLUDE_LOCATIONS as string[]).includes(locationIdInfo.groupId))
      && (location.type !== "SPECIAL_SHOP" || !(shuffleItemsSettings.EXCLUDE_LOCATIONS as string[]).includes(locationIdInfo.shopId))
    ) {
      location.shuffleGroupIndex = shuffleItemsSettings.GROUPS.findIndex((group) => {
        return group.includes(location.groupId ?? "SHOPS")
      }) ?? -1
    }
    
    if (location.shuffleGroupIndex !== -1) {
      locationsToShuffle.push(location)
      itemsToShuffle.push({
        itemId: location.itemId!,
        shuffleGroupIndex: location.shuffleGroupIndex,
      })
      
      location.itemId = undefined
    }
  })
  
  if (settings.SHUFFLE_ITEMS.VALUE) {
    const replacements = settings.SHUFFLE_ITEMS.SETTINGS.REPLACE_ITEMS
    itemsToShuffle.filter((itemInfo) => {
      return Object.keys(replacements).includes(itemInfo.itemId)
    }).forEach((itemInfo) => {
      const percentage = replacements[itemInfo.itemId]!.PERCENTAGE
      if (random.int(0, percentage) <= percentage) {
        const replacement = replacements[itemInfo.itemId]!.REPLACEMENT
        
        if (replacement === "RANDOM") {
          itemInfo.itemId = random.element({ array: [...holdableItemIds] })
        } else {
          itemInfo.itemId = replacement
        }
      }
    })
  }
  
  const progressionItemIds = allItemLocations.reduce((result, location) => {
    location.accessOptions.forEach((option) => {
      option.forEach((requirement) => {
        if (isNumber(requirement)) {
          badgeItemIds.forEach((badge) => {
            result.add(badge)
          })
        } else if (isObject(requirement)) {
          result.add(requirement.item)
        } else {
          result.add(requirement as ItemId)
        }
      })
    })
    
    return result
  }, new Set<ItemId>())
  
  allItemLocations = allItemLocations.filter((location) => {
    return isNullish(location.itemId) || progressionItemIds.has(location.itemId)
  })
  
  const remainingConsumableProgressionItems: typeof itemsToShuffle = []
  const remainingKeyProgressionItems: typeof itemsToShuffle = []
  
  itemsToShuffle.filter((itemInfo) => {
    return progressionItemIds.has(itemInfo.itemId)
  }).reduce((result, itemInfo) => {
    if (
      shuffleItemsSettings.IMPROVED_CONSUMABLE_ACCESS_LOGIC
      && holdableItemIds.includes(itemInfo.itemId as HoldableItemId)
      && itemInfo.shuffleGroupIndex !== shopsShuffleGroupIndex
    ) {
      return result
    }
    
    if (!result.some((resultItemInfo) => { return resultItemInfo.itemId === itemInfo.itemId })) {
      result.push(itemInfo)
    }
    
    return result
  }, [] as typeof itemsToShuffle).forEach((itemInfo) => {
    if (shuffleItemsSettings.IMPROVED_CONSUMABLE_ACCESS_LOGIC && holdableItemIds.includes(itemInfo.itemId as HoldableItemId)) {
      remainingConsumableProgressionItems.push(itemInfo)
    } else {
      remainingKeyProgressionItems.push(itemInfo)
    }
  })
  
  remainingConsumableProgressionItems.forEach((itemInfo) => {
    removeFirstElementFromArrayWhere(itemsToShuffle, (itemToSuffleInfo) => {
      return itemToSuffleInfo.itemId === itemInfo.itemId && itemToSuffleInfo.shuffleGroupIndex === itemInfo.shuffleGroupIndex
    })
  })
  
  remainingKeyProgressionItems.forEach((itemInfo) => {
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
      
        const location = random.element({
          array: locationsToShuffle.filter((location) => {
            const locationIdInfo = getLocationIdInfo(location.id)
            return location.type === "MART" && locationIdInfo.groupId === shopId && isNullish(location.itemId)
          }),
        }) as GeneralItemLocation & { type: "MART" }
        
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
            return (filterArray as readonly ItemId[]).includes(itemInfo.itemId) && location.shuffleGroupIndex === itemInfo.shuffleGroupIndex
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
        
        location.itemId = selectedItemInfo.itemId
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
  
  while (remainingKeyProgressionItems.length > 0) {
    const itemsArray = remainingConsumableProgressionItems.length > 0 ? remainingConsumableProgressionItems : remainingKeyProgressionItems
    
    const selectedItemInfo = random.element({ array: itemsArray })
    
    const selectedItemIndex = itemsArray.findIndex((itemInfo) => {
      return itemInfo.itemId === selectedItemInfo.itemId && itemInfo.shuffleGroupIndex === selectedItemInfo.shuffleGroupIndex
    })
    
    itemsArray.splice(selectedItemIndex, 1)
    
    const allRemainingProgressionItems = [
      ...remainingConsumableProgressionItems,
      ...remainingKeyProgressionItems,
    ]
    
    const invalidLocations: string[] = []
    let foundLocation = false
    
    while (!foundLocation) {
      const location = random.element({
        array: getAccessibleLocations({
          accessibleItems: [
            ...startingAccessibleItems,
            ...allRemainingProgressionItems.map((item) => {
              return {
                itemId: item.itemId,
                isFromMart: true, // Might not always be correct, but is always correct when it matters.
              }
            }),
          ],
          allItemLocations: allItemLocations,
          allowNormalConsumables: !shuffleItemsSettings.IMPROVED_CONSUMABLE_ACCESS_LOGIC,
        }).filter((location) => {
          return isNullish(location.itemId)
            && !invalidLocations.includes(location.id)
            && location.shuffleGroupIndex === selectedItemInfo.shuffleGroupIndex
            && (!(holdableItemIds as readonly ItemId[]).includes(selectedItemInfo.itemId) || !shuffleItemsSettings.IMPROVED_CONSUMABLE_ACCESS_LOGIC || location.type === "MART")
            && (
              location.type === "ITEM_LOCATION"
              || !shuffleItemsSettings.PREVENT_SHOP_ITEMS.includes(selectedItemInfo.itemId) && !progressBannedShopLocations.some((bannedShopLocation) => {
                return bannedShopLocation.id === location.id
              })
            )
        }),
      })
      
      location.itemId = selectedItemInfo.itemId
      
      if (areAreCurrentAssignmentsValid({
        allItemLocations: allItemLocations,
        startingItems: startingAccessibleItems,
        allowNormalConsumables: !shuffleItemsSettings.IMPROVED_CONSUMABLE_ACCESS_LOGIC,
        unplacedItems: allRemainingProgressionItems,
        progressionItemIds: progressionItemIds,
      })) {
        foundLocation = true
      } else {
        location.itemId = undefined
        invalidLocations.push(location.id)
      }
    }
  }
  
  locationsToShuffle.filter((location) => {
    return isNullish(location.itemId)
  }).toSorted((locationInfo1) => {
    return locationInfo1.type === "MART" || locationInfo1.type === "SPECIAL_SHOP" ? -1 : 1
  }).forEach((location) => {
    const items = itemsToShuffle.filter((itemInfo) => {
      return itemInfo.shuffleGroupIndex === location.shuffleGroupIndex && (location.type === "ITEM_LOCATION" || !shuffleItemsSettings.PREVENT_SHOP_ITEMS.includes(itemInfo.itemId))
    })
    
    const selectedItemId = random.element({
      array: items,
    }).itemId
    
    location.itemId = selectedItemId
        
    const selectedItemIndex = itemsToShuffle.findIndex((itemInfo) => {
      return itemInfo.itemId === selectedItemId && itemInfo.shuffleGroupIndex === location.shuffleGroupIndex
    })
    
    itemsToShuffle.splice(selectedItemIndex, 1)
  })
  
  locationsToShuffle.forEach((location) => {
    const locationIdInfo = getLocationIdInfo(location.id)
    
    if (location.type === "ITEM_LOCATION") {
      romInfo.gameData.itemLocations[location.id as ItemLocationId].itemId = location.itemId!
    } else if (location.type === "MART") {
      Object.values(romInfo.gameData.marts).filter((mart) => {
        return mart.groupId === locationIdInfo.groupId
      }).forEach((mart) => {
        if (isNotNullish(mart.items[locationIdInfo.itemIndex])) {
          mart.items[locationIdInfo.itemIndex] = location.itemId!
        }
      })
    } else if (location.type === "SPECIAL_SHOP") {
      romInfo.gameData.specialShops[locationIdInfo.shopId as SpecialShopId].items[locationIdInfo.itemIndex].itemId = location.itemId!
    }
  })
  
  if (shuffleItemsSettings.GROUPS.some((group) => { return group.includes("SHOPS") })) {
    romInfo.gameData.specialShops.GOLDENROD_ROOFTOP_VENDOR_2.items = [
      ...romInfo.gameData.specialShops.GOLDENROD_ROOFTOP_VENDOR_1.items,
      ...romInfo.gameData.specialShops.GOLDENROD_ROOFTOP_VENDOR_2.items,
    ]
  }
}

const getAccessibleLocations = (params: {
  accessibleItems: AccessibleItem[]
  allItemLocations: GeneralItemLocation[]
  allowNormalConsumables: boolean
}) => {
  const {
    accessibleItems: [...accessibleItems],
    allItemLocations,
    allowNormalConsumables,
  } = params
  
  const accessibleItemLocations: GeneralItemLocation[] = []
  
  updateAccessibleItemsAndLocations({
    accessibleItems: accessibleItems,
    accessibleItemLocations: accessibleItemLocations,
    allItemLocations: allItemLocations,
    allowNormalConsumables: allowNormalConsumables,
  })
  
  return accessibleItemLocations
}

const generalItemLocations = (gameData: GameData, settings: Settings): GeneralItemLocation[] => {
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
  
  const convertAccessRequirements = (requirements: AccessRequirement[]) => {
    return requirements.flatMap((requirement) => {
      if (isPokemonId(requirement)) {
        // This currently checks accessiblity of all the items required (with vanilla warps) to see all the random encounter slots
        // It will need to be updated once we shuffle warps, also if we want to add an option to just check if specific pokemon are accessible
        return [
          7,
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
        ] as const
      } else {
        return [
          requirement,
        ]
      }
    }).map((requirement) => {
      return isString(requirement) ? requirement : JSON.stringify(requirement)
    })
  }
  
  const accessInfoFrom = (objects: ItemLocation[] | Warp[] | Mart[] | SpecialShop[], type: string) => {
    return objects.map((object) => {
      return {
        type: type,
        id: object.id,
        shuffleGroupIndex: -1,
        accessOptions: [
          convertAccessRequirements([
            object.areaId,
            ...object.accessRequirements ?? [],
          ]),
        ],
      }
    })
  }
    
  const accessInfoObjects = [
    ...accessInfoFrom(Object.values(gameData.itemLocations), "ITEM_LOCATION" as const),
    ...accessInfoFrom(Object.values(gameData.warps), "WARP" as const),
    ...accessInfoFrom(Object.values(gameData.marts), "MART" as const),
    ...accessInfoFrom(Object.values(gameData.specialShops), "SPECIAL_SHOP" as const),
    ...Object.values(gameData.areas).map((area) => {
      return {
        type: "AREA" as const,
        id: area.id,
        accessOptions: area.accessOptions.map((option) => {
          if (Array.isArray(option)) {
            return convertAccessRequirements(option)
          } else {
            return convertAccessRequirements([
              option,
            ])
          }
        }),
      }
    }).toSorted((a, b) => {
      return a.accessOptions.length - b.accessOptions.length
    }),
  ]

  const updateStringRequirementWith = (match: string, replacements: string[][]) => {
    accessInfoObjects.forEach((object) => {
      let objectWasModified = false
          
      const filteredReplacements = replacements.filter((requirements) => {
        return !requirements.some((requirement) => {
          return requirement === object.id
        })
      })
      
      object.accessOptions = object.accessOptions.flatMap((option) => {
        if (option.includes(match)) {
          objectWasModified = true
          
          if (filteredReplacements.length === 0 && option.some((requirement) => { return requirement === match })) {
            return []
          } else {
            return getAllCombinations([
              filteredReplacements,
              [
                option.filter((requirement) => {
                  return requirement !== match
                }),
              ].filter((requirements) => {
                return requirements.length > 0
              }),
            ])
          }
        } else {
          return [
            option,
          ]
        }
      })
      
      if (object.accessOptions.length > 1 && object.accessOptions.some((option) => { return option.length === 0 })) {
        object.accessOptions = [[]]
        objectWasModified = true
      }
      
      if (objectWasModified) {
        object.accessOptions = removeSupersets(object.accessOptions)
      }
    })
  }

  accessInfoObjects.forEach((object) => {
    updateStringRequirementWith(object.id, object.accessOptions)
  })
  
  const convertedAccessOptions = (options: string[][]) => {
    return options.map((option) => {
      return option.map((requirement) => {
        try {
          return JSON.parse(requirement)
        } catch {
          return requirement
        }
      })
    })
  }
  
  return accessInfoObjects.flatMap((object) => {
    if (object.type === "ITEM_LOCATION") {
      return [
        {
          ...object,
          groupId: gameData.itemLocations[object.id as ItemLocationId].groupId,
          itemId: gameData.itemLocations[object.id as ItemLocationId].itemId,
          accessOptions: convertedAccessOptions(object.accessOptions),
        },
      ] as GeneralItemLocation[]
    } else if (object.type === "MART") {
      return ignoredMartIds.includes(object.id as MartId) ? [] : gameData.marts[object.id as MartId].items.map((itemId, index) => {
        return {
          ...object,
          id: JSON.stringify({
            martId: object.id,
            groupId: gameData.marts[object.id as MartId].groupId,
            itemIndex: index,
          }),
          groupId: "SHOPS",
          itemId: itemId,
          accessOptions: convertedAccessOptions(object.accessOptions),
        }
      }) as GeneralItemLocation[]
    } else if (object.type === "SPECIAL_SHOP") {
      return gameData.specialShops[object.id as SpecialShopId].items.map((itemInfo, index) => {
        return {
          ...object,
          id: JSON.stringify({
            shopId: object.id,
            itemIndex: index,
          }),
          groupId: "SHOPS",
          itemId: itemInfo.itemId,
          accessOptions: convertedAccessOptions(object.accessOptions),
        }
      }) as GeneralItemLocation[]
    } else {
      return []
    }
  })
}

const areAreCurrentAssignmentsValid = (params: {
  allItemLocations: GeneralItemLocation[]
  startingItems: AccessibleItem[]
  allowNormalConsumables: boolean
  unplacedItems: { itemId: ItemId, shuffleGroupIndex: number }[]
  progressionItemIds: Set<ItemId>
}): boolean => {
  const {
    allItemLocations: inputAllItemLocations,
    startingItems,
    allowNormalConsumables,
    unplacedItems: [...unplacedItems],
    progressionItemIds,
  } = params
  
  const allItemLocations = JSON.parse(JSON.stringify(inputAllItemLocations)) as GeneralItemLocation[]
  const accessibleItems = [...startingItems] as AccessibleItem[]
  const accessibleItemLocations = [] as GeneralItemLocation[]
  
  updateAccessibleItemsAndLocations({
    accessibleItems: accessibleItems,
    accessibleItemLocations: accessibleItemLocations,
    allItemLocations: allItemLocations,
    allowNormalConsumables: allowNormalConsumables,
    updateAccessOptions: true,
  })
  
  updateAccessRequirementsUsingPlacedItems({
    accessibleItemLocations: accessibleItemLocations,
    allItemLocations: allItemLocations,
    progressionItemIds: progressionItemIds,
  })
  
  while (unplacedItems.length > 0) {
    const validShuffleGroups = accessibleItemLocations.reduce((result, location) => {
      if (isNullish(location.itemId)) {
        result.add(location.shuffleGroupIndex)
      }
      
      return result
    }, new Set<number>())
    
    const accessibleMartLocation = allowNormalConsumables ? accessibleItemLocations.find((location) => {
      return location.type === "MART"
    }) : undefined // Because this is only used later if `allowNormalConsumables` is true we skip this search to save time if it's false
    
    const validItems = unplacedItems.reduce((result, item) => {
      if (validShuffleGroups.has(item.shuffleGroupIndex)) {
        result.push(item)
      }
      
      return result
    }, [] as typeof unplacedItems)
    
    let nextItem: typeof unplacedItems[number] | undefined = undefined
    let foundUnassignedInaccessibleLocation = false
    let previousSmallestNumberOfRequirements = Number.POSITIVE_INFINITY
    
    for (let i = 0; i < allItemLocations.length; i++) {
      const location = allItemLocations[i]
      
      if (isNotNullish(location.itemId) || isNullish(location.accessOptions) || location.accessOptions.some((option) => { return option.length === 0 })) {
        continue
      }
      
      foundUnassignedInaccessibleLocation = true
      
      let possibleNextItem = undefined as typeof unplacedItems[number] | undefined
      
      const smallestNumberOfRequirements = location.accessOptions.reduce((result, option) => {
        let selectedItemFromRequirements = undefined as (typeof unplacedItems[number]) | undefined
        let numberOfRequiredItems = 0
        let numberOfBadgeItemRequirements = 0
        let largestBadgeNumberRequirement = 0
        
        for (let j = 0; j < option.length; j++) {
          const requirement = option[j]
          
          if (isNumber(requirement)) {
            if (requirement > 0) {
              largestBadgeNumberRequirement = Math.max(largestBadgeNumberRequirement, requirement)
              selectedItemFromRequirements = validItems.find((item) => {
                return (badgeItemIds as readonly ItemId[]).includes(item.itemId)
              })
            }
          } else if (isObject(requirement)) {
            if (allowNormalConsumables) {
              const martItem = validItems.find((item) => {
                return item.itemId === requirement.item && item.shuffleGroupIndex === accessibleMartLocation?.shuffleGroupIndex
              })
              
              selectedItemFromRequirements = martItem ?? validItems.find((item) => {
                return item.itemId === requirement.item
              })
              
              if (isNotNullish(martItem)) {
                numberOfRequiredItems++
              } else {
                numberOfRequiredItems += Math.max(requirement.number - accessibleItems.filter((accessibleItem) => {
                  return accessibleItem.itemId === requirement.item
                }).length, 0)
              }
            } else {
              numberOfRequiredItems++
              selectedItemFromRequirements = validItems.find((item) => {
                return item.itemId === requirement.item
              })
            }
          } else if (isItemId(requirement)) {
            numberOfRequiredItems++
            selectedItemFromRequirements = validItems.find((item) => {
              return item.itemId === requirement
            })
            
            if ((badgeItemIds as readonly ItemId[]).includes(requirement)) {
              numberOfBadgeItemRequirements++
            }
          } else if (requirement === "INACCESSIBLE") {
            selectedItemFromRequirements = undefined
            break
          } else {
            throw new Error("Unexpected unresolved requirement.")
          }
        }
        
        if (isNullish(selectedItemFromRequirements)) {
          return result
        }
        
        largestBadgeNumberRequirement = Math.max(largestBadgeNumberRequirement - numberOfBadgeItemRequirements, 0)
        numberOfRequiredItems += Math.max(largestBadgeNumberRequirement - accessibleItems.filter((accessibleItem) => {
          return (badgeItemIds as readonly ItemId[]).includes(accessibleItem.itemId)
        }).length, 0)
        
        if (numberOfRequiredItems < result) {
          possibleNextItem = selectedItemFromRequirements
          return numberOfRequiredItems
        } else {
          return result
        }
      }, Number.POSITIVE_INFINITY)
      
      if (smallestNumberOfRequirements! < previousSmallestNumberOfRequirements) {
        previousSmallestNumberOfRequirements = smallestNumberOfRequirements
        nextItem = possibleNextItem
      }
      
      if (smallestNumberOfRequirements === 1) {
        break // We can't get any smaller, let's just use what we found and skip searching the rest to save time
      }
    }
    
    if (isNullish(nextItem)) {
      if (foundUnassignedInaccessibleLocation) {
        return false
      }
      
      break
    }
    
    const validLocations = accessibleItemLocations.filter((location) => {
      return isNullish(location.itemId) && location.shuffleGroupIndex === nextItem.shuffleGroupIndex
    })
    
    const bestLocation = (holdableItemIds as readonly ItemId[]).includes(nextItem.itemId) && !allowNormalConsumables ? validLocations.find((location) => {
      return location.type === "MART"
    }) ?? validLocations[0] : validLocations.find((location) => {
      return location.type !== "MART"
    }) ?? validLocations[0]
    
    if (isNullish(bestLocation)) {
      throw new Error("Reached unexpected dead end while validating item shuffle.")
    }
    
    bestLocation.itemId = nextItem.itemId
    
    accessibleItems.push({
      itemId: nextItem.itemId,
      isFromMart: bestLocation.type === "MART",
    })
    
    updateAccessibleItemsAndLocations({
      accessibleItems: accessibleItems,
      accessibleItemLocations: accessibleItemLocations,
      allItemLocations: allItemLocations,
      allowNormalConsumables: allowNormalConsumables,
      updateAccessOptions: true,
    })
    
    const index = unplacedItems.findIndex((unplacedItem) => {
      return unplacedItem.itemId === nextItem.itemId && unplacedItem.shuffleGroupIndex === nextItem.shuffleGroupIndex
    })
    
    unplacedItems.splice(index, 1)
  }
  
  return true
}

type AccessibleItem = { itemId: ItemId, isFromMart: boolean }

const updateAccessRequirementsUsingPlacedItems = (params: {
  accessibleItemLocations: GeneralItemLocation[]
  allItemLocations: GeneralItemLocation[]
  progressionItemIds: Set<ItemId>
}) => {
  const {
    accessibleItemLocations,
    allItemLocations,
    progressionItemIds,
  } = params
  
  const inaccessibleItemLocations = allItemLocations.filter((location) => {
    return !accessibleItemLocations.some((accessibleLocation) => {
      return accessibleLocation.id === location.id
    })
  })
  
  inaccessibleItemLocations.forEach((location) => {
    if (isNullish(location.itemId) || !progressionItemIds.has(location.itemId)) {
      return
    }
    
    const match = location.itemId
    
    inaccessibleItemLocations.forEach((object) => {
      let objectWasModified = false
          
      const filteredReplacements = location.accessOptions.filter((requirements) => {
        return !requirements.some((requirement) => {
          return requirement === match
        })
      })
      
      object.accessOptions = object.accessOptions.flatMap((option) => {
        if (option.includes(match)) {
          objectWasModified = true
          
          return getAllCombinations([
            filteredReplacements,
            [
              option.filter((requirement) => {
                return requirement !== match
              }),
            ].filter((requirements) => {
              return requirements.length > 0
            }),
          ])
        } else {
          return [
            option,
          ]
        }
      })
      
      if (object.accessOptions.length > 1 && object.accessOptions.some((option) => { return option.length === 0 })) {
        object.accessOptions = [[]]
        objectWasModified = true
      }
      
      if (objectWasModified) {
        object.accessOptions = removeSupersets(object.accessOptions)
      }
    })
  })
}

const updateAccessibleItemsAndLocations = (params: {
  accessibleItems: AccessibleItem[]
  accessibleItemLocations: GeneralItemLocation[]
  allItemLocations: GeneralItemLocation[]
  allowNormalConsumables: boolean
  updateAccessOptions?: boolean
}) => {
  const {
    accessibleItems,
    accessibleItemLocations,
    allItemLocations,
    allowNormalConsumables,
    updateAccessOptions,
  } = params
  
  let didUpdate = true
    
  while (didUpdate) {
    didUpdate = false
    
    allItemLocations.filter((location) => {
      return !accessibleItemLocations.some((accessibleLocation) => {
        return accessibleLocation.id === location.id
      })
    }).forEach((location) => {
      const remainingAccessOptions = removeSupersets(location.accessOptions.map((option) => {
        return option.filter((requirement) => {
          return !isAccessRequirementSatisfied({
            requirement: requirement,
            accessibleItems: accessibleItems,
          })
        })
      }))
      
      if (updateAccessOptions ?? false) {
        location.accessOptions = remainingAccessOptions
      }
      
      if (remainingAccessOptions.some((option) => { return option.length === 0 })) {
        didUpdate = true
        accessibleItemLocations.push(location)
        if (isNotNullish(location.itemId) && (location.type === "MART" || !(holdableItemIds as readonly string[]).includes(location.itemId) || allowNormalConsumables)) {
          accessibleItems.push({
            itemId: location.itemId,
            isFromMart: location.type === "MART",
          })
        }
      }
    })
  }
}
  
const isAccessRequirementSatisfied = (params: {
  requirement: AccessRequirement
  accessibleItems: AccessibleItem[]
}): boolean => {
  const {
    requirement,
    accessibleItems,
  } = params
  
  if (isObject(requirement)) {
    return accessibleItems.some((item) => {
      return item.isFromMart
    }) || accessibleItems.filter((item) => {
      return item.itemId === requirement.item
    }).length >= requirement.number
  } else if (isNumber(requirement)) {
    return isBadgeNumberRequirementSatisfied({
      number: requirement,
      accessibleItems: accessibleItems,
    })
  } else if (isItemId(requirement)) {
    return accessibleItems.some((item) => {
      return item.itemId === requirement
    })
  } else {
    return false
  }
}
  
const isBadgeNumberRequirementSatisfied = (params: {
  number: number
  accessibleItems: AccessibleItem[]
}) => {
  const {
    number,
    accessibleItems,
  } = params
  
  return accessibleItems.filter((item) => {
    return (badgeItemIds as readonly string[]).includes(item.itemId)
  }).length >= number
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
  
  if (settings.BLUE_CARD_REWARDS_ALWAYS_ACCESSIBLE) {
    romInfo.gameData.specialShops.BLUE_CARD_REWARD_LADY.accessRequirements = ["BLUE_CARD"]
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
  
  if (settings.RANDOMIZE_EVENT_POKEMON.VALUE && settings.RANDOMIZE_EVENT_POKEMON.SETTINGS.MYSTERY_EGG_RESEARCH_REQUEST === "MATCH_EGG") {
    romInfo.gameData.itemLocations.ELMS_LAB_ELMS_GIFT_FOR_TOGEPI.accessRequirements = romInfo.gameData.itemLocations.ELMS_LAB_ELMS_GIFT_FOR_TOGEPI.accessRequirements?.filter((requirement) => {
      return requirement !== "TOGEPI"
    })
    
    romInfo.gameData.itemLocations.ELMS_LAB_ELMS_GIFT_FOR_TOGEPI.accessRequirements?.push(romInfo.gameData.eventPokemon.TOGEPI)
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
    
    if (isNotNullish(rulesetInfo.addedItemLocationRequirements)) {
      if (!Array.isArray(rulesetInfo.addedItemLocationRequirements)) {
        throw new Error(`Access modifier ruleset '${rulesetId} is in an incorrect format.`)
      }
      
      rulesetInfo.addedItemLocationRequirements.forEach((rule: any) => {
        if (!(
          isObject(rule)
        && Array.isArray(rule.requirements)
        && Array.isArray(rule.itemLocationIds)
        && rule.requirements.every((requirement: any) => {
          return isAccessRequirement(requirement)
        })
        && rule.itemLocationIds.every((id: any) => {
          return itemLocationIds.includes(id) || warpIds.includes(id) || martIds.includes(id) || specialShopIds.includes(id)
        })
        )) {
          throw new Error(`Access modifier ruleset '${rulesetId} is in an incorrect format.`)
        }
    
        rule.itemLocationIds.forEach((id: any) => {
          if (itemLocationIds.includes(id)) {
            romInfo.gameData.itemLocations[id as ItemLocationId].accessRequirements = [
              ...romInfo.gameData.itemLocations[id as ItemLocationId].accessRequirements ?? [],
              ...rule.requirements,
            ]
          } else if (warpIds.includes(id)) {
            romInfo.gameData.warps[id as WarpId].accessRequirements = [
              ...romInfo.gameData.warps[id as WarpId].accessRequirements ?? [],
              ...rule.requirements,
            ]
          } else if (martIds.includes(id)) {
            romInfo.gameData.marts[id as MartId].accessRequirements = [
              ...romInfo.gameData.marts[id as MartId].accessRequirements ?? [],
              ...rule.requirements,
            ]
          } else {
            romInfo.gameData.specialShops[id as SpecialShopId].accessRequirements = [
              ...romInfo.gameData.specialShops[id as SpecialShopId].accessRequirements ?? [],
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