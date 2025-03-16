import type { ItemLocationGroupId } from "@shared/types/gameDataIds/itemLocationGroups"
import type { ItemLocationId } from "@shared/types/gameDataIds/itemLocations"
import type { ItemId } from "@shared/types/gameDataIds/items"

export const itemLocationTypes = [
  "ITEM_BALL",
  "HIDDEN_ITEM",
] as const

export type ItemLocationType = typeof itemLocationTypes[number]

export type ItemLocation = {
  id: ItemLocationId
  type: ItemLocationType
  groupId: ItemLocationGroupId
  itemId: ItemId
  romOffset: [number, number]
}