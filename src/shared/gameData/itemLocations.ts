import type { ItemLocation } from "@shared/types/gameData/itemLocation"
import type { HiddenItemLocationId, RegularItemBallLocationId, TMItemBallLocationId } from "@shared/types/gameDataIds/itemLocations"

export const regularItemBallLocationsMap: IdMap<RegularItemBallLocationId, ItemLocation> = {
  ROUTE_2_SE_AREA_ITEM_BALL: {
    id: "ROUTE_2_SE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ELIXER",
    romOffset: [
      107,
      0x4304,
    ],
  },
  ROUTE_2_DIGLETTS_CAVE_AREA_ITEM_BALL: {
    id: "ROUTE_2_DIGLETTS_CAVE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "CARBOS",
    romOffset: [
      107,
      0x4302,
    ],
  },
  ROUTE_2_FOREST_AREA_ITEM_BALL_BY_VIRIDIAN_ENTRANCE: {
    id: "ROUTE_2_FOREST_AREA_ITEM_BALL_BY_VIRIDIAN_ENTRANCE",
    type: "ITEM_BALL",
    itemId: "DIRE_HIT",
    romOffset: [
      107,
      0x42FE,
    ],
  },
  ROUTE_2_FOREST_AREA_ITEM_BALL_BY_PEWTER_ENTRANCE: {
    id: "ROUTE_2_FOREST_AREA_ITEM_BALL_BY_PEWTER_ENTRANCE",
    type: "ITEM_BALL",
    itemId: "MAX_POTION",
    romOffset: [
      107,
      0x4300,
    ],
  },
  ROUTE_4_MOUNT_MOON_AREA_ITEM_BALL: {
    id: "ROUTE_4_MOUNT_MOON_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "HP_UP",
    romOffset: [
      107,
      0x620F,
    ],
  },
  ROUTE_12_CUT_AREA_ITEM_BALL: {
    id: "ROUTE_12_CUT_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "CALCIUM",
    romOffset: [
      105,
      0x700B,
    ],
  },
  ROUTE_12_SURF_CUT_AREA_ITEM_BALL: {
    id: "ROUTE_12_SURF_CUT_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "NUGGET",
    romOffset: [
      105,
      0x700D,
    ],
  },
  ROUTE_15_CUT_AREA_ITEM_BALL: {
    id: "ROUTE_15_CUT_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PP_UP",
    romOffset: [
      106,
      0x65E4,
    ],
  },
  ROUTE_25_CUT_AREA_ITEM_BALL: {
    id: "ROUTE_25_CUT_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PROTEIN",
    romOffset: [
      103,
      0x6FE3,
    ],
  },
  ROUTE_26_ITEM_BALL: {
    id: "ROUTE_26_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_ELIXER",
    romOffset: [
      105,
      0x4EC4,
    ],
  },
  ROUTE_27_WEST_SURF_AREA_ITEM_BALL: {
    id: "ROUTE_27_WEST_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "RARE_CANDY",
    romOffset: [
      104,
      0x4A64,
    ],
  },
  ROUTE_29_ITEM_BALL: {
    id: "ROUTE_29_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "POTION",
    romOffset: [
      104,
      0x508B,
    ],
  },
  ROUTE_30_CHERRYGROVE_SIDE_ITEM_BALL: {
    id: "ROUTE_30_CHERRYGROVE_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ANTIDOTE",
    romOffset: [
      104,
      0x57F5,
    ],
  },
  ROUTE_31_ITEM_BALL_BY_DARK_CAVE: {
    id: "ROUTE_31_ITEM_BALL_BY_DARK_CAVE",
    type: "ITEM_BALL",
    itemId: "POTION",
    romOffset: [
      105,
      0x55FB,
    ],
  },
  ROUTE_31_ITEM_BALL_BY_TRAINER: {
    id: "ROUTE_31_ITEM_BALL_BY_TRAINER",
    type: "ITEM_BALL",
    itemId: "POKE_BALL",
    romOffset: [
      105,
      0x55FD,
    ],
  },
  ROUTE_32_ITEM_BALL_IN_NORTH_GRASS: {
    id: "ROUTE_32_ITEM_BALL_IN_NORTH_GRASS",
    type: "ITEM_BALL",
    itemId: "REPEL",
    romOffset: [
      100,
      0x4775,
    ],
  },
  ROUTE_32_ITEM_BALL_IN_SOUTH_GRASS: {
    id: "ROUTE_32_ITEM_BALL_IN_SOUTH_GRASS",
    type: "ITEM_BALL",
    itemId: "GREAT_BALL",
    romOffset: [
      100,
      0x4773,
    ],
  },
  ROUTE_34_SURF_AREA_ITEM_BALL: {
    id: "ROUTE_34_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "NUGGET",
    romOffset: [
      30,
      0x432B,
    ],
  },
  ROUTE_42_MIDDLE_AREA_ITEM_BALL: {
    id: "ROUTE_42_MIDDLE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "SUPER_POTION",
    romOffset: [
      106,
      0x534B,
    ],
  },
  ROUTE_42_ECRUTEAK_SIDE_ITEM_BALL: {
    id: "ROUTE_42_ECRUTEAK_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      106,
      0x5349,
    ],
  },
  ROUTE_43_ITEM_BALL: {
    id: "ROUTE_43_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_ETHER",
    romOffset: [
      103,
      0x5268,
    ],
  },
  ROUTE_44_ITEM_BALL_BY_ICE_PATH: {
    id: "ROUTE_44_ITEM_BALL_BY_ICE_PATH",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      103,
      0x5A44,
    ],
  },
  ROUTE_44_SURF_AREA_ITEM_BALL: {
    id: "ROUTE_44_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_REVIVE",
    romOffset: [
      103,
      0x5A42,
    ],
  },
  ROUTE_44_ITEM_BALL_BY_MAHOGANY: {
    id: "ROUTE_44_ITEM_BALL_BY_MAHOGANY",
    type: "ITEM_BALL",
    itemId: "MAX_REPEL",
    romOffset: [
      103,
      0x5A46,
    ],
  },
  ROUTE_45_ITEM_BALL_1: {
    id: "ROUTE_45_ITEM_BALL_1",
    type: "ITEM_BALL",
    itemId: "ELIXER",
    romOffset: [
      103,
      0x629A,
    ],
  },
  ROUTE_45_ITEM_BALL_2: {
    id: "ROUTE_45_ITEM_BALL_2",
    type: "ITEM_BALL",
    itemId: "MAX_POTION",
    romOffset: [
      103,
      0x629C,
    ],
  },
  ROUTE_45_ITEM_BALL_3: {
    id: "ROUTE_45_ITEM_BALL_3",
    type: "ITEM_BALL",
    itemId: "NUGGET",
    romOffset: [
      103,
      0x6296,
    ],
  },
  ROUTE_45_ITEM_BALL_4: {
    id: "ROUTE_45_ITEM_BALL_4",
    type: "ITEM_BALL",
    itemId: "REVIVE",
    romOffset: [
      103,
      0x6298,
    ],
  },
  ROUTE_46_DARK_CAVE_SIDE_ITEM_BALL: {
    id: "ROUTE_46_DARK_CAVE_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "X_SPEED",
    romOffset: [
      106,
      0x578D,
    ],
  },
  DARK_CAVE_VIOLET_ENTRANCE_VIOLET_SIDE_ITEM_BALL: {
    id: "DARK_CAVE_VIOLET_ENTRANCE_VIOLET_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "POTION",
    romOffset: [
      99,
      0x468E,
    ],
  },
  DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_1: {
    id: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_1",
    type: "ITEM_BALL",
    itemId: "HYPER_POTION",
    romOffset: [
      99,
      0x4692,
    ],
  },
  DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_2: {
    id: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_2",
    type: "ITEM_BALL",
    itemId: "FULL_HEAL",
    romOffset: [
      99,
      0x4690,
    ],
  },
  DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_3: {
    id: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_ITEM_3",
    type: "ITEM_BALL",
    itemId: "DIRE_HIT",
    romOffset: [
      99,
      0x4694,
    ],
  },
  DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_ON_PLATEAU: {
    id: "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_ON_PLATEAU",
    type: "ITEM_BALL",
    itemId: "REVIVE",
    romOffset: [
      99,
      0x473B,
    ],
  },
  VIOLET_CITY_EAST_SURF_AREA_ITEM_BALL: {
    id: "VIOLET_CITY_EAST_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "RARE_CANDY",
    romOffset: [
      106,
      0x4423,
    ],
  },
  VIOLET_CITY_WEST_SURF_AREA_ITEM_BALL: {
    id: "VIOLET_CITY_WEST_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PP_UP",
    romOffset: [
      106,
      0x4421,
    ],
  },
  SPROUT_TOWER_1F_NORTH_AREA_ITEM_BALL: {
    id: "SPROUT_TOWER_1F_NORTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PARLYZ_HEAL",
    romOffset: [
      97,
      0x451E,
    ],
  },
  SPROUT_TOWER_2F_SW_AREA_ITEM_BALL: {
    id: "SPROUT_TOWER_2F_SW_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "X_ACCURACY",
    romOffset: [
      97,
      0x47A7,
    ],
  },
  SPROUT_TOWER_3F_ITEM_SW_BALL: {
    id: "SPROUT_TOWER_3F_ITEM_SW_BALL",
    type: "ITEM_BALL",
    itemId: "POTION",
    romOffset: [
      97,
      0x4A19,
    ],
  },
  SPROUT_TOWER_3F_ITEM_NE_BALL: {
    id: "SPROUT_TOWER_3F_ITEM_NE_BALL",
    type: "ITEM_BALL",
    itemId: "ESCAPE_ROPE",
    romOffset: [
      97,
      0x4A1B,
    ],
  },
  RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ENERGYPOWDER",
    romOffset: [
      22,
      0x59A8,
    ],
  },
  RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_NW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "HEAL_POWDER",
    romOffset: [
      22,
      0x59A6,
    ],
  },
  RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PSNCUREBERRY",
    romOffset: [
      22,
      0x59A4,
    ],
  },
  RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_KABUTO_ITEM_ROOM_SW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "BERRY",
    romOffset: [
      22,
      0x59A2,
    ],
  },
  RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ENERGY_ROOT",
    romOffset: [
      22,
      0x5ABC,
    ],
  },
  RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_NW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "HEAL_POWDER",
    romOffset: [
      22,
      0x5ABA,
    ],
  },
  RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MOON_STONE",
    romOffset: [
      22,
      0x5AB8,
    ],
  },
  RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_AERODACTYL_ITEM_ROOM_SW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "GOLD_BERRY",
    romOffset: [
      22,
      0x5AB6,
    ],
  },
  RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "STAR_PIECE",
    romOffset: [
      22,
      0x5A32,
    ],
  },
  RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_NW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "STARDUST",
    romOffset: [
      22,
      0x5A30,
    ],
  },
  RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MYSTIC_WATER",
    romOffset: [
      22,
      0x5A2E,
    ],
  },
  RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_OMANYTE_ITEM_ROOM_SW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MYSTERYBERRY",
    romOffset: [
      22,
      0x5A2C,
    ],
  },
  RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "CHARCOAL",
    romOffset: [
      22,
      0x591E,
    ],
  },
  RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_NW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "REVIVAL_HERB",
    romOffset: [
      22,
      0x591C,
    ],
  },
  RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SE_ITEM_BALL: {
    id: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MYSTERYBERRY",
    romOffset: [
      22,
      0x591A,
    ],
  },
  RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SW_ITEM_BALL: {
    id: "RUINS_OF_ALPH_HO_OH_ITEM_ROOM_SW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "GOLD_BERRY",
    romOffset: [
      22,
      0x5918,
    ],
  },
  UNION_CAVE_1F_ITEM_BALL_1: {
    id: "UNION_CAVE_1F_ITEM_BALL_1",
    type: "ITEM_BALL",
    itemId: "X_ATTACK",
    romOffset: [
      22,
      0x5C02,
    ],
  },
  UNION_CAVE_1F_ITEM_BALL_2: {
    id: "UNION_CAVE_1F_ITEM_BALL_2",
    type: "ITEM_BALL",
    itemId: "POTION",
    romOffset: [
      22,
      0x5C04,
    ],
  },
  UNION_CAVE_1F_ITEM_BALL_3: {
    id: "UNION_CAVE_1F_ITEM_BALL_3",
    type: "ITEM_BALL",
    itemId: "GREAT_BALL",
    romOffset: [
      22,
      0x5C00,
    ],
  },
  UNION_CAVE_1F_ITEM_BALL_4: {
    id: "UNION_CAVE_1F_ITEM_BALL_4",
    type: "ITEM_BALL",
    itemId: "AWAKENING",
    romOffset: [
      22,
      0x5C08,
    ],
  },
  UNION_CAVE_B1F_UNION_SIDE_EAST_ITEM_BALL: {
    id: "UNION_CAVE_B1F_UNION_SIDE_EAST_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "X_DEFEND",
    romOffset: [
      22,
      0x6018,
    ],
  },
  UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_IN_NE_CORNER: {
    id: "UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_IN_NE_CORNER",
    type: "ITEM_BALL",
    itemId: "ELIXER",
    romOffset: [
      22,
      0x636A,
    ],
  },
  UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_ON_PLATEAU: {
    id: "UNION_CAVE_B2F_SURF_AREA_ITEM_BALL_ON_PLATEAU",
    type: "ITEM_BALL",
    itemId: "HYPER_POTION",
    romOffset: [
      22,
      0x636C,
    ],
  },
  SLOWPOKE_WELL_B1F_AZALEA_SIDE_ITEM_BALL: {
    id: "SLOWPOKE_WELL_B1F_AZALEA_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "SUPER_POTION",
    romOffset: [
      22,
      0x66A3,
    ],
  },
  ILEX_FOREST_AZALEA_SIDE_ITEM_BALL: {
    id: "ILEX_FOREST_AZALEA_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "REVIVE",
    romOffset: [
      27,
      0x6E10,
    ],
  },
  ILEX_FOREST_ROUTE_34_SIDE_ITEM_BALL_1: {
    id: "ILEX_FOREST_ROUTE_34_SIDE_ITEM_BALL_1",
    type: "ITEM_BALL",
    itemId: "X_ATTACK",
    romOffset: [
      27,
      0x6E12,
    ],
  },
  ILEX_FOREST_ROUTE_34_SIDE_ITEM_BALL_2: {
    id: "ILEX_FOREST_ROUTE_34_SIDE_ITEM_BALL_2",
    type: "ITEM_BALL",
    itemId: "ANTIDOTE",
    romOffset: [
      27,
      0x6E14,
    ],
  },
  ILEX_FOREST_ROUTE_34_SIDE_ITEM_BALL_3: {
    id: "ILEX_FOREST_ROUTE_34_SIDE_ITEM_BALL_3",
    type: "ITEM_BALL",
    itemId: "ETHER",
    romOffset: [
      27,
      0x6E16,
    ],
  },
  NATIONAL_PARK_EAST_ITEM_BALL: {
    id: "NATIONAL_PARK_EAST_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PARLYZ_HEAL",
    romOffset: [
      23,
      0x41CC,
    ],
  },
  NATIONAL_PARK_BUG_CONTEST_EAST_ITEM_BALL: {
    id: "NATIONAL_PARK_BUG_CONTEST_EAST_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PARLYZ_HEAL",
    romOffset: [
      23,
      0x4945,
    ],
  },
  BURNED_TOWER_1F_ROCK_SMASH_AREA_ITEM_BALL: {
    id: "BURNED_TOWER_1F_ROCK_SMASH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "HP_UP",
    romOffset: [
      97,
      0x5CCB,
    ],
  },
  TIN_TOWER_3F_ITEM_BALL: {
    id: "TIN_TOWER_3F_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "FULL_HEAL",
    romOffset: [
      97,
      0x5A37,
    ],
  },
  TIN_TOWER_4F_SE_ITEM_BALL: {
    id: "TIN_TOWER_4F_SE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PP_UP",
    romOffset: [
      97,
      0x5A5A,
    ],
  },
  TIN_TOWER_4F_SW_ITEM_BALL: {
    id: "TIN_TOWER_4F_SW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ESCAPE_ROPE",
    romOffset: [
      97,
      0x5A5C,
    ],
  },
  TIN_TOWER_4F_CENTRAL_ITEM_BALL: {
    id: "TIN_TOWER_4F_CENTRAL_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      97,
      0x5A58,
    ],
  },
  TIN_TOWER_5F_NORTH_AREA_ITEM_BALL: {
    id: "TIN_TOWER_5F_NORTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "RARE_CANDY",
    romOffset: [
      97,
      0x5AA9,
    ],
  },
  TIN_TOWER_6F_ITEM_BALL: {
    id: "TIN_TOWER_6F_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_POTION",
    romOffset: [
      97,
      0x5AE4,
    ],
  },
  TIN_TOWER_7F_OUTER_AREA_ITEM_BALL: {
    id: "TIN_TOWER_7F_OUTER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_REVIVE",
    romOffset: [
      97,
      0x5B05,
    ],
  },
  TIN_TOWER_8F_NORTH_AREA_ITEM_BALL: {
    id: "TIN_TOWER_8F_NORTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "FULL_RESTORE",
    romOffset: [
      97,
      0x5B39,
    ],
  },
  TIN_TOWER_8F_MIDDLE_AREA_ITEM_BALL: {
    id: "TIN_TOWER_8F_MIDDLE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_ELIXER",
    romOffset: [
      97,
      0x5B37,
    ],
  },
  TIN_TOWER_8F_SOUTH_AREA_ITEM_BALL: {
    id: "TIN_TOWER_8F_SOUTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "NUGGET",
    romOffset: [
      97,
      0x5B35,
    ],
  },
  TIN_TOWER_9F_NORTH_AREA_ITEM_BALL: {
    id: "TIN_TOWER_9F_NORTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "HP_UP",
    romOffset: [
      97,
      0x5B88,
    ],
  },
  OLIVINE_LIGHTHOUSE_3F_INNER_AREA_ITEM_BALL: {
    id: "OLIVINE_LIGHTHOUSE_3F_INNER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ETHER",
    romOffset: [
      22,
      0x7279,
    ],
  },
  OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_HOLE: {
    id: "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_HOLE",
    type: "ITEM_BALL",
    itemId: "RARE_CANDY",
    romOffset: [
      24,
      0x49AA,
    ],
  },
  OLIVINE_LIGHTHOUSE_5F_INNER_AREA_ITEM_BALL: {
    id: "OLIVINE_LIGHTHOUSE_5F_INNER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "SUPER_REPEL",
    romOffset: [
      24,
      0x49AC,
    ],
  },
  OLIVINE_LIGHTHOUSE_6F_ITEM_BALL: {
    id: "OLIVINE_LIGHTHOUSE_6F_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "SUPER_POTION",
    romOffset: [
      24,
      0x4C66,
    ],
  },
  WHIRL_ISLAND_NE_BOTTOM_LEDGE_AREA_ITEM_BALL: {
    id: "WHIRL_ISLAND_NE_BOTTOM_LEDGE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      99,
      0x4396,
    ],
  },
  WHIRL_ISLAND_SW_EAST_SIDE_ITEM_BALL: {
    id: "WHIRL_ISLAND_SW_EAST_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      99,
      0x43BC,
    ],
  },
  WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_IN_MIDDLE_OF_LEDGES: {
    id: "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_IN_MIDDLE_OF_LEDGES",
    type: "ITEM_BALL",
    itemId: "NUGGET",
    romOffset: [
      99,
      0x4416,
    ],
  },
  WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_NW_LADDER: {
    id: "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_NW_LADDER",
    type: "ITEM_BALL",
    itemId: "FULL_RESTORE",
    romOffset: [
      99,
      0x4410,
    ],
  },
  WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_LADDER_TO_B2F_ISOLATED_AREA: {
    id: "WHIRL_ISLAND_B1F_NORTH_AREA_ITEM_BALL_BY_LADDER_TO_B2F_ISOLATED_AREA",
    type: "ITEM_BALL",
    itemId: "CARBOS",
    romOffset: [
      99,
      0x4412,
    ],
  },
  WHIRL_ISLAND_B1F_SW_AREA_ITEM_BALL: {
    id: "WHIRL_ISLAND_B1F_SW_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ESCAPE_ROPE",
    romOffset: [
      99,
      0x4418,
    ],
  },
  WHIRL_ISLAND_B1F_SE_AREA_ITEM_BALL: {
    id: "WHIRL_ISLAND_B1F_SE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "CALCIUM",
    romOffset: [
      99,
      0x4414,
    ],
  },
  WHIRL_ISLAND_B2F_WATERFALL_AREA_ITEM_BALL: {
    id: "WHIRL_ISLAND_B2F_WATERFALL_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_REVIVE",
    romOffset: [
      99,
      0x44BA,
    ],
  },
  WHIRL_ISLAND_B2F_ISOLATED_AREA_EAST_ITEM_BALL: {
    id: "WHIRL_ISLAND_B2F_ISOLATED_AREA_EAST_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "FULL_RESTORE",
    romOffset: [
      99,
      0x44B8,
    ],
  },
  WHIRL_ISLAND_B2F_ISOLATED_AREA_WEST_ITEM_BALL: {
    id: "WHIRL_ISLAND_B2F_ISOLATED_AREA_WEST_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_ELIXER",
    romOffset: [
      99,
      0x44BC,
    ],
  },
  MOUNT_MORTAR_1F_OUTSIDE_EAST_LADDER_AREA_ITEM_BALL: {
    id: "MOUNT_MORTAR_1F_OUTSIDE_EAST_LADDER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "REVIVE",
    romOffset: [
      31,
      0x5DF8,
    ],
  },
  MOUNT_MORTAR_1F_OUTSIDE_WEST_LADDER_AREA_ITEM_BALL: {
    id: "MOUNT_MORTAR_1F_OUTSIDE_WEST_LADDER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ETHER",
    romOffset: [
      31,
      0x5DF6,
    ],
  },
  MOUNT_MORTAR_1F_INSIDE_STRENGTH_AREA_ITEM_BALL_1: {
    id: "MOUNT_MORTAR_1F_INSIDE_STRENGTH_AREA_ITEM_BALL_1",
    type: "ITEM_BALL",
    itemId: "HYPER_POTION",
    romOffset: [
      31,
      0x5E80,
    ],
  },
  MOUNT_MORTAR_1F_INSIDE_STRENGTH_AREA_ITEM_BALL_2: {
    id: "MOUNT_MORTAR_1F_INSIDE_STRENGTH_AREA_ITEM_BALL_2",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      31,
      0x5E88,
    ],
  },
  MOUNT_MORTAR_1F_INSIDE_STRENGTH_AREA_ITEM_BALL_3: {
    id: "MOUNT_MORTAR_1F_INSIDE_STRENGTH_AREA_ITEM_BALL_3",
    type: "ITEM_BALL",
    itemId: "NUGGET",
    romOffset: [
      31,
      0x5E84,
    ],
  },
  MOUNT_MORTAR_1F_INSIDE_STRENGTH_AREA_ITEM_BALL_4: {
    id: "MOUNT_MORTAR_1F_INSIDE_STRENGTH_AREA_ITEM_BALL_4",
    type: "ITEM_BALL",
    itemId: "ESCAPE_ROPE",
    romOffset: [
      31,
      0x5E7C,
    ],
  },
  MOUNT_MORTAR_1F_INSIDE_NORTH_AREA_ITEM_BALL_ON_PLATEAU: {
    id: "MOUNT_MORTAR_1F_INSIDE_NORTH_AREA_ITEM_BALL_ON_PLATEAU",
    type: "ITEM_BALL",
    itemId: "IRON",
    romOffset: [
      31,
      0x5E86,
    ],
  },
  MOUNT_MORTAR_1F_INSIDE_NORTH_AREA_ITEM_BALL_SOUTH_OF_PLATEAU: {
    id: "MOUNT_MORTAR_1F_INSIDE_NORTH_AREA_ITEM_BALL_SOUTH_OF_PLATEAU",
    type: "ITEM_BALL",
    itemId: "MAX_POTION",
    romOffset: [
      31,
      0x5E82,
    ],
  },
  MOUNT_MORTAR_1F_INSIDE_NORTH_AREA_ITEM_BALL_NORTH_OF_PLATEAU: {
    id: "MOUNT_MORTAR_1F_INSIDE_NORTH_AREA_ITEM_BALL_NORTH_OF_PLATEAU",
    type: "ITEM_BALL",
    itemId: "MAX_REVIVE",
    romOffset: [
      31,
      0x5E7E,
    ],
  },
  MOUNT_MORTAR_2F_INSIDE_NW_SURF_AREA_ITEM_BALL: {
    id: "MOUNT_MORTAR_2F_INSIDE_NW_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ELIXER",
    romOffset: [
      31,
      0x60E6,
    ],
  },
  MOUNT_MORTAR_2F_INSIDE_SE_SURF_AREA_ITEM_BALL: {
    id: "MOUNT_MORTAR_2F_INSIDE_SE_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_POTION",
    romOffset: [
      31,
      0x60DE,
    ],
  },
  MOUNT_MORTAR_2F_INSIDE_SW_SURF_AREA_ITEM_BALL: {
    id: "MOUNT_MORTAR_2F_INSIDE_SW_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "RARE_CANDY",
    romOffset: [
      31,
      0x60E0,
    ],
  },
  MOUNT_MORTAR_2F_INSIDE_NORTH_AREA_ITEM_BALL_ON_EAST_PLATEAU: {
    id: "MOUNT_MORTAR_2F_INSIDE_NORTH_AREA_ITEM_BALL_ON_EAST_PLATEAU",
    type: "ITEM_BALL",
    itemId: "ESCAPE_ROPE",
    romOffset: [
      31,
      0x60E8,
    ],
  },
  MOUNT_MORTAR_2F_INSIDE_NORTH_AREA_ITEM_BALL_ON_WEST_PLATEAU: {
    id: "MOUNT_MORTAR_2F_INSIDE_NORTH_AREA_ITEM_BALL_ON_WEST_PLATEAU",
    type: "ITEM_BALL",
    itemId: "DRAGON_SCALE",
    romOffset: [
      31,
      0x60E4,
    ],
  },
  MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_1: {
    id: "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_1",
    type: "ITEM_BALL",
    itemId: "FULL_RESTORE",
    romOffset: [
      31,
      0x6244,
    ],
  },
  MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_2: {
    id: "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_2",
    type: "ITEM_BALL",
    itemId: "HYPER_POTION",
    romOffset: [
      31,
      0x6240,
    ],
  },
  MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_3: {
    id: "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_3",
    type: "ITEM_BALL",
    itemId: "MAX_ETHER",
    romOffset: [
      31,
      0x6246,
    ],
  },
  MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_4: {
    id: "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_4",
    type: "ITEM_BALL",
    itemId: "PP_UP",
    romOffset: [
      31,
      0x6248,
    ],
  },
  MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_5: {
    id: "MOUNT_MORTAR_B1F_SURF_AREA_ITEM_BALL_5",
    type: "ITEM_BALL",
    itemId: "CARBOS",
    romOffset: [
      31,
      0x6242,
    ],
  },
  LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_SOUTH_OF_HOUSE: {
    id: "LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_SOUTH_OF_HOUSE",
    type: "ITEM_BALL",
    itemId: "ELIXER",
    romOffset: [
      28,
      0x4148,
    ],
  },
  GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_NW_ITEM_BALL: {
    id: "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_NW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "BURN_HEAL",
    romOffset: [
      31,
      0x57C7,
    ],
  },
  GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_SW_ITEM_BALL: {
    id: "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_SW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ETHER",
    romOffset: [
      31,
      0x57C3,
    ],
  },
  GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_SE_ITEM_BALL: {
    id: "GOLDENROD_DEPT_STORE_B1F_ELEVATOR_AREA_SE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      31,
      0x57C9,
    ],
  },
  GOLDENROD_DEPT_STORE_B1F_STAIRS_AREA_ITEM_BALL: {
    id: "GOLDENROD_DEPT_STORE_B1F_STAIRS_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "AMULET_COIN",
    romOffset: [
      31,
      0x57C5,
    ],
  },
  GOLDENROD_UNDERGROUND_SWITCH_ROOM_ENTRANCES_TOP_RIGHT_ITEM_BALL: {
    id: "GOLDENROD_UNDERGROUND_SWITCH_ROOM_ENTRANCES_TOP_RIGHT_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "FULL_HEAL",
    romOffset: [
      31,
      0x4E7F,
    ],
  },
  GOLDENROD_UNDERGROUND_SWITCH_ROOM_ENTRANCES_BOTTOM_LEFT_ITEM_BALL: {
    id: "GOLDENROD_UNDERGROUND_SWITCH_ROOM_ENTRANCES_BOTTOM_LEFT_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "SMOKE_BALL",
    romOffset: [
      31,
      0x4E7D,
    ],
  },
  GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_1: {
    id: "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_1",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      31,
      0x59E8,
    ],
  },
  GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_2: {
    id: "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_2",
    type: "ITEM_BALL",
    itemId: "MAX_ETHER",
    romOffset: [
      31,
      0x59E4,
    ],
  },
  RADIO_TOWER_5F_ITEM_BALL: {
    id: "RADIO_TOWER_5F_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      24,
      0x40FE,
    ],
  },
  TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_MIDDLE_STATUE: {
    id: "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_MIDDLE_STATUE",
    type: "ITEM_BALL",
    itemId: "HYPER_POTION",
    romOffset: [
      27,
      0x4AC4,
    ],
  },
  TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_COMPUTER: {
    id: "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BY_COMPUTER",
    type: "ITEM_BALL",
    itemId: "GUARD_SPEC",
    romOffset: [
      27,
      0x4AC8,
    ],
  },
  TEAM_ROCKET_BASE_B1F_ITEM_BALL_BETWEEN_SOUTH_STATUES: {
    id: "TEAM_ROCKET_BASE_B1F_ITEM_BALL_BETWEEN_SOUTH_STATUES",
    type: "ITEM_BALL",
    itemId: "NUGGET",
    romOffset: [
      27,
      0x4AC6,
    ],
  },
  TEAM_ROCKET_BASE_B3F_SE_AREA_LEFT_ITEM_BALL_BY_PLANTS: {
    id: "TEAM_ROCKET_BASE_B3F_SE_AREA_LEFT_ITEM_BALL_BY_PLANTS",
    type: "ITEM_BALL",
    itemId: "PROTEIN",
    romOffset: [
      27,
      0x6120,
    ],
  },
  TEAM_ROCKET_BASE_B3F_SE_AREA_RIGHT_ITEM_BALL_BY_PLANTS: {
    id: "TEAM_ROCKET_BASE_B3F_SE_AREA_RIGHT_ITEM_BALL_BY_PLANTS",
    type: "ITEM_BALL",
    itemId: "X_SPECIAL",
    romOffset: [
      27,
      0x6122,
    ],
  },
  TEAM_ROCKET_BASE_B3F_SE_AREA_NORTH_ITEM_BALL: {
    id: "TEAM_ROCKET_BASE_B3F_SE_AREA_NORTH_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ICE_HEAL",
    romOffset: [
      27,
      0x6126,
    ],
  },
  TEAM_ROCKET_BASE_B3F_SE_AREA_ITEM_BALL_BETWEEN_STAIRS: {
    id: "TEAM_ROCKET_BASE_B3F_SE_AREA_ITEM_BALL_BETWEEN_STAIRS",
    type: "ITEM_BALL",
    itemId: "FULL_HEAL",
    romOffset: [
      27,
      0x6124,
    ],
  },
  TEAM_ROCKET_BASE_B3F_NW_AREA_ITEM_BALL: {
    id: "TEAM_ROCKET_BASE_B3F_NW_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      27,
      0x6128,
    ],
  },
  ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_ON_PLATEAU: {
    id: "ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_ON_PLATEAU",
    type: "ITEM_BALL",
    itemId: "PROTEIN",
    romOffset: [
      31,
      0x6476,
    ],
  },
  ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_BY_ICE: {
    id: "ICE_PATH_1F_BLACKTHORN_SIDE_ITEM_BALL_BY_ICE",
    type: "ITEM_BALL",
    itemId: "PP_UP",
    romOffset: [
      31,
      0x6474,
    ],
  },
  ICE_PATH_B1F_BLACKTHORN_SIDE_ITEM_BALL: {
    id: "ICE_PATH_B1F_BLACKTHORN_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "IRON",
    romOffset: [
      31,
      0x650D,
    ],
  },
  ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_ITEM_BALL: {
    id: "ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_POTION",
    romOffset: [
      31,
      0x65A8,
    ],
  },
  ICE_PATH_B2F_MAHOGANY_SIDE_CENTRAL_AREA_ITEM_BALL: {
    id: "ICE_PATH_B2F_MAHOGANY_SIDE_CENTRAL_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "FULL_HEAL",
    romOffset: [
      31,
      0x65A6,
    ],
  },
  ICE_PATH_B3F_ITEM_BALL: {
    id: "ICE_PATH_B3F_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "NEVERMELTICE",
    romOffset: [
      31,
      0x666F,
    ],
  },
  DRAGONS_DEN_B1F_NORTH_AREA_ITEM_BALL: {
    id: "DRAGONS_DEN_B1F_NORTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "CALCIUM",
    romOffset: [
      99,
      0x49A1,
    ],
  },
  DRAGONS_DEN_B1F_NORTH_SURF_AREA_ITEM_BALL: {
    id: "DRAGONS_DEN_B1F_NORTH_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_ELIXER",
    romOffset: [
      99,
      0x49A3,
    ],
  },
  DRAGONS_DEN_B1F_SOUTH_SURF_AREA_ITEM_BALL: {
    id: "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "DRAGON_FANG",
    romOffset: [
      99,
      0x495A,
    ],
  },
  TOHJO_FALLS_WEST_SIDE_ITEM_BALL: {
    id: "TOHJO_FALLS_WEST_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MOON_STONE",
    romOffset: [
      99,
      0x5B02,
    ],
  },
  VICTORY_ROAD_1F_RIGHT_ITEM_BALL: {
    id: "VICTORY_ROAD_1F_RIGHT_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "FULL_HEAL",
    romOffset: [
      29,
      0x452F,
    ],
  },
  VICTORY_ROAD_1F_LEFT_ITEM_BALL: {
    id: "VICTORY_ROAD_1F_LEFT_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_REVIVE",
    romOffset: [
      29,
      0x452B,
    ],
  },
  VICTORY_ROAD_2F_NE_AREA_ITEM_BALL: {
    id: "VICTORY_ROAD_2F_NE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "FULL_RESTORE",
    romOffset: [
      29,
      0x452D,
    ],
  },
  VICTORY_ROAD_2F_SOUTH_AREA_ITEM_BALL: {
    id: "VICTORY_ROAD_2F_SOUTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "HP_UP",
    romOffset: [
      29,
      0x4531,
    ],
  },
  FIGHTING_DOJO_ITEM_BALL: {
    id: "FIGHTING_DOJO_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "BLACKBELT",
    romOffset: [
      98,
      0x5B61,
    ],
  },
  ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_WEST_OF_PLATEAU: {
    id: "ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_WEST_OF_PLATEAU",
    type: "ITEM_BALL",
    itemId: "ELIXER",
    romOffset: [
      29,
      0x43B5,
    ],
  },
  ROCK_TUNNEL_B1F_NW_AREA_NORTH_ITEM_BALL: {
    id: "ROCK_TUNNEL_B1F_NW_AREA_NORTH_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "REVIVE",
    romOffset: [
      29,
      0x440D,
    ],
  },
  ROCK_TUNNEL_B1F_NW_AREA_SOUTH_ITEM_BALL: {
    id: "ROCK_TUNNEL_B1F_NW_AREA_SOUTH_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PP_UP",
    romOffset: [
      29,
      0x440B,
    ],
  },
  ROCK_TUNNEL_B1F_SE_AREA_ITEM_BALL: {
    id: "ROCK_TUNNEL_B1F_SE_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "IRON",
    romOffset: [
      29,
      0x4409,
    ],
  },
  SILVER_CAVE_ROOM_1_NORTH_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_1_NORTH_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_ELIXER",
    romOffset: [
      99,
      0x4554,
    ],
  },
  SILVER_CAVE_ROOM_1_CENTRAL_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_1_CENTRAL_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      99,
      0x455A,
    ],
  },
  SILVER_CAVE_ROOM_1_SE_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_1_SE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PROTEIN",
    romOffset: [
      99,
      0x4556,
    ],
  },
  SILVER_CAVE_ROOM_1_SW_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_1_SW_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ESCAPE_ROPE",
    romOffset: [
      99,
      0x4558,
    ],
  },
  SILVER_CAVE_ROOM_2_NE_WATERFALL_AREA_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_2_NE_WATERFALL_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "PP_UP",
    romOffset: [
      99,
      0x45B6,
    ],
  },
  SILVER_CAVE_ROOM_2_SW_WATERFALL_AREA_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_2_SW_WATERFALL_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "ULTRA_BALL",
    romOffset: [
      99,
      0x45B4,
    ],
  },
  SILVER_CAVE_ROOM_2_MAIN_AREA_ITEM_BALL: {
    id: "SILVER_CAVE_ROOM_2_MAIN_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "CALCIUM",
    romOffset: [
      99,
      0x45B2,
    ],
  },
  SILVER_CAVE_ITEM_ROOMS_EAST_ITEM_BALL: {
    id: "SILVER_CAVE_ITEM_ROOMS_EAST_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "FULL_RESTORE",
    romOffset: [
      99,
      0x4660,
    ],
  },
  SILVER_CAVE_ITEM_ROOMS_WEST_ITEM_BALL: {
    id: "SILVER_CAVE_ITEM_ROOMS_WEST_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "MAX_REVIVE",
    romOffset: [
      99,
      0x465E,
    ],
  },
}

export const tmItemBallLocationsMap: IdMap<TMItemBallLocationId, ItemLocation> = {
  ROUTE_27_WHIRLPOOL_AREA_ITEM_BALL: {
    id: "ROUTE_27_WHIRLPOOL_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM22",
    romOffset: [
      104,
      0x4A62,
    ],
  },
  ROUTE_35_MAIN_AREA_ITEM_BALL: {
    id: "ROUTE_35_MAIN_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM04",
    romOffset: [
      103,
      0x4A7C,
    ],
  },
  DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_BY_LEDGE: {
    id: "DARK_CAVE_BLACKTHORN_ENTRANCE_SURF_AREA_ITEM_BALL_BY_LEDGE",
    type: "ITEM_BALL",
    itemId: "TM13",
    romOffset: [
      99,
      0x473D,
    ],
  },
  UNION_CAVE_B1F_UNION_SIDE_WEST_ITEM_BALL: {
    id: "UNION_CAVE_B1F_UNION_SIDE_WEST_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM39",
    romOffset: [
      22,
      0x6016,
    ],
  },
  SLOWPOKE_WELL_B2F_SURF_AREA_ITEM_BALL: {
    id: "SLOWPOKE_WELL_B2F_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM18",
    romOffset: [
      22,
      0x6D28,
    ],
  },
  NATIONAL_PARK_WEST_ITEM_BALL: {
    id: "NATIONAL_PARK_WEST_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM28",
    romOffset: [
      23,
      0x41CE,
    ],
  },
  NATIONAL_PARK_BUG_CONTEST_WEST_ITEM_BALL: {
    id: "NATIONAL_PARK_BUG_CONTEST_WEST_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM28",
    romOffset: [
      23,
      0x4947,
    ],
  },
  BURNED_TOWER_B1F_STRENGTH_AREA_ITEM_BALL: {
    id: "BURNED_TOWER_B1F_STRENGTH_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM20",
    romOffset: [
      97,
      0x6231,
    ],
  },
  OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_STAIRS: {
    id: "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_ITEM_BALL_BY_STAIRS",
    type: "ITEM_BALL",
    itemId: "TM34",
    romOffset: [
      24,
      0x49AE,
    ],
  },
  MOUNT_MORTAR_2F_INSIDE_CENTRAL_SURF_AREA_ITEM_BALL: {
    id: "MOUNT_MORTAR_2F_INSIDE_CENTRAL_SURF_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM40",
    romOffset: [
      31,
      0x60E2,
    ],
  },
  LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_EAST_OF_HOUSE: {
    id: "LAKE_OF_RAGE_CUT_AREA_ITEM_BALL_EAST_OF_HOUSE",
    type: "ITEM_BALL",
    itemId: "TM43",
    romOffset: [
      28,
      0x414A,
    ],
  },
  GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_3: {
    id: "GOLDENROD_UNDERGROUND_WAREHOUSE_ITEM_BALL_3",
    type: "ITEM_BALL",
    itemId: "TM35",
    romOffset: [
      31,
      0x59E6,
    ],
  },
  TEAM_ROCKET_BASE_B2F_WEST_AREA_ITEM_BALL: {
    id: "TEAM_ROCKET_BASE_B2F_WEST_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM46",
    romOffset: [
      27,
      0x520D,
    ],
  },
  ICE_PATH_B2F_BLACKTHORN_SIDE_ITEM_BALL: {
    id: "ICE_PATH_B2F_BLACKTHORN_SIDE_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM44",
    romOffset: [
      31,
      0x6646,
    ],
  },
  VICTORY_ROAD_2F_NW_AREA_ITEM_BALL: {
    id: "VICTORY_ROAD_2F_NW_AREA_ITEM_BALL",
    type: "ITEM_BALL",
    itemId: "TM26",
    romOffset: [
      29,
      0x4529,
    ],
  },
  ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_ON_PLATEAU: {
    id: "ROCK_TUNNEL_1F_LAVENDER_SIDE_ITEM_BALL_ON_PLATEAU",
    type: "ITEM_BALL",
    itemId: "TM47",
    romOffset: [
      29,
      0x43B7,
    ],
  },
}

export const hiddenItemLocationsMap: IdMap<HiddenItemLocationId, ItemLocation> = {
  ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_VIRIDIAN_ENTRANCE: {
    id: "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_VIRIDIAN_ENTRANCE",
    type: "HIDDEN_ITEM",
    itemId: "FULL_RESTORE",
    romOffset: [
      107,
      0x4310,
    ],
  },
  ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_SE_CORNER: {
    id: "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_SE_CORNER",
    type: "HIDDEN_ITEM",
    itemId: "REVIVE",
    romOffset: [
      107,
      0x4313,
    ],
  },
  ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_CENTER: {
    id: "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_IN_CENTER",
    type: "HIDDEN_ITEM",
    itemId: "MAX_ETHER",
    romOffset: [
      107,
      0x430A,
    ],
  },
  ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_PEWTER_ENTRANCE: {
    id: "ROUTE_2_FOREST_AREA_HIDDEN_ITEM_BY_PEWTER_ENTRANCE",
    type: "HIDDEN_ITEM",
    itemId: "FULL_HEAL",
    romOffset: [
      107,
      0x430D,
    ],
  },
  ROUTE_4_MOUNT_MOON_SIDE_HIDDEN_ITEM: {
    id: "ROUTE_4_MOUNT_MOON_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "ULTRA_BALL",
    romOffset: [
      107,
      0x6213,
    ],
  },
  ROUTE_9_HIDDEN_ITEM: {
    id: "ROUTE_9_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "ETHER",
    romOffset: [
      106,
      0x6FA4,
    ],
  },
  ROUTE_11_HIDDEN_ITEM: {
    id: "ROUTE_11_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "REVIVE",
    romOffset: [
      25,
      0x4059,
    ],
  },
  ROUTE_12_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_12_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "ELIXER",
    romOffset: [
      105,
      0x7011,
    ],
  },
  ROUTE_13_HIDDEN_ITEM: {
    id: "ROUTE_13_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "CALCIUM",
    romOffset: [
      104,
      0x64A1,
    ],
  },
  ROUTE_17_HIDDEN_ITEM_IN_WATER: {
    id: "ROUTE_17_HIDDEN_ITEM_IN_WATER",
    type: "HIDDEN_ITEM",
    itemId: "MAX_ETHER",
    romOffset: [
      107,
      0x5104,
    ],
  },
  ROUTE_17_HIDDEN_ITEM_ON_FENCE: {
    id: "ROUTE_17_HIDDEN_ITEM_ON_FENCE",
    type: "HIDDEN_ITEM",
    itemId: "MAX_ELIXER",
    romOffset: [
      107,
      0x5107,
    ],
  },
  ROUTE_25_HIDDEN_ITEM: {
    id: "ROUTE_25_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "POTION",
    romOffset: [
      103,
      0x6FE7,
    ],
  },
  ROUTE_28_CUT_AREA_HIDDEN_ITEM: {
    id: "ROUTE_28_CUT_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "RARE_CANDY",
    romOffset: [
      105,
      0x5412,
    ],
  },
  ROUTE_30_CHERRYGROVE_SIDE_HIDDEN_ITEM: {
    id: "ROUTE_30_CHERRYGROVE_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "POTION",
    romOffset: [
      104,
      0x57FD,
    ],
  },
  ROUTE_32_HIDDEN_ITEM_NORTH_OF_PIER: {
    id: "ROUTE_32_HIDDEN_ITEM_NORTH_OF_PIER",
    type: "HIDDEN_ITEM",
    itemId: "SUPER_POTION",
    romOffset: [
      100,
      0x4788,
    ],
  },
  ROUTE_32_HIDDEN_ITEM_BEHIND_POKECENTER: {
    id: "ROUTE_32_HIDDEN_ITEM_BEHIND_POKECENTER",
    type: "HIDDEN_ITEM",
    itemId: "GREAT_BALL",
    romOffset: [
      100,
      0x4785,
    ],
  },
  ROUTE_34_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_34_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "RARE_CANDY",
    romOffset: [
      30,
      0x432F,
    ],
  },
  ROUTE_34_DAY_CARE_AREA_HIDDEN_ITEM: {
    id: "ROUTE_34_DAY_CARE_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "SUPER_POTION",
    romOffset: [
      30,
      0x4332,
    ],
  },
  ROUTE_37_HIDDEN_ITEM: {
    id: "ROUTE_37_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "ETHER",
    romOffset: [
      106,
      0x4E11,
    ],
  },
  ROUTE_39_HIDDEN_ITEM: {
    id: "ROUTE_39_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "NUGGET",
    romOffset: [
      105,
      0x5BF8,
    ],
  },
  ROUTE_40_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK: {
    id: "ROUTE_40_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK",
    type: "HIDDEN_ITEM",
    itemId: "HYPER_POTION",
    romOffset: [
      106,
      0x621B,
    ],
  },
  ROUTE_41_SW_WHIRLPOOL_AREA_HIDDEN_ITEM: {
    id: "ROUTE_41_SW_WHIRLPOOL_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_ETHER",
    romOffset: [
      105,
      0x690E,
    ],
  },
  ROUTE_42_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_42_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_POTION",
    romOffset: [
      106,
      0x5355,
    ],
  },
  ROUTE_44_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_44_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "ELIXER",
    romOffset: [
      103,
      0x5A4A,
    ],
  },
  ROUTE_45_SURF_AREA_HIDDEN_ITEM: {
    id: "ROUTE_45_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "PP_UP",
    romOffset: [
      103,
      0x62A0,
    ],
  },
  DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_HIDDEN_ITEM: {
    id: "DARK_CAVE_VIOLET_ENTRANCE_ROCK_SMASH_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "ELIXER",
    romOffset: [
      99,
      0x469B,
    ],
  },
  VIOLET_CITY_CUT_AREA_HIDDEN_ITEM: {
    id: "VIOLET_CITY_CUT_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "HYPER_POTION",
    romOffset: [
      106,
      0x4429,
    ],
  },
  AZALEA_TOWN_HIDDEN_ITEM: {
    id: "AZALEA_TOWN_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_HEAL",
    romOffset: [
      102,
      0x4133,
    ],
  },
  ILEX_FOREST_ROUTE_34_SIDE_HIDDEN_ITEM_BY_SIGN: {
    id: "ILEX_FOREST_ROUTE_34_SIDE_HIDDEN_ITEM_BY_SIGN",
    type: "HIDDEN_ITEM",
    itemId: "FULL_HEAL",
    romOffset: [
      27,
      0x6E20,
    ],
  },
  ILEX_FOREST_ROUTE_34_SIDE_HIDDEN_ITEM_BY_HEADBUTT_GUY: {
    id: "ILEX_FOREST_ROUTE_34_SIDE_HIDDEN_ITEM_BY_HEADBUTT_GUY",
    type: "HIDDEN_ITEM",
    itemId: "SUPER_POTION",
    romOffset: [
      27,
      0x6E1D,
    ],
  },
  ILEX_FOREST_ROUTE_34_SIDE_HIDDEN_ITEM_BY_EXIT: {
    id: "ILEX_FOREST_ROUTE_34_SIDE_HIDDEN_ITEM_BY_EXIT",
    type: "HIDDEN_ITEM",
    itemId: "ETHER",
    romOffset: [
      27,
      0x6E1A,
    ],
  },
  GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_BARGAIN_SHOP: {
    id: "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_BARGAIN_SHOP",
    type: "HIDDEN_ITEM",
    itemId: "PARLYZ_HEAL",
    romOffset: [
      31,
      0x430D,
    ],
  },
  GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_HERB_SHOP: {
    id: "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_HERB_SHOP",
    type: "HIDDEN_ITEM",
    itemId: "SUPER_POTION",
    romOffset: [
      31,
      0x4310,
    ],
  },
  GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_DOOR: {
    id: "GOLDENROD_UNDERGROUND_HIDDEN_ITEM_BY_DOOR",
    type: "HIDDEN_ITEM",
    itemId: "ANTIDOTE",
    romOffset: [
      31,
      0x4313,
    ],
  },
  GOLDENROD_UNDERGROUND_SWITCH_ROOM_ENTRANCES_TOP_LEFT_HIDDEN_ITEM: {
    id: "GOLDENROD_UNDERGROUND_SWITCH_ROOM_ENTRANCES_TOP_LEFT_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "REVIVE",
    romOffset: [
      31,
      0x4E86,
    ],
  },
  GOLDENROD_UNDERGROUND_SWITCH_ROOM_ENTRANCES_TOP_MIDDLE_HIDDEN_ITEM: {
    id: "GOLDENROD_UNDERGROUND_SWITCH_ROOM_ENTRANCES_TOP_MIDDLE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_POTION",
    romOffset: [
      31,
      0x4E83,
    ],
  },
  NATIONAL_PARK_HIDDEN_ITEM: {
    id: "NATIONAL_PARK_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_HEAL",
    romOffset: [
      23,
      0x41D2,
    ],
  },
  NATIONAL_PARK_BUG_CONTEST_HIDDEN_ITEM: {
    id: "NATIONAL_PARK_BUG_CONTEST_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_HEAL",
    romOffset: [
      23,
      0x494B,
    ],
  },
  ECRUTEAK_CITY_HIDDEN_ITEM: {
    id: "ECRUTEAK_CITY_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "HYPER_POTION",
    romOffset: [
      105,
      0x4057,
    ],
  },
  BURNED_TOWER_1F_HIDDEN_ITEM_BY_ENTRANCE: {
    id: "BURNED_TOWER_1F_HIDDEN_ITEM_BY_ENTRANCE",
    type: "HIDDEN_ITEM",
    itemId: "ULTRA_BALL",
    romOffset: [
      97,
      0x5CCA,
    ],
  },
  BURNED_TOWER_1F_HIDDEN_ITEM_BY_HOLE: {
    id: "BURNED_TOWER_1F_HIDDEN_ITEM_BY_HOLE",
    type: "HIDDEN_ITEM",
    itemId: "ETHER",
    romOffset: [
      97,
      0x5CC7,
    ],
  },
  TIN_TOWER_4F_HIDDEN_ITEM: {
    id: "TIN_TOWER_4F_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_POTION",
    romOffset: [
      97,
      0x5A60,
    ],
  },
  TIN_TOWER_5F_SE_AREA_HIDDEN_ITEM: {
    id: "TIN_TOWER_5F_SE_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_RESTORE",
    romOffset: [
      97,
      0x5AAD,
    ],
  },
  TIN_TOWER_5F_SW_AREA_HIDDEN_ITEM: {
    id: "TIN_TOWER_5F_SW_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "CARBOS",
    romOffset: [
      97,
      0x5AB0,
    ],
  },
  OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_HIDDEN_ITEM: {
    id: "OLIVINE_LIGHTHOUSE_5F_OUTER_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "HYPER_POTION",
    romOffset: [
      24,
      0x49B2,
    ],
  },
  WHIRL_ISLAND_B1F_NORTH_AREA_EAST_HIDDEN_ITEM: {
    id: "WHIRL_ISLAND_B1F_NORTH_AREA_EAST_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "RARE_CANDY",
    romOffset: [
      99,
      0x441F,
    ],
  },
  WHIRL_ISLAND_B1F_NORTH_AREA_WEST_HIDDEN_ITEM: {
    id: "WHIRL_ISLAND_B1F_NORTH_AREA_WEST_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_RESTORE",
    romOffset: [
      99,
      0x4425,
    ],
  },
  WHIRL_ISLAND_B1F_SE_AREA_HIDDEN_ITEM: {
    id: "WHIRL_ISLAND_B1F_SE_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "ULTRA_BALL",
    romOffset: [
      99,
      0x4422,
    ],
  },
  CIANWOOD_CITY_HIDDEN_ITEM_UNDER_NORTH_ROCK_SMASH_ROCK: {
    id: "CIANWOOD_CITY_HIDDEN_ITEM_UNDER_NORTH_ROCK_SMASH_ROCK",
    type: "HIDDEN_ITEM",
    itemId: "REVIVE",
    romOffset: [
      104,
      0x40D6,
    ],
  },
  CIANWOOD_CITY_HIDDEN_ITEM_UNDER_SOUTH_ROCK_SMASH_ROCK: {
    id: "CIANWOOD_CITY_HIDDEN_ITEM_UNDER_SOUTH_ROCK_SMASH_ROCK",
    type: "HIDDEN_ITEM",
    itemId: "MAX_ETHER",
    romOffset: [
      104,
      0x40D9,
    ],
  },
  MOUNT_MORTAR_1F_OUTSIDE_MAHOGANY_SIDE_HIDDEN_ITEM: {
    id: "MOUNT_MORTAR_1F_OUTSIDE_MAHOGANY_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "HYPER_POTION",
    romOffset: [
      31,
      0x5DFC,
    ],
  },
  MOUNT_MORTAR_1F_INSIDE_NORTH_AREA_HIDDEN_ITEM: {
    id: "MOUNT_MORTAR_1F_INSIDE_NORTH_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_REPEL",
    romOffset: [
      31,
      0x5E8C,
    ],
  },
  MOUNT_MORTAR_2F_INSIDE_NORTH_AREA_HIDDEN_ITEM: {
    id: "MOUNT_MORTAR_2F_INSIDE_NORTH_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_RESTORE",
    romOffset: [
      31,
      0x60EC,
    ],
  },
  MOUNT_MORTAR_B1F_NW_AREA_HIDDEN_ITEM: {
    id: "MOUNT_MORTAR_B1F_NW_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_REVIVE",
    romOffset: [
      31,
      0x624C,
    ],
  },
  LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_LEDGES: {
    id: "LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_LEDGES",
    type: "HIDDEN_ITEM",
    itemId: "FULL_RESTORE",
    romOffset: [
      28,
      0x414E,
    ],
  },
  LAKE_OF_RAGE_CUT_AREA_HIDDEN_ITEM: {
    id: "LAKE_OF_RAGE_CUT_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "RARE_CANDY",
    romOffset: [
      28,
      0x4151,
    ],
  },
  LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_WATER: {
    id: "LAKE_OF_RAGE_MAIN_AREA_HIDDEN_ITEM_BY_WATER",
    type: "HIDDEN_ITEM",
    itemId: "MAX_POTION",
    romOffset: [
      28,
      0x4154,
    ],
  },
  ROCKET_BASE_B1F_HIDDEN_ITEM: {
    id: "ROCKET_BASE_B1F_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "REVIVE",
    romOffset: [
      27,
      0x4ACC,
    ],
  },
  ROCKET_BASE_B2F_NORTH_AREA_HIDDEN_ITEM: {
    id: "ROCKET_BASE_B2F_NORTH_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_HEAL",
    romOffset: [
      27,
      0x5211,
    ],
  },
  ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_HIDDEN_ITEM: {
    id: "ICE_PATH_B2F_MAHOGANY_SIDE_OUTER_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "CARBOS",
    romOffset: [
      31,
      0x65AC,
    ],
  },
  ICE_PATH_B2F_BLACKTHORN_SIDE_HIDDEN_ITEM: {
    id: "ICE_PATH_B2F_BLACKTHORN_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "ICE_HEAL",
    romOffset: [
      31,
      0x664A,
    ],
  },
  ICE_PATH_B1F_BLACKTHORN_SIDE_HIDDEN_ITEM: {
    id: "ICE_PATH_B1F_BLACKTHORN_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_POTION",
    romOffset: [
      31,
      0x6511,
    ],
  },
  DRAGONS_DEN_NORTH_SURF_AREA_HIDDEN_ITEM: {
    id: "DRAGONS_DEN_NORTH_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_POTION",
    romOffset: [
      99,
      0x49AA,
    ],
  },
  DRAGONS_DEN_B1F_SOUTH_SURF_AREA_SE_HIDDEN_ITEM: {
    id: "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_SE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "ELIXER",
    romOffset: [
      99,
      0x49AD,
    ],
  },
  DRAGONS_DEN_B1F_SOUTH_SURF_AREA_NE_HIDDEN_ITEM: {
    id: "DRAGONS_DEN_B1F_SOUTH_SURF_AREA_NE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "REVIVE",
    romOffset: [
      99,
      0x49A7,
    ],
  },
  OLIVINE_PORT_SURF_AREA_HIDDEN_ITEM: {
    id: "OLIVINE_PORT_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "PROTEIN",
    romOffset: [
      29,
      0x4A2F,
    ],
  },
  VERMILION_PORT_SURF_AREA_HIDDEN_ITEM: {
    id: "VERMILION_PORT_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "IRON",
    romOffset: [
      29,
      0x4EF0,
    ],
  },
  VERMILION_CITY_HIDDEN_ITEM: {
    id: "VERMILION_CITY_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_HEAL",
    romOffset: [
      106,
      0x6A14,
    ],
  },
  DIGLETTS_CAVE_HIDDEN_ITEM: {
    id: "DIGLETTS_CAVE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_REVIVE",
    romOffset: [
      29,
      0x4007,
    ],
  },
  UNDERGROUND_PATH_NORTH_HIDDEN_ITEM: {
    id: "UNDERGROUND_PATH_NORTH_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_RESTORE",
    romOffset: [
      29,
      0x4395,
    ],
  },
  UNDERGROUND_PATH_SOUTH_HIDDEN_ITEM: {
    id: "UNDERGROUND_PATH_SOUTH_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "X_SPECIAL",
    romOffset: [
      29,
      0x4398,
    ],
  },
  CERULEAN_CITY_SURF_AREA_HIDDEN_ITEM: {
    id: "CERULEAN_CITY_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "BERSERK_GENE",
    romOffset: [
      97,
      0x40BB,
    ],
  },
  CELADON_CITY_HIDDEN_ITEM: {
    id: "CELADON_CITY_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "PP_UP",
    romOffset: [
      106,
      0x5F7C,
    ],
  },
  ROCK_TUNNEL_1F_LAVENDER_SIDE_HIDDEN_ITEM: {
    id: "ROCK_TUNNEL_1F_LAVENDER_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "X_DEFEND",
    romOffset: [
      29,
      0x43BE,
    ],
  },
  ROCK_TUNNEL_1F_CERULEAN_SIDE_HIDDEN_ITEM: {
    id: "ROCK_TUNNEL_1F_CERULEAN_SIDE_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "X_ACCURACY",
    romOffset: [
      29,
      0x43BB,
    ],
  },
  ROCK_TUNNEL_B1F_NW_AREA_HIDDEN_ITEM: {
    id: "ROCK_TUNNEL_B1F_NW_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_POTION",
    romOffset: [
      29,
      0x4411,
    ],
  },
  MOUNT_MOON_SQUARE_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK: {
    id: "MOUNT_MOON_SQUARE_HIDDEN_ITEM_UNDER_ROCK_SMASH_ROCK",
    type: "HIDDEN_ITEM",
    itemId: "MOON_STONE",
    romOffset: [
      29,
      0x711A,
    ],
  },
  CINNABAR_ISLAND_HIDDEN_ITEM: {
    id: "CINNABAR_ISLAND_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "RARE_CANDY",
    romOffset: [
      107,
      0x49CF,
    ],
  },
  VICTORY_ROAD_1F_HIDDEN_ITEM: {
    id: "VICTORY_ROAD_1F_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_HEAL",
    romOffset: [
      29,
      0x4538,
    ],
  },
  VICTORY_ROAD_2F_NW_AREA_HIDDEN_ITEM: {
    id: "VICTORY_ROAD_2F_NW_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_POTION",
    romOffset: [
      29,
      0x4535,
    ],
  },
  SILVER_CAVE_OUTSIDE_SURF_AREA_HIDDEN_ITEM: {
    id: "SILVER_CAVE_OUTSIDE_SURF_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "FULL_RESTORE",
    romOffset: [
      108,
      0x6053,
    ],
  },
  SILVER_CAVE_ROOM_1_SOUTH_HIDDEN_ITEM: {
    id: "SILVER_CAVE_ROOM_1_SOUTH_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "ULTRA_BALL",
    romOffset: [
      99,
      0x4561,
    ],
  },
  SILVER_CAVE_ROOM_1_NORTH_HIDDEN_ITEM: {
    id: "SILVER_CAVE_ROOM_1_NORTH_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "DIRE_HIT",
    romOffset: [
      99,
      0x455E,
    ],
  },
  SILVER_CAVE_ROOM_2_MAIN_AREA_HIDDEN_ITEM: {
    id: "SILVER_CAVE_ROOM_2_MAIN_AREA_HIDDEN_ITEM",
    type: "HIDDEN_ITEM",
    itemId: "MAX_POTION",
    romOffset: [
      99,
      0x45BA,
    ],
  },
}

export const itemLocationsMap = {
  ...regularItemBallLocationsMap,
  ...tmItemBallLocationsMap,
  ...hiddenItemLocationsMap,
}