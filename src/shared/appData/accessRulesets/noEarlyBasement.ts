import type { AccessModifier } from "@shared/appData/accessRulesets"

export const noVanillaBasement: AccessModifier[] = [
  {
    LOCATIONS: [
      "GOLDENROD_UNDERGROUND_SWITCH_ROOM_ENTRANCE",
    ],
    MATCHING_REQUIREMENTS: [
      "GOLDENROD_UNDERGROUND_DOOR_IN",
    ],
    ADDED_REQUIREMENTS: [
      "CARD_KEY",
    ],
  },
]