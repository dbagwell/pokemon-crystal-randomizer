import type { AccessRequirement } from "@shared/types/gameData/warp"
import type { EventFlagId } from "@shared/types/gameDataIds/eventFlags"
import type { LogicalAccessAreaId } from "@shared/types/gameDataIds/logicalAccessAreaIds"
import type { LogicalEventId } from "@shared/types/gameDataIds/logicalEvents"

export type LogicalEvent = {
  id: LogicalEventId
  areaId: LogicalAccessAreaId
  accessRequirements?: AccessRequirement[]
} & ({
  eventFlagId: EventFlagId
  inverseFlag?: true
} | {
  eventFlagId?: undefined
  engineFlagId: EngineFlagId
})

export type EngineFlagId = "GOLDENROD_FLYPOINT" | "OLIVINE_FLYPOINT"