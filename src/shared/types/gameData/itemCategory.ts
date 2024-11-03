import type { ItemCategoryId } from "@shared/types/gameDataIds/itemCategories"
import type { ItemId } from "@shared/types/gameDataIds/items"

export type ItemCategory<ItemCategoryIdType extends ItemCategoryId, ItemIdType extends ItemId, SlotSizeType extends number> = {
  id: ItemCategoryIdType
  name: string
  slotSize: SlotSizeType
  maxSlots: number
  itemIds: readonly ItemIdType[]
}