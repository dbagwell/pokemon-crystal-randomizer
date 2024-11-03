import type { ItemCategory } from "@shared/types/gameData/itemCategory"
import type { ItemCategoryId } from "@shared/types/gameDataIds/itemCategories"
import { badgeItemIds, ballItemIds, hmItemIds, type ItemId, keyItemIds, menuItemIds, regularItemIds, tmItemIds } from "@shared/types/gameDataIds/items"

export const itemCategoriesMap = {
  MENU_ITEMS: {
    id: "MENU_ITEMS",
    name: "Menu Items",
    slotSize: 1,
    maxSlots: 16,
    itemIds: menuItemIds,
  },
  BADGES: {
    id: "BADGES",
    name: "Badges",
    slotSize: 1,
    maxSlots: 16,
    itemIds: badgeItemIds,
  },
  KEY_ITEMS: {
    id: "KEY_ITEMS",
    name: "Key Items",
    slotSize: 1,
    maxSlots: 25,
    itemIds: keyItemIds,
  },
  HMS: {
    id: "HMS",
    name: "HMs",
    slotSize: 1,
    maxSlots: 7,
    itemIds: hmItemIds,
  },
  TMS: {
    id: "TMS",
    name: "TMs",
    slotSize: 99,
    maxSlots: 50,
    itemIds: tmItemIds,
  },
  REGULAR_ITEMS: {
    id: "REGULAR_ITEMS",
    name: "Items",
    slotSize: 99,
    maxSlots: 20,
    itemIds: regularItemIds,
  },
  BALLS: {
    id: "BALLS",
    name: "Balls",
    slotSize: 99,
    maxSlots: 12,
    itemIds: ballItemIds,
  },
} as const satisfies IdMap<ItemCategoryId, ItemCategory<ItemCategoryId, ItemId, number>>