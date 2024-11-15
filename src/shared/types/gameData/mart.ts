import type { ItemId } from "@shared/types/gameDataIds/items"
import type { MartGroupId } from "@shared/types/gameDataIds/martGroups"
import type { MartId } from "@shared/types/gameDataIds/marts"

export type Mart = {
  id: MartId
  groupId: MartGroupId
  items: ItemId[]
}