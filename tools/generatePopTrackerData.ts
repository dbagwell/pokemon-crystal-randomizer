import { gameMapGroupsMap } from "@shared/gameData/gameMapGroups"
import { gameMapsMap } from "@shared/gameData/gameMaps"
import { itemLocationsMap } from "@shared/gameData/itemLocations"
import { itemsMap } from "@shared/gameData/items"
import { martGroupsMap } from "@shared/gameData/martGroups"
import { martsMap, specialShopsMap } from "@shared/gameData/marts"
import type { GeneralItemLocation } from "@shared/types/gameData/itemLocation"
import type { GameMapId } from "@shared/types/gameDataIds/gameMaps"
import { type BadgeLocationId, type HMGiftLocationId, type ItemLocationId, itemLocationIds, type KeyItemGiftLocationId, type MenuItemGiftLocationId, type RegularGiftLocationId, type TMGiftLocationId } from "@shared/types/gameDataIds/itemLocations"
import { badgeItemIds, hmItemIds, holdableItemIds, type ItemId, itemIds, keyItemIds, menuItemIds } from "@shared/types/gameDataIds/items"
import { type LogicalEventId, logicalEventIds } from "@shared/types/gameDataIds/logicalEvents"
import { type MartGroupId, martGroupIds } from "@shared/types/gameDataIds/martGroups"
import { type SpecialShopId, specialShopIds } from "@shared/types/gameDataIds/marts"
import { isNotNullish, isNumber, isObject } from "@shared/utils"
import fs from "fs"
import path from "path"
import yaml from "yaml"

const trackedItemIds = [
  ...badgeItemIds,
  ...hmItemIds,
  ...menuItemIds,
  ...keyItemIds,
  "ESCAPE_ROPE" as const,
  "WATER_STONE" as const,
  "EON_MAIL" as const,
  "X_ATTACK" as const,
  "X_SPECIAL" as const,
  "X_DEFEND" as const,
  "X_SPEED" as const,
  "X_ACCURACY" as const,
  "GUARD_SPEC" as const,
  "DIRE_HIT" as const,
  "BERRY" as const,
  "TM02" as const,
  "TM08" as const,
  "TM12" as const,
].filter((itemId) => {
  return itemId !== "EGG_TICKET"
})

const items = [
  ...trackedItemIds.map((itemId) => {
    const isConsumable = (holdableItemIds as readonly ItemId[]).includes(itemId)
    return {
      name: itemsMap[itemId].name,
      type: itemId === "GS_BALL" ? "consumable" : isConsumable ? "progressive" : "toggle",
      img: `images/items/${itemId.toLowerCase()}.png`,
      ...itemId === "GS_BALL" ? { max_quantity: 2 } : {},
      codes: itemsMap[itemId].category === "BADGES" ? `BADGE,${itemId}` : itemId,
      ...isConsumable ? {
        stages: itemId === "BERRY" ? [
          {
            name: itemsMap[itemId].name,
            img: `images/items/${itemId.toLowerCase()}.png`,
            codes: `${itemId},${itemId}_1`,
          },
          {
            name: itemsMap[itemId].name,
            img: `images/items/${itemId.toLowerCase()}_2.png`,
            codes: `${itemId}_2`,
          },
          {
            name: itemsMap[itemId].name,
            img: `images/items/${itemId.toLowerCase()}_3.png`,
            codes: `${itemId}_3`,
          },
          {
            name: itemsMap[itemId].name,
            img: `images/items/${itemId.toLowerCase()}_4.png`,
            codes: `${itemId}_4`,
          },
          {
            name: itemsMap[itemId].name,
            img: `images/items/${itemId.toLowerCase()}_5.png`,
            codes: `${itemId}_5`,
          },
          {
            name: itemsMap[itemId].name,
            img: `images/items/${itemId.toLowerCase()}_6.png`,
            codes: `${itemId}_6`,
          },
          {
            name: itemsMap[itemId].name,
            img: `images/items/${itemId.toLowerCase()}_7.png`,
            codes: `${itemId}_7`,
          },
          {
            name: itemsMap[itemId].name,
            img: `images/items/${itemId.toLowerCase()}_plus.png`,
            codes: `${itemId}_PLUS`,
          },
        ] : [
          {
            name: itemsMap[itemId].name,
            img: `images/items/${itemId.toLowerCase()}.png`,
            codes: itemId,
          },
          {
            name: itemsMap[itemId].name,
            img: `images/items/${itemId.toLowerCase()}_plus.png`,
            codes: `${itemId}_PLUS`,
          },
        ],
      } : {},
    }
  }),
]

const giftsImageMap = {
  SLOWPOKE_WELL_B2F_SURF_AREA_MANS_GIFT: "blue_gym_guide",
  OLIVINE_LIGHTHOUSE_2F_HUEYS_GIFT: "blue_sailor",
  NATIONAL_PARK_BENCH_LADYS_GIFT: "green_teacher",
  NATIONAL_PARK_BEVERLYS_GIFT_FOR_MARILL: "red_pokefan_f",
  RADIO_TOWER_4F_EAST_AREA_DJ_MARYS_GIFT: "green_teacher",
  GOLDENROD_POKECENTER_1F_LADYS_GIFT_FOR_EON_MAIL: "brown_pokefan_f",
  ROUTE_35_GOLDENROD_GATE_RANDYS_GIFT: "red_officer",
  ROUTE_36_NATIONAL_PARK_GATE_CONTEST_1ST_PLACE_PRIZE: "green_officer",
  ROUTE_36_NATIONAL_PARK_GATE_CONTEST_2ND_PLACE_PRIZE: "green_officer",
  ROUTE_36_NATIONAL_PARK_GATE_CONTEST_3RD_PLACE_PRIZE: "green_officer",
  ROUTE_36_NATIONAL_PARK_GATE_CONTEST_CONSOLATION_PRIZE: "green_officer",
  LAKE_OF_RAGE_CUT_AREA_WESLEYS_GIFT: "blue_super_nerd",
  FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT: "red_twin",
  ROUTE_34_MAIN_AREA_GINAS_GIFT: "green_lass",
  ROUTE_34_SURF_AREA_KATES_GIFT: "red_cooltrainer_f",
  ELMS_LAB_ELMS_GIFT_FOR_TOGEPI: "elm",
  ELMS_LAB_ELMS_GIFT_FOR_RISINGBADGE: "elm",
  ELMS_LAB_AIDES_FREE_GIFT: "blue_scientist",
  ELMS_LAB_AIDES_GIFT_FOR_MYSTERY_EGG: "blue_scientist",
  ROUTE_2_NUGGET_HOUSE_MANS_GIFT: "blue_fisher",
  BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_LICKITUNG: "blue_gramps",
  BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_ODDISH: "blue_gramps",
  BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_STARYU: "blue_gramps",
  BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_GROWLITHE: "blue_gramps",
  BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_PICHU: "blue_gramps",
  SILPH_CO_1F_GUARDS_GIFT: "blue_officer",
  ROUTE_5_CLEANSE_TAG_HOUSE_LADYS_GIFT: "brown_granny",
  DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_MANS_GIFT: "blue_pharmacist",
  CHARCOAL_KILN_APPRENTICES_GIFT: "blue_youngster",
  KURTS_HOUSE_KURTS_GIFT: "kurt",
  ROUTE_32_NORTH_AREA_MANS_GIFT: "blue_cooltrainer_m",
  ROUTE_32_SOUTH_AREA_FRIEDAS_GIFT: "red_lass",
  POKEMON_FAN_CLUB_CHAIRMANS_GIFT: "blue_gentleman",
  ROUTE_36_WEST_AREA_ALANS_GIFT: "blue_youngster",
  ROUTE_36_EAST_AREA_ARTHURS_GIFT: "blue_youngster",
  ROUTE_30_BERRY_HOUSE_MANS_GIFT: "brown_pokefan_m",
  MR_POKEMONS_HOUSE_MR_POKEMONS_GIFT_FOR_RED_SCALE: "blue_gentleman",
  LAKE_OF_RAGE_MAGIKARP_HOUSE_MANS_GIFT_FOR_MAGIKARP: "blue_fishing_guru",
  CHERRYGROVE_CITY_SURF_AREA_MYSTIC_WATER_GUYS_GIFT: "green_fisher",
  ROUTE_43_TIFFANYS_GIFT_FOR_CLEFAIRY: "green_lass",
  ROUTE_44_VANCES_GIFT: "green_youngster",
  ROUTE_44_WILTONS_GIFT_1: "green_fisher",
  ROUTE_44_WILTONS_GIFT_2: "green_fisher",
  ROUTE_44_WILTONS_GIFT_3: "green_fisher",
  ROUTE_45_KENJIS_GIFT: "brown_blackbelt",
  ROUTE_45_PARRYS_GIFT: "brown_pokefan_m",
  ROUTE_25_KEVINS_GIFT: "red_cooltrainer_m",
  ROUTE_27_WHIRLPOOL_AREA_JOSES_GIFT: "blue_youngster",
  ROUTE_29_TUSCANYS_GIFT: "red_teacher",
  ROUTE_30_CHERRYGROVE_SIDE_JOEYS_GIFT: "blue_youngster",
  ROUTE_38_DANAS_GIFT: "blue_lass",
  BLACKTHORN_CITY_SANTOSS_GIFT: "blue_youngster",
  ROUTE_31_WADES_GIFT_1: "brown_bug_catcher",
  ROUTE_31_WADES_GIFT_2: "brown_bug_catcher",
  ROUTE_31_WADES_GIFT_3: "brown_bug_catcher",
  ROUTE_31_WADES_GIFT_4: "brown_bug_catcher",
  ROUTE_39_DEREKS_GIFT_FOR_PIKACHU: "red_pokefan_m",
  ROUTE_40_MONICAS_GIFT: "blue_beauty",
  ROUTE_37_SUNNYS_GIFT: "blue_bug_catcher",
  ROUTE_42_MAHOGANY_SIDE_TULLYS_GIFT: "green_fisher",
  ROUTE_46_NORTH_AREA_ERINS_GIFT: "green_lass",
  VERMILION_CITY_BADGE_GUYS_GIFT: "red_pokefan_m",
  GOLDENROD_DEPT_STORE_5F_MYSTERY_GIFT_GIRLS_GIFT: "green_twin",
  GOLDENROD_GYM_WHITNEYS_GIFT: "whitney",
  GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_1: "red_receptionist",
  GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_2: "red_receptionist",
  RADIO_TOWER_3F_WEST_AREA_LADYS_GIFT: "green_cooltrainer_f",
  ROUTE_34_ILEX_FOREST_GATE_LADYS_GIFT: "blue_teacher",
  VIOLET_GYM_FALKNERS_GIFT: "falkner",
  ILEX_FOREST_NORTH_AREA_HEADBUTT_GUYS_GIFT: "green_rocker",
  CELADON_MANSION_ROOF_HOUSE_MANS_GIFT: "green_pharmacist",
  CELADON_GYM_ERIKAS_GIFT: "erika",
  ROUTE_27_SANDSTORM_HOUSE_LADYS_GIFT: "brown_granny",
  ECRUTEAK_GYM_MORTYS_GIFT: "morty",
  OLIVINE_GYM_JASMINES_GIFT: "jasmine",
  ROUTE_39_FARMHOUSE_LADYS_GIFT: "brown_pokefan_f",
  CIANWOOD_GYM_STRENGTH_AREA_CHUCKS_GIFT: "chuck",
  POWER_PLANT_MANAGERS_GIFT: "red_fisher",
  MR_PSYCHICS_HOUSE_MR_PSYCHICS_GIFT: "green_fishing_guru",
  AZALEA_GYM_BUGSYS_GIFT: "bugsy",
  ROUTE_32_CUT_AREA_ROAR_GUYS_GIFT: "blue_fisher",
  ROUTE_36_EAST_AREA_ROCK_SMASH_GUYS_GIFT: "blue_fisher",
  FUCHSIA_GYM_JANINES_GIFT: "janine",
  MAHOGANY_GYM_PRYCES_GIFT: "pryce",
  LAKE_OF_RAGE_HIDDEN_POWER_HOUSE_MANS_GIFT: "blue_fisher",
  ROUTE_43_GATE_GUARDS_GIFT: "red_officer",
  ROUTE_31_MANS_GIFT_FOR_RANDYS_MAIL: "blue_fisher",
  VIRIDIAN_CITY_ISOLATED_AREA_DREAM_EATER_GUYS_GIFT: "red_fisher",
  ROUTE_28_STEEL_WING_HOUSE_LADYS_GIFT: "green_cooltrainer_f",
  DRAGONS_DEN_B1F_SOUTH_AREA_CLAIRS_GIFT: "clair",
  ILEX_FOREST_SOUTH_AREA_CHARCOAL_BOSSS_GIFT: "brown_blackbelt",
  CIANWOOD_CITY_CHUCKS_WIFES_GIFT: "brown_pokefan_f",
  DANCE_THEATER_MANS_GIFT: "blue_gentleman",
  OLIVINE_CAFE_SAILORS_GIFT: "blue_sailor",
  SPROUT_TOWER_3F_SAGE_LIS_GIFT: "blue_sage",
  TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT: "lance",
  ELMS_LAB_ELMS_GIFT_TO_CHAMPION: "elm",
  MR_POKEMONS_HOUSE_MR_POKEMONS_FREE_GIFT: "blue_gentleman",
  ROUTE_32_POKECENTER_1F_MANS_GIFT: "green_fishing_guru",
  AZALEA_TOWN_KURTS_GIFT_FOR_GS_BALL: "kurt",
  GOLDENROD_BIKE_SHOP_OWNERS_GIFT: "red_clerk",
  RADIO_TOWER_2F_BUENAS_GIFT: "red_beauty",
  GOLDENROD_FLOWER_SHOP_OWNERS_GIFT: "red_teacher",
  RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT: "blue_gentleman",
  GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT: "blue_gentleman",
  RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT: "rocket_m",
  GOLDENROD_POKECENTER_1F_LINK_RECEPTIONISTS_GIFT: "blue_link_receptionist",
  ECRUTEAK_ITEMFINDER_HOUSE_MANS_GIFT: "red_cooltrainer_m",
  TIN_TOWER_1F_NORTH_SAGES_GIFT: "brown_sage",
  OLIVINE_GOOD_ROD_HOUSE_MANS_GIFT: "green_fishing_guru",
  CIANWOOD_PHARMACY_OWNERS_GIFT: "red_pharmacist",
  LAKE_OF_RAGE_SURF_AREA_SHINYS_GIFT: "red_gyarados",
  POKEMON_FAN_CLUB_MEMBERS_GIFT: "blue_fisher",
  COPYCATS_HOUSE_2F_COPYCATS_GIFT: "blue_lass",
  ROUTE_12_SUPER_ROD_HOUSE_MANS_GIFT: "red_fishing_guru",
  PEWTER_CITY_OLD_MANS_GIFT: "blue_gramps",
  PLAYERS_HOUSE_1F_MOMS_GIFT: "mom",
  CHERRYGROVE_CITY_GUIDE_GENTS_GIFT: "brown_gramps",
  MR_POKEMONS_HOUSE_OAKS_GIFT: "oak",
  RUINS_OF_ALPH_OUTSIDE_MAIN_AREA_RESEARCHERS_GIFT: "blue_scientist",
  RADIO_TOWER_1F_QUIZ_PRIZE: "green_cooltrainer_f",
  LAV_RADIO_TOWER_1F_DIRECTORS_GIFT: "blue_gentleman",
  VIOLET_GYM_BADGE: "falkner",
  AZALEA_GYM_BADGE: "bugsy",
  GOLDENROD_GYM_BADGE: "whitney",
  ECRUTEAK_GYM_BADGE: "morty",
  OLIVINE_GYM_BADGE: "jasmine",
  CIANWOOD_GYM_BADGE: "chuck",
  MAHOGANY_GYM_BADGE: "pryce",
  DRAGON_SHRINE_BADGE: "clair",
  PEWTER_GYM_BADGE: "brock",
  CERULEAN_GYM_BADGE: "misty",
  VERMILION_GYM_BADGE: "surge",
  CELADON_GYM_BADGE: "erika",
  FUCHSIA_GYM_BADGE: "janine",
  SAFFRON_GYM_BADGE: "sabrina",
  SEAFOAM_GYM_BADGE: "blaine",
  VIRIDIAN_GYM_BADGE: "blue",
} as const

const eventInfo: Partial<Record<LogicalEventId, { name: string, sprite: string } | { linkedLocation: ItemLocationId }>> = {
  ELMS_LAB_GAVE_MYSTERY_EGG: {
    name: "Elm's Lab - Gave Mystery Egg",
    sprite: "mystery_egg_elm",
  },
  VIOLET_GYM_DEFEATED_FALKNER: {
    linkedLocation: "VIOLET_GYM_BADGE",
  },
  VIOLET_POKECENTER_1F_GOT_MYSTERY_EGG: {
    name: "Violet Pokecenter - 1F - Got Mystery Egg",
    sprite: "violet_aide",
  },
  KURTS_HOUSE_TALKED_TO_KURT: {
    name: "Kurt's House - Talked To Kurt",
    sprite: "kurt",
  },
  SLOWPOKE_WELL_B1F_EAST_AREA_DEFEATED_ROCKETS: {
    name: "Slowpoke Well - B1F - East Area - Defeated Rockets",
    sprite: "well_rocket_m",
  },
  ILEX_FOREST_SOUTH_AREA_TALKED_TO_CHARCOAL_BOSS: {
    linkedLocation: "ILEX_FOREST_SOUTH_AREA_CHARCOAL_BOSSS_GIFT",
  },
  ILEX_FOREST_NORTH_AREA_GOT_HEADBUTT_GUYS_GIFT: {
    linkedLocation: "ILEX_FOREST_NORTH_AREA_HEADBUTT_GUYS_GIFT",
  },
  ROUTE_34_ILEX_FOREST_GATE_GOT_LADYS_GIFT: {
    linkedLocation: "ROUTE_34_ILEX_FOREST_GATE_LADYS_GIFT",
  },
  ROUTE_35_GOLDENROD_GATE_GOT_KENYA: {
    name: "Route 35 - Goldenrod Gate - Got Kenya",
    sprite: "randy",
  },
  ROUTE_36_WEST_AREA_TALKED_TO_FLORIA: {
    name: "Route 36 - West Area - Talked To Floria",
    sprite: "floria",
  },
  ROUTE_36_EAST_AREA_GOT_ROCK_SMASH_GUYS_GIFT: {
    linkedLocation: "ROUTE_36_EAST_AREA_ROCK_SMASH_GUYS_GIFT",
  },
  ROUTE_31_GAVE_MAIL: {
    linkedLocation: "ROUTE_31_MANS_GIFT_FOR_RANDYS_MAIL",
  },
  BURNED_TOWER_B1F_AWOKE_LEGENDARY_BEASTS: {
    name: "Burned Tower - B1F - Awoke Legendary Beasts",
    sprite: "suicune",
  },
  ECRUTEAK_GYM_DEFEATED_MORTY: {
    linkedLocation: "ECRUTEAK_GYM_BADGE",
  },
  OLIVINE_LIGHTHOUSE_6F_TALKED_TO_JASMINE: {
    name: "Olivine Lighthouse - 6F - Talked To Jasmine",
    sprite: "amphy_jasmine",
  },
  CIANWOOD_GYM_STRENGTH_AREA_DEFEATED_CHUCK: {
    linkedLocation: "CIANWOOD_GYM_BADGE",
  },
  OLIVINE_LIGHTHOUSE_6F_HEALED_AMPHY: {
    name: "Olivine Lighthouse - 6F - Healed Amphy",
    sprite: "secretpotion_jasmine",
  },
  LAKE_OF_RAGE_SURF_AREA_FOUGHT_SHINY: {
    linkedLocation: "LAKE_OF_RAGE_SURF_AREA_SHINYS_GIFT",
  },
  LAKE_OF_RAGE_MAIN_AREA_TALKED_TO_LANCE: {
    name: "Lake Of Rage - Main Area - Talked To Lance",
    sprite: "lake_lance",
  },
  TEAM_ROCKET_BASE_B3F_SE_AREA_GOT_FEMALE_GRUNTS_PASSWORD: {
    name: "Team Rocket Base - B3F - SE Area - Got Female Grunt's Password",
    sprite: "password_rocket_f",
  },
  TEAM_ROCKET_BASE_B3F_SE_AREA_GOT_SW_GRUNTS_PASSWORD: {
    name: "Team Rocket Base - B3F - SE Area - Got SW Grunt's Password",
    sprite: "password_rocket_m",
  },
  TEAM_ROCKET_BASE_B3F_ADMIN_AREA_GOT_MURKROWS_PASSWORD: {
    name: "Team Rocket Base - B3F - Admin Area - Got Murkrow's Password",
    sprite: "murkrow",
  },
  TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_DISABLED_TRANSMITTER: {
    linkedLocation: "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
  },
  GOLDENROD_UNDERGROUND_WAREHOUSE_TALKED_TO_DIRECTOR: {
    linkedLocation: "GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT",
  },
  RADIO_TOWER_5F_EAST_AREA_DEFEATED_ROCKETS: {
    linkedLocation: "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
  },
  TIN_TOWER_ROOF_FOUGHT_HO_OH: {
    name: "Tin Tower - Roof - Fought Ho-Oh",
    sprite: "ho_oh",
  },
  BLACKTHORN_GYM_1F_BACK_AREA_DEFEATED_CLAIR: {
    name: "Blackthorn Gym - 1F - Back Area - Defeated Clair",
    sprite: "clair",
  },
  DRAGON_SHRINE_PASSED_TEST: {
    linkedLocation: "DRAGON_SHRINE_BADGE",
  },
  HALL_OF_FAME_ENTERED: {
    name: "Hall of Fame - Became Champion",
    sprite: "champion_lance",
  },
  FAST_SHIP_B1F_EAST_AREA_TALKED_TO_SAILOR: {
    name: "Fast Ship - B1F - East Area - Talked To Sailor",
    sprite: "annoyed_sailor",
  },
  FAST_SHIP_CABINS_NNW_FOUGHT_SAILOR: {
    name: "Fast Ship Cabins - NNW - Fought Sailor",
    sprite: "lazy_sailor",
  },
  FAST_SHIP_CABINS_CAPTAINS_CABIN_TALKED_TO_GIRL: {
    linkedLocation: "FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT",
  },
  POWER_PLANT_TALKED_TO_MANAGER: {
    name: "Power Plant - Talked To Manager",
    sprite: "power_plant_manager",
  },
  CERULEAN_GYM_CONFRONTED_ROCKET: {
    name: "Cerulean Gym - Confronted Rocket",
    sprite: "cerulean_rocket_m",
  },
  ROUTE_25_MET_MISTY: {
    name: "Route 25 - Met Misty",
    sprite: "misty",
  },
  POWER_PLANT_RESTORED_POWER: {
    linkedLocation: "POWER_PLANT_MANAGERS_GIFT",
  },
  VERMILION_CITY_WOKE_SNORLAX: {
    name: "Vermilion City - Woke Snorlax",
    sprite: "big_snorlax",
  },
  CINNABAR_ISLAND_TALKED_TO_BLUE: {
    name: "Cinnabar Island - Talked To Blue",
    sprite: "blue",
  },
  OAKS_LAB_GOT_OAKS_APPROVAL: {
    name: "Oaks Lab - Got Oaks Approval",
    sprite: "oak",
  },
  SILVER_CAVE_ROOM_3_DEFEATED_RED: {
    name: "Silver Cave - Room 3 - Defeated Red",
    sprite: "red",
  },
}

const eventItems: any[] = []
const hostedEventItems: any[] = []
const eventLocations: any[] = []
let eventNamesTable = "EVENT_NAMES = {"
let linkedEventsTable = "LINKED_EVENTS = {"

Object.entries(eventInfo).forEach(([id, info]) => {
  if ("name" in info) {
    eventItems.push({
      name: info.name,
      type: "toggle",
      img: `images/locations/${info.sprite}.png`,
      codes: id,
    })
    
    hostedEventItems.push({
      name: info.name,
      type: "toggle",
      img: `images/locations/${info.sprite}_bw.png`,
      disabled_img: `images/locations/${info.sprite}.png`,
      disabled_img_mods: "none",
      codes: `${id}_HOSTED`,
    })
    
    eventLocations.push({
      name: info.name,
      hosted_item: `${id}_HOSTED`,
      visibility_rules: [
        `$shouldShowLocation|${id}`,
      ],
      access_rules: [
        `^$accessibilityLevelForLocation|${id}`,
      ],
    })
      
    eventNamesTable += `\n  ${id} = "${info.name}",`
  } else {
    linkedEventsTable += `\n  ${id} = "${itemLocationsMap[info.linkedLocation].name}",`
  }
})

eventNamesTable += "\n}"
linkedEventsTable += "\n}"

const untrackedEventsTable = logicalEventIds.filter((eventId) => {
  return !(eventId in eventInfo)
}).reduce((result, eventId) => {
  return `${result}\n  ${eventId} = true,`
}, "UNTRACKED_EVENTS = {") + "\n}"

const phoneCalls = {
  WADE: {
    name: "Route 31 - Wade",
    sprite: "wade",
    locationIds: [
      "ROUTE_31_WADES_GIFT_1",
      "ROUTE_31_WADES_GIFT_2",
      "ROUTE_31_WADES_GIFT_3",
      "ROUTE_31_WADES_GIFT_4",
    ],
  },
  GINA: {
    name: "Route 34 - Gina",
    sprite: "gina",
    locationIds: [
      "ROUTE_34_MAIN_AREA_GINAS_GIFT",
    ],
  },
  TODD: {
    name: "Route 34 - Todd",
    sprite: "todd",
    locationIds: [
      "GOLDENROD_DEPT_STORE_ROOF_SHOP_1",
      "GOLDENROD_DEPT_STORE_ROOF_SHOP_2",
    ],
  },
  ALAN: {
    name: "Route 36 - Alan",
    sprite: "alan",
    locationIds: [
      "ROUTE_36_WEST_AREA_ALANS_GIFT",
    ],
  },
  DANA: {
    name: "Route 38 - Dana",
    sprite: "dana",
    locationIds: [
      "ROUTE_38_DANAS_GIFT",
    ],
  },
  TULLY: {
    name: "Route 42 - Tully",
    sprite: "tully",
    locationIds: [
      "ROUTE_42_MAHOGANY_SIDE_TULLYS_GIFT",
    ],
  },
  WILTON: {
    name: "Route 44 - Wilton",
    sprite: "wilton",
    locationIds: [
      "ROUTE_44_WILTONS_GIFT_1",
      "ROUTE_44_WILTONS_GIFT_2",
      "ROUTE_44_WILTONS_GIFT_3",
    ],
  },
  JOSE: {
    name: "Route 27 - Jose",
    sprite: "jose",
    locationIds: [
      "ROUTE_27_WHIRLPOOL_AREA_JOSES_GIFT",
    ],
  },
  JOEY: {
    name: "Route 30 - Joey",
    sprite: "joey",
    locationIds: [
      "ROUTE_30_CHERRYGROVE_SIDE_JOEYS_GIFT",
    ],
  },
  HUEY: {
    name: "Olivine Lighthouse - 2F - Huey",
    sprite: "huey",
    locationIds: [
      "OLIVINE_LIGHTHOUSE_2F_HUEYS_GIFT",
    ],
  },
  VANCE: {
    name: "Route 44 - Vance",
    sprite: "vance",
    locationIds: [
      "ROUTE_44_VANCES_GIFT",
    ],
  },
  PARRY: {
    name: "Route 45 - Parry",
    sprite: "parry",
    locationIds: [
      "ROUTE_45_PARRYS_GIFT",
    ],
  },
  ERIN: {
    name: "Route 46 - Erin",
    sprite: "erin",
    locationIds: [
      "ROUTE_46_NORTH_AREA_ERINS_GIFT",
    ],
  },
  BEVERLY: {
    name: "National Park - Beverly",
    sprite: "beverly",
    locationIds: [
      "NATIONAL_PARK_BEVERLYS_GIFT_FOR_MARILL",
    ],
  },
  DEREK: {
    name: "Route 39 - Derek",
    sprite: "derek",
    locationIds: [
      "ROUTE_39_DEREKS_GIFT_FOR_PIKACHU",
    ],
  },
  TIFFANY: {
    name: "Route 43 - Tiffany",
    sprite: "tiffany",
    locationIds: [
      "ROUTE_43_TIFFANYS_GIFT_FOR_CLEFAIRY",
    ],
  },
} as const

const hostedPhoneCallItems = Object.entries(phoneCalls).flatMap(([id, info]) => {
  return [
    {
      name: `${info.name} - Registered Number`,
      type: "toggle",
      img: `images/locations/${info.sprite}_bw.png`,
      disabled_img: `images/locations/${info.sprite}.png`,
      disabled_img_mods: "none",
      codes: `${id}_PHONE_NUMBER_HOSTED`,
    },
    {
      name: `${info.name} - Received Call`,
      type: "toggle",
      img: `images/locations/${info.sprite}_bw.png`,
      disabled_img: `images/locations/${info.sprite}.png`,
      disabled_img_mods: "none",
      codes: `${id}_PHONE_CALL_HOSTED`,
    },
  ]
})

const itemLocationSections = [
  ...itemLocationIds.map((locationId) => {
    const location = itemLocationsMap[locationId]
    const imageName = location.type === "ITEM_BALL" ? "item_ball"
      : location.type === "HIDDEN_ITEM" ? "hidden_item"
        : location.type === "FRUIT_TREE" ? "fruit_tree"
          : giftsImageMap[locationId as RegularGiftLocationId | TMGiftLocationId | HMGiftLocationId | KeyItemGiftLocationId | MenuItemGiftLocationId | BadgeLocationId]
    
    return {
      name: location.name,
      chest_unopened_img: `images/locations/${imageName}.png`,
      chest_opened_img: `images/locations/${imageName}_bw.png`,
      visibility_rules: [
        `$shouldShowLocation|${locationId}`,
      ],
      access_rules: [
        `^$accessibilityLevelForLocation|${locationId}`,
      ],
    }
  }),
  ...martGroupIds.map((groupId) => {
    const martGroup = martGroupsMap[groupId]
    const imageName = groupId === "CIANWOOD_PHARMACY_SHOP" ? "red_pharmacist"
      : groupId === "GOLDENROD_UNDERGROUND_HERB_SHOP" || groupId === "MAHOGANY_MART_1F_SHOP_2" ? "brown_granny"
        : groupId === "MAHOGANY_MART_1F_SHOP_1" ? "blue_pharmacist"
          : groupId === "MOUNT_MOON_GIFT_SHOP_SHOP" ? "brown_gramps"
            : groupId.includes("CELADON") ? "blue_clerk"
              : "green_clerk"
    
    const additionalItems = groupId === "CHERRYGROVE_MART_SHOP" || groupId === "VIOLET_MART_SHOP" ? 2
      : groupId === "GOLDENROD_DEPT_STORE_4F_SHOP" ? 6
        : groupId === "GOLDENROD_DEPT_STORE_5F_SHOP" ? 1
          : 0
    
    return {
      name: martGroup.name,
      chest_unopened_img: `images/locations/${imageName}.png`,
      chest_opened_img: `images/locations/${imageName}_bw.png`,
      item_count: martsMap[martGroup.primaryMartId].items.length + additionalItems,
      visibility_rules: [
        `$shouldShowLocation|${groupId}`,
      ],
      access_rules: [
        `^$accessibilityLevelForLocation|${groupId}`,
      ],
    }
  }),
  ...specialShopIds.map((shopId) => {
    const shop = specialShopsMap[shopId]
    const imageName = shopId === "RADIO_TOWER_2F_BLUE_CARD_SHOP" ? "green_receptionist"
      : shopId === "ROUTE_39_FARMHOUSE_SHOP" ? "blue_pokefan_m"
        : shopId === "MAHOGANY_TOWN_STREET_VENDOR" ? "brown_pokefan_m"
          : shopId === "GOLDENROD_GAME_CORNER_ITEM_SHOP" ? "red_receptionist"
            : shopId === "GOLDENROD_UNDERGROUND_BARGAIN_SHOP" ? "brown_gramps"
              : shopId === "CELADON_GAME_CORNER_ITEM_SHOP" ? "prize_window"
                : shopId === "GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES" || shopId === "CELADON_DEPT_STORE_6F_VENDING_MACHINES" ? "vending_machine"
                  : "green_clerk"
    return {
      name: shop.name,
      chest_unopened_img: `images/locations/${imageName}.png`,
      chest_opened_img: `images/locations/${imageName}_bw.png`,
      item_count: specialShopsMap[shopId].items.length,
      visibility_rules: [
        `$shouldShowLocation|${shopId}`,
      ],
      access_rules: [
        `^$accessibilityLevelForLocation|${shopId}`,
      ],
    }
  }),
  ...eventLocations,
  ...Object.entries(phoneCalls).flatMap(([id, info]) => {
    return [
      {
        name: `${info.name} - Registered Number`,
        hosted_item: `${id}_PHONE_NUMBER_HOSTED`,
        visibility_rules: [
          `$shouldShowLocation|${info.locationIds[0]}`,
        ],
        access_rules: [
          `^$accessibilityLevelForLocation|${info.locationIds[0]}|true`,
        ],
      },
      {
        name: `${info.name} - Received Call`,
        hosted_item: `${id}_PHONE_CALL_HOSTED`,
        visibility_rules: [
          `$shouldShowLocation|${id}_PHONE_CALL`,
        ],
        access_rules: [
          `^$accessibilityLevelForLocation|${id}_PHONE_CALL`,
        ],
      },
    ]
  }),
]

const itemLocations = [
  {
    name: "locations",
    sections: itemLocationSections,
  },
]

const maps = ([
  "azalea_gym",
  "azalea_town",
  "blackthorn_city",
  "blackthorn_gym",
  "burned_tower",
  "celadon_city",
  "celadon_dept_store",
  "celadon_gym",
  "cerulean_city",
  "cerulean_gym",
  "cherrygrove_city",
  "cianwood_city",
  "cianwood_gym",
  "cinnabar_island",
  "dark_cave_blackthorn_entrance",
  "dark_cave_violet_entrance",
  "digletts_cave",
  "dragons_den",
  "ecruteak_city",
  "ecruteak_gym",
  "fuchsia_city",
  "fuchsia_gym",
  "goldenrod_city",
  "goldenrod_dept_store",
  "goldenrod_gym",
  "goldenrod_underground",
  "goldenrod_underground_warehouse",
  "ice_path_1f",
  "ice_path_b1f_b2f_b3f",
  "ilex_forest",
  "indigo_plateau",
  "lake_of_rage",
  "lavender_town",
  "mahogany_gym",
  "mahogany_town",
  "map",
  "mount_moon",
  "mount_moon_square",
  "mount_mortar_b1f",
  "mount_mortar_back_1f",
  "mount_mortar_back_2f",
  "mount_mortar_front",
  "national_park",
  "new_bark_town",
  "olivine_city",
  "olivine_gym",
  "olivine_lighthouse",
  "olivine_port",
  "pallet_town",
  "pewter_city",
  "pewter_gym",
  "power_plant",
  "radio_tower",
  "rock_tunnel",
  "route_1",
  "route_10",
  "route_11",
  "route_12",
  "route_13",
  "route_14",
  "route_15",
  "route_16",
  "route_17",
  "route_18",
  "route_19",
  "route_2",
  "route_20",
  "route_21",
  "route_22",
  "route_23",
  "route_24",
  "route_25",
  "route_26",
  "route_27",
  "route_28_and_silver_cave_outside",
  "route_29",
  "route_3",
  "route_30",
  "route_31",
  "route_32",
  "route_33",
  "route_34",
  "route_35",
  "route_36",
  "route_37",
  "route_38",
  "route_39",
  "route_4",
  "route_40",
  "route_41",
  "route_42",
  "route_43",
  "route_44",
  "route_45",
  "route_46",
  "route_5",
  "route_6",
  "route_7",
  "route_8",
  "route_9",
  "ruins_of_alph_item_chambers",
  "ruins_of_alph_outside",
  "saffron_city",
  "saffron_gym",
  "seafoam_gym",
  "silver_cave",
  "slowpoke_well",
  "sprout_tower",
  "ss_aqua_cabins",
  "ss_aqua_decks",
  "team_rocket_base",
  "tin_tower",
  "tohjo_falls",
  "underground_path",
  "union_cave",
  "vermilion_city",
  "vermilion_gym",
  "vermilion_port",
  "victory_road",
  "violet_city",
  "violet_gym",
  "viridian_city",
  "viridian_gym",
  "whirl_island_b1f",
  "whirl_island_b2f",
  "whirl_island_entrances",
] as const).map((mapName) => {
  return {
    name: mapName,
    location_size: mapName === "map" ? 6 : 14,
    location_border_thickness: 1,
    img: `images/maps/${mapName}.png`,
  }
})

const createGroup = (name: string, map: typeof maps[number]["name"], x: number, y: number, locations: (ItemLocationId | MartGroupId | SpecialShopId | LogicalEventId | keyof typeof phoneCalls)[]) => {
  const getLocationName = (locationId: ItemLocationId | MartGroupId | SpecialShopId | LogicalEventId | keyof typeof phoneCalls) => {
    return itemLocationSections.find((location) => {
      return location.name === itemLocationsMap[locationId as ItemLocationId]?.name
        || location.name === martGroupsMap[locationId as MartGroupId]?.name
        || location.name === specialShopsMap[locationId as SpecialShopId]?.name
        || (location.name as string).toLowerCase().includes(locationId.toLowerCase()) && (
          (name === "New Bark Town" || map === "new_bark_town") && (location.name as string).includes("Received Call")
          || name !== "New Bark Town" && map !== "new_bark_town" && (location.name as string).includes("Registered Number")
        )
    })?.name ?? (eventInfo[locationId as LogicalEventId] as { name: string }).name
  }
  
  return {
    name: map === "map" || locations.length > 1 ? name : getLocationName(locations[0]),
    map_locations: [
      {
        map: map,
        x: map === "map" ? x : 8 + x,
        y: map === "map" ? y : 8 + y,
      },
    ],
    sections: locations.map((locationId) => {
      const locationName = getLocationName(locationId)
      
      return {
        name: locations.length > 1 ? locationName : "",
        ref: "locations/" + locationName,
      }
    }),
  }
}

const specificLocationGroups = [
  createGroup(
    "New Bark Town",
    "map",
    132,
    84,
    [
      "PLAYERS_HOUSE_1F_MOMS_GIFT",
      "ELMS_LAB_AIDES_FREE_GIFT",
      "ELMS_LAB_GAVE_MYSTERY_EGG",
      "ELMS_LAB_AIDES_GIFT_FOR_MYSTERY_EGG",
      "ELMS_LAB_ELMS_GIFT_FOR_RISINGBADGE",
      "ELMS_LAB_ELMS_GIFT_TO_CHAMPION",
      "ELMS_LAB_ELMS_GIFT_FOR_TOGEPI",
      ...Object.keys(phoneCalls) as (keyof typeof phoneCalls)[],
    ],
  ),
  createGroup(
    "Route 29",
    "map",
    112,
    84,
    [
      "ROUTE_29_ITEM_BALL",
      "ROUTE_29_FRUIT_TREE",
      "ROUTE_29_TUSCANYS_GIFT",
    ],
  ),
  createGroup(
    "Cherrygrove City",
    "map",
    92,
    84,
    [
      "CHERRYGROVE_CITY_GUIDE_GENTS_GIFT",
      "CHERRYGROVE_MART_SHOP",
      "CHERRYGROVE_CITY_SURF_AREA_MYSTIC_WATER_GUYS_GIFT",
    ],
  ),
  createGroup(
    "Route 30",
    "map",
    92,
    64,
    [
      "ROUTE_30_CHERRYGROVE_SIDE_SOUTH_FRUIT_TREE",
      "ROUTE_30_BERRY_HOUSE_MANS_GIFT",
      "ROUTE_30_CHERRYGROVE_SIDE_ITEM_BALL",
      "ROUTE_30_CHERRYGROVE_SIDE_HIDDEN_ITEM",
      "ROUTE_30_CHERRYGROVE_SIDE_NORTH_FRUIT_TREE",
      "MR_POKEMONS_HOUSE_MR_POKEMONS_FREE_GIFT",
      "MR_POKEMONS_HOUSE_OAKS_GIFT",
      "MR_POKEMONS_HOUSE_MR_POKEMONS_GIFT_FOR_RED_SCALE",
      "JOEY",
      "ROUTE_30_CHERRYGROVE_SIDE_JOEYS_GIFT",
    ],
  ),
  createGroup(
    "Route 31",
    "map",
    88,
    44,
    [
      "ROUTE_31_ITEM_BALL_BY_DARK_CAVE",
      "ROUTE_31_FRUIT_TREE",
      "ROUTE_31_ITEM_BALL_BY_TRAINER",
      "ROUTE_31_MANS_GIFT_FOR_RANDYS_MAIL",
      "WADE",
      "ROUTE_31_WADES_GIFT_1",
      "ROUTE_31_WADES_GIFT_2",
      "ROUTE_31_WADES_GIFT_3",
      "ROUTE_31_WADES_GIFT_4",
    ],
  ),
  createGroup(
    "Violet City",
    "map",
    76,
    44,
    [
      "VIOLET_CITY_FRUIT_TREE",
      "VIOLET_MART_SHOP",
      "VIOLET_GYM_BADGE",
      "VIOLET_GYM_FALKNERS_GIFT",
      "VIOLET_POKECENTER_1F_GOT_MYSTERY_EGG",
      "VIOLET_CITY_CUT_AREA_HIDDEN_ITEM",
      "VIOLET_CITY_SURF_AREA_EAST_ITEM_BALL",
      "VIOLET_CITY_SURF_AREA_WEST_ITEM_BALL",
    ],
  ),
  createGroup(
    "Sprout Tower",
    "map",
    76,
    36,
    [
      "SPROUT_TOWER_1F_NORTH_AREA_ITEM_BALL",
      "SPROUT_TOWER_2F_SW_AREA_ITEM_BALL",
      "SPROUT_TOWER_3F_SW_ITEM_BALL",
      "SPROUT_TOWER_3F_NE_ITEM_BALL",
      "SPROUT_TOWER_3F_SAGE_LIS_GIFT",
    ],
  ),
  createGroup(
    "Route 32",
    "map",
    76,
    76,
    [
      "ROUTE_32_NORTH_AREA_MANS_GIFT",
      "ROUTE_32_CUT_AREA_ROAR_GUYS_GIFT",
      "ROUTE_32_SOUTH_AREA_ITEM_BALL_IN_NORTH_GRASS",
      "ROUTE_32_SOUTH_AREA_HIDDEN_ITEM_NORTH_OF_PIER",
      "ROUTE_32_SOUTH_AREA_ITEM_BALL_IN_SOUTH_GRASS",
      "ROUTE_32_SOUTH_AREA_HIDDEN_ITEM_BEHIND_POKECENTER",
      "ROUTE_32_SOUTH_AREA_FRIEDAS_GIFT",
      "ROUTE_32_POKECENTER_1F_MANS_GIFT",
    ],
  ),
  createGroup(
    "Ruins of Alph",
    "map",
    68,
    60,
    [
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SW_ITEM_BALL",
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NW_ITEM_BALL",
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NE_ITEM_BALL",
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SE_ITEM_BALL",
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SW_ITEM_BALL",
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NW_ITEM_BALL",
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NE_ITEM_BALL",
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SE_ITEM_BALL",
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SW_ITEM_BALL",
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NW_ITEM_BALL",
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NE_ITEM_BALL",
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SE_ITEM_BALL",
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SW_ITEM_BALL",
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NW_ITEM_BALL",
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NE_ITEM_BALL",
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SE_ITEM_BALL",
      "RUINS_OF_ALPH_OUTSIDE_MAIN_AREA_RESEARCHERS_GIFT",
    ],
  ),
  createGroup(
    "Union Cave",
    "map",
    76,
    108,
    [
      "UNION_CAVE_1F_ITEM_BALL_1",
      "UNION_CAVE_1F_ITEM_BALL_2",
      "UNION_CAVE_1F_ITEM_BALL_3",
      "UNION_CAVE_1F_ITEM_BALL_4",
      "UNION_CAVE_B1F_MIDDLE_AREA_WEST_ITEM_BALL",
      "UNION_CAVE_B1F_MIDDLE_AREA_EAST_ITEM_BALL",
      "UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_IN_NE_CORNER",
      "UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_ON_PLATEAU",
    ],
  ),
  createGroup(
    "Route 33",
    "map",
    68,
    108,
    [
      "ROUTE_33_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Azalea Town",
    "map",
    60,
    108,
    [
      "AZALEA_TOWN_HIDDEN_ITEM",
      "AZALEA_TOWN_FRUIT_TREE",
      "AZALEA_MART_SHOP",
      "KURTS_HOUSE_TALKED_TO_KURT",
      "KURTS_HOUSE_KURTS_GIFT",
      "AZALEA_TOWN_KURTS_GIFT_FOR_GS_BALL",
      "AZALEA_GYM_BADGE",
      "AZALEA_GYM_BUGSYS_GIFT",
      "CHARCOAL_KILN_APPRENTICES_GIFT",
    ],
  ),
  createGroup(
    "Slowpoke Well",
    "map",
    60,
    100,
    [
      "SLOWPOKE_WELL_B1F_EAST_AREA_ITEM_BALL",
      "SLOWPOKE_WELL_B1F_EAST_AREA_DEFEATED_ROCKETS",
      "SLOWPOKE_WELL_B2F_SURF_AREA_MANS_GIFT",
      "SLOWPOKE_WELL_B2F_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Ilex Forest",
    "map",
    44,
    108,
    [
      "ILEX_FOREST_SOUTH_AREA_ITEM_BALL",
      "ILEX_FOREST_SOUTH_AREA_CHARCOAL_BOSSS_GIFT",
      "ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_SIGN",
      "ILEX_FOREST_NORTH_AREA_ITEM_BALL_1",
      "ILEX_FOREST_NORTH_AREA_ITEM_BALL_2",
      "ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_HEADBUTT_GUY",
      "ILEX_FOREST_NORTH_AREA_HEADBUTT_GUYS_GIFT",
      "ILEX_FOREST_NORTH_AREA_ITEM_BALL_3",
      "ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_EXIT",
      "ROUTE_34_ILEX_FOREST_GATE_LADYS_GIFT",
    ],
  ),
  createGroup(
    "Route 34",
    "map",
    44,
    92,
    [
      "ROUTE_34_DAY_CARE_AREA_HIDDEN_ITEM",
      "GINA",
      "ROUTE_34_MAIN_AREA_GINAS_GIFT",
      "TODD",
      "ROUTE_34_SURF_AREA_ITEM_BALL",
      "ROUTE_34_SURF_AREA_HIDDEN_ITEM",
      "ROUTE_34_SURF_AREA_KATES_GIFT",
    ],
  ),
  createGroup(
    "Goldenrod City",
    "map",
    44,
    76,
    [
      "GOLDENROD_BIKE_SHOP_OWNERS_GIFT",
      "GOLDENROD_GAME_CORNER_ITEM_SHOP",
      "GOLDENROD_GYM_BADGE",
      "GOLDENROD_GYM_WHITNEYS_GIFT",
      "GOLDENROD_FLOWER_SHOP_OWNERS_GIFT",
      "ROUTE_35_GOLDENROD_GATE_GOT_KENYA",
      "ROUTE_35_GOLDENROD_GATE_RANDYS_GIFT",
      "GOLDENROD_POKECENTER_1F_LADYS_GIFT_FOR_EON_MAIL",
      "GOLDENROD_POKECENTER_1F_LINK_RECEPTIONISTS_GIFT",
    ],
  ),
  createGroup(
    "Goldenrod Dept. Store",
    "map",
    52,
    72,
    [
      "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_SE_ITEM_BALL",
      "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_SW_ITEM_BALL",
      "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_NW_ITEM_BALL",
      "GOLDENROD_DEPT_STORE_2F_SHOP_1",
      "GOLDENROD_DEPT_STORE_2F_SHOP_2",
      "GOLDENROD_DEPT_STORE_3F_SHOP",
      "GOLDENROD_DEPT_STORE_4F_SHOP",
      "GOLDENROD_DEPT_STORE_5F_SHOP",
      "GOLDENROD_DEPT_STORE_5F_MYSTERY_GIFT_GIRLS_GIFT",
      "GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_1",
      "GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_2",
      "GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES",
      "GOLDENROD_DEPT_STORE_ROOF_SHOP_1",
      "GOLDENROD_DEPT_STORE_ROOF_SHOP_2",
    ],
  ),
  createGroup(
    "Goldenrod Underground",
    "map",
    52,
    80,
    [
      "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_DOOR",
      "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_BARGAIN_SHOP",
      "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_HERB_SHOP",
      "GOLDENROD_UNDERGROUND_ITEM_BALL",
      "GOLDENROD_UNDERGROUND_BARGAIN_SHOP",
      "GOLDENROD_UNDERGROUND_HERB_SHOP",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_RIGHT_ITEM_BALL",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_MIDDLE_HIDDEN_ITEM",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_BOTTOM_LEFT_ITEM_BALL",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_LEFT_HIDDEN_ITEM",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_1",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_2",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_3",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT",
      "GOLDENROD_DEPT_STORE_B1F_STAIRS_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Radio Tower",
    "map",
    36,
    76,
    [
      "RADIO_TOWER_1F_QUIZ_PRIZE",
      "RADIO_TOWER_2F_BUENAS_GIFT",
      "RADIO_TOWER_2F_BLUE_CARD_SHOP",
      "RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT",
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
      "RADIO_TOWER_5F_EAST_AREA_ITEM_BALL",
      "RADIO_TOWER_4F_EAST_AREA_DJ_MARYS_GIFT",
      "RADIO_TOWER_3F_WEST_AREA_LADYS_GIFT",
    ],
  ),
  createGroup(
    "Route 35",
    "map",
    44,
    60,
    [
      "ROUTE_35_ITEM_BALL",
      "ROUTE_35_SURF_AREA_FRUIT_TREE",
    ],
  ),
  createGroup(
    "National Park",
    "map",
    44,
    44,
    [
      "NATIONAL_PARK_BENCH_LADYS_GIFT",
      "NATIONAL_PARK_EAST_ITEM_BALL",
      "NATIONAL_PARK_WEST_ITEM_BALL",
      "NATIONAL_PARK_HIDDEN_ITEM",
      "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_1ST_PLACE_PRIZE",
      "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_2ND_PLACE_PRIZE",
      "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_3RD_PLACE_PRIZE",
      "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_CONSOLATION_PRIZE",
      "BEVERLY",
      "NATIONAL_PARK_BEVERLYS_GIFT_FOR_MARILL",
    ],
  ),
  createGroup(
    "Route 36",
    "map",
    60,
    44,
    [
      "ROUTE_36_EAST_AREA_ARTHURS_GIFT",
      "ROUTE_36_EAST_AREA_ROCK_SMASH_GUYS_GIFT",
      "ROUTE_36_WEST_AREA_FRUIT_TREE",
      "ROUTE_36_WEST_AREA_TALKED_TO_FLORIA",
      "ALAN",
      "ROUTE_36_WEST_AREA_ALANS_GIFT",
    ],
  ),
  createGroup(
    "Route 37",
    "map",
    60,
    36,
    [
      "ROUTE_37_LEFT_FRUIT_TREE",
      "ROUTE_37_MIDDLE_FRUIT_TREE",
      "ROUTE_37_RIGHT_FRUIT_TREE",
      "ROUTE_37_SUNNYS_GIFT",
      "ROUTE_37_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Ecruteak City",
    "map",
    60,
    28,
    [
      "ECRUTEAK_ITEMFINDER_HOUSE_MANS_GIFT",
      "ECRUTEAK_CITY_HIDDEN_ITEM",
      "ECRUTEAK_MART_SHOP",
      "DANCE_THEATER_MANS_GIFT",
      "BURNED_TOWER_1F_HIDDEN_ITEM_BY_ENTRANCE",
      "BURNED_TOWER_1F_ROCK_SMASH_AREA_ITEM_BALL",
      "BURNED_TOWER_B1F_AWOKE_LEGENDARY_BEASTS",
      "BURNED_TOWER_1F_HIDDEN_ITEM_BY_HOLE",
      "BURNED_TOWER_B1F_STRENGTH_AREA_ITEM_BALL",
      "ECRUTEAK_GYM_BADGE",
      "ECRUTEAK_GYM_MORTYS_GIFT",
    ],
  ),
  createGroup(
    "Tin Tower",
    "map",
    60,
    20,
    [
      "TIN_TOWER_1F_NORTH_SAGES_GIFT",
      "TIN_TOWER_3F_ITEM_BALL",
      "TIN_TOWER_4F_CENTRAL_ITEM_BALL",
      "TIN_TOWER_4F_SE_ITEM_BALL",
      "TIN_TOWER_4F_SW_ITEM_BALL",
      "TIN_TOWER_4F_HIDDEN_ITEM",
      "TIN_TOWER_5F_SE_AREA_HIDDEN_ITEM",
      "TIN_TOWER_5F_SW_AREA_HIDDEN_ITEM",
      "TIN_TOWER_5F_NORTH_AREA_ITEM_BALL",
      "TIN_TOWER_6F_ITEM_BALL",
      "TIN_TOWER_8F_MIDDLE_AREA_ITEM_BALL",
      "TIN_TOWER_8F_SOUTH_AREA_ITEM_BALL",
      "TIN_TOWER_7F_OUTER_AREA_ITEM_BALL",
      "TIN_TOWER_9F_NORTH_AREA_ITEM_BALL",
      "TIN_TOWER_8F_NORTH_AREA_ITEM_BALL",
      "TIN_TOWER_ROOF_FOUGHT_HO_OH",
    ],
  ),
  createGroup(
    "Route 38",
    "map",
    44,
    28,
    [
      "ROUTE_38_FRUIT_TREE",
      "DANA",
      "ROUTE_38_DANAS_GIFT",
    ],
  ),
  createGroup(
    "Route 39",
    "map",
    28,
    32,
    [
      "ROUTE_39_FRUIT_TREE",
      "ROUTE_39_HIDDEN_ITEM",
      "ROUTE_39_FARMHOUSE_LADYS_GIFT",
      "ROUTE_39_FARMHOUSE_SHOP",
      "DEREK",
      "ROUTE_39_DEREKS_GIFT_FOR_PIKACHU",
    ],
  ),
  createGroup(
    "Olivine City",
    "map",
    28,
    44,
    [
      "OLIVINE_GOOD_ROD_HOUSE_MANS_GIFT",
      "OLIVINE_MART_SHOP",
      "OLIVINE_CAFE_SAILORS_GIFT",
      "HUEY",
      "OLIVINE_LIGHTHOUSE_2F_HUEYS_GIFT",
      "OLIVINE_LIGHTHOUSE_3F_INNER_AREA_ITEM_BALL",
      "OLIVINE_LIGHTHOUSE_5F_INNER_AREA_ITEM_BALL",
      "OLIVINE_LIGHTHOUSE_6F_ITEM_BALL",
      "OLIVINE_LIGHTHOUSE_6F_TALKED_TO_JASMINE",
      "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_HOLE",
      "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_STAIRS",
      "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_HIDDEN_ITEM",
      "OLIVINE_LIGHTHOUSE_6F_HEALED_AMPHY",
      "OLIVINE_GYM_BADGE",
      "OLIVINE_GYM_JASMINES_GIFT",
    ],
  ),
  createGroup(
    "Olivine Port",
    "map",
    28,
    52,
    [
      "OLIVINE_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
      "FAST_SHIP_B1F_EAST_AREA_TALKED_TO_SAILOR",
      "FAST_SHIP_CABINS_NNW_FOUGHT_SAILOR",
      "FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT",
    ],
  ),
  createGroup(
    "Route 40",
    "map",
    20,
    44,
    [
      "ROUTE_40_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK",
      "ROUTE_40_MONICAS_GIFT",
    ],
  ),
  createGroup(
    "Whirl Islands",
    "map",
    20,
    76,
    [
      "ROUTE_41_SW_ISLAND_SURF_AREA_HIDDEN_ITEM",
      "WHIRL_ISLAND_NE_BOTTOM_LEDGE_AREA_ITEM_BALL",
      "WHIRL_ISLAND_B2F_ABOVE_WATERFALL_AREA_ITEM_BALL",
      "WHIRL_ISLAND_B1F_NORTH_AREA_EAST_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_IN_MIDDLE_OF_LEDGES",
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_NW_LADDER",
      "WHIRL_ISLAND_B1F_NORTH_AREA_WEST_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_LADDER_TO_B2F_ISOLATED_AREA",
      "WHIRL_ISLAND_B2F_ISOLATED_AREA_EAST_ITEM_BALL",
      "WHIRL_ISLAND_B2F_ISOLATED_AREA_WEST_ITEM_BALL",
      "WHIRL_ISLAND_B1F_SW_AREA_ITEM_BALL",
      "WHIRL_ISLAND_SW_ENTRANCE_EAST_AREA_ITEM_BALL",
      "WHIRL_ISLAND_B1F_SE_AREA_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_SE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Cianwood City",
    "map",
    12,
    84,
    [
      "CIANWOOD_PHARMACY_OWNERS_GIFT",
      "CIANWOOD_PHARMACY_SHOP",
      "CIANWOOD_CITY_HIDDEN_ITEM_UNDER_SOUTH_ROCK_SMASH_ROCK",
      "CIANWOOD_CITY_HIDDEN_ITEM_UNDER_NORTH_ROCK_SMASH_ROCK",
      "CIANWOOD_GYM_BADGE",
      "CIANWOOD_GYM_STRENGTH_AREA_CHUCKS_GIFT",
      "CIANWOOD_CITY_CHUCKS_WIFES_GIFT",
    ],
  ),
  createGroup(
    "Route 42",
    "map",
    80,
    28,
    [
      "ROUTE_42_ECRUTEAK_SIDE_ITEM_BALL",
      "ROUTE_42_SURF_AREA_HIDDEN_ITEM",
      "ROUTE_42_MIDDLE_AREA_ITEM_BALL",
      "ROUTE_42_MIDDLE_CUT_AREA_LEFT_FRUIT_TREE",
      "ROUTE_42_MIDDLE_CUT_AREA_MIDDLE_FRUIT_TREE",
      "ROUTE_42_MIDDLE_CUT_AREA_RIGHT_FRUIT_TREE",
      "TULLY",
      "ROUTE_42_MAHOGANY_SIDE_TULLYS_GIFT",
    ],
  ),
  createGroup(
    "Mount Mortar",
    "map",
    80,
    20,
    [
      "MOUNT_MORTAR_FRONT_WEST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_FRONT_EAST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_FRONT_MAHOGANY_SIDE_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_4",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_5",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_SW_ITEM_BALL",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_SE_ITEM_BALL",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_CENTRAL_ITEM_BALL",
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_EAST_PLATEAU",
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_WEST_PLATEAU",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_NW_ITEM_BALL",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_ON_PLATEAU",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_NORTH_OF_PLATEAU",
      "MOUNT_MORTAR_B1F_NW_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_SOUTH_OF_PLATEAU",
    ],
  ),
  createGroup(
    "Mahogany Town",
    "map",
    100,
    28,
    [
      "MAHOGANY_TOWN_STREET_VENDOR",
      "MAHOGANY_MART_1F_SHOP_1",
      "MAHOGANY_MART_1F_SHOP_2",
      "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_COMPUTER",
      "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_MIDDLE_STATUE",
      "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BETWEEN_SOUTH_STATUES",
      "TEAM_ROCKET_BASE_B1F_HIDDEN_ITEM",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_ITEM_BALL_BETWEEN_STAIRS",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_GOT_FEMALE_GRUNTS_PASSWORD",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_RIGHT_ITEM_BALL_BY_PLANTS",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_LEFT_ITEM_BALL_BY_PLANTS",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_GOT_SW_GRUNTS_PASSWORD",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_NORTH_ITEM_BALL",
      "TEAM_ROCKET_BASE_B2F_NORTH_AREA_HIDDEN_ITEM",
      "TEAM_ROCKET_BASE_B2F_WEST_AREA_ITEM_BALL",
      "TEAM_ROCKET_BASE_B3F_NW_AREA_ITEM_BALL",
      "TEAM_ROCKET_BASE_B3F_ADMIN_AREA_GOT_MURKROWS_PASSWORD",
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
      "MAHOGANY_GYM_BADGE",
      "MAHOGANY_GYM_PRYCES_GIFT",
    ],
  ),
  createGroup(
    "Route 43",
    "map",
    100,
    20,
    [
      "ROUTE_43_ITEM_BALL",
      "ROUTE_43_GATE_GUARDS_GIFT",
      "ROUTE_43_SURF_CUT_AREA_FRUIT_TREE",
      "TIFFANY",
      "ROUTE_43_TIFFANYS_GIFT_FOR_CLEFAIRY",
    ],
  ),
  createGroup(
    "Lake of Rage",
    "map",
    100,
    12,
    [
      "LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_LEDGES",
      "LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_WATER",
      "LAKE_OF_RAGE_CUT_AREA_HIDDEN_ITEM",
      "LAKE_OF_RAGE_CUT_AREA_WESLEYS_GIFT",
      "LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_SOUTH_OF_HOUSE",
      "LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_EAST_OF_HOUSE",
      "LAKE_OF_RAGE_HIDDEN_POWER_HOUSE_MANS_GIFT",
      "LAKE_OF_RAGE_SURF_AREA_SHINYS_GIFT",
      "LAKE_OF_RAGE_MAIN_AREA_TALKED_TO_LANCE",
      "LAKE_OF_RAGE_MAGIKARP_HOUSE_MANS_GIFT_FOR_MAGIKARP",
    ],
  ),
  createGroup(
    "Route 44",
    "map",
    112,
    28,
    [
      "ROUTE_44_FRUIT_TREE",
      "ROUTE_44_ITEM_BALL_BY_MAHOGANY",
      "ROUTE_44_SURF_AREA_ITEM_BALL",
      "ROUTE_44_SURF_AREA_HIDDEN_ITEM",
      "ROUTE_44_ITEM_BALL_BY_ICE_PATH",
      "WILTON",
      "ROUTE_44_WILTONS_GIFT_1",
      "ROUTE_44_WILTONS_GIFT_2",
      "ROUTE_44_WILTONS_GIFT_3",
      "VANCE",
      "ROUTE_44_VANCES_GIFT",
    ],
  ),
  createGroup(
    "Ice Path",
    "map",
    116,
    20,
    [
      "ICE_PATH_1F_MAHOGANY_SIDE_ITEM_BALL",
      "ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_ITEM_BALL",
      "ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_HIDDEN_ITEM",
      "ICE_PATH_B2F_MAHOGANY_SIDE_CENTRAL_AREA_ITEM_BALL",
      "ICE_PATH_B3F_ITEM_BALL",
      "ICE_PATH_B2F_BLACKTHORN_SIDE_ITEM_BALL",
      "ICE_PATH_B2F_BLACKTHORN_SIDE_HIDDEN_ITEM",
      "ICE_PATH_B1F_BLACKTHORN_SIDE_HIDDEN_ITEM",
      "ICE_PATH_B1F_BLACKTHORN_SIDE_ITEM_BALL",
      "ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_ON_PLATEAU",
      "ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_BY_ICE",
    ],
  ),
  createGroup(
    "Blackthorn City",
    "map",
    124,
    28,
    [
      "BLACKTHORN_MART_SHOP",
      "BLACKTHORN_CITY_SANTOSS_GIFT",
      "BLACKTHORN_GYM_1F_BACK_AREA_DEFEATED_CLAIR",
    ],
  ),
  createGroup(
    "Dragon's Den",
    "map",
    124,
    20,
    [
      "DRAGONS_DEN_B1F_NORTH_AREA_ITEM_BALL",
      "DRAGONS_DEN_B1F_NORTH_SURF_AREA_HIDDEN_ITEM",
      "DRAGONS_DEN_B1F_NORTH_SURF_AREA_ITEM_BALL",
      "DRAGON_SHRINE_BADGE",
      "DRAGONS_DEN_B1F_SOUTH_AREA_CLAIRS_GIFT",
      "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_SE_HIDDEN_ITEM",
      "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_ITEM_BALL",
      "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_NE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Route 45",
    "map",
    124,
    48,
    [
      "ROUTE_45_ITEM_BALL_1",
      "ROUTE_45_ITEM_BALL_2",
      "ROUTE_45_KENJIS_GIFT",
      "ROUTE_45_ITEM_BALL_3",
      "ROUTE_45_ITEM_BALL_4",
      "ROUTE_45_SURF_AREA_HIDDEN_ITEM",
      "ROUTE_45_FRUIT_TREE",
      "PARRY",
      "ROUTE_45_PARRYS_GIFT",
    ],
  ),
  createGroup(
    "Route 46",
    "map",
    116,
    68,
    [
      "ROUTE_46_NORTH_AREA_LEFT_FRUIT_TREE",
      "ROUTE_46_NORTH_AREA_RIGHT_FRUIT_TREE",
      "ROUTE_46_NORTH_AREA_ITEM_BALL",
      "ERIN",
      "ROUTE_46_NORTH_AREA_ERINS_GIFT",
    ],
  ),
  createGroup(
    "Dark Cave",
    "map",
    108,
    44,
    [
      "DARK_CAVE_VIOLET_ENTRANCE_WEST_AREA_ITEM_BALL",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_HIDDEN_ITEM",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_1",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_2",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_3",
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_ON_PLATEAU",
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_BY_LEDGE",
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_MANS_GIFT",
    ],
  ),
  createGroup(
    "Route 27",
    "map",
    148,
    84,
    [
      "ROUTE_27_WEST_SURF_AREA_ITEM_BALL",
      "TOHJO_FALLS_WEST_SURF_AREA_ITEM_BALL",
      "ROUTE_27_SANDSTORM_HOUSE_LADYS_GIFT",
      "ROUTE_27_WHIRLPOOL_AREA_ITEM_BALL",
      "JOSE",
      "ROUTE_27_WHIRLPOOL_AREA_JOSES_GIFT",
    ],
  ),
  createGroup(
    "Route 26",
    "map",
    164,
    68,
    [
      "ROUTE_26_FRUIT_TREE",
      "ROUTE_26_ITEM_BALL",
    ],
  ),
  createGroup(
    "Victory Road",
    "map",
    164,
    36,
    [
      "VICTORY_ROAD_1F_HIDDEN_ITEM",
      "VICTORY_ROAD_1F_RIGHT_ITEM_BALL",
      "VICTORY_ROAD_1F_LEFT_ITEM_BALL",
      "VICTORY_ROAD_2F_SOUTH_AREA_ITEM_BALL",
      "VICTORY_ROAD_2F_NE_AREA_ITEM_BALL",
      "VICTORY_ROAD_2F_NW_AREA_ITEM_BALL",
      "VICTORY_ROAD_2F_NW_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Indigo Plateau",
    "map",
    164,
    20,
    [
      "INDIGO_PLATEAU_POKECENTER_1F_SHOP",
      "HALL_OF_FAME_ENTERED",
    ],
  ),
  createGroup(
    "Route 28",
    "map",
    152,
    52,
    [
      "ROUTE_28_NORTH_AREA_HIDDEN_ITEM",
      "ROUTE_28_STEEL_WING_HOUSE_LADYS_GIFT",
    ],
  ),
  createGroup(
    "Silver Cave",
    "map",
    140,
    52,
    [
      "SILVER_CAVE_OUTSIDE_SURF_AREA_HIDDEN_ITEM",
      "SILVER_CAVE_ROOM_1_SE_ITEM_BALL",
      "SILVER_CAVE_ROOM_1_SW_ITEM_BALL",
      "SILVER_CAVE_ROOM_1_CENTRAL_ITEM_BALL",
      "SILVER_CAVE_ROOM_1_SOUTH_HIDDEN_ITEM",
      "SILVER_CAVE_ROOM_1_NORTH_ITEM_BALL",
      "SILVER_CAVE_ROOM_1_NORTH_HIDDEN_ITEM",
      "SILVER_CAVE_ROOM_2_MAIN_AREA_HIDDEN_ITEM",
      "SILVER_CAVE_ROOM_2_MAIN_AREA_ITEM_BALL",
      "SILVER_CAVE_ROOM_2_ABOVE_SW_WATERFALL_SURF_AREA_ITEM_BALL",
      "SILVER_CAVE_ITEM_ROOMS_SW_AREA_ITEM_BALL",
      "SILVER_CAVE_ROOM_2_ABOVE_NE_WATERFALL_AREA_ITEM_BALL",
      "SILVER_CAVE_ITEM_ROOMS_NE_AREA_ITEM_BALL",
      "SILVER_CAVE_ROOM_3_DEFEATED_RED",
    ],
  ),
  createGroup(
    "Pallet Town",
    "map",
    188,
    92,
    [
      "OAKS_LAB_GOT_OAKS_APPROVAL",
    ],
  ),
  createGroup(
    "Route 1",
    "map",
    188,
    76,
    [
      "ROUTE_1_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Viridian City",
    "map",
    188,
    60,
    [
      "VIRIDIAN_MART_SHOP",
      "VIRIDIAN_CITY_ISOLATED_AREA_DREAM_EATER_GUYS_GIFT",
      "VIRIDIAN_GYM_BADGE",
    ],
  ),
  createGroup(
    "Route 2",
    "map",
    188,
    48,
    [
      "ROUTE_2_DIGLETTS_CAVE_AREA_ITEM_BALL",
      "ROUTE_2_NUGGET_HOUSE_MANS_GIFT",
      "ROUTE_2_FOREST_AREA_ITEM_BALL_BY_PEWTER_ENTRANCE",
      "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_PEWTER_ENTRANCE",
      "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_CENTER",
      "ROUTE_2_FOREST_AREA_FRUIT_TREE",
      "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_SE_CORNER",
      "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_VIRIDIAN_ENTRANCE",
      "ROUTE_2_FOREST_AREA_ITEM_BALL_BY_VIRIDIAN_ENTRANCE",
      "ROUTE_2_SE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Pewter City",
    "map",
    188,
    36,
    [
      "PEWTER_MART_SHOP",
      "PEWTER_CITY_OLD_MANS_GIFT",
      "PEWTER_CITY_LEFT_FRUIT_TREE",
      "PEWTER_CITY_RIGHT_FRUIT_TREE",
      "PEWTER_GYM_BADGE",
    ],
  ),
  createGroup(
    "Mount Moon",
    "map",
    212,
    36,
    [
      "MOUNT_MOON_GIFT_SHOP_SHOP",
      "MOUNT_MOON_SQUARE_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK",
    ],
  ),
  createGroup(
    "Route 4",
    "map",
    224,
    36,
    [
      "ROUTE_4_WEST_AREA_HIDDEN_ITEM",
      "ROUTE_4_WEST_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Cerulean City",
    "map",
    236,
    36,
    [
      "CERULEAN_MART_SHOP",
      "CERULEAN_CITY_SURF_AREA_HIDDEN_ITEM",
      "CERULEAN_GYM_CONFRONTED_ROCKET",
      "CERULEAN_GYM_HIDDEN_ITEM",
      "CERULEAN_GYM_BADGE",
    ],
  ),
  createGroup(
    "Route 25",
    "map",
    244,
    20,
    [
      "ROUTE_25_HIDDEN_ITEM",
      "ROUTE_25_KEVINS_GIFT",
      "ROUTE_25_CUT_AREA_ITEM_BALL",
      "ROUTE_25_MET_MISTY",
      "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_LICKITUNG",
      "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_ODDISH",
      "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_STARYU",
      "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_GROWLITHE",
      "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_PICHU",
    ],
  ),
  createGroup(
    "Route 9",
    "map",
    252,
    36,
    [
      "ROUTE_9_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Power Plant",
    "map",
    268,
    36,
    [
      "POWER_PLANT_TALKED_TO_MANAGER",
      "POWER_PLANT_MANAGERS_GIFT",
    ],
  ),
  createGroup(
    "Rock Tunnel",
    "map",
    268,
    44,
    [
      "ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_ON_PLATEAU",
      "ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_WEST_OF_PLATEAU",
      "ROCK_TUNNEL_1F_LAVENDER_SIDE_HIDDEN_ITEM",
      "ROCK_TUNNEL_B1F_NW_AREA_HIDDEN_ITEM",
      "ROCK_TUNNEL_B1F_NW_AREA_SOUTH_ITEM_BALL",
      "ROCK_TUNNEL_B1F_NW_AREA_NORTH_ITEM_BALL",
      "ROCK_TUNNEL_B1F_SE_AREA_ITEM_BALL",
      "ROCK_TUNNEL_1F_CERULEAN_SIDE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Lavender Town",
    "map",
    268,
    52,
    [
      "LAVENDER_MART_SHOP",
      "LAV_RADIO_TOWER_1F_DIRECTORS_GIFT",
    ],
  ),
  createGroup(
    "Route 5",
    "map",
    236,
    44,
    [
      "ROUTE_5_CLEANSE_TAG_HOUSE_LADYS_GIFT",
    ],
  ),
  createGroup(
    "Route 8",
    "map",
    252,
    52,
    [
      "ROUTE_8_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Underground Path",
    "map",
    244,
    44,
    [
      "UNDERGROUND_PATH_NORTH_HIDDEN_ITEM",
      "UNDERGROUND_PATH_SOUTH_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Diglett's Cave",
    "map",
    244,
    60,
    [
      "DIGLETTS_CAVE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Route 11",
    "map",
    252,
    68,
    [
      "ROUTE_11_FRUIT_TREE",
      "ROUTE_11_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Route 12",
    "map",
    268,
    68,
    [
      "ROUTE_12_SUPER_ROD_HOUSE_MANS_GIFT",
      "ROUTE_12_CUT_AREA_ITEM_BALL",
      "ROUTE_12_SURF_AREA_HIDDEN_ITEM",
      "ROUTE_12_SURF_CUT_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Route 13",
    "map",
    260,
    84,
    [
      "ROUTE_13_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Route 15",
    "map",
    244,
    100,
    [
      "ROUTE_15_CUT_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Saffron City",
    "map",
    236,
    52,
    [
      "FIGHTING_DOJO_ITEM_BALL",
      "SILPH_CO_1F_GUARDS_GIFT",
      "MR_PSYCHICS_HOUSE_MR_PSYCHICS_GIFT",
      "SAFFRON_MART_SHOP",
      "SAFFRON_GYM_BADGE",
      "COPYCATS_HOUSE_2F_COPYCATS_GIFT",
    ],
  ),
  createGroup(
    "Vermilion City",
    "map",
    236,
    68,
    [
      "VERMILION_CITY_HIDDEN_ITEM",
      "POKEMON_FAN_CLUB_CHAIRMANS_GIFT",
      "VERMILION_MART_SHOP",
      "POKEMON_FAN_CLUB_MEMBERS_GIFT",
      "VERMILION_GYM_BADGE",
      "VERMILION_CITY_WOKE_SNORLAX",
      "VERMILION_CITY_BADGE_GUYS_GIFT",
    ],
  ),
  createGroup(
    "Vermilion Port",
    "map",
    236,
    76,
    [
      "VERMILION_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
      "FAST_SHIP_B1F_EAST_AREA_TALKED_TO_SAILOR",
      "FAST_SHIP_CABINS_NNW_FOUGHT_SAILOR",
      "FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT",
    ],
  ),
  createGroup(
    "Celadon City",
    "map",
    212,
    52,
    [
      "CELADON_MANSION_ROOF_HOUSE_MANS_GIFT",
      "CELADON_CAFE_HIDDEN_ITEM",
      "CELADON_CITY_HIDDEN_ITEM",
      "CELADON_GAME_CORNER_ITEM_SHOP",
      "CELADON_DEPT_STORE_2F_SHOP_1",
      "CELADON_DEPT_STORE_2F_SHOP_2",
      "CELADON_DEPT_STORE_3F_SHOP",
      "CELADON_DEPT_STORE_4F_SHOP",
      "CELADON_DEPT_STORE_5F_SHOP_1",
      "CELADON_DEPT_STORE_5F_SHOP_2",
      "CELADON_DEPT_STORE_6F_VENDING_MACHINES",
      "CELADON_GYM_BADGE",
      "CELADON_GYM_ERIKAS_GIFT",
    ],
  ),
  createGroup(
    "Route 17",
    "map",
    204,
    80,
    [
      "ROUTE_17_HIDDEN_ITEM_IN_WATER",
      "ROUTE_17_HIDDEN_ITEM_ON_FENCE",
    ],
  ),
  createGroup(
    "Fuchsia City",
    "map",
    228,
    100,
    [
      "FUCHSIA_GYM_BADGE",
      "FUCHSIA_GYM_JANINES_GIFT",
      "FUCHSIA_MART_SHOP",
      "FUCHSIA_CITY_CUT_AREA_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Cinnabar Island",
    "map",
    188,
    116,
    [
      "CINNABAR_ISLAND_TALKED_TO_BLUE",
      "CINNABAR_ISLAND_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Seafoam Island",
    "map",
    204,
    116,
    [
      "SEAFOAM_GYM_BADGE",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "azalea_town",
    8 * 16,
    2 * 16,
    [
      "AZALEA_TOWN_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Kurt's House",
    "azalea_town",
    9 * 16,
    5 * 16,
    [
      "KURTS_HOUSE_TALKED_TO_KURT",
      "KURTS_HOUSE_KURTS_GIFT",
      "AZALEA_TOWN_KURTS_GIFT_FOR_GS_BALL",
    ],
  ),
  createGroup(
    "Gym",
    "azalea_town",
    10 * 16,
    15 * 16,
    [
      "AZALEA_GYM_BADGE",
      "AZALEA_GYM_BUGSYS_GIFT",
    ],
  ),
  createGroup(
    "Charcoal Kiln",
    "azalea_town",
    21 * 16,
    13 * 16,
    [
      "CHARCOAL_KILN_APPRENTICES_GIFT",
    ],
  ),
  createGroup(
    "Mart",
    "azalea_town",
    21 * 16,
    5 * 16,
    [
      "AZALEA_MART_SHOP",
    ],
  ),
  createGroup(
    "Hidden Item",
    "azalea_town",
    31 * 16,
    6 * 16,
    [
      "AZALEA_TOWN_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Slowpoke Well",
    "azalea_town",
    31 * 16,
    7 * 16,
    [
      "SLOWPOKE_WELL_B1F_EAST_AREA_ITEM_BALL",
      "SLOWPOKE_WELL_B1F_EAST_AREA_DEFEATED_ROCKETS",
      "SLOWPOKE_WELL_B2F_SURF_AREA_MANS_GIFT",
      "SLOWPOKE_WELL_B2F_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Dragon's Den",
    "blackthorn_city",
    20 * 16,
    1 * 16,
    [
      "DRAGONS_DEN_B1F_NORTH_AREA_ITEM_BALL",
      "DRAGONS_DEN_B1F_NORTH_SURF_AREA_HIDDEN_ITEM",
      "DRAGONS_DEN_B1F_NORTH_SURF_AREA_ITEM_BALL",
      "DRAGON_SHRINE_BADGE",
      "DRAGONS_DEN_B1F_SOUTH_AREA_CLAIRS_GIFT",
      "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_SE_HIDDEN_ITEM",
      "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_ITEM_BALL",
      "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_NE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Gym",
    "blackthorn_city",
    288,
    176,
    [
      "BLACKTHORN_GYM_1F_BACK_AREA_DEFEATED_CLAIR",
    ],
  ),
  createGroup(
    "Santos",
    "blackthorn_city",
    22 * 16,
    20 * 16,
    [
      "BLACKTHORN_CITY_SANTOSS_GIFT",
    ],
  ),
  createGroup(
    "Mart",
    "blackthorn_city",
    15 * 16,
    29 * 16,
    [
      "BLACKTHORN_MART_SHOP",
    ],
  ),
  createGroup(
    "Hidden Item",
    "burned_tower",
    11 * 16,
    12 * 16,
    [
      "BURNED_TOWER_1F_HIDDEN_ITEM_BY_ENTRANCE",
    ],
  ),
  createGroup(
    "Hidden Item",
    "burned_tower",
    6 * 16,
    8 * 16,
    [
      "BURNED_TOWER_1F_HIDDEN_ITEM_BY_HOLE",
    ],
  ),
  createGroup(
    "Legendary Beasts",
    "burned_tower",
    432,
    64,
    [
      "BURNED_TOWER_B1F_AWOKE_LEGENDARY_BEASTS",
    ],
  ),
  createGroup(
    "Item Ball",
    "burned_tower",
    12 * 16,
    3 * 16,
    [
      "BURNED_TOWER_1F_ROCK_SMASH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "burned_tower",
    33 * 16,
    4 * 16,
    [
      "BURNED_TOWER_B1F_STRENGTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Mart",
    "celadon_city",
    4 * 16,
    9 * 16,
    [
      "CELADON_DEPT_STORE_2F_SHOP_1",
      "CELADON_DEPT_STORE_2F_SHOP_2",
      "CELADON_DEPT_STORE_3F_SHOP",
      "CELADON_DEPT_STORE_4F_SHOP",
      "CELADON_DEPT_STORE_5F_SHOP_1",
      "CELADON_DEPT_STORE_5F_SHOP_2",
      "CELADON_DEPT_STORE_6F_VENDING_MACHINES",
    ],
  ),
  createGroup(
    "Mansion Roof House",
    "celadon_city",
    17 * 16,
    3 * 16,
    [
      "CELADON_MANSION_ROOF_HOUSE_MANS_GIFT",
    ],
  ),
  createGroup(
    "Cafe",
    "celadon_city",
    25 * 16,
    29 * 16,
    [
      "CELADON_CAFE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "celadon_city",
    37 * 16,
    21 * 16,
    [
      "CELADON_CITY_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Game Corner Item Shop",
    "celadon_city",
    23 * 16,
    19 * 16,
    [
      "CELADON_GAME_CORNER_ITEM_SHOP",
    ],
  ),
  createGroup(
    "Gym",
    "celadon_city",
    10 * 16,
    29 * 16,
    [
      "CELADON_GYM_BADGE",
      "CELADON_GYM_ERIKAS_GIFT",
    ],
  ),
  createGroup(
    "Hidden Item",
    "cerulean_city",
    2 * 16,
    12 * 16,
    [
      "CERULEAN_CITY_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Gym",
    "cerulean_city",
    30 * 16,
    23 * 16,
    [
      "CERULEAN_GYM_CONFRONTED_ROCKET",
      "CERULEAN_GYM_HIDDEN_ITEM",
      "CERULEAN_GYM_BADGE",
    ],
  ),
  createGroup(
    "Mart",
    "cerulean_city",
    25 * 16,
    29 * 16,
    [
      "CERULEAN_MART_SHOP",
    ],
  ),
  createGroup(
    "Guide Gent",
    "cherrygrove_city",
    32 * 16,
    6 * 16,
    [
      "CHERRYGROVE_CITY_GUIDE_GENTS_GIFT",
    ],
  ),
  createGroup(
    "Mart",
    "cherrygrove_city",
    23 * 16,
    3 * 16,
    [
      "CHERRYGROVE_MART_SHOP",
    ],
  ),
  createGroup(
    "Mystic Water Guy",
    "cherrygrove_city",
    7 * 16,
    12 * 16,
    [
      "CHERRYGROVE_CITY_SURF_AREA_MYSTIC_WATER_GUYS_GIFT",
    ],
  ),
  createGroup(
    "Rock",
    "cianwood_city",
    2 * 16,
    7 * 16,
    [
      "CIANWOOD_CITY_HIDDEN_ITEM_UNDER_NORTH_ROCK_SMASH_ROCK",
    ],
  ),
  createGroup(
    "Rock",
    "cianwood_city",
    3 * 16,
    17 * 16,
    [
      "CIANWOOD_CITY_HIDDEN_ITEM_UNDER_SOUTH_ROCK_SMASH_ROCK",
    ],
  ),
  createGroup(
    "Gym",
    "cianwood_city",
    6 * 16,
    31 * 16,
    [
      "CIANWOOD_GYM_BADGE",
      "CIANWOOD_GYM_STRENGTH_AREA_CHUCKS_GIFT",
    ],
  ),
  createGroup(
    "Chuck's Wife",
    "cianwood_city",
    8 * 16,
    34 * 16,
    [
      "CIANWOOD_CITY_CHUCKS_WIFES_GIFT",
    ],
  ),
  createGroup(
    "Pharmacy",
    "cianwood_city",
    13 * 16,
    35 * 16,
    [
      "CIANWOOD_PHARMACY_OWNERS_GIFT",
      "CIANWOOD_PHARMACY_SHOP",
    ],
  ),
  createGroup(
    "Hidden Item",
    "cinnabar_island",
    9 * 16,
    1 * 16,
    [
      "CINNABAR_ISLAND_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Blue",
    "cinnabar_island",
    144,
    96,
    [
      "CINNABAR_ISLAND_TALKED_TO_BLUE",
    ],
  ),
  createGroup(
    "Item Ball",
    "dark_cave_blackthorn_entrance",
    21 * 16,
    24 * 16,
    [
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_ON_PLATEAU",
    ],
  ),
  createGroup(
    "Item Ball",
    "dark_cave_blackthorn_entrance",
    7 * 16,
    22 * 16,
    [
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_BY_LEDGE",
    ],
  ),
  createGroup(
    "Man",
    "dark_cave_blackthorn_entrance",
    7 * 16,
    3 * 16,
    [
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_MANS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "dark_cave_violet_entrance",
    6 * 16,
    8 * 16,
    [
      "DARK_CAVE_VIOLET_ENTRANCE_WEST_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "dark_cave_violet_entrance",
    26 * 16,
    3 * 16,
    [
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "dark_cave_violet_entrance",
    35 * 16,
    9 * 16,
    [
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_1",
    ],
  ),
  createGroup(
    "Item Ball",
    "dark_cave_violet_entrance",
    36 * 16,
    22 * 16,
    [
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_2",
    ],
  ),
  createGroup(
    "Item Ball",
    "dark_cave_violet_entrance",
    30 * 16,
    28 * 16,
    [
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_3",
    ],
  ),
  createGroup(
    "Hidden Item",
    "underground_path",
    3 * 16,
    13 * 16 - 64,
    [
      "UNDERGROUND_PATH_NORTH_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "underground_path",
    1 * 16,
    23 * 16 - 64,
    [
      "UNDERGROUND_PATH_SOUTH_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "digletts_cave",
    13 * 16 - 112,
    11 * 16,
    [
      "DIGLETTS_CAVE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "dragons_den",
    480,
    64,
    [
      "DRAGONS_DEN_B1F_NORTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "dragons_den",
    336,
    272,
    [
      "DRAGONS_DEN_B1F_NORTH_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "dragons_den",
    80,
    320,
    [
      "DRAGONS_DEN_B1F_NORTH_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Dragon Shrine",
    "dragons_den",
    304,
    464,
    [
      "DRAGON_SHRINE_BADGE",
      "DRAGONS_DEN_B1F_SOUTH_AREA_CLAIRS_GIFT",
    ],
  ),
  createGroup(
    "Hidden Item",
    "dragons_den",
    528,
    464,
    [
      "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_SE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "dragons_den",
    560,
    256,
    [
      "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "dragons_den",
    496,
    240,
    [
      "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_NE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Burned Tower",
    "ecruteak_city",
    80,
    80,
    [
      "BURNED_TOWER_1F_HIDDEN_ITEM_BY_ENTRANCE",
      "BURNED_TOWER_1F_ROCK_SMASH_AREA_ITEM_BALL",
      "BURNED_TOWER_B1F_AWOKE_LEGENDARY_BEASTS",
      "BURNED_TOWER_1F_HIDDEN_ITEM_BY_HOLE",
      "BURNED_TOWER_B1F_STRENGTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Tin Tower",
    "ecruteak_city",
    592,
    112,
    [
      "TIN_TOWER_1F_NORTH_SAGES_GIFT",
      "TIN_TOWER_3F_ITEM_BALL",
      "TIN_TOWER_4F_CENTRAL_ITEM_BALL",
      "TIN_TOWER_4F_SE_ITEM_BALL",
      "TIN_TOWER_4F_SW_ITEM_BALL",
      "TIN_TOWER_4F_HIDDEN_ITEM",
      "TIN_TOWER_5F_SE_AREA_HIDDEN_ITEM",
      "TIN_TOWER_5F_SW_AREA_HIDDEN_ITEM",
      "TIN_TOWER_5F_NORTH_AREA_ITEM_BALL",
      "TIN_TOWER_6F_ITEM_BALL",
      "TIN_TOWER_8F_MIDDLE_AREA_ITEM_BALL",
      "TIN_TOWER_8F_SOUTH_AREA_ITEM_BALL",
      "TIN_TOWER_7F_OUTER_AREA_ITEM_BALL",
      "TIN_TOWER_9F_NORTH_AREA_ITEM_BALL",
      "TIN_TOWER_8F_NORTH_AREA_ITEM_BALL",
      "TIN_TOWER_ROOF_FOUGHT_HO_OH",
    ],
  ),
  createGroup(
    "Hidden Item",
    "ecruteak_city",
    368,
    224,
    [
      "ECRUTEAK_CITY_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Gym",
    "ecruteak_city",
    96,
    432,
    [
      "ECRUTEAK_GYM_BADGE",
      "ECRUTEAK_GYM_MORTYS_GIFT",
    ],
  ),
  createGroup(
    "Dance Theater",
    "ecruteak_city",
    368,
    336,
    [
      "DANCE_THEATER_MANS_GIFT",
    ],
  ),
  createGroup(
    "Mart",
    "ecruteak_city",
    464,
    336,
    [
      "ECRUTEAK_MART_SHOP",
    ],
  ),
  createGroup(
    "Itemfinder House",
    "ecruteak_city",
    208,
    432,
    [
      "ECRUTEAK_ITEMFINDER_HOUSE_MANS_GIFT",
    ],
  ),
  createGroup(
    "Gym",
    "fuchsia_city",
    128,
    432,
    [
      "FUCHSIA_GYM_BADGE",
      "FUCHSIA_GYM_JANINES_GIFT",
    ],
  ),
  createGroup(
    "Mart",
    "fuchsia_city",
    80,
    208,
    [
      "FUCHSIA_MART_SHOP",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "fuchsia_city",
    128,
    16,
    [
      "FUCHSIA_CITY_CUT_AREA_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Underground",
    "goldenrod_city",
    144,
    80,
    [
      "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_DOOR",
      "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_BARGAIN_SHOP",
      "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_HERB_SHOP",
      "GOLDENROD_UNDERGROUND_ITEM_BALL",
      "GOLDENROD_UNDERGROUND_BARGAIN_SHOP",
      "GOLDENROD_UNDERGROUND_HERB_SHOP",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_RIGHT_ITEM_BALL",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_MIDDLE_HIDDEN_ITEM",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_BOTTOM_LEFT_ITEM_BALL",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_LEFT_HIDDEN_ITEM",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_1",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_2",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_3",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT",
      "GOLDENROD_DEPT_STORE_B1F_STAIRS_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Gate",
    "goldenrod_city",
    304,
    16,
    [
      "ROUTE_35_GOLDENROD_GATE_GOT_KENYA",
      "ROUTE_35_GOLDENROD_GATE_RANDYS_GIFT",
    ],
  ),
  createGroup(
    "Gym",
    "goldenrod_city",
    384,
    112,
    [
      "GOLDENROD_GYM_BADGE",
      "GOLDENROD_GYM_WHITNEYS_GIFT",
    ],
  ),
  createGroup(
    "Flower Shop",
    "goldenrod_city",
    464,
    80,
    [
      "GOLDENROD_FLOWER_SHOP_OWNERS_GIFT",
    ],
  ),
  createGroup(
    "Radio Tower",
    "goldenrod_city",
    80,
    240,
    [
      "RADIO_TOWER_1F_QUIZ_PRIZE",
      "RADIO_TOWER_2F_BUENAS_GIFT",
      "RADIO_TOWER_2F_BLUE_CARD_SHOP",
      "RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT",
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
      "RADIO_TOWER_5F_EAST_AREA_ITEM_BALL",
      "RADIO_TOWER_4F_EAST_AREA_DJ_MARYS_GIFT",
      "RADIO_TOWER_3F_WEST_AREA_LADYS_GIFT",
    ],
  ),
  createGroup(
    "Game Corner",
    "goldenrod_city",
    224,
    336,
    [
      "GOLDENROD_GAME_CORNER_ITEM_SHOP",
    ],
  ),
  createGroup(
    "Pokecenter",
    "goldenrod_city",
    240,
    432,
    [
      "GOLDENROD_POKECENTER_1F_LADYS_GIFT_FOR_EON_MAIL",
      "GOLDENROD_POKECENTER_1F_LINK_RECEPTIONISTS_GIFT",
    ],
  ),
  createGroup(
    "Dept. Store",
    "goldenrod_city",
    384,
    432,
    [
      "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_SE_ITEM_BALL",
      "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_SW_ITEM_BALL",
      "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_NW_ITEM_BALL",
      "GOLDENROD_DEPT_STORE_2F_SHOP_1",
      "GOLDENROD_DEPT_STORE_2F_SHOP_2",
      "GOLDENROD_DEPT_STORE_3F_SHOP",
      "GOLDENROD_DEPT_STORE_4F_SHOP",
      "GOLDENROD_DEPT_STORE_5F_SHOP",
      "GOLDENROD_DEPT_STORE_5F_MYSTERY_GIFT_GIRLS_GIFT",
      "GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_1",
      "GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_2",
      "GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES",
      "GOLDENROD_DEPT_STORE_ROOF_SHOP_1",
      "GOLDENROD_DEPT_STORE_ROOF_SHOP_2",
    ],
  ),
  createGroup(
    "Bike Shop",
    "goldenrod_city",
    464,
    464,
    [
      "GOLDENROD_BIKE_SHOP_OWNERS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "goldenrod_dept_store",
    240,
    320,
    [
      "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "goldenrod_dept_store",
    160,
    320,
    [
      "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_SW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "goldenrod_dept_store",
    96,
    128,
    [
      "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_NW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "goldenrod_dept_store",
    224,
    112,
    [
      "GOLDENROD_DEPT_STORE_B1F_STAIRS_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Shop",
    "goldenrod_dept_store",
    544,
    400,
    [
      "GOLDENROD_DEPT_STORE_2F_SHOP_2",
    ],
  ),
  createGroup(
    "Shop",
    "goldenrod_dept_store",
    544,
    384,
    [
      "GOLDENROD_DEPT_STORE_2F_SHOP_1",
    ],
  ),
  createGroup(
    "Shop",
    "goldenrod_dept_store",
    432,
    176,
    [
      "GOLDENROD_DEPT_STORE_3F_SHOP",
    ],
  ),
  createGroup(
    "Shop",
    "goldenrod_dept_store",
    544,
    96,
    [
      "GOLDENROD_DEPT_STORE_4F_SHOP",
    ],
  ),
  createGroup(
    "Shop",
    "goldenrod_dept_store",
    736,
    384,
    [
      "GOLDENROD_DEPT_STORE_5F_SHOP",
    ],
  ),
  createGroup(
    "Shop",
    "goldenrod_dept_store",
    624,
    80,
    [
      "GOLDENROD_DEPT_STORE_ROOF_SHOP_1",
      "GOLDENROD_DEPT_STORE_ROOF_SHOP_2",
    ],
  ),
  createGroup(
    "Vending Machines",
    "goldenrod_dept_store",
    784,
    176,
    [
      "GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES",
    ],
  ),
  createGroup(
    "Receptionist",
    "goldenrod_dept_store",
    720,
    384,
    [
      "GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_1",
      "GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_2",
    ],
  ),
  createGroup(
    "Mystery Gift Girl",
    "goldenrod_dept_store",
    752,
    320,
    [
      "GOLDENROD_DEPT_STORE_5F_MYSTERY_GIFT_GIRLS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "goldenrod_underground_warehouse",
    224,
    160,
    [
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_RIGHT_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "goldenrod_underground_warehouse",
    128,
    160,
    [
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_MIDDLE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "goldenrod_underground_warehouse",
    16,
    208,
    [
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_BOTTOM_LEFT_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "goldenrod_underground_warehouse",
    16,
    144,
    [
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_LEFT_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "goldenrod_underground_warehouse",
    464,
    16,
    [
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_1",
    ],
  ),
  createGroup(
    "Item Ball",
    "goldenrod_underground_warehouse",
    720,
    240,
    [
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_2",
    ],
  ),
  createGroup(
    "Item Ball",
    "goldenrod_underground_warehouse",
    640,
    144,
    [
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_3",
    ],
  ),
  createGroup(
    "Director",
    "goldenrod_underground_warehouse",
    624,
    128,
    [
      "GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT",
    ],
  ),
  createGroup(
    "Stairs",
    "goldenrod_underground_warehouse",
    704,
    32,
    [
      "GOLDENROD_DEPT_STORE_B1F_STAIRS_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "goldenrod_underground",
    272,
    128,
    [
      "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_DOOR",
    ],
  ),
  createGroup(
    "Hidden Item",
    "goldenrod_underground",
    96,
    208,
    [
      "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_BARGAIN_SHOP",
    ],
  ),
  createGroup(
    "Hidden Item",
    "goldenrod_underground",
    64,
    288,
    [
      "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_HERB_SHOP",
    ],
  ),
  createGroup(
    "Item Ball",
    "goldenrod_underground",
    112,
    400,
    [
      "GOLDENROD_UNDERGROUND_ITEM_BALL",
    ],
  ),
  createGroup(
    "Bargain Shop",
    "goldenrod_underground",
    112,
    176,
    [
      "GOLDENROD_UNDERGROUND_BARGAIN_SHOP",
    ],
  ),
  createGroup(
    "Herb Shop",
    "goldenrod_underground",
    112,
    336,
    [
      "GOLDENROD_UNDERGROUND_HERB_SHOP",
    ],
  ),
  createGroup(
    "Warehouse",
    "goldenrod_underground",
    288,
    96,
    [
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_RIGHT_ITEM_BALL",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_MIDDLE_HIDDEN_ITEM",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_BOTTOM_LEFT_ITEM_BALL",
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_LEFT_HIDDEN_ITEM",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_1",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_2",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_3",
      "GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "ice_path_1f",
    496,
    112,
    [
      "ICE_PATH_1F_MAHOGANY_SIDE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ice_path_1f",
    560,
    144,
    [
      "ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_ON_PLATEAU",
    ],
  ),
  createGroup(
    "Item Ball",
    "ice_path_1f",
    512,
    368,
    [
      "ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_BY_ICE",
    ],
  ),
  createGroup(
    "Item Ball",
    "ice_path_b1f_b2f_b3f",
    0,
    336,
    [
      "ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "ice_path_b1f_b2f_b3f",
    0,
    567,
    [
      "ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "ice_path_b1f_b2f_b3f",
    128,
    448,
    [
      "ICE_PATH_B2F_MAHOGANY_SIDE_CENTRAL_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ice_path_b1f_b2f_b3f",
    416,
    528,
    [
      "ICE_PATH_B3F_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ice_path_b1f_b2f_b3f",
    800,
    560,
    [
      "ICE_PATH_B2F_BLACKTHORN_SIDE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "ice_path_b1f_b2f_b3f",
    704,
    464,
    [
      "ICE_PATH_B2F_BLACKTHORN_SIDE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "ice_path_b1f_b2f_b3f",
    784,
    192,
    [
      "ICE_PATH_B1F_BLACKTHORN_SIDE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "ice_path_b1f_b2f_b3f",
    592,
    272,
    [
      "ICE_PATH_B1F_BLACKTHORN_SIDE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ilex_forest",
    320,
    512,
    [
      "ILEX_FOREST_SOUTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ilex_forest",
    144,
    272,
    [
      "ILEX_FOREST_NORTH_AREA_ITEM_BALL_1",
    ],
  ),
  createGroup(
    "Item Ball",
    "ilex_forest",
    272,
    112,
    [
      "ILEX_FOREST_NORTH_AREA_ITEM_BALL_2",
    ],
  ),
  createGroup(
    "Item Ball",
    "ilex_forest",
    432,
    16,
    [
      "ILEX_FOREST_NORTH_AREA_ITEM_BALL_3",
    ],
  ),
  createGroup(
    "Hidden Item",
    "ilex_forest",
    16,
    272,
    [
      "ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_SIGN",
    ],
  ),
  createGroup(
    "Hidden Item",
    "ilex_forest",
    352,
    224,
    [
      "ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_HEADBUTT_GUY",
    ],
  ),
  createGroup(
    "Hidden Item",
    "ilex_forest",
    176,
    112,
    [
      "ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_EXIT",
    ],
  ),
  createGroup(
    "Charcoal Boss",
    "ilex_forest",
    80,
    448,
    [
      "ILEX_FOREST_SOUTH_AREA_CHARCOAL_BOSSS_GIFT",
    ],
  ),
  createGroup(
    "Headbutt Guy",
    "ilex_forest",
    240,
    224,
    [
      "ILEX_FOREST_NORTH_AREA_HEADBUTT_GUYS_GIFT",
    ],
  ),
  createGroup(
    "Gate",
    "ilex_forest",
    16,
    80,
    [
      "ROUTE_34_ILEX_FOREST_GATE_LADYS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "lake_of_rage",
    112,
    160,
    [
      "LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_SOUTH_OF_HOUSE",
    ],
  ),
  createGroup(
    "Item Ball",
    "lake_of_rage",
    560,
    32,
    [
      "LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_EAST_OF_HOUSE",
    ],
  ),
  createGroup(
    "Hidden Item",
    "lake_of_rage",
    176,
    448,
    [
      "LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_LEDGES",
    ],
  ),
  createGroup(
    "Hidden Item",
    "lake_of_rage",
    64,
    80,
    [
      "LAKE_OF_RAGE_CUT_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "lake_of_rage",
    560,
    80,
    [
      "LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_WATER",
    ],
  ),
  createGroup(
    "Wesley",
    "lake_of_rage",
    64,
    64,
    [
      "LAKE_OF_RAGE_CUT_AREA_WESLEYS_GIFT",
    ],
  ),
  createGroup(
    "Hidden Power House",
    "lake_of_rage",
    112,
    48,
    [
      "LAKE_OF_RAGE_HIDDEN_POWER_HOUSE_MANS_GIFT",
    ],
  ),
  createGroup(
    "Shiny",
    "lake_of_rage",
    288,
    352,
    [
      "LAKE_OF_RAGE_SURF_AREA_SHINYS_GIFT",
    ],
  ),
  createGroup(
    "Lance",
    "lake_of_rage",
    336,
    448,
    [
      "LAKE_OF_RAGE_MAIN_AREA_TALKED_TO_LANCE",
    ],
  ),
  createGroup(
    "Magikarp House",
    "lake_of_rage",
    432,
    496,
    [
      "LAKE_OF_RAGE_MAGIKARP_HOUSE_MANS_GIFT_FOR_MAGIKARP",
    ],
  ),
  createGroup(
    "Mart",
    "lavender_town",
    16,
    80 + 288,
    [
      "LAVENDER_MART_SHOP",
    ],
  ),
  createGroup(
    "Radio Tower",
    "lavender_town",
    224,
    80 + 288,
    [
      "LAV_RADIO_TOWER_1F_DIRECTORS_GIFT",
    ],
  ),
  createGroup(
    "Gym",
    "mahogany_town",
    96,
    208,
    [
      "MAHOGANY_GYM_BADGE",
      "MAHOGANY_GYM_PRYCES_GIFT",
    ],
  ),
  createGroup(
    "Mart",
    "mahogany_town",
    176,
    112,
    [
      "MAHOGANY_MART_1F_SHOP_1",
      "MAHOGANY_MART_1F_SHOP_2",
      "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_COMPUTER",
      "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_MIDDLE_STATUE",
      "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BETWEEN_SOUTH_STATUES",
      "TEAM_ROCKET_BASE_B1F_HIDDEN_ITEM",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_ITEM_BALL_BETWEEN_STAIRS",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_GOT_FEMALE_GRUNTS_PASSWORD",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_RIGHT_ITEM_BALL_BY_PLANTS",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_LEFT_ITEM_BALL_BY_PLANTS",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_GOT_SW_GRUNTS_PASSWORD",
      "TEAM_ROCKET_BASE_B3F_SE_AREA_NORTH_ITEM_BALL",
      "TEAM_ROCKET_BASE_B2F_NORTH_AREA_HIDDEN_ITEM",
      "TEAM_ROCKET_BASE_B2F_WEST_AREA_ITEM_BALL",
      "TEAM_ROCKET_BASE_B3F_NW_AREA_ITEM_BALL",
      "TEAM_ROCKET_BASE_B3F_ADMIN_AREA_GOT_MURKROWS_PASSWORD",
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
    ],
  ),
  createGroup(
    "Street Vendor",
    "mahogany_town",
    304,
    128,
    [
      "MAHOGANY_TOWN_STREET_VENDOR",
    ],
  ),
  createGroup(
    "Gift Shop",
    "mount_moon_square",
    208,
    112,
    [
      "MOUNT_MOON_GIFT_SHOP_SHOP",
    ],
  ),
  createGroup(
    "Rock",
    "mount_moon_square",
    112,
    112,
    [
      "MOUNT_MOON_SQUARE_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_b1f",
    544,
    384,
    [
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_1",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_b1f",
    464,
    192,
    [
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_2",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_b1f",
    512,
    48,
    [
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_3",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_b1f",
    336,
    416,
    [
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_4",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_b1f",
    64,
    256,
    [
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_5",
    ],
  ),
  createGroup(
    "Hidden Item",
    "mount_mortar_b1f",
    64,
    96,
    [
      "MOUNT_MORTAR_B1F_NW_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "West Ladder",
    "mount_mortar_back_1f",
    80,
    624,
    [
      "MOUNT_MORTAR_FRONT_WEST_LADDER_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "East Ladder",
    "mount_mortar_back_1f",
    528,
    656,
    [
      "MOUNT_MORTAR_FRONT_EAST_LADDER_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_1f",
    160,
    432,
    [
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_1f",
    272,
    272,
    [
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_1f",
    560,
    304,
    [
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_1f",
    560,
    608,
    [
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4",
    ],
  ),
  createGroup(
    "Exit",
    "mount_mortar_back_1f",
    464,
    768,
    [
      "MOUNT_MORTAR_FRONT_MAHOGANY_SIDE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_1f",
    128,
    256,
    [
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_ON_PLATEAU",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_1f",
    256,
    160,
    [
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_NORTH_OF_PLATEAU",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_1f",
    352,
    320,
    [
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_SOUTH_OF_PLATEAU",
    ],
  ),
  createGroup(
    "Hidden Item",
    "mount_mortar_back_1f",
    480,
    176,
    [
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "North Ladder",
    "mount_mortar_back_1f",
    48,
    304,
    [
      "MOUNT_MORTAR_B1F_NW_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_2f",
    32,
    528,
    [
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_SW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_2f",
    448,
    352,
    [
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_2f",
    304,
    272,
    [
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_CENTRAL_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_2f",
    448,
    80,
    [
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_EAST_PLATEAU",
    ],
  ),
  createGroup(
    "Hidden Item",
    "mount_mortar_back_2f",
    368,
    128,
    [
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_2f",
    256,
    80,
    [
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_WEST_PLATEAU",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_back_2f",
    144,
    176,
    [
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_NW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Ladder",
    "mount_mortar_back_2f",
    48,
    80,
    [
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_ON_PLATEAU",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_NORTH_OF_PLATEAU",
      "MOUNT_MORTAR_B1F_NW_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_SOUTH_OF_PLATEAU",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4",
    ],
  ),
  createGroup(
    "North Cave",
    "mount_mortar_front",
    272,
    80,
    [
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_SW_ITEM_BALL",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_SE_ITEM_BALL",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_CENTRAL_ITEM_BALL",
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_EAST_PLATEAU",
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_WEST_PLATEAU",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_NW_ITEM_BALL",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_ON_PLATEAU",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_NORTH_OF_PLATEAU",
      "MOUNT_MORTAR_B1F_NW_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_SOUTH_OF_PLATEAU",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4",
    ],
  ),
  createGroup(
    "West Cave",
    "mount_mortar_front",
    176,
    336,
    [
      "MOUNT_MORTAR_FRONT_WEST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_FRONT_EAST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4",
    ],
  ),
  createGroup(
    "East Cave",
    "mount_mortar_front",
    464,
    336,
    [
      "MOUNT_MORTAR_FRONT_WEST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_FRONT_EAST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4",
    ],
  ),
  createGroup(
    "Ladder",
    "mount_mortar_front",
    272,
    464,
    [
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_4",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_5",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_front",
    208,
    240,
    [
      "MOUNT_MORTAR_FRONT_WEST_LADDER_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "mount_mortar_front",
    496,
    288,
    [
      "MOUNT_MORTAR_FRONT_EAST_LADDER_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "mount_mortar_front",
    400,
    352,
    [
      "MOUNT_MORTAR_FRONT_MAHOGANY_SIDE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "national_park",
    560,
    192,
    [
      "NATIONAL_PARK_EAST_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "national_park",
    16,
    688,
    [
      "NATIONAL_PARK_WEST_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "national_park",
    96,
    752,
    [
      "NATIONAL_PARK_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Lady on Bench",
    "national_park",
    432,
    640,
    [
      "NATIONAL_PARK_BENCH_LADYS_GIFT",
    ],
  ),
  createGroup(
    "Beverly",
    "national_park",
    288,
    464,
    [
      "BEVERLY",
      "NATIONAL_PARK_BEVERLYS_GIFT_FOR_MARILL",
    ],
  ),
  createGroup(
    "Gate",
    "national_park",
    528,
    304,
    [
      "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_1ST_PLACE_PRIZE",
      "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_2ND_PLACE_PRIZE",
      "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_3RD_PLACE_PRIZE",
      "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_CONSOLATION_PRIZE",
    ],
  ),
  createGroup(
    "Player's House",
    "new_bark_town",
    208,
    80,
    [
      "PLAYERS_HOUSE_1F_MOMS_GIFT",
      ...Object.keys(phoneCalls) as (keyof typeof phoneCalls)[],
    ],
  ),
  createGroup(
    "Elm's Lab",
    "new_bark_town",
    96,
    48,
    [
      "ELMS_LAB_AIDES_FREE_GIFT",
      "ELMS_LAB_GAVE_MYSTERY_EGG",
      "ELMS_LAB_AIDES_GIFT_FOR_MYSTERY_EGG",
      "ELMS_LAB_ELMS_GIFT_FOR_RISINGBADGE",
      "ELMS_LAB_ELMS_GIFT_TO_CHAMPION",
      "ELMS_LAB_ELMS_GIFT_FOR_TOGEPI",
    ],
  ),
  createGroup(
    "Gym",
    "olivine_city",
    160,
    176,
    [
      "OLIVINE_GYM_BADGE",
      "OLIVINE_GYM_JASMINES_GIFT",
    ],
  ),
  createGroup(
    "Good Rod House",
    "olivine_city",
    208,
    240,
    [
      "OLIVINE_GOOD_ROD_HOUSE_MANS_GIFT",
    ],
  ),
  createGroup(
    "Mart",
    "olivine_city",
    304,
    272,
    [
      "OLIVINE_MART_SHOP",
    ],
  ),
  createGroup(
    "Cafe",
    "olivine_city",
    112,
    336,
    [
      "OLIVINE_CAFE_SAILORS_GIFT",
    ],
  ),
  createGroup(
    "Lighthouse",
    "olivine_city",
    464,
    432,
    [
      "OLIVINE_LIGHTHOUSE_2F_HUEYS_GIFT",
      "OLIVINE_LIGHTHOUSE_3F_INNER_AREA_ITEM_BALL",
      "OLIVINE_LIGHTHOUSE_5F_INNER_AREA_ITEM_BALL",
      "OLIVINE_LIGHTHOUSE_6F_ITEM_BALL",
      "OLIVINE_LIGHTHOUSE_6F_TALKED_TO_JASMINE",
      "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_HOLE",
      "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_STAIRS",
      "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_HIDDEN_ITEM",
      "OLIVINE_LIGHTHOUSE_6F_HEALED_AMPHY",
    ],
  ),
  createGroup(
    "Port",
    "olivine_city",
    304,
    432,
    [
      "FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT",
      "OLIVINE_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
      "VERMILION_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Huey",
    "olivine_lighthouse",
    144,
    352 - 304,
    [
      "HUEY",
      "OLIVINE_LIGHTHOUSE_2F_HUEYS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "olivine_lighthouse",
    128 + 336,
    32 + 304,
    [
      "OLIVINE_LIGHTHOUSE_3F_INNER_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "olivine_lighthouse",
    432 + 336,
    544,
    [
      "OLIVINE_LIGHTHOUSE_5F_INNER_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "olivine_lighthouse",
    384 + 336,
    64,
    [
      "OLIVINE_LIGHTHOUSE_6F_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "olivine_lighthouse",
    576 + 336,
    496,
    [
      "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_HOLE",
    ],
  ),
  createGroup(
    "Item Ball",
    "olivine_lighthouse",
    368 + 336,
    512,
    [
      "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_STAIRS",
    ],
  ),
  createGroup(
    "Hidden Item",
    "olivine_lighthouse",
    384 + 336,
    512,
    [
      "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Jasmine",
    "olivine_lighthouse",
    464 + 336,
    128,
    [
      "OLIVINE_LIGHTHOUSE_6F_TALKED_TO_JASMINE",
      "OLIVINE_LIGHTHOUSE_6F_HEALED_AMPHY",
    ],
  ),
  createGroup(
    "Gym",
    "pewter_city",
    256,
    272,
    [
      "PEWTER_GYM_BADGE",
    ],
  ),
  createGroup(
    "Mart",
    "pewter_city",
    368,
    272,
    [
      "PEWTER_MART_SHOP",
    ],
  ),
  createGroup(
    "Old Man",
    "pewter_city",
    464,
    272,
    [
      "PEWTER_CITY_OLD_MANS_GIFT",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "pewter_city",
    480,
    48,
    [
      "PEWTER_CITY_LEFT_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "pewter_city",
    512,
    48,
    [
      "PEWTER_CITY_RIGHT_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Manager",
    "power_plant",
    224,
    160,
    [
      "POWER_PLANT_TALKED_TO_MANAGER",
      "POWER_PLANT_MANAGERS_GIFT",
    ],
  ),
  createGroup(
    "Quiz",
    "radio_tower",
    192,
    304,
    [
      "RADIO_TOWER_1F_QUIZ_PRIZE",
    ],
  ),
  createGroup(
    "Buena",
    "radio_tower",
    224,
    144,
    [
      "RADIO_TOWER_2F_BUENAS_GIFT",
    ],
  ),
  createGroup(
    "Buena's Assitant",
    "radio_tower",
    192,
    176,
    [
      "RADIO_TOWER_2F_BLUE_CARD_SHOP",
    ],
  ),
  createGroup(
    "Lady",
    "radio_tower",
    480,
    336,
    [
      "RADIO_TOWER_3F_WEST_AREA_LADYS_GIFT",
    ],
  ),
  createGroup(
    "DJ Mary",
    "radio_tower",
    528,
    240,
    [
      "RADIO_TOWER_4F_EAST_AREA_DJ_MARYS_GIFT",
    ],
  ),
  createGroup(
    "False Director",
    "radio_tower",
    352,
    96,
    [
      "RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT",
    ],
  ),
  createGroup(
    "Rocket Executive",
    "radio_tower",
    512,
    80,
    [
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "radio_tower",
    432,
    80,
    [
      "RADIO_TOWER_5F_EAST_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "rock_tunnel",
    160,
    240,
    [
      "ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_ON_PLATEAU",
    ],
  ),
  createGroup(
    "Item Ball",
    "rock_tunnel",
    64,
    288,
    [
      "ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_WEST_OF_PLATEAU",
    ],
  ),
  createGroup(
    "Item Ball",
    "rock_tunnel",
    592,
    272,
    [
      "ROCK_TUNNEL_B1F_NW_AREA_SOUTH_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "rock_tunnel",
    736,
    32,
    [
      "ROCK_TUNNEL_B1F_NW_AREA_NORTH_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "rock_tunnel",
    608,
    400,
    [
      "ROCK_TUNNEL_B1F_SE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "rock_tunnel",
    336,
    240,
    [
      "ROCK_TUNNEL_1F_LAVENDER_SIDE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "rock_tunnel",
    560,
    224,
    [
      "ROCK_TUNNEL_B1F_NW_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "rock_tunnel",
    384,
    64,
    [
      "ROCK_TUNNEL_1F_CERULEAN_SIDE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_1",
    48,
    112,
    [
      "ROUTE_1_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_2",
    224,
    800,
    [
      "ROUTE_2_SE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_2",
    0,
    464,
    [
      "ROUTE_2_FOREST_AREA_ITEM_BALL_BY_VIRIDIAN_ENTRANCE",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_2",
    32,
    368,
    [
      "ROUTE_2_FOREST_AREA_ITEM_BALL_BY_PEWTER_ENTRANCE",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_2",
    304,
    32,
    [
      "ROUTE_2_DIGLETTS_CAVE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_2",
    64,
    432,
    [
      "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_VIRIDIAN_ENTRANCE",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_2",
    176,
    480,
    [
      "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_SE_CORNER",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_2",
    112,
    368,
    [
      "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_CENTER",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_2",
    64,
    224,
    [
      "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_PEWTER_ENTRANCE",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_2",
    160,
    224,
    [
      "ROUTE_2_FOREST_AREA_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Nugget House",
    "route_2",
    240,
    240,
    [
      "ROUTE_2_NUGGET_HOUSE_MANS_GIFT",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_4",
    160,
    48,
    [
      "ROUTE_4_WEST_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_4",
    416,
    48,
    [
      "ROUTE_4_WEST_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Cleanse Tag House",
    "route_5",
    160,
    176,
    [
      "ROUTE_5_CLEANSE_TAG_HOUSE_LADYS_GIFT",
    ],
  ),
  createGroup(
    "Underground Path",
    "route_5",
    272,
    240,
    [
      "UNDERGROUND_PATH_NORTH_HIDDEN_ITEM",
      "UNDERGROUND_PATH_SOUTH_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_8",
    528,
    80,
    [
      "ROUTE_8_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_9",
    656,
    240,
    [
      "ROUTE_9_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_11",
    512,
    32,
    [
      "ROUTE_11_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_11",
    512,
    80,
    [
      "ROUTE_11_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_12",
    224,
    192 + 16,
    [
      "ROUTE_12_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Super Rod House",
    "route_12",
    176,
    528,
    [
      "ROUTE_12_SUPER_ROD_HOUSE_MANS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_12",
    80,
    688,
    [
      "ROUTE_12_CUT_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_12",
    80,
    816,
    [
      "ROUTE_12_SURF_CUT_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_13",
    480,
    208,
    [
      "ROUTE_13_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_15",
    192,
    80,
    [
      "ROUTE_15_CUT_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_17",
    144,
    864,
    [
      "ROUTE_17_HIDDEN_ITEM_IN_WATER",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_17",
    128,
    1232,
    [
      "ROUTE_17_HIDDEN_ITEM_ON_FENCE",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_25",
    64,
    80,
    [
      "ROUTE_25_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_25",
    512,
    64,
    [
      "ROUTE_25_CUT_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Kevin",
    "route_25",
    592,
    128,
    [
      "ROUTE_25_KEVINS_GIFT",
    ],
  ),
  createGroup(
    "Misty",
    "route_25",
    736,
    144,
    [
      "ROUTE_25_MET_MISTY",
    ],
  ),
  createGroup(
    "Bill's House",
    "route_25",
    752,
    80,
    [
      "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_LICKITUNG",
      "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_ODDISH",
      "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_STARYU",
      "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_GROWLITHE",
      "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_PICHU",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_26",
    144,
    240,
    [
      "ROUTE_26_ITEM_BALL",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_26",
    560,
    48,
    [
      "ROUTE_26_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Tohjo Falls",
    "route_27",
    416,
    80,
    [
      "TOHJO_FALLS_WEST_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Sandstorm House",
    "route_27",
    528,
    112,
    [
      "ROUTE_27_SANDSTORM_HOUSE_LADYS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_27",
    848,
    192,
    [
      "ROUTE_27_WEST_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_27",
    960,
    192,
    [
      "ROUTE_27_WHIRLPOOL_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Jose",
    "route_27",
    928,
    208,
    [
      "JOSE",
      "ROUTE_27_WHIRLPOOL_AREA_JOSES_GIFT",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_28_and_silver_cave_outside",
    1008,
    176,
    [
      "ROUTE_28_NORTH_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_28_and_silver_cave_outside",
    112,
    240,
    [
      "SILVER_CAVE_OUTSIDE_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Steel Wing House",
    "route_28_and_silver_cave_outside",
    720,
    176,
    [
      "ROUTE_28_STEEL_WING_HOUSE_LADYS_GIFT",
    ],
  ),
  createGroup(
    "Silver Cave",
    "route_28_and_silver_cave_outside",
    256,
    16,
    [
      "SILVER_CAVE_ROOM_1_SE_ITEM_BALL",
      "SILVER_CAVE_ROOM_1_SW_ITEM_BALL",
      "SILVER_CAVE_ROOM_1_CENTRAL_ITEM_BALL",
      "SILVER_CAVE_ROOM_1_SOUTH_HIDDEN_ITEM",
      "SILVER_CAVE_ROOM_1_NORTH_ITEM_BALL",
      "SILVER_CAVE_ROOM_1_NORTH_HIDDEN_ITEM",
      "SILVER_CAVE_ROOM_2_MAIN_AREA_HIDDEN_ITEM",
      "SILVER_CAVE_ROOM_2_MAIN_AREA_ITEM_BALL",
      "SILVER_CAVE_ROOM_2_ABOVE_SW_WATERFALL_SURF_AREA_ITEM_BALL",
      "SILVER_CAVE_ITEM_ROOMS_SW_AREA_ITEM_BALL",
      "SILVER_CAVE_ROOM_2_ABOVE_NE_WATERFALL_AREA_ITEM_BALL",
      "SILVER_CAVE_ITEM_ROOMS_NE_AREA_ITEM_BALL",
      "SILVER_CAVE_ROOM_3_DEFEATED_RED",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_29",
    768,
    32,
    [
      "ROUTE_29_ITEM_BALL",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_29",
    192,
    32,
    [
      "ROUTE_29_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Tuscany",
    "route_29",
    464,
    192,
    [
      "ROUTE_29_TUSCANYS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_30",
    128,
    560,
    [
      "ROUTE_30_CHERRYGROVE_SIDE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_30",
    224,
    144,
    [
      "ROUTE_30_CHERRYGROVE_SIDE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_30",
    176,
    80,
    [
      "ROUTE_30_CHERRYGROVE_SIDE_NORTH_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_30",
    80,
    624,
    [
      "ROUTE_30_CHERRYGROVE_SIDE_SOUTH_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Mr. Pokémon's House",
    "route_30",
    272,
    80,
    [
      "MR_POKEMONS_HOUSE_MR_POKEMONS_FREE_GIFT",
      "MR_POKEMONS_HOUSE_OAKS_GIFT",
      "MR_POKEMONS_HOUSE_MR_POKEMONS_GIFT_FOR_RED_SCALE",
    ],
  ),
  createGroup(
    "Berry House",
    "route_30",
    112,
    624,
    [
      "ROUTE_30_BERRY_HOUSE_MANS_GIFT",
    ],
  ),
  createGroup(
    "Joey",
    "route_30",
    32,
    448,
    [
      "JOEY",
      "ROUTE_30_CHERRYGROVE_SIDE_JOEYS_GIFT",
    ],
  ),
  createGroup(
    "Dark Cave",
    "route_31",
    544,
    80,
    [
      "DARK_CAVE_VIOLET_ENTRANCE_WEST_AREA_ITEM_BALL",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_HIDDEN_ITEM",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_1",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_2",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_3",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_31",
    464,
    80,
    [
      "ROUTE_31_ITEM_BALL_BY_DARK_CAVE",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_31",
    304,
    240,
    [
      "ROUTE_31_ITEM_BALL_BY_TRAINER",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_31",
    256,
    112,
    [
      "ROUTE_31_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Wade",
    "route_31",
    336,
    208,
    [
      "WADE",
      "ROUTE_31_WADES_GIFT_1",
      "ROUTE_31_WADES_GIFT_2",
      "ROUTE_31_WADES_GIFT_3",
      "ROUTE_31_WADES_GIFT_4",
    ],
  ),
  createGroup(
    "Man",
    "route_31",
    272,
    112,
    [
      "ROUTE_31_MANS_GIFT_FOR_RANDYS_MAIL",
    ],
  ),
  createGroup(
    "Man",
    "route_32",
    304,
    128,
    [
      "ROUTE_32_NORTH_AREA_MANS_GIFT",
    ],
  ),
  createGroup(
    "Roar Guy",
    "route_32",
    240,
    208,
    [
      "ROUTE_32_CUT_AREA_ROAR_GUYS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_32",
    48,
    480,
    [
      "ROUTE_32_SOUTH_AREA_ITEM_BALL_IN_NORTH_GRASS",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_32",
    176,
    640,
    [
      "ROUTE_32_SOUTH_AREA_HIDDEN_ITEM_NORTH_OF_PIER",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_32",
    496,
    144,
    [
      "ROUTE_32_SOUTH_AREA_ITEM_BALL_IN_SOUTH_GRASS",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_32",
    576,
    368,
    [
      "ROUTE_32_SOUTH_AREA_HIDDEN_ITEM_BEHIND_POKECENTER",
    ],
  ),
  createGroup(
    "Frieda",
    "route_32",
    592,
    368,
    [
      "ROUTE_32_SOUTH_AREA_FRIEDAS_GIFT",
    ],
  ),
  createGroup(
    "Pokécenter",
    "route_32",
    576,
    464,
    [
      "ROUTE_32_POKECENTER_1F_MANS_GIFT",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_33",
    224,
    256,
    [
      "ROUTE_33_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Kate",
    "route_34",
    96,
    816,
    [
      "ROUTE_34_SURF_AREA_KATES_GIFT",
    ],
  ),
  createGroup(
    "Gina",
    "route_34",
    160,
    416,
    [
      "GINA",
      "ROUTE_34_MAIN_AREA_GINAS_GIFT",
    ],
  ),
  createGroup(
    "Todd",
    "route_34",
    208,
    112,
    [
      "TODD",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_34",
    112,
    480,
    [
      "ROUTE_34_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_34",
    272,
    304,
    [
      "ROUTE_34_DAY_CARE_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_34",
    128,
    512,
    [
      "ROUTE_34_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_35",
    208,
    256,
    [
      "ROUTE_35_ITEM_BALL",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_35",
    32,
    400,
    [
      "ROUTE_35_SURF_AREA_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_36",
    112,
    64,
    [
      "ROUTE_36_WEST_AREA_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Arthur",
    "route_36",
    512,
    96,
    [
      "ROUTE_36_EAST_AREA_ARTHURS_GIFT",
    ],
  ),
  createGroup(
    "Alan",
    "route_36",
    272,
    224,
    [
      "ALAN",
      "ROUTE_36_WEST_AREA_ALANS_GIFT",
    ],
  ),
  createGroup(
    "Floria",
    "route_36",
    304,
    192,
    [
      "ROUTE_36_WEST_AREA_TALKED_TO_FLORIA",
    ],
  ),
  createGroup(
    "Rock Smash Guy",
    "route_36",
    480,
    144,
    [
      "ROUTE_36_EAST_AREA_ROCK_SMASH_GUYS_GIFT",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_37",
    208,
    80,
    [
      "ROUTE_37_LEFT_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_37",
    240,
    112,
    [
      "ROUTE_37_MIDDLE_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_37",
    256,
    80,
    [
      "ROUTE_37_RIGHT_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Sunny",
    "route_37",
    256,
    128,
    [
      "ROUTE_37_SUNNYS_GIFT",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_37",
    64,
    32,
    [
      "ROUTE_37_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_38",
    192,
    160,
    [
      "ROUTE_38_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Dana",
    "route_38",
    240,
    48,
    [
      "DANA",
      "ROUTE_38_DANAS_GIFT",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_39",
    144,
    48,
    [
      "ROUTE_39_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_39",
    80,
    208,
    [
      "ROUTE_39_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Farmhouse",
    "route_39",
    80,
    48,
    [
      "ROUTE_39_FARMHOUSE_LADYS_GIFT",
      "ROUTE_39_FARMHOUSE_SHOP",
    ],
  ),
  createGroup(
    "Derek",
    "route_39",
    160,
    352,
    [
      "DEREK",
      "ROUTE_39_DEREKS_GIFT_FOR_PIKACHU",
    ],
  ),
  createGroup(
    "Rock",
    "route_40",
    112,
    128,
    [
      "ROUTE_40_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK",
    ],
  ),
  createGroup(
    "Monica",
    "route_40",
    128,
    160,
    [
      "ROUTE_40_MONICAS_GIFT",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_41",
    144,
    560,
    [
      "ROUTE_41_SW_ISLAND_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Whirl Island",
    "route_41",
    576,
    304,
    [
      "WHIRL_ISLAND_NE_BOTTOM_LEDGE_AREA_ITEM_BALL",
      "WHIRL_ISLAND_B2F_ABOVE_WATERFALL_AREA_ITEM_BALL",
      "WHIRL_ISLAND_B1F_NORTH_AREA_EAST_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_IN_MIDDLE_OF_LEDGES",
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_NW_LADDER",
      "WHIRL_ISLAND_B1F_NORTH_AREA_WEST_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_LADDER_TO_B2F_ISOLATED_AREA",
      "WHIRL_ISLAND_B2F_ISOLATED_AREA_EAST_ITEM_BALL",
      "WHIRL_ISLAND_B2F_ISOLATED_AREA_WEST_ITEM_BALL",
      "WHIRL_ISLAND_B1F_SW_AREA_ITEM_BALL",
      "WHIRL_ISLAND_SW_ENTRANCE_EAST_AREA_ITEM_BALL",
      "WHIRL_ISLAND_B1F_SE_AREA_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_SE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_42",
    96,
    64,
    [
      "ROUTE_42_ECRUTEAK_SIDE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_42",
    528,
    128,
    [
      "ROUTE_42_MIDDLE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_42",
    256,
    176,
    [
      "ROUTE_42_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_42",
    432,
    256,
    [
      "ROUTE_42_MIDDLE_CUT_AREA_LEFT_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_42",
    448,
    256,
    [
      "ROUTE_42_MIDDLE_CUT_AREA_MIDDLE_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_42",
    464,
    256,
    [
      "ROUTE_42_MIDDLE_CUT_AREA_RIGHT_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Tully",
    "route_42",
    640,
    160,
    [
      "TULLY",
      "ROUTE_42_MAHOGANY_SIDE_TULLYS_GIFT",
    ],
  ),
  createGroup(
    "Mount Mortar West Entrance",
    "route_42",
    160,
    80,
    [
      "MOUNT_MORTAR_FRONT_WEST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_FRONT_EAST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_FRONT_MAHOGANY_SIDE_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4",
    ],
  ),
  createGroup(
    "Mount Mortar East Entrance",
    "route_42",
    736,
    112,
    [
      "MOUNT_MORTAR_FRONT_WEST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_FRONT_EAST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_FRONT_MAHOGANY_SIDE_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4",
    ],
  ),
  createGroup(
    "Mount Mortar Middle Entrance",
    "route_42",
    448,
    144,
    [
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_4",
      "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_5",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_SW_ITEM_BALL",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_SE_ITEM_BALL",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_CENTRAL_ITEM_BALL",
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_EAST_PLATEAU",
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_WEST_PLATEAU",
      "MOUNT_MORTAR_BACK_2F_SURF_AREA_NW_ITEM_BALL",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_ON_PLATEAU",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_NORTH_OF_PLATEAU",
      "MOUNT_MORTAR_B1F_NW_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_HIDDEN_ITEM",
      "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_SOUTH_OF_PLATEAU",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3",
      "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4",
      "MOUNT_MORTAR_FRONT_WEST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_FRONT_EAST_LADDER_AREA_ITEM_BALL",
      "MOUNT_MORTAR_FRONT_MAHOGANY_SIDE_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_43",
    16,
    416,
    [
      "ROUTE_43_SURF_CUT_AREA_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_43",
    192,
    512,
    [
      "ROUTE_43_ITEM_BALL",
    ],
  ),
  createGroup(
    "Gate",
    "route_43",
    272,
    560,
    [
      "ROUTE_43_GATE_GUARDS_GIFT",
    ],
  ),
  createGroup(
    "Tiffany",
    "route_43",
    144,
    400,
    [
      "TIFFANY",
      "ROUTE_43_TIFFANYS_GIFT_FOR_CLEFAIRY",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_44",
    144,
    80,
    [
      "ROUTE_44_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_44",
    224,
    144,
    [
      "ROUTE_44_ITEM_BALL_BY_MAHOGANY",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_44",
    480,
    128,
    [
      "ROUTE_44_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_44",
    720,
    64,
    [
      "ROUTE_44_ITEM_BALL_BY_ICE_PATH",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_44",
    512,
    144,
    [
      "ROUTE_44_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Wilton",
    "route_44",
    560,
    48,
    [
      "WILTON",
      "ROUTE_44_WILTONS_GIFT_1",
      "ROUTE_44_WILTONS_GIFT_2",
      "ROUTE_44_WILTONS_GIFT_3",
    ],
  ),
  createGroup(
    "Vance",
    "route_44",
    816,
    80,
    [
      "VANCE",
      "ROUTE_44_VANCES_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_45",
    96,
    320,
    [
      "ROUTE_45_ITEM_BALL_1",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_45",
    112,
    528,
    [
      "ROUTE_45_ITEM_BALL_2",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_45",
    432,
    96,
    [
      "ROUTE_45_ITEM_BALL_3",
    ],
  ),
  createGroup(
    "Item Ball",
    "route_45",
    416,
    336,
    [
      "ROUTE_45_ITEM_BALL_4",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_45",
    592,
    592,
    [
      "ROUTE_45_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Hidden Item",
    "route_45",
    544,
    560,
    [
      "ROUTE_45_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Kenji",
    "route_45",
    512,
    80,
    [
      "ROUTE_45_KENJIS_GIFT",
    ],
  ),
  createGroup(
    "Parry",
    "route_45",
    80,
    448,
    [
      "PARRY",
      "ROUTE_45_PARRYS_GIFT",
    ],
  ),
  createGroup(
    "Dark Cave",
    "route_45",
    32,
    80,
    [
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_ON_PLATEAU",
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_BY_LEDGE",
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_MANS_GIFT",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_46",
    112,
    80,
    [
      "ROUTE_46_NORTH_AREA_LEFT_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "route_46",
    128,
    96,
    ["ROUTE_46_NORTH_AREA_RIGHT_FRUIT_TREE"],
  ),
  createGroup(
    "Item Ball",
    "route_46",
    16,
    240,
    [
      "ROUTE_46_NORTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Erin",
    "route_46",
    32,
    208,
    [
      "ERIN",
      "ROUTE_46_NORTH_AREA_ERINS_GIFT",
    ],
  ),
  createGroup(
    "Dark Cave",
    "route_46",
    224,
    80,
    [
      "DARK_CAVE_VIOLET_ENTRANCE_WEST_AREA_ITEM_BALL",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_HIDDEN_ITEM",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_1",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_2",
      "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_3",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    176,
    64,
    [
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    224,
    64,
    [
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    176,
    96,
    [
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    224,
    96,
    [
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    176,
    240,
    [
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    224,
    240,
    [
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    176,
    272,
    [
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    224,
    272,
    [
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    32,
    240,
    [
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    80,
    240,
    [
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    32,
    272,
    [
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    80,
    272,
    [
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    32,
    64,
    [
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    80,
    64,
    [
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    32,
    96,
    [
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "ruins_of_alph_item_chambers",
    80,
    96,
    [
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Researcher",
    "ruins_of_alph_outside",
    176,
    240,
    [
      "RUINS_OF_ALPH_OUTSIDE_MAIN_AREA_RESEARCHERS_GIFT",
    ],
  ),
  createGroup(
    "Kabuto Chamber",
    "ruins_of_alph_outside",
    224,
    112,
    [
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SW_ITEM_BALL",
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NW_ITEM_BALL",
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NE_ITEM_BALL",
      "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Aerodactyl Chamber",
    "ruins_of_alph_outside",
    256,
    528,
    [
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SW_ITEM_BALL",
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NW_ITEM_BALL",
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NE_ITEM_BALL",
      "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Omanyte Chamber",
    "ruins_of_alph_outside",
    32,
    464,
    [
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SW_ITEM_BALL",
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NW_ITEM_BALL",
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NE_ITEM_BALL",
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Ho-Oh Chamber",
    "ruins_of_alph_outside",
    32,
    272,
    [
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SW_ITEM_BALL",
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NW_ITEM_BALL",
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NE_ITEM_BALL",
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Fighting Dojo",
    "saffron_city",
    416,
    48,
    [
      "FIGHTING_DOJO_ITEM_BALL",
    ],
  ),
  createGroup(
    "Gym",
    "saffron_city",
    544,
    48,
    [
      "SAFFRON_GYM_BADGE",
    ],
  ),
  createGroup(
    "Mart",
    "saffron_city",
    400,
    176,
    [
      "SAFFRON_MART_SHOP",
    ],
  ),
  createGroup(
    "Silph Co.",
    "saffron_city",
    288,
    336,
    [
      "SILPH_CO_1F_GUARDS_GIFT",
    ],
  ),
  createGroup(
    "Mr. Psychic's House",
    "saffron_city",
    432,
    464,
    [
      "MR_PSYCHICS_HOUSE_MR_PSYCHICS_GIFT",
    ],
  ),
  createGroup(
    "Copycat's House",
    "saffron_city",
    144,
    176,
    [
      "COPYCATS_HOUSE_2F_COPYCATS_GIFT",
    ],
  ),
  createGroup(
    "Seafoam Gym",
    "route_20",
    608,
    112,
    [
      "SEAFOAM_GYM_BADGE",
    ],
  ),
  createGroup(
    "Item Ball",
    "silver_cave",
    240,
    464,
    [
      "SILVER_CAVE_ROOM_1_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "silver_cave",
    80,
    480,
    [
      "SILVER_CAVE_ROOM_1_SW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "silver_cave",
    112,
    288,
    [
      "SILVER_CAVE_ROOM_1_CENTRAL_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "silver_cave",
    64,
    144,
    [
      "SILVER_CAVE_ROOM_1_NORTH_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "silver_cave",
    256,
    368,
    [
      "SILVER_CAVE_ROOM_1_SOUTH_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "silver_cave",
    272,
    192,
    [
      "SILVER_CAVE_ROOM_1_NORTH_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "silver_cave",
    688,
    384,
    [
      "SILVER_CAVE_ROOM_2_MAIN_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "silver_cave",
    400,
    320,
    [
      "SILVER_CAVE_ROOM_2_ABOVE_SW_WATERFALL_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "silver_cave",
    720,
    160,
    [
      "SILVER_CAVE_ROOM_2_ABOVE_NE_WATERFALL_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "silver_cave",
    560,
    496,
    [
      "SILVER_CAVE_ROOM_2_MAIN_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "West Cave",
    "silver_cave",
    544,
    336,
    [
      "SILVER_CAVE_ITEM_ROOMS_SW_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "East Cave",
    "silver_cave",
    704,
    48,
    [
      "SILVER_CAVE_ITEM_ROOMS_NE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Red",
    "silver_cave",
    976,
    160,
    [
      "SILVER_CAVE_ROOM_3_DEFEATED_RED",
    ],
  ),
  createGroup(
    "Item Ball",
    "slowpoke_well",
    160,
    48,
    [
      "SLOWPOKE_WELL_B1F_EAST_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Man",
    "slowpoke_well",
    416,
    64,
    [
      "SLOWPOKE_WELL_B2F_SURF_AREA_MANS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "slowpoke_well",
    576,
    80,
    [
      "SLOWPOKE_WELL_B2F_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Rocket Grunt",
    "slowpoke_well",
    80,
    32,
    [
      "SLOWPOKE_WELL_B1F_EAST_AREA_DEFEATED_ROCKETS",
    ],
  ),
  createGroup(
    "Item Ball",
    "sprout_tower",
    224,
    384,
    [
      "SPROUT_TOWER_1F_NORTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "sprout_tower",
    304,
    288,
    [
      "SPROUT_TOWER_2F_SW_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "sprout_tower",
    208,
    224,
    [
      "SPROUT_TOWER_3F_SW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "sprout_tower",
    336,
    16,
    [
      "SPROUT_TOWER_3F_NE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Li",
    "sprout_tower",
    272,
    32,
    [
      "SPROUT_TOWER_3F_SAGE_LIS_GIFT",
    ],
  ),
  createGroup(
    "Hidden Item",
    "olivine_port",
    16,
    256,
    [
      "OLIVINE_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "S.S. Aqua",
    "olivine_port",
    112,
    288,
    [
      "FAST_SHIP_B1F_EAST_AREA_TALKED_TO_SAILOR",
      "FAST_SHIP_CABINS_NNW_FOUGHT_SAILOR",
      "FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT",
      "VERMILION_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "vermilion_port",
    256,
    144,
    [
      "VERMILION_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "S.S. Aqua",
    "vermilion_port",
    112,
    224,
    [
      "FAST_SHIP_B1F_EAST_AREA_TALKED_TO_SAILOR",
      "FAST_SHIP_CABINS_NNW_FOUGHT_SAILOR",
      "FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT",
      "OLIVINE_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Sailor",
    "ss_aqua_decks",
    464,
    368,
    [
      "FAST_SHIP_B1F_EAST_AREA_TALKED_TO_SAILOR",
    ],
  ),
  createGroup(
    "Door",
    "ss_aqua_decks",
    304,
    128,
    [
      "FAST_SHIP_CABINS_NNW_FOUGHT_SAILOR",
    ],
  ),
  createGroup(
    "Door",
    "ss_aqua_decks",
    48,
    213,
    [
      "FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT",
    ],
  ),
  createGroup(
    "Sailor",
    "ss_aqua_cabins",
    384,
    32,
    [
      "FAST_SHIP_CABINS_NNW_FOUGHT_SAILOR",
    ],
  ),
  createGroup(
    "Girl",
    "ss_aqua_cabins",
    32,
    64,
    [
      "FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT",
    ],
  ),
  createGroup(
    "Shop",
    "team_rocket_base",
    384,
    128,
    [
      "MAHOGANY_MART_1F_SHOP_1",
    ],
  ),
  createGroup(
    "Shop",
    "team_rocket_base",
    336,
    128,
    [
      "MAHOGANY_MART_1F_SHOP_2",
    ],
  ),
  createGroup(
    "Item Ball",
    "team_rocket_base",
    432,
    96 + 224,
    [
      "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_MIDDLE_STATUE",
    ],
  ),
  createGroup(
    "Item Ball",
    "team_rocket_base",
    336,
    192 + 224,
    [
      "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_COMPUTER",
    ],
  ),
  createGroup(
    "Item Ball",
    "team_rocket_base",
    224,
    240 + 224,
    [
      "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BETWEEN_SOUTH_STATUES",
    ],
  ),
  createGroup(
    "Item Ball",
    "team_rocket_base",
    48 + 496,
    464 - 304,
    [
      "TEAM_ROCKET_BASE_B2F_WEST_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "team_rocket_base",
    272 + 496,
    640 - 304,
    [
      "TEAM_ROCKET_BASE_B3F_SE_AREA_NORTH_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "team_rocket_base",
    224 + 496,
    768 - 304,
    [
      "TEAM_ROCKET_BASE_B3F_NW_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "team_rocket_base",
    448 + 496,
    752 - 304,
    [
      "TEAM_ROCKET_BASE_B3F_SE_AREA_ITEM_BALL_BETWEEN_STAIRS",
    ],
  ),
  createGroup(
    "Item Ball",
    "team_rocket_base",
    16 + 496,
    800 - 304,
    [
      "TEAM_ROCKET_BASE_B3F_SE_AREA_LEFT_ITEM_BALL_BY_PLANTS",
    ],
  ),
  createGroup(
    "Item Ball",
    "team_rocket_base",
    48 + 496,
    800 - 304,
    [
      "TEAM_ROCKET_BASE_B3F_SE_AREA_RIGHT_ITEM_BALL_BY_PLANTS",
    ],
  ),
  createGroup(
    "Murkrow",
    "team_rocket_base",
    112 + 496,
    640 - 304,
    [
      "TEAM_ROCKET_BASE_B3F_ADMIN_AREA_GOT_MURKROWS_PASSWORD",
    ],
  ),
  createGroup(
    "Rocket Grunt",
    "team_rocket_base",
    336 + 496,
    720 - 304,
    [
      "TEAM_ROCKET_BASE_B3F_SE_AREA_GOT_FEMALE_GRUNTS_PASSWORD",
    ],
  ),
  createGroup(
    "Rocket Grunt",
    "team_rocket_base",
    80 + 496,
    848 - 304,
    [
      "TEAM_ROCKET_BASE_B3F_SE_AREA_GOT_SW_GRUNTS_PASSWORD",
    ],
  ),
  createGroup(
    "Hidden Item",
    "team_rocket_base",
    48,
    176 + 224,
    [
      "TEAM_ROCKET_BASE_B1F_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "team_rocket_base",
    416 + 496,
    416 - 304,
    [
      "TEAM_ROCKET_BASE_B2F_NORTH_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Lance",
    "team_rocket_base",
    240 + 496,
    496 - 304,
    [
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
    ],
  ),
  createGroup(
    "Sage",
    "tin_tower",
    112,
    560,
    [
      "TIN_TOWER_1F_NORTH_SAGES_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    16,
    224,
    [
      "TIN_TOWER_3F_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    464,
    704,
    [
      "TIN_TOWER_4F_CENTRAL_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    512,
    768,
    [
      "TIN_TOWER_4F_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    272,
    736,
    [
      "TIN_TOWER_4F_SW_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    384,
    416,
    [
      "TIN_TOWER_5F_NORTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    368,
    128,
    [
      "TIN_TOWER_6F_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    688,
    368,
    [
      "TIN_TOWER_8F_MIDDLE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    624,
    480,
    [
      "TIN_TOWER_8F_SOUTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    768,
    560,
    [
      "TIN_TOWER_7F_OUTER_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    656,
    16,
    [
      "TIN_TOWER_9F_NORTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "tin_tower",
    560,
    288,
    [
      "TIN_TOWER_8F_NORTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "tin_tower",
    496,
    496,
    [
      "TIN_TOWER_5F_SE_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "tin_tower",
    288,
    512,
    [
      "TIN_TOWER_5F_SW_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "tin_tower",
    416,
    640,
    [
      "TIN_TOWER_4F_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Roof",
    "tin_tower",
    624,
    144,
    [
      "TIN_TOWER_ROOF_FOUGHT_HO_OH",
    ],
  ),
  createGroup(
    "Item Ball",
    "tohjo_falls",
    32,
    96,
    [
      "TOHJO_FALLS_WEST_SURF_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Fan Club",
    "vermilion_city",
    112,
    208,
    [
      "POKEMON_FAN_CLUB_CHAIRMANS_GIFT",
      "POKEMON_FAN_CLUB_MEMBERS_GIFT",
    ],
  ),
  createGroup(
    "Gym",
    "vermilion_city",
    160,
    304,
    [
      "VERMILION_GYM_BADGE",
    ],
  ),
  createGroup(
    "Hidden Item",
    "vermilion_city",
    192,
    304,
    [
      "VERMILION_CITY_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Mart",
    "vermilion_city",
    336,
    208,
    [
      "VERMILION_MART_SHOP",
    ],
  ),
  createGroup(
    "Badge Guy",
    "vermilion_city",
    496,
    192,
    [
      "VERMILION_CITY_BADGE_GUYS_GIFT",
    ],
  ),
  createGroup(
    "Snorlax",
    "vermilion_city",
    544,
    144,
    [
      "VERMILION_CITY_WOKE_SNORLAX",
    ],
  ),
  createGroup(
    "Port",
    "vermilion_city",
    304,
    496,
    [
      "FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT",
      "VERMILION_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
      "OLIVINE_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "victory_road",
    256,
    688 - 336,
    [
      "VICTORY_ROAD_1F_RIGHT_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "victory_road",
    208,
    688 - 336,
    [
      "VICTORY_ROAD_1F_LEFT_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "victory_road",
    128,
    544 - 336,
    [
      "VICTORY_ROAD_2F_SOUTH_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "victory_road",
    304,
    400 - 336,
    [
      "VICTORY_ROAD_2F_NE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "victory_road",
    64,
    384 - 336,
    [
      "VICTORY_ROAD_2F_NW_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "victory_road",
    64,
    960 - 336,
    [
      "VICTORY_ROAD_1F_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "victory_road",
    64,
    400 - 336,
    [
      "VICTORY_ROAD_2F_NW_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Exit",
    "victory_road",
    224 + 368,
    16 + 176,
    [
      "INDIGO_PLATEAU_POKECENTER_1F_SHOP",
      "HALL_OF_FAME_ENTERED",
    ],
  ),
  createGroup(
    "Mart",
    "violet_city",
    144,
    272,
    [
      "VIOLET_MART_SHOP",
    ],
  ),
  createGroup(
    "Gym",
    "violet_city",
    288,
    272,
    [
      "VIOLET_GYM_BADGE",
      "VIOLET_GYM_FALKNERS_GIFT",
    ],
  ),
  createGroup(
    "Sprout Tower",
    "violet_city",
    368,
    80,
    [
      "SPROUT_TOWER_1F_NORTH_AREA_ITEM_BALL",
      "SPROUT_TOWER_2F_SW_AREA_ITEM_BALL",
      "SPROUT_TOWER_3F_SW_ITEM_BALL",
      "SPROUT_TOWER_3F_NE_ITEM_BALL",
      "SPROUT_TOWER_3F_SAGE_LIS_GIFT",
    ],
  ),
  createGroup(
    "Fruit Tree",
    "violet_city",
    224,
    464,
    [
      "VIOLET_CITY_FRUIT_TREE",
    ],
  ),
  createGroup(
    "Hidden Item",
    "violet_city",
    592,
    224,
    [
      "VIOLET_CITY_CUT_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Item Ball",
    "violet_city",
    560,
    80,
    [
      "VIOLET_CITY_SURF_AREA_EAST_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "violet_city",
    64,
    16,
    [
      "VIOLET_CITY_SURF_AREA_WEST_ITEM_BALL",
    ],
  ),
  createGroup(
    "Pokecenter",
    "violet_city",
    496,
    400,
    [
      "VIOLET_POKECENTER_1F_GOT_MYSTERY_EGG",
    ],
  ),
  createGroup(
    "Gym",
    "viridian_city",
    512,
    112,
    [
      "VIRIDIAN_GYM_BADGE",
    ],
  ),
  createGroup(
    "Mart",
    "viridian_city",
    464,
    304,
    [
      "VIRIDIAN_MART_SHOP",
    ],
  ),
  createGroup(
    "Dream Eater Guy",
    "viridian_city",
    96,
    368,
    [
      "VIRIDIAN_CITY_ISOLATED_AREA_DREAM_EATER_GUYS_GIFT",
    ],
  ),
  createGroup(
    "Item Ball",
    "whirl_island_b1f",
    272,
    128,
    [
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_IN_MIDDLE_OF_LEDGES",
    ],
  ),
  createGroup(
    "Item Ball",
    "whirl_island_b1f",
    112,
    208,
    [
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_NW_LADDER",
    ],
  ),
  createGroup(
    "Item Ball",
    "whirl_island_b1f",
    32,
    288,
    [
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_LADDER_TO_B2F_ISOLATED_AREA",
    ],
  ),
  createGroup(
    "Item Ball",
    "whirl_island_b1f",
    304,
    416,
    [
      "WHIRL_ISLAND_B1F_SW_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "whirl_island_b1f",
    528,
    368,
    [
      "WHIRL_ISLAND_B1F_SE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Hidden Item",
    "whirl_island_b1f",
    480,
    64,
    [
      "WHIRL_ISLAND_B1F_NORTH_AREA_EAST_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "whirl_island_b1f",
    32,
    368,
    [
      "WHIRL_ISLAND_B1F_NORTH_AREA_WEST_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Hidden Item",
    "whirl_island_b1f",
    576,
    288,
    [
      "WHIRL_ISLAND_B1F_SE_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "West Ladder",
    "whirl_island_b1f",
    208,
    432,
    [
      "WHIRL_ISLAND_B2F_ISOLATED_AREA_EAST_ITEM_BALL",
      "WHIRL_ISLAND_B2F_ISOLATED_AREA_WEST_ITEM_BALL",
    ],
  ),
  createGroup(
    "South Ladder",
    "whirl_island_b1f",
    144,
    496,
    [
      "ROUTE_41_SW_ISLAND_SURF_AREA_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_NORTH_AREA_EAST_HIDDEN_ITEM",
      "WHIRL_ISLAND_SW_ENTRANCE_EAST_AREA_ITEM_BALL",
      "WHIRL_ISLAND_B1F_SE_AREA_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_SE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "East Ladder",
    "whirl_island_b1f",
    400,
    336,
    [
      "WHIRL_ISLAND_B2F_ABOVE_WATERFALL_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "whirl_island_b2f",
    96,
    64,
    [
      "WHIRL_ISLAND_B2F_ABOVE_WATERFALL_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "whirl_island_b2f",
    160,
    176,
    [
      "WHIRL_ISLAND_B2F_ISOLATED_AREA_EAST_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "whirl_island_b2f",
    80,
    192,
    [
      "WHIRL_ISLAND_B2F_ISOLATED_AREA_WEST_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "whirl_island_entrances",
    352,
    176,
    [
      "WHIRL_ISLAND_NE_BOTTOM_LEDGE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "whirl_island_entrances",
    240,
    336,
    [
      "WHIRL_ISLAND_SW_ENTRANCE_EAST_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Exit",
    "whirl_island_entrances",
    80,
    432,
    [
      "ROUTE_41_SW_ISLAND_SURF_AREA_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "NE North Ladder",
    "whirl_island_entrances",
    448,
    48,
    [
      "WHIRL_ISLAND_B2F_ABOVE_WATERFALL_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "NE South Ladder",
    "whirl_island_entrances",
    384,
    176,
    [
      "WHIRL_ISLAND_B1F_NORTH_AREA_EAST_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_IN_MIDDLE_OF_LEDGES",
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_NW_LADDER",
      "WHIRL_ISLAND_B1F_NORTH_AREA_WEST_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_LADDER_TO_B2F_ISOLATED_AREA",
      "WHIRL_ISLAND_B2F_ISOLATED_AREA_EAST_ITEM_BALL",
      "WHIRL_ISLAND_B2F_ISOLATED_AREA_WEST_ITEM_BALL",
      "WHIRL_ISLAND_B1F_SW_AREA_ITEM_BALL",
      "ROUTE_41_SW_ISLAND_SURF_AREA_HIDDEN_ITEM",
      "WHIRL_ISLAND_SW_ENTRANCE_EAST_AREA_ITEM_BALL",
      "WHIRL_ISLAND_B1F_SE_AREA_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_SE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "SW Ladder",
    "whirl_island_entrances",
    272,
    352,
    [
      "WHIRL_ISLAND_B1F_SE_AREA_HIDDEN_ITEM",
      "WHIRL_ISLAND_B1F_SE_AREA_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "union_cave",
    64,
    32,
    [
      "UNION_CAVE_1F_ITEM_BALL_1",
    ],
  ),
  createGroup(
    "Item Ball",
    "union_cave",
    272,
    336,
    [
      "UNION_CAVE_1F_ITEM_BALL_2",
    ],
  ),
  createGroup(
    "Item Ball",
    "union_cave",
    64,
    272,
    [
      "UNION_CAVE_1F_ITEM_BALL_3",
    ],
  ),
  createGroup(
    "Item Ball",
    "union_cave",
    192,
    528,
    [
      "UNION_CAVE_1F_ITEM_BALL_4",
    ],
  ),
  createGroup(
    "Item Ball",
    "union_cave",
    368,
    256,
    [
      "UNION_CAVE_B1F_MIDDLE_AREA_WEST_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "union_cave",
    608,
    368,
    [
      "UNION_CAVE_B1F_MIDDLE_AREA_EAST_ITEM_BALL",
    ],
  ),
  createGroup(
    "Item Ball",
    "union_cave",
    928,
    32,
    [
      "UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_IN_NE_CORNER",
    ],
  ),
  createGroup(
    "Item Ball",
    "union_cave",
    864,
    304,
    [
      "UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_ON_PLATEAU",
    ],
  ),
  createGroup(
    "North Exit",
    "union_cave",
    384,
    64,
    [
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NW_ITEM_BALL",
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NE_ITEM_BALL",
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SW_ITEM_BALL",
      "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "South Exit",
    "union_cave",
    384,
    192,
    [
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NW_ITEM_BALL",
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NE_ITEM_BALL",
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SW_ITEM_BALL",
      "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SE_ITEM_BALL",
    ],
  ),
  createGroup(
    "Oak's Lab",
    "pallet_town",
    192,
    176,
    [
      "OAKS_LAB_GOT_OAKS_APPROVAL",
    ],
  ),
  createGroup(
    "Falkner",
    "violet_gym",
    80,
    16,
    [
      "VIOLET_GYM_BADGE",
      "VIOLET_GYM_FALKNERS_GIFT",
    ],
  ),
  createGroup(
    "Bugsy",
    "azalea_gym",
    80,
    112,
    [
      "AZALEA_GYM_BADGE",
      "AZALEA_GYM_BUGSYS_GIFT",
    ],
  ),
  createGroup(
    "Whitney",
    "goldenrod_gym",
    128,
    48,
    [
      "GOLDENROD_GYM_BADGE",
      "GOLDENROD_GYM_WHITNEYS_GIFT",
    ],
  ),
  createGroup(
    "Morty",
    "ecruteak_gym",
    80,
    16,
    [
      "ECRUTEAK_GYM_BADGE",
      "ECRUTEAK_GYM_MORTYS_GIFT",
    ],
  ),
  createGroup(
    "Jasmine",
    "olivine_gym",
    80,
    48,
    [
      "OLIVINE_GYM_BADGE",
      "OLIVINE_GYM_JASMINES_GIFT",
    ],
  ),
  createGroup(
    "Chuck",
    "cianwood_gym",
    64,
    16,
    [
      "CIANWOOD_GYM_BADGE",
      "CIANWOOD_GYM_STRENGTH_AREA_CHUCKS_GIFT",
    ],
  ),
  createGroup(
    "Pryce",
    "mahogany_gym",
    80,
    48,
    [
      "MAHOGANY_GYM_BADGE",
      "MAHOGANY_GYM_PRYCES_GIFT",
    ],
  ),
  createGroup(
    "Clair",
    "blackthorn_gym",
    80,
    48,
    [
      "BLACKTHORN_GYM_1F_BACK_AREA_DEFEATED_CLAIR",
    ],
  ),
  createGroup(
    "Brock",
    "pewter_gym",
    80,
    16,
    [
      "PEWTER_GYM_BADGE",
    ],
  ),
  createGroup(
    "Misty",
    "cerulean_gym",
    80,
    48,
    [
      "CERULEAN_GYM_BADGE",
    ],
  ),
  createGroup(
    "Rocket",
    "cerulean_gym",
    64,
    192,
    [
      "CERULEAN_GYM_CONFRONTED_ROCKET",
    ],
  ),
  createGroup(
    "Hidden Item",
    "cerulean_gym",
    48,
    128,
    [
      "CERULEAN_GYM_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Lt. Surge",
    "vermilion_gym",
    80,
    32,
    [
      "VERMILION_GYM_BADGE",
    ],
  ),
  createGroup(
    "Erika",
    "celadon_gym",
    80,
    48,
    [
      "CELADON_GYM_BADGE",
      "CELADON_GYM_ERIKAS_GIFT",
    ],
  ),
  createGroup(
    "Janine",
    "fuchsia_gym",
    16,
    160,
    [
      "FUCHSIA_GYM_BADGE",
      "FUCHSIA_GYM_JANINES_GIFT",
    ],
  ),
  createGroup(
    "Sabrina",
    "saffron_gym",
    144,
    128,
    [
      "SAFFRON_GYM_BADGE",
    ],
  ),
  createGroup(
    "Blaine",
    "seafoam_gym",
    80,
    32,
    [
      "SEAFOAM_GYM_BADGE",
    ],
  ),
  createGroup(
    "Blue",
    "viridian_gym",
    80,
    48,
    [
      "VIRIDIAN_GYM_BADGE",
    ],
  ),
  createGroup(
    "Shop",
    "indigo_plateau",
    176,
    112,
    [
      "INDIGO_PLATEAU_POKECENTER_1F_SHOP",
    ],
  ),
  createGroup(
    "Stairs",
    "indigo_plateau",
    224,
    48,
    [
      "HALL_OF_FAME_ENTERED",
    ],
  ),
  createGroup(
    "Exit",
    "mount_moon",
    400,
    48 + 16 + 16 + 16,
    [
      "MOUNT_MOON_GIFT_SHOP_SHOP",
      "MOUNT_MOON_SQUARE_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK",
    ],
  ),
  createGroup(
    "Power Plant",
    "route_10",
    16,
    432,
    [
      "POWER_PLANT_TALKED_TO_MANAGER",
      "POWER_PLANT_MANAGERS_GIFT",
    ],
  ),
  createGroup(
    "Underground Path",
    "route_6",
    272,
    48,
    [
      "UNDERGROUND_PATH_NORTH_HIDDEN_ITEM",
      "UNDERGROUND_PATH_SOUTH_HIDDEN_ITEM",
    ],
  ),
  createGroup(
    "Indigo Plateau",
    "route_23",
    144,
    80,
    [
      "INDIGO_PLATEAU_POKECENTER_1F_SHOP",
      "HALL_OF_FAME_ENTERED",
    ],
  ),
  createGroup(
    "Shop",
    "celadon_dept_store",
    208,
    224,
    [
      "CELADON_DEPT_STORE_2F_SHOP_1",
    ],
  ),
  createGroup(
    "Shop",
    "celadon_dept_store",
    224,
    224,
    [
      "CELADON_DEPT_STORE_2F_SHOP_2",
    ],
  ),
  createGroup(
    "Shop",
    "celadon_dept_store",
    112,
    16,
    [
      "CELADON_DEPT_STORE_3F_SHOP",
    ],
  ),
  createGroup(
    "Shop",
    "celadon_dept_store",
    480,
    368,
    [
      "CELADON_DEPT_STORE_4F_SHOP",
    ],
  ),
  createGroup(
    "Shop",
    "celadon_dept_store",
    384,
    224,
    [
      "CELADON_DEPT_STORE_5F_SHOP_1",
    ],
  ),
  createGroup(
    "Shop",
    "celadon_dept_store",
    400,
    224,
    [
      "CELADON_DEPT_STORE_5F_SHOP_2",
    ],
  ),
  createGroup(
    "Vending Machines",
    "celadon_dept_store",
    448,
    16,
    [
      "CELADON_DEPT_STORE_6F_VENDING_MACHINES",
    ],
  ),
]

const createTab = (title: string, map: typeof maps[number]["name"]) => {
  return {
    title: title,
    content: [
      {
        type: "map",
        maps: [
          map,
        ],
      },
    ],
  }
}

const createTabs = (title: string, tabs: any[]) => {
  return {
    title: title,
    content: [
      {
        type: "tabbed",
        tabs: tabs,
      },
    ],
  }
}

const tabs = [
  createTab("Overview", "map"),
  createTabs("South East Johto", [
    createTab("New Bark Town", "new_bark_town"),
    createTab("Route 29", "route_29"),
    createTab("Cherrygrove City", "cherrygrove_city"),
    createTab("Route 30", "route_30"),
    createTabs("Route 31", [
      createTab("Route", "route_31"),
      createTab("Dark Cave", "dark_cave_violet_entrance"),
    ]),
    createTabs("Violet City", [
      createTab("City", "violet_city"),
      createTab("Gym", "violet_gym"),
      createTab("Sprout Tower", "sprout_tower"),
    ]),
    createTab("Route 36", "route_36"),
    createTabs("Ruins of Alph", [
      createTab("Outside", "ruins_of_alph_outside"),
      createTab("Item Chambers", "ruins_of_alph_item_chambers"),
    ]),
    createTab("Route 32", "route_32"),
    createTab("Union Cave", "union_cave"),
    createTab("Route 33", "route_33"),
    createTabs("Azalea Town", [
      createTab("Town", "azalea_town"),
      createTab("Gym", "azalea_gym"),
      createTab("Slowpoke Well", "slowpoke_well"),
    ]),
  ]),
  createTabs("South West Johto", [
    createTab("Ilex Forest", "ilex_forest"),
    createTab("Route 34", "route_34"),
    createTabs("Goldenrod City", [
      createTab("City", "goldenrod_city"),
      createTab("Gym", "goldenrod_gym"),
      createTab("Dept. Store", "goldenrod_dept_store"),
      createTab("Radio Tower", "radio_tower"),
      createTab("Underground", "goldenrod_underground"),
      createTab("Warehouse", "goldenrod_underground_warehouse"),
    ]),
    createTab("Route 35", "route_35"),
    createTab("National Park", "national_park"),
  ]),
  createTabs("North West Johto", [
    createTab("Route 37", "route_37"),
    createTabs("Ecruteak City", [
      createTab("City", "ecruteak_city"),
      createTab("Gym", "ecruteak_gym"),
      createTab("Burned Tower", "burned_tower"),
      createTab("Tin Tower", "tin_tower"),
    ]),
    createTab("Route 38", "route_38"),
    createTab("Route 39", "route_39"),
    createTabs("Olivine City", [
      createTab("City", "olivine_city"),
      createTab("Gym", "olivine_gym"),
      createTab("Lighthouse", "olivine_lighthouse"),
      createTab("Port", "olivine_port"),
      createTabs("S.S. Aqua", [
        createTab("Decks", "ss_aqua_decks"),
        createTab("Cabins", "ss_aqua_cabins"),
      ]),
    ]),
    createTab("Route 40", "route_40"),
    createTabs("Route 41", [
      createTab("Route", "route_41"),
      createTabs("Whirl Islands", [
        createTab("Entrances", "whirl_island_entrances"),
        createTab("B1F", "whirl_island_b1f"),
        createTab("B2F", "whirl_island_b2f"),
      ]),
    ]),
    createTabs("Cianwood City", [
      createTab("City", "cianwood_city"),
      createTab("Gym", "cianwood_gym"),
    ]),
    createTabs("Route 42", [
      createTab("Route", "route_42"),
      createTabs("Mount Mortar", [
        createTab("Front", "mount_mortar_front"),
        createTab("Back 1F", "mount_mortar_back_1f"),
        createTab("Back 2F", "mount_mortar_back_2f"),
        createTab("B1F", "mount_mortar_b1f"),
      ]),
    ]),
    createTabs("Mahogany Town", [
      createTab("Town", "mahogany_town"),
      createTab("Gym", "mahogany_gym"),
      createTab("Rocket Base", "team_rocket_base"),
    ]),
    createTab("Route 43", "route_43"),
    createTab("Lake of Rage", "lake_of_rage"),
  ]),
  createTabs("North East Johto", [
    createTab("Route 44", "route_44"),
    createTabs("Ice Path", [
      createTab("1F", "ice_path_1f"),
      createTab("B1F - B3F", "ice_path_b1f_b2f_b3f"),
    ]),
    createTabs("Blackthorn City", [
      createTab("City", "blackthorn_city"),
      createTab("Gym", "blackthorn_gym"),
      createTab("Dragon's Den", "dragons_den"),
    ]),
    createTabs("Route 45", [
      createTab("Route", "route_45"),
      createTab("Dark Cave", "dark_cave_blackthorn_entrance"),
    ]),
    createTabs("Route 46", [
      createTab("Route", "route_46"),
      createTab("Dark Cave", "dark_cave_violet_entrance"),
    ]),
  ]),
  createTabs("Victory Road", [
    createTabs("Route 27", [
      createTab("Route", "route_27"),
      createTab("Tohjo Falls", "tohjo_falls"),
    ]),
    createTab("Route 26", "route_26"),
    createTab("Victory Road", "victory_road"),
    createTab("Route 23", "route_23"),
    createTab("Indigo Plateau", "indigo_plateau"),
    createTab("Route 28", "route_28_and_silver_cave_outside"),
    createTab("Silver Cave", "silver_cave"),
  ]),
  createTabs("Central Kanto", [
    createTabs("Vermilion City", [
      createTab("City", "vermilion_city"),
      createTab("Gym", "vermilion_gym"),
      createTab("Port", "vermilion_port"),
      createTabs("S.S. Aqua", [
        createTab("Decks", "ss_aqua_decks"),
        createTab("Cabins", "ss_aqua_cabins"),
      ]),
      createTab("Diglett's Cave", "digletts_cave"),
    ]),
    createTabs("Routes 5 - 7", [
      createTabs("5", [
        createTab("Route", "route_5"),
        createTab("Underground Path", "underground_path"),
      ]),
      createTabs("6", [
        createTab("Route", "route_6"),
        createTab("Underground Path", "underground_path"),
      ]),
      createTab("7", "route_7"),
    ]),
    createTabs("Saffron City", [
      createTab("City", "saffron_city"),
      createTab("Gym", "saffron_gym"),
    ]),
    createTabs("Cerulean City", [
      createTab("City", "cerulean_city"),
      createTab("Gym", "cerulean_gym"),
    ]),
    createTabs("Route 24 + 25", [
      createTab("24", "route_24"),
      createTab("25", "route_25"),
    ]),
    createTabs("Celadon City", [
      createTab("City", "celadon_city"),
      createTab("Gym", "celadon_gym"),
      createTab("Dept. Store", "celadon_dept_store"),
    ]),
    createTabs("Routes 16 - 18", [
      createTab("Route 16", "route_16"),
      createTab("Route 17", "route_17"),
      createTab("Route 18", "route_18"),
    ]),
    createTabs("Fuchsia City", [
      createTab("City", "fuchsia_city"),
      createTab("Gym", "fuchsia_gym"),
    ]),
  ]),
  createTabs("East Kanto", [
    createTab("Route 8", "route_8"),
    createTab("Lavender Town", "lavender_town"),
    createTab("Rock Tunnel", "rock_tunnel"),
    createTabs("Routes 9 + 10", [
      createTab("9", "route_9"),
      createTabs("10", [
        createTab("Route", "route_10"),
        createTab("Power Plant", "power_plant"),
      ]),
    ]),
    createTabs("Routes 11 - 15", [
      createTab("11", "route_11"),
      createTab("12", "route_12"),
      createTab("13", "route_13"),
      createTab("14", "route_14"),
      createTab("15", "route_15"),
    ]),
  ]),
  createTabs("West Kanto", [
    createTabs("Route 2", [
      createTab("Route", "route_2"),
      createTab("Diglett's Cave", "digletts_cave"),
    ]),
    createTabs("Pewter City", [
      createTab("City", "pewter_city"),
      createTab("Gym", "pewter_gym"),
    ]),
    createTab("Route 3", "route_3"),
    createTabs("Mount Moon", [
      createTab("Cave", "mount_moon"),
      createTab("Square", "mount_moon_square"),
    ]),
    createTab("Route 4", "route_4"),
    createTabs("Viridian City", [
      createTab("City", "viridian_city"),
      createTab("Gym", "viridian_gym"),
    ]),
    createTab("Route 1", "route_1"),
    createTab("Pallet Town", "pallet_town"),
    createTab("Cinnabar Island", "cinnabar_island"),
    createTabs("Routes 19 - 21", [
      createTab("19", "route_19"),
      createTabs("20", [
        createTab("Route", "route_20"),
        createTab("Gym", "seafoam_gym"),
      ]),
      createTab("21", "route_21"),
      createTab("22", "route_22"),
    ]),
  ]),
]

const tabbedLayout = {
  tabbed_maps: {
    type: "tabbed",
    tabs: tabs,
  },
}

const rulesets = [
  "vanilla",
  "classic_kir",
  "classic_extreme_kir",
  "classic_fir",
  "classic_extreme_fir",
  "classic_crazy_fir",
  "classic_max",
  "maximum_plus",
]

const dataPath: string = process.env.gameDataInputPath!

const ruleLuas = rulesets.map((name) => {
  const data = yaml.parse(fs.readFileSync(`${dataPath}/${name}.data.yml`, "utf8"))
  const allItemLocations = data.allItemLocations as GeneralItemLocation[]
  
  const accessRequirements: string[] = allItemLocations.flatMap((location) => {
    return location.accessOptions.flat().filter((requirement) => {
      return typeof requirement === "string"
    })
  })
  
  return {
    name: name,
    logicalAccessRules: allItemLocations.reduce((result, location) => {
      const options = location.accessOptions.reduce((result, option) => {
        const requirementsList = option.reduce((result, requirement) => {
          const requirementFormat = isNumber(requirement) ? `${requirement}` : isObject(requirement) ? `{ item = "${requirement.item}", number = ${requirement.number} }` : `"${requirement}"`
          return `${result}\n      ${requirementFormat},`
        }, "{") + "\n    },"
        return `${result}\n    ${requirementsList}`
      }, "{") + "\n  },"
      const locationId = location.id.includes("{") ? JSON.parse(location.id).groupId ?? JSON.parse(location.id).shopId : location.id
      return `${result}\n  ${locationId} = ${options}`
    }, name.toUpperCase() + "_LOGICAL_ACCESS_RULES = {") + "\n}",
    strictAccessRules: allItemLocations.reduce((result, location) => {
      const options = location.strictAccessOptions.reduce((result, option) => {
        const requirementsList = option.reduce((result, requirement) => {
          const requirementFormat = isNumber(requirement) ? `${requirement}` : isObject(requirement) ? `{ item = "${requirement.item}", number = ${requirement.number} }` : `"${requirement}"`
          return `${result}\n      ${requirementFormat},`
        }, "{") + "\n    },"
        return `${result}\n    ${requirementsList}`
      }, "{") + "\n  },"
      const locationId = location.id.includes("{") ? JSON.parse(location.id).groupId ?? JSON.parse(location.id).shopId : location.id
      return `${result}\n  ${locationId} = ${options}`
    }, name.toUpperCase() + "_STRICT_ACCESS_RULES = {") + "\n}",
    visibilityRules: allItemLocations.reduce((result, location) => {
      const locationId = location.id.includes("{") ? JSON.parse(location.id).groupId ?? JSON.parse(location.id).shopId : location.id
      
      const isLocationShuffledAndAccessible = (locationId: string) => {
        const location = allItemLocations.find((location) => { return location.id === locationId })!
        return location.shuffleGroupIndex !== -1 && !location.accessOptions.some((option) => { return option.includes("INACCESSIBLE") })
      }
      
      const shouldBeVisible = name === "vanilla" ? true : location.type === "EVENT"
        && accessRequirements.includes(location.id)
        && (
          location.id !== "ROUTE_35_GOLDENROD_GATE_GOT_KENYA"
          || isLocationShuffledAndAccessible("ROUTE_31_MANS_GIFT_FOR_RANDYS_MAIL")
        )
        && (
          location.id !== "ELMS_LAB_GAVE_MYSTERY_EGG"
          || isLocationShuffledAndAccessible("ELMS_LAB_AIDES_GIFT_FOR_MYSTERY_EGG")
        )
        && (
          location.id !== "TIN_TOWER_ROOF_FOUGHT_HO_OH"
          || !name.includes("kir")
        )
        || location.id === "SILVER_CAVE_ROOM_3_DEFEATED_RED"
        || isLocationShuffledAndAccessible(location.id)
        || accessRequirements.includes(location.itemId!)
        && !location.accessOptions.some((option) => { return option.includes("INACCESSIBLE") })
        && (
          !(holdableItemIds as readonly ItemId[]).includes(location.itemId!)
          || location.id === "ROUTE_36_EAST_AREA_ROCK_SMASH_GUYS_GIFT"
          || location.id === "VIOLET_MART_SHOP"
          && !name.includes("kir")
          || location.id === "GOLDENROD_DEPT_STORE_4F_SHOP"
          && !name.includes("kir")
        )
        && (
          location.id !== "AZALEA_TOWN_KURTS_GIFT_FOR_GS_BALL"
          || name.includes("plus")
        )
        
      return `${result}\n  ${locationId} = ${shouldBeVisible},`
    }, name.toUpperCase() + "_VISIBILITY_RULES = {") + "\n}",
  }
})

const itemsLua = trackedItemIds.reduce((result, itemId) => {
  return `${result}\n [${itemsMap[itemId]?.numericId}] = "${itemId}",`
}, "ITEMS_MAP = {") + "\n}\n\nREVERSE_ITEMS_MAP = {}\nfor key, value in pairs(ITEMS_MAP) do\n    REVERSE_ITEMS_MAP[value] = key\nend"

const locationNames = itemLocationSections.filter((location) => {
  return !Object.values(eventInfo).some((event) => {
    return "name" in event && event.name === location.name
  }) && !Object.values(phoneCalls).some((phoneCall) => {
    return (location.name as string).includes(phoneCall.name + " - ")
  })
}).reduce((result, location) => {
  return `${result}\n  "${location.name}",`
}, "LOCATION_NAMES = {") + "\n}"

const consumableItemNumbers = itemIds.reduce((result, itemId) => {
  if ((holdableItemIds as readonly ItemId[]).includes(itemId)) {
    return `${result}\n  [${itemsMap[itemId].numericId}] = true,`
  } else {
    return result
  }
}, "CONSUMABLE_ITEM_IDS = {") + "\n}"

const specificLocationGroupsGroups = specificLocationGroups.reduce((result, group) => {
  result[group.map_locations[0].map] = {
    name: group.map_locations[0].map,
    children: [
      ...result[group.map_locations[0].map]?.children ?? [],
      group,
    ],
  }
  
  return result
}, {} as any)

const mapIds: Partial<Record<GameMapId, typeof maps[number]["name"]>> = {
  PLAYERS_HOUSE_2F: "new_bark_town",
  ROUTE_38: "route_38",
  ROUTE_39: "route_39",
  OLIVINE_CITY: "olivine_city",
  MAHOGANY_POKECENTER_1F: "mahogany_town",
  ROUTE_42: "route_42",
  ROUTE_44: "route_44",
  MAHOGANY_TOWN: "mahogany_town",
  SPROUT_TOWER_1F: "sprout_tower",
  SPROUT_TOWER_2F: "sprout_tower",
  SPROUT_TOWER_3F: "sprout_tower",
  TIN_TOWER_1F: "tin_tower",
  TIN_TOWER_2F: "tin_tower",
  TIN_TOWER_3F: "tin_tower",
  TIN_TOWER_4F: "tin_tower",
  TIN_TOWER_5F: "tin_tower",
  TIN_TOWER_6F: "tin_tower",
  TIN_TOWER_7F: "tin_tower",
  TIN_TOWER_8F: "tin_tower",
  TIN_TOWER_9F: "tin_tower",
  BURNED_TOWER_1F: "burned_tower",
  BURNED_TOWER_B1F: "burned_tower",
  NATIONAL_PARK: "national_park",
  NATIONAL_PARK_BUG_CONTEST: "national_park",
  RADIO_TOWER_1F: "radio_tower",
  RADIO_TOWER_2F: "radio_tower",
  RADIO_TOWER_3F: "radio_tower",
  RADIO_TOWER_4F: "radio_tower",
  RADIO_TOWER_5F: "radio_tower",
  RUINS_OF_ALPH_OUTSIDE: "ruins_of_alph_outside",
  RUINS_OF_ALPH_HO_OH_ITEM_ROOM: "ruins_of_alph_item_chambers",
  RUINS_OF_ALPH_KABUTO_ITEM_ROOM: "ruins_of_alph_item_chambers",
  RUINS_OF_ALPH_OMANYTE_ITEM_ROOM: "ruins_of_alph_item_chambers",
  RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM: "ruins_of_alph_item_chambers",
  UNION_CAVE_1F: "union_cave",
  UNION_CAVE_B1F: "union_cave",
  UNION_CAVE_B2F: "union_cave",
  SLOWPOKE_WELL_B1F: "slowpoke_well",
  SLOWPOKE_WELL_B2F: "slowpoke_well",
  OLIVINE_LIGHTHOUSE_1F: "olivine_lighthouse",
  OLIVINE_LIGHTHOUSE_2F: "olivine_lighthouse",
  OLIVINE_LIGHTHOUSE_3F: "olivine_lighthouse",
  OLIVINE_LIGHTHOUSE_4F: "olivine_lighthouse",
  OLIVINE_LIGHTHOUSE_5F: "olivine_lighthouse",
  OLIVINE_LIGHTHOUSE_6F: "olivine_lighthouse",
  MAHOGANY_MART_1F: "mahogany_town",
  TEAM_ROCKET_BASE_B1F: "team_rocket_base",
  TEAM_ROCKET_BASE_B2F: "team_rocket_base",
  TEAM_ROCKET_BASE_B3F: "team_rocket_base",
  ILEX_FOREST: "ilex_forest",
  GOLDENROD_UNDERGROUND: "goldenrod_underground",
  GOLDENROD_UNDERGROUND_SWITCH_ROOM: "goldenrod_underground_warehouse",
  GOLDENROD_DEPT_STORE_B1F: "goldenrod_dept_store",
  GOLDENROD_UNDERGROUND_WAREHOUSE: "goldenrod_underground_warehouse",
  MOUNT_MORTAR_FRONT: "mount_mortar_front",
  MOUNT_MORTAR_BACK_1F: "mount_mortar_back_1f",
  MOUNT_MORTAR_BACK_2F: "mount_mortar_back_2f",
  MOUNT_MORTAR_B1F: "mount_mortar_b1f",
  ICE_PATH_1F: "ice_path_1f",
  ICE_PATH_B1F: "ice_path_b1f_b2f_b3f",
  ICE_PATH_B2F_MAHOGANY_SIDE: "ice_path_b1f_b2f_b3f",
  ICE_PATH_B2F_BLACKTHORN_SIDE: "ice_path_b1f_b2f_b3f",
  ICE_PATH_B3F: "ice_path_b1f_b2f_b3f",
  WHIRL_ISLAND_NW: "whirl_island_entrances",
  WHIRL_ISLAND_NE: "whirl_island_entrances",
  WHIRL_ISLAND_SW: "whirl_island_entrances",
  WHIRL_ISLAND_SE: "whirl_island_entrances",
  WHIRL_ISLAND_B1F: "whirl_island_b1f",
  WHIRL_ISLAND_B2F: "whirl_island_b2f",
  SILVER_CAVE_ROOM_1: "silver_cave",
  SILVER_CAVE_ROOM_2: "silver_cave",
  SILVER_CAVE_ROOM_3: "silver_cave",
  SILVER_CAVE_ITEM_ROOMS: "silver_cave",
  DARK_CAVE_VIOLET_ENTRANCE: "dark_cave_violet_entrance",
  DARK_CAVE_BLACKTHORN_ENTRANCE: "dark_cave_blackthorn_entrance",
  DRAGONS_DEN_1F: "dragons_den",
  DRAGONS_DEN_B1F: "dragons_den",
  TOHJO_FALLS: "tohjo_falls",
  DIGLETTS_CAVE: "digletts_cave",
  UNDERGROUND_PATH: "underground_path",
  ROCK_TUNNEL_1F: "rock_tunnel",
  ROCK_TUNNEL_B1F: "rock_tunnel",
  VICTORY_ROAD: "victory_road",
  ECRUTEAK_CITY: "ecruteak_city",
  ROUTE_45: "route_45",
  ROUTE_46: "route_46",
  BLACKTHORN_CITY: "blackthorn_city",
  ROUTE_20: "route_20",
  CINNABAR_ISLAND: "cinnabar_island",
  POWER_PLANT: "power_plant",
  ROUTE_4: "route_4",
  ROUTE_9: "route_9",
  ROUTE_25: "route_25",
  CERULEAN_CITY: "cerulean_city",
  ROUTE_33: "route_33",
  AZALEA_TOWN: "azalea_town",
  ROUTE_43: "route_43",
  LAKE_OF_RAGE: "lake_of_rage",
  ROUTE_32: "route_32",
  ROUTE_35: "route_35",
  ROUTE_36: "route_36",
  ROUTE_37: "route_37",
  VIOLET_CITY: "violet_city",
  ROUTE_34: "route_34",
  GOLDENROD_CITY: "goldenrod_city",
  GOLDENROD_DEPT_STORE_1F: "goldenrod_dept_store",
  GOLDENROD_DEPT_STORE_2F: "goldenrod_dept_store",
  GOLDENROD_DEPT_STORE_3F: "goldenrod_dept_store",
  GOLDENROD_DEPT_STORE_4F: "goldenrod_dept_store",
  GOLDENROD_DEPT_STORE_5F: "goldenrod_dept_store",
  GOLDENROD_DEPT_STORE_6F: "goldenrod_dept_store",
  GOLDENROD_DEPT_STORE_ROOF: "goldenrod_dept_store",
  ROUTE_11: "route_11",
  VERMILION_CITY: "vermilion_city",
  ROUTE_1: "route_1",
  PEWTER_CITY: "pewter_city",
  OLIVINE_PORT: "olivine_port",
  VERMILION_PORT: "vermilion_port",
  FAST_SHIP_1F: "ss_aqua_decks",
  FAST_SHIP_CABINS_NNW_NNE_NE: "ss_aqua_cabins",
  FAST_SHIP_CABINS_SW_SSW_NW: "ss_aqua_cabins",
  FAST_SHIP_CABINS_SE_SSE_CAPTAINS_CABIN: "ss_aqua_cabins",
  FAST_SHIP_B1F: "ss_aqua_decks",
  MOUNT_MOON_SQUARE: "mount_moon_square",
  TIN_TOWER_ROOF: "tin_tower",
  ROUTE_13: "route_13",
  ROUTE_15: "route_15",
  FUCHSIA_CITY: "fuchsia_city",
  ROUTE_8: "route_8",
  ROUTE_12: "route_12",
  LAVENDER_TOWN: "lavender_town",
  ROUTE_28: "route_28_and_silver_cave_outside",
  SILVER_CAVE_OUTSIDE: "route_28_and_silver_cave_outside",
  ROUTE_17: "route_17",
  CELADON_CITY: "celadon_city",
  ROUTE_40: "route_40",
  ROUTE_41: "route_41",
  CIANWOOD_CITY: "cianwood_city",
  ROUTE_2: "route_2",
  VIRIDIAN_CITY: "viridian_city",
  ROUTE_26: "route_26",
  ROUTE_27: "route_27",
  ROUTE_29: "route_29",
  NEW_BARK_TOWN: "new_bark_town",
  ROUTE_5: "route_5",
  SAFFRON_CITY: "saffron_city",
  ROUTE_30: "route_30",
  ROUTE_31: "route_31",
  CHERRYGROVE_CITY: "cherrygrove_city",
  PALLET_TOWN: "pallet_town",
  AZALEA_GYM: "azalea_gym",
  PEWTER_GYM: "pewter_gym",
  VIOLET_GYM: "violet_gym",
  CELADON_GYM: "celadon_gym",
  FUCHSIA_GYM: "fuchsia_gym",
  OLIVINE_GYM: "olivine_gym",
  SAFFRON_GYM: "saffron_gym",
  SEAFOAM_GYM: "seafoam_gym",
  CERULEAN_GYM: "cerulean_gym",
  CIANWOOD_GYM: "cianwood_gym",
  ECRUTEAK_GYM: "ecruteak_gym",
  MAHOGANY_GYM: "mahogany_gym",
  VIRIDIAN_GYM: "viridian_gym",
  GOLDENROD_GYM: "goldenrod_gym",
  VERMILION_GYM: "vermilion_gym",
  BLACKTHORN_GYM_1F: "blackthorn_gym",
  BLACKTHORN_GYM_2F: "blackthorn_gym",
  MOUNT_MOON: "mount_moon",
  ROUTE_10_NORTH: "route_10",
  ROUTE_10_SOUTH: "lavender_town",
  ROUTE_3: "route_3",
  ROUTE_6: "route_6",
  ROUTE_7: "route_7",
  ROUTE_14: "route_14",
  ROUTE_16: "route_16",
  ROUTE_18: "route_18",
  ROUTE_19: "route_19",
  ROUTE_21: "route_21",
  ROUTE_22: "route_22",
  ROUTE_23: "route_23",
  ROUTE_24: "route_24",
  CELADON_DEPT_STORE_1F: "celadon_dept_store",
  CELADON_DEPT_STORE_2F: "celadon_dept_store",
  CELADON_DEPT_STORE_3F: "celadon_dept_store",
  CELADON_DEPT_STORE_4F: "celadon_dept_store",
  CELADON_DEPT_STORE_5F: "celadon_dept_store",
  CELADON_DEPT_STORE_6F: "celadon_dept_store",
  INDIGO_PLATEAU_POKECENTER_1F: "indigo_plateau",
}

const getMapPath = (map: string, tabs: any[], currentPath: string[]): string[] | undefined => {
  let result = undefined
  for (const tab of tabs) {
    if (isNotNullish(result)) {
      break
    }
    
    if (tab.content[0].type === "map") {
      if (tab.content[0].maps[0] === map) {
        return [
          ...currentPath,
          tab.title,
          tab.content[0].maps[0],
        ]
      }
    } else {
      result = getMapPath(map, tab.content[0].tabs, [
        ...currentPath,
        tab.title,
      ])
    }
  }
  
  return result
}

const mapIdsCode = Object.entries(Object.entries(mapIds).reduce((result, [gameMapId, map]) => {
  result[gameMapGroupsMap[gameMapsMap[gameMapId as GameMapId].mapGroup].numericId] = {
    ...result[gameMapGroupsMap[gameMapsMap[gameMapId as GameMapId].mapGroup].numericId],
    [gameMapsMap[gameMapId as GameMapId].numericId]: getMapPath(map, tabs, [])!,
  }
  
  return result
}, {} as Record<number, Record<number, string[]>>)).reduce((result, [groupId, group]) => {
  const inner = Object.entries(group).map(([mapId, mapPath]) => {
    return `[${mapId}] = { ${mapPath?.map((string) => { return `"${string}"` }).join(", ")} },`
  }).join("\n    ")
  return `${result}\n  [${groupId}] = {\n    ${inner}\n  },`
}, "MAPS = {") + "\n}"

const shopLocationIds = [
  {
    name: "Goldenrod Dept. Store - 6F - Vending Machines - Item 1",
    numericId: 906,
  },
  {
    name: "Goldenrod Dept. Store - 6F - Vending Machines - Item 2",
    numericId: 907,
  },
  {
    name: "Goldenrod Dept. Store - 6F - Vending Machines - Item 3",
    numericId: 908,
  },
  {
    name: "Celadon Dept. Store - 6F - Vending Machines - Item 1",
    numericId: 909,
  },
  {
    name: "Celadon Dept. Store - 6F - Vending Machines - Item 2",
    numericId: 910,
  },
  {
    name: "Celadon Dept. Store - 6F - Vending Machines - Item 3",
    numericId: 911,
  },
  {
    name: "Route 39 - Farmhouse - Shop",
    numericId: 921,
  },
  {
    name: "Mahogany Town - Street Vendor",
    numericId: 922,
  },
  {
    name: "Goldenrod Game Corner - Item Shop - Item 1",
    numericId: 900,
  },
  {
    name: "Goldenrod Game Corner - Item Shop - Item 2",
    numericId: 901,
  },
  {
    name: "Goldenrod Game Corner - Item Shop - Item 3",
    numericId: 902,
  },
  {
    name: "Celadon Game Corner - Item Shop - Item 1",
    numericId: 903,
  },
  {
    name: "Celadon Game Corner - Item Shop - Item 2",
    numericId: 904,
  },
  {
    name: "Celadon Game Corner - Item Shop - Item 3",
    numericId: 905,
  },
  {
    name: "Radio Tower - 2F - Blue Card Shop - Item 1",
    numericId: 912,
  },
  {
    name: "Radio Tower - 2F - Blue Card Shop - Item 2",
    numericId: 913,
  },
  {
    name: "Radio Tower - 2F - Blue Card Shop - Item 3",
    numericId: 914,
  },
  {
    name: "Radio Tower - 2F - Blue Card Shop - Item 4",
    numericId: 915,
  },
  {
    name: "Radio Tower - 2F - Blue Card Shop - Item 5",
    numericId: 916,
  },
  {
    name: "Radio Tower - 2F - Blue Card Shop - Item 6",
    numericId: 917,
  },
  {
    name: "Radio Tower - 2F - Blue Card Shop - Item 7",
    numericId: 918,
  },
  {
    name: "Radio Tower - 2F - Blue Card Shop - Item 8",
    numericId: 919,
  },
  {
    name: "Radio Tower - 2F - Blue Card Shop - Item 9",
    numericId: 920,
  },
  {
    name: "Cherrygrove Mart - Shop - Item 1",
    numericId: 261,
  },
  {
    name: "Cherrygrove Mart - Shop - Item 2",
    numericId: 262,
  },
  {
    name: "Cherrygrove Mart - Shop - Item 3",
    numericId: 263,
  },
  {
    name: "Cherrygrove Mart - Shop - Item 4",
    numericId: 264,
  },
  {
    name: "Cherrygrove Mart - Shop - Item 5",
    numericId: 265,
  },
  {
    name: "Cherrygrove Mart - Shop - Item 6",
    numericId: 266,
  },
  {
    name: "Violet Mart - Shop - Item 1",
    numericId: 267,
  },
  {
    name: "Violet Mart - Shop - Item 2",
    numericId: 268,
  },
  {
    name: "Violet Mart - Shop - Item 3",
    numericId: 269,
  },
  {
    name: "Violet Mart - Shop - Item 4",
    numericId: 270,
  },
  {
    name: "Violet Mart - Shop - Item 5",
    numericId: 271,
  },
  {
    name: "Violet Mart - Shop - Item 6",
    numericId: 272,
  },
  {
    name: "Violet Mart - Shop - Item 7",
    numericId: 273,
  },
  {
    name: "Violet Mart - Shop - Item 8",
    numericId: 274,
  },
  {
    name: "Violet Mart - Shop - Item 9",
    numericId: 275,
  },
  {
    name: "Violet Mart - Shop - Item 10",
    numericId: 276,
  },
  {
    name: "Violet Mart - Shop - Item 11",
    numericId: 277,
  },
  {
    name: "Azalea Mart - Shop - Item 1",
    numericId: 278,
  },
  {
    name: "Azalea Mart - Shop - Item 2",
    numericId: 279,
  },
  {
    name: "Azalea Mart - Shop - Item 3",
    numericId: 280,
  },
  {
    name: "Azalea Mart - Shop - Item 4",
    numericId: 281,
  },
  {
    name: "Azalea Mart - Shop - Item 5",
    numericId: 282,
  },
  {
    name: "Azalea Mart - Shop - Item 6",
    numericId: 283,
  },
  {
    name: "Azalea Mart - Shop - Item 7",
    numericId: 284,
  },
  {
    name: "Azalea Mart - Shop - Item 8",
    numericId: 285,
  },
  {
    name: "Azalea Mart - Shop - Item 9",
    numericId: 286,
  },
  {
    name: "Cianwood Pharmacy - Shop - Item 1",
    numericId: 287,
  },
  {
    name: "Cianwood Pharmacy - Shop - Item 2",
    numericId: 288,
  },
  {
    name: "Cianwood Pharmacy - Shop - Item 3",
    numericId: 289,
  },
  {
    name: "Cianwood Pharmacy - Shop - Item 4",
    numericId: 290,
  },
  {
    name: "Cianwood Pharmacy - Shop - Item 5",
    numericId: 291,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 1 - Item 1",
    numericId: 292,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 1 - Item 2",
    numericId: 293,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 1 - Item 3",
    numericId: 294,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 1 - Item 4",
    numericId: 295,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 1 - Item 5",
    numericId: 296,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 1 - Item 6",
    numericId: 297,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 1 - Item 7",
    numericId: 298,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 2 - Item 1",
    numericId: 299,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 2 - Item 2",
    numericId: 300,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 2 - Item 3",
    numericId: 301,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 2 - Item 4",
    numericId: 302,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 2 - Item 5",
    numericId: 303,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 2 - Item 6",
    numericId: 304,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 2 - Item 7",
    numericId: 305,
  },
  {
    name: "Goldenrod Dept. Store - 2F - Shop 2 - Item 8",
    numericId: 306,
  },
  {
    name: "Goldenrod Dept. Store - 3F - Shop - Item 1",
    numericId: 307,
  },
  {
    name: "Goldenrod Dept. Store - 3F - Shop - Item 2",
    numericId: 308,
  },
  {
    name: "Goldenrod Dept. Store - 3F - Shop - Item 3",
    numericId: 309,
  },
  {
    name: "Goldenrod Dept. Store - 3F - Shop - Item 4",
    numericId: 310,
  },
  {
    name: "Goldenrod Dept. Store - 3F - Shop - Item 5",
    numericId: 311,
  },
  {
    name: "Goldenrod Dept. Store - 3F - Shop - Item 6",
    numericId: 312,
  },
  {
    name: "Goldenrod Dept. Store - 3F - Shop - Item 7",
    numericId: 313,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 1",
    numericId: 314,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 2",
    numericId: 315,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 3",
    numericId: 316,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 4",
    numericId: 317,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 5",
    numericId: 318,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 6",
    numericId: 319,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 7",
    numericId: 320,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 8",
    numericId: 321,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 9",
    numericId: 322,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 10",
    numericId: 323,
  },
  {
    name: "Goldenrod Dept. Store - 4F - Shop - Item 11",
    numericId: 324,
  },
  {
    name: "Goldenrod Dept. Store - 5F - Shop - Item 1",
    numericId: 325,
  },
  {
    name: "Goldenrod Dept. Store - 5F - Shop - Item 2",
    numericId: 326,
  },
  {
    name: "Goldenrod Dept. Store - 5F - Shop - Item 3",
    numericId: 327,
  },
  {
    name: "Goldenrod Dept. Store - 5F - Shop - Item 4",
    numericId: 328,
  },
  {
    name: "Goldenrod Dept. Store - 5F - Shop - Item 5",
    numericId: 329,
  },
  {
    name: "Goldenrod Dept. Store - 5F - Shop - Item 6",
    numericId: 330,
  },
  {
    name: "Olivine Mart - Shop - Item 1",
    numericId: 331,
  },
  {
    name: "Olivine Mart - Shop - Item 2",
    numericId: 332,
  },
  {
    name: "Olivine Mart - Shop - Item 3",
    numericId: 333,
  },
  {
    name: "Olivine Mart - Shop - Item 4",
    numericId: 334,
  },
  {
    name: "Olivine Mart - Shop - Item 5",
    numericId: 335,
  },
  {
    name: "Olivine Mart - Shop - Item 6",
    numericId: 336,
  },
  {
    name: "Olivine Mart - Shop - Item 7",
    numericId: 337,
  },
  {
    name: "Olivine Mart - Shop - Item 8",
    numericId: 338,
  },
  {
    name: "Olivine Mart - Shop - Item 9",
    numericId: 339,
  },
  {
    name: "Ecruteak Mart - Shop - Item 1",
    numericId: 340,
  },
  {
    name: "Ecruteak Mart - Shop - Item 2",
    numericId: 341,
  },
  {
    name: "Ecruteak Mart - Shop - Item 3",
    numericId: 342,
  },
  {
    name: "Ecruteak Mart - Shop - Item 4",
    numericId: 343,
  },
  {
    name: "Ecruteak Mart - Shop - Item 5",
    numericId: 344,
  },
  {
    name: "Ecruteak Mart - Shop - Item 6",
    numericId: 345,
  },
  {
    name: "Ecruteak Mart - Shop - Item 7",
    numericId: 346,
  },
  {
    name: "Ecruteak Mart - Shop - Item 8",
    numericId: 347,
  },
  {
    name: "Ecruteak Mart - Shop - Item 9",
    numericId: 348,
  },
  {
    name: "Ecruteak Mart - Shop - Item 10",
    numericId: 349,
  },
  {
    name: "Mahogany Gift Shop - Shop 1 - Item 1",
    numericId: 350,
  },
  {
    name: "Mahogany Gift Shop - Shop 1 - Item 2",
    numericId: 351,
  },
  {
    name: "Mahogany Gift Shop - Shop 1 - Item 3",
    numericId: 352,
  },
  {
    name: "Mahogany Gift Shop - Shop 1 - Item 4",
    numericId: 353,
  },
  {
    name: "Mahogany Gift Shop - Shop 2 - Item 1",
    numericId: 354,
  },
  {
    name: "Mahogany Gift Shop - Shop 2 - Item 2",
    numericId: 355,
  },
  {
    name: "Mahogany Gift Shop - Shop 2 - Item 3",
    numericId: 356,
  },
  {
    name: "Mahogany Gift Shop - Shop 2 - Item 4",
    numericId: 357,
  },
  {
    name: "Mahogany Gift Shop - Shop 2 - Item 5",
    numericId: 358,
  },
  {
    name: "Mahogany Gift Shop - Shop 2 - Item 6",
    numericId: 359,
  },
  {
    name: "Mahogany Gift Shop - Shop 2 - Item 7",
    numericId: 360,
  },
  {
    name: "Mahogany Gift Shop - Shop 2 - Item 8",
    numericId: 361,
  },
  {
    name: "Mahogany Gift Shop - Shop 2 - Item 9",
    numericId: 362,
  },
  {
    name: "Blackthorn Mart - Shop - Item 1",
    numericId: 363,
  },
  {
    name: "Blackthorn Mart - Shop - Item 2",
    numericId: 364,
  },
  {
    name: "Blackthorn Mart - Shop - Item 3",
    numericId: 365,
  },
  {
    name: "Blackthorn Mart - Shop - Item 4",
    numericId: 366,
  },
  {
    name: "Blackthorn Mart - Shop - Item 5",
    numericId: 367,
  },
  {
    name: "Blackthorn Mart - Shop - Item 6",
    numericId: 368,
  },
  {
    name: "Blackthorn Mart - Shop - Item 7",
    numericId: 369,
  },
  {
    name: "Blackthorn Mart - Shop - Item 8",
    numericId: 370,
  },
  {
    name: "Blackthorn Mart - Shop - Item 9",
    numericId: 371,
  },
  {
    name: "Viridian Mart - Shop - Item 1",
    numericId: 372,
  },
  {
    name: "Viridian Mart - Shop - Item 2",
    numericId: 373,
  },
  {
    name: "Viridian Mart - Shop - Item 3",
    numericId: 374,
  },
  {
    name: "Viridian Mart - Shop - Item 4",
    numericId: 375,
  },
  {
    name: "Viridian Mart - Shop - Item 5",
    numericId: 376,
  },
  {
    name: "Viridian Mart - Shop - Item 6",
    numericId: 377,
  },
  {
    name: "Viridian Mart - Shop - Item 7",
    numericId: 378,
  },
  {
    name: "Viridian Mart - Shop - Item 8",
    numericId: 379,
  },
  {
    name: "Viridian Mart - Shop - Item 9",
    numericId: 380,
  },
  {
    name: "Pewter Mart - Shop - Item 1",
    numericId: 381,
  },
  {
    name: "Pewter Mart - Shop - Item 2",
    numericId: 382,
  },
  {
    name: "Pewter Mart - Shop - Item 3",
    numericId: 383,
  },
  {
    name: "Pewter Mart - Shop - Item 4",
    numericId: 384,
  },
  {
    name: "Pewter Mart - Shop - Item 5",
    numericId: 385,
  },
  {
    name: "Pewter Mart - Shop - Item 6",
    numericId: 386,
  },
  {
    name: "Pewter Mart - Shop - Item 7",
    numericId: 387,
  },
  {
    name: "Cerulean Mart - Shop - Item 1",
    numericId: 388,
  },
  {
    name: "Cerulean Mart - Shop - Item 2",
    numericId: 389,
  },
  {
    name: "Cerulean Mart - Shop - Item 3",
    numericId: 390,
  },
  {
    name: "Cerulean Mart - Shop - Item 4",
    numericId: 391,
  },
  {
    name: "Cerulean Mart - Shop - Item 5",
    numericId: 392,
  },
  {
    name: "Cerulean Mart - Shop - Item 6",
    numericId: 393,
  },
  {
    name: "Cerulean Mart - Shop - Item 7",
    numericId: 394,
  },
  {
    name: "Cerulean Mart - Shop - Item 8",
    numericId: 395,
  },
  {
    name: "Cerulean Mart - Shop - Item 9",
    numericId: 396,
  },
  {
    name: "Lavender Mart - Shop - Item 1",
    numericId: 397,
  },
  {
    name: "Lavender Mart - Shop - Item 2",
    numericId: 398,
  },
  {
    name: "Lavender Mart - Shop - Item 3",
    numericId: 399,
  },
  {
    name: "Lavender Mart - Shop - Item 4",
    numericId: 400,
  },
  {
    name: "Lavender Mart - Shop - Item 5",
    numericId: 401,
  },
  {
    name: "Lavender Mart - Shop - Item 6",
    numericId: 402,
  },
  {
    name: "Lavender Mart - Shop - Item 7",
    numericId: 403,
  },
  {
    name: "Lavender Mart - Shop - Item 8",
    numericId: 404,
  },
  {
    name: "Vermilion Mart - Shop - Item 1",
    numericId: 405,
  },
  {
    name: "Vermilion Mart - Shop - Item 2",
    numericId: 406,
  },
  {
    name: "Vermilion Mart - Shop - Item 3",
    numericId: 407,
  },
  {
    name: "Vermilion Mart - Shop - Item 4",
    numericId: 408,
  },
  {
    name: "Vermilion Mart - Shop - Item 5",
    numericId: 409,
  },
  {
    name: "Vermilion Mart - Shop - Item 6",
    numericId: 410,
  },
  {
    name: "Vermilion Mart - Shop - Item 7",
    numericId: 411,
  },
  {
    name: "Vermilion Mart - Shop - Item 8",
    numericId: 412,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 1 - Item 1",
    numericId: 413,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 1 - Item 2",
    numericId: 414,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 1 - Item 3",
    numericId: 415,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 1 - Item 4",
    numericId: 416,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 1 - Item 5",
    numericId: 417,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 1 - Item 6",
    numericId: 418,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 1 - Item 7",
    numericId: 419,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 2 - Item 1",
    numericId: 420,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 2 - Item 2",
    numericId: 421,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 2 - Item 3",
    numericId: 422,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 2 - Item 4",
    numericId: 423,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 2 - Item 5",
    numericId: 424,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 2 - Item 6",
    numericId: 425,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 2 - Item 7",
    numericId: 426,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 2 - Item 8",
    numericId: 427,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 2 - Item 9",
    numericId: 428,
  },
  {
    name: "Celadon Dept. Store - 2F - Shop 2 - Item 10",
    numericId: 429,
  },
  {
    name: "Celadon Dept. Store - 3F - Shop - Item 1",
    numericId: 430,
  },
  {
    name: "Celadon Dept. Store - 3F - Shop - Item 2",
    numericId: 431,
  },
  {
    name: "Celadon Dept. Store - 3F - Shop - Item 3",
    numericId: 432,
  },
  {
    name: "Celadon Dept. Store - 3F - Shop - Item 4",
    numericId: 433,
  },
  {
    name: "Celadon Dept. Store - 3F - Shop - Item 5",
    numericId: 434,
  },
  {
    name: "Celadon Dept. Store - 4F - Shop - Item 1",
    numericId: 435,
  },
  {
    name: "Celadon Dept. Store - 4F - Shop - Item 2",
    numericId: 436,
  },
  {
    name: "Celadon Dept. Store - 4F - Shop - Item 3",
    numericId: 437,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 1 - Item 1",
    numericId: 438,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 1 - Item 2",
    numericId: 439,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 1 - Item 3",
    numericId: 440,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 1 - Item 4",
    numericId: 441,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 1 - Item 5",
    numericId: 442,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 2 - Item 1",
    numericId: 443,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 2 - Item 2",
    numericId: 444,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 2 - Item 3",
    numericId: 445,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 2 - Item 4",
    numericId: 446,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 2 - Item 5",
    numericId: 447,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 2 - Item 6",
    numericId: 448,
  },
  {
    name: "Celadon Dept. Store - 5F - Shop 2 - Item 7",
    numericId: 449,
  },
  {
    name: "Fuchsia Mart - Shop - Item 1",
    numericId: 450,
  },
  {
    name: "Fuchsia Mart - Shop - Item 2",
    numericId: 451,
  },
  {
    name: "Fuchsia Mart - Shop - Item 3",
    numericId: 452,
  },
  {
    name: "Fuchsia Mart - Shop - Item 4",
    numericId: 453,
  },
  {
    name: "Fuchsia Mart - Shop - Item 5",
    numericId: 454,
  },
  {
    name: "Fuchsia Mart - Shop - Item 6",
    numericId: 455,
  },
  {
    name: "Fuchsia Mart - Shop - Item 7",
    numericId: 456,
  },
  {
    name: "Saffron Mart - Shop - Item 1",
    numericId: 457,
  },
  {
    name: "Saffron Mart - Shop - Item 2",
    numericId: 458,
  },
  {
    name: "Saffron Mart - Shop - Item 3",
    numericId: 459,
  },
  {
    name: "Saffron Mart - Shop - Item 4",
    numericId: 460,
  },
  {
    name: "Saffron Mart - Shop - Item 5",
    numericId: 461,
  },
  {
    name: "Saffron Mart - Shop - Item 6",
    numericId: 462,
  },
  {
    name: "Saffron Mart - Shop - Item 7",
    numericId: 463,
  },
  {
    name: "Saffron Mart - Shop - Item 8",
    numericId: 464,
  },
  {
    name: "Mount Moon Gift Shop - Shop - Item 1",
    numericId: 465,
  },
  {
    name: "Mount Moon Gift Shop - Shop - Item 2",
    numericId: 466,
  },
  {
    name: "Mount Moon Gift Shop - Shop - Item 3",
    numericId: 467,
  },
  {
    name: "Mount Moon Gift Shop - Shop - Item 4",
    numericId: 468,
  },
  {
    name: "Mount Moon Gift Shop - Shop - Item 5",
    numericId: 469,
  },
  {
    name: "Mount Moon Gift Shop - Shop - Item 6",
    numericId: 470,
  },
  {
    name: "Indigo Plateau Pokecenter - 1F - Shop - Item 1",
    numericId: 471,
  },
  {
    name: "Indigo Plateau Pokecenter - 1F - Shop - Item 2",
    numericId: 472,
  },
  {
    name: "Indigo Plateau Pokecenter - 1F - Shop - Item 3",
    numericId: 473,
  },
  {
    name: "Indigo Plateau Pokecenter - 1F - Shop - Item 4",
    numericId: 474,
  },
  {
    name: "Indigo Plateau Pokecenter - 1F - Shop - Item 5",
    numericId: 475,
  },
  {
    name: "Indigo Plateau Pokecenter - 1F - Shop - Item 6",
    numericId: 476,
  },
  {
    name: "Indigo Plateau Pokecenter - 1F - Shop - Item 7",
    numericId: 477,
  },
  {
    name: "Goldenrod Underground - Herb Shop - Item 1",
    numericId: 478,
  },
  {
    name: "Goldenrod Underground - Herb Shop - Item 2",
    numericId: 479,
  },
  {
    name: "Goldenrod Underground - Herb Shop - Item 3",
    numericId: 480,
  },
  {
    name: "Goldenrod Underground - Herb Shop - Item 4",
    numericId: 481,
  },
  {
    name: "Goldenrod Underground - Bargain Shop - Item 1",
    numericId: 482,
  },
  {
    name: "Goldenrod Underground - Bargain Shop - Item 2",
    numericId: 483,
  },
  {
    name: "Goldenrod Underground - Bargain Shop - Item 3",
    numericId: 484,
  },
  {
    name: "Goldenrod Underground - Bargain Shop - Item 4",
    numericId: 485,
  },
  {
    name: "Goldenrod Underground - Bargain Shop - Item 5",
    numericId: 486,
  },
  {
    name: "Goldenrod Dept. Store Roof - Shop 1 - Item 1",
    numericId: 487,
  },
  {
    name: "Goldenrod Dept. Store Roof - Shop 1 - Item 2",
    numericId: 488,
  },
  {
    name: "Goldenrod Dept. Store Roof - Shop 1 - Item 3",
    numericId: 489,
  },
  {
    name: "Goldenrod Dept. Store Roof - Shop 1 - Item 4",
    numericId: 490,
  },
  {
    name: "Goldenrod Dept. Store Roof - Shop 1 - Item 5",
    numericId: 491,
  },
  {
    name: "Goldenrod Dept. Store Roof - Shop 2 - Item 1",
    numericId: 492,
  },
  {
    name: "Goldenrod Dept. Store Roof - Shop 2 - Item 2",
    numericId: 493,
  },
  {
    name: "Goldenrod Dept. Store Roof - Shop 2 - Item 3",
    numericId: 494,
  },
  {
    name: "Goldenrod Dept. Store Roof - Shop 2 - Item 4",
    numericId: 495,
  },
  {
    name: "Goldenrod Dept. Store Roof - Shop 2 - Item 5",
    numericId: 497,
  },
].reduce((result, { name, numericId }) => {
  return `${result}\n  ["${name}"] = ${numericId},`
}, "SHOP_LOCATION_NAMES_TO_IDS = {") + "\n}"

const phoneCallsLua = "PHONE_CALLS = " + JSON.stringify(phoneCalls, null, 2)
  .replaceAll("[", "{")
  .replaceAll("]", "},")
  .replaceAll(/\n(\s{2,4})"/g, "\n$1[\"")
  .replaceAll(/:/g, "] =")
  .replaceAll(/ {6}(\S*"),?/g, "      [$1] = true,")

const trackerPath: string = process.env.trackerSourcePath!

fs.writeFileSync(path.resolve(trackerPath, "items", "items.json"), JSON.stringify(items, null, 2), "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "locations", "locations.json"), JSON.stringify(itemLocations, null, 2), "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "maps", "maps.json"), JSON.stringify(maps, null, 2), "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "scripts", "items.lua"), itemsLua, "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "scripts", "locations.lua"), [locationNames, shopLocationIds].join("\n\n"), "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "scripts", "consumables.lua"), consumableItemNumbers, "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "layouts", "maps.json"), JSON.stringify(tabbedLayout, null, 2), "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "scripts", "maps.lua"), mapIdsCode, "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "items", "events.json"), JSON.stringify(eventItems, null, 2), "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "items", "hostedEvents.json"), JSON.stringify(hostedEventItems, null, 2), "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "items", "hostedPhoneCalls.json"), JSON.stringify(hostedPhoneCallItems, null, 2), "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "scripts", "events.lua"), [eventNamesTable, linkedEventsTable, untrackedEventsTable].join("\n\n"), "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "scripts", "phoneCalls.lua"), phoneCallsLua, "utf-8")
fs.writeFileSync(path.resolve(trackerPath, "locations", "nodes.json"), JSON.stringify(Object.values(specificLocationGroupsGroups), null, 2), "utf-8")

ruleLuas.forEach((info) => {
  fs.writeFileSync(path.resolve(trackerPath, `scripts/rules/${info.name}`, "logicalAccessRules.lua"), info.logicalAccessRules, "utf-8")
  fs.writeFileSync(path.resolve(trackerPath, `scripts/rules/${info.name}`, "strictAccessRules.lua"), info.strictAccessRules, "utf-8")
  fs.writeFileSync(path.resolve(trackerPath, `scripts/rules/${info.name}`, "visibilityRules.lua"), info.visibilityRules, "utf-8")
})