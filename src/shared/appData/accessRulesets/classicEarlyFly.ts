import type { AccessModifier } from "@shared/appData/accessRulesets"

export const classicEarlyFly: AccessModifier[] = [
  {
    LOCATIONS: [
      "FAST_SHIP_1F_MAIN_AREA",
      "VERMILION_PORT_SOUTH_AREA",
      "OLIVINE_PORT_SOUTH_AREA",
    ],
    MATCHING_REQUIREMENTS: [
      "S_S_TICKET",
    ],
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
  {
    LOCATIONS: [
      "ROUTE_44",
    ],
    MATCHING_REQUIREMENTS: [
      "MAHOGANY_TOWN",
    ],
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
  {
    LOCATIONS: [
      "TOHJO_FALLS_EAST_SURF_AREA",
    ],
    MATCHING_REQUIREMENTS: [
      "TOHJO_FALLS_WEST_SURF_AREA",
    ],
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
  {
    LOCATIONS: [
      "POWER_PLANT",
    ],
    MATCHING_REQUIREMENTS: [
      "ROUTE_10_NORTH_POWER_PLANT_AREA_POWER_PLANT_DOOR_IN",
    ],
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
  {
    LOCATIONS: [
      "DIGLETTS_CAVE_VERMILION_ENTRANCE_AREA",
    ],
    MATCHING_REQUIREMENTS: [
      "VERMILION_CITY_SNORLAX_AREA_CAVE_IN",
    ],
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
  {
    LOCATIONS: [
      "VICTORY_ROAD_GATE_EAST_AREA",
    ],
    MATCHING_REQUIREMENTS: [
      "VICTORY_ROAD_GATE_NORTH_AREA",
    ],
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
]