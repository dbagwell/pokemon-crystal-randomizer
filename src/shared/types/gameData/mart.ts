import type { AccessRequirement } from "@shared/types/gameData/warp"
import type { ItemId } from "@shared/types/gameDataIds/items"
import type { LogicalAccessAreaId } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import type { MartGroupId } from "@shared/types/gameDataIds/martGroups"
import type { MartId } from "@shared/types/gameDataIds/marts"

export type Mart = {
  id: MartId
  groupId: MartGroupId
  areaId: LogicalAccessAreaId
  items: ItemId[]
  accessRequirements?: AccessRequirement[]
}