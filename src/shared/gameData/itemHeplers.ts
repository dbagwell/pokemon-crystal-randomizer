import { itemsMap } from "@shared/gameData/items"
import type { Item } from "@shared/types/gameData/item"
import type { ItemCategoryId } from "@shared/types/gameDataIds/itemCategories"

export const itemsGroupedByCategory = Object.values(itemsMap).reduce((result: Partial<Record<ItemCategoryId, Item[]>>, item) => {
  result[item.category] = [
    ...result[item.category] ?? [],
    item,
  ]
  
  return result
}, {})