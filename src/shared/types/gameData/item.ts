import type { ItemId } from "@shared/types/gameDataIds/items"
import type { ItemType } from "@shared/types/gameDataIds/itemTypes"

export type Item = {
  id: ItemId,
  type: ItemType,
  hexId: string, // TODO: Change This to a numeric id
  name: string,
}

export type ItemCategory = {
  id: string,
  name: string,
  slotSize: number,
  maxSlots: number,
  items: Item[],
}