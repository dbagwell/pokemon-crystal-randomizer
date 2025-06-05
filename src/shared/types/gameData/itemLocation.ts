import type { AccessRequirement } from "@shared/types/gameData/warp"
import type { ItemLocationGroupId } from "@shared/types/gameDataIds/itemLocationGroups"
import type { ItemLocationId } from "@shared/types/gameDataIds/itemLocations"
import type { ItemId } from "@shared/types/gameDataIds/items"
import type { LogicalAccessAreaId } from "@shared/types/gameDataIds/logicalAccessAreaIds"

export const itemLocationTypes = [
  "ITEM_BALL",
  "HIDDEN_ITEM",
  "GIFT",
] as const

export type ItemLocationType = typeof itemLocationTypes[number]

export type ItemLocation = {
  id: ItemLocationId
  type: ItemLocationType
  groupId: ItemLocationGroupId
  itemId: ItemId
  areaId: LogicalAccessAreaId
  accessRequirements?: AccessRequirement[]
  romOffsets: [number, number][]
}