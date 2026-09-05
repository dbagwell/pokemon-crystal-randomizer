import type { AccessModifier, AreaTransitionAccessModifier } from "@shared/appData/accessRulesets"

export const classicEarlyFly: (AccessModifier | AreaTransitionAccessModifier)[] = [
  {
    LOCATIONS: [
      "OLIVINE_PORT_NORTH_AREA_BOARDED_SHIP",
      "VERMILION_PORT_NORTH_AREA_BOARDED_SHIP",
    ],
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
  {
    TO_AREA: "ROUTE_44",
    FROM_AREA: "MAHOGANY_TOWN",
    IS_MUTUAL: false,
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
  {
    TO_AREA: "TOHJO_FALLS_EAST_SURF_AREA",
    FROM_AREA: "TOHJO_FALLS_WEST_SURF_AREA",
    IS_MUTUAL: false,
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
  {
    LOCATIONS: [
      "POWER_PLANT_TALKED_TO_MANAGER",
      "POWER_PLANT_RESTORED_POWER",
      "POWER_PLANT_MANAGERS_GIFT",
    ],
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
  {
    LOCATIONS: [
      "VERMILION_CITY_WOKE_SNORLAX",
    ],
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
  {
    TO_AREA: "VICTORY_ROAD_GATE_EAST_AREA",
    FROM_AREA: "VICTORY_ROAD_GATE_NORTH_AREA",
    IS_MUTUAL: false,
    ADDED_REQUIREMENTS: [
      "STORMBADGE",
      "HM02",
    ],
  },
]