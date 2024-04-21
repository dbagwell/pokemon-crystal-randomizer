import type { ItemCategoryId } from "@shared/types/gameDataIds/itemCategories"
import type { ItemId } from "@shared/types/gameDataIds/items"
import type { ItemType } from "@shared/types/gameDataIds/itemTypes"

export type Item = {
  id: ItemId,
  type: ItemType,
  category: ItemCategoryId,
  numericId: number,
  name: string,
}