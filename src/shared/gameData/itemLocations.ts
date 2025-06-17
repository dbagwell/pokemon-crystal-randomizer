import type { ItemLocation } from "@shared/types/gameData/itemLocation"
import { type BadgeLocationId, type FruitTreeLocationId, type HMGiftLocationId, type HMItemBallLocationId, type KeyItemGiftLocationId, type KeyItemHiddenItemLocationId, type KeyItemItemBallLocationId, type MenuItemGiftLocationId, type RegularGiftLocationId, type RegularHiddenItemLocationId, type RegularItemBallLocationId, type TMGiftLocationId, type TMItemBallLocationId } from "@shared/types/gameDataIds/itemLocations"

export const regularItemBallLocationsMap: IdMap<RegularItemBallLocationId, ItemLocation> = {
  ROUTE_2_SE_AREA_ITEM_BALL: {
    id: "ROUTE_2_SE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ELIXER",
    areaId: "ROUTE_2_SE_AREA",
    romOffsets: [[
      107,
      0x4304,
    ]],
  },
  ROUTE_2_DIGLETTS_CAVE_AREA_ITEM_BALL: {
    id: "ROUTE_2_DIGLETTS_CAVE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "CARBOS",
    areaId: "ROUTE_2_DIGLETTS_CAVE_AREA",
    romOffsets: [[
      107,
      0x4302,
    ]],
  },
  ROUTE_2_FOREST_AREA_ITEM_BALL_BY_VIRIDIAN_ENTRANCE: {
    id: "ROUTE_2_FOREST_AREA_ITEM_BALL_BY_VIRIDIAN_ENTRANCE",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "DIRE_HIT",
    areaId: "ROUTE_2_FOREST_AREA",
    romOffsets: [[
      107,
      0x42FE,
    ]],
  },
  ROUTE_2_FOREST_AREA_ITEM_BALL_BY_PEWTER_ENTRANCE: {
    id: "ROUTE_2_FOREST_AREA_ITEM_BALL_BY_PEWTER_ENTRANCE",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_POTION",
    areaId: "ROUTE_2_FOREST_AREA",
    romOffsets: [[
      107,
      0x4300,
    ]],
  },
  ROUTE_4_WEST_AREA_ITEM_BALL: {
    id: "ROUTE_4_WEST_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HP_UP",
    areaId: "ROUTE_4_WEST_AREA",
    romOffsets: [[
      107,
      0x620F,
    ]],
  },
  ROUTE_12_CUT_AREA_ITEM_BALL: {
    id: "ROUTE_12_CUT_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "CALCIUM",
    areaId: "ROUTE_12_CUT_AREA",
    romOffsets: [[
      105,
      0x700B,
    ]],
  },
  ROUTE_12_SURF_CUT_AREA_ITEM_BALL: {
    id: "ROUTE_12_SURF_CUT_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "NUGGET",
    areaId: "ROUTE_12_SURF_CUT_AREA",
    romOffsets: [[
      105,
      0x700D,
    ]],
  },
  ROUTE_15_CUT_AREA_ITEM_BALL: {
    id: "ROUTE_15_CUT_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PP_UP",
    areaId: "ROUTE_15_CUT_AREA",
    romOffsets: [[
      106,
      0x65E4,
    ]],
  },
  ROUTE_25_CUT_AREA_ITEM_BALL: {
    id: "ROUTE_25_CUT_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PROTEIN",
    areaId: "ROUTE_25_CUT_AREA",
    romOffsets: [[
      103,
      0x6FE3,
    ]],
  },
  ROUTE_26_ITEM_BALL: {
    id: "ROUTE_26_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_ELIXER",
    areaId: "ROUTE_26",
    romOffsets: [[
      105,
      0x4EC4,
    ]],
  },
  ROUTE_27_WEST_SURF_AREA_ITEM_BALL: {
    id: "ROUTE_27_WEST_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "RARE_CANDY",
    areaId: "ROUTE_27_WEST_SURF_AREA",
    romOffsets: [[
      104,
      0x4A64,
    ]],
  },
  ROUTE_29_ITEM_BALL: {
    id: "ROUTE_29_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "POTION",
    areaId: "ROUTE_29",
    romOffsets: [[
      104,
      0x508B,
    ]],
  },
  ROUTE_30_CHERRYGROVE_SIDE_ITEM_BALL: {
    id: "ROUTE_30_CHERRYGROVE_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ANTIDOTE",
    areaId: "ROUTE_30_CHERRYGROVE_SIDE",
    romOffsets: [[
      104,
      0x57F5,
    ]],
  },
  ROUTE_31_ITEM_BALL_BY_DARK_CAVE: {
    id: "ROUTE_31_ITEM_BALL_BY_DARK_CAVE",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "POTION",
    areaId: "ROUTE_31",
    romOffsets: [[
      105,
      0x55FB,
    ]],
  },
  ROUTE_31_ITEM_BALL_BY_TRAINER: {
    id: "ROUTE_31_ITEM_BALL_BY_TRAINER",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "POKE_BALL",
    areaId: "ROUTE_31",
    romOffsets: [[
      105,
      0x55FD,
    ]],
  },
  ROUTE_32_SOUTH_AREA_ITEM_BALL_IN_NORTH_GRASS: {
    id: "ROUTE_32_SOUTH_AREA_ITEM_BALL_IN_NORTH_GRASS",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "REPEL",
    areaId: "ROUTE_32_SOUTH_AREA",
    romOffsets: [[
      100,
      0x4775,
    ]],
  },
  ROUTE_32_SOUTH_AREA_ITEM_BALL_IN_SOUTH_GRASS: {
    id: "ROUTE_32_SOUTH_AREA_ITEM_BALL_IN_SOUTH_GRASS",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "GREAT_BALL",
    areaId: "ROUTE_32_SOUTH_AREA",
    romOffsets: [[
      100,
      0x4773,
    ]],
  },
  ROUTE_34_SURF_AREA_ITEM_BALL: {
    id: "ROUTE_34_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "NUGGET",
    areaId: "ROUTE_34_SURF_AREA",
    romOffsets: [[
      30,
      0x432B,
    ]],
  },
  ROUTE_42_MIDDLE_AREA_ITEM_BALL: {
    id: "ROUTE_42_MIDDLE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "SUPER_POTION",
    areaId: "ROUTE_42_MIDDLE_AREA",
    romOffsets: [[
      106,
      0x534B,
    ]],
  },
  ROUTE_42_ECRUTEAK_SIDE_ITEM_BALL: {
    id: "ROUTE_42_ECRUTEAK_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "ROUTE_42_ECRUTEAK_SIDE",
    romOffsets: [[
      106,
      0x5349,
    ]],
  },
  ROUTE_43_ITEM_BALL: {
    id: "ROUTE_43_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_ETHER",
    areaId: "ROUTE_43",
    romOffsets: [[
      103,
      0x5268,
    ]],
  },
  ROUTE_44_ITEM_BALL_BY_ICE_PATH: {
    id: "ROUTE_44_ITEM_BALL_BY_ICE_PATH",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "ROUTE_44",
    romOffsets: [[
      103,
      0x5A44,
    ]],
  },
  ROUTE_44_SURF_AREA_ITEM_BALL: {
    id: "ROUTE_44_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_REVIVE",
    areaId: "ROUTE_44_SURF_AREA",
    romOffsets: [[
      103,
      0x5A42,
    ]],
  },
  ROUTE_44_ITEM_BALL_BY_MAHOGANY: {
    id: "ROUTE_44_ITEM_BALL_BY_MAHOGANY",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_REPEL",
    areaId: "ROUTE_44",
    romOffsets: [[
      103,
      0x5A46,
    ]],
  },
  ROUTE_45_ITEM_BALL_1: {
    id: "ROUTE_45_ITEM_BALL_1",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ELIXER",
    areaId: "ROUTE_45",
    romOffsets: [[
      103,
      0x629A,
    ]],
  },
  ROUTE_45_ITEM_BALL_2: {
    id: "ROUTE_45_ITEM_BALL_2",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_POTION",
    areaId: "ROUTE_45",
    romOffsets: [[
      103,
      0x629C,
    ]],
  },
  ROUTE_45_ITEM_BALL_3: {
    id: "ROUTE_45_ITEM_BALL_3",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "NUGGET",
    areaId: "ROUTE_45",
    romOffsets: [[
      103,
      0x6296,
    ]],
  },
  ROUTE_45_ITEM_BALL_4: {
    id: "ROUTE_45_ITEM_BALL_4",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "REVIVE",
    areaId: "ROUTE_45",
    romOffsets: [[
      103,
      0x6298,
    ]],
  },
  ROUTE_46_NORTH_AREA_DARK_CAVE_SIDE_ITEM_BALL: {
    id: "ROUTE_46_NORTH_AREA_DARK_CAVE_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "X_SPEED",
    areaId: "ROUTE_46_NORTH_AREA",
    romOffsets: [[
      106,
      0x578D,
    ]],
  },
  DARK_CAVE_VIOLET_ENTRANCE_WEST_AREA_ITEM_BALL: {
    id: "DARK_CAVE_VIOLET_ENTRANCE_WEST_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "POTION",
    areaId: "DARK_CAVE_VIOLET_ENTRANCE_WEST_AREA",
    romOffsets: [[
      99,
      0x468E,
    ]],
  },
  DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_1: {
    id: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_1",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HYPER_POTION",
    areaId: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA",
    romOffsets: [[
      99,
      0x4692,
    ]],
  },
  DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_2: {
    id: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_2",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_HEAL",
    areaId: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA",
    romOffsets: [[
      99,
      0x4690,
    ]],
  },
  DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_3: {
    id: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_BALL_3",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "DIRE_HIT",
    areaId: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA",
    romOffsets: [[
      99,
      0x4694,
    ]],
  },
  DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_ON_PLATEAU: {
    id: "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_ON_PLATEAU",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "REVIVE",
    areaId: "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA",
    romOffsets: [[
      99,
      0x473B,
    ]],
  },
  VIOLET_CITY_SURF_AREA_EAST_ITEM_BALL: {
    id: "VIOLET_CITY_SURF_AREA_EAST_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "RARE_CANDY",
    areaId: "VIOLET_CITY_SURF_AREA",
    romOffsets: [[
      106,
      0x4423,
    ]],
  },
  VIOLET_CITY_SURF_AREA_WEST_ITEM_BALL: {
    id: "VIOLET_CITY_SURF_AREA_WEST_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PP_UP",
    areaId: "VIOLET_CITY_SURF_AREA",
    romOffsets: [[
      106,
      0x4421,
    ]],
  },
  SPROUT_TOWER_1F_NORTH_AREA_ITEM_BALL: {
    id: "SPROUT_TOWER_1F_NORTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PARLYZ_HEAL",
    areaId: "SPROUT_TOWER_1F_NORTH_AREA",
    romOffsets: [[
      97,
      0x451E,
    ]],
  },
  SPROUT_TOWER_2F_SW_AREA_ITEM_BALL: {
    id: "SPROUT_TOWER_2F_SW_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "X_ACCURACY",
    areaId: "SPROUT_TOWER_2F_SW_AREA",
    romOffsets: [[
      97,
      0x47A7,
    ]],
  },
  SPROUT_TOWER_3F_SW_ITEM_BALL: {
    id: "SPROUT_TOWER_3F_SW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "POTION",
    areaId: "SPROUT_TOWER_3F",
    romOffsets: [[
      97,
      0x4A19,
    ]],
  },
  SPROUT_TOWER_3F_NE_ITEM_BALL: {
    id: "SPROUT_TOWER_3F_NE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ESCAPE_ROPE",
    areaId: "SPROUT_TOWER_3F",
    romOffsets: [[
      97,
      0x4A1B,
    ]],
  },
  RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ENERGYPOWDER",
    areaId: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM",
    romOffsets: [[
      22,
      0x59A8,
    ]],
  },
  RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HEAL_POWDER",
    areaId: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM",
    romOffsets: [[
      22,
      0x59A6,
    ]],
  },
  RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PSNCUREBERRY",
    areaId: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM",
    romOffsets: [[
      22,
      0x59A4,
    ]],
  },
  RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "BERRY",
    areaId: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM",
    romOffsets: [[
      22,
      0x59A2,
    ]],
  },
  RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ENERGY_ROOT",
    areaId: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM",
    romOffsets: [[
      22,
      0x5ABC,
    ]],
  },
  RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HEAL_POWDER",
    areaId: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM",
    romOffsets: [[
      22,
      0x5ABA,
    ]],
  },
  RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MOON_STONE",
    areaId: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM",
    romOffsets: [[
      22,
      0x5AB8,
    ]],
  },
  RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "GOLD_BERRY",
    areaId: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM",
    romOffsets: [[
      22,
      0x5AB6,
    ]],
  },
  RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "STAR_PIECE",
    areaId: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM",
    romOffsets: [[
      22,
      0x5A32,
    ]],
  },
  RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "STARDUST",
    areaId: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM",
    romOffsets: [[
      22,
      0x5A30,
    ]],
  },
  RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MYSTIC_WATER",
    areaId: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM",
    romOffsets: [[
      22,
      0x5A2E,
    ]],
  },
  RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MYSTERYBERRY",
    areaId: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM",
    romOffsets: [[
      22,
      0x5A2C,
    ]],
  },
  RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "CHARCOAL",
    areaId: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM",
    romOffsets: [[
      22,
      0x591E,
    ]],
  },
  RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "REVIVAL_HERB",
    areaId: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM",
    romOffsets: [[
      22,
      0x591C,
    ]],
  },
  RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MYSTERYBERRY",
    areaId: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM",
    romOffsets: [[
      22,
      0x591A,
    ]],
  },
  RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "GOLD_BERRY",
    areaId: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM",
    romOffsets: [[
      22,
      0x5918,
    ]],
  },
  UNION_CAVE_1F_ITEM_BALL_1: {
    id: "UNION_CAVE_1F_ITEM_BALL_1",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "X_ATTACK",
    areaId: "UNION_CAVE_1F",
    romOffsets: [[
      22,
      0x5C02,
    ]],
  },
  UNION_CAVE_1F_ITEM_BALL_2: {
    id: "UNION_CAVE_1F_ITEM_BALL_2",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "POTION",
    areaId: "UNION_CAVE_1F",
    romOffsets: [[
      22,
      0x5C04,
    ]],
  },
  UNION_CAVE_1F_ITEM_BALL_3: {
    id: "UNION_CAVE_1F_ITEM_BALL_3",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "GREAT_BALL",
    areaId: "UNION_CAVE_1F",
    romOffsets: [[
      22,
      0x5C00,
    ]],
  },
  UNION_CAVE_1F_ITEM_BALL_4: {
    id: "UNION_CAVE_1F_ITEM_BALL_4",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "AWAKENING",
    areaId: "UNION_CAVE_1F",
    romOffsets: [[
      22,
      0x5C08,
    ]],
  },
  UNION_CAVE_B1F_MIDDLE_AREA_EAST_ITEM_BALL: {
    id: "UNION_CAVE_B1F_MIDDLE_AREA_EAST_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "X_DEFEND",
    areaId: "UNION_CAVE_B1F_MIDDLE_AREA",
    romOffsets: [[
      22,
      0x6018,
    ]],
  },
  UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_IN_NE_CORNER: {
    id: "UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_IN_NE_CORNER",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ELIXER",
    areaId: "UNION_CAVE_B2F_SURF_AREA",
    romOffsets: [[
      22,
      0x636A,
    ]],
  },
  UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_ON_PLATEAU: {
    id: "UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_ON_PLATEAU",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HYPER_POTION",
    areaId: "UNION_CAVE_B2F_SURF_AREA",
    romOffsets: [[
      22,
      0x636C,
    ]],
  },
  SLOWPOKE_WELL_B1F_EAST_AREA_ITEM_BALL: {
    id: "SLOWPOKE_WELL_B1F_EAST_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "SUPER_POTION",
    areaId: "SLOWPOKE_WELL_B1F_EAST_AREA",
    romOffsets: [[
      22,
      0x66A3,
    ]],
  },
  ILEX_FOREST_SOUTH_AREA_ITEM_BALL: {
    id: "ILEX_FOREST_SOUTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "REVIVE",
    areaId: "ILEX_FOREST_SOUTH_AREA",
    romOffsets: [[
      27,
      0x6E10,
    ]],
  },
  ILEX_FOREST_NORTH_AREA_ITEM_BALL_1: {
    id: "ILEX_FOREST_NORTH_AREA_ITEM_BALL_1",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "X_ATTACK",
    areaId: "ILEX_FOREST_NORTH_AREA",
    romOffsets: [[
      27,
      0x6E12,
    ]],
  },
  ILEX_FOREST_NORTH_AREA_ITEM_BALL_2: {
    id: "ILEX_FOREST_NORTH_AREA_ITEM_BALL_2",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ANTIDOTE",
    areaId: "ILEX_FOREST_NORTH_AREA",
    romOffsets: [[
      27,
      0x6E14,
    ]],
  },
  ILEX_FOREST_NORTH_AREA_ITEM_BALL_3: {
    id: "ILEX_FOREST_NORTH_AREA_ITEM_BALL_3",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ETHER",
    areaId: "ILEX_FOREST_NORTH_AREA",
    romOffsets: [[
      27,
      0x6E16,
    ]],
  },
  NATIONAL_PARK_EAST_ITEM_BALL: {
    id: "NATIONAL_PARK_EAST_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PARLYZ_HEAL",
    areaId: "NATIONAL_PARK_ITEMS_GROUP",
    romOffsets: [
      [
        23,
        0x41CC,
      ],
      [
        23,
        0x4945,
      ],
    ],
  },
  BURNED_TOWER_1F_ROCK_SMASH_AREA_ITEM_BALL: {
    id: "BURNED_TOWER_1F_ROCK_SMASH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HP_UP",
    areaId: "BURNED_TOWER_1F_ROCK_SMASH_AREA",
    romOffsets: [[
      97,
      0x5CCB,
    ]],
  },
  TIN_TOWER_3F_ITEM_BALL: {
    id: "TIN_TOWER_3F_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_HEAL",
    areaId: "TIN_TOWER_3F",
    romOffsets: [[
      97,
      0x5A37,
    ]],
  },
  TIN_TOWER_4F_SE_ITEM_BALL: {
    id: "TIN_TOWER_4F_SE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PP_UP",
    areaId: "TIN_TOWER_4F",
    romOffsets: [[
      97,
      0x5A5A,
    ]],
  },
  TIN_TOWER_4F_SW_ITEM_BALL: {
    id: "TIN_TOWER_4F_SW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ESCAPE_ROPE",
    areaId: "TIN_TOWER_4F",
    romOffsets: [[
      97,
      0x5A5C,
    ]],
  },
  TIN_TOWER_4F_CENTRAL_ITEM_BALL: {
    id: "TIN_TOWER_4F_CENTRAL_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "TIN_TOWER_4F",
    romOffsets: [[
      97,
      0x5A58,
    ]],
  },
  TIN_TOWER_5F_NORTH_AREA_ITEM_BALL: {
    id: "TIN_TOWER_5F_NORTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "RARE_CANDY",
    areaId: "TIN_TOWER_5F_NORTH_AREA",
    romOffsets: [[
      97,
      0x5AA9,
    ]],
  },
  TIN_TOWER_6F_ITEM_BALL: {
    id: "TIN_TOWER_6F_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_POTION",
    areaId: "TIN_TOWER_6F",
    romOffsets: [[
      97,
      0x5AE4,
    ]],
  },
  TIN_TOWER_7F_OUTER_AREA_ITEM_BALL: {
    id: "TIN_TOWER_7F_OUTER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_REVIVE",
    areaId: "TIN_TOWER_7F_OUTER_AREA",
    romOffsets: [[
      97,
      0x5B05,
    ]],
  },
  TIN_TOWER_8F_NORTH_AREA_ITEM_BALL: {
    id: "TIN_TOWER_8F_NORTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_RESTORE",
    areaId: "TIN_TOWER_8F_NORTH_AREA",
    romOffsets: [[
      97,
      0x5B39,
    ]],
  },
  TIN_TOWER_8F_MIDDLE_AREA_ITEM_BALL: {
    id: "TIN_TOWER_8F_MIDDLE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_ELIXER",
    areaId: "TIN_TOWER_8F_MIDDLE_AREA",
    romOffsets: [[
      97,
      0x5B37,
    ]],
  },
  TIN_TOWER_8F_SOUTH_AREA_ITEM_BALL: {
    id: "TIN_TOWER_8F_SOUTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "NUGGET",
    areaId: "TIN_TOWER_8F_SOUTH_AREA",
    romOffsets: [[
      97,
      0x5B35,
    ]],
  },
  TIN_TOWER_9F_NORTH_AREA_ITEM_BALL: {
    id: "TIN_TOWER_9F_NORTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HP_UP",
    areaId: "TIN_TOWER_9F_NORTH_AREA",
    romOffsets: [[
      97,
      0x5B88,
    ]],
  },
  OLIVINE_LIGHTHOUSE_3F_INNER_AREA_ITEM_BALL: {
    id: "OLIVINE_LIGHTHOUSE_3F_INNER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ETHER",
    areaId: "OLIVINE_LIGHTHOUSE_3F_INNER_AREA",
    romOffsets: [[
      22,
      0x7279,
    ]],
  },
  OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_HOLE: {
    id: "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_HOLE",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "RARE_CANDY",
    areaId: "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA",
    romOffsets: [[
      24,
      0x49AA,
    ]],
  },
  OLIVINE_LIGHTHOUSE_5F_INNER_AREA_ITEM_BALL: {
    id: "OLIVINE_LIGHTHOUSE_5F_INNER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "SUPER_REPEL",
    areaId: "OLIVINE_LIGHTHOUSE_5F_INNER_AREA",
    romOffsets: [[
      24,
      0x49AC,
    ]],
  },
  OLIVINE_LIGHTHOUSE_6F_ITEM_BALL: {
    id: "OLIVINE_LIGHTHOUSE_6F_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "SUPER_POTION",
    areaId: "OLIVINE_LIGHTHOUSE_6F",
    romOffsets: [[
      24,
      0x4C66,
    ]],
  },
  WHIRL_ISLAND_NE_BOTTOM_LEDGE_AREA_ITEM_BALL: {
    id: "WHIRL_ISLAND_NE_BOTTOM_LEDGE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "WHIRL_ISLAND_NE_BOTTOM_LEDGE_AREA",
    romOffsets: [[
      99,
      0x4396,
    ]],
  },
  WHIRL_ISLAND_SW_ENTRANCE_EAST_AREA_ITEM_BALL: {
    id: "WHIRL_ISLAND_SW_ENTRANCE_EAST_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "WHIRL_ISLAND_SW_ENTRANCE_EAST_AREA",
    romOffsets: [[
      99,
      0x43BC,
    ]],
  },
  WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_IN_MIDDLE_OF_LEDGES: {
    id: "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_IN_MIDDLE_OF_LEDGES",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "NUGGET",
    areaId: "WHIRL_ISLAND_B1F_NORTH_AREA",
    romOffsets: [[
      99,
      0x4416,
    ]],
  },
  WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_NW_LADDER: {
    id: "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_NW_LADDER",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_RESTORE",
    areaId: "WHIRL_ISLAND_B1F_NORTH_AREA",
    romOffsets: [[
      99,
      0x4410,
    ]],
  },
  WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_LADDER_TO_B2F_ISOLATED_AREA: {
    id: "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_LADDER_TO_B2F_ISOLATED_AREA",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "CARBOS",
    areaId: "WHIRL_ISLAND_B1F_NORTH_AREA",
    romOffsets: [[
      99,
      0x4412,
    ]],
  },
  WHIRL_ISLAND_B1F_SW_AREA_ITEM_BALL: {
    id: "WHIRL_ISLAND_B1F_SW_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ESCAPE_ROPE",
    areaId: "WHIRL_ISLAND_B1F_SW_AREA",
    romOffsets: [[
      99,
      0x4418,
    ]],
  },
  WHIRL_ISLAND_B1F_SE_AREA_ITEM_BALL: {
    id: "WHIRL_ISLAND_B1F_SE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "CALCIUM",
    areaId: "WHIRL_ISLAND_B1F_SE_AREA",
    romOffsets: [[
      99,
      0x4414,
    ]],
  },
  WHIRL_ISLAND_B2F_ABOVE_WATERFALL_AREA_ITEM_BALL: {
    id: "WHIRL_ISLAND_B2F_ABOVE_WATERFALL_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_REVIVE",
    areaId: "WHIRL_ISLAND_B2F_ABOVE_WATERFALL_AREA",
    romOffsets: [[
      99,
      0x44BA,
    ]],
  },
  WHIRL_ISLAND_B2F_ISOLATED_AREA_EAST_ITEM_BALL: {
    id: "WHIRL_ISLAND_B2F_ISOLATED_AREA_EAST_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_RESTORE",
    areaId: "WHIRL_ISLAND_B2F_ISOLATED_AREA",
    romOffsets: [[
      99,
      0x44B8,
    ]],
  },
  WHIRL_ISLAND_B2F_ISOLATED_AREA_WEST_ITEM_BALL: {
    id: "WHIRL_ISLAND_B2F_ISOLATED_AREA_WEST_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_ELIXER",
    areaId: "WHIRL_ISLAND_B2F_ISOLATED_AREA",
    romOffsets: [[
      99,
      0x44BC,
    ]],
  },
  MOUNT_MORTAR_FRONT_EAST_LADDER_AREA_ITEM_BALL: {
    id: "MOUNT_MORTAR_FRONT_EAST_LADDER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "REVIVE",
    areaId: "MOUNT_MORTAR_FRONT_EAST_LADDER_AREA",
    romOffsets: [[
      31,
      0x5DF8,
    ]],
  },
  MOUNT_MORTAR_FRONT_WEST_LADDER_AREA_ITEM_BALL: {
    id: "MOUNT_MORTAR_FRONT_WEST_LADDER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ETHER",
    areaId: "MOUNT_MORTAR_FRONT_WEST_LADDER_AREA",
    romOffsets: [[
      31,
      0x5DF6,
    ]],
  },
  MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1: {
    id: "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_1",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HYPER_POTION",
    areaId: "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA",
    romOffsets: [[
      31,
      0x5E80,
    ]],
  },
  MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2: {
    id: "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_2",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA",
    romOffsets: [[
      31,
      0x5E88,
    ]],
  },
  MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3: {
    id: "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_3",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "NUGGET",
    areaId: "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA",
    romOffsets: [[
      31,
      0x5E84,
    ]],
  },
  MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4: {
    id: "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA_ITEM_BALL_4",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ESCAPE_ROPE",
    areaId: "MOUNT_MORTAR_BACK_1F_MIDDLE_AREA",
    romOffsets: [[
      31,
      0x5E7C,
    ]],
  },
  MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_ON_PLATEAU: {
    id: "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_ON_PLATEAU",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "IRON",
    areaId: "MOUNT_MORTAR_BACK_1F_NORTH_AREA",
    romOffsets: [[
      31,
      0x5E86,
    ]],
  },
  MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_SOUTH_OF_PLATEAU: {
    id: "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_SOUTH_OF_PLATEAU",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_POTION",
    areaId: "MOUNT_MORTAR_BACK_1F_NORTH_AREA",
    romOffsets: [[
      31,
      0x5E82,
    ]],
  },
  MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_NORTH_OF_PLATEAU: {
    id: "MOUNT_MORTAR_BACK_1F_NORTH_AREA_ITEM_BALL_NORTH_OF_PLATEAU",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_REVIVE",
    areaId: "MOUNT_MORTAR_BACK_1F_NORTH_AREA",
    romOffsets: [[
      31,
      0x5E7E,
    ]],
  },
  MOUNT_MORTAR_BACK_2F_SURF_AREA_NW_ITEM_BALL: {
    id: "MOUNT_MORTAR_BACK_2F_SURF_AREA_NW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ELIXER",
    areaId: "MOUNT_MORTAR_BACK_2F_SURF_AREA",
    romOffsets: [[
      31,
      0x60E6,
    ]],
  },
  MOUNT_MORTAR_BACK_2F_SURF_AREA_SE_ITEM_BALL: {
    id: "MOUNT_MORTAR_BACK_2F_SURF_AREA_SE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_POTION",
    areaId: "MOUNT_MORTAR_BACK_2F_SURF_AREA",
    romOffsets: [[
      31,
      0x60DE,
    ]],
  },
  MOUNT_MORTAR_BACK_2F_SURF_AREA_SW_ITEM_BALL: {
    id: "MOUNT_MORTAR_BACK_2F_SURF_AREA_SW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "RARE_CANDY",
    areaId: "MOUNT_MORTAR_BACK_2F_SURF_AREA",
    romOffsets: [[
      31,
      0x60E0,
    ]],
  },
  MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_EAST_PLATEAU: {
    id: "MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_EAST_PLATEAU",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ESCAPE_ROPE",
    areaId: "MOUNT_MORTAR_BACK_2F_NORTH_AREA",
    romOffsets: [[
      31,
      0x60E8,
    ]],
  },
  MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_WEST_PLATEAU: {
    id: "MOUNT_MORTAR_BACK_2F_NORTH_AREA_ITEM_BALL_ON_WEST_PLATEAU",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "DRAGON_SCALE",
    areaId: "MOUNT_MORTAR_BACK_2F_NORTH_AREA",
    romOffsets: [[
      31,
      0x60E4,
    ]],
  },
  MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_1: {
    id: "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_1",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_RESTORE",
    areaId: "MOUNT_MORTAR_B1F_SURF_AREA",
    romOffsets: [[
      31,
      0x6244,
    ]],
  },
  MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_2: {
    id: "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_2",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HYPER_POTION",
    areaId: "MOUNT_MORTAR_B1F_SURF_AREA",
    romOffsets: [[
      31,
      0x6240,
    ]],
  },
  MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_3: {
    id: "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_3",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_ETHER",
    areaId: "MOUNT_MORTAR_B1F_SURF_AREA",
    romOffsets: [[
      31,
      0x6246,
    ]],
  },
  MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_4: {
    id: "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_4",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PP_UP",
    areaId: "MOUNT_MORTAR_B1F_SURF_AREA",
    romOffsets: [[
      31,
      0x6248,
    ]],
  },
  MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_5: {
    id: "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_5",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "CARBOS",
    areaId: "MOUNT_MORTAR_B1F_SURF_AREA",
    romOffsets: [[
      31,
      0x6242,
    ]],
  },
  LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_SOUTH_OF_HOUSE: {
    id: "LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_SOUTH_OF_HOUSE",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ELIXER",
    areaId: "LAKE_OF_RAGE_CUT_AREA",
    romOffsets: [[
      28,
      0x4148,
    ]],
  },
  GOLDENROD_DEPT_STORE_B1F_STORAGE_AREA_NW_ITEM_BALL: {
    id: "GOLDENROD_DEPT_STORE_B1F_STORAGE_AREA_NW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "BURN_HEAL",
    areaId: "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA",
    romOffsets: [[
      31,
      0x57C7,
    ]],
  },
  GOLDENROD_DEPT_STORE_B1F_STORAGE_AREA_SW_ITEM_BALL: {
    id: "GOLDENROD_DEPT_STORE_B1F_STORAGE_AREA_SW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ETHER",
    areaId: "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA",
    romOffsets: [[
      31,
      0x57C3,
    ]],
  },
  GOLDENROD_DEPT_STORE_B1F_STORAGE_AREA_SE_ITEM_BALL: {
    id: "GOLDENROD_DEPT_STORE_B1F_STORAGE_AREA_SE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA",
    romOffsets: [[
      31,
      0x57C9,
    ]],
  },
  GOLDENROD_DEPT_STORE_B1F_STAIRS_AREA_ITEM_BALL: {
    id: "GOLDENROD_DEPT_STORE_B1F_STAIRS_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "AMULET_COIN",
    areaId: "GOLDENROD_DEPT_STORE_B1F_STAIRS_AREA",
    romOffsets: [[
      31,
      0x57C5,
    ]],
  },
  GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_RIGHT_ITEM_BALL: {
    id: "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_RIGHT_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_HEAL",
    areaId: "GOLDENROD_UNDERGROUND_SWITCH_ROOM",
    romOffsets: [[
      31,
      0x4E7F,
    ]],
  },
  GOLDENROD_UNDERGROUND_SWITCH_ROOM_BOTTOM_LEFT_ITEM_BALL: {
    id: "GOLDENROD_UNDERGROUND_SWITCH_ROOM_BOTTOM_LEFT_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "SMOKE_BALL",
    areaId: "GOLDENROD_UNDERGROUND_SWITCH_ROOM",
    romOffsets: [[
      31,
      0x4E7D,
    ]],
  },
  GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_1: {
    id: "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_1",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "GOLDENROD_UNDERGROUND_WAREHOUSE",
    romOffsets: [[
      31,
      0x59E8,
    ]],
  },
  GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_2: {
    id: "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_2",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_ETHER",
    areaId: "GOLDENROD_UNDERGROUND_WAREHOUSE",
    romOffsets: [[
      31,
      0x59E4,
    ]],
  },
  RADIO_TOWER_5F_EAST_AREA_ITEM_BALL: {
    id: "RADIO_TOWER_5F_EAST_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "RADIO_TOWER_5F_EAST_AREA",
    romOffsets: [[
      24,
      0x40FE,
    ]],
  },
  TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_MIDDLE_STATUE: {
    id: "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_MIDDLE_STATUE",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HYPER_POTION",
    areaId: "TEAM_ROCKET_BASE_B1F",
    romOffsets: [[
      27,
      0x4AC4,
    ]],
  },
  TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_COMPUTER: {
    id: "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_COMPUTER",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "GUARD_SPEC",
    areaId: "TEAM_ROCKET_BASE_B1F",
    romOffsets: [[
      27,
      0x4AC8,
    ]],
  },
  TEAM_ROCKET_BASE_B1F_ITEM_BALL_BETWEEN_SOUTH_STATUES: {
    id: "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BETWEEN_SOUTH_STATUES",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "NUGGET",
    areaId: "TEAM_ROCKET_BASE_B1F",
    romOffsets: [[
      27,
      0x4AC6,
    ]],
  },
  TEAM_ROCKET_BASE_B3F_SE_AREA_LEFT_ITEM_BALL_BY_PLANTS: {
    id: "TEAM_ROCKET_BASE_B3F_SE_AREA_LEFT_ITEM_BALL_BY_PLANTS",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PROTEIN",
    areaId: "TEAM_ROCKET_BASE_B3F_SE_AREA",
    romOffsets: [[
      27,
      0x6120,
    ]],
  },
  TEAM_ROCKET_BASE_B3F_SE_AREA_RIGHT_ITEM_BALL_BY_PLANTS: {
    id: "TEAM_ROCKET_BASE_B3F_SE_AREA_RIGHT_ITEM_BALL_BY_PLANTS",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "X_SPECIAL",
    areaId: "TEAM_ROCKET_BASE_B3F_SE_AREA",
    romOffsets: [[
      27,
      0x6122,
    ]],
  },
  TEAM_ROCKET_BASE_B3F_SE_AREA_NORTH_ITEM_BALL: {
    id: "TEAM_ROCKET_BASE_B3F_SE_AREA_NORTH_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ICE_HEAL",
    areaId: "TEAM_ROCKET_BASE_B3F_SE_AREA",
    romOffsets: [[
      27,
      0x6126,
    ]],
  },
  TEAM_ROCKET_BASE_B3F_SE_AREA_ITEM_BALL_BETWEEN_STAIRS: {
    id: "TEAM_ROCKET_BASE_B3F_SE_AREA_ITEM_BALL_BETWEEN_STAIRS",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_HEAL",
    areaId: "TEAM_ROCKET_BASE_B3F_SE_AREA",
    romOffsets: [[
      27,
      0x6124,
    ]],
  },
  TEAM_ROCKET_BASE_B3F_NW_AREA_ITEM_BALL: {
    id: "TEAM_ROCKET_BASE_B3F_NW_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "TEAM_ROCKET_BASE_B3F_NW_AREA",
    romOffsets: [[
      27,
      0x6128,
    ]],
  },
  ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_ON_PLATEAU: {
    id: "ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_ON_PLATEAU",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PROTEIN",
    areaId: "ICE_PATH_1F_BLACKTHORN_SIDE",
    romOffsets: [[
      31,
      0x6476,
    ]],
  },
  ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_BY_ICE: {
    id: "ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_BY_ICE",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PP_UP",
    areaId: "ICE_PATH_1F_BLACKTHORN_SIDE",
    romOffsets: [[
      31,
      0x6474,
    ]],
  },
  ICE_PATH_B1F_BLACKTHORN_SIDE_ITEM_BALL: {
    id: "ICE_PATH_B1F_BLACKTHORN_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "IRON",
    areaId: "ICE_PATH_B1F_BLACKTHORN_SIDE",
    romOffsets: [[
      31,
      0x650D,
    ]],
  },
  ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_ITEM_BALL: {
    id: "ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_POTION",
    areaId: "ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA",
    romOffsets: [[
      31,
      0x65A8,
    ]],
  },
  ICE_PATH_B2F_MAHOGANY_SIDE_CENTRAL_AREA_ITEM_BALL: {
    id: "ICE_PATH_B2F_MAHOGANY_SIDE_CENTRAL_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_HEAL",
    areaId: "ICE_PATH_B2F_MAHOGANY_SIDE_CENTRAL_AREA",
    romOffsets: [[
      31,
      0x65A6,
    ]],
  },
  ICE_PATH_B3F_ITEM_BALL: {
    id: "ICE_PATH_B3F_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "NEVERMELTICE",
    areaId: "ICE_PATH_B3F",
    romOffsets: [[
      31,
      0x666F,
    ]],
  },
  DRAGONS_DEN_B1F_NORTH_AREA_ITEM_BALL: {
    id: "DRAGONS_DEN_B1F_NORTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "CALCIUM",
    areaId: "DRAGONS_DEN_B1F_NORTH_AREA",
    romOffsets: [[
      99,
      0x49A1,
    ]],
  },
  DRAGONS_DEN_B1F_NORTH_SURF_AREA_ITEM_BALL: {
    id: "DRAGONS_DEN_B1F_NORTH_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_ELIXER",
    areaId: "DRAGONS_DEN_B1F_NORTH_SURF_AREA",
    romOffsets: [[
      99,
      0x49A3,
    ]],
  },
  DRAGONS_DEN_B1F_SOUTH_SURF_AREA_ITEM_BALL: {
    id: "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "DRAGON_FANG",
    areaId: "DRAGONS_DEN_B1F_SOUTH_SURF_AREA",
    romOffsets: [[
      99,
      0x495B,
    ]],
  },
  TOHJO_FALLS_WEST_SURF_AREA_ITEM_BALL: {
    id: "TOHJO_FALLS_WEST_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MOON_STONE",
    areaId: "TOHJO_FALLS_WEST_SURF_AREA",
    romOffsets: [[
      99,
      0x5B02,
    ]],
  },
  VICTORY_ROAD_1F_RIGHT_ITEM_BALL: {
    id: "VICTORY_ROAD_1F_RIGHT_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_HEAL",
    areaId: "VICTORY_ROAD_1F",
    romOffsets: [[
      29,
      0x452F,
    ]],
  },
  VICTORY_ROAD_1F_LEFT_ITEM_BALL: {
    id: "VICTORY_ROAD_1F_LEFT_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_REVIVE",
    areaId: "VICTORY_ROAD_1F",
    romOffsets: [[
      29,
      0x452B,
    ]],
  },
  VICTORY_ROAD_2F_NE_AREA_ITEM_BALL: {
    id: "VICTORY_ROAD_2F_NE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_RESTORE",
    areaId: "VICTORY_ROAD_2F_NE_AREA",
    romOffsets: [[
      29,
      0x452D,
    ]],
  },
  VICTORY_ROAD_2F_SOUTH_AREA_ITEM_BALL: {
    id: "VICTORY_ROAD_2F_SOUTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "HP_UP",
    areaId: "VICTORY_ROAD_2F_SOUTH_AREA",
    romOffsets: [[
      29,
      0x4531,
    ]],
  },
  FIGHTING_DOJO_ITEM_BALL: {
    id: "FIGHTING_DOJO_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "BLACKBELT",
    areaId: "FIGHTING_DOJO",
    romOffsets: [[
      98,
      0x5B61,
    ]],
  },
  ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_WEST_OF_PLATEAU: {
    id: "ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_WEST_OF_PLATEAU",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ELIXER",
    areaId: "ROCK_TUNNEL_1F_LAVENDER_SIDE",
    romOffsets: [[
      29,
      0x43B5,
    ]],
  },
  ROCK_TUNNEL_B1F_NW_AREA_NORTH_ITEM_BALL: {
    id: "ROCK_TUNNEL_B1F_NW_AREA_NORTH_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "REVIVE",
    areaId: "ROCK_TUNNEL_B1F_NW_AREA",
    romOffsets: [[
      29,
      0x440D,
    ]],
  },
  ROCK_TUNNEL_B1F_NW_AREA_SOUTH_ITEM_BALL: {
    id: "ROCK_TUNNEL_B1F_NW_AREA_SOUTH_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PP_UP",
    areaId: "ROCK_TUNNEL_B1F_NW_AREA",
    romOffsets: [[
      29,
      0x440B,
    ]],
  },
  ROCK_TUNNEL_B1F_SE_AREA_ITEM_BALL: {
    id: "ROCK_TUNNEL_B1F_SE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "IRON",
    areaId: "ROCK_TUNNEL_B1F_SE_AREA",
    romOffsets: [[
      29,
      0x4409,
    ]],
  },
  SILVER_CAVE_ROOM_1_NORTH_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_1_NORTH_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_ELIXER",
    areaId: "SILVER_CAVE_ROOM_1",
    romOffsets: [[
      99,
      0x4554,
    ]],
  },
  SILVER_CAVE_ROOM_1_CENTRAL_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_1_CENTRAL_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "SILVER_CAVE_ROOM_1",
    romOffsets: [[
      99,
      0x455A,
    ]],
  },
  SILVER_CAVE_ROOM_1_SE_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_1_SE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PROTEIN",
    areaId: "SILVER_CAVE_ROOM_1",
    romOffsets: [[
      99,
      0x4556,
    ]],
  },
  SILVER_CAVE_ROOM_1_SW_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_1_SW_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ESCAPE_ROPE",
    areaId: "SILVER_CAVE_ROOM_1",
    romOffsets: [[
      99,
      0x4558,
    ]],
  },
  SILVER_CAVE_ROOM_2_ABOVE_NE_WATERFALL_AREA_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_2_ABOVE_NE_WATERFALL_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "PP_UP",
    areaId: "SILVER_CAVE_ROOM_2_ABOVE_NE_WATERFALL_AREA",
    romOffsets: [[
      99,
      0x45B6,
    ]],
  },
  SILVER_CAVE_ROOM_2_ABOVE_SW_WATERFALL_SURF_AREA_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_2_ABOVE_SW_WATERFALL_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "ULTRA_BALL",
    areaId: "SILVER_CAVE_ROOM_2_ABOVE_SW_WATERFALL_SURF_AREA",
    romOffsets: [[
      99,
      0x45B4,
    ]],
  },
  SILVER_CAVE_ROOM_2_MAIN_AREA_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_2_MAIN_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "CALCIUM",
    areaId: "SILVER_CAVE_ROOM_2_MAIN_AREA",
    romOffsets: [[
      99,
      0x45B2,
    ]],
  },
  SILVER_CAVE_ITEM_ROOMS_NE_AREA_ITEM_BALL: {
    id: "SILVER_CAVE_ITEM_ROOMS_NE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "FULL_RESTORE",
    areaId: "SILVER_CAVE_ITEM_ROOMS_NE_AREA",
    romOffsets: [[
      99,
      0x4660,
    ]],
  },
  SILVER_CAVE_ITEM_ROOMS_SW_AREA_ITEM_BALL: {
    id: "SILVER_CAVE_ITEM_ROOMS_SW_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "REGULAR_ITEM_BALLS",
    itemId: "MAX_REVIVE",
    areaId: "SILVER_CAVE_ITEM_ROOMS_SW_AREA",
    romOffsets: [[
      99,
      0x465E,
    ]],
  },
}

export const tmItemBallLocationsMap: IdMap<TMItemBallLocationId, ItemLocation> = {
  ROUTE_27_WHIRLPOOL_AREA_ITEM_BALL: {
    id: "ROUTE_27_WHIRLPOOL_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM22",
    areaId: "ROUTE_27_WHIRLPOOL_AREA",
    romOffsets: [[
      104,
      0x4A62,
    ]],
  },
  ROUTE_35_ITEM_BALL: {
    id: "ROUTE_35_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM04",
    areaId: "ROUTE_35",
    romOffsets: [[
      103,
      0x4A7C,
    ]],
  },
  DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_BY_LEDGE: {
    id: "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_BY_LEDGE",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM13",
    areaId: "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA",
    romOffsets: [[
      99,
      0x473D,
    ]],
  },
  UNION_CAVE_B1F_MIDDLE_AREA_WEST_ITEM_BALL: {
    id: "UNION_CAVE_B1F_MIDDLE_AREA_WEST_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM39",
    areaId: "UNION_CAVE_B1F_MIDDLE_AREA",
    romOffsets: [[
      22,
      0x6016,
    ]],
  },
  SLOWPOKE_WELL_B2F_SURF_AREA_ITEM_BALL: {
    id: "SLOWPOKE_WELL_B2F_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM18",
    areaId: "SLOWPOKE_WELL_B2F_SURF_AREA",
    romOffsets: [[
      22,
      0x6D28,
    ]],
  },
  NATIONAL_PARK_WEST_ITEM_BALL: {
    id: "NATIONAL_PARK_WEST_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM28",
    areaId: "NATIONAL_PARK_ITEMS_GROUP",
    romOffsets: [
      [
        23,
        0x41CE,
      ], [
        23,
        0x4947,
      ],
    ],
  },
  BURNED_TOWER_B1F_STRENGTH_AREA_ITEM_BALL: {
    id: "BURNED_TOWER_B1F_STRENGTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM20",
    areaId: "BURNED_TOWER_B1F_STRENGTH_AREA",
    romOffsets: [[
      97,
      0x6231,
    ]],
  },
  OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_STAIRS: {
    id: "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_STAIRS",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM34",
    areaId: "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA",
    romOffsets: [[
      24,
      0x49AE,
    ]],
  },
  MOUNT_MORTAR_BACK_2F_SURF_AREA_CENTRAL_ITEM_BALL: {
    id: "MOUNT_MORTAR_BACK_2F_SURF_AREA_CENTRAL_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM40",
    areaId: "MOUNT_MORTAR_BACK_2F_SURF_AREA",
    romOffsets: [[
      31,
      0x60E2,
    ]],
  },
  LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_EAST_OF_HOUSE: {
    id: "LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_EAST_OF_HOUSE",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM43",
    areaId: "LAKE_OF_RAGE_CUT_AREA",
    romOffsets: [[
      28,
      0x414A,
    ]],
  },
  GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_3: {
    id: "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_3",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM35",
    areaId: "GOLDENROD_UNDERGROUND_WAREHOUSE",
    romOffsets: [[
      31,
      0x59E6,
    ]],
  },
  TEAM_ROCKET_BASE_B2F_WEST_AREA_ITEM_BALL: {
    id: "TEAM_ROCKET_BASE_B2F_WEST_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM46",
    areaId: "TEAM_ROCKET_BASE_B2F_WEST_AREA",
    romOffsets: [[
      27,
      0x520D,
    ]],
  },
  ICE_PATH_B2F_BLACKTHORN_SIDE_ITEM_BALL: {
    id: "ICE_PATH_B2F_BLACKTHORN_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM44",
    areaId: "ICE_PATH_B2F_BLACKTHORN_SIDE",
    romOffsets: [[
      31,
      0x6646,
    ]],
  },
  VICTORY_ROAD_2F_NW_AREA_ITEM_BALL: {
    id: "VICTORY_ROAD_2F_NW_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM26",
    areaId: "VICTORY_ROAD_2F_NW_AREA",
    romOffsets: [[
      29,
      0x4529,
    ]],
  },
  ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_ON_PLATEAU: {
    id: "ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_ON_PLATEAU",
    type: "ITEM_BALL",
    groupId: "TM_ITEM_BALLS",
    itemId: "TM47",
    areaId: "ROCK_TUNNEL_1F_LAVENDER_SIDE",
    romOffsets: [[
      29,
      0x43B7,
    ]],
  },
}

export const hmItemBallLocationsMap: IdMap<HMItemBallLocationId, ItemLocation> = {
  ICE_PATH_1F_MAHOGANY_SIDE_ITEM_BALL: {
    id: "ICE_PATH_1F_MAHOGANY_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "HMS",
    itemId: "HM07",
    areaId: "ICE_PATH_1F_MAHOGANY_SIDE",
    romOffsets: [[
      31,
      0x6472,
    ]],
  },
}

export const keyItemItemBallLocationsMap: IdMap<KeyItemItemBallLocationId, ItemLocation> = {
  GOLDENROD_UNDERGROUND_ITEM_BALL: {
    id: "GOLDENROD_UNDERGROUND_ITEM_BALL",
    type: "ITEM_BALL",
    groupId: "KEY_ITEMS",
    itemId: "COIN_CASE",
    areaId: "GOLDENROD_UNDERGROUND",
    romOffsets: [[
      31,
      0x4306,
    ]],
  },
}

export const regularHiddenItemLocationsMap: IdMap<RegularHiddenItemLocationId, ItemLocation> = {
  ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_VIRIDIAN_ENTRANCE: {
    id: "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_VIRIDIAN_ENTRANCE",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_RESTORE",
    areaId: "ROUTE_2_FOREST_AREA",
    romOffsets: [[
      107,
      0x4310,
    ]],
  },
  ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_SE_CORNER: {
    id: "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_SE_CORNER",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "REVIVE",
    areaId: "ROUTE_2_FOREST_AREA",
    romOffsets: [[
      107,
      0x4313,
    ]],
  },
  ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_CENTER: {
    id: "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_CENTER",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_ETHER",
    areaId: "ROUTE_2_FOREST_AREA",
    romOffsets: [[
      107,
      0x430A,
    ]],
  },
  ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_PEWTER_ENTRANCE: {
    id: "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_PEWTER_ENTRANCE",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_HEAL",
    areaId: "ROUTE_2_FOREST_AREA",
    romOffsets: [[
      107,
      0x430D,
    ]],
  },
  ROUTE_4_WEST_AREA_HIDDEN_ITEM: {
    id: "ROUTE_4_WEST_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ULTRA_BALL",
    areaId: "ROUTE_4_WEST_AREA",
    romOffsets: [[
      107,
      0x6213,
    ]],
  },
  ROUTE_9_HIDDEN_ITEM: {
    id: "ROUTE_9_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ETHER",
    areaId: "ROUTE_9",
    romOffsets: [[
      106,
      0x6FA4,
    ]],
  },
  ROUTE_11_HIDDEN_ITEM: {
    id: "ROUTE_11_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "REVIVE",
    areaId: "ROUTE_11",
    romOffsets: [[
      26,
      0x4059,
    ]],
  },
  ROUTE_12_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_12_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ELIXER",
    areaId: "ROUTE_12_SURF_AREA",
    romOffsets: [[
      105,
      0x7011,
    ]],
  },
  ROUTE_13_HIDDEN_ITEM: {
    id: "ROUTE_13_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "CALCIUM",
    areaId: "ROUTE_13",
    romOffsets: [[
      104,
      0x64A1,
    ]],
  },
  ROUTE_17_HIDDEN_ITEM_IN_WATER: {
    id: "ROUTE_17_HIDDEN_ITEM_IN_WATER",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_ETHER",
    areaId: "ROUTE_17",
    romOffsets: [[
      107,
      0x5104,
    ]],
  },
  ROUTE_17_HIDDEN_ITEM_ON_FENCE: {
    id: "ROUTE_17_HIDDEN_ITEM_ON_FENCE",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_ELIXER",
    areaId: "ROUTE_17",
    romOffsets: [[
      107,
      0x5107,
    ]],
  },
  ROUTE_25_HIDDEN_ITEM: {
    id: "ROUTE_25_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "POTION",
    areaId: "ROUTE_25",
    romOffsets: [[
      103,
      0x6FE7,
    ]],
  },
  ROUTE_28_NORTH_AREA_HIDDEN_ITEM: {
    id: "ROUTE_28_NORTH_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "RARE_CANDY",
    areaId: "ROUTE_28_NORTH_AREA",
    romOffsets: [[
      105,
      0x5412,
    ]],
  },
  ROUTE_30_CHERRYGROVE_SIDE_HIDDEN_ITEM: {
    id: "ROUTE_30_CHERRYGROVE_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "POTION",
    areaId: "ROUTE_30_CHERRYGROVE_SIDE",
    romOffsets: [[
      104,
      0x57FD,
    ]],
  },
  ROUTE_32_SOUTH_AREA_HIDDEN_ITEM_NORTH_OF_PIER: {
    id: "ROUTE_32_SOUTH_AREA_HIDDEN_ITEM_NORTH_OF_PIER",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "SUPER_POTION",
    areaId: "ROUTE_32_SOUTH_AREA",
    romOffsets: [[
      100,
      0x4788,
    ]],
  },
  ROUTE_32_SOUTH_AREA_HIDDEN_ITEM_BEHIND_POKECENTER: {
    id: "ROUTE_32_SOUTH_AREA_HIDDEN_ITEM_BEHIND_POKECENTER",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "GREAT_BALL",
    areaId: "ROUTE_32_SOUTH_AREA",
    romOffsets: [[
      100,
      0x4785,
    ]],
  },
  ROUTE_34_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_34_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "RARE_CANDY",
    areaId: "ROUTE_34_SURF_AREA",
    romOffsets: [[
      30,
      0x432F,
    ]],
  },
  ROUTE_34_DAY_CARE_AREA_HIDDEN_ITEM: {
    id: "ROUTE_34_DAY_CARE_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "SUPER_POTION",
    areaId: "ROUTE_34_DAY_CARE_AREA",
    romOffsets: [[
      30,
      0x4332,
    ]],
  },
  ROUTE_37_HIDDEN_ITEM: {
    id: "ROUTE_37_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ETHER",
    areaId: "ROUTE_37",
    romOffsets: [[
      106,
      0x4E11,
    ]],
  },
  ROUTE_39_HIDDEN_ITEM: {
    id: "ROUTE_39_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "NUGGET",
    areaId: "ROUTE_39",
    romOffsets: [[
      105,
      0x5BF8,
    ]],
  },
  ROUTE_40_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK: {
    id: "ROUTE_40_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "HYPER_POTION",
    areaId: "ROUTE_40",
    accessRequirements: [
      "TM08",
    ],
    romOffsets: [[
      106,
      0x621B,
    ]],
  },
  ROUTE_41_SW_ISLAND_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_41_SW_ISLAND_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_ETHER",
    areaId: "ROUTE_41_SW_ISLAND_SURF_AREA",
    romOffsets: [[
      105,
      0x690E,
    ]],
  },
  ROUTE_42_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_42_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_POTION",
    areaId: "ROUTE_42_SURF_AREA",
    romOffsets: [[
      106,
      0x5355,
    ]],
  },
  ROUTE_44_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_44_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ELIXER",
    areaId: "ROUTE_44_SURF_AREA",
    romOffsets: [[
      103,
      0x5A4A,
    ]],
  },
  ROUTE_45_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_45_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "PP_UP",
    areaId: "ROUTE_45_SURF_AREA",
    romOffsets: [[
      103,
      0x62A0,
    ]],
  },
  DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_HIDDEN_ITEM: {
    id: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ELIXER",
    areaId: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA",
    romOffsets: [[
      99,
      0x469B,
    ]],
  },
  VIOLET_CITY_CUT_AREA_HIDDEN_ITEM: {
    id: "VIOLET_CITY_CUT_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "HYPER_POTION",
    areaId: "VIOLET_CITY_CUT_AREA",
    romOffsets: [[
      106,
      0x4429,
    ]],
  },
  AZALEA_TOWN_HIDDEN_ITEM: {
    id: "AZALEA_TOWN_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_HEAL",
    areaId: "AZALEA_TOWN",
    romOffsets: [[
      102,
      0x4133,
    ]],
  },
  ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_SIGN: {
    id: "ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_SIGN",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_HEAL",
    areaId: "ILEX_FOREST_NORTH_AREA",
    romOffsets: [[
      27,
      0x6E20,
    ]],
  },
  ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_HEADBUTT_GUY: {
    id: "ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_HEADBUTT_GUY",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "SUPER_POTION",
    areaId: "ILEX_FOREST_NORTH_AREA",
    romOffsets: [[
      27,
      0x6E1D,
    ]],
  },
  ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_EXIT: {
    id: "ILEX_FOREST_NORTH_AREA_HIDDEN_ITEM_BY_EXIT",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ETHER",
    areaId: "ILEX_FOREST_NORTH_AREA",
    romOffsets: [[
      27,
      0x6E1A,
    ]],
  },
  GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_BARGAIN_SHOP: {
    id: "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_BARGAIN_SHOP",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "PARLYZ_HEAL",
    areaId: "GOLDENROD_UNDERGROUND",
    romOffsets: [[
      31,
      0x430D,
    ]],
  },
  GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_HERB_SHOP: {
    id: "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_HERB_SHOP",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "SUPER_POTION",
    areaId: "GOLDENROD_UNDERGROUND",
    romOffsets: [[
      31,
      0x4310,
    ]],
  },
  GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_DOOR: {
    id: "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_DOOR",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ANTIDOTE",
    areaId: "GOLDENROD_UNDERGROUND",
    romOffsets: [[
      31,
      0x4313,
    ]],
  },
  GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_LEFT_HIDDEN_ITEM: {
    id: "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_LEFT_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "REVIVE",
    areaId: "GOLDENROD_UNDERGROUND_SWITCH_ROOM",
    romOffsets: [[
      31,
      0x4E86,
    ]],
  },
  GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_MIDDLE_HIDDEN_ITEM: {
    id: "GOLDENROD_UNDERGROUND_SWITCH_ROOM_TOP_MIDDLE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_POTION",
    areaId: "GOLDENROD_UNDERGROUND_SWITCH_ROOM",
    romOffsets: [[
      31,
      0x4E83,
    ]],
  },
  NATIONAL_PARK_HIDDEN_ITEM: {
    id: "NATIONAL_PARK_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_HEAL",
    areaId: "NATIONAL_PARK_ITEMS_GROUP",
    romOffsets: [
      [
        23,
        0x41D2,
      ], [
        23,
        0x494B,
      ],
    ],
  },
  ECRUTEAK_CITY_HIDDEN_ITEM: {
    id: "ECRUTEAK_CITY_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "HYPER_POTION",
    areaId: "ECRUTEAK_CITY",
    romOffsets: [[
      105,
      0x4057,
    ]],
  },
  BURNED_TOWER_1F_HIDDEN_ITEM_BY_ENTRANCE: {
    id: "BURNED_TOWER_1F_HIDDEN_ITEM_BY_ENTRANCE",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ULTRA_BALL",
    areaId: "BURNED_TOWER_1F",
    romOffsets: [[
      97,
      0x5CCA,
    ]],
  },
  BURNED_TOWER_1F_HIDDEN_ITEM_BY_HOLE: {
    id: "BURNED_TOWER_1F_HIDDEN_ITEM_BY_HOLE",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ETHER",
    areaId: "BURNED_TOWER_1F",
    romOffsets: [[
      97,
      0x5CC7,
    ]],
  },
  TIN_TOWER_4F_HIDDEN_ITEM: {
    id: "TIN_TOWER_4F_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_POTION",
    areaId: "TIN_TOWER_4F",
    romOffsets: [[
      97,
      0x5A60,
    ]],
  },
  TIN_TOWER_5F_SE_AREA_HIDDEN_ITEM: {
    id: "TIN_TOWER_5F_SE_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_RESTORE",
    areaId: "TIN_TOWER_5F_SE_AREA",
    romOffsets: [[
      97,
      0x5AAD,
    ]],
  },
  TIN_TOWER_5F_SW_AREA_HIDDEN_ITEM: {
    id: "TIN_TOWER_5F_SW_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "CARBOS",
    areaId: "TIN_TOWER_5F_SW_AREA",
    romOffsets: [[
      97,
      0x5AB0,
    ]],
  },
  OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_HIDDEN_ITEM: {
    id: "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "HYPER_POTION",
    areaId: "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA",
    romOffsets: [[
      24,
      0x49B2,
    ]],
  },
  WHIRL_ISLAND_B1F_NORTH_AREA_EAST_HIDDEN_ITEM: {
    id: "WHIRL_ISLAND_B1F_NORTH_AREA_EAST_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "RARE_CANDY",
    areaId: "WHIRL_ISLAND_B1F_NORTH_AREA",
    romOffsets: [[
      99,
      0x441F,
    ]],
  },
  WHIRL_ISLAND_B1F_NORTH_AREA_WEST_HIDDEN_ITEM: {
    id: "WHIRL_ISLAND_B1F_NORTH_AREA_WEST_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_RESTORE",
    areaId: "WHIRL_ISLAND_B1F_NORTH_AREA",
    romOffsets: [[
      99,
      0x4425,
    ]],
  },
  WHIRL_ISLAND_B1F_SE_AREA_HIDDEN_ITEM: {
    id: "WHIRL_ISLAND_B1F_SE_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ULTRA_BALL",
    areaId: "WHIRL_ISLAND_B1F_SE_AREA",
    romOffsets: [[
      99,
      0x4422,
    ]],
  },
  CIANWOOD_CITY_HIDDEN_ITEM_UNDER_NORTH_ROCK_SMASH_ROCK: {
    id: "CIANWOOD_CITY_HIDDEN_ITEM_UNDER_NORTH_ROCK_SMASH_ROCK",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "REVIVE",
    areaId: "CIANWOOD_CITY",
    accessRequirements: [
      "TM08",
    ],
    romOffsets: [[
      104,
      0x40D6,
    ]],
  },
  CIANWOOD_CITY_HIDDEN_ITEM_UNDER_SOUTH_ROCK_SMASH_ROCK: {
    id: "CIANWOOD_CITY_HIDDEN_ITEM_UNDER_SOUTH_ROCK_SMASH_ROCK",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_ETHER",
    areaId: "CIANWOOD_CITY",
    accessRequirements: [
      "TM08",
    ],
    romOffsets: [[
      104,
      0x40D9,
    ]],
  },
  MOUNT_MORTAR_FRONT_MAHOGANY_SIDE_HIDDEN_ITEM: {
    id: "MOUNT_MORTAR_FRONT_MAHOGANY_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "HYPER_POTION",
    areaId: "MOUNT_MORTAR_FRONT_MAHOGANY_SIDE",
    romOffsets: [[
      31,
      0x5DFC,
    ]],
  },
  MOUNT_MORTAR_BACK_1F_NORTH_AREA_HIDDEN_ITEM: {
    id: "MOUNT_MORTAR_BACK_1F_NORTH_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_REPEL",
    areaId: "MOUNT_MORTAR_BACK_1F_NORTH_AREA",
    romOffsets: [[
      31,
      0x5E8C,
    ]],
  },
  MOUNT_MORTAR_BACK_2F_NORTH_AREA_HIDDEN_ITEM: {
    id: "MOUNT_MORTAR_BACK_2F_NORTH_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_RESTORE",
    areaId: "MOUNT_MORTAR_BACK_2F_NORTH_AREA",
    romOffsets: [[
      31,
      0x60EC,
    ]],
  },
  MOUNT_MORTAR_B1F_NW_AREA_HIDDEN_ITEM: {
    id: "MOUNT_MORTAR_B1F_NW_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_REVIVE",
    areaId: "MOUNT_MORTAR_B1F_NW_AREA",
    romOffsets: [[
      31,
      0x624C,
    ]],
  },
  LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_LEDGES: {
    id: "LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_LEDGES",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_RESTORE",
    areaId: "LAKE_OF_RAGE_MAIN_AREA",
    romOffsets: [[
      28,
      0x414E,
    ]],
  },
  LAKE_OF_RAGE_CUT_AREA_HIDDEN_ITEM: {
    id: "LAKE_OF_RAGE_CUT_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "RARE_CANDY",
    areaId: "LAKE_OF_RAGE_CUT_AREA",
    romOffsets: [[
      28,
      0x4151,
    ]],
  },
  LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_WATER: {
    id: "LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_WATER",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_POTION",
    areaId: "LAKE_OF_RAGE_MAIN_AREA",
    romOffsets: [[
      28,
      0x4154,
    ]],
  },
  TEAM_ROCKET_BASE_B1F_HIDDEN_ITEM: {
    id: "TEAM_ROCKET_BASE_B1F_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "REVIVE",
    areaId: "TEAM_ROCKET_BASE_B1F",
    romOffsets: [[
      27,
      0x4ACC,
    ]],
  },
  TEAM_ROCKET_BASE_B2F_NORTH_AREA_HIDDEN_ITEM: {
    id: "TEAM_ROCKET_BASE_B2F_NORTH_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_HEAL",
    areaId: "TEAM_ROCKET_BASE_B2F_NORTH_AREA",
    romOffsets: [[
      27,
      0x5211,
    ]],
  },
  ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_HIDDEN_ITEM: {
    id: "ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "CARBOS",
    areaId: "ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA",
    romOffsets: [[
      31,
      0x65AC,
    ]],
  },
  ICE_PATH_B2F_BLACKTHORN_SIDE_HIDDEN_ITEM: {
    id: "ICE_PATH_B2F_BLACKTHORN_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ICE_HEAL",
    areaId: "ICE_PATH_B2F_BLACKTHORN_SIDE",
    romOffsets: [[
      31,
      0x664A,
    ]],
  },
  ICE_PATH_B1F_BLACKTHORN_SIDE_HIDDEN_ITEM: {
    id: "ICE_PATH_B1F_BLACKTHORN_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_POTION",
    areaId: "ICE_PATH_B1F_BLACKTHORN_SIDE",
    romOffsets: [[
      31,
      0x6511,
    ]],
  },
  DRAGONS_DEN_B1F_NORTH_SURF_AREA_HIDDEN_ITEM: {
    id: "DRAGONS_DEN_B1F_NORTH_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_POTION",
    areaId: "DRAGONS_DEN_B1F_NORTH_SURF_AREA",
    romOffsets: [[
      99,
      0x49AA,
    ]],
  },
  DRAGONS_DEN_B1F_SOUTH_SURF_AREA_SE_HIDDEN_ITEM: {
    id: "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_SE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ELIXER",
    areaId: "DRAGONS_DEN_B1F_SOUTH_SURF_AREA",
    romOffsets: [[
      99,
      0x49AD,
    ]],
  },
  DRAGONS_DEN_B1F_SOUTH_SURF_AREA_NE_HIDDEN_ITEM: {
    id: "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_NE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "REVIVE",
    areaId: "DRAGONS_DEN_B1F_SOUTH_SURF_AREA",
    romOffsets: [[
      99,
      0x49A7,
    ]],
  },
  OLIVINE_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM: {
    id: "OLIVINE_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "PROTEIN",
    areaId: "OLIVINE_PORT_SOUTH_SURF_AREA",
    romOffsets: [[
      29,
      0x4A2F,
    ]],
  },
  VERMILION_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM: {
    id: "VERMILION_PORT_SOUTH_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "IRON",
    areaId: "VERMILION_PORT_SOUTH_SURF_AREA",
    romOffsets: [[
      29,
      0x4EF0,
    ]],
  },
  VERMILION_CITY_HIDDEN_ITEM: {
    id: "VERMILION_CITY_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_HEAL",
    areaId: "VERMILION_CITY",
    romOffsets: [[
      106,
      0x6A14,
    ]],
  },
  DIGLETTS_CAVE_HIDDEN_ITEM: {
    id: "DIGLETTS_CAVE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_REVIVE",
    areaId: "DIGLETTS_CAVE",
    romOffsets: [[
      29,
      0x4007,
    ]],
  },
  UNDERGROUND_PATH_NORTH_HIDDEN_ITEM: {
    id: "UNDERGROUND_PATH_NORTH_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_RESTORE",
    areaId: "UNDERGROUND_PATH",
    romOffsets: [[
      29,
      0x4395,
    ]],
  },
  UNDERGROUND_PATH_SOUTH_HIDDEN_ITEM: {
    id: "UNDERGROUND_PATH_SOUTH_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "X_SPECIAL",
    areaId: "UNDERGROUND_PATH",
    romOffsets: [[
      29,
      0x4398,
    ]],
  },
  CERULEAN_CITY_SURF_AREA_HIDDEN_ITEM: {
    id: "CERULEAN_CITY_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "BERSERK_GENE",
    areaId: "CERULEAN_CITY_SURF_AREA",
    romOffsets: [[
      97,
      0x40BB,
    ]],
  },
  CELADON_CITY_HIDDEN_ITEM: {
    id: "CELADON_CITY_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "PP_UP",
    areaId: "CELADON_CITY",
    romOffsets: [[
      106,
      0x5F7C,
    ]],
  },
  CELADON_CAFE_HIDDEN_ITEM: {
    id: "CELADON_CAFE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "LEFTOVERS",
    areaId: "CELADON_CAFE",
    romOffsets: [
      [
        28,
        0x70B7,
      ],
      [
        28,
        0x70BE,
      ],
      [
        28,
        0x70CF,
      ],
    ],
  },
  ROCK_TUNNEL_1F_LAVENDER_SIDE_HIDDEN_ITEM: {
    id: "ROCK_TUNNEL_1F_LAVENDER_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "X_DEFEND",
    areaId: "ROCK_TUNNEL_1F_LAVENDER_SIDE",
    romOffsets: [[
      29,
      0x43BE,
    ]],
  },
  ROCK_TUNNEL_1F_CERULEAN_SIDE_HIDDEN_ITEM: {
    id: "ROCK_TUNNEL_1F_CERULEAN_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "X_ACCURACY",
    areaId: "ROCK_TUNNEL_1F_CERULEAN_SIDE",
    romOffsets: [[
      29,
      0x43BB,
    ]],
  },
  ROCK_TUNNEL_B1F_NW_AREA_HIDDEN_ITEM: {
    id: "ROCK_TUNNEL_B1F_NW_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_POTION",
    areaId: "ROCK_TUNNEL_B1F_NW_AREA",
    romOffsets: [[
      29,
      0x4411,
    ]],
  },
  MOUNT_MOON_SQUARE_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK: {
    id: "MOUNT_MOON_SQUARE_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MOON_STONE",
    areaId: "MOUNT_MOON_SQUARE",
    accessRequirements: [
      "TM08",
    ],
    romOffsets: [[
      29,
      0x711A,
    ]],
  },
  CINNABAR_ISLAND_HIDDEN_ITEM: {
    id: "CINNABAR_ISLAND_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "RARE_CANDY",
    areaId: "CINNABAR_ISLAND",
    romOffsets: [[
      107,
      0x49CF,
    ]],
  },
  VICTORY_ROAD_1F_HIDDEN_ITEM: {
    id: "VICTORY_ROAD_1F_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_HEAL",
    areaId: "VICTORY_ROAD_1F",
    romOffsets: [[
      29,
      0x4538,
    ]],
  },
  VICTORY_ROAD_2F_NW_AREA_HIDDEN_ITEM: {
    id: "VICTORY_ROAD_2F_NW_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_POTION",
    areaId: "VICTORY_ROAD_2F_NW_AREA",
    romOffsets: [[
      29,
      0x4535,
    ]],
  },
  SILVER_CAVE_OUTSIDE_SURF_AREA_HIDDEN_ITEM: {
    id: "SILVER_CAVE_OUTSIDE_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "FULL_RESTORE",
    areaId: "SILVER_CAVE_OUTSIDE_SURF_AREA",
    romOffsets: [[
      108,
      0x6053,
    ]],
  },
  SILVER_CAVE_ROOM_1_SOUTH_HIDDEN_ITEM: {
    id: "SILVER_CAVE_ROOM_1_SOUTH_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "ULTRA_BALL",
    areaId: "SILVER_CAVE_ROOM_1",
    romOffsets: [[
      99,
      0x4561,
    ]],
  },
  SILVER_CAVE_ROOM_1_NORTH_HIDDEN_ITEM: {
    id: "SILVER_CAVE_ROOM_1_NORTH_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "DIRE_HIT",
    areaId: "SILVER_CAVE_ROOM_1",
    romOffsets: [[
      99,
      0x455E,
    ]],
  },
  SILVER_CAVE_ROOM_2_MAIN_AREA_HIDDEN_ITEM: {
    id: "SILVER_CAVE_ROOM_2_MAIN_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "REGULAR_HIDDEN_ITEMS",
    itemId: "MAX_POTION",
    areaId: "SILVER_CAVE_ROOM_2_MAIN_AREA",
    romOffsets: [[
      99,
      0x45BA,
    ]],
  },
}

export const keyItemHiddenItemLocationsMap: IdMap<KeyItemHiddenItemLocationId, ItemLocation> = {
  CERULEAN_GYM_HIDDEN_ITEM: {
    id: "CERULEAN_GYM_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    groupId: "KEY_ITEMS",
    itemId: "MACHINE_PART",
    areaId: "CERULEAN_GYM",
    accessRequirements: [
      "POWER_PLANT",
    ],
    romOffsets: [[
      98,
      0x44B8,
    ]],
  },
}

export const fruitTreeLocationsMap: IdMap<FruitTreeLocationId, ItemLocation> = {
  ROUTE_1_FRUIT_TREE: {
    id: "ROUTE_1_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BITTER_BERRY",
    areaId: "ROUTE_1",
    romOffsets: [
      [
        107,
        0x4581,
      ],
    ],
  },
  ROUTE_2_FOREST_AREA_FRUIT_TREE: {
    id: "ROUTE_2_FOREST_AREA_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "PSNCUREBERRY",
    areaId: "ROUTE_2_FOREST_AREA",
    romOffsets: [
      [
        107,
        0x4306,
      ],
    ],
  },
  ROUTE_8_FRUIT_TREE: {
    id: "ROUTE_8_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "PRZCUREBERRY",
    areaId: "ROUTE_8",
    romOffsets: [
      [
        27,
        0x406C,
      ],
    ],
  },
  ROUTE_11_FRUIT_TREE: {
    id: "ROUTE_11_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BERRY",
    areaId: "ROUTE_11",
    romOffsets: [
      [
        26,
        0x4055,
      ],
    ],
  },
  ROUTE_26_FRUIT_TREE: {
    id: "ROUTE_26_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "ICE_BERRY",
    areaId: "ROUTE_26",
    romOffsets: [
      [
        105,
        0x4EC2,
      ],
    ],
  },
  ROUTE_29_FRUIT_TREE: {
    id: "ROUTE_29_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BERRY",
    areaId: "ROUTE_29",
    romOffsets: [
      [
        104,
        0x5089,
      ],
    ],
  },
  ROUTE_30_CHERRYGROVE_SIDE_SOUTH_FRUIT_TREE: {
    id: "ROUTE_30_CHERRYGROVE_SIDE_SOUTH_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BERRY",
    areaId: "ROUTE_30_CHERRYGROVE_SIDE",
    romOffsets: [
      [
        104,
        0x57F7,
      ],
    ],
  },
  ROUTE_30_CHERRYGROVE_SIDE_NORTH_FRUIT_TREE: {
    id: "ROUTE_30_CHERRYGROVE_SIDE_NORTH_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "PSNCUREBERRY",
    areaId: "ROUTE_30_CHERRYGROVE_SIDE",
    romOffsets: [
      [
        104,
        0x57F9,
      ],
    ],
  },
  ROUTE_31_FRUIT_TREE: {
    id: "ROUTE_31_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BITTER_BERRY",
    areaId: "ROUTE_31",
    romOffsets: [
      [
        105,
        0x55F9,
      ],
    ],
  },
  ROUTE_33_FRUIT_TREE: {
    id: "ROUTE_33_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "PSNCUREBERRY",
    areaId: "ROUTE_33",
    romOffsets: [
      [
        107,
        0x40EA,
      ],
    ],
  },
  ROUTE_35_SURF_AREA_FRUIT_TREE: {
    id: "ROUTE_35_SURF_AREA_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "MYSTERYBERRY",
    areaId: "ROUTE_35_SURF_AREA",
    romOffsets: [
      [
        103,
        0x4A7E,
      ],
    ],
  },
  ROUTE_36_WEST_AREA_FRUIT_TREE: {
    id: "ROUTE_36_WEST_AREA_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "ICE_BERRY",
    areaId: "ROUTE_36_WEST_AREA",
    romOffsets: [
      [
        101,
        0x4247,
      ],
    ],
  },
  ROUTE_37_LEFT_FRUIT_TREE: {
    id: "ROUTE_37_LEFT_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "RED_APRICORN",
    areaId: "ROUTE_37",
    romOffsets: [
      [
        106,
        0x4E09,
      ],
    ],
  },
  ROUTE_37_MIDDLE_FRUIT_TREE: {
    id: "ROUTE_37_MIDDLE_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BLK_APRICORN",
    areaId: "ROUTE_37",
    romOffsets: [
      [
        106,
        0x4E0D,
      ],
    ],
  },
  ROUTE_37_RIGHT_FRUIT_TREE: {
    id: "ROUTE_37_RIGHT_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BLU_APRICORN",
    areaId: "ROUTE_37",
    romOffsets: [
      [
        106,
        0x4E0B,
      ],
    ],
  },
  ROUTE_38_FRUIT_TREE: {
    id: "ROUTE_38_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BERRY",
    areaId: "ROUTE_38",
    romOffsets: [
      [
        104,
        0x5F33,
      ],
    ],
  },
  ROUTE_39_FRUIT_TREE: {
    id: "ROUTE_39_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "MINT_BERRY",
    areaId: "ROUTE_39",
    romOffsets: [
      [
        105,
        0x5BF4,
      ],
    ],
  },
  ROUTE_42_MIDDLE_CUT_AREA_LEFT_FRUIT_TREE: {
    id: "ROUTE_42_MIDDLE_CUT_AREA_LEFT_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "PNK_APRICORN",
    areaId: "ROUTE_42_MIDDLE_CUT_AREA",
    romOffsets: [
      [
        106,
        0x534D,
      ],
    ],
  },
  ROUTE_42_MIDDLE_CUT_AREA_MIDDLE_FRUIT_TREE: {
    id: "ROUTE_42_MIDDLE_CUT_AREA_MIDDLE_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "GRN_APRICORN",
    areaId: "ROUTE_42_MIDDLE_CUT_AREA",
    romOffsets: [
      [
        106,
        0x534F,
      ],
    ],
  },
  ROUTE_42_MIDDLE_CUT_AREA_RIGHT_FRUIT_TREE: {
    id: "ROUTE_42_MIDDLE_CUT_AREA_RIGHT_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "YLW_APRICORN",
    areaId: "ROUTE_42_MIDDLE_CUT_AREA",
    romOffsets: [
      [
        106,
        0x5351,
      ],
    ],
  },
  ROUTE_43_SURF_CUT_AREA_FRUIT_TREE: {
    id: "ROUTE_43_SURF_CUT_AREA_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BITTER_BERRY",
    areaId: "ROUTE_43_SURF_CUT_AREA",
    romOffsets: [
      [
        103,
        0x5266,
      ],
    ],
  },
  ROUTE_44_FRUIT_TREE: {
    id: "ROUTE_44_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BURNT_BERRY",
    areaId: "ROUTE_44",
    romOffsets: [
      [
        103,
        0x5A40,
      ],
    ],
  },
  ROUTE_45_FRUIT_TREE: {
    id: "ROUTE_45_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "MYSTERYBERRY",
    areaId: "ROUTE_45",
    romOffsets: [
      [
        103,
        0x6294,
      ],
    ],
  },
  ROUTE_46_NORTH_AREA_LEFT_FRUIT_TREE: {
    id: "ROUTE_46_NORTH_AREA_LEFT_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BERRY",
    areaId: "ROUTE_46_NORTH_AREA",
    romOffsets: [
      [
        106,
        0x578F,
      ],
    ],
  },
  ROUTE_46_NORTH_AREA_RIGHT_FRUIT_TREE: {
    id: "ROUTE_46_NORTH_AREA_RIGHT_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "PRZCUREBERRY",
    areaId: "ROUTE_46_NORTH_AREA",
    romOffsets: [
      [
        106,
        0x5791,
      ],
    ],
  },
  PEWTER_CITY_LEFT_FRUIT_TREE: {
    id: "PEWTER_CITY_LEFT_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "MINT_BERRY",
    areaId: "PEWTER_CITY",
    romOffsets: [
      [
        99,
        0x4040,
      ],
    ],
  },
  PEWTER_CITY_RIGHT_FRUIT_TREE: {
    id: "PEWTER_CITY_RIGHT_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "ICE_BERRY",
    areaId: "PEWTER_CITY",
    romOffsets: [
      [
        99,
        0x403E,
      ],
    ],
  },
  FUCHSIA_CITY_CUT_AREA_FRUIT_TREE: {
    id: "FUCHSIA_CITY_CUT_AREA_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "BURNT_BERRY",
    areaId: "FUCHSIA_CITY_CUT_AREA",
    romOffsets: [
      [
        101,
        0x4B43,
      ],
    ],
  },
  VIOLET_CITY_FRUIT_TREE: {
    id: "VIOLET_CITY_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "PRZCUREBERRY",
    areaId: "VIOLET_CITY",
    romOffsets: [
      [
        106,
        0x4425,
      ],
    ],
  },
  AZALEA_TOWN_FRUIT_TREE: {
    id: "AZALEA_TOWN_FRUIT_TREE",
    type: "FRUIT_TREE",
    groupId: "FRUIT_TREES",
    itemId: "WHT_APRICORN",
    areaId: "AZALEA_TOWN",
    romOffsets: [
      [
        102,
        0x412F,
      ],
    ],
  },
}

export const regularGiftLocationsMap: IdMap<RegularGiftLocationId, ItemLocation> = {
  SLOWPOKE_WELL_B2F_MANS_GIFT: {
    id: "SLOWPOKE_WELL_B2F_MANS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "KINGS_ROCK",
    areaId: "SLOWPOKE_WELL_B2F_SURF_AREA",
    romOffsets: [
      [
        22,
        0x6D18,
      ],
    ],
  },
  OLIVINE_LIGHTHOUSE_2F_HUEYS_GIFT: {
    id: "OLIVINE_LIGHTHOUSE_2F_HUEYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "PROTEIN",
    areaId: "OLIVINE_LIGHTHOUSE_2F",
    accessRequirements: [
      "POKEGEAR",
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
      "HALL_OF_FAME",
      "POWER_PLANT_MANAGERS_GIFT",
    ],
    romOffsets: [
      [
        22,
        0x7033,
      ],
      [
        22,
        0x7045,
      ],
    ],
  },
  NATIONAL_PARK_BENCH_LADYS_GIFT: {
    id: "NATIONAL_PARK_BENCH_LADYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "QUICK_CLAW",
    areaId: "NATIONAL_PARK",
    romOffsets: [
      [
        23,
        0x4015,
      ],
    ],
  },
  NATIONAL_PARK_BEVERLYS_GIFT_FOR_MARILL: {
    id: "NATIONAL_PARK_BEVERLYS_GIFT_FOR_MARILL",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "NUGGET",
    areaId: "NATIONAL_PARK",
    accessRequirements: [
      "POKEGEAR",
      "MARILL",
    ],
    romOffsets: [
      [
        23,
        0x417B,
      ],
    ],
  },
  RADIO_TOWER_4F_EAST_AREA_DJ_MARYS_GIFT: {
    id: "RADIO_TOWER_4F_EAST_AREA_DJ_MARYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "PINK_BOW",
    areaId: "RADIO_TOWER_4F_EAST_AREA",
    accessRequirements: [
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    ],
    romOffsets: [
      [
        23,
        0x6B9E,
      ],
    ],
  },
  GOLDENROD_POKECENTER_1F_LADYS_GIFT: {
    id: "GOLDENROD_POKECENTER_1F_LADYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "REVIVE",
    areaId: "GOLDENROD_POKECENTER_1F",
    accessRequirements: [
      "EON_MAIL",
    ],
    romOffsets: [
      [
        24,
        0x5040,
      ],
    ],
  },
  ROUTE_35_GOLDENROD_GATE_RANDYS_GIFT: {
    id: "ROUTE_35_GOLDENROD_GATE_RANDYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "HP_UP",
    areaId: "ROUTE_35_GOLDENROD_GATE",
    accessRequirements: [
      "ROUTE_31",
    ],
    romOffsets: [
      [
        26,
        0x5D8A,
      ],
    ],
  },
  ROUTE_36_NATIONAL_PARK_GATE_CONTEST_1ST_PLACE_PRIZE: {
    id: "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_1ST_PLACE_PRIZE",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "SUN_STONE",
    areaId: "ROUTE_36_NATIONAL_PARK_GATE",
    romOffsets: [
      [
        26,
        0x6CB4,
      ],
      [
        47,
        0x432A,
      ],
    ],
  },
  ROUTE_36_NATIONAL_PARK_GATE_CONTEST_2ND_PLACE_PRIZE: {
    id: "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_2ND_PLACE_PRIZE",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "EVERSTONE",
    areaId: "ROUTE_36_NATIONAL_PARK_GATE",
    romOffsets: [
      [
        26,
        0x6CC3,
      ],
      [
        47,
        0x433B,
      ],
    ],
  },
  ROUTE_36_NATIONAL_PARK_GATE_CONTEST_3RD_PLACE_PRIZE: {
    id: "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_3RD_PLACE_PRIZE",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "GOLD_BERRY",
    areaId: "ROUTE_36_NATIONAL_PARK_GATE",
    romOffsets: [
      [
        26,
        0x6CD2,
      ],
      [
        47,
        0x434C,
      ],
    ],
  },
  ROUTE_36_NATIONAL_PARK_GATE_CONTEST_CONSOLATION_PRIZE: {
    id: "ROUTE_36_NATIONAL_PARK_GATE_CONTEST_CONSOLATION_PRIZE",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "BERRY",
    areaId: "ROUTE_36_NATIONAL_PARK_GATE",
    romOffsets: [
      [
        26,
        0x6CE1,
      ],
      [
        47,
        0x42A4,
      ],
    ],
  },
  LAKE_OF_RAGE_CUT_AREA_WESLEYS_GIFT: {
    id: "LAKE_OF_RAGE_CUT_AREA_WESLEYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "BLACKBELT",
    areaId: "LAKE_OF_RAGE_CUT_AREA",
    romOffsets: [
      [
        28,
        0x412E,
      ],
    ],
  },
  FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT: {
    id: "FAST_SHIP_CABINS_SE_GENTLEMANS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "METAL_COAT",
    areaId: "FAST_SHIP_CABINS_SE",
    accessRequirements: [
      "FAST_SHIP_CABINS_CAPTAINS_CABIN",
    ],
    romOffsets: [
      [
        29,
        0x5F3C,
      ],
      [
        29,
        0x5F5D,
      ],
    ],
  },
  ROUTE_34_MAIN_AREA_GINAS_GIFT: {
    id: "ROUTE_34_MAIN_AREA_GINAS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "LEAF_STONE",
    areaId: "ROUTE_34_MAIN_AREA",
    accessRequirements: [
      "POKEGEAR",
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    ],
    romOffsets: [
      [
        30,
        0x4217,
      ],
    ],
  },
  ROUTE_34_SURF_AREA_KATES_GIFT: {
    id: "ROUTE_34_SURF_AREA_KATES_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "SOFT_SAND",
    areaId: "ROUTE_34_SURF_AREA",
    romOffsets: [
      [
        30,
        0x4311,
      ],
    ],
  },
  ELMS_LAB_ELMS_GIFT_FOR_TOGEPI: {
    id: "ELMS_LAB_ELMS_GIFT_FOR_TOGEPI",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "EVERSTONE",
    areaId: "ELMS_LAB",
    accessRequirements: [
      "VIOLET_GYM",
      "VIOLET_POKECENTER_1F",
      "TOGEPI",
    ],
    romOffsets: [
      [
        30,
        0x4E08,
      ],
    ],
  },
  ELMS_LAB_ELMS_GIFT_FOR_RISINGBADGE: {
    id: "ELMS_LAB_ELMS_GIFT_FOR_RISINGBADGE",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "MASTER_BALL",
    areaId: "ELMS_LAB",
    accessRequirements: [
      "RISINGBADGE",
    ],
    romOffsets: [
      [
        30,
        0x4E21,
      ],
    ],
  },
  ELMS_LAB_AIDES_FREE_GIFT: {
    id: "ELMS_LAB_AIDES_FREE_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "POTION",
    areaId: "ELMS_LAB",
    romOffsets: [
      [
        30,
        0x4EA3,
      ],
    ],
  },
  ELMS_LAB_AIDES_GIFT_FOR_MYSTERY_EGG: {
    id: "ELMS_LAB_AIDES_GIFT_FOR_MYSTERY_EGG",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "POKE_BALL",
    areaId: "ELMS_LAB",
    romOffsets: [
      [
        30,
        0x4ED1,
      ],
    ],
  },
  ROUTE_2_NUGGET_HOUSE_MANS_GIFT: {
    id: "ROUTE_2_NUGGET_HOUSE_MANS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "NUGGET",
    areaId: "ROUTE_2_NUGGET_HOUSE",
    romOffsets: [
      [
        38,
        0x7854,
      ],
    ],
  },
  BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_LICKITUNG: {
    id: "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_LICKITUNG",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "EVERSTONE",
    areaId: "BILLS_HOUSE",
    accessRequirements: [
      "LICKITUNG",
    ],
    romOffsets: [
      [
        98,
        0x5645,
      ],
    ],
  },
  BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_ODDISH: {
    id: "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_ODDISH",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "LEAF_STONE",
    areaId: "BILLS_HOUSE",
    accessRequirements: [
      "ODDISH",
    ],
    romOffsets: [
      [
        98,
        0x565C,
      ],
    ],
  },
  BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_STARYU: {
    id: "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_STARYU",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "WATER_STONE",
    areaId: "BILLS_HOUSE",
    accessRequirements: [
      "STARYU",
    ],
    romOffsets: [
      [
        98,
        0x5673,
      ],
    ],
  },
  BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_GROWLITHE: {
    id: "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_GROWLITHE",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "FIRE_STONE",
    areaId: "BILLS_HOUSE",
    accessRequirements: [
      "GROWLITHE",
    ],
    romOffsets: [
      [
        98,
        0x568A,
      ],
    ],
  },
  BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_PICHU: {
    id: "BILLS_HOUSE_BILLS_GRANDPAS_GIFT_FOR_PICHU",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "THUNDERSTONE",
    areaId: "BILLS_HOUSE",
    accessRequirements: [
      "PICHU",
    ],
    romOffsets: [
      [
        98,
        0x569B,
      ],
    ],
  },
  SILPH_CO_1F_GUARDS_GIFT: {
    id: "SILPH_CO_1F_GUARDS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "UP_GRADE",
    areaId: "SILPH_CO_1F",
    romOffsets: [
      [
        98,
        0x6BF5,
      ],
    ],
  },
  ROUTE_5_CLEANSE_TAG_HOUSE_LADYS_GIFT: {
    id: "ROUTE_5_CLEANSE_TAG_HOUSE_LADYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "CLEANSE_TAG",
    areaId: "ROUTE_5_CLEANSE_TAG_HOUSE",
    romOffsets: [
      [
        98,
        0x7641,
      ],
    ],
  },
  DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_MANS_GIFT: {
    id: "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_MANS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "BLACKGLASSES",
    areaId: "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA",
    romOffsets: [
      [
        99,
        0x472D,
      ],
    ],
  },
  CHARCOAL_KILN_APPRENTICES_GIFT: {
    id: "CHARCOAL_KILN_APPRENTICES_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "CHARCOAL",
    areaId: "CHARCOAL_KILN",
    accessRequirements: [
      "SLOWPOKE_WELL_B1F_EAST_AREA",
      "ILEX_FOREST_SOUTH_AREA_CHARCOAL_BOSSS_GIFT",
    ],
    romOffsets: [
      [
        99,
        0x5D53,
      ],
    ],
  },
  KURTS_HOUSE_KURTS_GIFT: {
    id: "KURTS_HOUSE_KURTS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "LURE_BALL",
    areaId: "KURTS_HOUSE",
    accessRequirements: [
      "SLOWPOKE_WELL_B1F_EAST_AREA",
    ],
    romOffsets: [
      [
        99,
        0x61C4,
      ],
    ],
  },
  ROUTE_32_NORTH_AREA_MANS_GIFT: {
    id: "ROUTE_32_NORTH_AREA_MANS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "MIRACLE_SEED",
    areaId: "ROUTE_32_NORTH_AREA",
    accessRequirements: [
      "VIOLET_GYM",
      "VIOLET_POKECENTER_1F",
    ],
    romOffsets: [
      [
        100,
        0x4494,
      ],
    ],
  },
  ROUTE_32_SOUTH_AREA_FRIEDAS_GIFT: {
    id: "ROUTE_32_SOUTH_AREA_FRIEDAS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "POISON_BARB",
    areaId: "ROUTE_32_SOUTH_AREA",
    romOffsets: [
      [
        100,
        0x4759,
      ],
    ],
  },
  POKEMON_FAN_CLUB_CHAIRMANS_GIFT: {
    id: "POKEMON_FAN_CLUB_CHAIRMANS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "RARE_CANDY",
    areaId: "POKEMON_FAN_CLUB",
    romOffsets: [
      [
        100,
        0x5807,
      ],
    ],
  },
  ROUTE_36_WEST_AREA_ALANS_GIFT: {
    id: "ROUTE_36_WEST_AREA_ALANS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "FIRE_STONE",
    areaId: "ROUTE_36_WEST_AREA",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        101,
        0x41B8,
      ],
    ],
  },
  ROUTE_36_EAST_AREA_ARTHURS_GIFT: {
    id: "ROUTE_36_EAST_AREA_ARTHURS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "HARD_STONE",
    areaId: "ROUTE_36_EAST_AREA",
    romOffsets: [
      [
        101,
        0x4221,
      ],
    ],
  },
  ROUTE_30_BERRY_HOUSE_MANS_GIFT: {
    id: "ROUTE_30_BERRY_HOUSE_MANS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "BERRY",
    areaId: "ROUTE_30_BERRY_HOUSE",
    romOffsets: [
      [
        101,
        0x6D71,
      ],
    ],
  },
  MR_POKEMONS_HOUSE_MR_POKEMONS_GIFT_FOR_RED_SCALE: {
    id: "MR_POKEMONS_HOUSE_MR_POKEMONS_GIFT_FOR_RED_SCALE",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "EXP_SHARE",
    areaId: "MR_POKEMONS_HOUSE",
    accessRequirements: [
      "RED_SCALE",
    ],
    romOffsets: [
      [
        101,
        0x6EB8,
      ],
    ],
  },
  LAKE_OF_RAGE_MAGIKARP_HOUSE_MANS_GIFT: {
    id: "LAKE_OF_RAGE_MAGIKARP_HOUSE_MANS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "ELIXER",
    areaId: "LAKE_OF_RAGE_MAGIKARP_HOUSE",
    accessRequirements: [
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
      "MAGIKARP",
    ],
    romOffsets: [
      [
        102,
        0x6703,
      ],
    ],
  },
  CHERRYGROVE_CITY_SURF_AREA_MYSTIC_WATER_GUYS_GIFT: {
    id: "CHERRYGROVE_CITY_SURF_AREA_MYSTIC_WATER_GUYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "MYSTIC_WATER",
    areaId: "CHERRYGROVE_CITY_SURF_AREA",
    romOffsets: [
      [
        103,
        0x417B,
      ],
    ],
  },
  ROUTE_43_TIFFANY_GIFT_FOR_CLEFARIY: {
    id: "ROUTE_43_TIFFANY_GIFT_FOR_CLEFARIY",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "PINK_BOW",
    areaId: "ROUTE_43",
    accessRequirements: [
      "POKEGEAR",
      "CLEFAIRY",
    ],
    romOffsets: [
      [
        103,
        0x5222,
      ],
    ],
  },
  ROUTE_44_VANCES_GIFT: {
    id: "ROUTE_44_VANCES_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "CARBOS",
    areaId: "ROUTE_44",
    accessRequirements: [
      "POKEGEAR",
      "HALL_OF_FAME",
      "POWER_PLANT_MANAGERS_GIFT",
    ],
    romOffsets: [
      [
        103,
        0x58BF,
      ],
      [
        103,
        0x58D1,
      ],
    ],
  },
  ROUTE_44_WILTONS_GIFT_1: {
    id: "ROUTE_44_WILTONS_GIFT_1",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "ULTRA_BALL",
    areaId: "ROUTE_44",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        103,
        0x59CA,
      ],
    ],
  },
  ROUTE_44_WILTONS_GIFT_2: {
    id: "ROUTE_44_WILTONS_GIFT_2",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "GREAT_BALL",
    areaId: "ROUTE_44",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        103,
        0x59D3,
      ],
    ],
  },
  ROUTE_44_WILTONS_GIFT_3: {
    id: "ROUTE_44_WILTONS_GIFT_3",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "POKE_BALL",
    areaId: "ROUTE_44",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        103,
        0x59DC,
      ],
    ],
  },
  ROUTE_45_KENJIS_GIFT: {
    id: "ROUTE_45_KENJIS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "PP_UP",
    areaId: "ROUTE_45",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        103,
        0x60FE,
      ],
    ],
  },
  ROUTE_45_PARRYS_GIFT: {
    id: "ROUTE_45_PARRYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "IRON",
    areaId: "ROUTE_45",
    accessRequirements: [
      "POKEGEAR",
      "HALL_OF_FAME",
      "POWER_PLANT_MANAGERS_GIFT",
    ],
    romOffsets: [
      [
        103,
        0x620D,
      ],
      [
        103,
        0x621F,
      ],
    ],
  },
  ROUTE_25_KEVINS_GIFT: {
    id: "ROUTE_25_KEVINS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "NUGGET",
    areaId: "ROUTE_25",
    romOffsets: [
      [
        103,
        0x6FBF,
      ],
    ],
  },
  ROUTE_27_WHIRLPOOL_AREA_JOSES_GIFT: {
    id: "ROUTE_27_WHIRLPOOL_AREA_JOSES_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "STAR_PIECE",
    areaId: "ROUTE_27_WHIRLPOOL_AREA",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        104,
        0x4949,
      ],
    ],
  },
  ROUTE_29_TUSCANYS_GIFT: {
    id: "ROUTE_29_TUSCANYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "PINK_BOW",
    areaId: "ROUTE_29",
    accessRequirements: [
      "ZEPHYRBADGE",
    ],
    romOffsets: [
      [
        104,
        0x5069,
      ],
    ],
  },
  ROUTE_30_CHERRYGROVE_SIDE_JOEYS_GIFT: {
    id: "ROUTE_30_CHERRYGROVE_SIDE_JOEYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "HP_UP",
    areaId: "ROUTE_30_CHERRYGROVE_SIDE",
    accessRequirements: [
      "POKEGEAR",
      "HALL_OF_FAME",
      "GOLDENROD_CITY_MAIN_AREA",
      "OLIVINE_CITY",
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    ],
    romOffsets: [
      [
        104,
        0x5763,
      ],
      [
        104,
        0x5775,
      ],
    ],
  },
  ROUTE_38_DANAS_GIFT: {
    id: "ROUTE_38_DANAS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "THUNDERSTONE",
    areaId: "ROUTE_38",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        104,
        0x5DFA,
      ],
    ],
  },
  BLACKTHORN_CITY_SANTOSS_GIFT: {
    id: "BLACKTHORN_CITY_SANTOSS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "SPELL_TAG",
    areaId: "BLACKTHORN_CITY",
    romOffsets: [
      [
        105,
        0x474B,
      ],
    ],
  },
  ROUTE_31_WADES_GIFT_1: {
    id: "ROUTE_31_WADES_GIFT_1",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "BERRY",
    areaId: "ROUTE_31",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        105,
        0x5523,
      ],
    ],
  },
  ROUTE_31_WADES_GIFT_2: {
    id: "ROUTE_31_WADES_GIFT_2",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "PSNCUREBERRY",
    areaId: "ROUTE_31",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        105,
        0x552C,
      ],
    ],
  },
  ROUTE_31_WADES_GIFT_3: {
    id: "ROUTE_31_WADES_GIFT_3",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "PRZCUREBERRY",
    areaId: "ROUTE_31",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        105,
        0x5535,
      ],
    ],
  },
  ROUTE_31_WADES_GIFT_4: {
    id: "ROUTE_31_WADES_GIFT_4",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "BITTER_BERRY",
    areaId: "ROUTE_31",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        105,
        0x553E,
      ],
    ],
  },
  ROUTE_39_DEREKS_GIFT_FOR_PIKACHU: {
    id: "ROUTE_39_DEREKS_GIFT_FOR_PIKACHU",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "NUGGET",
    areaId: "ROUTE_39",
    accessRequirements: [
      "POKEGEAR",
      "PIKACHU",
    ],
    romOffsets: [
      [
        105,
        0x5B4E,
      ],
    ],
  },
  ROUTE_40_MONICAS_GIFT: {
    id: "ROUTE_40_MONICAS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "SHARP_BEAK",
    areaId: "ROUTE_40",
    romOffsets: [
      [
        105,
        0x61F9,
      ],
    ],
  },
  ROUTE_37_SUNNYS_GIFT: {
    id: "ROUTE_37_SUNNYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "MAGNET",
    areaId: "ROUTE_37",
    romOffsets: [
      [
        106,
        0x4DEC,
      ],
    ],
  },
  ROUTE_42_MAHOGANY_SIDE_TULLYS_GIFT: {
    id: "ROUTE_42_MAHOGANY_SIDE_TULLYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "WATER_STONE",
    areaId: "ROUTE_42_MAHOGANY_SIDE",
    accessRequirements: [
      "POKEGEAR",
    ],
    romOffsets: [
      [
        106,
        0x52E0,
      ],
    ],
  },
  ROUTE_46_NORTH_AREA_ERINS_GIFT: {
    id: "ROUTE_46_NORTH_AREA_ERINS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "CALCIUM",
    areaId: "ROUTE_46_NORTH_AREA",
    accessRequirements: [
      "POKEGEAR",
      "HALL_OF_FAME",
      "POWER_PLANT_MANAGERS_GIFT",
    ],
    romOffsets: [
      [
        106,
        0x572F,
      ],
      [
        106,
        0x5741,
      ],
    ],
  },
  VERMILION_CITY_BADGE_GUYS_GIFT: {
    id: "VERMILION_CITY_BADGE_GUYS_GIFT",
    type: "GIFT",
    groupId: "REGULAR_GIFTS",
    itemId: "HP_UP",
    areaId: "VERMILION_CITY",
    accessRequirements: [
      16,
    ],
    romOffsets: [
      [
        106,
        0x69EF,
      ],
    ],
  },
}

export const tmGiftLocationsMap: IdMap<TMGiftLocationId, ItemLocation> = {
  GOLDENROD_GYM_WHITNEYS_GIFT: {
    id: "GOLDENROD_GYM_WHITNEYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM45",
    areaId: "GOLDENROD_GYM",
    romOffsets: [
      [
        21,
        0x4069,
      ],
    ],
  },
  GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_1: {
    id: "GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_1",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM27",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    romOffsets: [
      [
        21,
        0x60F3,
      ],
    ],
  },
  GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_2: {
    id: "GOLDENROD_DEPT_STORE_5F_RECEPTIONISTS_GIFT_2",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM21",
    areaId: "GOLDENROD_DEPT_STORE_5F",
    romOffsets: [
      [
        21,
        0x6108,
      ],
    ],
  },
  RADIO_TOWER_3F_WEST_AREA_LADYS_GIFT: {
    id: "RADIO_TOWER_3F_WEST_AREA_LADYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM11",
    areaId: "RADIO_TOWER_3F_WEST_AREA",
    accessRequirements: [
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    ],
    romOffsets: [
      [
        23,
        0x658F,
      ],
    ],
  },
  ROUTE_34_ILEX_FOREST_GATE_LADYS_GIFT: {
    id: "ROUTE_34_ILEX_FOREST_GATE_LADYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM12",
    areaId: "ROUTE_34_ILEX_FOREST_GATE",
    romOffsets: [
      [
        24,
        0x6D76,
      ],
    ],
  },
  VIOLET_GYM_FALKNERS_GIFT: {
    id: "VIOLET_GYM_FALKNERS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM31",
    areaId: "VIOLET_GYM",
    romOffsets: [
      [
        26,
        0x4404,
      ],
    ],
  },
  ILEX_FOREST_NORTH_AREA_HEADBUTT_GUYS_GIFT: {
    id: "ILEX_FOREST_NORTH_AREA_HEADBUTT_GUYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM02",
    areaId: "ILEX_FOREST_NORTH_AREA",
    romOffsets: [
      [
        27,
        0x6DEB,
      ],
    ],
  },
  CELADON_MANSION_ROOF_HOUSE_MANS_GIFT: {
    id: "CELADON_MANSION_ROOF_HOUSE_MANS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM03",
    areaId: "CELADON_MANSION_ROOF_HOUSE",
    romOffsets: [
      [
        28,
        0x5B19,
      ],
    ],
  },
  CELADON_GYM_ERIKAS_GIFT: {
    id: "CELADON_GYM_ERIKAS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM19",
    areaId: "CELADON_GYM",
    romOffsets: [
      [
        28,
        0x6AA6,
      ],
    ],
  },
  ROUTE_27_SANDSTORM_HOUSE_LADYS_GIFT: {
    id: "ROUTE_27_SANDSTORM_HOUSE_LADYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM37",
    areaId: "ROUTE_27_SANDSTORM_HOUSE",
    romOffsets: [
      [
        30,
        0x73AF,
      ],
    ],
  },
  ECRUTEAK_GYM_MORTYS_GIFT: {
    id: "ECRUTEAK_GYM_MORTYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM30",
    areaId: "ECRUTEAK_GYM",
    romOffsets: [
      [
        38,
        0x5DA3,
      ],
    ],
  },
  OLIVINE_GYM_JASMINES_GIFT: {
    id: "OLIVINE_GYM_JASMINES_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM23",
    areaId: "OLIVINE_GYM",
    accessRequirements: [
      "SECRETPOTION",
      "OLIVINE_LIGHTHOUSE_6F",
    ],
    romOffsets: [
      [
        39,
        0x4164,
      ],
    ],
  },
  ROUTE_39_FARMHOUSE_LADYS_GIFT: {
    id: "ROUTE_39_FARMHOUSE_LADYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM13",
    areaId: "ROUTE_39_FARMHOUSE",
    accessRequirements: [
      "ROUTE_39_BARN",
      { item: "BERRY", number: 7 },
    ],
    romOffsets: [
      [
        39,
        0x4F27,
      ],
    ],
  },
  CIANWOOD_GYM_STRENGTH_AREA_CHUCKS_GIFT: {
    id: "CIANWOOD_GYM_STRENGTH_AREA_CHUCKS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM01",
    areaId: "CIANWOOD_GYM_STRENGTH_AREA",
    romOffsets: [
      [
        39,
        0x566D,
      ],
    ],
  },
  POWER_PLANT_MANAGERS_GIFT: {
    id: "POWER_PLANT_MANAGERS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM07",
    areaId: "POWER_PLANT",
    accessRequirements: [
      "MACHINE_PART",
    ],
    romOffsets: [
      [
        98,
        0x4EB7,
      ],
    ],
  },
  MR_PSYCHICS_HOUSE_MR_PSYCHICS_GIFT: {
    id: "MR_PSYCHICS_HOUSE_MR_PSYCHICS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM29",
    areaId: "MR_PSYCHICS_HOUSE",
    romOffsets: [
      [
        98,
        0x6787,
      ],
    ],
  },
  AZALEA_GYM_BUGSYS_GIFT: {
    id: "AZALEA_GYM_BUGSYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM49",
    areaId: "AZALEA_GYM",
    romOffsets: [
      [
        99,
        0x6C5F,
      ],
    ],
  },
  ROUTE_32_CUT_AREA_ROAR_GUYS_GIFT: {
    id: "ROUTE_32_CUT_AREA_ROAR_GUYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM05",
    areaId: "ROUTE_32_CUT_AREA",
    romOffsets: [
      [
        100,
        0x44DB,
      ],
    ],
  },
  ROUTE_36_EAST_AREA_ROCK_SMASH_GUYS_GIFT: {
    id: "ROUTE_36_EAST_AREA_ROCK_SMASH_GUYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM08",
    areaId: "ROUTE_36_EAST_AREA",
    accessRequirements: [
      "SQUIRTBOTTLE",
    ],
    romOffsets: [
      [
        101,
        0x40D2,
      ],
    ],
  },
  FUCHSIA_GYM_JANINES_GIFT: {
    id: "FUCHSIA_GYM_JANINES_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM06",
    areaId: "FUCHSIA_GYM",
    romOffsets: [
      [
        101,
        0x5E0D,
      ],
    ],
  },
  MAHOGANY_GYM_PRYCES_GIFT: {
    id: "MAHOGANY_GYM_PRYCES_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM16",
    areaId: "MAHOGANY_GYM",
    romOffsets: [
      [
        102,
        0x5AE2,
      ],
    ],
  },
  LAKE_OF_RAGE_HIDDEN_POWER_HOUSE_MANS_GIFT: {
    id: "LAKE_OF_RAGE_HIDDEN_POWER_HOUSE_MANS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM10",
    areaId: "LAKE_OF_RAGE_HIDDEN_POWER_HOUSE",
    romOffsets: [
      [
        102,
        0x6534,
      ],
    ],
  },
  ROUTE_43_GATE_GUARDS_GIFT: {
    id: "ROUTE_43_GATE_GUARDS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM36",
    areaId: "ROUTE_43_GATE",
    accessRequirements: [
      "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
    ],
    romOffsets: [
      [
        102,
        0x6C92,
      ],
    ],
  },
  ROUTE_31_MANS_GIFT_FOR_RANDYS_MAIL: {
    id: "ROUTE_31_MANS_GIFT_FOR_RANDYS_MAIL",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM50",
    areaId: "ROUTE_31",
    accessRequirements: [
      "ROUTE_35_GOLDENROD_GATE",
    ],
    romOffsets: [
      [
        105,
        0x55A7,
      ],
    ],
  },
  VIRIDIAN_CITY_ISOLATED_AREA_DREAM_EATER_GUYS_GIFT: {
    id: "VIRIDIAN_CITY_ISOLATED_AREA_DREAM_EATER_GUYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM42",
    areaId: "VIRIDIAN_CITY_ISOLATED_AREA",
    romOffsets: [
      [
        106,
        0x5A82,
      ],
    ],
  },
  ROUTE_28_STEEL_WING_HOUSE_LADYS_GIFT: {
    id: "ROUTE_28_STEEL_WING_HOUSE_LADYS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM47",
    areaId: "ROUTE_28_STEEL_WING_HOUSE",
    romOffsets: [
      [
        107,
        0x6665,
      ],
    ],
  },
  DRAGONS_DEN_B1F_SOUTH_AREA_CLAIRS_GIFT: {
    id: "DRAGONS_DEN_B1F_SOUTH_AREA_CLAIRS_GIFT",
    type: "GIFT",
    groupId: "TM_GIFTS",
    itemId: "TM24",
    areaId: "DRAGONS_DEN_B1F_SOUTH_AREA",
    accessRequirements: [
      "DRAGON_SHRINE_BADGE",
    ],
    romOffsets: [
      [
        99,
        0x48D5,
      ],
    ],
  },
}

export const hmGiftLocationsMap: IdMap<HMGiftLocationId, ItemLocation> = {
  ILEX_FOREST_SOUTH_AREA_CHARCOAL_BOSSS_GIFT: {
    id: "ILEX_FOREST_SOUTH_AREA_CHARCOAL_BOSSS_GIFT",
    type: "GIFT",
    groupId: "HMS",
    itemId: "HM01",
    areaId: "ILEX_FOREST_SOUTH_AREA",
    accessRequirements: [
      "SLOWPOKE_WELL_B1F_EAST_AREA",
    ],
    romOffsets: [[
      27,
      0x6DBB,
    ]],
  },
  CIANWOOD_CITY_CHUCKS_WIFES_GIFT: {
    id: "CIANWOOD_CITY_CHUCKS_WIFES_GIFT",
    type: "GIFT",
    groupId: "HMS",
    itemId: "HM02",
    areaId: "CIANWOOD_CITY",
    accessRequirements: [
      "CIANWOOD_GYM_STRENGTH_AREA",
    ],
    romOffsets: [[
      104,
      0x40A1,
    ]],
  },
  DANCE_THEATER_MANS_GIFT: {
    id: "DANCE_THEATER_MANS_GIFT",
    type: "GIFT",
    groupId: "HMS",
    itemId: "HM03",
    areaId: "DANCE_THEATER",
    romOffsets: [[
      38,
      0x550A,
    ]],
  },
  OLIVINE_CAFE_SAILORS_GIFT: {
    id: "OLIVINE_CAFE_SAILORS_GIFT",
    type: "GIFT",
    groupId: "HMS",
    itemId: "HM04",
    areaId: "OLIVINE_CAFE",
    romOffsets: [[
      39,
      0x48CE,
    ]],
  },
  SPROUT_TOWER_3F_SAGE_LIS_GIFT: {
    id: "SPROUT_TOWER_3F_SAGE_LIS_GIFT",
    type: "GIFT",
    groupId: "HMS",
    itemId: "HM05",
    areaId: "SPROUT_TOWER_3F",
    romOffsets: [[
      97,
      0x49C3,
    ]],
  },
  TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT: {
    id: "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT",
    type: "GIFT",
    groupId: "HMS",
    itemId: "HM06",
    areaId: "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA",
    romOffsets: [[
      27,
      0x5197,
    ]],
  },
}

export const keyItemGiftLocationsMap: IdMap<KeyItemGiftLocationId, ItemLocation> = {
  ELMS_LAB_ELMS_GIFT_TO_CHAMPION: {
    id: "ELMS_LAB_ELMS_GIFT_TO_CHAMPION",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "S_S_TICKET",
    areaId: "ELMS_LAB",
    accessRequirements: [
      "HALL_OF_FAME",
    ],
    romOffsets: [[
      30,
      0x4E34,
    ]],
  },
  MR_POKEMONS_HOUSE_MR_POKEMONS_FREE_GIFT: {
    id: "MR_POKEMONS_HOUSE_MR_POKEMONS_FREE_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "MYSTERY_EGG",
    areaId: "MR_POKEMONS_HOUSE",
    romOffsets: [[
      101,
      0x6E6D,
    ]],
  },
  ROUTE_32_POKECENTER_1F_MANS_GIFT: {
    id: "ROUTE_32_POKECENTER_1F_MANS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "OLD_ROD",
    areaId: "ROUTE_32_POKECENTER_1F",
    romOffsets: [[
      26,
      0x5B69,
    ]],
  },
  AZALEA_TOWN_KURTS_GIFT_FOR_GS_BALL: {
    id: "AZALEA_TOWN_KURTS_GIFT_FOR_GS_BALL",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "GS_BALL",
    areaId: "AZALEA_TOWN",
    accessRequirements: [
      "GS_BALL",
      "KURTS_HOUSE",
      "SLOWPOKE_WELL_B1F_EAST_AREA",
    ],
    romOffsets: [[
      102,
      0x40FA,
    ]],
  },
  GOLDENROD_BIKE_SHOP_OWNERS_GIFT: {
    id: "GOLDENROD_BIKE_SHOP_OWNERS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "BICYCLE",
    areaId: "GOLDENROD_BIKE_SHOP",
    romOffsets: [[
      21,
      0x4764,
    ]],
  },
  RADIO_TOWER_2F_BUENAS_GIFT: {
    id: "RADIO_TOWER_2F_BUENAS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "BLUE_CARD",
    areaId: "RADIO_TOWER_2F",
    accessRequirements: [
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    ],
    romOffsets: [[
      23,
      0x5808,
    ]],
  },
  GOLDENROD_FLOWER_SHOP_OWNERS_GIFT: {
    id: "GOLDENROD_FLOWER_SHOP_OWNERS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "SQUIRTBOTTLE",
    areaId: "GOLDENROD_FLOWER_SHOP",
    accessRequirements: [
      "ROUTE_36_WEST_AREA",
      "PLAINBADGE",
      "GOLDENROD_CITY_MAIN_AREA",
    ],
    romOffsets: [[
      21,
      0x5382,
    ]],
  },
  RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT: {
    id: "RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "BASEMENT_KEY",
    areaId: "RADIO_TOWER_5F_WEST_AREA",
    romOffsets: [[
      24,
      0x403D,
    ]],
  },
  GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT: {
    id: "GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "CARD_KEY",
    areaId: "GOLDENROD_UNDERGROUND_WAREHOUSE",
    accessRequirements: [
      7,
    ],
    romOffsets: [[
      31,
      0x59CC,
    ]],
  },
  RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT: {
    id: "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "CLEAR_BELL",
    areaId: "RADIO_TOWER_5F_EAST_AREA",
    romOffsets: [[
      24,
      0x40DB,
    ]],
  },
  GOLDENROD_POKECENTER_1F_LINK_RECEPTIONISTS_GIFT: {
    id: "GOLDENROD_POKECENTER_1F_LINK_RECEPTIONISTS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "GS_BALL",
    areaId: "GOLDENROD_POKECENTER_1F",
    accessRequirements: [
      "INACCESSIBLE",
    ],
    romOffsets: [
      [
        24,
        0x4FBF,
      ],
      [
        24,
        0x5004,
      ],
    ],
  },
  ECRUTEAK_ITEMFINDER_HOUSE_MANS_GIFT: {
    id: "ECRUTEAK_ITEMFINDER_HOUSE_MANS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "ITEMFINDER",
    areaId: "ECRUTEAK_ITEMFINDER_HOUSE",
    romOffsets: [[
      38,
      0x660F,
    ]],
  },
  TIN_TOWER_1F_NORTH_SAGES_GIFT: {
    id: "TIN_TOWER_1F_NORTH_SAGES_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "RAINBOW_WING",
    areaId: "TIN_TOWER_1F",
    accessRequirements: [
      "HALL_OF_FAME",
      "SUICUNE",
      "ENTEI",
      "RAIKOU",
    ],
    romOffsets: [[
      97,
      0x519B,
    ]],
  },
  OLIVINE_GOOD_ROD_HOUSE_MANS_GIFT: {
    id: "OLIVINE_GOOD_ROD_HOUSE_MANS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "GOOD_ROD",
    areaId: "OLIVINE_GOOD_ROD_HOUSE",
    romOffsets: [[
      39,
      0x472F,
    ]],
  },
  CIANWOOD_PHARMACY_OWNERS_GIFT: {
    id: "CIANWOOD_PHARMACY_OWNERS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "SECRETPOTION",
    areaId: "CIANWOOD_PHARMACY",
    accessRequirements: [
      "OLIVINE_LIGHTHOUSE_6F",
    ],
    romOffsets: [[
      39,
      0x5FB1,
    ]],
  },
  LAKE_OF_RAGE_SURF_AREA_SHINYS_GIFT: {
    id: "LAKE_OF_RAGE_SURF_AREA_SHINYS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "RED_SCALE",
    areaId: "LAKE_OF_RAGE_SURF_AREA",
    romOffsets: [[
      28,
      0x407D,
    ]],
  },
  POKEMON_FAN_CLUB_MEMBERS_GIFT: {
    id: "POKEMON_FAN_CLUB_MEMBERS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "LOST_ITEM",
    areaId: "POKEMON_FAN_CLUB",
    accessRequirements: [
      "POWER_PLANT",
      "MACHINE_PART",
    ],
    romOffsets: [[
      100,
      0x584A,
    ]],
  },
  COPYCATS_HOUSE_2F_COPYCATS_GIFT: {
    id: "COPYCATS_HOUSE_2F_COPYCATS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "PASS",
    areaId: "COPYCATS_HOUSE_2F",
    accessRequirements: [
      "LOST_ITEM",
    ],
    romOffsets: [[
      98,
      0x6F61,
    ]],
  },
  ROUTE_12_SUPER_ROD_HOUSE_MANS_GIFT: {
    id: "ROUTE_12_SUPER_ROD_HOUSE_MANS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "SUPER_ROD",
    areaId: "ROUTE_12_SUPER_ROD_HOUSE",
    romOffsets: [[
      31,
      0x7498,
    ]],
  },
  PEWTER_CITY_OLD_MANS_GIFT: {
    id: "PEWTER_CITY_OLD_MANS_GIFT",
    type: "GIFT",
    groupId: "KEY_ITEMS",
    itemId: "SILVER_WING",
    areaId: "PEWTER_CITY",
    romOffsets: [[
      99,
      0x401C,
    ]],
  },
}

export const menuItemGiftLocationsMap: IdMap<MenuItemGiftLocationId, ItemLocation> = {
  PLAYERS_HOUSE_1F_MOMS_GIFT: {
    id: "PLAYERS_HOUSE_1F_MOMS_GIFT",
    type: "GIFT",
    groupId: "MENU_ITEMS",
    itemId: "POKEGEAR",
    areaId: "PLAYERS_HOUSE_1F",
    romOffsets: [[
      30,
      0x64FC,
    ]],
  },
  CHERRYGROVE_CITY_GUIDE_GENTS_GIFT: {
    id: "CHERRYGROVE_CITY_GUIDE_GENTS_GIFT",
    type: "GIFT",
    groupId: "MENU_ITEMS",
    itemId: "MAP_CARD",
    areaId: "CHERRYGROVE_CITY",
    romOffsets: [[
      103,
      0x4070,
    ]],
  },
  MR_POKEMONS_HOUSE_OAKS_GIFT: {
    id: "MR_POKEMONS_HOUSE_OAKS_GIFT",
    type: "GIFT",
    groupId: "MENU_ITEMS",
    itemId: "POKEDEX",
    areaId: "MR_POKEMONS_HOUSE",
    romOffsets: [[
      101,
      0x6ED9,
    ]],
  },
  RUINS_OF_ALPH_OUTSIDE_MAIN_AREA_RESEARCHERS_GIFT: {
    id: "RUINS_OF_ALPH_OUTSIDE_MAIN_AREA_RESEARCHERS_GIFT",
    type: "GIFT",
    groupId: "MENU_ITEMS",
    itemId: "UNONWNDEX",
    areaId: "RUINS_OF_ALPH_OUTSIDE_MAIN_AREA",
    accessRequirements: [
      "UNOWN",
    ],
    romOffsets: [[
      22,
      0x51B9,
    ]],
  },
  RADIO_TOWER_1F_QUIZ_PRIZE: {
    id: "RADIO_TOWER_1F_QUIZ_PRIZE",
    type: "GIFT",
    groupId: "MENU_ITEMS",
    itemId: "RADIO_CARD",
    areaId: "RADIO_TOWER_1F",
    accessRequirements: [
      "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT",
    ],
    romOffsets: [[
      23,
      0x4E20,
    ]],
  },
  LAV_RADIO_TOWER_1F_DIRECTORS_GIFT: {
    id: "LAV_RADIO_TOWER_1F_DIRECTORS_GIFT",
    type: "GIFT",
    groupId: "MENU_ITEMS",
    itemId: "EXPN_CARD",
    areaId: "LAV_RADIO_TOWER_1F",
    accessRequirements: [
      "POWER_PLANT",
      "MACHINE_PART",
    ],
    romOffsets: [[
      31,
      0x6E85,
    ]],
  },
}

export const badgeLocationsMap: IdMap<BadgeLocationId, ItemLocation> = {
  VIOLET_GYM_BADGE: {
    id: "VIOLET_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "ZEPHYRBADGE",
    areaId: "VIOLET_GYM",
    romOffsets: [[
      26,
      0x43F1,
    ]],
  },
  AZALEA_GYM_BADGE: {
    id: "AZALEA_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "HIVEBADGE",
    areaId: "AZALEA_GYM",
    romOffsets: [[
      99,
      0x6C4C,
    ]],
  },
  GOLDENROD_GYM_BADGE: {
    id: "GOLDENROD_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "PLAINBADGE",
    areaId: "GOLDENROD_GYM",
    romOffsets: [[
      21,
      0x404F,
    ]],
  },
  ECRUTEAK_GYM_BADGE: {
    id: "ECRUTEAK_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "FOGBADGE",
    areaId: "ECRUTEAK_GYM",
    romOffsets: [[
      38,
      0x5D90,
    ]],
  },
  CIANWOOD_GYM_BADGE: {
    id: "CIANWOOD_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "STORMBADGE",
    areaId: "CIANWOOD_GYM_STRENGTH_AREA",
    romOffsets: [[
      39,
      0x565A,
    ]],
  },
  OLIVINE_GYM_BADGE: {
    id: "OLIVINE_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "MINERALBADGE",
    areaId: "OLIVINE_GYM",
    accessRequirements: [
      "OLIVINE_LIGHTHOUSE_6F",
      "SECRETPOTION",
    ],
    romOffsets: [[
      39,
      0x4151,
    ]],
  },
  MAHOGANY_GYM_BADGE: {
    id: "MAHOGANY_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "GLACIERBADGE",
    areaId: "MAHOGANY_GYM",
    romOffsets: [[
      102,
      0x5ACF,
    ]],
  },
  DRAGON_SHRINE_BADGE: {
    id: "DRAGON_SHRINE_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "RISINGBADGE",
    areaId: "DRAGON_SHRINE",
    romOffsets: [[
      99,
      0x5162,
    ]],
  },
  PEWTER_GYM_BADGE: {
    id: "PEWTER_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "BOULDERBADGE",
    areaId: "PEWTER_GYM",
    romOffsets: [[
      104,
      0x6887,
    ]],
  },
  CERULEAN_GYM_BADGE: {
    id: "CERULEAN_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "CASCADEBADGE",
    areaId: "CERULEAN_GYM",
    accessRequirements: [
      "ROUTE_25",
      "POWER_PLANT",
    ],
    romOffsets: [[
      98,
      0x445B,
    ]],
  },
  VERMILION_GYM_BADGE: {
    id: "VERMILION_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "THUNDERBADGE",
    areaId: "VERMILION_GYM",
    romOffsets: [[
      100,
      0x60CE,
    ]],
  },
  CELADON_GYM_BADGE: {
    id: "CELADON_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "RAINBOWBADGE",
    areaId: "CELADON_GYM",
    romOffsets: [[
      28,
      0x6A96,
    ]],
  },
  FUCHSIA_GYM_BADGE: {
    id: "FUCHSIA_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "SOULBADGE",
    areaId: "FUCHSIA_GYM",
    romOffsets: [[
      101,
      0x5DF8,
    ]],
  },
  SAFFRON_GYM_BADGE: {
    id: "SAFFRON_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "MARSHBADGE",
    areaId: "SAFFRON_GYM_CENTRAL_AREA",
    romOffsets: [[
      98,
      0x5C5A,
    ]],
  },
  SEAFOAM_GYM_BADGE: {
    id: "SEAFOAM_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "VOLCANOBADGE",
    areaId: "SEAFOAM_GYM",
    romOffsets: [[
      106,
      0x7520,
    ]],
  },
  VIRIDIAN_GYM_BADGE: {
    id: "VIRIDIAN_GYM_BADGE",
    type: "GIFT",
    groupId: "BADGES",
    itemId: "EARTHBADGE",
    areaId: "VIRIDIAN_GYM",
    accessRequirements: [
      "CINNABAR_ISLAND",
    ],
    romOffsets: [[
      38,
      0x6A46,
    ]],
  },
}

export const itemLocationsMap = {
  ...regularItemBallLocationsMap,
  ...tmItemBallLocationsMap,
  ...hmItemBallLocationsMap,
  ...keyItemItemBallLocationsMap,
  ...regularHiddenItemLocationsMap,
  ...keyItemHiddenItemLocationsMap,
  ...fruitTreeLocationsMap,
  ...regularGiftLocationsMap,
  ...tmGiftLocationsMap,
  ...hmGiftLocationsMap,
  ...keyItemGiftLocationsMap,
  ...menuItemGiftLocationsMap,
  ...badgeLocationsMap,
}