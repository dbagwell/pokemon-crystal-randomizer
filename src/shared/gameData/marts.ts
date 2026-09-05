import type { Mart, SpecialShop } from "@shared/types/gameData/mart"
import type { MartId, SpecialShopId } from "@shared/types/gameDataIds/marts"

export const martsMap: IdMap<MartId, Mart> = {
  CHERRYGROVE_MART_SHOP_1: {
    id: "CHERRYGROVE_MART_SHOP_1",
    groupId: "CHERRYGROVE_MART_SHOP",
    areaId: "CHERRYGROVE_MART",
    items: [
      "POTION",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
    ],
  },
  CHERRYGROVE_MART_SHOP_2: {
    id: "CHERRYGROVE_MART_SHOP_2",
    groupId: "CHERRYGROVE_MART_SHOP",
    areaId: "CHERRYGROVE_MART",
    items: [
      "POKE_BALL",
      "POTION",
      "ANTIDOTE",
      "PARLYZ_HEAL",
      "AWAKENING",
    ],
    accessRequirements: [
      "ELMS_LAB_GAVE_MYSTERY_EGG",
    ],
  },
  VIOLET_MART_SHOP: {
    id: "VIOLET_MART_SHOP",
    groupId: "VIOLET_MART_SHOP",
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
  AZALEA_MART_SHOP: {
    id: "AZALEA_MART_SHOP",
    groupId: "AZALEA_MART_SHOP",
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
  CIANWOOD_PHARMACY_SHOP: {
    id: "CIANWOOD_PHARMACY_SHOP",
    groupId: "CIANWOOD_PHARMACY_SHOP",
    areaId: "CIANWOOD_PHARMACY",
    items: [
      "POTION",
      "SUPER_POTION",
      "HYPER_POTION",
      "FULL_HEAL",
      "REVIVE",
    ],
  },
  GOLDENROD_DEPT_STORE_2F_SHOP_1: {
    id: "GOLDENROD_DEPT_STORE_2F_SHOP_1",
    groupId: "GOLDENROD_DEPT_STORE_2F_SHOP_1",
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
  GOLDENROD_DEPT_STORE_2F_SHOP_2: {
    id: "GOLDENROD_DEPT_STORE_2F_SHOP_2",
    groupId: "GOLDENROD_DEPT_STORE_2F_SHOP_2",
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
  GOLDENROD_DEPT_STORE_3F_SHOP: {
    id: "GOLDENROD_DEPT_STORE_3F_SHOP",
    groupId: "GOLDENROD_DEPT_STORE_3F_SHOP",
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
  GOLDENROD_DEPT_STORE_4F_SHOP: {
    id: "GOLDENROD_DEPT_STORE_4F_SHOP",
    groupId: "GOLDENROD_DEPT_STORE_4F_SHOP",
    areaId: "GOLDENROD_DEPT_STORE_4F",
    items: [
      "PROTEIN",
      "IRON",
      "CARBOS",
      "CALCIUM",
      "HP_UP",
    ],
  },
  GOLDENROD_DEPT_STORE_5F_SHOP_1: {
    id: "GOLDENROD_DEPT_STORE_5F_SHOP_1",
    groupId: "GOLDENROD_DEPT_STORE_5F_SHOP",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [
      "TM41",
      "TM48",
      "TM33",
    ],
  },
  GOLDENROD_DEPT_STORE_5F_SHOP_2: {
    id: "GOLDENROD_DEPT_STORE_5F_SHOP_2",
    groupId: "GOLDENROD_DEPT_STORE_5F_SHOP",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [
      "TM41",
      "TM48",
      "TM33",
      "TM02",
    ],
    accessRequirements: [
      "ILEX_FOREST_NORTH_AREA_GOT_HEADBUTT_GUYS_GIFT",
    ],
  },
  GOLDENROD_DEPT_STORE_5F_SHOP_3: {
    id: "GOLDENROD_DEPT_STORE_5F_SHOP_3",
    groupId: "GOLDENROD_DEPT_STORE_5F_SHOP",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [
      "TM41",
      "TM48",
      "TM33",
      "TM08",
    ],
    accessRequirements: [
      "ROUTE_36_EAST_AREA_GOT_ROCK_SMASH_GUYS_GIFT",
    ],
  },
  GOLDENROD_DEPT_STORE_5F_SHOP_4: {
    id: "GOLDENROD_DEPT_STORE_5F_SHOP_4",
    groupId: "GOLDENROD_DEPT_STORE_5F_SHOP",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [
      "TM41",
      "TM48",
      "TM33",
      "TM02",
      "TM08",
    ],
    accessRequirements: [
      "ILEX_FOREST_NORTH_AREA_GOT_HEADBUTT_GUYS_GIFT",
      "ROUTE_36_EAST_AREA_GOT_ROCK_SMASH_GUYS_GIFT",
    ],
  },
  OLIVINE_MART_SHOP: {
    id: "OLIVINE_MART_SHOP",
    groupId: "OLIVINE_MART_SHOP",
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
  ECRUTEAK_MART_SHOP: {
    id: "ECRUTEAK_MART_SHOP",
    groupId: "ECRUTEAK_MART_SHOP",
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
  MAHOGANY_MART_1F_SHOP_1: {
    id: "MAHOGANY_MART_1F_SHOP_1",
    groupId: "MAHOGANY_MART_1F_SHOP_1",
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
  MAHOGANY_MART_1F_SHOP_2: {
    id: "MAHOGANY_MART_1F_SHOP_2",
    groupId: "MAHOGANY_MART_1F_SHOP_2",
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
      "RADIO_TOWER_5F_EAST_AREA_DEFEATED_ROCKETS",
    ],
  },
  BLACKTHORN_MART_SHOP: {
    id: "BLACKTHORN_MART_SHOP",
    groupId: "BLACKTHORN_MART_SHOP",
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
  VIRIDIAN_MART_SHOP: {
    id: "VIRIDIAN_MART_SHOP",
    groupId: "VIRIDIAN_MART_SHOP",
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
  PEWTER_MART_SHOP: {
    id: "PEWTER_MART_SHOP",
    groupId: "PEWTER_MART_SHOP",
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
  CERULEAN_MART_SHOP: {
    id: "CERULEAN_MART_SHOP",
    groupId: "CERULEAN_MART_SHOP",
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
  LAVENDER_MART_SHOP: {
    id: "LAVENDER_MART_SHOP",
    groupId: "LAVENDER_MART_SHOP",
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
  VERMILION_MART_SHOP: {
    id: "VERMILION_MART_SHOP",
    groupId: "VERMILION_MART_SHOP",
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
  CELADON_DEPT_STORE_2F_SHOP_1: {
    id: "CELADON_DEPT_STORE_2F_SHOP_1",
    groupId: "CELADON_DEPT_STORE_2F_SHOP_1",
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
  CELADON_DEPT_STORE_2F_SHOP_2: {
    id: "CELADON_DEPT_STORE_2F_SHOP_2",
    groupId: "CELADON_DEPT_STORE_2F_SHOP_2",
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
  CELADON_DEPT_STORE_3F_SHOP: {
    id: "CELADON_DEPT_STORE_3F_SHOP",
    groupId: "CELADON_DEPT_STORE_3F_SHOP",
    areaId: "CELADON_DEPT_STORE_3F",
    items: [
      "TM10",
      "TM11",
      "TM17",
      "TM18",
      "TM37",
    ],
  },
  CELADON_DEPT_STORE_4F_SHOP: {
    id: "CELADON_DEPT_STORE_4F_SHOP",
    groupId: "CELADON_DEPT_STORE_4F_SHOP",
    areaId: "CELADON_DEPT_STORE_4F",
    items: [
      "POKE_DOLL",
      "LOVELY_MAIL",
      "SURF_MAIL",
    ],
  },
  CELADON_DEPT_STORE_5F_SHOP_1: {
    id: "CELADON_DEPT_STORE_5F_SHOP_1",
    groupId: "CELADON_DEPT_STORE_5F_SHOP_1",
    areaId: "CELADON_DEPT_STORE_5F",
    items: [
      "HP_UP",
      "PROTEIN",
      "IRON",
      "CARBOS",
      "CALCIUM",
    ],
  },
  CELADON_DEPT_STORE_5F_SHOP_2: {
    id: "CELADON_DEPT_STORE_5F_SHOP_2",
    groupId: "CELADON_DEPT_STORE_5F_SHOP_2",
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
  FUCHSIA_MART_SHOP: {
    id: "FUCHSIA_MART_SHOP",
    groupId: "FUCHSIA_MART_SHOP",
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
  SAFFRON_MART_SHOP: {
    id: "SAFFRON_MART_SHOP",
    groupId: "SAFFRON_MART_SHOP",
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
  MOUNT_MOON_GIFT_SHOP_SHOP: {
    id: "MOUNT_MOON_GIFT_SHOP_SHOP",
    groupId: "MT_MOON_GIFT_SHOP_SHOP",
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
  INDIGO_PLATEAU_POKECENTER_1F_SHOP: {
    id: "INDIGO_PLATEAU_POKECENTER_1F_SHOP",
    groupId: "INDIGO_PLATEAU_POKECENTER_1F_SHOP",
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
  GOLDENROD_UNDERGROUND_HERB_SHOP: {
    id: "GOLDENROD_UNDERGROUND_HERB_SHOP",
    groupId: "GOLDENROD_UNDERGROUND_HERB_SHOP",
    areaId: "GOLDENROD_UNDERGROUND",
    items: [
      "ENERGYPOWDER",
      "ENERGY_ROOT",
      "HEAL_POWDER",
      "REVIVAL_HERB",
    ],
  },
  GOLDENROD_DEPT_STORE_5F_SHOP_5: {
    id: "GOLDENROD_DEPT_STORE_5F_SHOP_5",
    groupId: "GOLDENROD_DEPT_STORE_5F_SHOP",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [],
    accessRequirements: [
      "ROUTE_34_ILEX_FOREST_GATE_GOT_LADYS_GIFT",
    ],
  },
  GOLDENROD_DEPT_STORE_5F_SHOP_6: {
    id: "GOLDENROD_DEPT_STORE_5F_SHOP_6",
    groupId: "GOLDENROD_DEPT_STORE_5F_SHOP",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [],
    accessRequirements: [
      "ROUTE_34_ILEX_FOREST_GATE_GOT_LADYS_GIFT",
      "ILEX_FOREST_NORTH_AREA_GOT_HEADBUTT_GUYS_GIFT",
    ],
  },
  GOLDENROD_DEPT_STORE_5F_SHOP_7: {
    id: "GOLDENROD_DEPT_STORE_5F_SHOP_7",
    groupId: "GOLDENROD_DEPT_STORE_5F_SHOP",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [],
    accessRequirements: [
      "ROUTE_34_ILEX_FOREST_GATE_GOT_LADYS_GIFT",
      "ROUTE_36_EAST_AREA_GOT_ROCK_SMASH_GUYS_GIFT",
    ],
  },
  GOLDENROD_DEPT_STORE_5F_SHOP_8: {
    id: "GOLDENROD_DEPT_STORE_5F_SHOP_8",
    groupId: "GOLDENROD_DEPT_STORE_5F_SHOP",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    items: [],
    accessRequirements: [
      "ROUTE_34_ILEX_FOREST_GATE_GOT_LADYS_GIFT",
      "ILEX_FOREST_NORTH_AREA_GOT_HEADBUTT_GUYS_GIFT",
      "ROUTE_36_EAST_AREA_GOT_ROCK_SMASH_GUYS_GIFT",
    ],
  },
} as const

export const specialShopsMap: IdMap<SpecialShopId, SpecialShop> = {
  GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES: {
    id: "GOLDENROD_DEPT_STORE_6F_VENDING_MACHINES",
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
  CELADON_DEPT_STORE_6F_VENDING_MACHINES: {
    id: "CELADON_DEPT_STORE_6F_VENDING_MACHINES",
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
  GOLDENROD_UNDERGROUND_BARGAIN_SHOP: {
    id: "GOLDENROD_UNDERGROUND_BARGAIN_SHOP",
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
  GOLDENROD_DEPT_STORE_ROOF_SHOP_1: {
    id: "GOLDENROD_DEPT_STORE_ROOF_SHOP_1",
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
      "ROUTE_34_DEFEATED_TODD",
      "POKEGEAR",
    ],
  },
  GOLDENROD_DEPT_STORE_ROOF_SHOP_2: {
    id: "GOLDENROD_DEPT_STORE_ROOF_SHOP_2",
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
      "ROUTE_34_DEFEATED_TODD",
      "POKEGEAR",
      "HALL_OF_FAME_ENTERED",
    ],
  },
  ROUTE_39_FARMHOUSE_SHOP: {
    id: "ROUTE_39_FARMHOUSE_SHOP",
    areaId: "ROUTE_39_FARMHOUSE",
    items: [
      {
        itemId: "MOOMOO_MILK",
        price: 500,
      },
    ],
    accessRequirements: [
      "ROUTE_39_BARN_HEALED_MILTANK",
    ],
  },
  MAHOGANY_TOWN_STREET_VENDOR: {
    id: "MAHOGANY_TOWN_STREET_VENDOR",
    areaId: "MAHOGANY_TOWN",
    items: [
      {
        itemId: "RAGECANDYBAR",
        price: 300,
      },
    ],
  },
  GOLDENROD_GAME_CORNER_ITEM_SHOP: {
    id: "GOLDENROD_GAME_CORNER_ITEM_SHOP",
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
  CELADON_GAME_CORNER_ITEM_SHOP: {
    id: "CELADON_GAME_CORNER_ITEM_SHOP",
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
  RADIO_TOWER_2F_BLUE_CARD_SHOP: {
    id: "RADIO_TOWER_2F_BLUE_CARD_SHOP",
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
      "RADIO_TOWER_5F_EAST_AREA_DEFEATED_ROCKETS",
    ],
  },
}