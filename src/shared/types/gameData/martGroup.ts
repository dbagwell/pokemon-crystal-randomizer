import type { MartGroupId } from "@shared/types/gameDataIds/martGroups"
import type { MartId } from "@shared/types/gameDataIds/marts"

export type MartGroup = {
  id: MartGroupId
  primaryMartId: MartId
}