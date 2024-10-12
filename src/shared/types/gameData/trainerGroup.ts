import type { TrainerClassId } from "@shared/types/gameDataIds/trainerClasses"
import type { TrainerGroupId } from "@shared/types/gameDataIds/trainerGroups"

export type TrainerGroup = {
  id: TrainerGroupId
  classId: TrainerClassId
}