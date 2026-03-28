import type { AccessModifier } from "@shared/appData/accessRulesets"

export const flashForDarkAreas: AccessModifier[] = [
  {
    LOCATIONS: [
      "RUINS_OF_ALPH_AERODACTYL_CHAMBER_TOP_CAVE_IN",
      "SILVER_CAVE_ROOM_1",
      "ROCK_TUNNEL_1F_CERULEAN_SIDE",
      "ROCK_TUNNEL_1F_LAVENDER_SIDE",
      "ROCK_TUNNEL_1F_INNER_AREA",
      "ROCK_TUNNEL_B1F_NW_AREA",
      "ROCK_TUNNEL_B1F_SE_AREA",
    ],
    ADDED_REQUIREMENTS: [
      "ZEPHYRBADGE",
      "HM05",
    ],
  },
  {
    LOCATIONS: [
      "DARK_CAVE_VIOLET_ENTRANCE_WEST_AREA",
    ],
    MATCHING_REQUIREMENTS: [
      "ROUTE_31_CAVE_IN",
    ],
    ADDED_REQUIREMENTS: [
      "ZEPHYRBADGE",
      "HM05",
    ],
  },
  {
    LOCATIONS: [
      "DARK_CAVE_VIOLET_ENTRANCE_NORTH_AREA",
    ],
    MATCHING_REQUIREMENTS: [
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SW_AREA_CAVE_OUT",
    ],
    ADDED_REQUIREMENTS: [
      "ZEPHYRBADGE",
      "HM05",
    ],
  },
  {
    LOCATIONS: [
      "DARK_CAVE_VIOLET_ENTRANCE_SE_AREA",
    ],
    MATCHING_REQUIREMENTS: [
      "ROUTE_46_NORTH_AREA_CAVE_IN",
    ],
    ADDED_REQUIREMENTS: [
      "ZEPHYRBADGE",
      "HM05",
    ],
  },
  {
    LOCATIONS: [
      "DARK_CAVE_BLACKTHORN_ENTRANCE_NE_AREA",
    ],
    MATCHING_REQUIREMENTS: [
      "ROUTE_45_CAVE_IN",
    ],
    ADDED_REQUIREMENTS: [
      "ZEPHYRBADGE",
      "HM05",
    ],
  },
  {
    LOCATIONS: [
      "DARK_CAVE_BLACKTHORN_ENTRANCE_SW_AREA",
    ],
    MATCHING_REQUIREMENTS: [
      "DARK_CAVE_VIOLET_ENTRANCE_NORTH_AREA_CAVE_IN",
    ],
    ADDED_REQUIREMENTS: [
      "ZEPHYRBADGE",
      "HM05",
    ],
  },
]