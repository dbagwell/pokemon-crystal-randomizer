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
  HIDDEN_ITEMS: {
    id: "HIDDEN_ITEMS",
    name: "Hidden Items",
  },
}