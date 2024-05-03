import type { ItemCategory } from "@shared/types/gameData/itemCategory"
import type { ItemCategoryId } from "@shared/types/gameDataIds/itemCategories"

export const itemCategoriesMap: IdMap<ItemCategoryId, ItemCategory> = {
  MENU_ITEMS: {
    id: "MENU_ITEMS",
    name: "Menu Items",
    slotSize: 1,
    maxSlots: 16,
  },
  BADGES: {
    id: "BADGES",
    name: "Badges",
    slotSize: 1,
    maxSlots: 16,
  },
  KEY_ITEMS: {
    id: "KEY_ITEMS",
    name: "Key Items",
    slotSize: 1,
    maxSlots: 25,
  },
  HMS: {
    id: "HMS",
    name: "HMs",
    slotSize: 1,
    maxSlots: 7,
  },
  TMS: {
    id: "TMS",
    name: "TMs",
    slotSize: 99,
    maxSlots: 50,
  },
  REGULAR_ITEMS: {
    id: "REGULAR_ITEMS",
    name: "Items",
    slotSize: 99,
    maxSlots: 20,
  },
  BALLS: {
    id: "BALLS",
    name: "Balls",
    slotSize: 99,
    maxSlots: 12,
  },
}