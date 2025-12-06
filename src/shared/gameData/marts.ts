import type { Mart, SpecialShop } from "@shared/types/gameData/mart"
import type { MartId, SpecialShopId } from "@shared/types/gameDataIds/marts"

export const martsMap: IdMap<MartId, Mart> = {
  CHERRYGROVE_1: {
    id: "CHERRYGROVE_1",
    groupId: "CHERRYGROVE",
    areaId: "CHERRYGROVE_MART",
    items: [
      "POTION",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
    ],
  },
  CHERRYGROVE_2: {
    id: "CHERRYGROVE_2",
    groupId: "CHERRYGROVE",
    areaId: "CHERRYGROVE_MART",
    items: [
      "POKE_BALL",
      "POTION",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
    ],
    accessRequirements: [
      "MYSTERY_EGG",
      "ELMS_LAB",
    ],
  },
  VIOLET: {
    id: "VIOLET",
    groupId: "VIOLET",
    areaId: "VIOLET_MART",
    items: [
      "POKE_BALL",
      "POTION",
      "ESCAPE_ROPE",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
      "X_DEFEND",
      "X_ATTACK",
      "X_SPEED",
      "FLOWER_MAIL",
    ],
  },
  AZALEA: {
    id: "AZALEA",
    groupId: "AZALEA",
    areaId: "AZALEA_MART",
    items: [
      "CHARCOAL",
      "POKE_BALL",
      "POTION",
      "SUPER_POTION",
      "ESCAPE_ROPE",
      "REPEL",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "FLOWER_MAIL",
    ],
  },
  CIANWOOD: {
    id: "CIANWOOD",
    groupId: "CIANWOOD",
    areaId: "CIANWOOD_PHARMACY",
    items: [
      "POTION",
      "SUPER_POTION",
      "HYPER_POTION",
      "FULL_HEAL",
      "REVIVE",
    ],
  },
  GOLDENROD_2F_1: {
    id: "GOLDENROD_2F_1",
    groupId: "GOLDENROD_2F_1",
    areaId: "GOLDENROD_DEPT_STORE_2F",
    items: [
      "POTION",
      "SUPER_POTION",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
      "BURN_HEAL",
      "ICE_HEAL",
    ],
  },
  GOLDENROD_2F_2: {
    id: "GOLDENROD_2F_2",
    groupId: "GOLDENROD_2F_2",
    areaId: "GOLDENROD_DEPT_STORE_2F",
    items: [
      "POKE_BALL",
      "GREAT_BALL",
      "ESCAPE_ROPE",
      "REPEL",
      "REVIVE",
      "FULL_HEAL",
      "POKE_DOLL",
      "FLOWER_MAIL",
    ],
  },
  GOLDENROD_3F: {
    id: "GOLDENROD_3F",
    groupId: "GOLDENROD_3F",
    areaId: "GOLDENROD_DEPT_STORE_3F",
    items: [
      "X_SPEED",
      "X_SPECIAL",
      "X_DEFEND",
      "X_ATTACK",
      "DIRE_HIT",
      "GUARD_SPEC",
      "X_ACCURACY",
    ],
  },
  GOLDENROD_4F: {
    id: "GOLDENROD_4F",
    groupId: "GOLDENROD_4F",
    areaId: "GOLDENROD_DEPT_STORE_4F",
    items: [
      "PROTEIN",
      "IRON",
      "CARBOS",
      "CALCIUM",
      "HP_UP",
    ],
  },
  GOLDENROD_5F_1: {
    id: "GOLDENROD_5F_1",
    groupId: "GOLDENROD_5F",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [
      "TM41",
      "TM48",
      "TM33",
    ],
  },
  GOLDENROD_5F_2: {
    id: "GOLDENROD_5F_2",
    groupId: "GOLDENROD_5F",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [
      "TM41",
      "TM48",
      "TM33",
      "TM02",
    ],
    accessRequirements: [
      "ILEX_FOREST_NORTH_AREA",
    ],
  },
  GOLDENROD_5F_3: {
    id: "GOLDENROD_5F_3",
    groupId: "GOLDENROD_5F",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [
      "TM41",
      "TM48",
      "TM33",
      "TM08",
    ],
    accessRequirements: [
      "SQUIRTBOTTLE",
      "ROUTE_36_EAST_AREA",
    ],
  },
  GOLDENROD_5F_4: {
    id: "GOLDENROD_5F_4",
    groupId: "GOLDENROD_5F",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [
      "TM41",
      "TM48",
      "TM33",
      "TM02",
      "TM08",
    ],
    accessRequirements: [
      "ILEX_FOREST_NORTH_AREA",
      "SQUIRTBOTTLE",
      "ROUTE_36_EAST_AREA",
    ],
  },
  OLIVINE: {
    id: "OLIVINE",
    groupId: "OLIVINE",
    areaId: "OLIVINE_MART",
    items: [
      "GREAT_BALL",
      "SUPER_POTION",
      "HYPER_POTION",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
      "ICE_HEAL",
      "SUPER_REPEL",
      "SURF_MAIL",
    ],
  },
  ECRUTEAK: {
    id: "ECRUTEAK",
    groupId: "ECRUTEAK",
    areaId: "ECRUTEAK_MART",
    items: [
      "POKE_BALL",
      "GREAT_BALL",
      "POTION",
      "SUPER_POTION",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
      "BURN_HEAL",
      "ICE_HEAL",
      "REVIVE",
    ],
  },
  MAHOGANY_1: {
    id: "MAHOGANY_1",
    groupId: "MAHOGANY_1",
    areaId: "MAHOGANY_MART_1F",
    items: [
      "TINYMUSHROOM",
      "SLOWPOKETAIL",
      "POKE_BALL",
      "POTION",
    ],
    accessRequirements: [
      "INACCESSIBLE",
    ],
  },
  MAHOGANY_2: {
    id: "MAHOGANY_2",
    groupId: "MAHOGANY_2",
    areaId: "MAHOGANY_MART_1F",
    items: [
      "RAGECANDYBAR",
      "GREAT_BALL",
      "SUPER_POTION",
      "HYPER_POTION",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "SUPER_REPEL",
      "REVIVE",
      "FLOWER_MAIL",
    ],
    accessRequirements: [
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    ],
  },
  BLACKTHORN: {
    id: "BLACKTHORN",
    groupId: "BLACKTHORN",
    areaId: "BLACKTHORN_MART",
    items: [
      "GREAT_BALL",
      "ULTRA_BALL",
      "HYPER_POTION",
      "MAX_POTION",
      "FULL_HEAL",
      "REVIVE",
      "MAX_REPEL",
      "X_DEFEND",
      "X_ATTACK",
    ],
  },
  VIRIDIAN: {
    id: "VIRIDIAN",
    groupId: "VIRIDIAN",
    areaId: "VIRIDIAN_MART",
    items: [
      "ULTRA_BALL",
      "HYPER_POTION",
      "FULL_HEAL",
      "REVIVE",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
      "BURN_HEAL",
      "FLOWER_MAIL",
    ],
  },
  PEWTER: {
    id: "PEWTER",
    groupId: "PEWTER",
    areaId: "PEWTER_MART",
    items: [
      "GREAT_BALL",
      "SUPER_POTION",
      "SUPER_REPEL",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
      "BURN_HEAL",
    ],
  },
  CERULEAN: {
    id: "CERULEAN",
    groupId: "CERULEAN",
    areaId: "CERULEAN_MART",
    items: [
      "GREAT_BALL",
      "ULTRA_BALL",
      "SUPER_POTION",
      "SUPER_REPEL",
      "FULL_HEAL",
      "X_DEFEND",
      "X_ATTACK",
      "DIRE_HIT",
      "SURF_MAIL",
    ],
  },
  LAVENDER: {
    id: "LAVENDER",
    groupId: "LAVENDER",
    areaId: "LAVENDER_MART",
    items: [
      "GREAT_BALL",
      "POTION",
      "SUPER_POTION",
      "MAX_REPEL",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
      "BURN_HEAL",
    ],
  },
  VERMILION: {
    id: "VERMILION",
    groupId: "VERMILION",
    areaId: "VERMILION_MART",
    items: [
      "ULTRA_BALL",
      "SUPER_POTION",
      "HYPER_POTION",
      "REVIVE",
      "PARLYZ_HEAL",
      "AWAKENING",
      "BURN_HEAL",
      "LITEBLUEMAIL",
    ],
  },
  CELADON_2F_1: {
    id: "CELADON_2F_1",
    groupId: "CELADON_2F_1",
    areaId: "CELADON_DEPT_STORE_2F",
    items: [
      "POTION",
      "SUPER_POTION",
      "HYPER_POTION",
      "MAX_POTION",
      "REVIVE",
      "SUPER_REPEL",
      "MAX_REPEL",
    ],
  },
  CELADON_2F_2: {
    id: "CELADON_2F_2",
    groupId: "CELADON_2F_2",
    areaId: "CELADON_DEPT_STORE_2F",
    items: [
      "POKE_BALL",
      "GREAT_BALL",
      "ULTRA_BALL",
      "ESCAPE_ROPE",
      "FULL_HEAL",
      "ANTIDOTE",
      "BURN_HEAL",
      "ICE_HEAL",
      "AWAKENING",
      "PARLYZ_HEAL",
    ],
  },
  CELADON_3F: {
    id: "CELADON_3F",
    groupId: "CELADON_3F",
    areaId: "CELADON_DEPT_STORE_3F",
    items: [
      "TM10",
      "TM11",
      "TM17",
      "TM18",
      "TM37",
    ],
  },
  CELADON_4F: {
    id: "CELADON_4F",
    groupId: "CELADON_4F",
    areaId: "CELADON_DEPT_STORE_4F",
    items: [
      "POKE_DOLL",
      "LOVELY_MAIL",
      "SURF_MAIL",
    ],
  },
  CELADON_5F_1: {
    id: "CELADON_5F_1",
    groupId: "CELADON_5F_1",
    areaId: "CELADON_DEPT_STORE_5F",
    items: [
      "HP_UP",
      "PROTEIN",
      "IRON",
      "CARBOS",
      "CALCIUM",
    ],
  },
  CELADON_5F_2: {
    id: "CELADON_5F_2",
    groupId: "CELADON_5F_2",
    areaId: "CELADON_DEPT_STORE_5F",
    items: [
      "X_ACCURACY",
      "GUARD_SPEC",
      "DIRE_HIT",
      "X_ATTACK",
      "X_DEFEND",
      "X_SPEED",
      "X_SPECIAL",
    ],
  },
  FUCHSIA: {
    id: "FUCHSIA",
    groupId: "FUCHSIA",
    areaId: "FUCHSIA_MART",
    items: [
      "GREAT_BALL",
      "ULTRA_BALL",
      "SUPER_POTION",
      "HYPER_POTION",
      "FULL_HEAL",
      "MAX_REPEL",
      "FLOWER_MAIL",
    ],
  },
  SAFFRON: {
    id: "SAFFRON",
    groupId: "SAFFRON",
    areaId: "SAFFRON_MART",
    items: [
      "GREAT_BALL",
      "ULTRA_BALL",
      "HYPER_POTION",
      "MAX_POTION",
      "FULL_HEAL",
      "X_ATTACK",
      "X_DEFEND",
      "FLOWER_MAIL",
    ],
  },
  MT_MOON: {
    id: "MT_MOON",
    groupId: "MT_MOON",
    areaId: "MOUNT_MOON_GIFT_SHOP",
    items: [
      "POKE_DOLL",
      "FRESH_WATER",
      "SODA_POP",
      "LEMONADE",
      "REPEL",
      "PORTRAITMAIL",
    ],
  },
  INDIGO_PLATEAU: {
    id: "INDIGO_PLATEAU",
    groupId: "INDIGO_PLATEAU",
    areaId: "INDIGO_PLATEAU_POKECENTER_1F",
    items: [
      "ULTRA_BALL",
      "MAX_REPEL",
      "HYPER_POTION",
      "MAX_POTION",
      "FULL_RESTORE",
      "REVIVE",
      "FULL_HEAL",
    ],
  },
  UNDERGROUND: {
    id: "UNDERGROUND",
    groupId: "UNDERGROUND",
    areaId: "GOLDENROD_UNDERGROUND",
    items: [
      "ENERGYPOWDER",
      "ENERGY_ROOT",
      "HEAL_POWDER",
      "REVIVAL_HERB",
    ],
  },
  GOLDENROD_5F_5: {
    id: "GOLDENROD_5F_5",
    groupId: "GOLDENROD_5F",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [],
    accessRequirements: [
      "ROUTE_34_ILEX_FOREST_GATE",
    ],
  },
  GOLDENROD_5F_6: {
    id: "GOLDENROD_5F_6",
    groupId: "GOLDENROD_5F",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [],
    accessRequirements: [
      "ROUTE_34_ILEX_FOREST_GATE",
      "ILEX_FOREST_NORTH_AREA",
    ],
  },
  GOLDENROD_5F_7: {
    id: "GOLDENROD_5F_7",
    groupId: "GOLDENROD_5F",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [],
    accessRequirements: [
      "ROUTE_34_ILEX_FOREST_GATE",
      "SQUIRTBOTTLE",
      "ROUTE_36_EAST_AREA",
    ],
  },
  GOLDENROD_5F_8: {
    id: "GOLDENROD_5F_8",
    groupId: "GOLDENROD_5F",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [],
    accessRequirements: [
      "ROUTE_34_ILEX_FOREST_GATE",
      "ILEX_FOREST_NORTH_AREA",
      "SQUIRTBOTTLE",
      "ROUTE_36_EAST_AREA",
    ],
  },
} as const

export const specialShopsMap: IdMap<SpecialShopId, SpecialShop> = {
  GOLDENROD_VENDING_MACHINES: {
    id: "GOLDENROD_VENDING_MACHINES",
    areaId: "GOLDENROD_DEPT_STORE_6F",
    items: [
      {
        itemId: "FRESH_WATER",
        price: 200,
      },
      {
        itemId: "SODA_POP",
        price: 300,
      },
      {
        itemId: "LEMONADE",
        price: 350,
      },
    ],
  },
  CELADON_VENDING_MACHINES: {
    id: "CELADON_VENDING_MACHINES",
    areaId: "CELADON_DEPT_STORE_6F",
    items: [
      {
        itemId: "FRESH_WATER",
        price: 200,
      },
      {
        itemId: "SODA_POP",
        price: 300,
      },
      {
        itemId: "LEMONADE",
        price: 350,
      },
    ],
  },
  UNDERGROUND_BARGAIN_SHOP: {
    id: "UNDERGROUND_BARGAIN_SHOP",
    areaId: "GOLDENROD_UNDERGROUND",
    items: [
      {
        itemId: "NUGGET",
        price: 4500,
      },
      {
        itemId: "PEARL",
        price: 650,
      },
      {
        itemId: "BIG_PEARL",
        price: 3500,
      },
      {
        itemId: "STARDUST",
        price: 900,
      },
      {
        itemId: "STAR_PIECE",
        price: 4600,
      },
    ],
  },
  GOLDENROD_ROOFTOP_VENDOR_1: {
    id: "GOLDENROD_ROOFTOP_VENDOR_1",
    areaId: "GOLDENROD_DEPT_STORE_ROOF",
    items: [
      {
        itemId: "POKE_BALL",
        price: 150,
      },
      {
        itemId: "GREAT_BALL",
        price: 500,
      },
      {
        itemId: "SUPER_POTION",
        price: 500,
      },
      {
        itemId: "FULL_HEAL",
        price: 500,
      },
      {
        itemId: "REVIVE",
        price: 1200,
      },
    ],
    accessRequirements: [
      "ROUTE_34_MAIN_AREA",
      "POKEGEAR",
    ],
  },
  GOLDENROD_ROOFTOP_VENDOR_2: {
    id: "GOLDENROD_ROOFTOP_VENDOR_2",
    areaId: "GOLDENROD_DEPT_STORE_ROOF",
    items: [
      {
        itemId: "HYPER_POTION",
        price: 1000,
      },
      {
        itemId: "FULL_RESTORE",
        price: 2000,
      },
      {
        itemId: "FULL_HEAL",
        price: 500,
      },
      {
        itemId: "ULTRA_BALL",
        price: 1000,
      },
      {
        itemId: "PROTEIN",
        price: 7800,
      },
    ],
    accessRequirements: [
      "ROUTE_34_MAIN_AREA",
      "POKEGEAR",
      "HALL_OF_FAME",
    ],
  },
  MOOMOO_FARM: {
    id: "MOOMOO_FARM",
    areaId: "ROUTE_39_FARMHOUSE",
    items: [
      {
        itemId: "MOOMOO_MILK",
        price: 500,
      },
    ],
    accessRequirements: [
      "ROUTE_39_BARN",
      { item: "BERRY", number: 7 },
    ],
  },
  MAHOGANY_STREET_VENDOR: {
    id: "MAHOGANY_STREET_VENDOR",
    areaId: "MAHOGANY_TOWN",
    items: [
      {
        itemId: "RAGECANDYBAR",
        price: 300,
      },
    ],
  },
  GOLDENROD_GAME_CORNER: {
    id: "GOLDENROD_GAME_CORNER",
    areaId: "GOLDENROD_GAME_CORNER",
    items: [
      {
        itemId: "TM25",
        price: 5500,
      },
      {
        itemId: "TM14",
        price: 5500,
      },
      {
        itemId: "TM38",
        price: 5500,
      },
    ],
    accessRequirements: [
      "COIN_CASE",
    ],
  },
  CELADON_GAME_CORNER: {
    id: "CELADON_GAME_CORNER",
    areaId: "CELADON_GAME_CORNER_PRIZE_ROOM",
    items: [
      {
        itemId: "TM32",
        price: 1500,
      },
      {
        itemId: "TM29",
        price: 3500,
      },
      {
        itemId: "TM15",
        price: 7500,
      },
    ],
    accessRequirements: [
      "COIN_CASE",
    ],
  },
  BLUE_CARD_REWARD_LADY: {
    id: "BLUE_CARD_REWARD_LADY",
    areaId: "RADIO_TOWER_2F",
    items: [
      {
        itemId: "ULTRA_BALL",
        price: 2,
      },
      {
        itemId: "FULL_RESTORE",
        price: 2,
      },
      {
        itemId: "NUGGET",
        price: 3,
      },
      {
        itemId: "RARE_CANDY",
        price: 3,
      },
      {
        itemId: "PROTEIN",
        price: 5,
      },
      {
        itemId: "IRON",
        price: 5,
      },
      {
        itemId: "CARBOS",
        price: 5,
      },
      {
        itemId: "CALCIUM",
        price: 5,
      },
      {
        itemId: "HP_UP",
        price: 5,
      },
    ],
    accessRequirements: [
      "BLUE_CARD",
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    ],
  },
}