import type { ItemCategoryId } from "@shared/types/gameDataIds/itemCategories"
import type { ItemId } from "@shared/types/gameDataIds/items"

export type ItemCategory = {
  id: ItemCategoryId
  name: string
  slotSize: number
  maxSlots: number
  itemIds: readonly ItemId[]
}