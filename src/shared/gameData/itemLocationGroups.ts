import type { ItemLocationGroup } from "@shared/types/gameData/itemLocationGroup"
import type { ItemLocationGroupId } from "@shared/types/gameDataIds/itemLocationGroups"

export const itemLocationGroupsMap: IdMap<ItemLocationGroupId, ItemLocationGroup> = {
  REGULAR_ITEM_BALLS: {
    id: "REGULAR_ITEM_BALLS",
    name: "Regular Item Balls",
  },
  TM_ITEM_BALLS: {
    id: "TM_ITEM_BALLS",
    name: "TM Item Balls",
  },
  REGULAR_HIDDEN_ITEMS: {
    id: "REGULAR_HIDDEN_ITEMS",
    name: "Regular Hidden Items",
  },
  REGULAR_GIFTS: {
    id: "REGULAR_GIFTS",
    name: "Regular Gifts",
  },
  TM_GIFTS: {
    id: "TM_GIFTS",
    name: "TM Gifts",
  },
  HMS: {
    id: "HMS",
    name: "HMs",
  },
  KEY_ITEMS: {
    id: "KEY_ITEMS",
    name: "Key Items",
  },
  MENU_ITEMS: {
    id: "MENU_ITEMS",
    name: "Menu Items",
  },
  BADGES: {
    id: "BADGES",
    name: "Badges",
  },
}