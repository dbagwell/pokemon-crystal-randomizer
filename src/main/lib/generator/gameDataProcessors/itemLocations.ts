import type { ROMInfo } from "@lib/gameData/romInfo"
import type { Random } from "@lib/generator/random"
import { getYAML } from "@lib/utils/yamlUtils"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import type { ItemLocation } from "@shared/types/gameData/itemLocation"
import type { LogicalAccessArea, LogicalAreaAccessOption } from "@shared/types/gameData/logicalAccessArea"
import type { Mart } from "@shared/types/gameData/mart"
import { type AccessRequirement, isAccessRequirement, type Warp } from "@shared/types/gameData/warp"
import { type ItemLocationId, itemLocationIds, regularHiddenItemLocationIds, regularItemBallLocationIds, tmItemBallLocationIds } from "@shared/types/gameDataIds/itemLocations"
import { type BadgeItemId, badgeItemIds, ballItemIds, holdableItemIds, type ItemId, itemIds, regularItemIds, tmItemIds } from "@shared/types/gameDataIds/items"
import { type LogicalAccessAreaId, logicalAccessAreaIds } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import { type MartId, martIds } from "@shared/types/gameDataIds/marts"
import { type PokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { type WarpId, warpIds } from "@shared/types/gameDataIds/warps"
import { isNotNullish, isNullish, isNumber, isObject, isString } from "@shared/utils"
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
  
  const locationsToShuffle: { locationId: ItemLocationId, shuffleGroupIndex: number }[] = []
  const itemsToShuffle: { itemId: ItemId, shuffleGroupIndex: number }[] = []
  
  const startingItems = startingItemIds(settings)
  
  Object.values(romInfo.gameData.itemLocations).forEach((location) => {
    const shuffleGroupIndex = settings.SHUFFLE_ITEMS.SETTINGS.GROUPS.findIndex((shuffleGroup) => {
      const groupId = shuffleGroup.find((groupId) => {
        return groupId === location.groupId
      })
      
      return isNotNullish(groupId)
    })
    
    if (shuffleGroupIndex !== -1 && !settings.SHUFFLE_ITEMS.SETTINGS.EXCLUDE_LOCATIONS.includes(location.id)) {
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
  
  const remainingProgressionItems = itemsToShuffle.filter((itemInfo) => {
    return [...progressionItemIds].includes(itemInfo.itemId)
  })
  
  while (remainingProgressionItems.length > 0) {
    const selectedItemInfo = random.element({ array: remainingProgressionItems })
    
    const selectedItemIndex = remainingProgressionItems.findIndex((itemInfo) => {
      return itemInfo.itemId === selectedItemInfo.itemId && itemInfo.shuffleGroupIndex === selectedItemInfo.shuffleGroupIndex
    })
    
    remainingProgressionItems.splice(selectedItemIndex, 1)
    
    const invalidLocations: ItemLocationId[] = []
    let foundLocation = false
    
    while (!foundLocation) {
      const accessibleItemLocationsWithoutSelectedItem = getAccessibleItemLocations({
        itemLocationsMap: romInfo.gameData.itemLocations,
        warpsMap: romInfo.gameData.warps,
        areasMap: romInfo.gameData.areas,
        martsMap: romInfo.gameData.marts,
        usableItems: [
          ...startingItems,
          ...remainingProgressionItems.map((itemInfo) => {
            return itemInfo.itemId
          }),
        ],
      })
      
      const locationId = random.element({ array: accessibleItemLocationsWithoutSelectedItem.filter((locationId) => { return !invalidLocations.includes(locationId) && locationsToShuffle.find((locationInfo) => { return locationInfo.locationId === locationId })?.shuffleGroupIndex === selectedItemInfo.shuffleGroupIndex }) })
      
      romInfo.gameData.itemLocations[locationId].itemId = selectedItemInfo.itemId
      
      const accessibleItemLocationsWithoutOtherItems = getAccessibleItemLocations({
        itemLocationsMap: romInfo.gameData.itemLocations,
        warpsMap: romInfo.gameData.warps,
        areasMap: romInfo.gameData.areas,
        martsMap: romInfo.gameData.marts,
        usableItems: startingItems,
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
      return itemInfo.itemId === selectedItemId && itemInfo.shuffleGroupIndex === locationInfo.shuffleGroupIndex
    })
    
    nonProgressionItems.splice(selectedItemIndex, 1)
  })
}

const getAccessibleItemLocations = (params: {
  itemLocationsMap: IdMap<ItemLocationId, ItemLocation>
  warpsMap: IdMap<WarpId, Warp>
  areasMap: IdMap<LogicalAccessAreaId, LogicalAccessArea>
  martsMap: IdMap<MartId, Mart>
  usableItems: ItemId[]
}): ItemLocationId[] => {
  const {
    itemLocationsMap,
    warpsMap,
    areasMap,
    martsMap,
    usableItems,
  } = params
  
  const accessibleWarps: WarpId[] = []
  const accessibleAreas: LogicalAccessAreaId[] = ["PLAYERS_HOUSE_2F"]
  const accessibleItems: ItemId[] = [...usableItems]
  const accessibleItemLocations: ItemLocationId[] = []
  const accessibleMarts: MartId[] = []
  
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
      }).length >= requirement.number || accessibleMarts.some((mart) => {
        return mart.includes(requirement.item)
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
        
        if (isNotNullish(location.itemId)) {
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
  }
  
  return accessibleItemLocations.filter((locationId) => { return isNullish(itemLocationsMap[locationId].itemId) })
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
  
  if (settings.EARLY_CHARRGROVE_MART_POKE_BALLS) {
    romInfo.gameData.marts.CHERRYGROVE_2.accessRequirements = []
  }
  
  settings.SHUFFLE_ITEMS.SETTINGS.ACCESS_MODIFIERS.forEach((rulesetId) => {
    let rulesetInfo: any
    
    try {
      rulesetInfo = getYAML([path.resolve(__dirname, "accessRulesets", `${rulesetId}.yml`)])
    } catch (error) {
      throw new Error(`Cannot find selected ruleset of additional access modifiers '${rulesetId}'.`)
    }
    
    if (!(
      isObject(rulesetInfo)
      && Array.isArray(rulesetInfo.addedRequirements)
    )) {
      throw new Error(`Access modifier ruleset '${rulesetId} is in an incorrect format.`)
    }
    
    rulesetInfo.addedRequirements.forEach((rule: any) => {
      if (!(
        isObject(rule)
        && Array.isArray(rule.requirements)
        && Array.isArray(rule.areaIds)
        && Array.isArray(rule.matchingRequirements)
        && rule.requirements.every((requirement: any) => {
          return isAccessRequirement(requirement)
        })
        && rule.areaIds.every((requirement: any) => {
          return logicalAccessAreaIds.includes(requirement)
        })
        && rule.matchingRequirements.every((requirement: any) => {
          return isAccessRequirement(requirement)
        })
      )) {
        throw new Error(`Access modifier ruleset '${rulesetId} is in an incorrect format.`)
      }
    
      addAccessRequirements(rule)
    })
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