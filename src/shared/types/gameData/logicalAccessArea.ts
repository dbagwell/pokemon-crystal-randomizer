import type { AccessRequirement } from "@shared/types/gameData/warp"
import type { LogicalAccessAreaId } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import type { WarpId } from "@shared/types/gameDataIds/warps"

export type LogicalAccessArea = {
  id: LogicalAccessAreaId
  accessOptions: LogicalAreaAccessOption[]
}

export type LogicalAreaAccessOption =
  | WarpId
  | LogicalAccessAreaId
  | AccessRequirement[]